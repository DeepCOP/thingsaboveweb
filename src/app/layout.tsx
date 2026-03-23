import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/src/components/theme-provider';
import QueryProvider from '@/src/lib/queryClient';
import { AuthProvider } from '@/src/state/AuthContext';
import Navigation from '@/src/components/Navigation';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ThingsAbove - Daily Bible & Devotional Reading App',
  description:
    'Grow your faith one day at a time with daily devotionals, reading plans, and a supportive community. Track progress and read together with friends.',
  openGraph: {
    images: [
      {
        url: '/assets/icons/icon.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: '/assets/icons/icon.png',
      },
    ],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://thingsabove.life'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + ' pt-20'}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <AuthProvider>
            <QueryProvider>
              <Navigation />
              {children}
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
