import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  FilePenLine,
  Flag,
  Globe2,
  Loader2,
  LockKeyhole,
  MoreHorizontal,
  PencilLine,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { UseMutateFunction } from '@tanstack/react-query';
import { GetMyDevotionalPlans, Reports } from '@/src/types/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';

export default function PlanCard({
  plan,
  onContinue,
  reports,
  deleting,
  onDelete,
  isDeleting = false,
  reportsLoading = false,
  reportsUnavailable = false,
}: {
  plan: GetMyDevotionalPlans[number];
  onContinue: () => void;
  reports: Reports[];
  deleting: boolean;
  onDelete: UseMutateFunction<void, Error, string, unknown>;
  isDeleting?: boolean;
  reportsLoading?: boolean;
  reportsUnavailable?: boolean;
}) {
  const isDraft = plan.status === 'draft';
  const isPrivate = plan.visibility === 'private';
  const reportCount = reports.filter((report) => report.plan_id === plan.id).length;
  const displayedDays = isDraft ? (plan.draft_total_days ?? plan.total_days) : plan.total_days;
  const showDraftDays =
    plan.status === 'published' &&
    plan.draft_total_days !== null &&
    plan.draft_total_days !== plan.total_days;
  const VisibilityIcon = isPrivate ? LockKeyhole : Globe2;

  const handleDelete = () => {
    if (deleting) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete "${plan.title}"?\nThis action cannot be undone.`,
    );
    if (confirmed) onDelete(plan.id);
  };

  return (
    <article
      aria-busy={isDeleting}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-[border-color,box-shadow] hover:border-emerald-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-800">
      <div className="relative aspect-[16/9] overflow-hidden bg-emerald-50 dark:bg-emerald-950/30">
        {plan.cover_image ? (
          <Image
            src={plan.cover_image}
            alt=""
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 400px"
            className="object-cover"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
            <div className="absolute h-64 w-64 rounded-full border border-emerald-200/60 dark:border-emerald-900/60" />
            <div className="absolute h-44 w-44 rounded-full border border-emerald-200/60 dark:border-emerald-900/60" />
            <BookOpen
              className="h-12 w-12 text-emerald-700/50 dark:text-emerald-400/50"
              strokeWidth={1.25}
            />
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
          <span className="inline-flex min-h-[2rem] items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-semibold text-stone-800 shadow-sm backdrop-blur-sm dark:bg-neutral-900/95 dark:text-neutral-100">
            {isDraft ? (
              <PencilLine
                aria-hidden="true"
                className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400"
              />
            ) : (
              <VisibilityIcon
                aria-hidden="true"
                className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400"
              />
            )}
            {isDraft ? 'Draft' : `Published · ${isPrivate ? 'Private' : 'Public'}`}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={`Actions for ${plan.title}`}
                disabled={isDeleting}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/95 text-stone-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:opacity-50 dark:bg-neutral-900/95 dark:text-neutral-200 dark:hover:bg-neutral-800">
                <MoreHorizontal aria-hidden="true" className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl p-1.5">
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2.5">
                <Link href={`/plans/${plan.id}/edit`}>
                  <FilePenLine aria-hidden="true" />
                  Edit details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={handleDelete}
                disabled={deleting}
                className="cursor-pointer rounded-lg px-3 py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:focus:bg-red-950 dark:focus:text-red-300">
                <Trash2 aria-hidden="true" />
                Delete plan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-xl font-semibold leading-snug tracking-tight text-stone-900 dark:text-neutral-100">
          <button
            type="button"
            onClick={onContinue}
            disabled={isDeleting}
            title={plan.title}
            className="line-clamp-2 break-words rounded-sm text-left transition-colors hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:hover:text-emerald-400">
            {plan.title}
          </button>
        </h3>
        <p className="mt-2 line-clamp-2 min-h-[2.5rem] break-words text-sm leading-5 text-stone-500 dark:text-neutral-400">
          {plan.description || 'Add a description to introduce your plan to readers.'}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-1.5 font-medium text-stone-700 dark:text-neutral-200">
            <BookOpen aria-hidden="true" className="h-4 w-4 text-stone-400 dark:text-neutral-500" />
            {displayedDays} {displayedDays === 1 ? 'day' : 'days'}
          </span>
          {isDraft ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-stone-500 dark:text-neutral-400">
              <VisibilityIcon aria-hidden="true" className="h-3.5 w-3.5" />
              {isPrivate ? 'Private' : 'Public'} when published
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-stone-500 dark:text-neutral-400">
              <ThumbsUp aria-hidden="true" className="h-4 w-4" />
              {plan.helpful_count} helpful
            </span>
          )}
        </div>
        {showDraftDays && (
          <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <PencilLine aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            Saved draft: {plan.draft_total_days} {plan.draft_total_days === 1 ? 'day' : 'days'}
          </p>
        )}
        {!reportsLoading && !reportsUnavailable && reportCount > 0 && (
          <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-amber-800 dark:text-amber-300">
            <Flag aria-hidden="true" className="h-3.5 w-3.5" />
            {reportCount} {reportCount === 1 ? 'report' : 'reports'}
          </p>
        )}
        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={onContinue}
            disabled={isDeleting}
            className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 dark:focus-visible:ring-offset-neutral-900 ${
              isDraft
                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                : 'bg-stone-100 text-stone-800 hover:bg-stone-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700'
            }`}>
            <span>{isDeleting ? 'Deleting…' : isDraft ? 'Continue writing' : 'Edit days'}</span>
            {isDeleting ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 motion-safe:animate-spin" />
            ) : (
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
