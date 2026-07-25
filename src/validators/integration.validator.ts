import * as z from 'zod';

export const integrationValidator = z.object({
  chatId: z.number().positive(),
  tokenHash: z.string(),
  scope: z.string(),
  rateLimit: z.number().positive(),
  status: z.enum(['active', 'revoked', 'pending']),
  deliveryMode: z.enum(['PERSONAL', 'CHANNEL'])
});
