import { Integration } from '../db/models.js';
import jsonwebtoken from 'jsonwebtoken';

export class IntegrationService {
  static async registerUserIntegration(chatId: number, tokenHash?: string) {
    try {
      const fiirstIntegration = await Integration.create({
        chatId,
        tokenHash: tokenHash || '',
        scope: '',
        rateLimit: 10,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      if (!fiirstIntegration) {
        throw new Error('Integration not created');
      }

      return fiirstIntegration?.dataValues;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async createIntegration(chatId: number, scope: string, rateLimit?: number) {
    try {
      if (!chatId || !scope) {
        throw new Error('Chat ID and scope are required');
      }

      const integration = await Integration.findOne({ where: { chatId } });

      if (!integration) {
        throw new Error('Chat ID not registered');
      }

      const tokenHash = jsonwebtoken.sign({ chatId, scope, status: 'active' }, process.env.JWT_SECRET as string);

      await integration.update({
        tokenHash,
        scope,
        rateLimit: rateLimit || 10,
        status: 'active',
        updatedAt: new Date()
      });

      return integration?.dataValues;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async createTemporalToken(chatId: number) {
    try {
      const tokenHash = jsonwebtoken.sign(
        { chatId, scope: 'temporal-token', status: 'active' },
        process.env.JWT_SECRET as string,
        { expiresIn: '5m' }
      );

      const integration = await this.getIntegration(chatId);

      if (!integration) {
        throw new Error('Integration not found');
      }

      const temporalIntegration = await integration.update({
        tokenHash,
        scope: 'temporal-token',
        rateLimit: 10,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      if (!temporalIntegration) {
        throw new Error('There was an error creating the temporal token');
      }

      return temporalIntegration?.dataValues?.tokenHash;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async updateToken(chatId: number, tokenHash: string) {
    try {
      const integration = await Integration.findOne({ where: { chatId } });
      if (!integration) {
        throw new Error('Integration not found');
      }
      await integration.update({
        tokenHash,
        updatedAt: new Date()
      });
      return integration?.dataValues;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getAllUserIntegrations(chatId: number) {
    try {
      const integrations = await Integration.findAll({ where: { chatId } });

      return integrations?.map((integration) => integration.dataValues);
    } catch (error) {
      console.error(error);
      return { error: 'Integrations not found' };
    }
  }

  static async getIntegration(chatId: number) {
    try {
      console.log('On getIntegration', chatId);
      const integration = await Integration.findOne({ where: { chatId } });

      return integration?.dataValues;
    } catch (error) {
      console.error(error);
      return { error: 'Integration not found' };
    }
  }

  static async changeRateLimit(chatId: number, rateLimit?: number) {
    try {
      const integration = await Integration.findOne({ where: { chatId } });
      if (!integration) {
        throw new Error('Integration not found');
      }
      await integration.update({
        rateLimit: rateLimit || integration.dataValues.rateLimit - 1,
        updatedAt: new Date()
      });
      return integration?.dataValues;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async changeStatus(chatId: number, status: string) {
    try {
      const integration = await Integration.findOne({ where: { chatId } });
      if (!integration) {
        throw new Error('Integration not found');
      }
      await integration.update({
        status,
        updatedAt: new Date()
      });
      return integration?.dataValues;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async revokeIntegration(chatId: number) {
    try {
      const integration = await Integration.findOne({ where: { chatId } });
      if (!integration) {
        return { error: 'Integration not found' };
      }
      await integration.update({
        status: 'inactive',
        updatedAt: new Date()
      });
      return { success: true, message: 'Integration revoked', revokedAt: integration?.dataValues?.updatedAt };
    } catch (error) {
      console.error(error);
      return { error: 'Integration not found' };
    }
  }
}
