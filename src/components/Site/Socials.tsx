import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandThreads,
  IconBrandTwitter,
} from '@tabler/icons-react';

export default function Socials() {
  return (
    <>
      <a href='https://threads.net/@joostschuur' title='Threads (Joost Schuur)' target='_blank'>
        <IconBrandThreads className='size-5 text-black transition hover:scale-125 ease-in-out' />
      </a>
      <a href='https://twitter.com/joostschuur' title='Twitter (Joost Schuur)' target='_blank'>
        <IconBrandTwitter className='size-5 text-blue-400 transition hover:scale-125 ease-in-out' />
      </a>
      <a href='https://discord.gg/g9DtFax7Df' title='Discord' target='_blank'>
        <IconBrandDiscord className='size-5 text-blue-800 transition hover:scale-125 ease-in-out' />
      </a>
      <a href='https://github.com/jschuur/coworking.party' title='GitHub' target='_blank'>
        <IconBrandGithub className='size-5 text-purple-700 transition hover:scale-125 ease-in-out' />
      </a>
    </>
  );
}
