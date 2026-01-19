import crypto from 'crypto';

export const createTokenHash = (chatId: number, scope: string) => {
  return crypto.createHash('sha256').update(`${chatId}-${scope}`).digest('hex');
};

export const validateTokenHash = (chatId: number, scope: string, tokenHash: string) => {
  return createTokenHash(chatId, scope) === tokenHash;
};
