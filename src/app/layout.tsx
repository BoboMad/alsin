import './globals.css';
import { Roboto } from 'next/font/google';
import { Geist } from 'next/font/google';
import ClientProviders from './client-providers';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

const geist = Geist({
  weight: '400',
  subsets: ['latin'],
});

export const metadata = {
  title: 'AlvsInn',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body className={roboto.className}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
