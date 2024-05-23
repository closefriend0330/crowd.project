import Party from 'partykit/server';

import { sendServerMessage } from '@/party/lib';

import { ServerMessageRoomData } from '@/party/serverMessages';

import { Todo } from '@/lib/types';
import type Server from '@/party/server';

type AddRoomTodoParams = {
  todos: Todo[];
  connection?: Party.Connection<unknown>;
};
type UpdateRoomTodosParams = {
  todoIds: string[];
  data: Partial<Todo>;
  connection?: Party.Connection<unknown>;
};
type RemoveUserTodosFromRoomParams = {
  userId: string;
  connection?: Party.Connection<unknown>;
};

export class RoomTodos {
  todos: Array<Todo> = [];
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

    this.sendUpdatedRoomData();
  }

  removeRoomTodos({ todoIds }: { todoIds: string[] }) {
    this.todos = this.todos.filter((t) => !todoIds.includes(t.id));

    this.sendUpdatedRoomData();
  }

  updateRoomTodos({ todoIds, data }: UpdateRoomTodosParams) {
    if (data.status === 'deleted') this.removeRoomTodos({ todoIds });
    else
      for (const todoId of todoIds) {
        const todoIndex = this.todos.findIndex((t) => t.id === todoId);
        if (todoIndex === -1) return;

        this.todos[todoIndex] = { ...this.todos[todoIndex], ...data };
      }

    this.sendUpdatedRoomData();
  }

  removeUserTodosFromRoom({ userId }: RemoveUserTodosFromRoomParams) {
    this.todos = this.todos.filter((t) => t.userId !== userId);

    this.sendUpdatedRoomData();
  }

  sendUpdatedRoomData(connection?: Party.Connection<unknown>) {
    sendServerMessage<ServerMessageRoomData>(connection || this.partyServer.room, {
      type: 'roomData',
      data: {
        openTodos: this.openTodos || 0,
        completedTodos: this.completedTodos || 0,
        todoUserCount: new Set(this.todos.map((todo) => todo.userId)).size || 0,
      },
    });
  }
}
