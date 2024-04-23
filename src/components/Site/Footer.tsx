import { IconBrandGithub, IconBrandThreads, IconBrandTwitter } from '@tabler/icons-react';

import ConnectionStatus from '@/components/Site/ConnectionStatus';
import FooterMessage from '@/components/Site/FooterMessage';

export default function Footer() {
  return (
    <footer className='flex items-center gap-2 text-slate-500 text-[8pt] sm:text-sm py-1 sm:py-2 px-4 bg-white border-t border-slate-400 shadow-sm'>
      <ConnectionStatus />
      <div className='grow'>
        <FooterMessage />
      </div>
      <a href='https://threads.net/@joostschuur'>
        <IconBrandThreads className='size-4 sm:size-5 text-black transition hover:scale-125 ease-in-out' />
      </a>
      <a href='https://twitter.com/joostschuur'>
        <IconBrandTwitter className='size-4 sm:size-5 text-blue-400 transition hover:scale-125 ease-in-out' />
      </a>
      <a href='https://github.com/jschuur'>
        <IconBrandGithub className='size-4 sm:size-5 text-purple-700 transition hover:scale-125 ease-in-out' />
      </a>
    </footer>
  );
}
