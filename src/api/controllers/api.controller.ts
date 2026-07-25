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

    const notified = await enqueueAlert({
      id: generateUniqueId(false),
      chatId: data.chatId,
      title: data.title || 'Alert',
      message: data.message
    });

    if (!notified) {
      Logger.errorLog({ chatId: Number(data.chatId), message: `Error sending alert ${requestId}` });
      return c.json({ error: 'Error sending alert' }, 500);
    }

    await MetricsService.incrementSentAlertsCount(Number(data.chatId));

    return c.json({ message: 'Alert enqueued' });
  }

  static async alertMembers(c: Context) {
    const { chatId, message, title }: any = await c.req.json();

    const requestId = generateUniqueId(false);

    if (!chatId) {
      Logger.errorLog({ chatId: Number(requestId), message: 'Missing required fields on alertMembers endpoint' });
      throw new Error('Chat ID is mandatory');
    }

    try {
      // chatId is the owner chatId
      const members = await IntegrationService.getIntegrationMembers(undefined, Number(chatId));
      if (!members) {
        throw new Error('Members not found');
      }

      const results = await Promise.all(
        members.members.map(async (member) => {
          Logger.infoLog({
            chatId: Number(member.chatId),
            message: 'Sending alert to member'
          });

          if (!member.activeMember) {
            Logger.debugLog({
              chatId: member.chatId,
              message: 'Member is not active. Not notified'
            });

            return false;
          }

          return await enqueueAlert({
            id: requestId,
            chatId: member.chatId,
            title: title || 'Alert',
            message
          });
        })
      );

      const notifiedMembersCount = results.filter((result) => result === true).length;

      return c.json({
        message: 'Alert enqueued to members',
        succesNotifications: notifiedMembersCount,
        totalMembers: members?.members.length
      });
    } catch (error) {
      if (error instanceof Error) {
        Logger.errorLog({ chatId: Number(requestId), message: `Error sending alert to members: ${error.message}` });
        c.json({ error: error.message }, 500);
      }
    }
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

  static async getIntegrationMembers(c: Context) {
    try {
      const integrationId = c.req.query('integrationId');
      const chatId = c.req.query('chatId');

      if (!integrationId && !chatId) {
        throw new Error('Missing required fields on getIntegrationMembers endpoint');
      }

      if (!chatId) {
        const integrationMembers = await IntegrationService.getIntegrationMembers(Number(integrationId));
        return c.json({ integrationMembers });
      } else if (!integrationId) {
        const integrationMembers = await IntegrationService.getIntegrationMembers(undefined, Number(chatId));
        return c.json({ integrationMembers });
      } else {
        return c.json({ integrationMembers: [] });
      }
    } catch (error) {
      const requestId = generateUniqueId(false);
      if (error instanceof Error) {
        Logger.errorLog({
          chatId: Number(requestId),
          message: `Error on getIntegrationMembers endpoint: ${error.message}`
        });
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: 'Missing required fields' }, 400);
    }
  }

  static async validateIntegrationOwner(c: Context) {
    const chatId = Number(c.req.param('chatId'));
    if (!chatId) {
      return c.json({ error: 'Chat id is missing' }, 400);
    }
    return c.json({ valid: await IntegrationService.validateIntegrationOwner(chatId) });
  }

  static async changeActiveMember(c: Context) {
    const { chatId, integrationId, activeMember }: any = await c.req.json();
    if (!chatId || !integrationId) {
      return c.json({ error: 'Chat id and integration id are required' }, 400);
    }

    if (Array.isArray(chatId)) {
      const result = await IntegrationService.changeMemberStatus(chatId, false, integrationId);
      if (!result) {
        const chatIdString = chatId.join(' ');
        Logger.errorLog({ chatId: Number(chatIdString), message: 'Error changing member status' });
      }
      return c.json({ changed: result });
    }

    const result = await IntegrationService.changeMemberStatus(Number(chatId), activeMember, integrationId);

    if (!result) {
      Logger.errorLog({ chatId, message: 'Error changing member status' });
    }

    return c.json({ changed: result });
  }
}
