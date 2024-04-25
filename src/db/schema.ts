import { randomUUID } from 'crypto';
import { index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { AdapterAccount } from 'next-auth/adapters';

export const users = sqliteTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
});

export const accounts = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    userIdIdx: index('Account_userId_index').on(account.userId),
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable(
  'session',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    sessionToken: text('sessionToken').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (s) => ({
    userIdIdx: index('Session_userId_index').on(s.userId),
  })
);

export const verificationTokens = sqliteTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const userData = sqliteTable(
  'userData',
  {
    userId: text('userId')
      .notNull()
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade' }),
    data: text('data', { mode: 'json' }),
    apiKey: text('apiKey')
      .notNull()
      .unique()
      .$defaultFn(() => randomUUID()),
  },
  (ud) => ({
    userIdIdx: index('UserData_userId_index').on(ud.userId),
  })
);
