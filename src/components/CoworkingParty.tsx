'use client';

import { useAtomValue } from 'jotai';

import StatusUpdate from '@/components/Presence/StatusUpdate';
import UserList from '@/components/Presence/UserList';
import Error from '@/components/Site/Error';

import { NewsCallout } from '@/components/Site/NewsCallout';
import { connectionStatusAtom } from '@/store';

export default function CoworkingParty() {
  const connectionStatus = useAtomValue(connectionStatusAtom);

  if (connectionStatus === 'fully connected')
    return (
      <div className='max-w-xl'>
        <NewsCallout title='New features: API key, new status update UI' className='mb-4'>
          Change your username or grab your API key via &apos;Edit profile&apos; under the account
          menu and update your status and update text at the same time.
        </NewsCallout>

        <div className='flex flex-col justify-center items-center'>
          <div className='xs:min-w-96 w-full max-w-[450px]'>
            <StatusUpdate />
            <UserList />
          </div>
        </div>
      </div>
    );

  if (connectionStatus === 'partially connected') return <Error />;

  return null;
}
