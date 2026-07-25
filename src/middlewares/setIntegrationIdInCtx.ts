import { IntegrationService } from '../services/integration.service';
import type { BotContext } from '../bot/context';
import { Logger } from '../logger';

export const setIntegrationIdInCtx = async (ctx: BotContext, next: any): Promise<void> => {
  Logger.infoLog({ chatId: ctx.chat?.id || 0, message: `Starting search of integration with chat ${ctx?.chat?.id}` });
  try {
    if (ctx && ctx.chat && ctx.chat.id) {
      const integration = await IntegrationService.getIntegration(ctx.chat.id);

      if (!ctx.auth) {
        ctx.auth = {};
      }

      ctx.auth.integration = integration || null;
    }
    await next();
  } catch (error) {
    if (error instanceof Error) {
      Logger.errorLog({ chatId: ctx.chat?.id || 0, message: error.message + ' - ' + ctx?.chat?.id });
      await ctx.reply(error.message);
      return;
    }
  }
};
