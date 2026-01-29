import Navigation from '@/src/components/Navigation';
import Hero from '@/src/components/Hero';
import Features from '@/src/components/Features';
import HowItWorks from '@/src/components/HowItWorks';
import Community from '@/src/components/Community';
import CTA from '@/src/components/CTA';
import Footer from '@/src/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <Community />
      <CTA />
      <Footer />
    </main>
  );
}
