import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  return String(error);
}

export function debug(...message: unknown[]) {
  if (process.env.DEBUG || process.env.NEXT_PUBLIC_DEBUG) console.log(...message);
}
