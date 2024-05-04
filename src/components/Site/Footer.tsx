import { IconBrandGithub, IconBrandThreads, IconBrandTwitter } from '@tabler/icons-react';

import ConnectionStatus from '@/components/Site/ConnectionStatus';
import FooterMessage from '@/components/Site/FooterMessage';
import MuteButton from '@/components/Site/MuteButton';

export default function Footer() {
  return (
    <footer className='flex items-center gap-2 text-slate-500 text-[8pt] sm:text-sm py-2 px-4 mt-4 sticky bottom-0 bg-white border-t border-slate-400 shadow-sm'>
      <ConnectionStatus />
      <MuteButton />
      <div className='grow'>
        <FooterMessage />
      </div>
      <a href='https://threads.net/@joostschuur' target='_blank'>
        <IconBrandThreads className='size-5 text-black transition hover:scale-125 ease-in-out' />
      </a>
      <a href='https://twitter.com/joostschuur' target='_blank'>
        <IconBrandTwitter className='size-5 text-blue-400 transition hover:scale-125 ease-in-out' />
      </a>
      <a href='https://github.com/jschuur/coworking.party' target='_blank'>
        <IconBrandGithub className='size-5 text-purple-700 transition hover:scale-125 ease-in-out' />
      </a>
      <span className='hidden sm:inline-block'>
        (<a href='https://github.com/jschuur/coworking.party/issues'>roadmap</a>)
      </span>
    </footer>
  );
}
