import { Suspense } from 'react';
import Hero from '@/src/components/Hero';
import Features from '@/src/components/Features';
import HowItWorks from '@/src/components/HowItWorks';
import Community from '@/src/components/Community';
import AdoptionSection from '@/src/components/AdoptionSection';
import AdoptionSkeleton from '@/src/components/AdoptionSkeleton';
import DownloadSection from '@/src/components/DownloadSection';
import CTA from '@/src/components/CTA';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <Community />
      <Suspense fallback={<AdoptionSkeleton />}>
        <AdoptionSection />
      </Suspense>
      <DownloadSection />
      <CTA />
    </main>
  );
}
