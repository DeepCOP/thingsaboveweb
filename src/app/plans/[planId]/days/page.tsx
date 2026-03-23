'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronUp, Menu, Trash2 } from 'lucide-react';

import ScriptureSelector from '@/src/components/ScriptureSelector';
import RichTextEditor from '@/src/components/editor/RichTextEditor';
import Spinner from '@/src/components/ui/Spinner';
import { Checkbox } from '@/src/components/ui/checkbox';
import { useGetDevotionalDays, useGetDevotionalDrafts } from '@/src/hooks/useDevotionalDays';
import { useGetDevotionalById, usePublishDevotionalPlan } from '@/src/hooks/useDevotionalPlan';
import { useSaveDevotionalDraft } from '@/src/hooks/useSaveDraft';
import { useAuth } from '@/src/state/AuthContext';

type Day = {
  id: string;
  day_number: number;
  content: string;
  scriptures: string[];
  title: string;
};

export default function PlanDaysPage() {
  const DAY_TITLE_MAX = 120;
  const { planId } = useParams();
  const router = useRouter();
  const { session, loading: sessionLoading } = useAuth();
  const submitDevotionals = usePublishDevotionalPlan(planId as string, session?.user?.id);
  const planQuery = useGetDevotionalById(planId as string, session?.user?.id);
  const saveDraft = useSaveDevotionalDraft(planId as string);
  const devotionalDays = useGetDevotionalDays(planId as string, session?.user?.id);
  const draftsQuery = useGetDevotionalDrafts(planId as string, session?.user?.id);
  const drafts = draftsQuery.data;
  const initializedRef = useRef(false);

  const daysData = useMemo(() => {
    if (!planQuery.data) return [];

    return [...Array(planQuery.data.total_days)].map((_, idx) => ({
      day_number: idx + 1,
      content: '',
      scriptures: [],
      id: crypto.randomUUID(),
      title: '',
    }));
  }, [planQuery.data]);

  const [days, setDays] = useState<Day[]>(daysData);
  const [openDays, setOpenDays] = useState<string[]>([]);
  const [hasAcceptedContentStandards, setHasAcceptedContentStandards] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const isLoading =
    submitDevotionals.isPending ||
    saveDraft.isPending ||
    draftsQuery.isLoading ||
    planQuery.isLoading ||
    devotionalDays.isLoading;

  function toggleDay(id: string) {
    setOpenDays((prev) =>
      prev.includes(id) ? prev.filter((dayId) => dayId !== id) : [...prev, id],
    );
  }

  function updateDay(index: number, updates: Partial<Day>) {
    setDays((prev) => prev.map((day, i) => (i === index ? { ...day, ...updates } : day)));
  }

  function normalizeDays(nextDays: Day[]): Day[] {
    return nextDays.map((day, index) => ({ ...day, day_number: index + 1 }));
  }

  function removeDay(index: number) {
    setDays((prev) => normalizeDays(prev.filter((_, i) => i !== index)));
  }

  async function submitDays() {
    setSubmissionError(null);

    const payload = normalizeDays(
      days
        .map((day) => ({
          day_number: day.day_number,
          content: day.content.trim(),
          scriptures: day.scriptures,
          id: day.id,
          title: day.title.trim(),
        }))
        .filter((day) => day.content),
    );

    if (!payload.length) {
      alert('At least 1 day is required!');
      return;
    }

    if (!hasAcceptedContentStandards) {
      setSubmissionError(
        'You must confirm your content complies with the Terms of Service and Statement of Faith before publishing.',
      );
      return;
    }

    const confirmed = window.confirm(
      'Ready to publish this plan? You can still edit it later, but this will make it visible.',
    );
    if (!confirmed) {
      return;
    }

    submitDevotionals.mutate(payload, {
      onSuccess: () => {
        alert('Plan submitted!');
        router.push('/plans/my');
      },
      onError: (error) => {
        console.error(error);
        alert('Something went wrong');
      },
    });
  }

  useEffect(() => {
    if (draftsQuery.isLoading || initializedRef.current) return;

    if (!drafts?.length) {
      if (planQuery.data?.status === 'published') {
        setDays(
          (devotionalDays.data || []).map((day) => ({
            id: day.day_id,
            day_number: day.day_number,
            content: day.content,
            scriptures: day.scriptures ?? [],
            title: day.title,
          })),
        );

        if (devotionalDays.data) {
          initializedRef.current = true;
        }
        return;
      }

      setDays(daysData);
      if (daysData.length) {
        initializedRef.current = true;
      }
      return;
    }

    setDays(
      drafts.map((day) => ({
        id: day.day_id,
        day_number: day.day_number,
        content: day.content,
        scriptures: day.scriptures ?? [],
        title: day.title,
      })),
    );
    initializedRef.current = true;
  }, [daysData, devotionalDays.data, drafts, draftsQuery.isLoading, planQuery.data]);

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!planQuery.data && !planQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-800">
        <p className="text-2xl">Couldn&apos;t load this plan.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-10">
      <div className="text-center">
        <div className="mb-4 flex flex-row items-center justify-center gap-2">
          {planQuery.data?.cover_image && (
            <Image
              src={planQuery.data.cover_image}
              width={50}
              height={50}
              alt="cover image of the plan"
              className="rounded-lg"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            {planQuery.data ? planQuery.data.title : 'Write Your Devotional'}
          </h1>
        </div>

        <p className="mt-2 text-gray-500 dark:text-gray-300">
          Add content and scripture for each day
        </p>
      </div>

      {planQuery.isLoading || draftsQuery.isLoading || devotionalDays.isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (!over || active.id === over.id) return;

            setDays((prev) => {
              const oldIndex = prev.findIndex((day) => day.id === active.id);
              const newIndex = prev.findIndex((day) => day.id === over.id);
              return normalizeDays(arrayMove(prev, oldIndex, newIndex));
            });
          }}>
          <SortableContext items={days.map((day) => day.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {days.map((day, index) => (
                <SortableAccordionDay
                  key={day.id}
                  day={day}
                  isOpen={openDays.includes(day.id)}
                  onToggle={() => toggleDay(day.id)}
                  daysLength={days.length}
                  removeDay={removeDay}
                  currentIndex={index}>
                  <input
                    type="text"
                    placeholder="Day title (optional)"
                    value={day.title}
                    maxLength={DAY_TITLE_MAX}
                    onChange={(e) => updateDay(index, { title: e.target.value })}
                    className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-500">
                    {day.title.length}/{DAY_TITLE_MAX}
                  </p>

                  <RichTextEditor
                    value={day.content}
                    onChange={(html) => updateDay(index, { content: html })}
                  />

                  <ScriptureSelector
                    value={day.scriptures}
                    onChange={(refs) => updateDay(index, { scriptures: refs })}
                  />
                </SortableAccordionDay>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
        <p className="font-semibold">Before you publish</p>
        <p className="mt-2 leading-6">
          ThingsAbove strictly enforces the rule that submitted content may not violate historical
          Christian principles. Review the{' '}
          <Link href="/terms" className="underline underline-offset-4">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/statement-of-faith" className="underline underline-offset-4">
            Statement of Faith
          </Link>{' '}
          before making this plan public.
        </p>
        <div className="mt-4 flex items-start gap-3">
          <Checkbox
            id="content-standards-acknowledgement"
            checked={hasAcceptedContentStandards}
            onCheckedChange={(checked) => {
              const isChecked = checked === true;
              setHasAcceptedContentStandards(isChecked);
              if (isChecked) {
                setSubmissionError(null);
              }
            }}
            className="mt-1"
          />
          <label htmlFor="content-standards-acknowledgement" className="leading-6 text-amber-950">
            I confirm that this plan and all submitted devotional content do not violate historical
            Christian principles, the ThingsAbove Terms of Service, or the ThingsAbove Statement of
            Faith. I understand this standard is strictly enforced.
          </label>
        </div>
        {submissionError && (
          <p className="mt-3 text-sm font-medium text-red-600">{submissionError}</p>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={() =>
            setDays((prev) => [
              ...prev,
              {
                day_number: prev.length + 1,
                content: '',
                scriptures: [],
                id: crypto.randomUUID(),
                title: '',
              },
            ])
          }
          className="rounded-full border px-6 py-3">
          + Add Day
        </button>

        <button
          onClick={submitDays}
          disabled={isLoading}
          className="rounded-full bg-indigo-600 px-8 py-3 text-white">
          {submitDevotionals.isPending ? 'Publishing...' : 'Publish'}
        </button>

        <button
          onClick={() =>
            saveDraft.mutate(normalizeDays(days), {
              onSuccess: () => {
                alert('Draft saved.');
              },
              onError: (error) => {
                console.log(error);
              },
            })
          }
          disabled={isLoading}
          className="rounded-full border border-gray-300 px-6 py-3">
          {saveDraft.isPending ? 'Saving Draft...' : 'Save Draft'}
        </button>
      </div>
    </div>
  );
}

function SortableAccordionDay({
  day,
  isOpen,
  onToggle,
  children,
  daysLength,
  currentIndex,
  removeDay,
}: {
  day: { id: string; day_number: number; content: string; scriptures: string[]; title: string };
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  daysLength: number;
  currentIndex: number;
  removeDay: (index: number) => void;
}) {
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
    id: day.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function getContentPreview(html: string, maxLength = 100) {
    if (!html) return '';
    const text = html.replace(/<[^>]+>/g, '').trim();
    if (!text) return '';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  }

  const handleDeleteDay = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "Day ${day.day_number}"?\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    removeDay(currentIndex);
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-xl border">
      <div
        className="flex cursor-pointer items-center justify-between rounded-xl bg-gray-100 px-4 py-3 dark:bg-gray-700"
        onClick={onToggle}>
        <div className="flex items-center gap-3">
          <span
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="cursor-grab text-gray-400">
            <Menu />
          </span>
          <h3 className="flex items-center gap-2 font-semibold">
            <span>Day {day.day_number}</span>

            {day.title && (
              <span className="max-w-[220px] truncate text-lg font-bold text-gray-500 dark:text-gray-200">
                - {day.title}
              </span>
            )}

            {!isOpen && day.content && (
              <p className="mt-1 line-clamp-1 max-w-[420px] truncate text-sm text-gray-500 dark:text-gray-200">
                :- {getContentPreview(day.content)}
              </p>
            )}
          </h3>
        </div>

        <div className="flex gap-2">
          {daysLength > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteDay();
              }}
              className="text-sm text-red-500 hover:underline">
              <Trash2 />
            </button>
          )}
          <span className="text-sm text-gray-500">{isOpen ? <ChevronUp /> : <ChevronDown />}</span>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-6 rounded-b-xl bg-white p-6 dark:bg-gray-800">{children}</div>
      )}
    </div>
  );
}
