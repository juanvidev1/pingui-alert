import type { Context } from 'hono';
import { generateUniqueId } from '../../utils/index.js';
import { Logger } from '../../logger/index.js';
import { IntegrationService } from '../../services/integration.service.js';
import { MetricsService } from '../../services/metrics.service.js';
import bot from '../../bot/index.js';
import { enqueueAlert } from '../../services/queue.service.js';
import { hashChatId } from '../../utils/index.js';

export class ApiController {
  static async createTemporalToken(c: Context) {
    const { chatId } = await c.req.json();

    if (!chatId) {
      const requestId = generateUniqueId(true);
      Logger.errorLog({ chatId: Number(requestId), message: 'Missing required fields on temporal-token endpoint' });
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const tempTokenData = await IntegrationService.createTemporalToken(chatId);

    return c.json({ token: tempTokenData });
  }

  static async alert(c: Context) {
    const data: any = await c.req.json();

    const requestId = generateUniqueId(true);
    if (!data.message || !data.chatId) {
      Logger.errorLog({ chatId: Number(requestId), message: 'Missing required fields' });
      bot.api.sendMessage(
        data.chatId,
        'There was a problem sendig the alert because all the required fields are not present. See the api reference for more information'
      );

      return c.json({ error: 'Missing required fields' }, 400);
    }

    const integration = await IntegrationService.changeRateLimit(data.chatId);

    if (!integration) {
      Logger.errorLog({ chatId: Number(requestId), message: 'Integration not found' });
      bot.api.sendMessage(data.chatId, 'There was a problem sendig the alert because the integration was not found');
      return c.json({ error: 'Integration not found' }, 404);
    }

    // bot.api.sendMessage(data.chatId, `${data.title}\n${data.message}`);

    await enqueueAlert({
      id: generateUniqueId(false),
      chatId: data.chatId,
      title: data.title || 'Alert',
      message: data.message
    });

    await MetricsService.incrementSentAlertsCount();

    return c.json({ message: 'Alert enqueued' });
  }

  static async createIntegration(c: Context) {
    const { chatId, scope }: any = await c.req.json();

    if (!chatId || !scope) {
      const requestId = generateUniqueId(false);

      if (chatId) {
        const hashedChatId = hashChatId(chatId);
        Logger.errorLog({
          chatId: Number(requestId),
          message: `Missing required fields on createIntegration endpoint, chatId: ${hashedChatId}`
        });
      }

      Logger.errorLog({
        chatId: Number(requestId),
        message: `Missing required fields on createIntegration endpoint`
      });

      return c.json({ error: 'Missing required fields' }, 400);
    }

    const existingIntegration = await IntegrationService.getIntegration(chatId);

    if (
      existingIntegration &&
      existingIntegration?.status === 'active' &&
      existingIntegration?.scope !== 'temporal-token'
    ) {
      const requestId = generateUniqueId(false);
      const hashedChatId = hashChatId(chatId);
      Logger.errorLog({ chatId: Number(requestId), message: `Integration already exists, chatId: ${hashedChatId}` });
      return c.json({ error: 'Integration already exists' }, 400);
    }

    const integration = await IntegrationService.createIntegration(chatId, scope, 10);

    return c.json({ integration });
  }

  static async integrations(c: Context) {
    const chatId = c.req.param('chatId');

    if (!chatId) {
      const requestId = generateUniqueId(true);
      Logger.errorLog({ chatId: Number(requestId), message: `Missing required fields on integrations endpoint` });
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const integrations = await IntegrationService.getIntegration(Number(chatId));

    if (!integrations) {
      const requestId = generateUniqueId(false);
      const hashedChatId = hashChatId(Number(chatId));
      Logger.errorLog({ chatId: Number(requestId), message: `Integration not found, chatId: ${hashedChatId}` });
      return c.json({ error: 'Integration not found' }, 404);
    }

    return c.json({ integrations });
  }

  static async updateRateLimit(c: Context) {
    const { chatId, rateLimit }: any = await c.req.json();

    if (!chatId) {
      const requestId = generateUniqueId(true);
      Logger.errorLog({ chatId: Number(requestId), message: `Missing required fields on updateRateLimit endpoint` });
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const integration = await IntegrationService.changeRateLimit(Number(chatId), Number(rateLimit));
    return c.json({ integration });
  }

  static async revokeIntegration(c: Context) {
    const { chatId }: any = await c.req.json();

    if (!chatId) {
      const requestId = generateUniqueId(true);
      Logger.errorLog({ chatId: Number(requestId), message: `Missing required fields on revokeIntegration endpoint` });
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const integration = await IntegrationService.revokeIntegration(Number(chatId));

    if (!integration) {
      const requestId = generateUniqueId(false);
      const hashedChatId = hashChatId(Number(chatId));
      Logger.errorLog({ chatId: Number(requestId), message: `Integration not found, chatId: ${chatId}` });
      return c.json({ error: 'Integration not found' }, 404);
    }

    return c.json({ integration });
  }
}
