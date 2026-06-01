import type { Metadata } from 'next';
import DownloadSection from '@/src/components/DownloadSection';
import { isBetaSite } from '@/src/lib/site-channel';

export const metadata: Metadata = isBetaSite
  ? {
      title: 'Download Beta | Things Above',
      description: 'Download the latest Things Above beta for iOS through TestFlight or Android.',
    }
  : {
      title: 'Download Things Above',
      description: 'Download Things Above for iPhone, iPad, and Android.',
    };

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <DownloadSection />
    </main>
  );
}
