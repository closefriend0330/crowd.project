import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { userData, users } from '@/db/schema';

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

const authUserSchema = createSelectSchema(users).pick({ email: true, name: true, image: true });
const authPublicUserSchema = authUserSchema.omit({ email: true });
export type AuthUser = z.infer<typeof authUserSchema>;
export type AuthUserPublic = z.infer<typeof authPublicUserSchema>;

export const userDataSchema = createSelectSchema(userData, userDataSchemaOptions).merge(
  authUserSchema
);
export type UserData = z.infer<typeof userDataSchema>;
export const userDataInsertSchema = createInsertSchema(userData, userDataSchemaOptions);
export type UserDataInsert = z.infer<typeof userDataInsertSchema>;

// public data gets sent to other users in the same room
export const userPublicDataSchema = userDataSchema
  .omit({
    apiKey: true,
    connections: true,
    email: true,
  })
  .merge(authPublicUserSchema);
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

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date | null;
  completedAt: Date | null;
};
