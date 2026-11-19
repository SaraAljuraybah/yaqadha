import React from 'react';
import { AlertTriangle, BarChart3, Info, Loader2, RotateCcw, Sparkles, LucideIcon } from 'lucide-react';
import { RiskEvaluationResult, RiskSimilarTenders } from '../types';
import { TranslationKey, useLanguage } from '../i18n';
import { RiskErrorCode } from '../services/riskApi';
import { ITEM_CATEGORIES } from '../shared/itemCategories';

// Shared risk-model states and results card (case page panel and the Tender Risk Assessment page).
// Everything shown here comes from the model's response (v1.1); nothing is computed or invented on the client.

type Color = NonNullable<RiskEvaluationResult['risk_color']>;

const colorStyles: Record<Color, { badge: string; dot: string; score: string; bar: string; banner: string; label: TranslationKey; why: TranslationKey }> = {
  Green: {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    score: 'text-emerald-600',
    bar: 'bg-emerald-500',
    banner: 'border-emerald-200 bg-emerald-50/60',
    label: 'riskAssessment.colorGreen',
    why: 'riskAssessment.whyGreen',
  },
  Yellow: {
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
    score: 'text-amber-600',
    bar: 'bg-amber-500',
    banner: 'border-amber-200 bg-amber-50/60',
    label: 'riskAssessment.colorYellow',
    why: 'riskAssessment.whyYellow',
  },
  Red: {
    badge: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
    score: 'text-red-600',
    bar: 'bg-red-500',
    banner: 'border-red-200 bg-red-50/60',
    label: 'riskAssessment.colorRed',
    why: 'riskAssessment.whyRed',
  },
};

const errorMessages: Record<RiskErrorCode, TranslationKey> = {
  unavailable: 'riskAssessment.errorUnavailable',
  not_configured: 'riskAssessment.errorNotConfigured',
  configuration_error: 'riskAssessment.errorConfiguration',
  invalid_input: 'riskAssessment.errorInvalidInput',
  upstream_error: 'riskAssessment.errorUpstream',
};

/** Known missing-signal reasons, translated; unknown reasons are shown as the model sent them. */
const SIGNAL_LABELS: Record<string, TranslationKey> = {
  isolation_forest: 'riskAssessment.signalIsolationForest',
  random_forest: 'riskAssessment.signalRandomForest',
};
const REASON_TRANSLATIONS: Record<string, TranslationKey> = {
  'requires item_category, tender_value_sar, and at least 5 structural fields': 'riskAssessment.reasonIfStructural',
  'requires item_category and at least 4 contract-level numeric fields': 'riskAssessment.reasonRfContract',
};

const formatSar = (n: number) => n.toLocaleString('en-US');
const compactSar = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M` : n >= 1000 ? `${Math.round(n / 1000)}K` : `${n}`);

const card = 'bg-white rounded-2xl border border-slate-200 shadow-2xs';

const SectionHeader: React.FC<{ icon: LucideIcon; title: string; subtitle?: string; tone: string }> = ({ icon: Icon, title, subtitle, tone }) => (
  <div className="flex items-start gap-3">
    <span className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${tone}`}>
      <Icon className="w-4 h-4" />
    </span>
    <div>
      <h4 className="text-base font-bold text-slate-900">{title}</h4>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

export const RiskLoadingState: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3" role="status" aria-live="polite">
      <Loader2 className="w-5 h-5 text-[#2C3E28] animate-spin shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        <div className="text-sm font-bold text-slate-900">{t('riskAssessment.loadingTitle')}</div>
        <p className="text-xs text-slate-600">{t('riskAssessment.loadingHint')}</p>
      </div>
    </div>
  );
};

/** Error state — never a silent fallback: states clearly that no assessment was produced. */
export const RiskErrorState: React.FC<{ code: RiskErrorCode; onRetry: () => void }> = ({ code, onRetry }) => {
  const { t } = useLanguage();
  return (
    <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3" role="alert">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="text-sm font-bold text-red-900">{t('riskAssessment.errorTitle')}</div>
          <p className="text-xs text-red-800">{t(errorMessages[code])}</p>
          <p className="text-[11px] text-slate-600">{t('riskAssessment.errorNoFallback')}</p>
        </div>
      </div>
      <button
        id="btn-ai-risk-retry"
        type="button"
        onClick={onRetry}
        className="px-4 py-2 rounded-xl bg-white border border-[#2C3E28] text-[#2C3E28] hover:bg-[#2C3E28]/5 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>{t('riskAssessment.retry')}</span>
      </button>
    </div>
  );
};

// ---- Similar tenders: the model's real distribution (p10 … p90) and where this tender falls ----

