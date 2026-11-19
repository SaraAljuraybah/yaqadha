import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Lock,
  NotebookPen,
  Stamp,
  Unlock,
  X,
  LucideIcon,
} from 'lucide-react';
import { DocumentDossier, SignatureStep } from '../types';
import { TranslationKey, useLanguage } from '../i18n';
import {
  CASE_FILE,
  CASE_VIOLATIONS,
  CURRENT_USER,
  CaseTimelineEvent,
  DEPARTMENTS,
  getCaseTimeline,
  getInitialReviewerNotes,
  getRegisterDocuments,
  legalRef,
} from '../data/demo';
import { RiskAssessmentPanel } from './RiskAssessmentPanel';

// Case page for a precautionary suspension (مؤشرات المستندات)

export type CaseDecision = 'pending' | 'lifted' | 'escalated';

/** A note added during this session. System notes are rendered from the dictionary so they follow the language. */
export interface SessionNote {
  id: string;
  kind: 'user' | 'lifted' | 'escalated' | 'statement';
  text?: string;
  reason?: string;
  /** Time label captured when the note was saved */
  time: string;
}

interface CaseScreenProps {
  document: DocumentDossier;
  decision: CaseDecision;
  sessionNotes: SessionNote[];
  onAddNote: (text: string) => void;
  onRequestStatement: () => void;
  onLiftSuspension: () => void;
  onApproveEscalation: () => void;
}

const card = 'bg-white rounded-2xl border border-slate-200 shadow-2xs';

const IconTile: React.FC<{ icon: LucideIcon; tone: string; size?: string }> = ({ icon: Icon, tone, size = 'w-9 h-9' }) => (
  <span className={`${size} rounded-xl border flex items-center justify-center shrink-0 ${tone}`}>
    <Icon className="w-4 h-4" />
  </span>
);

