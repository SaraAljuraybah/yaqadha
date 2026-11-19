import type { RiskEvaluationInput } from '../types';

// ---- Fields of the risk model v1.1 request (order = form order) ----

export const COUNT_FIELDS = [
  'items_count',
  'bids_count',
  'competitors_count',
  'prior_awards_count',
  'winning_suppliers_count',
  'documents_count',
  'submission_period_days',
] as const;

export type CountField = (typeof COUNT_FIELDS)[number];
export type TenderField = 'record_id' | 'item_category' | 'tender_value_sar' | CountField;
export const TENDER_FIELDS: TenderField[] = ['record_id', 'item_category', 'tender_value_sar', ...COUNT_FIELDS];

// ---- Form state: raw strings, so imported or extracted invalid values stay visible and editable ----

export type TenderFormState = Record<TenderField, string>;

/** Values extracted from an uploaded specifications PDF (only the fields found in the file). */
export interface PrefillRecord {
  fields: Partial<Record<TenderField, string>>;
}

export const emptyForm = (): TenderFormState => ({
  record_id: '',
  item_category: '',
  tender_value_sar: '',
  items_count: '',
  bids_count: '',
  competitors_count: '',
  prior_awards_count: '',
  winning_suppliers_count: '',
  documents_count: '',
  submission_period_days: '',
});

/** Converts extracted values into form state; fields not found in the file stay empty. */
export const recordToFormState = (record: PrefillRecord): TenderFormState => {
  const form = emptyForm();
  for (const field of TENDER_FIELDS) {
    const value = record.fields[field];
    if (value !== undefined) form[field] = value;
  }
  return form;
};

// ---- Numbers ----

const ARABIC_DIGITS = /[٠-٩۰-۹]/g;

/** Normalizes a numeric string: Arabic-Indic digits → ASCII, thousands separators and spaces removed. */
export const normalizeNumberText = (value: string): string =>
  value
    .replace(ARABIC_DIGITS, (d) => String((d.charCodeAt(0) & 0xf) % 10))
    .replace(/[,\s٬ ]/g, '')
    .replace(/٫/g, '.')
    .trim();

const parseNumber = (value: string): number | null => {
  const text = normalizeNumberText(value);
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(text)) return null;
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
};

// ---- Validation (mirrors the API contract; the category is free text but required: without it there is no score) ----

export type ValidationError = 'required' | 'amount_positive' | 'whole_number';

export type FormErrors = Partial<Record<TenderField, ValidationError>>;

export const validateForm = (form: TenderFormState): FormErrors => {
  const errors: FormErrors = {};

  if (!form.record_id.trim()) errors.record_id = 'required';

  if (!form.item_category.trim()) errors.item_category = 'required';

  if (!form.tender_value_sar.trim()) errors.tender_value_sar = 'required';
  else {
    const amount = parseNumber(form.tender_value_sar);
    if (amount === null || amount <= 0) errors.tender_value_sar = 'amount_positive';
  }

  for (const field of COUNT_FIELDS) {
    if (!form[field].trim()) {
      errors[field] = 'required';
      continue;
    }
    const count = parseNumber(form[field]);
    if (count === null || !Number.isInteger(count) || count < 0) errors[field] = 'whole_number';
  }

  return errors;
};

export const hasErrors = (errors: FormErrors): boolean => Object.keys(errors).length > 0;

/**
 * The single exact-contract request builder used by every caller (Tender Risk Assessment form and the
 * case page's demo document). Copies only the contract fields, so nothing extra can reach the API.
 */
export const buildRiskRequest = (input: RiskEvaluationInput): RiskEvaluationInput => ({
  record_id: input.record_id,
  item_category: input.item_category,
  tender_value_sar: input.tender_value_sar,
  items_count: input.items_count,
  bids_count: input.bids_count,
  competitors_count: input.competitors_count,
  prior_awards_count: input.prior_awards_count,
  winning_suppliers_count: input.winning_suppliers_count,
  documents_count: input.documents_count,
  submission_period_days: input.submission_period_days,
});

/** Converts a valid form into the exact API contract. Call only on a valid form. */
export const toRiskInput = (form: TenderFormState): RiskEvaluationInput =>
  buildRiskRequest({
    record_id: form.record_id.trim(),
    item_category: form.item_category.trim(),
    tender_value_sar: parseNumber(form.tender_value_sar) as number,
    items_count: parseNumber(form.items_count) as number,
    bids_count: parseNumber(form.bids_count) as number,
    competitors_count: parseNumber(form.competitors_count) as number,
    prior_awards_count: parseNumber(form.prior_awards_count) as number,
    winning_suppliers_count: parseNumber(form.winning_suppliers_count) as number,
    documents_count: parseNumber(form.documents_count) as number,
    submission_period_days: parseNumber(form.submission_period_days) as number,
  });
