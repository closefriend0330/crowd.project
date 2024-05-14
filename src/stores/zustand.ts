'use client';

import { Active, Over } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { Todo } from '@/lib/types';

export type TodoState = {
  todos: Todo[];
};

export type TodoActions = {
  addTodo: (title: string) => void;
  removeTodo: (id: number) => void;
  removeAllTodos: () => void;
  toggleTodo: (id: number) => void;
  moveTodo: (active: Active, over: Over | null) => void;
};

export type TodoStore = TodoState & TodoActions;

export const defaultInitState: TodoState = {
  todos: [],
};

export const createTodoStore = (initState: TodoState = defaultInitState) => {
  return createStore<TodoStore>()(
    persist<TodoStore>(
      (set) => ({
        ...initState,

        addTodo: (title: string) =>
          set((state: TodoStore) => ({
            todos: [
              ...state.todos,
              {
                id: Math.max(...state.todos.map((todo) => todo.id), 0) + 1,
                title,
                completed: false,
                createdAt: new Date(),
                completedAt: null,
              },
            ],
          })),

        removeTodo: (id: number) =>
          set((state: TodoStore) => ({
            todos: state.todos.filter((todo: Todo) => todo.id !== id),
          })),

        removeAllTodos: () =>
          set((state: TodoStore) => ({
            todos: [],
          })),

        toggleTodo: (id: number) =>
          set((state: TodoStore) => ({
            todos: state.todos.map((todo) =>
              todo.id === id
                ? {
                    ...todo,
                    completed: !todo.completed,
                    completedAt: todo.completed ? null : new Date(),
                  }
                : todo
            ),
          })),

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
      }),
      {
        name: 'todos',
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
};
