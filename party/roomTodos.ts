import Party from 'partykit/server';

import { sendServerMessage } from '@/party/lib';

import { ServerMessageRoomData } from '@/party/serverMessages';

import { Notification, Todo } from '@/lib/types';
import type Server from '@/party/server';

type AddRoomTodoParams = {
  todos: Todo[];
  connection?: Party.Connection<unknown>;
};
type UpdateRoomTodosParams = {
  todoIds: string[];
  data: Partial<Todo>;
  connection?: Party.Connection<unknown>;
  userId: string;
};
type RemoveUserTodosFromRoomParams = {
  userId: string;
  connection?: Party.Connection<unknown>;
};
type SendUpdatedRoomDataParams = {
  connection?: Party.Connection<unknown>;
  notification?: Notification;
};

export class RoomTodos {
  todos: Array<Todo> = [];
  userProgress: Record<string, { openTodos: number; completedTodos: number }> = {};
  partyServer: Server;

  get list() {
    return this.todos;
  }

  set list(todos: Array<Todo>) {
    this.todos = todos;
  }

  get openTodos() {
    return this.todos.filter((t) => t.status === 'open').length || 0;
  }

  get completedTodos() {
    return this.todos.filter((t) => t.status === 'completed').length || 0;
  }

  get completionRate() {
    return this.todos.length === 0
      ? 0
      : Math.round((this.completedTodos / (this.openTodos + this.completedTodos)) * 100);
  }

  constructor(partyServer: Server) {
    this.partyServer = partyServer;
  }

  updateUserProgress() {
    this.userProgress = {};

    for (const todo of this.todos) {
      if (!this.userProgress[todo.userId])
        this.userProgress[todo.userId] = { openTodos: 0, completedTodos: 0 };

      const userProgress = this.userProgress[todo.userId];

      if (todo.status === 'open') userProgress.openTodos++;
      if (todo.status === 'completed') userProgress.completedTodos++;
    }
  }

  // add one (todo form) or more (connecting client) todos
  addRoomTodos({ todos }: AddRoomTodoParams) {
    for (const todo of todos) {
      const todoIndex = this.todos.findIndex((t) => t.id === todo.id);

      // reconnecting users will have their todos already in the list, readd fresh db copy
      if (todoIndex !== -1) {
        this.todos[todoIndex] = todo;
      } else {
        this.todos.push(todo);
      }
    }

    this.updateUserProgress();

    const updatingUserId = todos[0].userId;
    const updatingUser = this.partyServer.users.lookupUser(updatingUserId);

    this.sendUpdatedRoomData(
      updatingUser
        ? {
            notification: {
              title: `${updatingUser.name} added a new priority`,
              updatingUserId,
            },
          }
        : {}
    );
  }

  removeRoomTodos({ todoIds }: { todoIds: string[] }) {
    this.todos = this.todos.filter((t) => !todoIds.includes(t.id));

    this.updateUserProgress();
    this.sendUpdatedRoomData();
  }

  updateRoomTodos({ todoIds, data, connection, userId: updatingUserId }: UpdateRoomTodosParams) {
    let title: string | undefined;
    let body: string | undefined;

    if (data.status === 'deleted') this.removeRoomTodos({ todoIds });
    else
      for (const todoId of todoIds) {
        const todoIndex = this.todos.findIndex((t) => t.id === todoId);
        if (todoIndex === -1) return;

        this.todos[todoIndex] = { ...this.todos[todoIndex], ...data };
      }

    this.updateUserProgress();

    const updatingUser = this.partyServer.users.lookupUser(updatingUserId);
    if (updatingUser) {
      if (data.status === 'completed') title = `${updatingUser.name} completed a priority`;
      else if (data.status === 'open') title = `${updatingUser.name} reopened a priority`;
    }

    const userProgress = this.userProgress[updatingUserId];
    const totalTodos = userProgress ? userProgress.openTodos + userProgress.completedTodos : 0;

    if (userProgress && totalTodos > 0) {
      body = `${userProgress.completedTodos}/${totalTodos} completed`;
    }

    this.sendUpdatedRoomData(title ? { notification: { title, body, updatingUserId } } : {});
  }

  removeUserTodosFromRoom({ userId }: RemoveUserTodosFromRoomParams) {
    this.todos = this.todos.filter((t) => t.userId !== userId);

    this.updateUserProgress();
    this.sendUpdatedRoomData();
  }

  sendUpdatedRoomData({ connection, notification }: SendUpdatedRoomDataParams = {}) {
    sendServerMessage<ServerMessageRoomData>(connection || this.partyServer.room, {
      type: 'roomData',
      data: {
        openTodos: this.openTodos || 0,
        completedTodos: this.completedTodos || 0,
        todoUserCount: new Set(this.todos.map((todo) => todo.userId)).size || 0,
        userProgress: this.userProgress,
      },
      notification,
    });
  }
}
