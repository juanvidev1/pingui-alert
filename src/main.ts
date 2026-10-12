import app from './api/index.js';
import { serve } from '@hono/node-server';
import bot from './bot/index.js';
import config from './config/index.js';
import { Logger } from './logger/index.js';
import { initDB } from './db/init.js';
import { startQueueWorker } from './services/queue.service.js';
import { initializeJobs } from './jobs/index.js';

process.on('unhandledRejection', (reason) => {
  Logger.errorLog({
    chatId: 0,
    message: `Unhandled rejection: ${
      reason instanceof Error ? reason.stack || reason.message : String(reason)
    }`
  });
});

console.log('Starting application...');
initDB();

startQueueWorker();
initializeJobs();
bot.start();

serve({ fetch: app.fetch, port: config.port });
