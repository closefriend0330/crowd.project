import { createClient } from '@libsql/client/web';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from '@/db/schema';

const authToken = process.env.DATABASE_AUTH_TOKEN;
const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error('DATABASE_URL is not defined');
}

if (url?.startsWith('libsql://') && !authToken) {
  throw new Error('DATABASE_AUTH_TOKEN is not defined');
}

const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client, { schema });
