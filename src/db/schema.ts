import { sql } from 'drizzle-orm';
import { index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { AdapterAccount } from 'next-auth/adapters';
import { v4 as uuidv4 } from 'uuid';

export const users = sqliteTable('user', {
  // Auth.js fields
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),

  // custom public fields
  createdAt: integer('createdAt', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' })
    .default(sql`(unixepoch() * 1000)`)
    .notNull(),

  sessionStartedAt: integer('sessionStartedAt', { mode: 'timestamp_ms' }),
  lastConnectedAt: integer('lastConnectedAt', { mode: 'timestamp_ms' }),
  lastSessionEndedAt: integer('lastSessionEndedAt', { mode: 'timestamp_ms' }),

  update: text('update'),
  status: text('status').notNull().default('offline'),
  updateChangedAt: integer('updateChangedAt', { mode: 'timestamp_ms' }),
  statusChangedAt: integer('statusChangedAt', { mode: 'timestamp_ms' }),

  away: integer('away', { mode: 'boolean' }).notNull().default(false),
  awayChangedAt: integer('awayChangedAt', { mode: 'timestamp_ms' }),

  // custom private fields
  apiKey: text('apiKey')
    .notNull()
    .unique()
    .$defaultFn(() => uuidv4()),
  connections: text('connections', { mode: 'json' }).$type<string[]>().notNull().default([]),
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
      .$defaultFn(() => uuidv4()),
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
