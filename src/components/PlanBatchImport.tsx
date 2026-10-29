'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { createImportedDevotionalPlan, saveDevotionalDraft } from '@/src/api/mutations';
import { usePlanTags } from '@/src/hooks/useDevotionalPlan';
import { createImportedDays, type ImportedPlan } from '@/src/lib/planImport';
import { runPlanImportBatch, type PlanImportTask } from '@/src/lib/planImportBatch';
import { useAuth } from '@/src/state/AuthContext';
import ImportedCoverPreview from './ImportedCoverPreview';

export default function PlanBatchImport({
  plans,
  initialVisibility,
  initialTags,
  onBack,
}: {
  plans: ImportedPlan[];
  initialVisibility: 'public' | 'private';
  initialTags: string[];
  onBack: () => void;
}) {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const {
    data: availableTags = [],
    isLoading: isLoadingPlanTags,
    isError: hasPlanTagsError,
  } = usePlanTags();
  const [tasks, setTasks] = useState<PlanImportTask[]>(() =>
    plans.map((plan, index) => ({
      id: crypto.randomUUID(),
      label: plan.key || plan.title || `Plan ${index + 1}`,
      title: plan.title || '',
      description: plan.description || '',
      coverImage: plan.coverImage,
      visibility: initialVisibility,
      tags: [...initialTags],
      days: createImportedDays(plan.days),
      created: false,
      status: 'pending',
    })),
  );
  const [started, setStarted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);
  const authorId = useRef<string | null>(null);
  const savedCount = tasks.filter((task) => task.status === 'saved').length;
  const failedCount = tasks.filter((task) => task.status === 'failed').length;
  const allSaved = savedCount === tasks.length;
  const missingDetails = tasks.some((task) => !task.title.trim() || !task.description.trim());

  function updateDetails(
    index: number,
    updates: Partial<
      Pick<PlanImportTask, 'title' | 'description' | 'coverImage' | 'visibility' | 'tags'>
    >,
  ) {
    if (started) return;
    setTasks((current) => current.map((task, i) => (i === index ? { ...task, ...updates } : task)));
  }

  async function savePlans() {
    if (saving || inFlight.current || !session?.user || missingDetails || allSaved) return;
    if (authorId.current && authorId.current !== session.user.id) {
      setError('Sign in with the account that started this import to retry saving.');
      return;
    }
    authorId.current = session.user.id;
    inFlight.current = true;
    setStarted(true);
    setSaving(true);
    setError(null);
    try {
      const results = await runPlanImportBatch(
        tasks,
        {
          authorId: session.user.id,
        },
        {
          createPlan: createImportedDevotionalPlan,
          saveDraft: saveDevotionalDraft,
        },
        setTasks,
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['my-devotional-plans'] }),
        ...results
          .filter((task) => task.created)
          .map((task) =>
            queryClient.invalidateQueries({ queryKey: ['devotional-drafts', task.id] }),
          ),
      ]);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'The import could not finish. Please retry.',
      );
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto mb-20 max-w-3xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Review {tasks.length} imported plans
        </h1>
        <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          Check each plan and choose its visibility and tags before creating the drafts.
        </p>
      </div>

      <div className="space-y-4">
        {tasks.map((task, index) => (
          <section
            key={task.id}
            aria-label={`Plan ${index + 1}: ${task.label}`}
            className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="break-words font-semibold">
                {index + 1}. {task.label}
              </h2>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {task.days.length} {task.days.length === 1 ? 'day' : 'days'}
              </span>
            </div>
            <fieldset disabled={started} className="space-y-3">
              <div>
                <label htmlFor={`plan-title-${task.id}`} className="block text-sm font-medium">
                  Title
                </label>
                <input
                  id={`plan-title-${task.id}`}
                  required
                  maxLength={120}
                  value={task.title}
                  onChange={(event) => updateDetails(index, { title: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 disabled:opacity-70 dark:border-neutral-700"
                />
              </div>
              <div>
                <label
                  htmlFor={`plan-description-${task.id}`}
                  className="block text-sm font-medium">
                  Description
                </label>
                <textarea
                  id={`plan-description-${task.id}`}
                  required
                  maxLength={500}
                  rows={3}
                  value={task.description}
                  onChange={(event) => updateDetails(index, { description: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 disabled:opacity-70 dark:border-neutral-700"
                />
              </div>
              <div>
                <label htmlFor={`plan-visibility-${task.id}`} className="block text-sm font-medium">
                  Visibility after approval
                </label>
                <select
                  id={`plan-visibility-${task.id}`}
                  value={task.visibility}
                  onChange={(event) =>
                    updateDetails(index, {
                      visibility: event.target.value === 'private' ? 'private' : 'public',
                    })
                  }
                  className="mt-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm disabled:opacity-70 dark:border-neutral-700 dark:bg-neutral-900">
                  <option value="public">Public — discoverable after screening</option>
                  <option value="private">Private — shared by you</option>
                </select>
              </div>
              <div>
                <p className="text-sm font-medium">Tags</p>
                {isLoadingPlanTags ? (
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    Loading tags…
                  </p>
                ) : hasPlanTagsError ? (
                  <p className="mt-2 text-sm text-red-700 dark:text-red-400">
                    Tags could not be loaded. You can continue without them and add tags later.
                  </p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {availableTags.map((tag) => {
                      const selected = task.tags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          aria-pressed={selected}
                          onClick={() =>
                            updateDetails(index, {
                              tags: selected
                                ? task.tags.filter((currentTag) => currentTag !== tag)
                                : [...task.tags, tag],
                            })
                          }
                          className={`rounded-full border px-3 py-1.5 text-sm transition disabled:opacity-70 ${
                            selected
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200'
                              : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200'
                          }`}>
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              {task.coverImage && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Cover from imported file</p>
                  <ImportedCoverPreview src={task.coverImage} />
                  <button
                    type="button"
                    onClick={() => updateDetails(index, { coverImage: undefined })}
                    className="text-sm text-indigo-600 underline underline-offset-4 dark:text-indigo-400">
                    Remove imported cover
                  </button>
                </div>
              )}
            </fieldset>
            <div aria-live="polite" className="text-sm">
              {task.status === 'creating' && <p>Creating plan…</p>}
              {task.status === 'saving' && <p>Saving days…</p>}
              {task.status === 'saved' && (
                <p className="font-medium text-emerald-700 dark:text-emerald-400">Draft saved</p>
              )}
              {task.error && <p className="text-red-700 dark:text-red-400">{task.error}</p>}
            </div>
            {task.created && !saving && (
              <Link
                href={`/plans/${task.id}/days`}
                className="inline-block text-sm font-medium text-indigo-600 underline underline-offset-4 dark:text-indigo-400">
                {task.status === 'saved'
                  ? 'Review saved days'
                  : 'Open plan (imported days still need saving)'}
              </Link>
            )}
          </section>
        ))}
      </div>

      <div className="space-y-3 rounded-xl border border-neutral-200 p-5 dark:border-neutral-700">
        {started && (
          <p role="status" className="font-medium">
            {savedCount} of {tasks.length} plans saved
            {failedCount ? ` · ${failedCount} need a retry` : ''}
          </p>
        )}
        {started && !allSaved && (
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Keep this page open until the import finishes. Retrying continues unfinished plans using
            the same drafts.
          </p>
        )}
        {missingDetails && (
          <p className="text-sm text-amber-800 dark:text-amber-300">
            Add a title and description for every plan before saving.
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-red-700 dark:text-red-400">
            {error}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-end gap-3">
          {!started && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium dark:border-neutral-700">
              Back
            </button>
          )}
          {allSaved ? (
            <Link
              href="/plans/my"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white">
              View My Plans
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => void savePlans()}
              disabled={saving || !session?.user || missingDetails}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
              {saving
                ? `Saving ${savedCount} of ${tasks.length}…`
                : started
                  ? 'Retry unfinished plans'
                  : `Create ${tasks.length} draft plans`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
