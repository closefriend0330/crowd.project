import { userData } from '@/db/schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const userDataSchemaOptions = {
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

export const userPublicDataSchema = userDataSchema.omit({
  apiKey: true,
  connections: true,
  email: true,
});
export type UserPublicData = z.infer<typeof userPublicDataSchema>;

// client messages sent FROM a client TO the server

// client has updated local state
const clientMessageUpdateUserDataSchema = z.object({
  type: z.literal('updateUserData'),
  userId: z.string(),
  data: userDataSchema.partial(),
});
export type ClientMessageUpdateUserData = z.infer<typeof clientMessageUpdateUserDataSchema>;

export const clientMessageSchema = clientMessageUpdateUserDataSchema;
export type ClientMessage = z.infer<typeof clientMessageSchema>;

// server messages sent FROM the server TO a client

// send the full list of connected users
const serverMessageUserListSchema = z.object({
  type: z.literal('userList'),
  users: z.array(userPublicDataSchema),
});
export type ServerMessageUserList = z.infer<typeof serverMessageUserListSchema>;

// a new user has connected
const serverMessageAddUserSchema = z.object({
  type: z.literal('addUser'),
  data: userPublicDataSchema,
});
export type ServerMessageAddUser = z.infer<typeof serverMessageAddUserSchema>;

// a user has disconnected
const serverMessageRemoveUserSchema = z.object({
  type: z.literal('removeUser'),
  userId: z.string(),
});
export type ServerMessageRemoveUser = z.infer<typeof serverMessageRemoveUserSchema>;

// the server is sending the full data for a connected user
const serverMessageUserDataSchema = z.object({
  type: z.literal('usersFullData'),
  data: userDataSchema,
});
export type ServerMessageUserData = z.infer<typeof serverMessageUserDataSchema>;

// the server has updated the public data of a user in the list
const serverMessageUpdatePublicDataSchema = z.object({
  type: z.literal('updateUsersPublicData'),
  userId: z.string(),
  data: userPublicDataSchema.partial(),
});
export type ServerMessageUpdatePublicData = z.infer<typeof serverMessageUpdatePublicDataSchema>;

export const serverMessageSchema = serverMessageUserListSchema
  .or(serverMessageAddUserSchema)
  .or(serverMessageRemoveUserSchema)
  .or(serverMessageUserDataSchema)
  .or(serverMessageUpdatePublicDataSchema);
export type ServerMessage = z.infer<typeof serverMessageSchema>;
