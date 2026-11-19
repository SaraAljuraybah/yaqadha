import React, { useMemo } from 'react';
import { AlertTriangle, Bell, Check, Eye, ShieldCheck, Stamp, TrendingUp, LucideIcon } from 'lucide-react';
import { TranslationKey, useLanguage } from '../i18n';
import {
  CURRENT_USER,
  DEMO_NOW,
  DEPARTMENTS,
  DEPARTMENT_INTEGRITY,
  PendingDecisionKind,
  getLatestAlerts,
  getPendingDecisions,
  getRegisterDocuments,
  oldestPendingHours,
} from '../data/demo';
import { useDemoDecisions } from '../state/DemoDecisions';

interface OverviewScreenProps {
  /** Opens a document by code (routed by its status) */
  onOpenDocument: (code: string) => void;
}

// ---- helpers ---------------------------------------------------------------

const ratingKey = (score: number): TranslationKey =>
  score >= 90 ? 'overview.ratingExcellent' : score >= 80 ? 'overview.ratingVeryGood' : score >= 70 ? 'overview.ratingGood' : 'overview.ratingWatch';

/** Same thresholds for the gauge and the department bars: green ≥ 85, amber ≥ 70, red below. */
const scoreTone = (score: number) =>
  score >= 85
    ? { bar: 'bg-emerald-500', stroke: 'stroke-emerald-500', text: 'text-emerald-700' }
    : score >= 70
    ? { bar: 'bg-amber-500', stroke: 'stroke-amber-500', text: 'text-amber-700' }
    : { bar: 'bg-red-500', stroke: 'stroke-red-500', text: 'text-red-700' };

/** Arabic needs separate wording for 1, 2, 3–10 and 11+ hours. */
const oldestKey = (hours: number): TranslationKey =>
  hours <= 1 ? 'overview.pendingOldestOne' : hours === 2 ? 'overview.pendingOldestTwo' : hours <= 10 ? 'overview.pendingOldestFew' : 'overview.pendingOldestMany';

