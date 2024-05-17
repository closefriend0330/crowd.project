import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { users } from '@/db/schema';

import { TablerIcon } from '@/statusOptions';

export type UserStatus = keyof UserStatusConfig;
export type UserSelectableStatus = Omit<UserStatus, 'offline'>;

export type UserStatusConfig = Record<
  string,
  {
    color: string;
    icon?: TablerIcon;
    nonSelectable?: boolean;
  }
>;

const userSchemaOptions = {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  sessionStartedAt: z.coerce.date(),
  lastConnectedAt: z.coerce.date(),
  lastSessionEndedAt: z.coerce.date(),
  updateChangedAt: z.coerce.date(),
  statusChangedAt: z.coerce.date(),
  away: z.coerce.boolean(),
  awayChangedAt: z.coerce.date(),
  connections: z.array(z.string()).default([]),
};

export const userSchema = createSelectSchema(users, userSchemaOptions);
export type User = z.infer<typeof userSchema>;
export const userInsertSchema = createInsertSchema(users, userSchemaOptions);
export type UserInsert = z.infer<typeof userInsertSchema>;

// public data gets sent to other users in the same room
export const userPublicSchema = userSchema.omit({
  apiKey: true,
  connections: true,
  email: true,
});
export type UserPublic = z.infer<typeof userPublicSchema>;

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

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date | null;
  completedAt: Date | null;
};
