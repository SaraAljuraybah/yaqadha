import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, FileText, Loader2, RotateCcw, Sparkles, Upload } from 'lucide-react';
import { RiskEvaluationResult } from '../types';
import { TranslationKey, useLanguage } from '../i18n';
import { evaluateRisk, RiskApiError, RiskErrorCode } from '../services/riskApi';
import {
  emptyForm,
  hasErrors,
  PrefillRecord,
  recordToFormState,
  TENDER_FIELDS,
  TenderField,
  TenderFormState,
  toRiskInput,
  validateForm,
  ValidationError,
} from '../services/tenderForm';
import { checkPdfFile, ExtractErrorCode, extractTenderFields, TenderExtractError } from '../services/tenderExtract';
import { ITEM_CATEGORIES } from '../shared/itemCategories';
import { RiskErrorState, RiskLoadingState, RiskResultCard } from './RiskResultCard';

// تقييم مخاطر منافسة — upload a specifications PDF (or type the data), then evaluate with the risk model.
// Everything shown comes from the uploaded file, the user's own input, or the model's response: no demo values.

type EvaluationState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; result: RiskEvaluationResult }
  | { kind: 'error'; code: RiskErrorCode; detail?: string };

type UploadState =
  | { kind: 'idle' }
  | { kind: 'extracting'; fileName: string }
  | { kind: 'done'; fileName: string; pageCount: number | null; seconds: number; count: number }
  | { kind: 'error'; fileName?: string; code: ExtractErrorCode; detail?: string };

const card = 'bg-white rounded-2xl border border-slate-200 shadow-2xs';
const inputClass = (invalid: boolean) =>
  `w-full h-11 px-3.5 text-sm text-slate-900 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#2C3E28] placeholder:text-slate-400 ${
    invalid ? 'border-red-300' : 'border-slate-200'
  }`;
const outlineButton =
  'inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors';

const SectionHeader: React.FC<{ icon: React.ElementType; title: string; subtitle: string }> = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-start gap-3">
    <span className="w-9 h-9 rounded-xl border bg-slate-50 text-slate-600 border-slate-200 flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4" />
    </span>
    <div>
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
    </div>
  </div>
);

