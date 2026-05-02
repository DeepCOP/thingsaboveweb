'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useCreateDevotionalPlan, usePlanTags } from '@/src/hooks/useDevotionalPlan';
import { uploadPlanCover } from '@/src/lib/utils';
import { useAuth } from '@/src/state/AuthContext';

export default function CreatePlanPage() {
  const router = useRouter();
  const { session } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [totalDays, setTotalDays] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const createPlanMutation = useCreateDevotionalPlan();
  const {
    data: availableTags = [],
    isLoading: isLoadingPlanTags,
    isError: hasPlanTagsError,
  } = usePlanTags();

  const TITLE_MAX = 120;
  const DESCRIPTION_MAX = 500;
  const MAX_DAYS = 365;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  };

  const disabled =
    !title || !description || totalDays < 1 || uploadingImage || createPlanMutation.isPending;

  async function createPlan() {
    if (!session?.user) {
      return;
    }

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

    let coverImageUrl: string | undefined;
    const planId = crypto.randomUUID();

    if (coverFile) {
      setUploadingImage(true);
      coverImageUrl = await uploadPlanCover({
        file: coverFile,
        userId: session.user.id,
        planId,
      });
      setUploadingImage(false);
    }

    createPlanMutation.mutate(
      {
        author_id: session.user.id,
        id: planId,
        title,
        description,
        visibility,
        total_days: totalDays,
        cover_image: coverImageUrl,
        tags: selectedTags.length ? selectedTags : null,
      },
      {
        onError: (error) => {
          console.error(error);
          alert('Failed to create plan');
        },
        onSuccess: () => {
          router.push(`/plans/${planId}/days`);
        },
      },
    );
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
            You can change this later from the edit page.
          </p>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tags
          </label>
          {isLoadingPlanTags ? (
            <p className="text-sm text-gray-500 dark:text-gray-300">Loading tags...</p>
          ) : hasPlanTagsError ? (
            <p className="text-sm text-red-600 dark:text-red-400">Unable to load tags right now.</p>
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
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">Pick all that apply.</p>
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
              setCoverFile(file);
              setCoverPreview(URL.createObjectURL(file));
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-indigo-600 hover:file:bg-indigo-100"
          />

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
            You&apos;ll add the content for each day next, then submit the plan for screening.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={createPlan}
            disabled={disabled}
            className={`inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              disabled ? 'cursor-not-allowed opacity-50' : ''
            }`}>
            {createPlanMutation.isPending || uploadingImage ? 'Creating...' : 'Continue'}
            <span className="text-lg">-&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
