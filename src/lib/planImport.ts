import Papa from 'papaparse';
import bible from '../../data/bible-index.json';

export const MAX_IMPORT_DAYS = 365;
export const MAX_IMPORT_FILE_MB = 5;
const MAX_ISSUES = 30;

export type ImportedPlanDay = {
  day_number: number;
  title: string;
  /** Plain text until createImportedDays converts it to editor HTML. */
  content: string;
  scriptures: string[];
};

export type ImportedPlan = {
  days: ImportedPlanDay[];
  title?: string;
  description?: string;
  coverImage?: string;
  warnings: string[];
  sheetName?: string;
};

export class PlanImportError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(issues[0] || 'This file could not be imported.');
    this.name = 'PlanImportError';
    this.issues = issues.slice(0, MAX_ISSUES);
  }
}

type Column =
  | 'day_number'
  | 'title'
  | 'content'
  | 'scriptures'
  | 'plan_title'
  | 'plan_description'
  | 'cover_image';

const COLUMN_ALIASES: Record<string, Column> = {
  day: 'day_number',
  day_number: 'day_number',
  day_no: 'day_number',
  title: 'title',
  day_title: 'title',
  content: 'content',
  devotional: 'content',
  devotional_content: 'content',
  body: 'content',
  scriptures: 'scriptures',
  scripture: 'scriptures',
  references: 'scriptures',
  scripture_references: 'scriptures',
  plan_title: 'plan_title',
  plan_description: 'plan_description',
  cover_image: 'cover_image',
  cover_image_url: 'cover_image',
};

const BOOK_ALIASES: Record<string, string> = {
  gen: 'Genesis',
  ex: 'Exodus',
  exod: 'Exodus',
  lev: 'Leviticus',
  num: 'Numbers',
  deut: 'Deuteronomy',
  josh: 'Joshua',
  judg: 'Judges',
  '1 sam': '1 Samuel',
  '2 sam': '2 Samuel',
  '1 chr': '1 Chronicles',
  '2 chr': '2 Chronicles',
  neh: 'Nehemiah',
  esth: 'Esther',
  ps: 'Psalms',
  psa: 'Psalms',
  psalm: 'Psalms',
  prov: 'Proverbs',
  eccl: 'Ecclesiastes',
  'song of songs': 'Song of Solomon',
  song: 'Song of Solomon',
  isa: 'Isaiah',
  jer: 'Jeremiah',
  lam: 'Lamentations',
  ezek: 'Ezekiel',
  dan: 'Daniel',
  hos: 'Hosea',
  obad: 'Obadiah',
  mic: 'Micah',
  nah: 'Nahum',
  hab: 'Habakkuk',
  zeph: 'Zephaniah',
  hag: 'Haggai',
  zech: 'Zechariah',
  mal: 'Malachi',
  matt: 'Matthew',
  mt: 'Matthew',
  mk: 'Mark',
  lk: 'Luke',
  jn: 'John',
  rom: 'Romans',
  '1 cor': '1 Corinthians',
  '2 cor': '2 Corinthians',
  gal: 'Galatians',
  eph: 'Ephesians',
  phil: 'Philippians',
  col: 'Colossians',
  '1 thess': '1 Thessalonians',
  '2 thess': '2 Thessalonians',
  '1 tim': '1 Timothy',
  '2 tim': '2 Timothy',
  phlm: 'Philemon',
  heb: 'Hebrews',
  jas: 'James',
  '1 pet': '1 Peter',
  '2 pet': '2 Peter',
  rev: 'Revelation',
};

function normalizeBook(value: string) {
  return value.toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim();
}

