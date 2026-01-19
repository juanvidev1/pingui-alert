import app from './api/index.js';
import { serve } from '@hono/node-server';
import bot from './bot/index.js';
import { initDB } from './db/init.js';

initDB();

bot.start();

serve({ fetch: app.fetch, port: 3035 });
