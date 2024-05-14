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
      <div className='max-w-xl'>
        <NewsCallout title='Todo List Preview' className='mb-4'>
          Try out the new, local-only todo list to track your most important priorities for the day
          and see if you can break it. Coming soon: shared progress tracking. 🚀
        </NewsCallout>

        <div className='flex flex-col justify-center items-center'>
          <div className='xs:min-w-96 w-full max-w-[450px]'>
            <StatusUpdate />
            <UserList />
            <Todos />
          </div>
        </div>
      </div>
    );

  if (connectionStatus === 'partially connected') return <Error />;

  return null;
}