const kindStyles: Record<PendingDecisionKind, { label: TranslationKey; badge: string; dot: string }> = {
  urgent_approval: { label: 'overview.kindUrgent', badge: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  exception_request: { label: 'overview.kindException', badge: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  suspension: { label: 'overview.kindSuspension', badge: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
};

const alertDot = { red: 'bg-red-500', amber: 'bg-amber-500', green: 'bg-emerald-500' } as const;

const card = 'bg-white rounded-2xl border border-slate-200 shadow-2xs';

const IconTile: React.FC<{ icon: LucideIcon; tone: string }> = ({ icon: Icon, tone }) => (
  <span className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${tone}`}>
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

// ---- integrity gauge -------------------------------------------------------

const IntegrityGauge: React.FC<{ score: number; label: string; caption: string }> = ({ score, label, caption }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const tone = scoreTone(score);
  return (
    <div className="relative w-28 h-28 shrink-0" role="img" aria-label={label}>
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="9" className="stroke-slate-100" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
          className={tone.stroke}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
        <span className="text-3xl font-bold text-slate-900 leading-none">{score}</span>
        <span className="text-[11px] text-slate-500 mt-1">{caption}</span>
      </div>
    </div>
  );
};

// ---- screen ----------------------------------------------------------------

export const OverviewScreen: React.FC<OverviewScreenProps> = ({ onOpenDocument }) => {
  const { lang, t } = useLanguage();
  const { stats, resolved } = useDemoDecisions();
  const pending = useMemo(() => getPendingDecisions(lang).filter((p) => !resolved.includes(p.code)), [lang, resolved]);
  const alerts = useMemo(() => getLatestAlerts(lang), [lang]);
  const titles = useMemo(
    () => Object.fromEntries(getRegisterDocuments(lang).map((d) => [d.code, d.title])) as Record<string, string>,
    [lang]
  );

  const hours = oldestPendingHours(pending);
  const isMorning = Number(DEMO_NOW.time.split(':')[0]) < 12;
  const integrityTone = scoreTone(stats.integrityIndex);

  return (
    <div id="overview-screen" className="space-y-6 text-start">
      {/* Greeting */}
      <div className="pt-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {t(isMorning ? 'overview.greetingMorning' : 'overview.greetingEvening', { name: CURRENT_USER.firstName[lang] })}
        </h1>
        <p className="text-sm text-slate-600 mt-1">{t('overview.subtitle', { date: DEMO_NOW.dateLabel[lang] })}</p>
      </div>

      {/* Headline cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Integrity index */}
        <div className={`${card} p-5 flex items-center gap-4 sm:col-span-2 xl:col-span-1`}>
          <IntegrityGauge score={stats.integrityIndex} label={t('overview.integrityAria', { score: stats.integrityIndex })} caption={t('overview.outOf100')} />
          <div className="min-w-0 space-y-1">
            <div className="text-xs text-slate-500">{t('overview.integrityTitle')}</div>
            <div className="text-lg font-bold text-slate-900">{t(ratingKey(stats.integrityIndex))}</div>
            <div className={`flex items-center gap-1 text-xs font-medium ${integrityTone.text}`}>
              <TrendingUp className="w-3.5 h-3.5 shrink-0" />
              <span>{t('overview.integrityDelta', { points: stats.integrityDelta })}</span>
            </div>
          </div>
        </div>

        {/* Awaiting decision */}
        <div className={`${card} p-5 space-y-3`}>
          <div className="flex items-center gap-2.5">
            <IconTile icon={Stamp} tone="bg-amber-50 text-amber-700 border-amber-200" />
            <span className="text-sm text-slate-600">{t('overview.pendingTitle')}</span>
          </div>
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.awaitingDecision}</div>
          <div className="text-xs text-amber-700">
            {hours === null ? t('overview.pendingNone') : t(oldestKey(hours), { hours })}
          </div>
        </div>

        {/* Active alerts */}
        <div className={`${card} p-5 space-y-3`}>
          <div className="flex items-center gap-2.5">
            <IconTile icon={AlertTriangle} tone="bg-red-50 text-red-700 border-red-200" />
            <span className="text-sm text-slate-600">{t('overview.activeAlertsTitle')}</span>
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.activeAlerts}</div>
          <div className="text-xs text-red-700">
            {stats.suspendedAwaitingDecision > 0
              ? t('overview.activeAlertsSuspended', { count: stats.suspendedAwaitingDecision })
              : t('overview.activeAlertsNoSuspension')}
          </div>
        </div>

        {/* Approved this month */}
        <div className={`${card} p-5 space-y-3`}>
          <div className="flex items-center gap-2.5">
            <IconTile icon={Check} tone="bg-emerald-50 text-emerald-700 border-emerald-200" />
            <span className="text-sm text-slate-600">{t('overview.approvedMonthTitle')}</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.approvedThisMonth}</div>
          <div className="text-xs text-emerald-700">{t('overview.approvedMonthNote')}</div>
        </div>
      </div>

      {/* Pending decisions + latest alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <section className={`${card} p-5 space-y-4 lg:col-span-3`}>
          <SectionHeader
            icon={Stamp}
            tone="bg-amber-50 text-amber-700 border-amber-200"
            title={t('overview.pendingListTitle')}
            subtitle={t('overview.pendingListSubtitle')}
          />
          {pending.length === 0 && <p className="text-sm text-slate-500 py-6 text-center">{t('overview.pendingEmpty')}</p>}
          <ul className="space-y-2.5">
            {pending.map((item) => {
              const style = kindStyles[item.kind];
              const title = titles[item.code] ?? item.code;
              return (
                <li key={item.code} className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      <bdi className="font-mono">{item.code}</bdi> · {item.person}
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${style.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {t(style.label)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenDocument(item.code)}
                      aria-label={t('overview.reviewAria', { title })}
                      className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {t('overview.review')}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className={`${card} p-5 space-y-3 lg:col-span-2`}>
          <SectionHeader icon={Bell} tone="bg-sky-50 text-sky-700 border-sky-200 dark:bg-[#0F1C24] dark:text-sky-300 dark:border-[#1E3442]" title={t('overview.latestAlertsTitle')} />
          <ul className="divide-y divide-slate-100">
            {alerts.map((alert) => (
              <li key={alert.id}>
                <button
                  type="button"
                  onClick={() => onOpenDocument(alert.code)}
                  className="w-full flex items-start gap-3 py-3 text-start hover:bg-slate-50 rounded-lg px-1 transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${alertDot[alert.tone]}`} aria-hidden="true" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-bold text-slate-900">{alert.title}</span>
                    <span className="block text-xs text-slate-500 mt-0.5 truncate">{alert.detail}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 shrink-0 mt-0.5">{alert.timeLabel}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Integrity by department */}
      <section className={`${card} p-5 space-y-4`}>
        <SectionHeader
          icon={ShieldCheck}
          tone="bg-emerald-50 text-emerald-700 border-emerald-200"
          title={t('overview.departmentsTitle')}
          subtitle={t('overview.departmentsPeriod')}
        />
        <ul className="space-y-3.5">
          {DEPARTMENT_INTEGRITY.map(({ department, score }) => {
            const tone = scoreTone(score);
            return (
              <li key={department} className="grid grid-cols-[minmax(8rem,11rem)_1fr_2.5rem] items-center gap-4">
                <span className="text-sm text-slate-700 truncate">{DEPARTMENTS[department][lang]}</span>
                <span
                  className="h-2 rounded-full bg-slate-100 overflow-hidden"
                  role="meter"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={score}
                  aria-label={DEPARTMENTS[department][lang]}
                >
                  <span className={`block h-full rounded-full ${tone.bar}`} style={{ width: `${score}%` }} />
                </span>
                <span className="text-sm font-bold text-slate-900 text-end">{score}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};