function parseScripture(reference: string): string[] | null {
  const normalized = reference
    .trim()
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\s+/g, ' ');
  const crossChapterMatch = normalized.match(/^(.+?)\s+(\d+):(\d+)-(\d+):(\d+)$/);
  const match = normalized.match(
    /^(.+?)\s+(\d+(?:-\d+)?)(?::(\d+(?:-\d+)?(?:\s*,\s*\d+(?:-\d+)?)*))?$/,
  );
  const bookName = normalizeBook(crossChapterMatch?.[1] ?? match?.[1] ?? normalized);
  const canonicalName = BOOK_ALIASES[bookName] ?? bookName;
  const book = bible.find((entry) => normalizeBook(entry.name) === normalizeBook(canonicalName));
  if (!book) return null;
  if (crossChapterMatch) {
    const firstChapter = Number(crossChapterMatch[2]);
    const firstVerse = Number(crossChapterMatch[3]);
    const lastChapter = Number(crossChapterMatch[4]);
    const lastVerse = Number(crossChapterMatch[5]);
    const firstChapterData = book.chapters.find((entry) => entry.chapter === firstChapter);
    const lastChapterData = book.chapters.find((entry) => entry.chapter === lastChapter);
    if (
      !firstChapterData ||
      !lastChapterData ||
      lastChapter < firstChapter ||
      firstVerse < 1 ||
      firstVerse > firstChapterData.verses ||
      lastVerse < 1 ||
      lastVerse > lastChapterData.verses ||
      (firstChapter === lastChapter && lastVerse < firstVerse)
    ) {
      return null;
    }

    return book.chapters
      .filter((entry) => entry.chapter >= firstChapter && entry.chapter <= lastChapter)
      .map((entry) => {
        const from = entry.chapter === firstChapter ? firstVerse : 1;
        const to = entry.chapter === lastChapter ? lastVerse : entry.verses;
        return `${book.name} ${entry.chapter}:${from}${to === from ? '' : `-${to}`}`;
      });
  }
  if (!match) return [book.name];

  const chapterNumbers = match[2].split('-').map(Number);
  const firstChapter = chapterNumbers[0];
  const lastChapter = chapterNumbers[1] ?? firstChapter;
  if (firstChapter < 1 || lastChapter < firstChapter || lastChapter > book.chapters.length) {
    return null;
  }

  if (!match[3]) {
    return Array.from(
      { length: lastChapter - firstChapter + 1 },
      (_, index) => `${book.name} ${firstChapter + index}`,
    );
  }
  if (chapterNumbers.length > 1) return null;

  const chapter = book.chapters.find((entry) => entry.chapter === firstChapter);
  if (!chapter) return null;
  const references: string[] = [];
  for (const part of match[3].split(',')) {
    const verseNumbers = part.trim().split('-').map(Number);
    const from = verseNumbers[0];
    const to = verseNumbers[1] ?? from;
    if (from < 1 || to < from || to > chapter.verses) return null;
    references.push(`${book.name} ${firstChapter}:${from}${to === from ? '' : `-${to}`}`);
  }
  return references;
}

function isBlank(value: unknown) {
  return value == null || (typeof value === 'string' && value.trim() === '');
}

function parseColumns(header: unknown[]) {
  const columns = new Map<Column, number>();
  const ignoredColumns: string[] = [];
  const issues: string[] = [];
  header.forEach((value, index) => {
    if (isBlank(value)) return;
    const label = String(value)
      .replace(/^\uFEFF/, '')
      .trim();
    const normalizedLabel = label.toLowerCase().replace(/[\s-]+/g, '_');
    const column = COLUMN_ALIASES[normalizedLabel];
    if (!column) ignoredColumns.push(label);
    else if (columns.has(column))
      issues.push(`Header row: more than one column maps to "${column}". Keep only one.`);
    else columns.set(column, index);
  });
  if (!columns.size) {
    issues.push(
      'Include at least one recognized plan or day column. Download the template for an example.',
    );
  }
  if (issues.length) throw new PlanImportError(issues);
  return { columns, ignoredColumns };
}

