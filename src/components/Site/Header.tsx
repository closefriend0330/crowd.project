import Account from '@/components/Site/Account';

export default function Home() {
  return (
    <div className='flex items-center justify-between w-full gap-4 px-4 min-h-12 sm:min-h-16 bg-gradient-to-br text-white from-blue-600 to-purple-600 mb-4 border-b-black border-b-[0.5px]'>
      <h1 className='font-header font-semibold text-lg sm:text-2xl grow'>Coworking World</h1>
      <Account />
    </div>
  );
}
