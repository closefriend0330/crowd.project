import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { userData } from '@/db/schema';

import { TablerIcon } from '@/statusConfig';

export type UserStatus = keyof UserStatusConfig;
export type UserSelectableStatus = Omit<UserStatus, 'offline'>;

export type UserStatusConfig = Record<
  string,
  {
    textColor: string;
    backgroundColor: string;
    icon?: TablerIcon;
    nonSelectable?: boolean;
  }
>;

const userDataSchemaOptions = {
  away: z.coerce.boolean(),
  awayStartedAt: z.coerce.date(),
  statusChangedAt: z.coerce.date(),
  sessionStartedAt: z.coerce.date(),
  lastConnectedAt: z.coerce.date(),
  lastSessionEndedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  connections: z.array(z.string()).default([]),
};

export const userDataSchema = createSelectSchema(userData, userDataSchemaOptions);
export type UserData = z.infer<typeof userDataSchema>;
export const userDataInsertSchema = createInsertSchema(userData, userDataSchemaOptions);
export type UserDataInsert = z.infer<typeof userDataInsertSchema>;

// public data gets sent to other users in the same room
export const userPublicDataSchema = userDataSchema.omit({
  apiKey: true,
  connections: true,
  email: true,
});
export type UserPublicData = z.infer<typeof userPublicDataSchema>;

type ConfettiShootParams = {
  delay?: number;
  source?: string;
};
export type Confetti = {
  shoot: (params?: ConfettiShootParams) => void;
};

const connectionStatusOptions = ['disconnected', 'partially connected', 'fully connected'] as const;
export type ConnectionStatus = (typeof connectionStatusOptions)[number];

export const serverMetaDataSchema = z.object({
  timeSinceOnStart: z.coerce.date(),
});
export type ServerMetaData = z.infer<typeof serverMetaDataSchema>;
