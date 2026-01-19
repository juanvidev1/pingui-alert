import { Bot } from 'grammy';
import config from '../config/index.js';
import { IntegrationService } from '../services/integration.service.js';

const bot = new Bot(config.botToken || '');
const maxAlerts = config.maxAlerts || 10;

bot.command('start', async (ctx) => {
  const chatId = ctx.chat.id;

  const integration = await IntegrationService.getIntegration(chatId);

  if (integration) {
    await ctx.reply('You are already registered');
    return;
  }

  const firstIntegration = await IntegrationService.registerUserIntegration(chatId);

  if (!firstIntegration) {
    await ctx.reply('Error registering integration');
    return;
  }

  await ctx.reply('You are now able to create an integration using your temporal token');
});

bot.command('help', async (ctx) => {
  await ctx.reply('Help message');
});

bot.command('temporal_token', async (ctx) => {
  const chatId = ctx.chat.id;

  const tempTokenData = await IntegrationService.createTemporalToken(chatId);

  await ctx.reply(`This is your temporal token, it will expire in 5 minutes: ${tempTokenData}`);
});

bot.command('get_me', async (ctx) => {
  await ctx.reply(`Your user id is: ${ctx.chat.id}`);
});

export default bot;
