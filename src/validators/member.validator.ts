import * as z from 'zod';

export const memberActiveUpdateSchema = z.object({
  chatId: z.number('It must be a number').positive('The value must be positive.'),
  integrationId: z.number('It must be a number').positive('The value must be positive.'),
  activeMember: z.boolean('It must be a boolean')
});
