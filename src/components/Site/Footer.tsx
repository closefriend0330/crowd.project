import { IconBrandGithub, IconBrandThreads, IconBrandTwitter } from '@tabler/icons-react';
export default function Footer() {
  return (
    <footer className='flex items-center gap-2 text-slate-500 text-[8pt] sm:text-sm py-1 sm:py-2 px-4 bg-white border-t border-slate-400 shadow-sm'>
      <div className='grow hidden sm:block'>
        Built with <a href='https://partykit.io'>PartyKit</a>,{' '}
        <a href='https://nextjs.org'>Next.js</a>, and <a href='https://ion.sst.dev'>SST Ion</a>.
      </div>
      <div className='grow sm:grow-0'>By Joost Schuur</div>
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
