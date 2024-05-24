import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { todos, users } from '@/db/schema';

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

const todoSchemaOptions = {
  createdAt: z.coerce.date(),
  completedAt: z.coerce.date(),
  deletedAt: z.coerce.date(),
};

export const todoSchema = createSelectSchema(todos, todoSchemaOptions);
export type Todo = z.infer<typeof todoSchema>;
export const todoInsertSchema = createInsertSchema(todos, todoSchemaOptions);
export type TodoInsert = z.infer<typeof todoInsertSchema>;

export const todoPublicSchema = todoSchema.omit({
  title: true,
});
export type TodoPublic = z.infer<typeof todoPublicSchema>;

// public data gets sent to other users in the same room
export const userPublicSchema = userSchema.omit({
  apiKey: true,
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

export const roomDataSchema = z.object({
  openTodos: z.number().int(),
  completedTodos: z.number().int(),
  todoUserCount: z.number().int(),
  userProgress: z.record(
    z.object({ openTodos: z.number().int(), completedTodos: z.number().int() })
  ),
});
export type RoomData = z.infer<typeof roomDataSchema>;

export type ConnectionData = {
  userId: string;
};
