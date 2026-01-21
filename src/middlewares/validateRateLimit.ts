import type { Next, Context } from 'hono';
import { IntegrationService } from '../services/integration.service.js';
import { Logger } from '../logger/index.js';
import { hashChatId, generateUniqueId } from '../utils/index.js';

export const validateRateLimit = async (c: Context, next: Next) => {
  const { chatId } = await c.req.json();

  if (!chatId) {
    const requestId = generateUniqueId(true);
    Logger.errorLog({ chatId: Number(requestId), message: 'Missing chatId so status cannot be validated' });
    return c.json({ error: 'Missing chat id' }, 400);
  }
  const integration = await IntegrationService.getIntegration(Number(chatId));
  if (!integration) {
    const requestId = generateUniqueId(false);
    const hashedChatId = hashChatId(Number(chatId));
    Logger.errorLog({ chatId: Number(requestId), message: `Integration not found, chatId: ${hashedChatId}` });
    return c.json({ error: 'Integration not found' }, 404);
  }
  if (integration.rateLimit === 0) {
    const requestId = generateUniqueId(false);
    const hashedChatId = hashChatId(Number(chatId));
    Logger.errorLog({
      chatId: Number(requestId),
      message: `Integration rate limit is 0, chatId: ${hashedChatId}`
    });
    return c.json({ error: 'Integration rate limit is 0. Wait until tomorrow to send alerts again' }, 403);
  }
  await next();
};
