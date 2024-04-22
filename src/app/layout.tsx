import '@fontsource/space-grotesk/400.css'; // Specify weight
import '@fontsource/space-grotesk/600.css'; // Specify weight
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter as FontSans } from 'next/font/google';

import './globals.css';

import { TooltipProvider } from '@/components/ui/tooltip';

import Footer from '@/components/Site/Footer';
import Header from '@/components/Site/Header';

import { cn } from '@/lib/utils';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={cn('font-sans antialiased', fontSans.variable)}>
        <SessionProvider>
          <TooltipProvider>
            <div className='flex min-h-screen flex-col'>
              <Header />
              <div className='flex-grow justify-center items-center max-w-xl mx-auto'>
                {children}
              </div>
              <Footer />
            </div>
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