export const TenderRiskAssessmentScreen: React.FC = () => {
  const { lang, t } = useLanguage();
  const [form, setForm] = useState<TenderFormState>(emptyForm);
  const [extracted, setExtracted] = useState<Partial<Record<TenderField, { value: string; source: string }>>>({});
  const [touched, setTouched] = useState<Set<string>>(() => new Set());
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [upload, setUpload] = useState<UploadState>({ kind: 'idle' });
  const [isDragging, setIsDragging] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationState>({ kind: 'idle' });
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const requestSeq = useRef(0);

  const errors = useMemo(() => validateForm(form), [form]);
  const isValid = !hasErrors(errors);

  const touch = (key: string) => setTouched((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  const visible = (field: TenderField) => (errors[field] && (showAllErrors || touched.has(field)) ? errors[field] : undefined);

  /** Replaces the whole form (no leftovers from a previous file) and clears any previous result. */
  const replaceForm = useCallback((record: PrefillRecord) => {
    requestSeq.current++;
    setForm(recordToFormState(record));
    setTouched(new Set());
    setShowAllErrors(false);
    setEvaluation({ kind: 'idle' });
  }, []);

  const setField = (field: TenderField, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  // ---- PDF upload → extraction ----
  const handlePdf = async (file: File | undefined) => {
    if (!file) return;
    // A new file starts from an empty form: values from an earlier file never mix with this one
    setExtracted({});
    replaceForm({ fields: {} });
    try {
      checkPdfFile(file);
    } catch (err) {
      setUpload({ kind: 'error', fileName: file.name, code: err instanceof TenderExtractError ? err.code : 'unsupported_file' });
      return;
    }
    setUpload({ kind: 'extracting', fileName: file.name });
    try {
      const result = await extractTenderFields(file);
      setExtracted(result.fields);
      replaceForm({ fields: Object.fromEntries(Object.entries(result.fields).map(([k, v]) => [k, v?.value ?? ''])) });
      setUpload({
        kind: 'done',
        fileName: file.name,
        pageCount: result.pageCount,
        seconds: Math.max(1, Math.round(result.durationMs / 1000)),
        count: Object.keys(result.fields).length,
      });
    } catch (err) {
      setUpload({
        kind: 'error',
        fileName: file.name,
        code: err instanceof TenderExtractError ? err.code : 'extraction_failed',
        detail: err instanceof TenderExtractError ? err.detail : String((err as Error)?.message ?? err),
      });
    }
  };

  const evaluate = async () => {
    if (!isValid) {
      setShowAllErrors(true);
      return;
    }
    const seq = ++requestSeq.current;
    setEvaluation({ kind: 'loading' });
    try {
      const result = await evaluateRisk(toRiskInput(form));
      if (seq === requestSeq.current) setEvaluation({ kind: 'success', result });
    } catch (err) {
      if (seq === requestSeq.current)
        setEvaluation({
          kind: 'error',
          code: err instanceof RiskApiError ? err.code : 'upstream_error',
          detail: err instanceof RiskApiError ? err.detail : String((err as Error)?.message ?? err),
        });
    }
  };

  const reset = () => {
    setExtracted({});
    replaceForm({ fields: {} });
    setUpload({ kind: 'idle' });
  };

  // ---- field rendering ----
  const fieldTag = (field: TenderField) => {
    const source = extracted[field];
    if (!source) return null;
    const unchanged = form[field] === source.value;
    return (
      <span className={`text-[10px] font-bold ${unchanged ? 'text-emerald-700' : 'text-amber-700'}`}>
        {t(unchanged ? 'tenderRisk.extractedTag' : 'tenderRisk.editedTag')}
      </span>
    );
  };

  const renderField = (field: TenderField) => {
    const error = visible(field);
    const numeric = field !== 'record_id' && field !== 'item_category';
    const source = extracted[field]?.source;
    return (
      <div key={field}>
        <label htmlFor={`tender-field-${field}`} className="flex items-baseline justify-between gap-2 mb-1.5">
          <span className="text-xs font-bold text-slate-700">{t(`tenderRisk.fields.${field}` as TranslationKey)}</span>
          {fieldTag(field)}
        </label>
        <input
          id={`tender-field-${field}`}
          type="text"
          inputMode={numeric ? 'decimal' : 'text'}
          dir={numeric ? 'ltr' : 'auto'}
          value={form[field]}
          onChange={(e) => setField(field, e.target.value)}
          onBlur={() => touch(field)}
          aria-invalid={!!error}
          // Free text for the category, with suggestions (the model accepts any text)
          list={field === 'item_category' ? 'tender-category-suggestions' : undefined}
          placeholder={field === 'item_category' ? t('tenderRisk.categoryPlaceholder') : undefined}
          className={`${inputClass(!!error)} ${numeric ? 'rtl:text-right' : ''}`}
        />
        {source && (
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2" title={source}>
            {t('tenderRisk.fromFile', { quote: source })}
          </p>
        )}
        {error && <p className="text-[11px] text-red-700 font-medium mt-1">{t(`tenderRisk.errors.${error as ValidationError}` as TranslationKey)}</p>}
      </div>
    );
  };

  return (
    <div id="tender-risk-assessment-screen" className="space-y-6 text-start pb-10">
      <div className="pt-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('tenderRisk.title')}</h1>
        <p className="text-sm text-slate-600 mt-1">{t('tenderRisk.subtitle')}</p>
      </div>

      {/* 1. Upload the specifications PDF */}
      <section className={`${card} p-5 space-y-4`}>
        <SectionHeader icon={Upload} title={t('tenderRisk.uploadTitle')} subtitle={t('tenderRisk.uploadSubtitle')} />
        <input
          ref={pdfInputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            handlePdf(file);
          }}
        />

        {upload.kind === 'done' ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-10 h-10 rounded-xl border bg-white text-slate-600 border-slate-200 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate" dir="auto">{upload.fileName}</div>
                <div className="text-xs text-slate-500">
                  {upload.pageCount
                    ? t('tenderRisk.extractedSummary', { pages: upload.pageCount, seconds: upload.seconds })
                    : t('tenderRisk.extractedSummaryNoPages', { seconds: upload.seconds })}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {upload.count > 0
                  ? t('tenderRisk.extractedCount', { count: upload.count, total: TENDER_FIELDS.length })
                  : t('tenderRisk.extractedNone')}
              </span>
              <button type="button" className={outlineButton} onClick={() => pdfInputRef.current?.click()}>
                <Upload className="w-4 h-4" />
                {t('tenderRisk.replaceFile')}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            id="tender-pdf-dropzone"
            disabled={upload.kind === 'extracting'}
            onClick={() => pdfInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handlePdf(e.dataTransfer.files?.[0]);
            }}
            className={`w-full rounded-2xl border-2 border-dashed p-8 flex flex-col items-center gap-2 text-center transition-colors ${
              isDragging ? 'border-[#2C3E28] bg-slate-50' : 'border-slate-300 hover:bg-slate-50'
            } disabled:cursor-wait`}
          >
            {upload.kind === 'extracting' ? (
              <>
                <Loader2 className="w-6 h-6 text-[#2C3E28] animate-spin" />
                <span className="text-sm font-bold text-slate-900">{t('tenderRisk.extracting')}</span>
                <span className="text-xs text-slate-500" dir="auto">{upload.fileName}</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-slate-500" />
                <span className="text-sm font-bold text-slate-900">{t('tenderRisk.uploadPrompt')}</span>
                <span className="text-xs text-slate-500">{t('tenderRisk.uploadLimits')}</span>
              </>
            )}
          </button>
        )}

        {upload.kind === 'error' && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2" role="alert">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 min-w-0">
              <div className="text-xs font-bold text-red-800">{t('tenderRisk.extractErrorTitle')}</div>
              <div className="text-xs text-red-700">{t(`tenderRisk.extractErrors.${upload.code}` as TranslationKey)}</div>
              {upload.detail && (
                <div className="text-[11px] text-slate-600 break-words">
                  {t('riskAssessment.technicalDetail')} <bdi dir="ltr" className="font-mono">{upload.detail}</bdi>
                </div>
              )}
            </div>
          </div>
        )}

        <p className="text-[11px] text-slate-500">{t('tenderRisk.uploadNote')}</p>
      </section>

      {/* 2. Tender data (from the file, or typed in) */}
      <section className={`${card} p-5 space-y-4`}>
        <SectionHeader icon={FileText} title={t('tenderRisk.formTitle')} subtitle={t('tenderRisk.formSubtitle')} />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{TENDER_FIELDS.map(renderField)}</div>
        <datalist id="tender-category-suggestions">
          {ITEM_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label[lang]}
            </option>
          ))}
        </datalist>

        {showAllErrors && !isValid && <p className="text-xs text-red-700">{t('tenderRisk.invalidHint')}</p>}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            id="btn-tender-evaluate"
            onClick={evaluate}
            disabled={evaluation.kind === 'loading'}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[#2C3E28] hover:bg-[#233220] text-white text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-wait"
          >
            {evaluation.kind === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {t('tenderRisk.evaluate')}
          </button>
          <button type="button" className={outlineButton} onClick={reset}>
            <RotateCcw className="w-4 h-4" />
            {t('tenderRisk.reset')}
          </button>
        </div>
      </section>

      {/* 3. Result — only what the model returned */}
      {evaluation.kind !== 'idle' && (
        <section className="space-y-3" aria-live="polite">
          <h2 className="text-base font-bold text-slate-900">{t('tenderRisk.resultTitle')}</h2>
          {evaluation.kind === 'loading' && <RiskLoadingState />}
          {evaluation.kind === 'error' && <RiskErrorState code={evaluation.code} detail={evaluation.detail} onRetry={evaluate} />}
          {evaluation.kind === 'success' && <RiskResultCard result={evaluation.result} />}
        </section>
      )}
    </div>
  );
};
