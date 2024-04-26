import { eq } from 'drizzle-orm';

import { db } from '@/db/db';
import { userData } from '@/db/schema';

import { UserData } from '@/lib/types';

export function getUserByApiKey(apiKey: string) {
  return db.select().from(userData).where(eq(userData.apiKey, apiKey));
}

export async function getUserDataByUserId(userId: string): Promise<UserData> {
  const [res] = await db.select().from(userData).where(eq(userData.userId, userId));

  return res?.data;
}

export function setUserData(userId: string, data: UserData) {
  return db.insert(userData).values({ userId, data });
}
