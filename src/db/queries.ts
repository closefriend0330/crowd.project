import { eq, inArray } from 'drizzle-orm';

import { db } from '@/db/db';
import { userData, users } from '@/db/schema';

import { UserData, UserDataInsert } from '@/lib/types';

export function getUserDataByApiKey(apiKey: string) {
  return db.select().from(userData).where(eq(userData.apiKey, apiKey));
}

export async function getUserDataByUserId(userId: string): Promise<UserData> {
  const [res] = await db.select().from(userData).where(eq(userData.userId, userId));

  return res;
}

export function setUserData(userId: string, data: UserDataInsert) {
  return db
    .insert(userData)
    .values({ userId, ...data, updatedAt: new Date() })
    .returning();
}

export function updateUserData(userId: string, data: Partial<UserData>) {
  return db
    .update(userData)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(userData.userId, userId));
}

export function getUser(userId: string) {
  return db.query.users.findFirst({ where: eq(users.id, userId) });
}

export function getUserDataList(userIds: string[]) {
  return db.query.userData.findMany({ where: inArray(userData.userId, userIds) });
}
