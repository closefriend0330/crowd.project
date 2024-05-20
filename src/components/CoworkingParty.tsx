'use client';

import { useAtomValue } from 'jotai';

import StatusUpdate from '@/components/Presence/StatusUpdate';
import UserList from '@/components/Presence/UserList';
import Error from '@/components/Site/Error';
import Todos from '@/components/Todos/Todos';

import { NewsCallout } from '@/components/Site/NewsCallout';
import { connectionStatusAtom } from '@/stores/jotai';

export default function CoworkingParty() {
  const connectionStatus = useAtomValue(connectionStatusAtom);

  if (connectionStatus === 'fully connected')
    return (
      <div className='flex flex-col items-center max-w-xl'>
        <NewsCallout title='Status update form improvements' className='mb-4'>
          Status dropdown now has search and keyboard shortcuts are available to focus on the update
          (/) and status (s) fields. Hit Cmd-Enter (or Windows-Enter) to submit directly from either
          field.
        </NewsCallout>

        <div className='w-full xs:w-[450px]'>
          <StatusUpdate className='w-full' />
          <UserList className='w-full' />
          <Todos className='w-full' />
        </div>
      </div>
    );

  if (connectionStatus === 'partially connected') return <Error />;

  return null;
}
