import Adoption from '@/src/components/Adoption';
import { getAdoptionMetrics } from '@/src/lib/adoption';
import { isBetaSite } from '@/src/lib/site-channel';

const adoptionCopy = isBetaSite
  ? {
      headlineStart: 'Our first beta testers',
      headlineAccent: 'are already reading',
      intro:
        'A small but growing group of early believers helping us shape the future of ThingsAbove, one day at a time.',
      chartLabel: 'Beta tester growth',
      chartAriaLabel: 'Beta tester growth chart',
      ctaPrompt: 'Want to be part of the beta?',
      ctaLabel: 'Join early access',
    }
  : {
      headlineStart: 'Our community',
      headlineAccent: 'is already reading',
      intro:
        'Believers are building a steady Bible reading rhythm with ThingsAbove, one day at a time.',
      chartLabel: 'Reader growth',
      chartAriaLabel: 'Reader growth chart',
      ctaPrompt: 'Ready to build your daily rhythm?',
      ctaLabel: 'Create your account',
    };

export default async function AdoptionSection() {
  const adoptionMetrics = await getAdoptionMetrics();
  const stats = adoptionMetrics.stats.map((stat, index) =>
    index === 0 ? { ...stat, label: isBetaSite ? 'Beta testers' : 'Readers' } : stat,
  );

  return <Adoption {...adoptionMetrics} stats={stats} copy={adoptionCopy} />;
}