const SimilarTenders: React.FC<{ data: RiskSimilarTenders; tone: string }> = ({ data, tone }) => {
  const { lang, t } = useLanguage();
  const { p10, p25, median, p75, p90 } = data.distribution_sar;
  const value = data.record_value_sar;
  const min = Math.min(p10, value) * 0.9;
  const max = Math.max(p90, value) * 1.05;
  const pos = (v: number) => ((v - min) / (max - min)) * 100;
  const categoryLabel = ITEM_CATEGORIES.find((c) => c.value === data.category)?.label[lang] ?? data.category;

  return (
    <section className={`${card} p-5 space-y-4`}>
      <SectionHeader
        icon={BarChart3}
        tone="bg-slate-50 text-slate-600 border-slate-200"
        title={t('riskAssessment.similarTitle')}
        subtitle={t('riskAssessment.similarSubtitle', { category: categoryLabel, count: data.reference_count })}
      />
      {/* Value axis runs low → high from left to right in both languages */}
      <div dir="ltr" className="pt-6 pb-1" role="img" aria-label={t('riskAssessment.similarAria', { value: formatSar(value) })}>
        <div className="relative h-10">
          <span className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-slate-300" style={{ left: `${pos(p10)}%`, width: `${pos(p90) - pos(p10)}%` }} />
          <span className="absolute top-1/2 h-4 -translate-y-1/2 rounded-md bg-slate-200 border border-slate-300" style={{ left: `${pos(p25)}%`, width: `${pos(p75) - pos(p25)}%` }} />
          <span className="absolute top-1/2 h-6 w-0.5 -translate-y-1/2 bg-slate-600" style={{ left: `${pos(median)}%` }} />
          {/* This tender */}
          <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${pos(value)}%` }}>
            <span className={`w-3.5 h-3.5 rounded-full ring-2 ring-white ${tone}`} />
          </span>
          <span
            className="absolute -top-6 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold text-slate-900"
            style={{ left: `${Math.min(Math.max(pos(value), 8), 92)}%` }}
          >
            {compactSar(value)}
          </span>
        </div>
        <div className="relative h-5 text-[11px] text-slate-500">
          {[p10, median, p90].map((v) => (
            <span key={v} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${pos(v)}%` }}>
              {compactSar(v)}
            </span>
          ))}
        </div>
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] text-slate-600">
        <li className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-slate-300" aria-hidden="true" />{t('riskAssessment.similarRange')}</li>
        <li className="flex items-center gap-1.5"><span className="w-4 h-2.5 rounded-sm bg-slate-200 border border-slate-300" aria-hidden="true" />{t('riskAssessment.similarMiddle')}</li>
        <li className="flex items-center gap-1.5"><span className="w-0.5 h-3 bg-slate-600" aria-hidden="true" />{t('riskAssessment.similarMedian')}</li>
        <li className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded-full ${tone}`} aria-hidden="true" />{t('riskAssessment.similarThis')}</li>
      </ul>
      <p className="text-sm text-slate-900">{lang === 'ar' ? data.summary_ar : data.summary_en}</p>
      <table className="sr-only">
        <caption>{t('riskAssessment.similarTitle')}</caption>
        <tbody>
          {(['p10', 'p25', 'median', 'p75', 'p90'] as const).map((k) => (
            <tr key={k}>
              <th scope="row">{k}</th>
              <td>{formatSar(data.distribution_sar[k])}</td>
            </tr>
          ))}
          <tr>
            <th scope="row">{t('riskAssessment.similarThis')}</th>
            <td>{formatSar(value)}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

// ---- Insufficient data: a clear message, not an error ----

const InsufficientData: React.FC<{ result: RiskEvaluationResult }> = ({ result }) => {
  const { lang, t } = useLanguage();
  const reasons = Object.entries(result.missing_signal_reasons ?? {});
  return (
    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2" role="status">
      <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
        <Info className="w-4 h-4" />
        {t('riskAssessment.insufficientTitle')}
      </div>
      <p className="text-xs text-slate-700">{lang === 'ar' ? result.recommended_action_ar : result.recommended_action_en}</p>
      {reasons.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs font-bold text-slate-700">{t('riskAssessment.missingSignals')}</div>
          <ul className="space-y-1 text-xs text-slate-600 list-disc ps-5">
            {reasons.map(([signal, reason]) => (
              <li key={signal}>
                <span className="font-bold">{SIGNAL_LABELS[signal] ? t(SIGNAL_LABELS[signal]) : signal}: </span>
                {REASON_TRANSLATIONS[reason] ? t(REASON_TRANSLATIONS[reason]) : <bdi dir="ltr">{reason}</bdi>}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-[11px] text-slate-500 font-mono">{t('riskAssessment.modelVersion', { version: result.model_version })}</p>
    </div>
  );
};

// ---- Results card ----

export const RiskResultCard: React.FC<{ result: RiskEvaluationResult; belowScore?: (result: RiskEvaluationResult) => React.ReactNode }> = ({
  result,
  belowScore,
}) => {
  const { lang, t } = useLanguage();
  if (result.risk_score === null || result.risk_color === null || result.assessment_status !== 'completed') {
    return <InsufficientData result={result} />;
  }

  const style = colorStyles[result.risk_color] ?? colorStyles.Yellow;
  const factors = result.top_factors ?? [];
  const maxPoints = Math.max(1, ...factors.map((f) => f.points));
  const impact = typeof result.audit_components?.impact_level === 'number' ? result.audit_components.impact_level : null;
  const rules = result.triggered_rules ?? [];
  const ar = lang === 'ar';

  return (
    <div id="ai-risk-result" className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Score */}
        <section className={`${card} p-5 space-y-3`}>
          <div className="text-xs text-slate-500">{t('riskAssessment.riskScore')}</div>
          <div className="flex items-baseline gap-2">
            <span className={`text-5xl font-bold ${style.score}`}>{result.risk_score}</span>
            <span className="text-sm text-slate-500">{t('riskAssessment.outOf100')}</span>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${style.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
            {t(style.label)}
          </span>
          {impact !== null && <div className="text-xs text-slate-600">{t('riskAssessment.impact', { level: impact })}</div>}
          {result.critical_override && (
            <div className="text-xs font-bold text-red-700">{t('riskAssessment.criticalOverride')}</div>
          )}
        </section>

        {/* Why — the model's top factors with their real points */}
        <section className={`${card} p-5 space-y-4 lg:col-span-2`}>
          <SectionHeader
            icon={Sparkles}
            tone={style.badge}
            title={t(style.why)}
            subtitle={factors.length ? t('riskAssessment.topFactorsSubtitle', { count: factors.length }) : undefined}
          />
          {factors.length === 0 ? (
            <p className="text-xs text-slate-500">{t('riskAssessment.noFactors')}</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {factors.map((f) => (
                <li key={f.factor_en} className="py-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900">{ar ? f.factor_ar : f.factor_en}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{ar ? f.compared_to_usual_ar : f.compared_to_usual_en}</div>
                    </div>
                    <span className="text-xs font-bold text-slate-900 shrink-0">{t('riskAssessment.points', { points: f.points })}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden" aria-hidden="true">
                    <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${(f.points / maxPoints) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          {typeof result.other_factors_points === 'number' && (
            <p className="text-[11px] text-slate-500">
              {t('riskAssessment.otherPoints', { points: result.other_factors_points, score: result.risk_score })}
              {factors[0] && <> · {ar ? factors[0].points_note_ar : factors[0].points_note_en}</>}
            </p>
          )}
        </section>
      </div>

      {belowScore?.(result)}

      {result.similar_tender_comparison && <SimilarTenders data={result.similar_tender_comparison} tone={style.dot} />}

      {/* Recommended action */}
      <section className={`rounded-2xl border p-4 space-y-1 ${style.banner}`}>
        <div className="text-sm font-bold text-slate-900">{t('riskAssessment.recommendedAction')}</div>
        <p className="text-sm text-slate-700">{ar ? result.recommended_action_ar : result.recommended_action_en}</p>
        {(result.explanation_ar || result.explanation_en) && (
          <p className="text-xs text-slate-500 pt-1">{ar ? result.explanation_ar : result.explanation_en}</p>
        )}
      </section>

      {/* Triggered governance rules (evaluated inside the model) */}
      {rules.length > 0 && (
        <section className={`${card} p-5 space-y-3`}>
          <h4 className="text-sm font-bold text-slate-900">{t('riskAssessment.triggeredRules')}</h4>
          <ul className="divide-y divide-slate-100">
            {rules.map((rule) => {
              const severity = rule.severity === 'red' ? colorStyles.Red : rule.severity === 'yellow' ? colorStyles.Yellow : colorStyles.Green;
              return (
                <li key={rule.rule_id} className="py-2.5 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-900">{ar ? rule.title_ar : rule.title_en}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{ar ? rule.observed_ar : rule.observed_en}</div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold shrink-0 ${severity.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${severity.dot}`} aria-hidden="true" />
                    {t(rule.severity === 'red' ? 'riskAssessment.severityRed' : rule.severity === 'yellow' ? 'riskAssessment.severityYellow' : 'riskAssessment.severityGreen')}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Disclaimer + model version */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-[11px] text-slate-500">
        {(result.disclaimer_ar || result.disclaimer_en) && (
          <p className="leading-relaxed">
            <span className="font-bold text-slate-600">{t('riskAssessment.disclaimer')}: </span>
            {ar ? result.disclaimer_ar : result.disclaimer_en}
          </p>
        )}
        <span className="font-mono shrink-0" dir="ltr">
          {t('riskAssessment.modelVersion', { version: result.model_version })}
        </span>
      </div>
    </div>
  );
};
