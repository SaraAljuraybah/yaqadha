import React from 'react';
import { AlertTriangle, Info, Loader2, RotateCcw } from 'lucide-react';
import { RiskEvaluationResult } from '../types';
import { TranslationKey, useLanguage } from '../i18n';
import { RiskErrorCode } from '../services/riskApi';

// Shared risk-model states and results card (used by the indicators panel and the Tender Risk Assessment page)

// Same emerald/amber/red status styles used by the platform's status badges
const colorStyles: Record<RiskEvaluationResult['risk_color'], { badge: string; dot: string; score: string; label: TranslationKey }> = {
  Green: { badge: 'bg-emerald-50 text-emerald-900 border-emerald-200', dot: 'bg-emerald-600', score: 'text-emerald-700', label: 'riskAssessment.colorGreen' },
  Yellow: { badge: 'bg-amber-50 text-amber-900 border-amber-200', dot: 'bg-amber-500', score: 'text-amber-800', label: 'riskAssessment.colorYellow' },
  Red: { badge: 'bg-red-50 text-red-900 border-red-200', dot: 'bg-red-600', score: 'text-red-700', label: 'riskAssessment.colorRed' },
};

const errorMessages: Record<RiskErrorCode, TranslationKey> = {
  unavailable: 'riskAssessment.errorUnavailable',
  not_configured: 'riskAssessment.errorNotConfigured',
  configuration_error: 'riskAssessment.errorConfiguration',
  invalid_input: 'riskAssessment.errorInvalidInput',
  upstream_error: 'riskAssessment.errorUpstream',
};

export const RiskLoadingState: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3" role="status" aria-live="polite">
      <Loader2 className="w-5 h-5 text-[#2C3E28] animate-spin shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        <div className="text-xs sm:text-sm font-bold text-slate-900">{t('riskAssessment.loadingTitle')}</div>
        <p className="text-xs text-slate-600 font-normal">{t('riskAssessment.loadingHint')}</p>
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
          <div className="text-xs sm:text-sm font-bold text-red-900">{t('riskAssessment.errorTitle')}</div>
          <p className="text-xs text-red-800 font-normal">{t(errorMessages[code])}</p>
          <p className="text-[11px] text-slate-600 font-normal">{t('riskAssessment.errorNoFallback')}</p>
        </div>
      </div>
      <button
        id="btn-ai-risk-retry"
        type="button"
        onClick={onRetry}
        className="px-4 py-2 rounded-xl bg-white border border-[#2C3E28] text-[#2C3E28] hover:bg-[#2C3E28]/5 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>{t('riskAssessment.retry')}</span>
      </button>
    </div>
  );
};

export const RiskResultCard: React.FC<{ result: RiskEvaluationResult }> = ({ result }) => {
  const { t } = useLanguage();
  const style = colorStyles[result.risk_color] ?? colorStyles.Yellow;
  return (
    <div id="ai-risk-result" className="space-y-4 animate-in fade-in duration-200">
      {/* Score + key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-[11px] font-bold text-slate-600 block">{t('riskAssessment.riskScore')}</span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-bold font-mono ${style.score}`}>{result.risk_score}</span>
            <span className="text-xs text-slate-500 font-normal">{t('riskAssessment.outOf100')}</span>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${style.badge}`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`}></span>
            <span>{t(style.label)}</span>
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
          <span className="text-[11px] font-bold text-slate-600 block">{t('riskAssessment.anomalyPercentile')}</span>
          <span className="text-xl font-bold font-mono text-slate-900 block" dir="ltr">{result.anomaly_percentile}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
          <span className="text-[11px] font-bold text-slate-600 block">{t('riskAssessment.likelihoodScore')}</span>
          <span className="text-xl font-bold font-mono text-slate-900 block" dir="ltr">{result.likelihood_score} / 100</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
          <span className="text-[11px] font-bold text-slate-600 block">{t('riskAssessment.impactLevel')}</span>
          <span className="text-xl font-bold font-mono text-slate-900 block" dir="ltr">{result.impact_level} / 5</span>
        </div>
      </div>

      {/* SAR calibration note */}
      {result.currency_normalization.startsWith('unsupported_currency') && (
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
          <span>{t('riskAssessment.currencyNote')}</span>
        </div>
      )}

      {/* Triggered rules (text as returned by the API) */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 block">{t('riskAssessment.triggeredRules')}</span>
        {result.triggered_rules.length === 0 ? (
          <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">{t('riskAssessment.noRules')}</p>
        ) : (
          <div className="border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-right ltr:text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/80 text-slate-700 font-bold text-xs">
                  <th className="py-3 px-4">{t('riskAssessment.colRule')}</th>
                  <th className="py-3 px-4">{t('riskAssessment.colViolation')}</th>
                  <th className="py-3 px-4">{t('riskAssessment.colSeverity')}</th>
                  <th className="py-3 px-4">{t('riskAssessment.colLegalBasis')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.triggered_rules.map((rule) => (
                  <tr key={rule.rule_id}>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">{rule.rule_id}</td>
                    <td className="py-3 px-4 text-slate-700"><bdi>{rule.violation_type}</bdi></td>
                    <td className="py-3 px-4">
                      <span className="inline-flex text-[11px] font-medium px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-900 whitespace-nowrap">
                        <bdi>{rule.severity}</bdi>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700"><bdi>{rule.legal_basis}</bdi></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recommended action */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
        <div className="text-xs font-bold text-slate-900">{t('riskAssessment.recommendedAction')}</div>
        <p className="text-xs text-slate-600 leading-relaxed font-normal"><bdi>{result.recommended_action}</bdi></p>
      </div>

      {/* Disclaimer + model version */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-[11px] text-slate-500">
        <p className="leading-relaxed">
          <span className="font-bold text-slate-600">{t('riskAssessment.disclaimer')}: </span>
          <bdi>{result.disclaimer}</bdi>
        </p>
        <span className="font-mono shrink-0">
          {t('riskAssessment.modelVersion', { version: result.model_version })}
        </span>
      </div>
    </div>
  );
};
