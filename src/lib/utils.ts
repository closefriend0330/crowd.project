import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown) {
  if (error instanceof z.ZodError) return fromError(error);

  if (error instanceof Error) return error.message;

  return String(error);
}

export function debug(...message: unknown[]) {
  if (process.env.LOGGING || process.env.NEXT_PUBLIC_LOGGING) console.log(...message);
}
