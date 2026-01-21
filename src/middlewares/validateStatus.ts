import type { Next, Context } from 'hono';
import { IntegrationService } from '../services/integration.service.js';
import { Logger } from '../logger/index.js';

export const validateStatus = async (c: Context, next: Next) => {
  const { chatId } = await c.req.json();

  if (!chatId) {
    Logger.errorLog({ chatId: chatId, message: 'Missing chatId so status cannot be validated' });
    return c.json({ error: 'Missing chat id' }, 400);
  }
  const integration = await IntegrationService.getIntegration(Number(chatId));
  if (!integration) {
    Logger.errorLog({ chatId: chatId, message: 'Integration not found' });
    return c.json({ error: 'Integration not found' }, 404);
  }
  if (integration.status !== 'active') {
    Logger.errorLog({ chatId: chatId, message: 'Integration not active' });
    return c.json({ error: 'Integration not active' }, 403);
  }
  await next();
};
