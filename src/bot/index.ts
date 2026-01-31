import { Bot } from 'grammy';
import config from '../config/index.js';
import { IntegrationService } from '../services/integration.service.js';
import { MetricsService } from '../services/metrics.service.js';

const bot = new Bot(config.botToken || '');
const maxAlerts = config.maxAlerts || 10;

bot.command('start', async (ctx) => {
  try {
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
  } catch (error) {
    console.error(error);
    await ctx.reply('Error registering integration');
  }
});

bot.command('help', async (ctx) => {
  await ctx.reply('You can see the documentation at https://pingui-alert.dev/docs');
});

bot.command('temporal_token', async (ctx) => {
  try {
    const chatId = ctx.chat.id;

    const tempTokenData = await IntegrationService.createTemporalToken(chatId);

    await ctx.reply(`This is your temporal token, it will expire in 5 minutes: ${tempTokenData}`);
  } catch (error) {
    console.error(error);
    await MetricsService.incrementErrorsCount();
    await ctx.reply('Error creating temporal token');
  }
});

bot.command('get_me', async (ctx) => {
  try {
    const chatId = ctx.chat.id;

    await ctx.reply(`Your user id is: ${chatId}`);
  } catch (error) {
    console.error(error);
    await MetricsService.incrementErrorsCount();
    await ctx.reply('Error getting user id');
  }
});

export default bot;
