import { eq, inArray, ne } from 'drizzle-orm';

import { db } from '@/db/db';
import { accounts, users } from '@/db/schema';

import type { User } from '@/lib/types';

export function getUserByApiKey(apiKey: string) {
  return db.query.users.findFirst({ where: (users, { eq }) => eq(users.apiKey, apiKey) });
}

export async function getUserByUserId(userId: string) {
  return db.query.users.findFirst({ where: eq(users.id, userId) });
}

export function updateUser(userId: string, data: Partial<User>) {
  return db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

export function getUser(userId: string) {
  return db.query.users.findFirst({ where: eq(users.id, userId) });
}

export function getUsersByUsersIds(userIds: string[]) {
  return db.query.users.findMany({ where: inArray(users.id, userIds) });
}

export function clearConnectionData() {
  return db
    .update(users)
    .set({ connections: [], updatedAt: new Date() })
    .where(ne(users.connections, []));
}

export function getUserAccounts(userId: string) {
  return db.query.accounts.findMany({
    where: eq(accounts.userId, userId),
  });
}
