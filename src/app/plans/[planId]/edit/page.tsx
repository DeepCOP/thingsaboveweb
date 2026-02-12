'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/src/state/AuthContext';
import { useGetDevotionalById, useUpdateDevotionalPlan } from '@/src/hooks/useDevotionalPlan';
import { uploadPlanCover } from '@/src/lib/utils';
import Spinner from '@/src/components/ui/Spinner';
import Image from 'next/image';

export default function EditPlanPage() {
  const { planId } = useParams();
  const { session, loading: sessionLoading } = useAuth();
  const router = useRouter();
  const planQuery = useGetDevotionalById(planId as string, session?.user?.id);
  const updatePlan = useUpdateDevotionalPlan();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const initializedRef = useRef(false);

  const TITLE_MAX = 120;
  const DESCRIPTION_MAX = 500;

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

  useEffect(() => {
    if (planQuery.data && !initializedRef.current) {
      setTitle(planQuery.data.title);
      setDescription(planQuery.data.description);
      setPreview(planQuery.data.cover_image);
      const tags = Array.isArray(planQuery.data.tags) ? planQuery.data.tags.filter(Boolean) : [];
      setSelectedTags(tags);
    }
    initializedRef.current = true;
  }, [planQuery.data]);

  if (planQuery.isLoading || sessionLoading) {
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

  const handleSave = async () => {
    if (title.length > TITLE_MAX) {
      alert(`Title must be ${TITLE_MAX} characters or fewer.`);
      return;
    }

    if (description.length > DESCRIPTION_MAX) {
      alert(`Description must be ${DESCRIPTION_MAX} characters or fewer.`);
      return;
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
        cover_image: coverUrl,
        tags: selectedTags.length ? selectedTags : null,
      },
      {
        onSuccess: () => router.push('/plans/my'),
      },
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 rounded-2xl shadow-sm border border-gray-200">
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
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
        <p className="text-sm text-gray-500 mt-2">Pick all that apply.</p>
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
        disabled={updatePlan.isPending || uploadingImage}
        className="px-6 py-3 rounded-lg bg-indigo-600 text-white">
        {updatePlan.isPending ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  );
}
