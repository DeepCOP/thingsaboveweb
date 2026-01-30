'use client';

import { useParams, useRouter } from 'next/navigation';
import Spinner from '@/src/components/ui/Spinner';
import {
  useDeleteDevotionalPlan,
  useGetPlanReports,
  useMyDevotionalPlans,
} from '@/src/hooks/useDevotional';
import { useAuth } from '@/src/state/AuthContext';
import PlanCard from '@/src/components/PlanCard';

export default function MyPlansPage() {
  const { session, loading: sessionLoading } = useAuth();
  const router = useRouter();
  const deletePlan = useDeleteDevotionalPlan();

  const { data, isLoading: plansLoading, error } = useMyDevotionalPlans(session?.user.id);
  const planIds = data?.map((d) => d.id);
  const { data: reports, isLoading: reportsLoading } = useGetPlanReports(
    session?.user?.id,
    planIds || [],
  );
  const draftPlans = data?.filter((p) => p.status === 'draft') ?? [];
  const publishedPlans = data?.filter((p) => p.status === 'published') ?? [];

  if (plansLoading || sessionLoading || reportsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  if (error) {
    return <p className="text-center text-red-500">Failed to load plans</p>;
  }
  if (!data?.length)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">You haven’t created any plans yet</p>
        <button
          onClick={() => router.push('/plans/new')}
          className="px-6 py-3 rounded-full bg-indigo-600 text-white">
          Create Your First Plan
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-14">
      <h1 className="text-3xl font-bold">My Devotional Plans</h1>

      {/* ================= Draft Plans ================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Drafts</h2>

          <button
            onClick={() => router.push('/plans/new')}
            className="text-sm text-indigo-600 hover:underline">
            + New Plan
          </button>
        </div>

        {draftPlans.length === 0 ? (
          <p className="text-gray-500 text-sm">No draft plans</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {draftPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onContinue={() => router.push(`/plans/${plan.id}/days`)}
                reports={reports || []}
                onDelete={deletePlan.mutate}
                deleting={deletePlan.isPending}
              />
            ))}
          </div>
        )}
      </section>

      {/* ================= Published Plans ================= */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Published</h2>

        {publishedPlans.length === 0 ? (
          <p className="text-gray-500 text-sm">No published plans yet</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onContinue={() => router.push(`/plans/${plan.id}/days`)}
                reports={reports || []}
                onDelete={deletePlan.mutate}
                deleting={deletePlan.isPending}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
