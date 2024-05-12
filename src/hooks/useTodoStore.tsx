import { Active, Over } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date | null;
  completedAt: Date | null;
};

type TodoStore = {
  todos: Todo[];
  addTodo: (title: string) => void;
  removeTodo: (id: number) => void;
  removeAllTodos: () => void;
  toggleTodo: (id: number) => void;
  moveTodo: (active: Active, over: Over | null) => void;
};

const useTodoStore = create(
  persist<TodoStore>(
    (set) => ({
      todos: [] as Todo[],

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

export default useTodoStore;