export function parsePlanRows(rows: unknown[][]): ImportedPlan {
  const headerIndex = rows.findIndex((row) => row.some((value) => !isBlank(value)));
  if (headerIndex === -1)
    throw new PlanImportError(['The file is empty. Add a header row and at least one day.']);

  const issues: string[] = [];
  const addIssue = (message: string) => {
    if (issues.length < MAX_ISSUES) issues.push(message);
  };
  const header = rows[headerIndex];
  const { columns, ignoredColumns } = parseColumns(header);

  const dayRows: { day: ImportedPlanDay; row: number; number: string }[] = [];
  const metadata: { title?: string; description?: string; coverImage?: string } = {};
  const warnings: string[] = [];
  if (ignoredColumns.length) warnings.push(`Ignored columns: ${ignoredColumns.join(', ')}.`);

  const readValue = (row: unknown[], field: Column, rowNumber: number) => {
    const index = columns.get(field);
    const value = index === undefined ? undefined : row[index];
    if (isBlank(value)) return '';
    if (typeof value === 'string') return value.replace(/\r\n?/g, '\n').trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    addIssue(
      `Row ${rowNumber}: "${field}" must be text${field === 'day_number' ? ' or a number' : ''}. Format date cells as text.`,
    );
    return '';
  };

  for (let index = headerIndex + 1; index < rows.length; index++) {
    const row = rows[index];
    const rowNumber = index + 1;
    if (row.every(isBlank)) continue;

    row.forEach((value, columnIndex) => {
      if (!isBlank(value) && isBlank(header[columnIndex])) {
        addIssue(`Row ${rowNumber}: column ${columnIndex + 1} has data but no header.`);
      }
    });

    for (const [field, key, maxLength] of [
      ['plan_title', 'title', 120],
      ['plan_description', 'description', 500],
    ] as const) {
      const value = readValue(row, field, rowNumber);
      if (value.length > maxLength)
        addIssue(`Row ${rowNumber}: "${field}" must be ${maxLength} characters or fewer.`);
      if (value && metadata[key] && value !== metadata[key]) {
        addIssue(
          `Row ${rowNumber}: "${field}" differs from an earlier row. Use one consistent value per file.`,
        );
      } else if (value) {
        metadata[key] = value;
      }
    }

    const coverImage = readValue(row, 'cover_image', rowNumber);
    if (coverImage) {
      try {
        const url = new URL(coverImage);
        if (
          !/^https?:\/\//i.test(coverImage) ||
          /\s/.test(coverImage) ||
          !['https:', 'http:'].includes(url.protocol) ||
          url.username ||
          url.password
        ) {
          throw new Error('Invalid image URL');
        }
      } catch {
        addIssue(
          `Row ${rowNumber}: "cover_image" must be a full http:// or https:// image URL without embedded credentials. Local paths and embedded Excel pictures are not supported.`,
        );
      }
      if (metadata.coverImage && metadata.coverImage !== coverImage) {
        addIssue(
          `Row ${rowNumber}: "cover_image" differs from an earlier row in this plan. Use one cover URL per plan.`,
        );
      } else {
        metadata.coverImage = coverImage;
      }
    }

    const number = readValue(row, 'day_number', rowNumber);
    const title = readValue(row, 'title', rowNumber);
    const content = readValue(row, 'content', rowNumber);
    const scriptureText = readValue(row, 'scriptures', rowNumber);
    if (!number && !title && !content && !scriptureText) continue;
    if (title.length > 120)
      addIssue(`Row ${rowNumber}: the day title must be 120 characters or fewer.`);

    const scriptures: string[] = [];
    for (const reference of scriptureText
      .split(/[;\n]+/)
      .map((value) => value.trim())
      .filter(Boolean)) {
      const parsed = parseScripture(reference);
      if (parsed) scriptures.push(...parsed);
      else
        addIssue(
          `Row ${rowNumber}: invalid scripture "${reference}". Use a book, chapter, or verse reference such as John 3:16-18 or Exodus 6:28-7:7; separate references with semicolons.`,
        );
    }

    dayRows.push({
      row: rowNumber,
      number,
      day: { day_number: 0, title, content, scriptures: [...new Set(scriptures)] },
    });
    if (dayRows.length > MAX_IMPORT_DAYS) {
      addIssue(`A plan can contain at most ${MAX_IMPORT_DAYS} days.`);
      break;
    }
  }

  // if (!dayRows.length) {
  //   warnings.push(
  //     'No days were found. This plan will start with an empty Day 1; add or import its days from the Days page.',
  //   );
  // }

  const hasDayNumbers = dayRows.some(({ number }) => number !== '');
  const seenNumbers = new Set<number>();
  dayRows.forEach(({ day, row, number }, index) => {
    if (!hasDayNumbers) {
      day.day_number = index + 1;
      return;
    }
    const dayNumber = Number(number);
    if (
      !/^\d+$/.test(number) ||
      !Number.isSafeInteger(dayNumber) ||
      dayNumber < 1 ||
      dayNumber > MAX_IMPORT_DAYS
    ) {
      addIssue(
        `Row ${row}: "day_number" must be a whole number from 1 to ${MAX_IMPORT_DAYS}. Fill every day number or leave all of them blank.`,
      );
    } else if (seenNumbers.has(dayNumber)) {
      addIssue(`Row ${row}: day ${dayNumber} is duplicated. Use one row per day.`);
    } else {
      day.day_number = dayNumber;
      seenNumbers.add(dayNumber);
    }
  });

  const days = dayRows.map(({ day }) => day).sort((a, b) => a.day_number - b.day_number);
  if (hasDayNumbers && !issues.length && days.some((day, index) => day.day_number !== index + 1)) {
    addIssue(`Row ${dayRows[0].row}: Day numbers must run from 1 to ${days.length} without gaps.`);
  }
  if (issues.length) throw new PlanImportError(issues);

  const withoutScriptures = days.filter((day) => day.scriptures.length === 0).length;
  const withoutContent = days.filter((day) => day.content.length === 0).length;
  if (withoutScriptures)
    warnings.push(
      `${withoutScriptures} ${withoutScriptures === 1 ? 'day needs' : 'days need'} scripture references before submission.`,
    );
  if (withoutContent)
    warnings.push(
      `${withoutContent} ${withoutContent === 1 ? 'day has' : 'days have'} no devotional content. Content is optional only for Reading or Memorization plans.`,
    );

  return { days, ...metadata, warnings };
}

