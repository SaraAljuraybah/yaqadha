import Papa from 'papaparse';
import { COUNT_FIELDS, ImportedTenderRecord, normalizeNumberText, TENDER_FIELDS, TenderField } from './tenderForm';
import { ITEM_CATEGORIES } from '../shared/itemCategories';

export const MAX_CSV_BYTES = 2 * 1024 * 1024;

export type ImportErrorCode = 'unsupported_file' | 'file_too_large' | 'unreadable_file' | 'no_records';

export class TenderImportError extends Error {
  constructor(public readonly code: ImportErrorCode) {
    super(code);
  }
}

const NUMERIC_FIELDS = new Set<TenderField>(['tender_value_sar', ...COUNT_FIELDS]);

/**
 * Column names of the previous model contract, still accepted so older sheets keep importing.
 * (Their labels in the old form were the same as the new fields'.) Governance-indicator columns
 * (findingN_*) are ignored: the model no longer accepts them.
 */
const LEGACY_COLUMNS: Record<string, TenderField> = {
  tender_value_amount: 'tender_value_sar',
  lot_count: 'items_count',
  bid_count: 'bids_count',
  tenderer_count: 'competitors_count',
  award_count: 'prior_awards_count',
  supplier_count: 'winning_suppliers_count',
  document_count: 'documents_count',
};

/** Strips thousands separators when the result is a plain number; otherwise keeps the raw value so validation can flag it. */
const stripThousands = (value: string): string => {
  const normalized = normalizeNumberText(value);
  return /^[-+]?\d*\.?\d+$/.test(normalized) ? normalized : value;
};

/** Accepts the model value or its Arabic/English label; anything else is kept so validation flags it. */
const normalizeCategory = (value: string): string => {
  const v = value.trim().toLowerCase();
  const match = ITEM_CATEGORIES.find((c) => [c.value, c.label.ar, c.label.en].some((x) => x.toLowerCase() === v));
  return match ? match.value : value;
};

const columnField = (header: string): TenderField | undefined =>
  (TENDER_FIELDS as string[]).includes(header) ? (header as TenderField) : LEGACY_COLUMNS[header];

/** Converts CSV rows into records. Row 1 holds the field keys (matched case-insensitively after trimming). */
export const rowsToRecords = (rows: string[][]): ImportedTenderRecord[] => {
  if (rows.length < 2) return [];
  const headers = rows[0].map((cell) => (cell ?? '').trim().toLowerCase());

  const records: ImportedTenderRecord[] = [];
  for (const row of rows.slice(1)) {
    const cells = headers.map((_, i) => (row[i] ?? '').trim());
    if (cells.every((cell) => cell === '')) continue;

    const record: ImportedTenderRecord = { fields: {} };
    headers.forEach((header, i) => {
      const field = columnField(header);
      if (!field) return; // unknown or ignored column
      const value = cells[i];
      // A new-name column wins over its legacy alias when both are present
      if (record.fields[field] !== undefined && LEGACY_COLUMNS[header]) return;
      record.fields[field] =
        field === 'item_category' ? normalizeCategory(value) : NUMERIC_FIELDS.has(field) && value ? stripThousands(value) : value;
    });
    records.push(record);
  }
  return records;
};

/** Parses CSV text (UTF-8 BOM and quoted values handled by papaparse). */
export const parseCsvText = (text: string): ImportedTenderRecord[] => {
  const result = Papa.parse<string[]>(text.replace(/^﻿/, ''), { skipEmptyLines: 'greedy' });
  return rowsToRecords(result.data);
};

/** Parses an uploaded .csv file in the browser (max 2 MB). */
export const parseTenderCsvFile = async (file: File): Promise<ImportedTenderRecord[]> => {
  if (!file.name.toLowerCase().endsWith('.csv')) throw new TenderImportError('unsupported_file');
  if (file.size > MAX_CSV_BYTES) throw new TenderImportError('file_too_large');

  let records: ImportedTenderRecord[];
  try {
    records = parseCsvText(await file.text());
  } catch {
    throw new TenderImportError('unreadable_file');
  }
  if (!records.length) throw new TenderImportError('no_records');
  return records;
};
