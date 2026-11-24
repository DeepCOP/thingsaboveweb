'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import bible from '@/data/bible-index.json';
import { Button } from '@/src/components/ui/button';

type Props = {
  value: string[];
  onChange: (refs: string[]) => void;
};

type ReferenceScope = 'book' | 'chapter' | 'verse';

export default function ScriptureSelector({ value, onChange }: Props) {
  const [scope, setScope] = useState<ReferenceScope>('verse');
  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState<number | null>(null);
  const [verseFrom, setVerseFrom] = useState<number | null>(null);
  const [verseTo, setVerseTo] = useState<number | null>(null);

  const selectedBook = useMemo(() => bible.find((entry) => entry.name === book), [book]);
  const selectedChapter = useMemo(
    () => selectedBook?.chapters.find((entry) => entry.chapter === chapter),
    [chapter, selectedBook],
  );

  const pendingReference = useMemo(() => {
    if (!book) return null;
    if (scope === 'book') return book;
    if (!chapter) return null;
    if (scope === 'chapter') return `${book} ${chapter}`;
    if (!verseFrom) return null;

    const versePart = verseTo && verseTo !== verseFrom ? `${verseFrom}-${verseTo}` : `${verseFrom}`;
    return `${book} ${chapter}:${versePart}`;
  }, [book, chapter, scope, verseFrom, verseTo]);

  const isDuplicate = pendingReference !== null && value.includes(pendingReference);
  const canAddReference = pendingReference !== null && !isDuplicate;

  function addReference() {
    if (!pendingReference || isDuplicate) return;

    onChange([...value, pendingReference]);
    setVerseFrom(null);
    setVerseTo(null);
  }

  function removeReference(ref: string) {
    onChange(value.filter((entry) => entry !== ref));
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <select
          className="input"
          value={scope}
          onChange={(e) => {
            const nextScope = e.target.value as ReferenceScope;
            setScope(nextScope);
            if (nextScope === 'book') {
              setChapter(null);
            }
            setVerseFrom(null);
            setVerseTo(null);
          }}>
          <option value="book">Whole Book</option>
          <option value="chapter">Whole Chapter</option>
          <option value="verse">Verse / Range</option>
        </select>

        <select
          className="input"
          value={book}
          onChange={(e) => {
            setBook(e.target.value);
            setChapter(null);
            setVerseFrom(null);
            setVerseTo(null);
          }}>
          <option value="">Book</option>
          {bible.map((entry) => (
            <option key={entry.name} value={entry.name}>
              {entry.name}
            </option>
          ))}
        </select>

        <select
          className="input"
          disabled={scope === 'book' || !selectedBook}
          value={chapter ?? ''}
          onChange={(e) => {
            const nextChapter = e.target.value ? Number(e.target.value) : null;
            setChapter(nextChapter);
            setVerseFrom(null);
            setVerseTo(null);
          }}>
          <option value="">Chapter</option>
          {selectedBook?.chapters.map((entry) => (
            <option key={entry.chapter} value={entry.chapter}>
              {entry.chapter}
            </option>
          ))}
        </select>

        <select
          className="input"
          disabled={scope !== 'verse' || !selectedChapter}
          value={verseFrom ?? ''}
          onChange={(e) => {
            const nextVerseFrom = e.target.value ? Number(e.target.value) : null;
            setVerseFrom(nextVerseFrom);
            setVerseTo(null);
          }}>
          <option value="">Verse</option>
          {Array.from({ length: selectedChapter?.verses ?? 0 }, (_, index) => index + 1).map(
            (verse) => (
              <option key={verse} value={verse}>
                {verse}
              </option>
            ),
          )}
        </select>

        <select
          className="input"
          disabled={scope !== 'verse' || !verseFrom}
          value={verseTo ?? ''}
          onChange={(e) => setVerseTo(e.target.value ? Number(e.target.value) : null)}>
          <option value="">To</option>
          {Array.from(
            {
              length: (selectedChapter?.verses ?? 0) - (verseFrom ?? 1) + 1,
            },
            (_, index) => (verseFrom ?? 1) + index,
          ).map((verse) => (
            <option key={verse} value={verse}>
              {verse}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <Button
          type="button"
          onClick={addReference}
          disabled={!canAddReference}
          className=" disabled:pointer-events-auto disabled:cursor-not-allowed cursor-pointer">
          <Plus />
          {pendingReference && !isDuplicate ? `Add ${pendingReference}` : 'Add reference'}
        </Button>

        {isDuplicate ? (
          <p className="text-sm text-gray-500" role="status">
            {pendingReference} is already added.
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Pick a whole book, a whole chapter, or a verse range, then click Add.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">
          Added references{value.length ? ` (${value.length})` : ''}
        </p>
        {value.length ? (
          <div className="flex flex-wrap gap-2">
            {value.map((ref) => (
              <span
                key={ref}
                className="flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700">
                {ref}
                <button
                  type="button"
                  onClick={() => removeReference(ref)}
                  aria-label={`Remove ${ref}`}>
                  &times;
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No references added yet.</p>
        )}
      </div>
    </div>
  );
}
