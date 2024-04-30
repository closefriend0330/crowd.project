'use client';

import dynamic from 'next/dynamic';

import Account from '@/components/Site/Account';
const Logo = dynamic(() => import('@/components/Site/Logo'), { ssr: false });

import useConfetti from '@/hooks/useConfetti';

import { DEFAULT_SITENAME, SITE_STRAPLINE } from '@/config';

export default function Header() {
  const { shootConfetti } = useConfetti();

  return (
    <div className='flex items-center justify-between w-full gap-4 px-4 min-h-12 sm:min-h-16 bg-gradient-to-br text-white from-blue-600 to-purple-600 mb-4 border-b-black border-b-[0.5px]'>
      <div className='w-10 hidden sm:block'>
        <Logo />
      </div>
      <div className='grow'>
        <h1
          className='font-header font-semibold text-base sm:text-2xl'
          onClick={() => shootConfetti({ source: 'header' })}
        >
          {process.env.NEXT_PUBLIC_SITENAME || DEFAULT_SITENAME}
        </h1>
        <p className='text-sm hidden sm:block'>{SITE_STRAPLINE}</p>
      </div>
      <Account />
    </div>
  );
}
