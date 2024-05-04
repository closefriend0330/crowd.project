import { z } from 'zod';

import { userDataSchema } from '@/lib/types';

// client messages sent FROM a client TO the server

// client has updated local state
export const clientMessageUpdateUserDataSchema = z.object({
  type: z.literal('updateUserData'),
  userId: z.string(),
  data: userDataSchema.partial(),
});
export type ClientMessageUpdateUserData = z.infer<typeof clientMessageUpdateUserDataSchema>;

export const clientMessageSchema = clientMessageUpdateUserDataSchema;
export type ClientMessage = z.infer<typeof clientMessageSchema>;