export function parsePlanCsv(text: string): ImportedPlan {
  if (text.includes('\0'))
    throw new PlanImportError(['Save the file as UTF-8 CSV, then try again.']);
  const result = Papa.parse<string[]>(text.replace(/^\uFEFF/, ''), {
    header: false,
    skipEmptyLines: false,
    delimitersToGuess: [',', ';', '\t'],
  });
  const errors = result.errors.filter((error) => error.code !== 'UndetectableDelimiter');
  if (errors.length) {
    throw new PlanImportError(
      errors.map(
        (error) =>
          `CSV ${error.row === undefined ? 'file' : `row ${error.row + 1}`}: ${error.message}`,
      ),
    );
  }
  return parsePlanRows(result.data);
}

export async function parsePlanFile(file: File): Promise<ImportedPlan> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension !== 'csv' && extension !== 'xlsx') {
    throw new PlanImportError([
      'Choose an .xlsx or .csv file. For older .xls workbooks, save a copy as .xlsx first.',
    ]);
  }
  if (file.size > MAX_IMPORT_FILE_MB * 1024 * 1024) {
    throw new PlanImportError([`Choose a file no larger than ${MAX_IMPORT_FILE_MB} MB.`]);
  }
  if (!file.size) throw new PlanImportError(['The file is empty.']);

  try {
    if (extension === 'csv') return parsePlanCsv(await file.text());
    const { default: readWorkbook } = await import('read-excel-file/browser');
    const sheets = await readWorkbook(await file.arrayBuffer());
    const daysSheet = sheets.find((entry) => entry.sheet.trim().toLowerCase() === 'days');
    const contentSheets = sheets.filter(
      (entry) =>
        entry.sheet.trim().toLowerCase() !== 'instructions' &&
        entry.data.some((row) => row.some((value) => !isBlank(value))),
    );
    if (!contentSheets.length)
      throw new PlanImportError(['The workbook does not contain a worksheet with plan days.']);
    if (contentSheets.length > 1) {
      throw new PlanImportError([
        'This workbook contains more than one populated worksheet. Keep one plan in a single Days worksheet and import one plan per file.',
      ]);
    }
    const sheet = daysSheet ?? contentSheets[0];
    try {
      const plan = parsePlanRows(sheet.data);
      plan.sheetName = sheet.sheet;
      if (!daysSheet && !plan.title) plan.title = sheet.sheet;
      return plan;
    } catch (error) {
      if (!(error instanceof PlanImportError)) throw error;
      throw new PlanImportError(
        error.issues.map((issue) => `Worksheet "${sheet.sheet}": ${issue}`),
      );
    }
  } catch (error) {
    if (error instanceof PlanImportError) throw error;
    throw new PlanImportError([
      'The file could not be read. Make sure it is an unencrypted .xlsx workbook or a UTF-8 CSV file.',
    ]);
  }
}

function toEditorHtml(text: string) {
  if (!text.trim()) return '';
  return text
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((paragraph) => {
      const escaped = paragraph
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\n/g, '<br />');
      return `<p>${escaped}</p>`;
    })
    .join('');
}

export function createImportedDays(days: ImportedPlanDay[], startAt = 1) {
  return days.map((day, index) => ({
    id: crypto.randomUUID(),
    day_number: startAt + index,
    title: day.title,
    content: toEditorHtml(day.content),
    scriptures: [...day.scriptures],
  }));
}
