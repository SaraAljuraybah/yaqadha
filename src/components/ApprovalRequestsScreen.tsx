import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, Check, CheckCircle2, Clock, Eye, Lock, X, XCircle, LucideIcon } from 'lucide-react';
import { TranslationKey, useLanguage } from '../i18n';
import {
  DEPARTMENTS,
  CURRENT_USER,
  DELEGABLE_PERMISSIONS,
  EXCEPTION_REQUEST,
  INITIAL_DELEGATIONS,
  PEOPLE,
  ReadinessCheck,
  URGENT_APPROVAL,
  getDocuments,
  getReadinessChecks,
  formatDateRange,
  getRegisterDocuments,
} from '../data/demo';
import { useDemoDecisions } from '../state/DemoDecisions';

// طلبات الاعتماد — the urgent approval of YQ-8841 and the justified exception of PO-3310

interface ApprovalRequestsScreenProps {
  /** Scrolls to the matching request when opened from another page */
  focusCode?: string;
}

const card = 'bg-white rounded-2xl border border-slate-200 shadow-2xs';
const AMBER_TILE = 'bg-amber-50 text-amber-700 border-amber-200';
const SKY_TILE = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-[#0F1C24] dark:text-sky-300 dark:border-[#1E3442]';

const IconTile: React.FC<{ icon: LucideIcon; tone: string }> = ({ icon: Icon, tone }) => (
  <span className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${tone}`}>
    <Icon className="w-4 h-4" />
  </span>
);

const SectionHeader: React.FC<{ icon: LucideIcon; tone: string; title: string; subtitle?: React.ReactNode }> = ({ icon, tone, title, subtitle }) => (
  <div className="flex items-start gap-3">
    <IconTile icon={icon} tone={tone} />
    <div>
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

// ---- approval stages ----------------------------------------------------------

type ChainState = 'done' | 'current' | 'returned' | 'returnedFinance' | 'pending';

const chainVisual: Record<ChainState, { icon: LucideIcon; ring: string; text: string; label: TranslationKey }> = {
  done: { icon: Check, ring: 'border-emerald-500 text-emerald-600 bg-emerald-50', text: 'text-emerald-700', label: 'approvals.stageDone' },
  current: { icon: Clock, ring: 'border-amber-500 text-amber-600 bg-amber-50', text: 'text-amber-700', label: 'approvals.stageCurrent' },
  returned: { icon: Clock, ring: 'border-amber-500 text-amber-600 bg-amber-50', text: 'text-amber-700', label: 'approvals.stageReturned' },
  returnedFinance: { icon: Clock, ring: 'border-amber-500 text-amber-600 bg-amber-50', text: 'text-amber-700', label: 'approvals.stageReturnedFinance' },
  pending: { icon: Lock, ring: 'border-slate-300 text-slate-400 bg-slate-50', text: 'text-slate-500', label: 'approvals.stagePending' },
};

const connectorTone: Record<ChainState, string> = {
  done: 'bg-emerald-500',
  current: 'bg-amber-500',
  returned: 'bg-amber-500',
  returnedFinance: 'bg-amber-500',
  pending: 'bg-slate-200',
};

// ---- readiness ------------------------------------------------------------------

type CheckState = ReadinessCheck['state'] | 'rejected';

const checkVisual: Record<CheckState, { icon: LucideIcon; tone: string }> = {
  done: { icon: Check, tone: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  waiting: { icon: Clock, tone: 'bg-amber-50 text-amber-600 border-amber-200' },
  locked: { icon: Lock, tone: 'bg-slate-50 text-slate-400 border-slate-200' },
  rejected: { icon: X, tone: 'bg-red-50 text-red-600 border-red-200' },
  failed: { icon: X, tone: 'bg-red-50 text-red-600 border-red-200' },
};

const ReadinessRing: React.FC<{ done: number; total: number; label: string }> = ({ done, total, label }) => {
  const r = 42;
  const c = 2 * Math.PI * r;
  const complete = done === total;
  return (
    <div className="relative w-24 h-24 shrink-0" role="img" aria-label={label}>
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="9" className="stroke-slate-100" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - done / total)}
          className={complete ? 'stroke-emerald-500' : 'stroke-amber-500'}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-900" dir="ltr" aria-hidden="true">
        {done}/{total}
      </span>
    </div>
  );
};

// ---- watermarked preview ------------------------------------------------------------

const WatermarkedPreview: React.FC<{ title: string; meta: string; watermark: string }> = ({ title, meta, watermark }) => (
  // A paper sheet stays light in both themes (explicit colors, not theme tokens)
  <div className="relative overflow-hidden rounded-xl border border-[#DAD6CA] bg-[#F6F4EE] p-6 min-h-72 select-none" aria-describedby="approvals-watermark-note">
    <div className="relative z-0 space-y-2 text-start">
      <div className="text-base font-bold text-[#1F2420]">{title}</div>
      <div className="text-[11px] text-[#5B625D]">{meta}</div>
      <div className="pt-4 space-y-2.5" aria-hidden="true">
        {[100, 92, 96, 70, 88, 94, 64, 90, 80].map((w, i) => (
          <div key={i} className="h-1.5 rounded-full bg-[#DAD6CA]" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
    {/* Diagonal, repeated watermark with the viewer's name, time and address */}
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-around -rotate-[18deg] scale-125" aria-hidden="true">
      {[0, 1, 2, 3].map((row) => (
        <div key={row} className="whitespace-nowrap text-[11px] font-semibold text-[#8E968F]/70 tracking-wide">
          {watermark} &nbsp;·&nbsp; {watermark}
        </div>
      ))}
    </div>
  </div>
);

// ---- decision card shell ---------------------------------------------------------------

const outcomeTone = {
  green: { box: 'border-emerald-200 bg-emerald-50/60', text: 'text-emerald-700', icon: CheckCircle2 },
  amber: { box: 'border-amber-200 bg-amber-50/60', text: 'text-amber-800', icon: CheckCircle2 },
  red: { box: 'border-red-200 bg-red-50/60', text: 'text-red-700', icon: XCircle },
};

const DecisionOutcome: React.FC<{ tone: keyof typeof outcomeTone; title: string; comment?: string; commentLabel: string }> = ({ tone, title, comment, commentLabel }) => {
  const v = outcomeTone[tone];
  const Icon = v.icon;
  return (
  <div className={`rounded-xl border p-4 space-y-1.5 ${v.box}`} role="status">
    <div className={`flex items-start gap-2 text-sm font-bold ${v.text}`}>
      <Icon className="w-4 h-4 shrink-0 mt-0.5" />
      {title}
    </div>
    {comment && (
      <p className="text-xs text-slate-600">
        <span className="font-bold">{commentLabel}: </span>
        {comment}
      </p>
    )}
  </div>
  );
};

// ---- screen ------------------------------------------------------------------------------

export const ApprovalRequestsScreen: React.FC<ApprovalRequestsScreenProps> = ({ focusCode }) => {
  const { lang, t } = useLanguage();
  const { decisions, requestComments, decideRequest, delegations } = useDemoDecisions();
  const [urgentComment, setUrgentComment] = useState('');
  const [exceptionComment, setExceptionComment] = useState('');

  const dossier = useMemo(() => getDocuments(lang).find((d) => d.id === URGENT_APPROVAL.dossierId), [lang]);
  const register = useMemo(() => getRegisterDocuments(lang).find((d) => d.code === URGENT_APPROVAL.code), [lang]);
  const baseChecks = useMemo(() => getReadinessChecks(lang), [lang]);

  // Bring the requested card into view (e.g. "Preview" on PO-3310 in the registry)
  useEffect(() => {
    if (focusCode === EXCEPTION_REQUEST.code) {
      window.document.getElementById('exception-request-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [focusCode]);

  if (!dossier || !register) return null;

  const urgent = decisions.urgent;
  const exception = decisions.exception;

  // Stage states: a rejection returns the request to the preparer. An approval returns it to the financial stage
  // for a new signature from the original authority holder, because the delegated signature exceeded the limit.
  const chainStates: ChainState[] =
    urgent === 'rejected'
      ? ['returned', 'pending', 'pending', 'pending']
      : urgent === 'approved'
      ? ['done', 'done', 'returnedFinance', 'pending']
      : ['done', 'done', 'current', 'pending'];

  // Delegation overrun: contract value vs the delegated limit (both from the central data)
  const delegation = delegations.find((d) => d.id === URGENT_APPROVAL.delegationId) ?? INITIAL_DELEGATIONS[0];
  const delegatedLimit = DELEGABLE_PERMISSIONS.find((p) => p.id === delegation.permissionId)?.limitSar ?? 0;
  const formatSar = (n: number) => n.toLocaleString('en-US');
  const limitDetail = t('approvals.delegationLimitDetail', {
    value: formatSar(URGENT_APPROVAL.contractValueSar),
    limit: formatSar(delegatedLimit),
  });
  const limitEvidence = t('approvals.delegationLimitEvidence', {
    from: PEOPLE.tariq.name[lang],
    to: PEOPLE.salman.name[lang],
    period: formatDateRange(delegation.startIso, delegation.endIso, lang),
  });

  // Readiness checks after the decision.
  // A human decision is recorded alongside the evidence and never erases it: the failed reading-time check keeps
  // its state and colour, gets an "accepted as exception" label, and is not counted toward readiness.
  const checks: (Omit<ReadinessCheck, 'state'> & { state: CheckState; acceptedException?: boolean; evidence?: string })[] = baseChecks.map((check) => {
    if (check.id === 'delegation_limit')
      return { ...check, detail: urgent === 'approved' ? `${limitDetail} · ${t('approvals.stageReturnedFinance')}` : limitDetail, evidence: limitEvidence };
    if (urgent === 'approved' && check.id === 'reading_time') return { ...check, acceptedException: true };
    if (urgent === 'approved' && check.id === 'manager') return { ...check, state: 'done', detail: t('approvals.managerApproved') };
    if (urgent === 'rejected' && check.id === 'manager') return { ...check, state: 'rejected', detail: t('approvals.managerRejected') };
    return check;
  });
  const doneCount = checks.filter((c) => c.state === 'done').length;
  const acceptedExceptions = checks.filter((c) => c.acceptedException).length;
  // Checks still open before the final signature (the final signature and accepted exceptions are not counted)
  const remaining = checks.filter((c) => c.id !== 'final_signature' && c.state !== 'done' && !c.acceptedException).length;

  const statusBadge =
    urgent === 'rejected'
      ? { label: t('approvals.returnedBadge'), cls: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' }
      : urgent === 'approved'
      ? { label: t('approvals.returnedFinanceBadge'), cls: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' }
      : { label: t('common.underReview'), cls: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' };

  const readinessHeadline =
    urgent === 'rejected'
      ? t('approvals.readinessReturned')
      : remaining === 0
      ? t('approvals.readinessAwaitingFinal')
      : t('approvals.readinessNotReady');
  const readinessDetail =
    urgent === 'rejected'
      ? t('approvals.readinessReturnedDetail')
      : remaining === 0
      ? t('approvals.remainingNone')
      : remaining === 1
      ? t('approvals.remainingOne')
      : remaining === 2
      ? t('approvals.remainingTwo')
      : t('approvals.remainingMany', { count: remaining });

  const watermark = t('approvals.watermark', {
    viewer: URGENT_APPROVAL.watermark.viewer[lang],
    at: URGENT_APPROVAL.watermark.at,
    ip: URGENT_APPROVAL.watermark.ip,
  });

  const textareaCls =
    'w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2C3E28] resize-y';
  const approveCls =
    'inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const rejectCls =
    'inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div id="approval-requests-screen" className="space-y-6 text-start">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('approvals.title', { title: register.title })}</h1>
          <p className="text-sm text-slate-500 mt-1">
            <bdi className="font-mono">{URGENT_APPROVAL.code}</bdi> · {DEPARTMENTS[register.department][lang]} · {t('approvals.yellowState')}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${statusBadge.cls}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} aria-hidden="true" />
          {statusBadge.label}
        </span>
      </div>

      {/* Approval stages */}
      <ol className="flex items-start" aria-label={t('approvals.stagesAria')}>
        {dossier.signatureSteps.map((step, i) => {
          const state = chainStates[i];
          const v = chainVisual[state];
          const Icon = v.icon;
          return (
            <li key={step.step} className="flex-1 flex flex-col items-center text-center relative">
              {i < dossier.signatureSteps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`absolute top-6 start-[calc(50%+2rem)] end-[calc(-50%+2rem)] h-0.5 rounded-full ${connectorTone[state]}`}
                />
              )}
              <span className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${v.ring}`}>
                <Icon className="w-5 h-5" />
              </span>
              <span className="mt-3 text-sm font-bold text-slate-900">{step.roleTitle}</span>
              <span className="mt-1 text-xs text-slate-500 max-w-[14rem]">
                {/* A new financial signature must come from the original authority holder, not the delegate */}
                {state === 'returnedFinance' ? PEOPLE.tariq.name[lang] : step.officerName}
              </span>
              <span className={`mt-1 text-[11px] font-bold ${v.text}`}>{t(v.label)}</span>
            </li>
          );
        })}
      </ol>

      {/* Readiness + preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className={`${card} p-5 space-y-4`}>
          <div className="flex items-center gap-4">
            <ReadinessRing done={doneCount} total={checks.length} label={t('approvals.readinessAria', { done: doneCount, total: checks.length })} />
            <div>
              <div className="text-xs text-slate-500">{t('approvals.readinessTitle')}</div>
              <div className={`text-lg font-bold ${urgent === 'rejected' ? 'text-red-700' : remaining === 0 && acceptedExceptions === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                {readinessHeadline}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{readinessDetail}</div>
              {acceptedExceptions > 0 && (
                <div className="text-xs font-bold text-amber-700 mt-1">{t('approvals.exceptionsAccepted', { count: acceptedExceptions })}</div>
              )}
            </div>
          </div>

          <ul className="divide-y divide-slate-100 border-t border-slate-100">
            {checks.map((check) => {
              const v = checkVisual[check.state];
              const Icon = v.icon;
              return (
                <li key={check.id} className="flex items-start gap-3 py-3">
                  <span className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 ${v.tone}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900">{check.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{check.detail}</div>
                    {check.evidence && <div className="text-[11px] text-slate-400 mt-0.5">{check.evidence}</div>}
                    {check.acceptedException && (
                      <div className="mt-1.5 space-y-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-amber-300 bg-amber-50 text-[11px] font-bold text-amber-800">
                          {t('approvals.acceptedAsException', { name: CURRENT_USER.name[lang] })}
                        </span>
                        {requestComments.urgent && (
                          <p className="text-xs text-slate-600">
                            <span className="font-bold">{t('approvals.yourComment')}: </span>
                            {requestComments.urgent}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Final approval belongs to the final approver, not to the reviewer */}
          <button
            type="button"
            disabled
            className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-400 cursor-not-allowed"
          >
            <Lock className="w-4 h-4" />
            {t('approvals.finalApproval')}
          </button>
        </section>

        <section className={`${card} p-5 space-y-4`}>
          <SectionHeader icon={Eye} tone={SKY_TILE} title={t('approvals.previewTitle')} subtitle={t('approvals.previewSubtitle')} />
          <WatermarkedPreview
            title={register.title}
            meta={t('approvals.previewMeta', { code: URGENT_APPROVAL.code, page: 1, pages: URGENT_APPROVAL.pages })}
            watermark={watermark}
          />
          <p id="approvals-watermark-note" className="sr-only">
            {watermark}
          </p>
        </section>
      </div>

      {/* Decision cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Urgent approval (YQ-8841) */}
        <section className={`${card} p-5 space-y-4`} id="urgent-approval-card">
          <SectionHeader icon={Clock} tone={AMBER_TILE} title={t('approvals.urgentTitle')} subtitle={t('approvals.urgentSubtitle')} />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">{t('approvals.pagesLabel')}</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{URGENT_APPROVAL.pages}</div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">{t('approvals.readingTimeLabel')}</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{t('approvals.seconds', { count: URGENT_APPROVAL.readingSeconds })}</div>
            </div>
            <div className="col-span-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">{t('approvals.expectedLabel')}</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{t('approvals.minutesApprox', { count: URGENT_APPROVAL.expectedMinutes })}</div>
            </div>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50/60 p-4 space-y-2" id="delegation-limit-alert">
            <div className="flex items-center gap-2 text-sm font-bold text-red-700">
              <X className="w-4 h-4" />
              {t('approvals.delegationLimitTitle')}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-slate-500">{t('approvals.contractValueLabel')}</div>
                <div className="font-bold text-slate-900" dir="ltr">{formatSar(URGENT_APPROVAL.contractValueSar)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">{t('approvals.delegatedLimitLabel')}</div>
                <div className="font-bold text-slate-900" dir="ltr">{formatSar(delegatedLimit)}</div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500">{limitEvidence}</div>
          </div>

          {urgent ? (
            <DecisionOutcome
              tone={urgent === 'approved' ? 'amber' : 'red'}
              title={urgent === 'approved' ? t('approvals.urgentApprovedReturned', { name: PEOPLE.tariq.name[lang] }) : t('approvals.urgentRejectedOutcome')}
              comment={requestComments.urgent}
              commentLabel={t('approvals.yourComment')}
            />
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="urgent-comment" className="block text-xs font-bold text-slate-600">
                  {t('approvals.commentLabel')}
                </label>
                <textarea
                  id="urgent-comment"
                  rows={3}
                  value={urgentComment}
                  onChange={(e) => setUrgentComment(e.target.value)}
                  placeholder={t('approvals.urgentCommentPlaceholder')}
                  className={textareaCls}
                />
                <p className="text-[11px] text-slate-500">{t('approvals.commentRequired')}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" id="btn-urgent-approve" className={approveCls} disabled={!urgentComment.trim()} onClick={() => decideRequest('urgent', 'approved', urgentComment.trim())}>
                  <Check className="w-4 h-4" />
                  {t('approvals.urgentApprove')}
                </button>
                <button
                  type="button"
                  id="btn-urgent-reject"
                  className={rejectCls}
                  disabled={!urgentComment.trim()}
                  onClick={() => decideRequest('urgent', 'rejected', urgentComment.trim())}
                >
                  <X className="w-4 h-4" />
                  {t('approvals.urgentReject')}
                </button>
              </div>
            </>
          )}
        </section>

        {/* Justified exception (PO-3310) */}
        <section className={`${card} p-5 space-y-4 scroll-mt-28`} id="exception-request-card">
          <SectionHeader
            icon={ArrowLeftRight}
            tone={AMBER_TILE}
            title={t('approvals.exceptionTitle')}
            subtitle={
              <>
                <bdi className="font-mono">{EXCEPTION_REQUEST.code}</bdi> · {EXCEPTION_REQUEST.title[lang]}
              </>
            }
          />
          <dl className="space-y-1.5 text-sm">
            <div className="flex gap-1.5">
              <dt className="text-slate-500">{t('approvals.stageToSkip')}</dt>
              <dd className="font-bold text-slate-900">{EXCEPTION_REQUEST.stageToSkip[lang]}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="text-slate-500">{t('approvals.requester')}</dt>
              <dd className="font-bold text-slate-900">{EXCEPTION_REQUEST.requester[lang]}</dd>
            </div>
          </dl>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="text-xs text-slate-500">{t('approvals.writtenReason')}</div>
            <p className="text-sm text-slate-900 mt-1 leading-relaxed">{EXCEPTION_REQUEST.reason[lang]}</p>
          </div>
          <p className="text-xs text-amber-700">{t('approvals.exceptionNote')}</p>

          {exception ? (
            <DecisionOutcome
              tone={exception === 'approved' ? 'green' : 'red'}
              title={t(exception === 'approved' ? 'approvals.exceptionApprovedOutcome' : 'approvals.exceptionRejectedOutcome')}
              comment={requestComments.exception}
              commentLabel={t('approvals.yourComment')}
            />
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="exception-comment" className="block text-xs font-bold text-slate-600">
                  {t('approvals.commentLabel')}
                </label>
                <textarea
                  id="exception-comment"
                  rows={2}
                  value={exceptionComment}
                  onChange={(e) => setExceptionComment(e.target.value)}
                  placeholder={t('approvals.exceptionCommentPlaceholder')}
                  className={textareaCls}
                />
                <p className="text-[11px] text-slate-500">{t('approvals.commentRequired')}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" id="btn-exception-approve" className={approveCls} disabled={!exceptionComment.trim()} onClick={() => decideRequest('exception', 'approved', exceptionComment.trim())}>
                  <Check className="w-4 h-4" />
                  {t('approvals.exceptionApprove')}
                </button>
                <button
                  type="button"
                  id="btn-exception-reject"
                  className={rejectCls}
                  disabled={!exceptionComment.trim()}
                  onClick={() => decideRequest('exception', 'rejected', exceptionComment.trim())}
                >
                  <X className="w-4 h-4" />
                  {t('approvals.exceptionReject')}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};
