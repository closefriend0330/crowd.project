import { z } from 'zod';

import { serverMetaDataSchema, userDataSchema, userPublicDataSchema } from '@/lib/types';

// server messages sent FROM the server TO a client

const serverMessageTypes = [
  'userList',
  'addUser',
  'removeUser',
  'usersFullData',
  'updateUsersPublicData',
  'serverMetaData',
  'errorEncountered',
  'updateSuccess',
] as const;
export type ServerMessageType = (typeof serverMessageTypes)[number];

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

// the server has successfully updated data with a 'source' (i.e. a form in a dialog box that can be closed)
const serverMessageUpdateSuccessSchema = z.object({
  type: z.literal('updateSuccess'),
  message: z.string().optional(),
});
export type ServerMessageUpdateSuccess = z.infer<typeof serverMessageUpdateSuccessSchema>;

// the server has updated the public data of a user in the list
const serverMessageErrorEncounteredSchema = z.object({
  type: z.literal('errorEncountered'),
  source: z.string(),
  message: z.string(),
});
export type ServerMessageErrorEncountered = z.infer<typeof serverMessageErrorEncounteredSchema>;

const serverMessageServerMetaDataSchema = z.object({
  type: z.literal('serverMetaData'),
  data: serverMetaDataSchema,
});
export type ServerMessageServerMetaData = z.infer<typeof serverMessageServerMetaDataSchema>;

export const serverMessageSchema = z.union([
  serverMessageUserListSchema,
  serverMessageAddUserSchema,
  serverMessageRemoveUserSchema,
  serverMessageUserDataSchema,
  serverMessageUpdatePublicDataSchema,
  serverMessageServerMetaDataSchema,
  serverMessageErrorEncounteredSchema,
  serverMessageUpdateSuccessSchema,
]);
export type ServerMessage = z.infer<typeof serverMessageSchema>;
