import { clientMessageSchema } from '@/lib/clientMessages';

export function buildClientMessage<T>(message: T) {
  return JSON.stringify(clientMessageSchema.parse(message));
}
