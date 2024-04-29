import { clientMessageSchema } from '@/lib/types';

export function buildClientMessage<T>(message: T) {
  return JSON.stringify(clientMessageSchema.parse(message));
}
