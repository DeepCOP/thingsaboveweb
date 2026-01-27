'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import RichTextEditor from '@/components/editor/RichTextEditor';
import ScriptureSelector from '@/components/ScriptureSelector';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronUp, Menu, Trash2 } from 'lucide-react';
import { useSubmitDevotionalDays } from '@/lib/hooks/useSummitDevotionalDays';
import { useGetDevotionalById } from '@/lib/hooks/useDevotional';
import Spinner from '@/components/ui/Spinner';
import { useSaveDevotionalDraft } from '@/lib/hooks/useSaveDraft';
import { useAuth } from '@/state/AuthContext';
import { useGetDevotionalDays, useGetDevotionalDrafts } from '@/lib/hooks/useDevotionalDays';
import Image from 'next/image';
type Day = {
  id: string; // ✅ stable identity
  day_number: number;
  content: string;
  scriptures: string[];
  title: string;
};

export default function PlanDaysPage() {
  const { planId } = useParams();
  const { session, loading: sessionLoading } = useAuth();
  const submitDevotionals = useSubmitDevotionalDays(planId as string, session?.user?.id);
  const planQuery = useGetDevotionalById(planId as string, session?.user?.id);
  const saveDraft = useSaveDevotionalDraft(planId as string);
  const devotionalDays = useGetDevotionalDays(planId as string, session?.user?.id);
  const draftsQuery = useGetDevotionalDrafts(planId as string, session?.user?.id);
  const drafts = draftsQuery.data;
  const initializedRef = useRef(false);

  const daysData = useMemo(() => {
    if (!planQuery.data) return [];
    return [...Array(planQuery.data?.total_days)].map((i, idx) => {
      return {
        day_number: idx + 1,
        content: '',
        scriptures: [],
        id: crypto.randomUUID(),
        title: '',
      };
    });
  }, [planQuery.data]);
  const [days, setDays] = useState<Day[]>(daysData);

  const [openDays, setOpenDays] = useState<string[]>([]);
  const isLoading =
    submitDevotionals.isPending ||
    saveDraft.isPending ||
    draftsQuery.isLoading ||
    planQuery.isLoading ||
    devotionalDays.isLoading;

  function toggleDay(id: string) {
    setOpenDays((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  }

  function updateDay(index: number, updates: Partial<Day>) {
    setDays((prev) => prev.map((d, i) => (i === index ? { ...d, ...updates } : d)));
  }

  function normalizeDays(days: Day[]): Day[] {
    return days.map((d, i) => ({ ...d, day_number: i + 1 }));
  }

  function removeDay(index: number) {
    setDays((prev) => normalizeDays(prev.filter((_, i) => i !== index)));
  }

  async function submitDays() {
    const payload = normalizeDays(
      days
        .map((d) => ({
          day_number: d.day_number,
          content: d.content.trim(),
          scriptures: d.scriptures,
          id: d.id,
          title: d.title.trim(),
        }))
        .filter((d) => d.content),
    );

    console.log(payload);
    if (!payload.length) {
      alert('Atleast 1 day is required!');
      return;
    }

    submitDevotionals.mutate(payload, {
      onSuccess: () => {
        alert('Plan submitted 🎉');
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
          (devotionalDays.data || []).map((d) => ({
            id: d.day_id,
            day_number: d.day_number,
            content: d.content,
            scriptures: d.scriptures ?? [],
            title: d.title,
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
      drafts.map((d) => ({
        id: d.day_id,
        day_number: d.day_number,
        content: d.content,
        scriptures: d.scriptures ?? [],
        title: d.title,
      })),
    );
    initializedRef.current = true;
  }, [drafts, draftsQuery.isLoading, planQuery.data, daysData, devotionalDays.data]);
  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!planQuery.data && !planQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center px-4">
        <p className="text-2xl">Couldn`&apos;`t Load This Plan!</p>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="text-center">
        <div className="flex flex-row items-center justify-center gap-2 mb-4">
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
            {planQuery?.data ? planQuery?.data.title : 'Write Your Devotional'}{' '}
          </h1>
        </div>

        <p className="text-gray-500 mt-2 dark:text-gray-300">
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
              const oldIndex = prev.findIndex((d) => d.id === active.id);
              const newIndex = prev.findIndex((d) => d.id === over.id);
              return normalizeDays(arrayMove(prev, oldIndex, newIndex));
            });
          }}>
          <SortableContext items={days.map((d) => d.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {days.map((day, i) => (
                <SortableAccordionDay
                  key={day.id}
                  day={day}
                  isOpen={openDays.includes(day.id)}
                  onToggle={() => toggleDay(day.id)}
                  daysLength={days.length}
                  removeDay={removeDay}
                  currentIndex={i}>
                  <input
                    type="text"
                    placeholder="Day title (optional)"
                    value={day.title}
                    onChange={(e) => updateDay(i, { title: e.target.value })}
                    className="w-full rounded-lg border px-4 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <RichTextEditor
                    value={day.content}
                    onChange={(html) => updateDay(i, { content: html })}
                  />

                  <ScriptureSelector
                    value={day.scriptures}
                    onChange={(refs) => updateDay(i, { scriptures: refs })}
                  />
                </SortableAccordionDay>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

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
          className="px-6 py-3 rounded-full border">
          + Add Day
        </button>

        <button
          onClick={submitDays}
          disabled={isLoading}
          className="px-8 py-3 rounded-full bg-indigo-600 text-white">
          {submitDevotionals.isPending ? 'Publishing...' : 'Publish'}
        </button>
        <button
          onClick={() =>
            saveDraft.mutate(days, {
              onSuccess: () => {
                alert('Draft saved 💾');
              },
              onError: (e) => {
                console.log(e);
              },
            })
          }
          disabled={isLoading}
          className="px-6 py-3 rounded-full border border-gray-300">
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
    return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
  }
  const handleDeleteDay = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "Day ${day.day_number}"?\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    removeDay(currentIndex);
  };
  return (
    <div ref={setNodeRef} style={style} className="border rounded-xl">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 cursor-pointer rounded-xl"
        onClick={onToggle}>
        <div className="flex items-center gap-3">
          <span
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="cursor-grab text-gray-400">
            <Menu />
          </span>
          <h3 className="font-semibold flex items-center gap-2">
            <span>Day {day.day_number}</span>

            {day.title && (
              <span className="text-lg font-bold text-gray-500 dark:text-gray-200 truncate max-w-[220px]">
                — {day.title}
              </span>
            )}
            {!isOpen && day.content && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-200 line-clamp-1 truncate max-w-[420px]">
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

      {/* Content */}
      {isOpen && (
        <div className="p-6 space-y-6 bg-white dark:bg-gray-800 rounded-b-xl">{children}</div>
      )}
    </div>
  );
}
