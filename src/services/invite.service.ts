import { IntegrationInvite, Integration } from '../db/models.js';
import { generateRandomCode, hashCode, verifyCodeHash } from '../utils/index.js';

export class InviteService {
  static async createInvite(
    chatId: number | string,
    codeSize?: number | null,
    expirationTime?: number | null,
    maxUses?: number
  ) {
    try {
      const integration = await Integration.findOne({ where: { chatId } });
      if (!integration) {
        throw new Error('Integration not found');
      }

      if (expirationTime) {
        const expiration = new Date(Date.now() + expirationTime * 60 * 1000);

        const code = generateRandomCode(codeSize || 3);

        console.log('Código', code, 'Expiración', expiration);

        const invite = await IntegrationInvite.create({
          integrationId: integration?.dataValues?.id,
          code: hashCode(code),
          createdByChatId: chatId,
          expiresAt: expiration,
          maxUses: maxUses || null
        });

        return invite?.dataValues;
      } else {
        const code = generateRandomCode(codeSize || 3);

        const invite = await IntegrationInvite.create({
          integrationId: integration?.dataValues?.id,
          code: hashCode(code),
          createdByChatId: chatId,
          maxUses: maxUses || null
        });
        return { data: invite?.dataValues, code };
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  static async validateInvite(code: string, chatId: number | string, isOwner?: boolean) {
    try {
      const codeHash = hashCode(code);
      console.log('Searching for code:', codeHash);
      const invite = await IntegrationInvite.findOne({ where: { code: codeHash } });

      if (!invite) {
        return { valid: false, message: 'Invalid code' };
      }

      const inviteData = invite?.dataValues;
      console.log('Invite found:', inviteData);

      if (inviteData?.expiresAt && inviteData?.expiresAt < new Date()) {
        console.log('Code expired');
        return { valid: false, message: 'Code expired' };
      }

      if (inviteData?.maxUses && inviteData?.uses >= inviteData?.maxUses) {
        console.log('Code used maximum times');
        return { valid: false, message: 'Code used maximum times' };
      }

      const integration = await Integration.findOne({ where: { id: inviteData?.integrationId } });
      if (!integration) {
        console.log('Integration not found');
        return { valid: false, message: 'Integration not found' };
      }

      const integrationData = integration?.dataValues;
      console.log('Integration data', integrationData);

      // if (integrationData?.chatId === chatId) {
      //   return { valid: false, message: 'You are already in this integration' };
      // }

      return { valid: true, message: 'Code valid', inviteData: inviteData };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        throw new Error(error.message);
      }
    }
  }
}
