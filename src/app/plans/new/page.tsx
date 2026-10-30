'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { saveDevotionalDraft } from '@/src/api/mutations';
import PlanImportDialog from '@/src/components/PlanImportDialog';
import ImportedCoverPreview from '@/src/components/ImportedCoverPreview';
import { useCreateDevotionalPlan, usePlanTags } from '@/src/hooks/useDevotionalPlan';
import { createImportedDays, ImportedPlan, MAX_IMPORT_DAYS } from '@/src/lib/planImport';
import {
  MAX_PLAN_COVER_IMAGE_MB,
  isPlanCoverImageTooLarge,
  uploadPlanCover,
} from '@/src/lib/utils';
import { useAuth } from '@/src/state/AuthContext';

export default function CreatePlanPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [totalDays, setTotalDays] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [importedCoverUrl, setImportedCoverUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [importedDays, setImportedDays] = useState<ReturnType<typeof createImportedDays> | null>(
    null,
  );
  const [openImportOnLoad, setOpenImportOnLoad] = useState(false);
  const [createdPlanId, setCreatedPlanId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const createInFlightRef = useRef(false);
  const createPlanMutation = useCreateDevotionalPlan();
  const {
    data: availableTags = [],
    isLoading: isLoadingPlanTags,
    isError: hasPlanTagsError,
  } = usePlanTags();

  const TITLE_MAX = 120;
  const DESCRIPTION_MAX = 500;
  const MAX_DAYS = MAX_IMPORT_DAYS;

  useEffect(() => {
    setOpenImportOnLoad(new URLSearchParams(window.location.search).get('import') === '1');
  }, []);

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  function importPlan(plan: ImportedPlan) {
    const nextDays = createImportedDays(plan.days);
    setImportedDays(nextDays);
    setTotalDays(nextDays.length);
    setTitle((current) => (current.trim() ? current : (plan.title ?? current)));
    setDescription((current) => (current.trim() ? current : (plan.description ?? current)));
    setImportedCoverUrl(plan.coverImage ?? null);
    setCreateError(null);
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  };

  const disabled =
    !session?.user ||
    !title.trim() ||
    !description.trim() ||
    totalDays < 1 ||
    totalDays > MAX_DAYS ||
    isSubmitting;

  async function createPlan() {
    if (disabled || createInFlightRef.current || !session?.user) return;

    if (title.length > TITLE_MAX) {
      alert(`Title must be ${TITLE_MAX} characters or fewer.`);
      return;
    }

    if (description.length > DESCRIPTION_MAX) {
      alert(`Description must be ${DESCRIPTION_MAX} characters or fewer.`);
      return;
    }

    if (totalDays > MAX_DAYS) {
      alert(`Number of days cannot exceed ${MAX_DAYS}.`);
      return;
    }

    createInFlightRef.current = true;
    setIsSubmitting(true);
    setCreateError(null);
    let planId = createdPlanId;

    try {
      if (!planId) {
        const nextPlanId = crypto.randomUUID();
        let coverImageUrl: string | undefined = importedCoverUrl ?? undefined;

        if (coverFile) {
          if (isPlanCoverImageTooLarge(coverFile)) {
            throw new Error(`Cover image must be ${MAX_PLAN_COVER_IMAGE_MB} MB or smaller.`);
          }
          setUploadingImage(true);
          try {
            coverImageUrl = await uploadPlanCover({
              file: coverFile,
              userId: session.user.id,
              planId: nextPlanId,
            });
            if (!coverImageUrl) throw new Error('The cover image could not be uploaded.');
          } finally {
            setUploadingImage(false);
          }
        }

        await createPlanMutation.mutateAsync({
          author_id: session.user.id,
          id: nextPlanId,
          title: title.trim(),
          description: description.trim(),
          visibility,
          total_days: importedDays?.length ?? totalDays,
          cover_image: coverImageUrl,
          tags: selectedTags.length ? selectedTags : null,
        });
        planId = nextPlanId;
        setCreatedPlanId(nextPlanId);
      }

      if (importedDays) {
        await saveDevotionalDraft(importedDays, planId);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['devotional-drafts', planId] }),
          queryClient.invalidateQueries({ queryKey: ['my-devotional-plans'] }),
        ]);
      }

      router.push(`/plans/${planId}/days`);
    } catch (error) {
      console.error(error);
      setCreateError(
        planId
          ? 'Your plan was created, but the imported days could not be saved. Retry below to save them to the same plan. Keep this page open until they are saved.'
          : 'Could not create your plan. Your form and imported days are still here. Please try again.',
      );
    } finally {
      createInFlightRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 mb-20">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:bg-black">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Create Devotional Plan
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-200">
            Start with the basics here. You&apos;ll add each day next, then submit the finished
            draft for screening. If it passes, it will publish automatically with the visibility you
            choose here.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-indigo-950 dark:text-indigo-100">
                Have a plan in a spreadsheet?
              </h2>
              <p className="mt-1 text-sm text-indigo-800 dark:text-indigo-200">
                Import one plan from Excel or CSV, then review its details.
              </p>
            </div>
            <PlanImportDialog
              onImport={importPlan}
              defaultOpen={openImportOnLoad}
              disabled={isSubmitting || !!createdPlanId}
              triggerLabel={importedDays ? 'Choose another file' : 'Import plan'}
            />
          </div>
          {importedDays && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-indigo-200 pt-3 text-sm dark:border-indigo-900">
              <p role="status" className="text-indigo-950 dark:text-indigo-100">
                {importedDays.length} {importedDays.length === 1 ? 'day ready' : 'days ready'} to
                save as a draft. You can edit them on the next page.
              </p>
              <button
                type="button"
                disabled={isSubmitting || !!createdPlanId}
                onClick={() => {
                  setImportedDays(null);
                  setTotalDays(1);
                }}
                className="font-medium text-indigo-700 underline underline-offset-4 disabled:opacity-50 dark:text-indigo-300">
                Remove imported days
              </button>
            </div>
          )}
        </div>

        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-semibold">Content standards</p>
          <p className="mt-2 leading-6">
            All submitted devotional content must not violate historical Christian principles.
            ThingsAbove strictly enforces this standard. Review the{' '}
            <Link href="/terms" className="underline underline-offset-4">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/statement-of-faith" className="underline underline-offset-4">
              Statement of Faith
            </Link>{' '}
            before you publish.
          </p>
        </div>

        <fieldset disabled={isSubmitting || !!createdPlanId}>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Plan Title
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-300"
              placeholder="e.g. Walking with God"
              value={title}
              maxLength={TITLE_MAX}
              required
              onChange={(e) => setTitle(e.target.value)}
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-300">
              {title.length}/{TITLE_MAX}
            </p>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Short Description
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-300"
              placeholder="What is this devotional about?"
              value={description}
              maxLength={DESCRIPTION_MAX}
              required
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-300">
              {description.length}/{DESCRIPTION_MAX}
            </p>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Visibility
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setVisibility('public')}
                className={`rounded-2xl border p-4 text-left transition ${
                  visibility === 'public'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}>
                <p className="font-semibold">Public plan</p>
                <p className="mt-2 text-sm leading-6 text-current/80">
                  Discoverable after screening. Readers can find it in plan lists and search.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setVisibility('private')}
                className={`rounded-2xl border p-4 text-left transition ${
                  visibility === 'private'
                    ? 'border-amber-500 bg-amber-50 text-amber-950'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}>
                <p className="font-semibold">Private plan</p>
                <p className="mt-2 text-sm leading-6 text-current/80">
                  Hidden from discovery. Only people you manually share it with can join.
                </p>
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
              You can change this later from the edit page. Published private plans require another
              screening pass before they can become public.
            </p>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags
            </label>
            {isLoadingPlanTags ? (
              <p className="text-sm text-gray-500 dark:text-gray-300">Loading tags...</p>
            ) : hasPlanTagsError ? (
              <p className="text-sm text-red-600 dark:text-red-400">
                Unable to load tags right now.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`rounded-full border px-3 py-1 text-sm transition ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                        }`}>
                        {tag}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Pick all that apply.
                </p>
              </>
            )}
          </div>

          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cover Image (optional)
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                if (isPlanCoverImageTooLarge(file)) {
                  alert(`Cover image must be ${MAX_PLAN_COVER_IMAGE_MB} MB or smaller.`);
                  e.currentTarget.value = '';
                  setCoverFile(null);
                  setCoverPreview(null);
                  return;
                }

                setCoverFile(file);
                setCoverPreview(URL.createObjectURL(file));
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-indigo-600 hover:file:bg-indigo-100"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-300">
              Maximum file size: {MAX_PLAN_COVER_IMAGE_MB} MB.
            </p>

            {coverPreview && (
              <div className="mt-4">
                <Image
                  src={coverPreview}
                  alt="Cover preview"
                  className="h-48 w-full rounded-xl object-cover"
                  width={100}
                  height={100}
                />
              </div>
            )}
            {importedCoverUrl && (
              <div className="mt-4 space-y-2">
                {coverFile ? (
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    Your uploaded cover will replace the cover URL from the file.
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-medium">Cover from imported file</p>
                    <ImportedCoverPreview src={importedCoverUrl} />
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setImportedCoverUrl(null)}
                  className="text-sm text-indigo-600 underline underline-offset-4 dark:text-indigo-400">
                  Remove imported cover
                </button>
              </div>
            )}
          </div>

          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Number of Days
            </label>
            <input
              type="number"
              min={1}
              max={MAX_DAYS}
              className="w-32 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-300"
              value={totalDays}
              disabled={!!importedDays}
              required
              onChange={(e) => {
                const nextValue = Number(e.target.value);
                if (Number.isNaN(nextValue)) {
                  setTotalDays(1);
                  return;
                }
                setTotalDays(Math.min(Math.max(nextValue, 1), MAX_DAYS));
              }}
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
              {importedDays
                ? 'The number of days comes from your imported file. You can add or remove days in the editor.'
                : "You'll add the content for each day next, then submit the plan for screening."}
            </p>
          </div>
        </fieldset>

        {createError && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
            <p>{createError}</p>
            {createdPlanId && (
              <Link
                href={`/plans/${createdPlanId}/days`}
                className="mt-2 inline-block font-medium underline underline-offset-4">
                Open created draft (imported days may still need saving)
              </Link>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={createPlan}
            disabled={disabled}
            className={`inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              disabled ? 'cursor-not-allowed opacity-50' : ''
            }`}>
            {uploadingImage
              ? 'Uploading cover...'
              : isSubmitting
                ? 'Saving plan...'
                : createdPlanId
                  ? importedDays
                    ? 'Retry saving imported days'
                    : 'Open created plan'
                  : importedDays
                    ? 'Create plan with imported days'
                    : 'Continue'}
            <span className="text-lg">-&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