const SectionHeader: React.FC<{ icon: LucideIcon; tone: string; title: string; subtitle?: string }> = ({ icon, tone, title, subtitle }) => (
  <div className="flex items-start gap-3">
    <IconTile icon={icon} tone={tone} />
    <div>
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const RED_TILE = 'bg-red-50 text-red-700 border-red-200';
const AMBER_TILE = 'bg-amber-50 text-amber-700 border-amber-200';
const GREEN_TILE = 'bg-emerald-50 text-emerald-700 border-emerald-200';
const NEUTRAL_TILE = 'bg-slate-50 text-slate-600 border-slate-200';
const SKY_TILE = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-[#0F1C24] dark:text-sky-300 dark:border-[#1E3442]';

// ---- approval chain ----------------------------------------------------------

const stageVisual = (step: SignatureStep): { icon: LucideIcon; ring: string; label: TranslationKey; text: string } => {
  if (step.status === 'signed') return { icon: Check, ring: 'border-emerald-500 text-emerald-600 bg-emerald-50', label: 'casePage.stageCompleted', text: 'text-emerald-700' };
  if (step.status === 'bypassed' || step.status === 'skipped')
    return { icon: X, ring: 'border-red-500 text-red-600 bg-red-50', label: 'casePage.stageBypassed', text: 'text-red-700' };
  return { icon: Clock, ring: 'border-amber-500 text-amber-600 bg-amber-50', label: 'casePage.stagePublishRequested', text: 'text-amber-700' };
};

/** Connector after a stage takes that stage's outcome: green when signed, red when bypassed. */
const connectorTone = (step: SignatureStep) =>
  step.status === 'signed' ? 'bg-emerald-500' : step.status === 'bypassed' || step.status === 'skipped' ? 'bg-red-500' : 'bg-slate-200';

const ApprovalChain: React.FC<{ steps: SignatureStep[] }> = ({ steps }) => {
  const { t } = useLanguage();
  return (
    <ol className="flex items-start">
      {steps.map((step, i) => {
        const v = stageVisual(step);
        const Icon = v.icon;
        return (
          <li key={step.step} className="flex-1 flex flex-col items-center text-center relative">
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={`absolute top-6 start-[calc(50%+2rem)] end-[calc(-50%+2rem)] h-0.5 rounded-full ${connectorTone(step)}`}
              />
            )}
            <span className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${v.ring}`}>
              <Icon className="w-5 h-5" />
            </span>
            <span className="mt-3 text-sm font-bold text-slate-900">{step.roleTitle}</span>
            <span className="mt-1 text-xs text-slate-500">{step.officerName}</span>
            <span className={`mt-1 text-[11px] font-bold ${v.text}`}>{t(v.label)}</span>
          </li>
        );
      })}
    </ol>
  );
};

// ---- timeline ---------------------------------------------------------------

const timelineVisual: Record<CaseTimelineEvent['kind'], { icon: LucideIcon; tone: string }> = {
  created: { icon: FileText, tone: NEUTRAL_TILE },
  after_hours: { icon: Eye, tone: AMBER_TILE },
  signed: { icon: Check, tone: GREEN_TILE },
  publish_attempt: { icon: AlertTriangle, tone: RED_TILE },
  suspended: { icon: Lock, tone: RED_TILE },
};

// ---- screen -----------------------------------------------------------------

export const CaseScreen: React.FC<CaseScreenProps> = ({
  document,
  decision,
  sessionNotes,
  onAddNote,
  onRequestStatement,
  onLiftSuspension,
  onApproveEscalation,
}) => {
  const { lang, t } = useLanguage();
  const [draft, setDraft] = useState('');
  const timeline = useMemo(() => getCaseTimeline(lang), [lang]);
  const initialNotes = useMemo(() => getInitialReviewerNotes(lang), [lang]);
  const registerEntry = useMemo(() => getRegisterDocuments(lang).find((d) => d.code === CASE_FILE.code), [lang]);
  const title = registerEntry?.shortTitle ?? document.title;
  const department = registerEntry ? DEPARTMENTS[registerEntry.department][lang] : document.department;

  const notes = [
    ...initialNotes.map((n) => ({ id: n.id, author: n.author, time: n.time, text: n.text })),
    ...sessionNotes.map((n) => ({
      id: n.id,
      author: CURRENT_USER.name[lang],
      time: n.time,
      text:
        n.kind === 'user'
          ? n.text ?? ''
          : n.kind === 'lifted'
          ? t('casePage.liftedNote', { reason: n.reason ?? '' })
          : n.kind === 'escalated'
          ? t('casePage.escalatedNote')
          : t('casePage.statementNote'),
    })),
  ];

  const statusBadge =
    decision === 'lifted'
      ? { label: t('casePage.badgeLifted'), cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' }
      : decision === 'escalated'
      ? { label: t('casePage.badgeEscalated'), cls: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' }
      : { label: t('common.blocked'), cls: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' };

  // Export: the browser's print dialog ("Save as PDF"), always printed in light colors
  const handleExport = () => {
    const root = window.document.documentElement;
    const wasDark = root.classList.contains('dark');
    if (wasDark) {
      root.classList.remove('dark');
      window.addEventListener('afterprint', () => root.classList.add('dark'), { once: true });
    }
    window.print();
  };

  const saveNote = () => {
    const text = draft.trim();
    if (!text) return;
    onAddNote(text);
    setDraft('');
  };

  return (
    <div id="case-screen" className="space-y-6 text-start">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">
            <bdi className="font-mono">#{CASE_FILE.code}</bdi> · {department}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${statusBadge.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} aria-hidden="true" />
            {statusBadge.label}
          </span>
          <button
            type="button"
            id="btn-export-case-pdf"
            onClick={handleExport}
            className="print:hidden inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            {t('casePage.exportPdf')}
          </button>
        </div>
      </div>

      {/* Human decision */}
      {decision === 'pending' ? (
        <section className="rounded-2xl border border-red-200 bg-red-50/60 p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <IconTile icon={Lock} tone={RED_TILE} />
            <div>
              <h2 className="text-sm font-bold text-slate-900">{t('casePage.decisionTitle')}</h2>
              <p className="text-xs text-slate-600 mt-0.5">{t('casePage.decisionBody')}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              type="button"
              id="btn-case-request-statement"
              onClick={onRequestStatement}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <NotebookPen className="w-4 h-4" />
              {t('casePage.requestStatement')}
            </button>
            <button
              type="button"
              id="btn-case-lift-suspension"
              onClick={onLiftSuspension}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <Unlock className="w-4 h-4" />
              {t('casePage.liftSuspension')}
            </button>
            <button
              type="button"
              id="btn-case-approve-escalation"
              onClick={onApproveEscalation}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-red-300 bg-red-50 text-sm font-bold text-red-700 hover:bg-red-100 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              {t('casePage.approveEscalation')}
            </button>
          </div>
        </section>
      ) : (
        <section
          className={`rounded-2xl border p-4 flex items-start gap-3 ${
            decision === 'lifted' ? 'border-emerald-200 bg-emerald-50/60' : 'border-red-200 bg-red-50/60'
          }`}
          role="status"
        >
          <IconTile icon={decision === 'lifted' ? CheckCircle2 : AlertTriangle} tone={decision === 'lifted' ? GREEN_TILE : RED_TILE} />
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {t(decision === 'lifted' ? 'casePage.decisionLiftedTitle' : 'casePage.decisionEscalatedTitle')}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {t(decision === 'lifted' ? 'casePage.decisionLiftedBody' : 'casePage.decisionEscalatedBody')}
            </p>
          </div>
        </section>
      )}

      {/* Approval chain */}
      <section className={`${card} p-5 space-y-6`}>
        <SectionHeader icon={Stamp} tone={RED_TILE} title={t('casePage.chainTitle')} subtitle={t('casePage.chainSubtitle')} />
        <ApprovalChain steps={document.signatureSteps} />
        <p className="rounded-xl border border-red-200 bg-red-50/70 px-4 py-3 text-xs text-red-700">{t('casePage.chainNote')}</p>
      </section>

      {/* Timeline + violations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className={`${card} p-5 space-y-5`}>
          <SectionHeader icon={Clock} tone={SKY_TILE} title={t('casePage.timelineTitle')} subtitle={CASE_FILE.dateLabel[lang]} />
          <ol className="relative">
            {timeline.map((event, i) => {
              const v = timelineVisual[event.kind];
              return (
                <li key={event.id} className="relative flex items-start gap-3 pb-5 last:pb-0">
                  {i < timeline.length - 1 && (
                    <span aria-hidden="true" className="absolute start-[17px] top-9 bottom-0 w-px bg-slate-200" />
                  )}
                  <IconTile icon={v.icon} tone={`${v.tone} rounded-full`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900">{event.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{event.detail}</div>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0 mt-0.5">{event.time}</span>
                </li>
              );
            })}
          </ol>
        </section>

        <section className={`${card} p-5 space-y-4`}>
          <SectionHeader
            icon={AlertTriangle}
            tone={RED_TILE}
            title={t('casePage.violationsTitle')}
            subtitle={t('casePage.violationsSubtitle')}
          />
          <ol className="space-y-3">
            {CASE_VIOLATIONS.map((violation, i) => (
              <li key={violation.reference} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" aria-hidden="true" />
                  {t('casePage.violationNumber', { number: i + 1 })}
                </div>
                <div className="text-sm font-medium text-slate-900">{violation.text[lang]}</div>
                <div className="text-xs text-slate-500">{t('casePage.legalBasis', { reference: legalRef(violation.reference, lang) })}</div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Reviewer notes (append-only) */}
      <section className={`${card} p-5 space-y-4`}>
        <SectionHeader icon={NotebookPen} tone={SKY_TILE} title={t('casePage.notesTitle')} subtitle={t('casePage.notesSubtitle')} />
        <ul className="space-y-2.5">
          {notes.map((note) => (
            <li key={note.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-[11px] text-slate-500">{t('casePage.noteMeta', { author: note.author, time: note.time })}</div>
              <p className="text-sm text-slate-900 mt-1 whitespace-pre-line">{note.text}</p>
            </li>
          ))}
        </ul>
        <div className="space-y-2 print:hidden">
          <label htmlFor="case-new-note" className="block text-xs font-bold text-slate-600">
            {t('casePage.newNote')}
          </label>
          <textarea
            id="case-new-note"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder={t('casePage.notePlaceholder')}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2C3E28] resize-y"
          />
          <div className="flex justify-end">
            <button
              type="button"
              id="btn-case-save-note"
              onClick={saveNote}
              disabled={!draft.trim()}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#2C3E28] hover:bg-[#233220] text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              {t('casePage.saveNote')}
            </button>
          </div>
        </div>
      </section>

      {/* AI risk assessment (kept at the bottom of the case page) */}
      <div className="print:hidden">
        <RiskAssessmentPanel document={document} />
      </div>
    </div>
  );
};
