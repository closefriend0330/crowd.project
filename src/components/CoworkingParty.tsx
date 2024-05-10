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
        <NewsCallout title='New feature: Edit your profile'>
          Change your username or grab your API key via &apos;Edit profile&apos; under the the
          account menu.
        </NewsCallout>
        <div className='flex flex-col justify-center items-center'>
          <StatusUpdate />
          <UserList />
        </div>
      </div>
    );

  if (connectionStatus === 'partially connected') return <Error />;

  return null;
}
