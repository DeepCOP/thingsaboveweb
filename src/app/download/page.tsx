import type { Metadata } from 'next';
import DownloadSection from '@/src/components/DownloadSection';

export const metadata: Metadata = {
  title: 'Download Beta | Things Above',
  description: 'Download the latest Things Above beta for iOS through TestFlight or Android.',
};

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <DownloadSection />
    </main>
  );
}
