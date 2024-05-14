import { useTodoStore } from '@/components/ZustandStoreProvider';

import { MAX_OPEN_TODO_LIST_ITEMS } from '@/config';

export default function useTodoList() {
  const store = useTodoStore((state) => state);
  const { todos } = store;

  const completedTodos = todos.filter((todo) => todo.completed).length;
  const openTodos = todos.filter((todo) => !todo.completed).length;
  const totalTodos = todos.length;
  const completionRate = totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);
  const allCompleted = openTodos === 0 && completedTodos > 0;
  const todoSlotsLeft = MAX_OPEN_TODO_LIST_ITEMS - openTodos;

  return {
    ...store,
    completedTodos,
    openTodos,
    totalTodos,
    completionRate,
    allCompleted,
    todoSlotsLeft,
  };
}
