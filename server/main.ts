import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { verifyToken } from './middelware/verifyToken.ts';
import { Bot } from 'grammy';
import { config } from 'dotenv';
import { UserService } from './db/services.ts';
import { Token, Auth } from '../utils/index.ts';

import { honoRouter, docsRouter, userDataRouter, loginPageRouter, loginRouter } from './router/index.ts';
import { initDb } from './db/config.ts';

// Load environment variables
config();

const app = new Hono();
app.use('*', prettyJSON());

// ============== Website section (static files) ==============
app.route('/', honoRouter);
app.route('/', docsRouter);
app.route('/', loginPageRouter);
app.route('/', userDataRouter);
app.route('/', loginRouter);

// ============== Bot section ==============
// Initialize Bot
const bot = new Bot(Deno.env.get('BOT_TOKEN') || '');

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

app.get('/users', verifyToken, async (c) => {
  const users = await UserService.getAllUsersV2();
  return c.json(users);
});

app.get('/user', verifyToken, async (c) => {
  const chatId = c.req.header('chatId') || '';
  const user = await UserService.getUserByChatId(Number(chatId));
  return c.json(user);
});

app.post('/alert', verifyToken, async (c) => {
  const body = await c.req.json();
  const alertMessage = body.alert;

  try {
    const users = await UserService.getAllUsersV2();
    const results: {
      chatId: number | string;
      message: string;
      success: boolean;
      error?: string;
      remainingAlerts?: number;
    }[] = [];
    for (const user of users) {
      try {
        const updatedUser = await UserService.updateUserAlertsRemainingV2(user.chatId, user.alertsRemaining - 1);
        if (updatedUser.alertsRemaining <= 0) {
          bot.api.sendMessage(
            user.chatId,
            'You have no remaining alerts today. Tomorrow you will have 10 free alerts again.'
          );
          results.push({
            chatId: user.chatId,
            message: 'User alerts quota exceeded.',
            success: false,
            error: 'No remaining alerts',
            remainingAlerts: updatedUser.alertsRemaining
          });
          continue;
        }
        bot.api.sendMessage(user.chatId, alertMessage);
        results.push({
          chatId: user.chatId,
          message: alertMessage,
          success: true,
          remainingAlerts: updatedUser.alertsRemaining
        });
      } catch (error) {
        console.error(`Failed to send to ${user.chatId}:`, error);
        results.push({
          chatId: user.chatId,
          message: alertMessage,
          success: false,
          error: String(error),
          remainingAlerts: user.alertsRemaining
        });
      }
    }
    return c.json({
      message: 'Alert processing complete',
      results
    });
  } catch (error) {
    console.error('Failed to process alert:', error);
    return c.json({
      message: 'Failed to process alert',
      error: String(error)
    });
  }
});

app.post('/reset', verifyToken, async (c) => {
  const chatId = c.req.header('chatId') || '';
  const result = await UserService.resetAlertsQuotaV2(chatId);
  return c.json({ message: 'Alerts quota reset', result });
});

Deno.serve(app.fetch);
