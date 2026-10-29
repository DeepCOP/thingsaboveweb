'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpDown, BookOpen, CircleAlert, Plus, Search, X } from 'lucide-react';
import {
  useDeleteDevotionalPlan,
  useGetPlanReports,
  useMyDevotionalPlans,
} from '@/src/hooks/useDevotionalPlan';
import { useAuth } from '@/src/state/AuthContext';
import PlanCard from '@/src/components/PlanCard';
import { GetMyDevotionalPlans } from '@/src/types/types';

type PlanFilter = 'all' | 'draft' | 'private' | 'public';
type PlanSort = 'newest' | 'oldest' | 'title';

const filters: { value: PlanFilter; label: string; description: string }[] = [
  {
    value: 'all',
    label: 'All plans',
    description: 'Your drafts and published plans, in one place.',
  },
  { value: 'draft', label: 'Drafts', description: 'Pick up where you left off and keep writing.' },
  { value: 'private', label: 'Private', description: 'Published plans for the people you invite.' },
  {
    value: 'public',
    label: 'Public',
    description: 'Published plans readers can discover and follow.',
  },
];

const primaryActionClass =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950';

function matchesFilter(plan: GetMyDevotionalPlans[number], filter: PlanFilter) {
  if (filter === 'all') return true;
  if (filter === 'draft') return plan.status === 'draft';
  if (filter === 'private') return plan.status === 'published' && plan.visibility === 'private';
  return plan.status === 'published' && plan.visibility !== 'private';
}

