import { eq } from 'drizzle-orm';

import { db } from '@/db/db';

import { userData } from '@/db/schema';

export function getUserByApiKey(apiKey: string) {
  return db.select().from(userData).where(eq(userData.apiKey, apiKey));
}
