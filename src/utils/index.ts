import crypto from 'crypto';

/**
 * Creates a hash for a given chatId and scope
 * This, is just in case you need it. In actual production, we use jwt tokens.
 * @param chatId The chatId to create the hash for
 * @param scope The scope to create the hash for
 * @returns The hash of the chatId and scope
 */
export const createTokenHash = (chatId: number, scope: string) => {
  return crypto.createHash('sha256').update(`${chatId}-${scope}`).digest('hex');
};

export const validateTokenHash = (chatId: number, scope: string, tokenHash: string) => {
  return createTokenHash(chatId, scope) === tokenHash;
};

export const hashChatId = (chatId: number) => {
  return crypto.createHash('sha256').update(`${chatId}`).digest('hex');
};

export const generateUniqueId = (number?: boolean) => {
  if (number) {
    return crypto.randomInt(1000000);
  }
  return crypto.randomBytes(16).toString('hex');
};
