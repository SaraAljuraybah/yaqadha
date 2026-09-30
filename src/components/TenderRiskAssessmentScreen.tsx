import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Download,
  FileSpreadsheet,
  FileUp,
  ListChecks,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import { RiskEvaluationResult } from '../types';
import { TranslationKey, useLanguage } from '../i18n';
import { evaluateRisk, RiskApiError, RiskErrorCode } from '../services/riskApi';
import {
  COUNT_FIELDS,
  CURRENCIES,
  emptyFinding,
  emptyForm,
  FindingDraft,
  FINDING_STATUSES,
  hasErrors,
  ImportedTenderRecord,
  recordToFormState,
  RULE_IDS,
  ScalarField,
  TenderFormState,
  toRiskInput,
  validateForm,
  ValidationError
} from '../services/tenderForm';
import { ImportErrorCode, parseTenderCsvFile, TenderImportError } from '../services/tenderImport';
import { RiskErrorState, RiskLoadingState, RiskResultCard } from './RiskResultCard';

type EvaluationState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; result: RiskEvaluationResult }
  | { kind: 'error'; code: RiskErrorCode };

type ImportStatus =
  | { kind: 'success'; count: number }
  | { kind: 'error'; code: ImportErrorCode };

const TEMPLATE_URL = '/templates/yaqadha-import-template.csv';

// Same input look as the platform's search fields
const inputBase =
  'w-full text-xs sm:text-sm font-normal text-slate-800 rounded-2xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#2C3E28] focus:border-[#2C3E28] transition-all shadow-2xs placeholder:text-slate-400 box-border';
const inputClass = (invalid: boolean) => `${inputBase} h-11 px-3.5 ${invalid ? 'border-red-300' : 'border-slate-200'}`;
const primaryButton = (enabled: boolean) =>
  `px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all ${
    enabled
      ? 'bg-[#2C3E28] hover:bg-[#233220] active:scale-95 text-white shadow-[#2C3E28]/20 cursor-pointer'
      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
  }`;
const outlineButton =
  'px-4 py-2.5 rounded-xl bg-white border border-[#2C3E28] text-[#2C3E28] hover:bg-[#2C3E28]/5 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5';

const formatAmount = (amount: string | undefined) => {
  const n = Number(amount);
  return amount && Number.isFinite(n) ? n.toLocaleString('en-US') : amount ?? '';
};

