import { IntegrationService } from '../services/integration.service.js';
import type { BotContext } from '../bot/context.js';

export const validateIntegrationOwner = async (ctx: BotContext, next: any): Promise<void> => {
  try {
    const chatId = ctx?.update?.message?.from?.id;

    if (!chatId) {
      throw new Error('Chat ID not found');
    }

    const isIntegrationOwner = await IntegrationService.validateIntegrationOwner(chatId);

    if (!isIntegrationOwner) {
      if (!ctx?.auth) {
        ctx.auth = {
          isOwner: false,
          role: 'member'
        };
      } else {
        ctx.auth.isOwner = false;
        ctx.auth.role = 'member';
      }
      throw new Error('You must be an owner of the integration to use this command');
    }

    if (!ctx?.auth) {
      ctx.auth = {
        isOwner: isIntegrationOwner,
        role: isIntegrationOwner ? 'owner' : 'member'
      };
    } else {
      ctx.auth.isOwner = isIntegrationOwner;
      ctx.auth.role = isIntegrationOwner ? 'owner' : 'member';
    }

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('You must be an owner')) {
        ctx.reply(error.message);
        return;
      }
    }
    console.error(error);
    ctx.reply('You are not allowed to perform this action');
    return;
  }
};
