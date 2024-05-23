'use client';

import { Active, Over } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { createStore } from 'zustand/vanilla';

import { Todo } from '@/lib/types';

export type TodoState = {
  todos: Todo[];
};

export type TodoActions = {
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  removeTodo: (id: string) => void;
  removeAllTodos: () => void;
  moveTodo: (active: Active, over: Over | null) => void;
};

export type TodoStore = TodoState & TodoActions;

export const defaultInitState: TodoState = {
  todos: [],
};

export const createTodoStore = (initState: TodoState = defaultInitState) => {
  return createStore<TodoStore>()((set) => ({
    ...initState,

    setTodos: (todos: Todo[]) => set(() => ({ todos })),

    addTodo: (todo: Todo) =>
      set((state: TodoStore) => ({
        todos: [...new Set([...state.todos, todo])],
      })),

    updateTodo: (id: string, data: Partial<Todo>) =>
      set((state: TodoStore) => ({
        todos: state.todos.map((t) => (t.id === id ? { ...t, ...data } : t)),
      })),

    removeTodo: (id: string) =>
      set((state: TodoStore) => ({
        todos: state.todos.filter((todo: Todo) => todo.id !== id),
      })),

    removeAllTodos: () => set(() => ({ todos: [] })),

    moveTodo: (active, over) => {
      if (over && active.id !== over.id) {
        set((state: TodoStore) => {
          const oldIndex = state.todos.findIndex((t) => t.id === active.id);
          const newIndex = state.todos.findIndex((t) => t.id === over.id);

          return {
            todos: arrayMove(state.todos, oldIndex, newIndex),
          };
        });
      }
    },
  }));
};
