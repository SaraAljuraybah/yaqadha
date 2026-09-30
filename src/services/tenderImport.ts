import Papa from 'papaparse';
import { COUNT_FIELDS, ImportedTenderRecord, normalizeNumberText, SCALAR_FIELDS, ScalarField } from './tenderForm';

export const MAX_CSV_BYTES = 2 * 1024 * 1024;

export type ImportErrorCode = 'unsupported_file' | 'file_too_large' | 'unreadable_file' | 'no_records';

export class TenderImportError extends Error {
  constructor(public readonly code: ImportErrorCode) {
    super(code);
  }
}

const NUMERIC_FIELDS = new Set<ScalarField>(['tender_value_amount', ...COUNT_FIELDS]);
const FINDING_COLUMN = /^finding(\d+)_(rule_id|status|manifestation|evidence_references)$/;

/** Strips thousands separators when the result is a plain number; otherwise keeps the raw value so validation can flag it. */
const stripThousands = (value: string): string => {
  const normalized = normalizeNumberText(value);
  return /^[-+]?\d*\.?\d+$/.test(normalized) ? normalized : value;
};

/**
 * Converts CSV rows into records. Row 1 holds the field keys (matched case-insensitively after trimming);
 * findings use numbered columns findingN_rule_id / _status / _manifestation / _evidence_references for any N.
 * Empty rows, unknown columns, and findings without a rule_id are skipped.
 */
export const rowsToRecords = (rows: string[][]): ImportedTenderRecord[] => {
  if (rows.length < 2) return [];
  const headers = rows[0].map((cell) => (cell ?? '').trim().toLowerCase());

  const records: ImportedTenderRecord[] = [];
  for (const row of rows.slice(1)) {
    const cells = headers.map((_, i) => (row[i] ?? '').trim());
    if (cells.every((cell) => cell === '')) continue;

    const record: ImportedTenderRecord = { fields: {}, findings: [] };
    const findings = new Map<number, ImportedTenderRecord['findings'][number]>();

    headers.forEach((header, i) => {
      const value = cells[i];
      if ((SCALAR_FIELDS as string[]).includes(header)) {
        const field = header as ScalarField;
        record.fields[field] = NUMERIC_FIELDS.has(field) && value ? stripThousands(value) : value;
        return;
      }
      const match = FINDING_COLUMN.exec(header);
      if (!match) return; // unknown column
      const n = Number(match[1]);
      const finding = findings.get(n) ?? { rule_id: '', status: '', manifestation: '', evidence_references: [] };
      switch (match[2]) {
        case 'rule_id': finding.rule_id = value.toUpperCase(); break;
        case 'status': finding.status = value.toLowerCase(); break;
        case 'manifestation': finding.manifestation = value; break;
        case 'evidence_references': finding.evidence_references = value.split(';').map((ref) => ref.trim()).filter(Boolean); break;
      }
      findings.set(n, finding);
    });

    record.findings = [...findings.entries()]
      .sort(([a], [b]) => a - b)
      .map(([, finding]) => finding)
      .filter((finding) => finding.rule_id !== '');

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
