import { and, eq, inArray, ne } from 'drizzle-orm';

import { db } from '@/db/db';
import { accounts, todos, users } from '@/db/schema';

import type { Todo, TodoInsert, User } from '@/lib/types';

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

export function insertTodo(todo: TodoInsert) {
  return db.insert(todos).values(todo);
}

export function updateTodo({ ids, data }: { ids: string[]; data: Partial<Todo> }) {
  return db
    .update(todos)
    .set({ ...data })
    .where(inArray(todos.id, ids));
}

export function getTodosByUserId(userId: string) {
  return db.query.todos.findMany({
    where: and(eq(todos.userId, userId), ne(todos.status, 'deleted')),
  });
}

export function getUserAccounts(userId: string) {
  return db.query.accounts.findMany({
    where: eq(accounts.userId, userId),
  });
}
