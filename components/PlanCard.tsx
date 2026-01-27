import { Reports } from '@/types/types';
import PlanStatsCard from './PlanStatsCard';
import { Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UseMutateFunction } from '@tanstack/react-query';
import Image from 'next/image';

export default function PlanCard({
  plan,
  onContinue,
  reports,
  deleting,
  onDelete,
}: {
  plan: {
    cover_image: string;
    created_at: string;
    description: string;
    dislikes_count: number;
    id: string;
    likes_count: number;
    status: string;
    title: string;
    total_days: number;
  };
  onContinue: () => void;
  reports: Reports[];
  deleting: boolean;
  onDelete: UseMutateFunction<void, Error, string, unknown>;
}) {
  const router = useRouter();
  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${plan.title}"?\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    onDelete(plan.id);
  };
  return (
    <div className="border rounded-2xl overflow-hidden bg-white dark:bg-black shadow-sm">
      {plan.cover_image ? (
        <Image
          src={plan.cover_image}
          alt={plan.title}
          className="h-40 w-full object-cover"
          width={100}
          height={100}
        />
      ) : (
        <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400">
          No cover
        </div>
      )}

      <div className="p-5 space-y-3">
        <h3 className="font-semibold text-lg">{plan.title}</h3>

        <p className="text-sm text-gray-500 line-clamp-2">{plan.description}</p>

        {/* ✅ Stats */}
        <PlanStatsCard
          likes={plan.likes_count}
          dislikes={plan.dislikes_count}
          reports={reports.length}
        />

        <div className="flex items-center justify-between pt-3">
          <span className="text-sm text-gray-400">{plan.total_days} days</span>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push(`/plans/${plan.id}/edit`)}>
              <Edit />
            </button>
            {/* Delete */}
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-500 hover:text-red-600 disabled:opacity-50">
              <Trash2 size={18} />
            </button>
          </div>
          <button onClick={onContinue} className="text-indigo-600 font-medium hover:underline">
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
