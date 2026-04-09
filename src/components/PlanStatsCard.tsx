import { ThumbsUp, Flag } from 'lucide-react';

export default function PlanStatsCard({
  helpfulCount,
  reports,
}: {
  helpfulCount: number;
  reports: number;
}) {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
      <Stat icon={<ThumbsUp className="w-4 h-4" />} value={helpfulCount} />
      <Stat
        icon={<Flag className="w-4 h-4 text-orange-500" />}
        value={reports}
        highlight={reports > 0}
      />
    </div>
  );
}

function Stat({
  icon,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center gap-1 ${highlight ? 'text-orange-600 font-medium' : ''}`}>
      {icon}
      <span>{value}</span>
    </div>
  );
}