export default function MyPlansPage() {
  const { session, loading: sessionLoading } = useAuth();
  const router = useRouter();
  const deletePlan = useDeleteDevotionalPlan();
  const plansQuery = useMyDevotionalPlans(session?.user.id);
  const plans = plansQuery.data ?? [];
  const reportsQuery = useGetPlanReports(
    session?.user.id,
    plans.map((plan) => plan.id),
  );
  const [filter, setFilter] = useState<PlanFilter>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<PlanSort>('newest');
  const searchTerm = search.trim().toLowerCase();
  const activeFilter = filters.find((item) => item.value === filter)!;
  const isLoading = sessionLoading || plansQuery.isLoading;

  const visiblePlans = plans
    .filter((plan) => {
      const searchableText = [plan.title, plan.description].join(' ').toLowerCase();
      return matchesFilter(plan, filter) && searchableText.includes(searchTerm);
    })
    .sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title);
      const dateDifference = (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0);
      return sort === 'oldest' ? -dateDifference : dateDifference;
    });

  function resetFilters() {
    setFilter('all');
    setSearch('');
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-stone-50/80 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
              Your library
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              My devotional plans
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-400 sm:text-base">
              Make room for your next idea. Write, refine, and share it here.
            </p>
          </div>
          {session && (
            <Link href="/plans/new" className={`${primaryActionClass} shrink-0 self-start`}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              New plan
            </Link>
          )}
        </header>

        {isLoading ? (
          <PlansLoading />
        ) : !session ? (
          <LibraryEmptyState
            title="Your plans are waiting for you"
            description="Sign in to continue writing and manage the plans you share.">
            <Link href="/auth/login" className={primaryActionClass}>
              Sign in
            </Link>
          </LibraryEmptyState>
        ) : plansQuery.error ? (
          <div
            role="alert"
            className="rounded-2xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <CircleAlert
              className="mx-auto mb-4 h-8 w-8 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
            <h2 className="text-lg font-semibold">We couldn&apos;t load your plans</h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Please try again in a moment.
            </p>
            <button
              type="button"
              onClick={() => plansQuery.refetch()}
              disabled={plansQuery.isFetching}
              className={`${primaryActionClass} mt-6 disabled:cursor-wait disabled:opacity-60`}>
              {plansQuery.isFetching ? 'Trying again…' : 'Try again'}
            </button>
          </div>
        ) : plans.length === 0 ? (
          <LibraryEmptyState
            title="Your next plan starts here"
            description="A passage, a reflection, a few words of encouragement. Turn your inspiration into a plan, one day at a time.">
            <Link href="/plans/new" className={primaryActionClass}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create your first plan
            </Link>
          </LibraryEmptyState>
        ) : (
          <>
            <div className="mb-8 space-y-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div
                  role="group"
                  aria-label="Filter plans by status"
                  className="flex flex-wrap gap-1.5">
                  {filters.map((item) => {
                    const count = plans.filter((plan) => matchesFilter(plan, item.value)).length;
                    const isActive = filter === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setFilter(item.value)}
                        className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 ${isActive ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300' : 'text-neutral-600 hover:bg-white hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100'}`}>
                        {item.label}
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-xs tabular-nums ${isActive ? 'bg-white/70 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-neutral-200/60 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="relative w-full sm:max-w-xs">
                  <label htmlFor="plan-search" className="sr-only">
                    Search your plans
                  </label>
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                    aria-hidden="true"
                  />
                  <input
                    id="plan-search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search your plans…"
                    className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-neutral-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 dark:border-neutral-800 dark:bg-neutral-900 dark:placeholder:text-neutral-400"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <h2 className="text-lg font-semibold">{activeFilter.label}</h2>
                    <p
                      aria-live="polite"
                      aria-atomic="true"
                      className="text-sm text-neutral-500 dark:text-neutral-400">
                      {visiblePlans.length} {visiblePlans.length === 1 ? 'plan' : 'plans'}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    {activeFilter.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start text-sm text-neutral-600 dark:text-neutral-400">
                  <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
                  <label htmlFor="plan-sort" className="sr-only">
                    Sort plans
                  </label>
                  <select
                    id="plan-sort"
                    value={sort}
                    onChange={(event) => setSort(event.target.value as PlanSort)}
                    className="min-h-[44px] rounded-lg border border-transparent bg-transparent py-2 pl-1 pr-3 text-sm outline-none focus-visible:border-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-600/15 dark:bg-neutral-950">
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="title">Title A–Z</option>
                  </select>
                </div>
              </div>
            </div>

            {deletePlan.isError && (
              <div
                role="alert"
                className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                <p>We couldn&apos;t delete this plan. Please try again.</p>
                <button
                  type="button"
                  onClick={() => deletePlan.reset()}
                  aria-label="Dismiss deletion error"
                  className="rounded-lg p-2 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-red-900">
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
            {reportsQuery.isError && (
              <div
                role="status"
                className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                <p>Reader reports couldn&apos;t be loaded. Your plans are still available.</p>
                <button
                  type="button"
                  onClick={() => reportsQuery.refetch()}
                  disabled={reportsQuery.isFetching}
                  className="rounded px-1 py-1 font-semibold underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 disabled:opacity-60">
                  {reportsQuery.isFetching ? 'Retrying…' : 'Retry reports'}
                </button>
              </div>
            )}

            {visiblePlans.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visiblePlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onContinue={() => router.push(`/plans/${plan.id}/days`)}
                    reports={reportsQuery.data ?? []}
                    reportsLoading={reportsQuery.isLoading}
                    reportsUnavailable={reportsQuery.isError}
                    onDelete={deletePlan.mutate}
                    deleting={deletePlan.isPending}
                    isDeleting={deletePlan.isPending && deletePlan.variables === plan.id}
                  />
                ))}
              </div>
            ) : (
              <LibraryEmptyState
                title={searchTerm ? 'No plans match your search' : `No ${filter} plans yet`}
                description={
                  searchTerm
                    ? 'Try another title, topic, or keyword, or explore all your plans.'
                    : filter === 'draft'
                      ? 'Create a new plan when inspiration comes, or revisit one you have already published.'
                      : 'Your plans will appear here once they are published with this visibility.'
                }>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="min-h-[44px] rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus-visible:ring-offset-neutral-950">
                  {searchTerm ? 'Clear filters' : 'View all plans'}
                </button>
              </LibraryEmptyState>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function LibraryEmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/60 px-6 py-16 text-center dark:border-neutral-800 dark:bg-neutral-900/30 sm:py-20">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
        <BookOpen className="h-7 w-7" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-600 dark:text-neutral-400">
        {description}
      </p>
      <div className="mt-7">{children}</div>
    </div>
  );
}

function PlansLoading() {
  return (
    <div role="status" aria-label="Loading your plans">
      <span className="sr-only">Loading your plans…</span>
      <div
        aria-hidden="true"
        className="grid grid-cols-1 gap-6 motion-safe:animate-pulse sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div className="aspect-[16/9] bg-neutral-200/70 dark:bg-neutral-800" />
            <div className="space-y-4 p-5">
              <div className="h-4 w-20 rounded bg-neutral-100 dark:bg-neutral-800" />
              <div className="h-6 w-3/4 rounded bg-neutral-200/70 dark:bg-neutral-800" />
              <div className="h-4 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
              <div className="h-4 w-2/3 rounded bg-neutral-100 dark:bg-neutral-800" />
              <div className="!mt-7 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
