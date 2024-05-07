'use client';

import { useAtomValue } from 'jotai';

import TagLine from '@/components/Presence/TagLine';
import UserList from '@/components/Presence/UserList';
import Error from '@/components/Site/Error';

import { connectionStatusAtom } from '@/store';

export default function CoworkingParty() {
  const connectionStatus = useAtomValue(connectionStatusAtom);

  if (connectionStatus === 'fully connected')
    return (
      <div>
        <TagLine />
        <UserList />
      </div>
    );

  if (connectionStatus === 'partially connected') return <Error />;

  return null;
}
