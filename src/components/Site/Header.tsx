import { IconCake } from '@tabler/icons-react';

import Account from '@/components/Site/Account';

import { DEFAULT_SITENAME } from '@/config';

export default function Header() {
  return (
    <div className='flex items-center justify-between w-full gap-2 px-4 min-h-12 sm:min-h-16 bg-gradient-to-br text-white from-blue-600 to-purple-600 mb-4 border-b-black border-b-[0.5px]'>
      <IconCake className='size-6 sm:size-8 hidden sm:inline-block' />
      <h1 className='font-header font-semibold text-base sm:text-2xl grow'>
        {process.env.NEXT_PUBLIC_SITENAME || DEFAULT_SITENAME}
      </h1>
      <Account />
    </div>
  );
}
