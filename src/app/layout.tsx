import '@fontsource/space-grotesk/400.css'; // Specify weight
import '@fontsource/space-grotesk/600.css'; // Specify weight
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import './globals.css';

import Providers from '@/components/Providers';
import Footer from '@/components/Site/Footer';
import Header from '@/components/Site/Header';

import { cn } from '@/lib/utils';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITENAME || 'Coworking World',
  description: "On the Internet, you're never working alone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={cn('font-sans antialiased bg-purple-100', fontSans.variable)}>
        <Providers>
          <div className='flex min-h-screen flex-col'>
            <Header />
            <div className='flex-grow justify-center items-center max-w-xl mx-auto'>{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
