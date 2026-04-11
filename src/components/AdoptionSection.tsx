import Adoption from '@/src/components/Adoption';
import { getAdoptionMetrics } from '@/src/lib/adoption';

export default async function AdoptionSection() {
  const adoptionMetrics = await getAdoptionMetrics();

  return <Adoption {...adoptionMetrics} />;
}
