import { Hono } from 'hono';

import { prettyJSON } from 'hono/pretty-json';
import { verifyToken } from './middelware/verifyToken.ts';
import { Bot } from 'grammy';
import { config } from 'dotenv';
import { UserService } from './db/services.ts';
import { Token, Auth } from '../utils/index.ts';
import { ApiController } from './controllers/api.controller.ts';

import { honoRouter, docsRouter, userDataRouter, loginPageRouter, loginRouter, exampleRouter } from './router/index.ts';
import { initDb } from './db/config.ts';

// Load environment variables
config();

import { cors } from 'hono/cors';

const app = new Hono();
app.use('*', prettyJSON());
app.use(
  '*',
  cors({
    origin: 'http://localhost:5173',
    allowHeaders: ['Content-Type', 'Authorization', 'chatId'],
    allowMethods: ['POST', 'GET', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true
  })
);

// ============== Website section (static files) ==============
app.route('/', honoRouter);
app.route('/', docsRouter);
app.route('/', loginPageRouter);
app.route('/', userDataRouter);
app.route('/', loginRouter);
app.route('/', exampleRouter);

// ============== Bot section ==============
// Initialize Bot
export const bot = new Bot(Deno.env.get('BOT_TOKEN') || '');

// ============== Bot commands ==============
// User registration mode
bot.command('start', async (ctx) => {
  const chatId = ctx.chat.id;

  const user = await UserService.getUserByChatId(chatId);
  if (user && user.success) {
    await ctx.reply('You are already subscribed to alerts.');
    return;
  }

  const userName = ctx.from?.username || '';
  const tempPassword = Auth.generateTempPassword();
  const secret = Token.generateSecret({ chatId, userName, alertsRemaining: 10 });
  try {
    await UserService.createUserV2(userName, chatId, secret, tempPassword);
    await ctx.reply("Hello! I'm Pingui Alert. You are now subscribed to alerts.");
    await ctx.reply(`Your temporary password is: ${tempPassword}`);
  } catch (error) {
    console.log(error);
    await ctx.reply('There was an error subscribing you to alerts. Please try again later.');
  }
});

// Start the bot
bot.start();

// Initialize database
initDb();

// ============== API section ==============

app.get('/users', verifyToken, ApiController.users);

app.get('/user/:chatId', verifyToken, ApiController.user);

app.post('/alert', verifyToken, ApiController.alert);

app.post('/reset', verifyToken, async (c) => {
  const chatId = c.req.header('chatId') || '';
  const result = await UserService.resetAlertsQuotaV2(chatId);
  return c.json({ message: 'Alerts quota reset', result });
});

app.patch('/update', verifyToken, ApiController.settings);

app.patch('/update-password', verifyToken, ApiController.updatePassword);

Deno.serve(app.fetch);
