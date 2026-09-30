import type { RiskEvaluationInput, RiskFindingStatus, RiskRuleId } from '../types';

// ---- Contract vocabularies (must match the risk model API exactly) ----

export const RULE_IDS: RiskRuleId[] = ['PROC_001', 'DOC_001', 'FIN_001', 'COI_001', 'CYB_001', 'CAP_001'];
export const FINDING_STATUSES: RiskFindingStatus[] = ['none', 'weak_signal', 'observed', 'corroborated', 'confirmed'];
export const CURRENCIES = ['SAR', 'EUR', 'USD'] as const;

export const COUNT_FIELDS = [
  'lot_count',
  'bid_count',
  'tenderer_count',
  'award_count',
  'supplier_count',
  'document_count',
] as const;

export type CountField = (typeof COUNT_FIELDS)[number];
export type ScalarField = 'record_id' | 'tender_value_amount' | 'tender_value_currency' | CountField;
export const SCALAR_FIELDS: ScalarField[] = ['record_id', 'tender_value_amount', 'tender_value_currency', ...COUNT_FIELDS];

// ---- Form state: raw strings, so imported invalid values stay visible and editable ----

export interface FindingDraft {
  key: string; // React key only — never sent to the API
  rule_id: string;
  status: string;
  manifestation: string;
  evidence_references: string[];
}

export type TenderFormState = Record<ScalarField, string> & { findings: FindingDraft[] };

/** A record coming from any import source (CSV, Excel, Google Sheets — and later PDF/Word). */
export interface ImportedTenderRecord {
  fields: Partial<Record<ScalarField, string>>;
  findings: Omit<FindingDraft, 'key'>[];
}

let findingKeySeq = 0;
const nextFindingKey = () => `finding-${++findingKeySeq}`;

export const emptyFinding = (): FindingDraft => ({
  key: nextFindingKey(),
  rule_id: '',
  status: '',
  manifestation: '',
  evidence_references: [],
});

export const emptyForm = (): TenderFormState => ({
  record_id: '',
  tender_value_amount: '',
  tender_value_currency: 'SAR',
  lot_count: '',
  bid_count: '',
  tenderer_count: '',
  award_count: '',
  supplier_count: '',
  document_count: '',
  findings: [],
});

/** Converts an imported record into form state (values are kept as-is so validation can flag them). */
export const recordToFormState = (record: ImportedTenderRecord): TenderFormState => {
  const form = emptyForm();
  for (const field of SCALAR_FIELDS) {
    const value = record.fields[field];
    if (value !== undefined) form[field] = value;
  }
  if (form.tender_value_currency) form.tender_value_currency = form.tender_value_currency.trim().toUpperCase();
  form.findings = record.findings.map((finding) => ({ ...finding, key: nextFindingKey() }));
  return form;
};

// ---- Numbers ----

const ARABIC_DIGITS = /[٠-٩۰-۹]/g;

/** Normalizes a numeric string: Arabic-Indic digits → ASCII, thousands separators and spaces removed. */
export const normalizeNumberText = (value: string): string =>
  value
    .replace(ARABIC_DIGITS, (d) => String((d.charCodeAt(0) & 0xf) % 10))
    .replace(/[,\s٬ ]/g, '')
    .replace(/٫/g, '.')
    .trim();

const parseNumber = (value: string): number | null => {
  const text = normalizeNumberText(value);
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(text)) return null;
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
};

// ---- Validation (mirrors the API contract) ----

export type ValidationError =
  | 'required'
  | 'amount_positive'
  | 'whole_number'
  | 'currency'
  | 'rule_required'
  | 'status_required'
  | 'manifestation_required';

export interface FormErrors {
  fields: Partial<Record<ScalarField, ValidationError>>;
  findings: Record<string, Partial<Record<'rule_id' | 'status' | 'manifestation', ValidationError>>>;
}

export const validateForm = (form: TenderFormState): FormErrors => {
  const errors: FormErrors = { fields: {}, findings: {} };

  if (!form.record_id.trim()) errors.fields.record_id = 'required';

  if (!form.tender_value_amount.trim()) errors.fields.tender_value_amount = 'required';
  else {
    const amount = parseNumber(form.tender_value_amount);
    if (amount === null || amount <= 0) errors.fields.tender_value_amount = 'amount_positive';
  }

  if (!form.tender_value_currency.trim()) errors.fields.tender_value_currency = 'required';
  else if (!(CURRENCIES as readonly string[]).includes(form.tender_value_currency)) errors.fields.tender_value_currency = 'currency';

  for (const field of COUNT_FIELDS) {
    if (!form[field].trim()) {
      errors.fields[field] = 'required';
      continue;
    }
    const count = parseNumber(form[field]);
    if (count === null || !Number.isInteger(count) || count < 0) errors.fields[field] = 'whole_number';
  }

  for (const finding of form.findings) {
    const findingErrors: FormErrors['findings'][string] = {};
    if (!RULE_IDS.includes(finding.rule_id as RiskRuleId)) findingErrors.rule_id = 'rule_required';
    if (!FINDING_STATUSES.includes(finding.status as RiskFindingStatus)) findingErrors.status = 'status_required';
    if (finding.rule_id && !finding.manifestation.trim()) findingErrors.manifestation = 'manifestation_required';
    if (Object.keys(findingErrors).length) errors.findings[finding.key] = findingErrors;
  }

  return errors;
};

export const hasErrors = (errors: FormErrors): boolean =>
  Object.keys(errors.fields).length > 0 || Object.keys(errors.findings).length > 0;

/**
 * The single exact-contract request builder used by every caller (Tender Risk Assessment form and
 * the Indicators demo documents). Copies only the contract fields, so nothing extra can reach the API
 * (it rejects unknown fields with 422).
 */
export const buildRiskRequest = (input: RiskEvaluationInput): RiskEvaluationInput => ({
  record_id: input.record_id,
  tender_value_amount: input.tender_value_amount,
  tender_value_currency: input.tender_value_currency,
  lot_count: input.lot_count,
  bid_count: input.bid_count,
  tenderer_count: input.tenderer_count,
  award_count: input.award_count,
  supplier_count: input.supplier_count,
  document_count: input.document_count,
  findings: input.findings.map((finding) => ({
    rule_id: finding.rule_id,
    status: finding.status,
    manifestation: finding.manifestation,
    evidence_references: [...finding.evidence_references],
  })),
});

/** Converts a valid form into the exact API contract. Call only on a valid form. */
export const toRiskInput = (form: TenderFormState): RiskEvaluationInput => buildRiskRequest({
  record_id: form.record_id.trim(),
  tender_value_amount: parseNumber(form.tender_value_amount) as number,
  tender_value_currency: form.tender_value_currency,
  lot_count: parseNumber(form.lot_count) as number,
  bid_count: parseNumber(form.bid_count) as number,
  tenderer_count: parseNumber(form.tenderer_count) as number,
  award_count: parseNumber(form.award_count) as number,
  supplier_count: parseNumber(form.supplier_count) as number,
  document_count: parseNumber(form.document_count) as number,
  findings: form.findings.map((finding) => ({
    rule_id: finding.rule_id as RiskRuleId,
    status: finding.status as RiskFindingStatus,
    manifestation: finding.manifestation.trim(),
    evidence_references: finding.evidence_references.map((ref) => ref.trim()).filter(Boolean),
  })),
});
