import React, { useEffect, useState } from 'react';
import { BrainCircuit, Loader2, Sparkles } from 'lucide-react';
import { DocumentDossier, RiskEvaluationResult } from '../types';
import { useLanguage } from '../i18n';
import { getCachedEvaluation, RiskApiError, RiskErrorCode, startEvaluation } from '../services/riskApi';
import { RiskErrorState, RiskLoadingState, RiskResultCard } from './RiskResultCard';

interface RiskAssessmentPanelProps {
  document: DocumentDossier;
}

type PanelState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; result: RiskEvaluationResult }
  | { kind: 'error'; code: RiskErrorCode };

export const RiskAssessmentPanel: React.FC<RiskAssessmentPanelProps> = ({ document }) => {
  const { t } = useLanguage();
  const input = document.riskInput;
  const [state, setState] = useState<PanelState>({ kind: 'idle' });

  const track = (request: Promise<RiskEvaluationResult>) => {
    let active = true;
    setState({ kind: 'loading' });
    request
      .then((result) => active && setState({ kind: 'success', result }))
      .catch((err) => active && setState({ kind: 'error', code: err instanceof RiskApiError ? err.code : 'upstream_error' }));
    return () => {
      active = false;
    };
  };

  // Pick up an evaluation that is still running (or finished) from before a tab switch
  useEffect(() => {
    const pending = input ? getCachedEvaluation(input.record_id) : undefined;
    setState({ kind: 'idle' });
    return pending ? track(pending) : undefined;
  }, [input?.record_id]);

  if (!input) return null;

  const runAssessment = () => {
    track(startEvaluation(input));
  };

  const result = state.kind === 'success' ? state.result : null;

  return (
    <section id="ai-risk-assessment" className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
      {/* Header + action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 text-[#2C3E28] flex items-center justify-center shrink-0">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-slate-900">{t('riskAssessment.title')}</h3>
            <p className="text-xs text-slate-600 font-normal">{t('riskAssessment.subtitle')}</p>
          </div>
        </div>

        <button
          id="btn-ai-risk-assessment"
          type="button"
          disabled={state.kind === 'loading'}
          onClick={runAssessment}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all shrink-0 ${
            state.kind === 'loading'
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-[#2C3E28] hover:bg-[#233220] active:scale-95 text-white shadow-[#2C3E28]/20 cursor-pointer'
          }`}
        >
          {state.kind === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{state.kind === 'success' ? t('riskAssessment.rerun') : t('riskAssessment.run')}</span>
        </button>
      </div>

      {/* Loading */}
      {state.kind === 'loading' && (
        <RiskLoadingState />
      )}

      {/* Error — no silent fallback */}
      {state.kind === 'error' && (
        <RiskErrorState code={state.code} onRetry={runAssessment} />
      )}

      {/* Results */}
      {result && <RiskResultCard result={result} />}
    </section>
  );
};
