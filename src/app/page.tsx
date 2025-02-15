import { cookies } from 'next/headers';

import Confetti from '@/components/Confetti';
import CoworkingParty from '@/components/CoworkingParty';
import PartyKit from '@/components/Presence/PartyKit';
import LoggedOutHomepage from '@/components/Site/LoggedOutHomepage';
import VisibilityEvents from '@/components/Site/VisibilityEvents';

import { auth } from '@/auth';

export default async function Home() {
  const session = await auth();

  if (!session?.user) return <LoggedOutHomepage />;

  // local dev uses non 'Secure' cookies
  const sessionToken =
    cookies().get('__Secure-authjs.session-token')?.value ||
    cookies().get('authjs.session-token')?.value ||
    '';
//return
  return (
    <div>
      <Confetti />
      <PartyKit sessionToken={sessionToken} />
      <VisibilityEvents />
      <CoworkingParty />
    </div>
  );
}