export const TenderRiskAssessmentScreen: React.FC = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState<TenderFormState>(emptyForm);
  const [touched, setTouched] = useState<Set<string>>(() => new Set());
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [importedRecords, setImportedRecords] = useState<ImportedTenderRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState('');
  const [importStatus, setImportStatus] = useState<ImportStatus | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationState>({ kind: 'idle' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const requestSeq = useRef(0);

  const errors = useMemo(() => validateForm(form), [form]);
  const isValid = !hasErrors(errors);

  const touch = (key: string) => setTouched((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  const visible = (key: string, error: ValidationError | undefined) => (error && (showAllErrors || touched.has(key)) ? error : undefined);

  /**
   * Single entry point for every auto-fill source (CSV today; PDF/Word imports can reuse it later).
   * Values are kept as imported and all errors are shown immediately so the user can fix them.
   */
  const prefillForm = useCallback((record: ImportedTenderRecord) => {
    requestSeq.current++;
    setForm(recordToFormState(record));
    setTouched(new Set());
    setShowAllErrors(true);
    setEvaluation({ kind: 'idle' });
  }, []);

  const setField = (field: ScalarField, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const updateFinding = (key: string, patch: Partial<FindingDraft>) =>
    setForm((prev) => ({ ...prev, findings: prev.findings.map((f) => (f.key === key ? { ...f, ...patch } : f)) }));

  const addFinding = () => setForm((prev) => ({ ...prev, findings: [...prev.findings, emptyFinding()] }));

  const removeFinding = (key: string) => setForm((prev) => ({ ...prev, findings: prev.findings.filter((f) => f.key !== key) }));

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // allow re-importing the same file
    if (!file) return;
    try {
      const records = await parseTenderCsvFile(file);
      setImportedRecords(records);
      setImportStatus({ kind: 'success', count: records.length });
      if (records.length === 1) {
        setSelectedRecord('0');
        prefillForm(records[0]);
      } else {
        setSelectedRecord('');
      }
    } catch (err) {
      setImportedRecords([]);
      setSelectedRecord('');
      setImportStatus({ kind: 'error', code: err instanceof TenderImportError ? err.code : 'unreadable_file' });
    }
  };

  const selectRecord = (value: string) => {
    setSelectedRecord(value);
    const record = importedRecords[Number(value)];
    if (value !== '' && record) prefillForm(record);
  };

  const evaluate = async () => {
    if (!isValid) return;
    const seq = ++requestSeq.current;
    setEvaluation({ kind: 'loading' });
    try {
      const result = await evaluateRisk(toRiskInput(form));
      if (seq === requestSeq.current) setEvaluation({ kind: 'success', result });
    } catch (err) {
      if (seq === requestSeq.current) setEvaluation({ kind: 'error', code: err instanceof RiskApiError ? err.code : 'upstream_error' });
    }
  };

  const reset = () => {
    requestSeq.current++;
    setForm(emptyForm());
    setTouched(new Set());
    setShowAllErrors(false);
    setSelectedRecord('');
    setEvaluation({ kind: 'idle' });
  };

  const errorText = (error: ValidationError | undefined) =>
    error ? <p className="text-[11px] text-red-700 font-medium mt-1">{t(`tenderRisk.errors.${error}` as TranslationKey)}</p> : null;

  const fieldLabel = (field: ScalarField) => (
    <label htmlFor={`tender-field-${field}`} className="flex items-baseline justify-between gap-2 mb-1.5">
      <span className="text-xs font-bold text-slate-700">{t(`tenderRisk.fields.${field}` as TranslationKey)}</span>
      <span className="font-mono text-[10px] text-slate-400">{field}</span>
    </label>
  );

  const textField = (field: ScalarField, numeric: boolean) => {
    const error = visible(field, errors.fields[field]);
    return (
      <div key={field}>
        {fieldLabel(field)}
        <input
          id={`tender-field-${field}`}
          type="text"
          inputMode={numeric ? 'decimal' : 'text'}
          dir={numeric ? 'ltr' : undefined}
          value={form[field]}
          onChange={(e) => setField(field, e.target.value)}
          onBlur={() => touch(field)}
          aria-invalid={!!error}
          className={`${inputClass(!!error)} ${numeric ? 'rtl:text-right' : ''}`}
        />
        {errorText(error)}
      </div>
    );
  };

  const currencyError = visible('tender_value_currency', errors.fields.tender_value_currency);
  const currencyIsKnown = (CURRENCIES as readonly string[]).includes(form.tender_value_currency);

  return (
    <div id="tender-risk-assessment-screen" className="space-y-6 text-start pb-10">

      {/* 1. Header Title */}
      <div className="pt-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('tenderRisk.title')}</h1>
        <p className="text-xs sm:text-sm font-normal text-slate-600 mt-1">{t('tenderRisk.subtitle')}</p>
      </div>

      {/* 2. CSV import panel */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 text-[#2C3E28] flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-slate-900">{t('tenderRisk.importTitle')}</h3>
              <p className="text-xs text-slate-600 font-normal">{t('tenderRisk.importSubtitle')}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input ref={fileInputRef} id="tender-csv-input" type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
            <button id="btn-import-csv" type="button" onClick={() => fileInputRef.current?.click()} className={outlineButton}>
              <FileUp className="w-4 h-4" />
              <span>{t('tenderRisk.importButton')}</span>
            </button>
            <a
              id="link-download-template"
              href={TEMPLATE_URL}
              download
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2C3E28] hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('tenderRisk.downloadTemplate')}</span>
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
          <span>{t('tenderRisk.importHint')}</span>
          <span className="text-slate-300">•</span>
          <span>{t('tenderRisk.fileLimits')}</span>
        </div>

        {importStatus?.kind === 'error' && (
          <div className="p-3 rounded-xl bg-red-50/70 border border-red-200 flex items-start gap-2" role="alert">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-red-900">{t('tenderRisk.importErrorTitle')}</div>
              <p className="text-xs text-red-800">{t(`tenderRisk.importErrors.${importStatus.code}` as TranslationKey)}</p>
            </div>
          </div>
        )}

        {importStatus?.kind === 'success' && (
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {importStatus.count === 1
                  ? t('tenderRisk.importedOne')
                  : t('tenderRisk.importedMany', { count: importStatus.count })}
              </span>
            </div>

            {importedRecords.length > 1 && (
              <div className="flex items-center gap-2 md:ms-auto">
                <label htmlFor="tender-record-select" className="text-xs font-bold text-slate-700 whitespace-nowrap">
                  {t('tenderRisk.selectTender')}
                </label>
                <select
                  id="tender-record-select"
                  value={selectedRecord}
                  onChange={(e) => selectRecord(e.target.value)}
                  className={`${inputClass(false)} min-w-[16rem] cursor-pointer`}
                >
                  <option value="">{t('tenderRisk.selectTenderPlaceholder')}</option>
                  {importedRecords.map((record, i) => (
                    <option key={i} value={String(i)}>
                      {`${record.fields.record_id || '—'} · ${formatAmount(record.fields.tender_value_amount)} ${(record.fields.tender_value_currency ?? '').toUpperCase()}`.trim()}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. The form */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-5 md:p-6 space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 text-[#2C3E28] flex items-center justify-center shrink-0">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-slate-900">{t('tenderRisk.formTitle')}</h3>
            <p className="text-xs text-slate-600 font-normal">{t('tenderRisk.formSubtitle')}</p>
          </div>
        </div>

        {/* Scalar fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {textField('record_id', false)}
          {textField('tender_value_amount', true)}
          <div>
            {fieldLabel('tender_value_currency')}
            <select
              id="tender-field-tender_value_currency"
              value={form.tender_value_currency}
              onChange={(e) => setField('tender_value_currency', e.target.value)}
              onBlur={() => touch('tender_value_currency')}
              aria-invalid={!!currencyError}
              className={`${inputClass(!!currencyError)} cursor-pointer`}
            >
              {!currencyIsKnown && <option value={form.tender_value_currency}>{form.tender_value_currency || '—'}</option>}
              {CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            {errorText(currencyError)}
          </div>
          {COUNT_FIELDS.map((field) => textField(field, true))}
        </div>

        {/* Findings */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-slate-600" />
              <span className="text-xs sm:text-sm font-bold text-slate-900">{t('tenderRisk.findingsTitle')}</span>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">{form.findings.length}</span>
            </div>
            <button id="btn-add-finding" type="button" onClick={addFinding} className={outlineButton}>
              <Plus className="w-4 h-4" />
              <span>{t('tenderRisk.addFinding')}</span>
            </button>
          </div>

          {form.findings.length === 0 && (
            <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">{t('tenderRisk.findingsEmpty')}</p>
          )}

          {form.findings.map((finding, index) => {
            const findingErrors = errors.findings[finding.key] ?? {};
            const ruleError = visible(`${finding.key}.rule_id`, findingErrors.rule_id);
            const statusError = visible(`${finding.key}.status`, findingErrors.status);
            const manifestationError = visible(`${finding.key}.manifestation`, findingErrors.manifestation);
            const ruleKnown = (RULE_IDS as string[]).includes(finding.rule_id);
            const statusKnown = (FINDING_STATUSES as string[]).includes(finding.status);

            return (
              <div key={finding.key} data-finding-index={index} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-700">{t('tenderRisk.findingNumber', { number: index + 1 })}</span>
                  <button
                    type="button"
                    onClick={() => removeFinding(finding.key)}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-red-700 hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t('tenderRisk.removeFinding')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="flex items-baseline justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-slate-700">{t('tenderRisk.ruleLabel')}</span>
                      <span className="font-mono text-[10px] text-slate-400">rule_id</span>
                    </label>
                    <select
                      data-field="rule_id"
                      value={finding.rule_id}
                      onChange={(e) => updateFinding(finding.key, { rule_id: e.target.value })}
                      onBlur={() => touch(`${finding.key}.rule_id`)}
                      aria-invalid={!!ruleError}
                      className={`${inputClass(!!ruleError)} cursor-pointer`}
                    >
                      <option value="">{t('tenderRisk.rulePlaceholder')}</option>
                      {!ruleKnown && finding.rule_id && <option value={finding.rule_id}>{finding.rule_id}</option>}
                      {RULE_IDS.map((id) => (
                        <option key={id} value={id}>{`${id} — ${t(`tenderRisk.rules.${id}`)}`}</option>
                      ))}
                    </select>
                    {errorText(ruleError)}
                  </div>
                  <div>
                    <label className="flex items-baseline justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-slate-700">{t('tenderRisk.statusLabel')}</span>
                      <span className="font-mono text-[10px] text-slate-400">status</span>
                    </label>
                    <select
                      data-field="status"
                      value={finding.status}
                      onChange={(e) => updateFinding(finding.key, { status: e.target.value })}
                      onBlur={() => touch(`${finding.key}.status`)}
                      aria-invalid={!!statusError}
                      className={`${inputClass(!!statusError)} cursor-pointer`}
                    >
                      <option value="">{t('tenderRisk.statusPlaceholder')}</option>
                      {!statusKnown && finding.status && <option value={finding.status}>{finding.status}</option>}
                      {FINDING_STATUSES.map((status) => (
                        <option key={status} value={status}>{t(`tenderRisk.statuses.${status}`)}</option>
                      ))}
                    </select>
                    {errorText(statusError)}
                  </div>
                </div>

                <div>
                  <label className="flex items-baseline justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-700">{t('tenderRisk.manifestationLabel')}</span>
                    <span className="font-mono text-[10px] text-slate-400">manifestation</span>
                  </label>
                  <textarea
                    data-field="manifestation"
                    rows={2}
                    value={finding.manifestation}
                    placeholder={t('tenderRisk.manifestationPlaceholder')}
                    onChange={(e) => updateFinding(finding.key, { manifestation: e.target.value })}
                    onBlur={() => touch(`${finding.key}.manifestation`)}
                    aria-invalid={!!manifestationError}
                    className={`${inputBase} p-3 leading-relaxed ${manifestationError ? 'border-red-300' : 'border-slate-200'}`}
                  />
                  {errorText(manifestationError)}
                </div>

                <div>
                  <label className="flex items-baseline justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-700">{t('tenderRisk.evidenceLabel')}</span>
                    <span className="font-mono text-[10px] text-slate-400">evidence_references</span>
                  </label>
                  <EvidenceTagsInput
                    values={finding.evidence_references}
                    onChange={(evidence_references) => updateFinding(finding.key, { evidence_references })}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <p className="text-[11px] text-slate-500">{!isValid ? t('tenderRisk.invalidHint') : ''}</p>
          <div className="flex items-center justify-end gap-2.5">
            <button
              id="btn-reset-tender-form"
              type="button"
              onClick={reset}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {t('tenderRisk.reset')}
            </button>
            <button
              id="btn-evaluate-tender"
              type="button"
              disabled={!isValid || evaluation.kind === 'loading'}
              onClick={evaluate}
              className={primaryButton(isValid && evaluation.kind !== 'loading')}
            >
              {evaluation.kind === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{t('tenderRisk.evaluate')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Result (shared risk results card) */}
      {evaluation.kind !== 'idle' && (
        <section id="tender-risk-result" className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
          <h3 className="text-sm md:text-base font-bold text-slate-900 border-b border-slate-100 pb-3">{t('tenderRisk.resultTitle')}</h3>
          {evaluation.kind === 'loading' && <RiskLoadingState />}
          {evaluation.kind === 'error' && <RiskErrorState code={evaluation.code} onRetry={evaluate} />}
          {evaluation.kind === 'success' && <RiskResultCard result={evaluation.result} />}
        </section>
      )}
    </div>
  );
};

/** Tags input for evidence references: Enter, comma or semicolon adds a tag; Backspace on empty removes the last one. */
const EvidenceTagsInput: React.FC<{ values: string[]; onChange: (values: string[]) => void }> = ({ values, onChange }) => {
  const { t } = useLanguage();
  const [draft, setDraft] = useState('');

  const commit = (text: string) => {
    const additions = text.split(/[;,]/).map((part) => part.trim()).filter((part) => part && !values.includes(part));
    if (additions.length) onChange([...values, ...additions]);
    setDraft('');
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 min-h-11 px-2.5 py-1.5 rounded-2xl border border-slate-200 bg-white shadow-2xs focus-within:ring-2 focus-within:ring-[#2C3E28] focus-within:border-[#2C3E28] transition-all">
      {values.map((ref) => (
        <span key={ref} className="inline-flex items-center gap-1 ps-2 pe-1 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-700">
          <bdi>{ref}</bdi>
          <button
            type="button"
            aria-label={t('tenderRisk.removeEvidence', { ref })}
            onClick={() => onChange(values.filter((v) => v !== ref))}
            className="p-0.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        data-field="evidence_references"
        type="text"
        value={draft}
        placeholder={values.length ? '' : t('tenderRisk.evidencePlaceholder')}
        onChange={(e) => {
          const text = e.target.value;
          if (/[;,]/.test(text)) commit(text);
          else setDraft(text);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit(draft);
          } else if (e.key === 'Backspace' && !draft && values.length) {
            onChange(values.slice(0, -1));
          }
        }}
        onBlur={() => draft && commit(draft)}
        className="flex-1 min-w-[8rem] h-7 bg-transparent text-xs text-slate-800 focus:outline-none placeholder:text-slate-400"
      />
    </div>
  );
};
