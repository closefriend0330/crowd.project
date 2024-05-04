'use client';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useAtomValue } from 'jotai';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { errorAtom } from '@/store';

export default function Error() {
  const error = useAtomValue(errorAtom);

  if (!error) return null;

  return (
    <Alert variant='destructive' className='min-w-96 bg-white'>
      <ExclamationTriangleIcon className='h-4 w-4 mt-0.5' />
      <AlertTitle className='font-medium text-lg'>{error.title || 'Error'}</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
