import { eq, inArray, ne } from 'drizzle-orm';

import { db } from '@/db/db';
import { accounts, userData, users } from '@/db/schema';

import { UserData, UserDataInsert } from '@/lib/types';

export async function getUserDataByApiKey(apiKey: string) {
  const res = await db.query.userData.findFirst({
    where: (users, { eq }) => eq(users.apiKey, apiKey),
    with: { user: true },
  });

  if (!res) return null;

  const { user, ...userData } = res;

  return { ...userData, name: res.user.name };
}

export async function getUserDataByUserId(userId: string): Promise<UserData | null> {
  const res = await db.query.userData.findFirst({
    where: eq(userData.userId, userId),
    with: { user: true },
  });

  if (!res) return null;

  const { user, ...data } = res;

  return { ...data, image: res.user.image, name: res.user.name, email: res.user.email };
}

export function setUserData(userId: string, data: UserDataInsert) {
  return db
    .insert(userData)
    .values({ userId, ...data, updatedAt: new Date() })
    .returning();
}

export async function updateUserData(userId: string, data: Partial<UserData>) {
  const { name, ...rest } = data;

  await db
    .update(userData)
    .set({ ...rest, updatedAt: new Date() })
    .where(eq(userData.userId, userId));

  if (name) await db.update(users).set({ name }).where(eq(users.id, userId));
}

export function getUser(userId: string) {
  return db.query.users.findFirst({ where: eq(users.id, userId) });
}

export async function getUserDataList(userIds: string[]) {
  const res = await db.query.userData.findMany({
    where: inArray(userData.userId, userIds),
    with: { user: true },
  });

  if (!res || res.length === 0) return [];

  return res.map((r) => {
    const { user, ...data } = r;

    return { ...data, name: user.name, image: user.image, email: user.email };
  });
}

export function clearConnectionData() {
  const now = new Date();

  return db
    .update(userData)
    .set({ connections: [], updatedAt: now })
    .where(ne(userData.connections, []));
}

export function getUserAccounts(userId: string) {
  return db.query.accounts.findMany({
    where: eq(accounts.userId, userId),
  });
}
