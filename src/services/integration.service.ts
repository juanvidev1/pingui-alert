import { Integration, IntegrationMember } from '../db/models.js';
import { Logger } from '../logger/index.js';
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

      const integration = await Integration.findOne({ where: { chatId } });

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

      if (rateLimit && rateLimit > 10) {
        throw new Error('Rate limit cannot be greater than 10 on public bot');
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

  static async addMemberToIntegration(
    integrationId: number | null,
    memberChatId: number,
    ownerChatId?: number | string
  ) {
    console.log('Parameters received:', { integrationId, memberChatId, ownerChatId });
    Logger.debugLog({
      chatId: memberChatId,
      message: `Starting process for member ${memberChatId} in integration ${integrationId}`
    });

    try {
      let integration = null;

      if (integrationId !== null) {
        console.log('Integration id');
        integration = await Integration.findOne({
          where: { id: integrationId }
        });
      } else if (ownerChatId !== undefined) {
        console.log('Owner chatId');
        integration = await Integration.findOne({
          where: { chatId: ownerChatId }
        });
      } else {
        console.log('Juanvi Owner query');
        integration = await Integration.findOne({
          where: { chatId: 1547430999 }
        });
      }

      if (!integration) {
        throw new Error('Integration not found');
      }

      const existingMember = await IntegrationMember.findOne({ where: { chatId: memberChatId } });

      if (existingMember) {
        throw new Error('Member already exists on this integration');
      }

      const integrationMember = await IntegrationMember.create({
        integrationId: integration?.dataValues?.id || integrationId,
        chatId: memberChatId
      });

      if (!integrationMember) {
        throw new Error('Integration member not created');
      }

      return integrationMember?.dataValues;
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error:', error.message);
        throw error;
      }
    }
  }

  static async getIntegrationMembers(integrationId?: number, ownerChatId?: number) {
    try {
      if (!integrationId && !ownerChatId) {
        throw new Error('Integration ID or Owner Chat ID is required');
      }

      if (!integrationId && ownerChatId) {
        const integrationMembers = await IntegrationMember.findAll({ where: { ownerChatId: ownerChatId.toString() } });

        if (!integrationMembers) {
          throw new Error('Integration not found');
        }
        const integrationId = integrationMembers[0]?.dataValues.integrationId;
        const members = integrationMembers?.map((member) => member.dataValues);

        if (!members || members.length === 0) {
          throw new Error('No members found for this integration');
        }
        return { members, integrationId };
      } else if (integrationId && !ownerChatId) {
        const integrationMembers = await IntegrationMember.findAll({ where: { integrationId } });

        if (!integrationMembers || integrationMembers.length === 0) {
          throw new Error('No members found for this integration');
        }

        const members = integrationMembers?.map((member) => member.dataValues);

        if (!members || members.length === 0) {
          throw new Error('No members found for this integration');
        }

        return { members, integrationId };
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async validateIntegrationOwner(chatId: string | number) {
    const integration = await Integration.findOne({ where: { chatId: Number(chatId) } });
    if (!integration) {
      return false;
    }
    return integration?.dataValues?.status === 'active';
  }

  static async removeIntegrationMember(chatId: string | number): Promise<boolean> {
    try {
      const integrationMember = await IntegrationMember.destroy({ where: { chatId: Number(chatId) } });
      return integrationMember > 0;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static async changeMemberStatus(
    chatId: number | Array<number>,
    status: boolean,
    integrationId?: number
  ): Promise<boolean> {
    try {
      if (Array.isArray(chatId)) {
        chatId.forEach(
          async (id) => await IntegrationMember.update({ activeMember: status }, { where: { chatId: id } })
        );
        return true;
      } else {
        console.log('Changing member status for chatId:', chatId, 'to status:', status);
        const integrationMember = await IntegrationMember.update(
          { activeMember: status },
          { where: { chatId: Number(chatId) } }
        );
        return integrationMember[0] > 0;
      }
    } catch (error) {
      console.error(error);
      return false;
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
