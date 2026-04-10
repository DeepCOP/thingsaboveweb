import Hero from '@/src/components/Hero';
import Features from '@/src/components/Features';
import HowItWorks from '@/src/components/HowItWorks';
import Community from '@/src/components/Community';
import Adoption from '@/src/components/Adoption';
import CTA from '@/src/components/CTA';
import { getAdoptionMetrics } from '@/src/lib/adoption';

export default async function Home() {
  const adoptionMetrics = await getAdoptionMetrics();

  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <Community />
      <Adoption {...adoptionMetrics} />
      <CTA />
    </main>
  );
}
