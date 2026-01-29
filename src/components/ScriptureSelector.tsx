'use client';

import { useState } from 'react';
import bible from '@/data/bible-index.json';

type Props = {
  value: string[];
  onChange: (refs: string[]) => void;
};

export default function ScriptureSelector({ value, onChange }: Props) {
  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState<number | null>(null);
  const [verseFrom, setVerseFrom] = useState<number | null>(null);
  const [verseTo, setVerseTo] = useState<number | null>(null);

  const selectedBook = bible.find((b) => b.name === book);
  const selectedChapter = selectedBook?.chapters.find((c) => c.chapter === chapter);

  function addReference() {
    if (!book || !chapter || !verseFrom) return;

    const versePart = verseTo && verseTo !== verseFrom ? `${verseFrom}-${verseTo}` : `${verseFrom}`;

    const ref = `${book} ${chapter}:${versePart}`;

    onChange([...value, ref]);

    setVerseFrom(null);
    setVerseTo(null);
  }

  function removeReference(ref: string) {
    onChange(value.filter((r) => r !== ref));
  }

  return (
    <div className="space-y-4">
      {/* Selectors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Book */}
        <select
          className="input"
          value={book}
          onChange={(e) => {
            setBook(e.target.value);
            setChapter(null);
          }}>
          <option value="">Book</option>
          {bible.map((b) => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>

        {/* Chapter */}
        <select
          className="input"
          disabled={!selectedBook}
          value={chapter ?? ''}
          onChange={(e) => setChapter(Number(e.target.value))}>
          <option value="">Chapter</option>
          {selectedBook?.chapters.map((c) => (
            <option key={c.chapter} value={c.chapter}>
              {c.chapter}
            </option>
          ))}
        </select>

        {/* Verse From */}
        <select
          className="input"
          disabled={!selectedChapter}
          value={verseFrom ?? ''}
          onChange={(e) => setVerseFrom(Number(e.target.value))}>
          <option value="">Verse</option>
          {Array.from({ length: selectedChapter?.verses ?? 0 }, (_, i) => i + 1).map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        {/* Verse To (optional) */}
        <select
          className="input"
          disabled={!verseFrom}
          value={verseTo ?? ''}
          onChange={(e) => setVerseTo(Number(e.target.value))}>
          <option value="">To</option>
          {Array.from(
            {
              length: (selectedChapter?.verses ?? 0) - (verseFrom ?? 1) + 1,
            },
            (_, i) => (verseFrom ?? 1) + i,
          ).map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <button type="button" onClick={addReference} className="btn-secondary">
        + Add Reference
      </button>

      {/* Selected refs */}
      <div className="flex flex-wrap gap-2">
        {value.map((ref) => (
          <span
            key={ref}
            className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm flex items-center gap-2">
            {ref}
            <button onClick={() => removeReference(ref)}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
}
