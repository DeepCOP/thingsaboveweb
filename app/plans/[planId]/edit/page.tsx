'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/src/state/AuthContext';
import { useGetDevotionalById, useUpdateDevotionalPlan } from '@/src/hooks/useDevotional';
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
  const [preview, setPreview] = useState<string | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (planQuery.data && !initializedRef.current) {
      setTitle(planQuery.data.title);
      setDescription(planQuery.data.description);
      setPreview(planQuery.data.cover_image);
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
        className="w-full border rounded-lg p-3"
        placeholder="Title"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border rounded-lg p-3"
        placeholder="Description"
      />
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
