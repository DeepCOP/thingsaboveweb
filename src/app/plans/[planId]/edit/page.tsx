'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/src/state/AuthContext';
import {
  usePlanTags,
  useGetDevotionalById,
  useLatestPlanSubmission,
  useSubmitPlanForScreening,
  useUpdateDevotionalPlan,
} from '@/src/hooks/useDevotionalPlan';
import { uploadPlanCover } from '@/src/lib/utils';
import Spinner from '@/src/components/ui/Spinner';
import Image from 'next/image';

export default function EditPlanPage() {
  const { planId } = useParams();
  const { session, loading: sessionLoading } = useAuth();
  const router = useRouter();
  const planQuery = useGetDevotionalById(planId as string, session?.user?.id);
  const latestSubmissionQuery = useLatestPlanSubmission(planId as string, session?.user?.id);
  const updatePlan = useUpdateDevotionalPlan();
  const submitPublicVisibilityReview = useSubmitPlanForScreening(
    planId as string,
    session?.user?.id,
    'public',
  );
  const {
    data: availableTags = [],
    isLoading: isPlanTags,
    isError: hasPlanTagsError,
  } = usePlanTags();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const initializedRef = useRef(false);

  const TITLE_MAX = 120;
  const DESCRIPTION_MAX = 500;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  };

  useEffect(() => {
    if (!planQuery.data || initializedRef.current) {
      return;
    }

    setTitle(planQuery.data.title);
    setDescription(planQuery.data.description);
    setVisibility(planQuery.data.visibility === 'private' ? 'private' : 'public');
    setPreview(planQuery.data.cover_image);
    const tags = Array.isArray(planQuery.data.tags) ? planQuery.data.tags.filter(Boolean) : [];
    setSelectedTags(tags);
    initializedRef.current = true;
  }, [planQuery.data]);

  useEffect(() => {
    if (!planQuery.data) {
      return;
    }

    const submission = latestSubmissionQuery.data;
    const isUnderReview = submission?.status === 'submitted' || submission?.status === 'screening';

    if (isUnderReview) {
      setVisibility(planQuery.data.visibility === 'private' ? 'private' : 'public');
    }
  }, [latestSubmissionQuery.data, planQuery.data]);

  if (planQuery.isLoading || latestSubmissionQuery.isLoading || sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!planQuery.data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center px-4">
        <p className="text-2xl">Couldn`&apos;`t Load This Plan!</p>
      </div>
    );
  }

  const currentVisibility: 'public' | 'private' =
    planQuery.data.visibility === 'private' ? 'private' : 'public';
  const latestSubmission = latestSubmissionQuery.data ?? null;
  const hasActiveSubmission =
    latestSubmission?.status === 'submitted' || latestSubmission?.status === 'screening';
  const hasVisibilityChange = visibility !== currentVisibility;
  const isPublishedPlan = planQuery.data.status === 'published';
  const requiresVisibilityScreening =
    !hasActiveSubmission &&
    isPublishedPlan &&
    currentVisibility === 'private' &&
    visibility === 'public';

  const handleSave = async () => {
    if (title.length > TITLE_MAX) {
      alert(`Title must be ${TITLE_MAX} characters or fewer.`);
      return;
    }

    if (description.length > DESCRIPTION_MAX) {
      alert(`Description must be ${DESCRIPTION_MAX} characters or fewer.`);
      return;
    }

    if (hasActiveSubmission && hasVisibilityChange) {
      alert('Visibility cannot be changed while this plan is under review.');
      setVisibility(currentVisibility);
      return;
    }

    if (hasVisibilityChange) {
      const confirmed = window.confirm(
        requiresVisibilityScreening
          ? 'Changing this published private plan to public will submit it for screening. The plan will stay private unless the review passes. Continue?'
          : 'Changing visibility can affect who can access this plan. Continue?',
      );

      if (!confirmed) {
        setVisibility(currentVisibility);
        return;
      }
    }

    let coverUrl = planQuery.data?.cover_image || undefined;

    if (coverFile && session) {
      setUploadingImage(true);
      coverUrl = await uploadPlanCover({
        file: coverFile,
        userId: session.user.id,
        planId: planId as string,
      });
      setUploadingImage(false);
    }

    updatePlan.mutate(
      {
        id: planId as string,
        title,
        description,
        visibility: requiresVisibilityScreening ? 'private' : visibility,
        cover_image: coverUrl,
        tags: selectedTags.length ? selectedTags : null,
      },
      {
        onSuccess: () => {
          if (!requiresVisibilityScreening) {
            router.push('/plans/my');
            return;
          }

          submitPublicVisibilityReview.mutate(undefined, {
            onSuccess: (submission) => {
              alert(
                submission
                  ? `Public visibility submitted for screening. Submission #${submission.submission_number} is now in review.`
                  : 'Public visibility submitted for screening.',
              );
              router.push(`/plans/${planId as string}/days`);
            },
            onError: (error) => {
              console.error(error);
              alert(error.message || 'Could not submit this plan for screening.');
              setVisibility(currentVisibility);
            },
          });
        },
      },
    );
  };

  const isSaving = updatePlan.isPending || uploadingImage || submitPublicVisibilityReview.isPending;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 rounded-2xl shadow-sm border border-gray-200 mb-20">
      <h1 className="text-2xl font-bold">Edit Devotional Plan</h1>

      {/* Cover */}

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={TITLE_MAX}
        className="w-full border rounded-lg p-3"
        placeholder="Title"
      />
      <p className="text-xs text-gray-500">
        {title.length}/{TITLE_MAX}
      </p>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={DESCRIPTION_MAX}
        className="w-full border rounded-lg p-3"
        placeholder="Description"
      />
      <p className="text-xs text-gray-500">
        {description.length}/{DESCRIPTION_MAX}
      </p>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Visibility</label>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={hasActiveSubmission}
            onClick={() => {
              if (!hasActiveSubmission) {
                setVisibility('public');
              }
            }}
            className={`rounded-2xl border p-4 text-left transition ${
              visibility === 'public'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            } ${hasActiveSubmission ? 'cursor-not-allowed opacity-60' : ''}`}>
            <p className="font-semibold">Public plan</p>
            <p className="mt-2 text-sm leading-6 text-current/80">
              {hasActiveSubmission
                ? 'Visibility is locked while this plan is under review.'
                : requiresVisibilityScreening
                  ? 'Requires screening before it appears in plan lists and search.'
                  : 'Discoverable after screening. Readers can find it in plan lists and search.'}
            </p>
          </button>
          <button
            type="button"
            disabled={hasActiveSubmission}
            onClick={() => {
              if (!hasActiveSubmission) {
                setVisibility('private');
              }
            }}
            className={`rounded-2xl border p-4 text-left transition ${
              visibility === 'private'
                ? 'border-amber-500 bg-amber-50 text-amber-950'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            } ${hasActiveSubmission ? 'cursor-not-allowed opacity-60' : ''}`}>
            <p className="font-semibold">Private plan</p>
            <p className="mt-2 text-sm leading-6 text-current/80">
              Hidden from discovery. Only people you manually share it with can join.
            </p>
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {hasActiveSubmission
            ? `Submission #${latestSubmission?.submission_number} is under review. Visibility can be changed after it finishes.`
            : requiresVisibilityScreening
              ? 'This plan will stay private while public visibility is screened.'
              : 'Changes apply the next time this plan passes screening.'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        {isPlanTags ? (
          <p className="text-sm text-gray-500">Loading tags...</p>
        ) : hasPlanTagsError ? (
          <p className="text-sm text-red-600">Unable to load tags right now.</p>
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
            <p className="text-sm text-gray-500 mt-2">
              Choose a few tags that best describe your plan.
            </p>
          </>
        )}
      </div>
      <div>
        {preview && (
          <Image
            src={preview}
            className="h-48 w-full object-cover rounded-xl"
            alt="cover preview"
            width={100}
            height={100}
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setCoverFile(file);
            setPreview(URL.createObjectURL(file));
          }}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="px-6 py-3 rounded-lg bg-indigo-600 text-white">
        {isSaving
          ? submitPublicVisibilityReview.isPending
            ? 'Submitting...'
            : 'Saving...'
          : requiresVisibilityScreening
            ? 'Save & Submit Review'
            : 'Save Changes'}
      </button>
    </div>
  );
}
