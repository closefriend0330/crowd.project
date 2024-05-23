import { useTodoStore } from '@/components/Providers/ZustandStoreProvider';
import { Active, Over } from '@dnd-kit/core';
import { useAtom, useAtomValue } from 'jotai';
import { v4 as uuidv4 } from 'uuid';

import { MAX_OPEN_TODO_LIST_ITEMS } from '@/config';
import { buildClientMessage } from '@/lib/messages';
import { randomTodoTitle } from '@/lib/todos';
import { debug } from '@/lib/utils';
import { partySocketAtom, userAtom } from '@/stores/jotai';

import { ClientMessageCreateTodo, ClientMessageUpdateTodos } from '@/lib/clientMessages';
import { Todo } from '@/lib/types';
import {
  ServerMessageAddUserTodo,
  ServerMessageUpdateUserTodos,
  ServerMessageUserTodos,
} from '@/party/serverMessages';

export default function useTodoList() {
  const [user] = useAtom(userAtom);
  const ws = useAtomValue(partySocketAtom);

  const { todos, setTodos, addTodo, updateTodo, removeTodo, removeAllTodos, moveTodo } =
    useTodoStore((state) => state);

  const completedTodos = todos.filter((todo) => todo.status === 'completed').length;
  const openTodos = todos.filter((todo) => todo.status === 'open').length;
  const totalTodos = todos.length;
  const completionRate = totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);
  const allCompleted = openTodos === 0 && completedTodos > 0;
  const todoSlotsLeft = MAX_OPEN_TODO_LIST_ITEMS - openTodos;

  const addTodoItem = (title: string) => {
    if (!user || !ws) return;

    const todo = {
      id: uuidv4(),
      title,
      userId: user.id,
      status: 'open',
      alias: null,
      createdAt: new Date(),
      completedAt: null,
      deletedAt: null,
    } as const;

    // save todo locally
    addTodo(todo);

    // send todo to server for further broadcasting/db saving
    ws.send(
      buildClientMessage<ClientMessageCreateTodo>({
        type: 'createTodo',
        todo: { ...todo, alias: randomTodoTitle() },
      })
    );
  };

  type UpdateTodoItemParams = {
    id: string;
    data: Partial<Todo>;
    skipSync?: boolean;
  };
  const updateTodoItem = ({ id, data, skipSync = false }: UpdateTodoItemParams) => {
    if (!ws) return;

    updateTodo(id, data);

    if (!skipSync)
      ws.send(
        buildClientMessage<ClientMessageUpdateTodos>({ type: 'updateTodos', todoIds: [id], data })
      );
  };

  const moveTodoItem = (active: Active, over: Over | null) => {
    moveTodo(active, over);
  };

  type RemoveTodoItemParams = {
    id: string;
    skipSync?: boolean;
  };
  const removeTodoItem = ({ id, skipSync }: RemoveTodoItemParams) => {
    if (!ws) return;

    removeTodo(id);

    if (!skipSync)
      ws.send(
        buildClientMessage<ClientMessageUpdateTodos>({
          type: 'updateTodos',
          todoIds: [id],
          data: {
            status: 'deleted',
            deletedAt: new Date(),
          },
        })
      );
  };

  const removeAllTodoItems = () => {
    if (!ws) return;

    const todoIds = todos.map((todo) => todo.id);

    removeAllTodos();

    ws.send(
      buildClientMessage<ClientMessageUpdateTodos>({
        type: 'updateTodos',
        todoIds: todoIds,
        data: {
          status: 'deleted',
          deletedAt: new Date(),
        },
      })
    );
  };

  const processUserTodosMessage = ({ todos }: ServerMessageUserTodos) => {
    debug('userTodos client message ', { todoIds: todos.map((todo) => todo.id) });

    if (todos.length > 0) setTodos(todos);
  };

  const processAddUserTodoMessage = ({ todo }: ServerMessageAddUserTodo) => {
    debug('addUserTodo client message ', { todoId: todo.id });

    if (todo.status !== 'deleted') addTodo(todo);
    else console.warn('addUserTodo message with deleted todo', { todoId: todo.id });
  };

  const processUpdateUserTodosMessage = ({ todoIds, data }: ServerMessageUpdateUserTodos) => {
    debug('updateUserToDos client message ', { todoIds: todos.map((todo) => todo.id) });

    for (const todoId of todoIds) {
      if (data.status === 'deleted') removeTodoItem({ id: todoId, skipSync: true });
      else updateTodoItem({ id: todoId, data, skipSync: true });
    }
  };

  return {
    addTodoItem,
    updateTodoItem,
    moveTodoItem,
    removeTodoItem,
    removeAllTodoItems,
    processUserTodosMessage,
    processAddUserTodoMessage,
    processUpdateUserTodosMessage,
    todos,
    completedTodos,
    openTodos,
    totalTodos,
    completionRate,
    allCompleted,
    todoSlotsLeft,
  };
}
