import ConnectionStatus from '@/components/Site/ConnectionStatus';
import FooterMessage from '@/components/Site/FooterMessage';
import MuteButton from '@/components/Site/MuteButton';
import Socials from '@/components/Site/Socials';

export default function Footer() {
  return (
    <footer className='flex items-center gap-2 text-slate-500 text-[8pt] sm:text-sm py-2 px-4 mt-4 sticky bottom-0 bg-white border-t border-slate-400 shadow-sm'>
      <ConnectionStatus />
      <MuteButton />
      <div className='grow'>
        <FooterMessage />
      </div>
      <Socials />
      <span className='hidden sm:inline-block'>
        (<a title="GitHub Issues" target="_blank" href='https://github.com/jschuur/coworking.party/issues'>roadmap</a>)
      </span>
    </footer>
  );
}
