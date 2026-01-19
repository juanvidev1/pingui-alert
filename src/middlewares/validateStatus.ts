import type { Next, Context } from 'hono';
import { IntegrationService } from '../services/integration.service.js';

export const validateStatus = async (c: Context, next: Next) => {
  const { chatId } = await c.req.json();
  console.log('On status middleware', chatId);
  const integration = await IntegrationService.getIntegration(Number(chatId));
  if (!integration) {
    return c.json({ error: 'Integration not found' }, 404);
  }
  if (integration.status !== 'active') {
    return c.json({ error: 'Integration not active' }, 403);
  }
  await next();
};
