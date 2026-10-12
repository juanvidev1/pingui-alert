import { createClient } from 'redis';
import bot from '../bot/index.js';
import { Logger } from '../logger/index.js';
import { generateUniqueId } from '../utils/index.js';

const QUEUE_KEY = 'pingui:queue:alerts';
const LOCK_KEY = 'pingui:queue:processing';

const SEND_DELAY_MS = 1000; // 1 msg / segundo (safe para Telegram)
const MAX_QUEUE_SIZE = 500;
const MAX_ATTEMPTS = 3;

export interface AlertJob {
  id: string | number;
  chatId: number;
  title: string;
  message: string;
  app?: string;
  attempts?: number;
}

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

redis.on('error', (err) => {
  console.error('[redis]', err);
  Logger.errorLog({ chatId: 0, message: `Redis error: ${err.message}`, app: 'redis_queue' });
});

export async function enqueueAlert(alertJob: AlertJob) {
  try {
    const queueSize = await redis.lLen(QUEUE_KEY);

    if (queueSize >= MAX_QUEUE_SIZE) {
      Logger.errorLog({ chatId: alertJob.chatId, message: 'Queue is full', app: 'redis_queue' });
      return false;
    }

    await redis.lPush(QUEUE_KEY, JSON.stringify(alertJob));
    Logger.infoLog({ chatId: alertJob.chatId, message: 'Alert enqueued', app: 'redis_queue' });
    return true;
  } catch (error) {
    Logger.errorLog({
      chatId: alertJob.chatId,
      message: `Error enqueuing alert: ${error instanceof Error ? error.message : String(error)}`,
      app: 'redis_queue'
    });
    return false;
  }
}

/**
 * Worker simple (single consumer)
 */
export async function startQueueWorker() {
  const requestId = generateUniqueId(false);
  const date = new Date().toISOString();
  Logger.infoLog({ chatId: 0, message: `Queue worker started at ${date}`, app: 'redis_queue' });

  while (true) {
    try {
      // Lock simple para evitar doble worker
      const lock = await redis.set(LOCK_KEY, '1', {
        NX: true,
        PX: 10000
      });

      if (!lock) {
        await sleep(500);
        continue;
      }

      const jobRaw = await redis.lPop(QUEUE_KEY);

      if (!jobRaw) {
        await redis.del(LOCK_KEY);
        await sleep(500);
        continue;
      }

      const job: AlertJob = JSON.parse(jobRaw);

      try {
        const message = job.title ? `${job.title}\n${job.message}` : job.message;
        Logger.infoLog({ chatId: job.chatId, message: `Sending alert ${job.id} to telegram`, app: 'redis_queue' });
        await bot.api.sendMessage(job.chatId, message);
      } catch (err) {
        const attempts = (job.attempts ?? 0) + 1;
        console.error('[queue] telegram send failed', err);

        if (attempts < MAX_ATTEMPTS) {
          job.attempts = attempts;
          try {
            await redis.lPush(QUEUE_KEY, JSON.stringify(job));
            Logger.errorLog({
              chatId: job.chatId,
              message: `Failed to send alert ${job.id}, requeued (attempt ${attempts}/${MAX_ATTEMPTS})`,
              app: 'redis_queue'
            });
          } catch (requeueError) {
            Logger.errorLog({
              chatId: job.chatId,
              message: `Failed to requeue alert ${job.id}: ${
                requeueError instanceof Error ? requeueError.message : String(requeueError)
              }`,
              app: 'redis_queue'
            });
          }
        } else {
          Logger.errorLog({
            chatId: job.chatId,
            message: `Failed to send alert ${job.id} after ${attempts} attempts, dropping`,
            app: 'redis_queue'
          });
        }
      }

      await redis.del(LOCK_KEY);
      await sleep(SEND_DELAY_MS);
    } catch (err) {
      console.error('[queue] worker error', err);
      Logger.errorLog({ chatId: 0, message: `Queue worker error`, app: 'redis_queue' });
      await sleep(1000);
    }
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// No bloquear el arranque ni tumbar el proceso si Redis no responde:
// el cliente reintenta la conexión y los comandos se encolan.
redis.connect().catch((error) => {
  Logger.errorLog({
    chatId: 0,
    message: `Redis initial connection failed: ${error instanceof Error ? error.message : String(error)}`,
    app: 'redis_queue'
  });
});
