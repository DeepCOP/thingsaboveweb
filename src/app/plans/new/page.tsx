'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadPlanCover } from '@/src/lib/utils';
import { useAuth } from '@/src/state/AuthContext';
import { useCreateDevotionalPlan } from '@/src/hooks/useDevotionalPlan';
import Image from 'next/image';

export default function CreatePlanPage() {
  const router = useRouter();
  const { session, loading: sessionLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalDays, setTotalDays] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const createPlanMutation = useCreateDevotionalPlan();

  const TITLE_MAX = 120;
  const DESCRIPTION_MAX = 500;
  const MAX_DAYS = 365;

  const availableTags = [
    'Prayer',
    'Faith',
    'Hope',
    'Healing',
    'Gratitude',
    'Peace',
    'Wisdom',
    'Discipleship',
    'Family',
    'Leadership',
  ];

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
        userId: session?.user.id,
        planId: planId as string,
      });
      setUploadingImage(false);
    }

    createPlanMutation.mutate(
      {
        author_id: session?.user.id,
        id: planId,
        title,
        description,
        total_days: totalDays,
        cover_image: coverImageUrl,
        tags: selectedTags.length ? selectedTags : null,
      },
      {
        onError: (error) => {
          console.error(error);
          alert('Failed to create plan');
          return;
        },
        onSuccess: () => {
          router.push(`/plans/${planId}/days`);
        },
      },
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-black rounded-2xl shadow-sm border border-gray-200 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Create Devotional Plan
          </h1>
          <p className="text-gray-500 dark:text-gray-200 mt-2">
            Start by giving your devotional a title and short introduction.
          </p>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Plan Title
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 dark:text-gray-300
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. Walking with God"
            value={title}
            maxLength={TITLE_MAX}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
          <p className="text-xs text-gray-500 dark:text-gray-300 mt-2">
            {title.length}/{TITLE_MAX}
          </p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Short Description
          </label>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 dark:text-gray-300
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="What is this devotional about?"
            value={description}
            maxLength={DESCRIPTION_MAX}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="text-xs text-gray-500 dark:text-gray-300 mt-2">
            {description.length}/{DESCRIPTION_MAX}
          </p>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
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
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">Pick all that apply.</p>
        </div>
        {/* Cover Image */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            className="block w-full text-sm text-gray-500
               file:mr-4 file:rounded-full file:border-0
               file:bg-indigo-50 file:px-4 file:py-2
               file:text-indigo-600 hover:file:bg-indigo-100"
          />

          {coverPreview && (
            <div className="mt-4">
              <Image
                src={coverPreview}
                alt="Cover preview"
                className="h-48 w-full object-cover rounded-xl"
                width={100}
                height={100}
              />
            </div>
          )}
        </div>

        {/* Total Days */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Number of Days
          </label>
          <input
            type="number"
            min={1}
            max={MAX_DAYS}
            className="w-32 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 dark:text-gray-300
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
            You’ll add the content for each day next.
          </p>
        </div>

        {/* Action */}
        <div className="flex justify-end">
          <button
            onClick={createPlan}
            disabled={disabled}
            className={`inline-flex items-center gap-2 rounded-full ${disabled ? ' opacity-50 cursor-not-allowed ' : ''} bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500`}>
            {createPlanMutation.isPending || uploadingImage ? 'Creating...' : 'Continue'}
            <span className="text-lg">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
