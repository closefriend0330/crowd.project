import '@fontsource/space-grotesk/400.css'; // Specify weight
import '@fontsource/space-grotesk/600.css'; // Specify weight
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import './globals.css';

import Providers from '@/components/Providers';
import Footer from '@/components/Site/Footer';
import Header from '@/components/Site/Header';

import { cn } from '@/lib/utils';

import { DEFAULT_SITENAME } from '@/config';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITENAME || DEFAULT_SITENAME,
  description: 'Have fun getting stuff done.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  return (
    <html lang='en'>
      <body className={cn('font-sans antialiased bg-purple-100', fontSans.variable)}>
        <Providers>
          <div className='flex min-h-screen flex-col'>
            <Header />
            <div className='flex-grow justify-center items-center max-w-xl mx-auto'>{children}</div>
            <Footer />
            {googleAnalyticsId && <GoogleAnalytics gaId={googleAnalyticsId} />}
          </div>
        </Providers>
      </body>
    </html>
  );
}
