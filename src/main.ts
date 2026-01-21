import app from './api/index.js';
import { serve } from '@hono/node-server';
import bot from './bot/index.js';
import { initDB } from './db/init.js';
import { startQueueWorker } from './services/queue.service.js';

initDB();

startQueueWorker();
bot.start();

serve({ fetch: app.fetch, port: 3035 });
