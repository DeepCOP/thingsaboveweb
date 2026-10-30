'use client';

import { useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
import type { ImportedPlan } from '@/src/lib/planImport';
import ImportedCoverPreview from './ImportedCoverPreview';

type Props = {
  onImport: (plan: ImportedPlan, mode: 'append' | 'replace') => void;
  mode?: 'new' | 'existing';
  existingDayCount?: number;
  disabled?: boolean;
  triggerLabel?: string;
  defaultOpen?: boolean;
};

export default function PlanImportDialog({
  onImport,
  mode = 'new',
  existingDayCount = 0,
  disabled = false,
  triggerLabel = 'Import Excel / CSV',
  defaultOpen = false,
}: Props) {
  const templateFileName =
    mode === 'existing' ? 'devotional-days-template' : 'devotional-plan-template';
  const templateLabel = mode === 'existing' ? 'day-only' : 'plan';
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<ImportedPlan | null>(null);
  const [fileName, setFileName] = useState('');
  const [reading, setReading] = useState(false);
  const [issues, setIssues] = useState<string[]>([]);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const readRequest = useRef(0);
  const openedFromLink = useRef(false);

  useEffect(() => {
    if (defaultOpen && !openedFromLink.current) {
      openedFromLink.current = true;
      setOpen(true);
    }
  }, [defaultOpen]);

  useEffect(
    () => () => {
      readRequest.current += 1;
    },
    [],
  );

  function changeOpen(nextOpen: boolean) {
    if (!nextOpen) {
      readRequest.current += 1;
      setReading(false);
    }
    setOpen(nextOpen);
  }

  async function readFile(file: File) {
    const request = ++readRequest.current;
    setReading(true);
    setPlan(null);
    setIssues([]);
    setFileName(file.name);
    try {
      const { parsePlanFile } = await import('@/src/lib/planImport');
      const imported = await parsePlanFile(file);
      if (request === readRequest.current) {
        setPlan(imported);
      }
    } catch (error) {
      if (request !== readRequest.current) return;
      const messages =
        error && typeof error === 'object' && 'issues' in error && Array.isArray(error.issues)
          ? error.issues.filter((issue): issue is string => typeof issue === 'string')
          : [];
      setIssues(
        messages.length
          ? messages
          : [
              error instanceof Error
                ? error.message
                : 'Could not read this file. Please try the template.',
            ],
      );
    } finally {
      if (request === readRequest.current) setReading(false);
    }
  }

  const resultingDayCount =
    (plan?.days.length ?? 0) +
    (mode === 'existing' && importMode === 'append' ? existingDayCount : 0);
  const hasImportedDays = (plan?.days.length ?? 0) > 0;
  const exceedsDayLimit = resultingDayCount > 365;

  function applyImport() {
    if (!plan || disabled || reading || exceedsDayLimit) return;
    try {
      onImport(plan, mode === 'new' ? 'replace' : importMode);
      changeOpen(false);
      setPlan(null);
      setFileName('');
      setIssues([]);
    } catch (error) {
      setIssues([error instanceof Error ? error.message : 'Could not import these days.']);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={changeOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950">
          <Upload className="h-4 w-4" aria-hidden="true" />
          {triggerLabel}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100%_-_2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-neutral-200 px-5 py-5 pr-14 dark:border-neutral-800 sm:px-6">
            <Dialog.Title className="text-xl font-semibold text-neutral-900 dark:text-white">
              {mode === 'new' ? 'Import a plan' : 'Import plan days'}
            </Dialog.Title>
            <Dialog.Description className="mt-1.5 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              {mode === 'new'
                ? 'Bring in one plan from an Excel workbook or CSV, then review its details.'
                : 'Import the plan days from your file into this editor. Save Draft when you are ready.'}
            </Dialog.Description>
          </div>
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close import"
              className="absolute right-4 top-4 rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:hover:bg-neutral-800">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </Dialog.Close>

          <div className="space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-neutral-700 dark:bg-neutral-800/50">
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                Start with the template
              </p>
              <p className="mt-1.5 leading-6 text-neutral-600 dark:text-neutral-400">
                Use one row per day. The {templateLabel} template starts <code>day_number</code> at
                1 and continues without gaps.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                {['xlsx', 'csv'].map((extension) => (
                  <a
                    key={extension}
                    href={`/templates/${templateFileName}.${extension}`}
                    download
                    aria-label={`Download ${extension === 'xlsx' ? 'Excel' : 'CSV'} ${templateLabel} template`}
                    className="inline-flex items-center gap-1.5 font-medium text-emerald-700 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-400">
                    <Download className="h-4 w-4" aria-hidden="true" />
                    {extension === 'xlsx' ? 'Excel' : 'CSV'}
                  </a>
                ))}
              </div>
              <details className="mt-3 text-neutral-600 dark:text-neutral-400">
                <summary className="cursor-pointer rounded font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
                  File guidelines
                </summary>
                <ul className="mt-2 list-disc space-y-1 pl-5 leading-6">
                  <li>
                    Use an .xlsx or UTF-8 .csv file up to 5 MB with one plan and at most 365 days.
                    Save older .xls files as .xlsx first.
                  </li>
                  <li>
                    Excel reads the Days worksheet when present. Otherwise, keep the plan in one
                    populated worksheet. A sheet named Instructions is ignored.
                  </li>
                  <li>
                    Day rows are optional. To import days now, use the day_number, title, content,
                    and scriptures columns. Day numbers must run from 1 without gaps or duplicates;
                    leave day_number out to use row order.
                  </li>
                  <li>
                    Separate scripture references with semicolons, for example John 3:16; Romans
                    8:28.
                  </li>
                  <li>
                    Content is plain text; paragraph breaks are preserved. Use values rather than
                    formulas.
                  </li>
                  <li>
                    Add plan_title and plan_description on the first row. Repeated values must match
                    throughout the file. You can fill missing details before saving.
                  </li>
                  <li>
                    An optional cover_image column can supply a public http:// or https:// image
                    URL. Set it once, or repeat the same URL. Local file paths and embedded workbook
                    pictures are not imported.
                  </li>
                  <li>
                    Missing content or scripture references can be completed in the editor before
                    submission.
                  </li>
                </ul>
              </details>
            </div>

            <div className="rounded-xl border-2 border-dashed border-neutral-300 p-5 dark:border-neutral-700">
              <label
                htmlFor="plan-import-file"
                className="flex items-center gap-2 font-medium text-neutral-800 dark:text-neutral-200">
                <FileSpreadsheet
                  className="h-5 w-5 text-emerald-700 dark:text-emerald-400"
                  aria-hidden="true"
                />
                Choose your plan file
              </label>
              <input
                id="plan-import-file"
                type="file"
                accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                disabled={disabled}
                onClick={(event) => {
                  // Reset immediately before browsing so choosing the same file again still fires
                  // onChange, while keeping the selected filename visible after a choice.
                  event.currentTarget.value = '';
                }}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void readFile(file);
                }}
                className="mt-3 block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:font-medium file:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-neutral-300"
              />
              <p className="mt-2 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                The file is read in your browser. Nothing is saved or submitted until you confirm
                and save.
              </p>
            </div>

            {reading && (
              <p
                role="status"
                className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />
                Reading your file…
              </p>
            )}
            {issues.length > 0 && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                <p className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  Check your file
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {issues.slice(0, 10).map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
                {issues.length > 10 && (
                  <p className="mt-2">
                    And {issues.length - 10} more issues. Fix these rows, then choose the file
                    again.
                  </p>
                )}
              </div>
            )}

            {plan && (
              <div className="space-y-3 text-sm">
                <p
                  role="status"
                  className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  {hasImportedDays
                    ? `One plan found with ${plan.days.length} ${plan.days.length === 1 ? 'day' : 'days'}`
                    : 'One plan found without days'}
                </p>
                <p className="break-all text-neutral-500 dark:text-neutral-400">{fileName}</p>
              </div>
            )}

            {plan && (
              <div className="space-y-4">
                <div className="text-sm">
                  {plan.sheetName && (
                    <p className="break-all text-neutral-500 dark:text-neutral-400">
                      Worksheet: {plan.sheetName}
                    </p>
                  )}
                  {plan.title && (
                    <p className="mt-2 text-neutral-700 dark:text-neutral-300">
                      Plan title: <strong>{plan.title}</strong>
                    </p>
                  )}
                  {plan.description && (
                    <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                      {plan.description}
                    </p>
                  )}
                  {plan.coverImage && (
                    <div className="mt-3 space-y-2">
                      <p className="font-medium">Cover from file</p>
                      <ImportedCoverPreview src={plan.coverImage} />
                      {mode === 'existing' && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Import days only changes this plan&apos;s days. Its existing cover stays
                          in place.
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {plan.warnings.length > 0 && (
                  <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                    <p className="font-medium">Review before submitting</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {plan.warnings.slice(0, 6).map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                    {plan.warnings.length > 6 && (
                      <p className="mt-2">
                        {plan.warnings.length - 6} more items also need review in the editor.
                      </p>
                    )}
                  </div>
                )}
                {hasImportedDays && (
                  <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <table className="w-full min-w-[480px] text-left text-sm">
                      <caption className="sr-only">Imported days preview</caption>
                      <thead className="bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                        <tr>
                          <th scope="col" className="px-3 py-2">
                            Day
                          </th>
                          <th scope="col" className="px-3 py-2">
                            Title and content
                          </th>
                          <th scope="col" className="px-3 py-2">
                            Scriptures
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                        {plan.days.slice(0, 10).map((day) => (
                          <tr
                            key={day.day_number}
                            className="align-top text-neutral-700 dark:text-neutral-300">
                            <td className="px-3 py-3 tabular-nums">{day.day_number}</td>
                            <td className="max-w-xs px-3 py-3">
                              <p className="break-words font-medium">
                                {day.title || 'Untitled day'}
                              </p>
                              <p className="mt-1 line-clamp-2 break-words text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                                {day.content || 'No devotional content yet'}
                              </p>
                            </td>
                            <td className="max-w-[220px] break-words px-3 py-3 text-xs leading-5">
                              {day.scriptures.join('; ') || 'No references yet'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {hasImportedDays && plan.days.length > 10 && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Showing the first 10 days of this plan. All {plan.days.length} days will be
                    imported.
                  </p>
                )}
                {mode === 'existing' && (
                  <fieldset
                    disabled={disabled}
                    className="space-y-3 rounded-xl border border-neutral-200 p-4 text-sm dark:border-neutral-700">
                    <legend className="px-1 font-semibold text-neutral-800 dark:text-neutral-200">
                      How should these days be added?
                    </legend>
                    <label className="flex cursor-pointer items-start gap-3 text-neutral-700 dark:text-neutral-300">
                      <input
                        className="mt-1 accent-emerald-700"
                        type="radio"
                        name="plan-import-mode"
                        checked={importMode === 'append'}
                        onChange={() => setImportMode('append')}
                      />
                      <span>
                        <strong>Add after the current {existingDayCount} days</strong>
                        <span className="mt-1 block text-xs text-neutral-500 dark:text-neutral-400">
                          Your current content stays in place. Imported days are renumbered
                          automatically.
                        </span>
                      </span>
                    </label>
                    <label className="flex cursor-pointer items-start gap-3 text-neutral-700 dark:text-neutral-300">
                      <input
                        className="mt-1 accent-emerald-700"
                        type="radio"
                        name="plan-import-mode"
                        checked={importMode === 'replace'}
                        onChange={() => setImportMode('replace')}
                      />
                      <span>
                        <strong>Replace the current days</strong>
                        <span className="mt-1 block text-xs text-neutral-500 dark:text-neutral-400">
                          Removes all {existingDayCount} days currently in this editor, including
                          unsaved edits. The saved version changes only after Save Draft.
                        </span>
                      </span>
                    </label>
                  </fieldset>
                )}
                {exceedsDayLimit && (
                  <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">
                    This would make {resultingDayCount} days. A plan can have at most 365 days.
                    Choose replace or import fewer rows.
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6">
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-neutral-700 dark:text-neutral-200">
                Cancel
              </button>
            </Dialog.Close>
            <button
              type="button"
              disabled={
                !plan ||
                reading ||
                disabled ||
                exceedsDayLimit ||
                (mode === 'existing' && !hasImportedDays)
              }
              onClick={applyImport}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <Upload className="h-4 w-4" aria-hidden="true" />
              {mode === 'new'
                ? 'Use imported plan'
                : !hasImportedDays
                  ? 'No days to import'
                  : importMode === 'replace'
                    ? `Replace ${existingDayCount} days`
                    : 'Add imported days'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
