import React, { useMemo, useState } from 'react';
import { ChevronDown, Eye, Search, X } from 'lucide-react';
import { TranslationKey, useLanguage } from '../i18n';
import {
  COMPLIANCE_TREND,
  DEMO_NOW,
  DEMO_STATS,
  StageState,
  applyDecisionsToRegister,
  DEPARTMENTS,
  DepartmentId,
  RegisterDocument,
  RegisterStatus,
  Severity,
  getRegisterDocuments,
} from '../data/demo';
import { useDemoDecisions } from '../state/DemoDecisions';

// سجل المستندات — documents registry

interface ExecutiveDashboardScreenProps {
  /** Opens a document by code; routing by status is handled by the app */
  onOpenDocument: (code: string) => void;
}

type StatusFilter = 'all' | 'suspended' | 'review' | 'approved';
type DateFilter = 'all' | '7' | '30' | '90';

const card = 'bg-white rounded-2xl border border-slate-200 shadow-2xs';

const statusBadge: Record<RegisterStatus, { label: TranslationKey; badge: string; dot: string }> = {
  suspended: { label: 'common.blocked', badge: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  under_review: { label: 'common.underReview', badge: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  pending_approval: {
    label: 'common.pendingApproval',
    badge: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-[#0F1C24] dark:text-sky-300 dark:border-[#1E3442]',
    dot: 'bg-sky-500',
  },
  approved: { label: 'common.approved', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
};

const matchesStatus = (status: RegisterStatus, filter: StatusFilter) =>
  filter === 'all' ||
  (filter === 'suspended' && status === 'suspended') ||
  (filter === 'review' && (status === 'under_review' || status === 'pending_approval')) ||
  (filter === 'approved' && status === 'approved');

/** Rounded shares of the 60 documents (82 / 13 / 5 before any decision). */
const share = (count: number) => Math.round((count / DEMO_STATS.totalDocuments) * 100);

// ---- approval stage segments ------------------------------------------------

const stageTone: Record<StageState, string> = {
  done: 'bg-emerald-500',
  bypassed: 'bg-red-500',
  requested: 'bg-amber-500',
  current: 'bg-amber-500',
  pending: 'bg-slate-200',
};

/** Per-stage states: explicit when the path is irregular, otherwise derived from the current stage. */
const stageStates = (doc: RegisterDocument): StageState[] =>
  doc.stages ??
  Array.from({ length: doc.totalStages }, (_, i) =>
    doc.status === 'approved' || i < doc.currentStage - 1 ? 'done' : i === doc.currentStage - 1 ? 'current' : 'pending'
  );

const StageBar: React.FC<{ doc: RegisterDocument }> = ({ doc }) => {
  const { t } = useLanguage();
  const states = stageStates(doc);
  const label = states.includes('requested')
    ? t('common.publishRequested')
    : t('documentsRegistry.stageOf', { current: doc.currentStage, total: doc.totalStages });
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1 w-24" aria-hidden="true">
        {states.map((state, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full ${stageTone[state]}`} />
        ))}
      </div>
      <div className="text-[11px] text-slate-500">{label}</div>
    </div>
  );
};

// ---- compliance trend (single series line) ----------------------------------

const TREND_W = 560;
const TREND_H = 170;
const PAD = { top: 16, right: 40, bottom: 28, left: 34 };
const Y_MIN = 65;
const Y_MAX = 90;

const ComplianceTrend: React.FC = () => {
  const { lang, t } = useLanguage();
  const [hover, setHover] = useState<number | null>(null);
  const points = COMPLIANCE_TREND.map((p, i) => ({
    label: p.month[lang],
    value: p.value,
    x: PAD.left + (i * (TREND_W - PAD.left - PAD.right)) / (COMPLIANCE_TREND.length - 1),
    y: PAD.top + ((Y_MAX - p.value) * (TREND_H - PAD.top - PAD.bottom)) / (Y_MAX - Y_MIN),
  }));
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const last = points[points.length - 1];
  const gridValues = [70, 80, 90];
  const yOf = (v: number) => PAD.top + ((Y_MAX - v) * (TREND_H - PAD.top - PAD.bottom)) / (Y_MAX - Y_MIN);
  const hovered = hover !== null ? points[hover] : null;

  return (
    <div className="relative" dir="ltr">
      <svg
        viewBox={`0 0 ${TREND_W} ${TREND_H}`}
        className="w-full h-auto"
        role="img"
        aria-label={t('documentsRegistry.trendAria', { first: points[0].value, last: last.value })}
        onMouseLeave={() => setHover(null)}
      >
        {/* Recessive grid */}
        {gridValues.map((v) => (
          <g key={v}>
            <line x1={PAD.left} x2={TREND_W - PAD.right} y1={yOf(v)} y2={yOf(v)} className="stroke-slate-100" strokeWidth="1" />
            <text x={PAD.left - 8} y={yOf(v) + 4} textAnchor="end" className="fill-slate-400 text-[11px]">
              {v}%
            </text>
          </g>
        ))}
        {/* Crosshair */}
        {hovered && (
          <line x1={hovered.x} x2={hovered.x} y1={PAD.top} y2={TREND_H - PAD.bottom} className="stroke-slate-300" strokeWidth="1" strokeDasharray="3 3" />
        )}
        {/* Line + markers */}
        <path d={path} fill="none" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" className="stroke-emerald-500" />
        {points.map((p, i) => (
          <circle
            key={p.label}
            cx={p.x}
            cy={p.y}
            r={hover === i ? 5.5 : 4}
            className="fill-emerald-500 stroke-white"
            strokeWidth="2"
          />
        ))}
        {/* Direct label on the latest value only */}
        <text x={last.x + 10} y={last.y + 4} className="fill-slate-700 text-[12px] font-bold">
          {last.value}%
        </text>
        {/* Month labels */}
        {points.map((p) => (
          <text key={`m-${p.label}`} x={p.x} y={TREND_H - 6} textAnchor="middle" className="fill-slate-500 text-[11px]">
            {p.label}
          </text>
        ))}
        {/* Hover targets (wider than the marks) */}
        {points.map((p, i) => {
          const half = (TREND_W - PAD.left - PAD.right) / (points.length - 1) / 2;
          return (
            <rect
              key={`h-${p.label}`}
              x={p.x - half}
              y={0}
              width={half * 2}
              height={TREND_H}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          );
        })}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] shadow-lg whitespace-nowrap"
          style={{ left: `${(hovered.x / TREND_W) * 100}%`, top: `${(hovered.y / TREND_H) * 100}%`, marginTop: -10 }}
        >
          <span className="font-bold">{hovered.value}%</span> · {hovered.label}
        </div>
      )}

      {/* Table view for screen readers */}
      <table className="sr-only">
        <caption>{t('documentsRegistry.trendTitle')}</caption>
        <thead>
          <tr>
            <th>{t('documentsRegistry.trendMonth')}</th>
            <th>{t('documentsRegistry.trendRate')}</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={`t-${p.label}`}>
              <td>{p.label}</td>
              <td>{p.value}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ---- filter select (pill style) -------------------------------------------

const FilterSelect: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}> = ({ label, value, onChange, options }) => (
  <label className="relative inline-flex items-center">
    <span className="sr-only">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`appearance-none h-9 ps-3 pe-8 rounded-xl border text-xs font-bold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2C3E28] ${
        value === 'all' ? 'border-slate-200 bg-white text-slate-700' : 'border-[#2C3E28] bg-white text-[#2C3E28]'
      }`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.value === 'all' ? label : o.label}
        </option>
      ))}
    </select>
    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute end-2.5 pointer-events-none" />
  </label>
);

// ---- screen ----------------------------------------------------------------

export const ExecutiveDashboardScreen: React.FC<ExecutiveDashboardScreenProps> = ({ onOpenDocument }) => {
  const { lang, t } = useLanguage();
  const { stats, decisions } = useDemoDecisions();
  const documents = useMemo(() => applyDecisionsToRegister(getRegisterDocuments(lang), decisions), [lang, decisions]);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [department, setDepartment] = useState<'all' | DepartmentId>('all');
  const [dateRange, setDateRange] = useState<DateFilter>('all');
  const [severity, setSeverity] = useState<'all' | Severity>('all');
  const [query, setQuery] = useState('');

  const statusTotals: Record<StatusFilter, number> = {
    all: stats.totalDocuments,
    suspended: stats.suspended,
    review: stats.underReview,
    approved: stats.approved,
  };

  const filtered = documents.filter((doc) => {
    if (!matchesStatus(doc.status, statusFilter)) return false;
    if (department !== 'all' && doc.department !== department) return false;
    if (severity !== 'all' && doc.severity !== severity) return false;
    if (dateRange !== 'all') {
      const ageDays = (new Date(DEMO_NOW.isoDate).getTime() - new Date(doc.createdIso).getTime()) / 86_400_000;
      if (ageDays > Number(dateRange)) return false;
    }
    const q = query.trim().toLowerCase();
    if (q) {
      const haystack = `${doc.code} ${doc.title} ${DEPARTMENTS[doc.department][lang]}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const isFiltered = statusFilter !== 'all' || department !== 'all' || dateRange !== 'all' || severity !== 'all' || query !== '';
  const resetFilters = () => {
    setStatusFilter('all');
    setDepartment('all');
    setDateRange('all');
    setSeverity('all');
    setQuery('');
  };

  const segments = [
    { key: 'approved', count: stats.approved, color: 'bg-emerald-500', text: 'text-emerald-700', legend: 'documentsRegistry.legendApproved' as TranslationKey },
    { key: 'review', count: stats.underReview, color: 'bg-amber-500', text: 'text-amber-700', legend: 'documentsRegistry.legendReview' as TranslationKey },
    { key: 'suspended', count: stats.suspended, color: 'bg-red-500', text: 'text-red-700', legend: 'documentsRegistry.legendSuspended' as TranslationKey },
  ];

  const tabs: { key: StatusFilter; label: TranslationKey; idle: string }[] = [
    { key: 'all', label: 'documentsRegistry.filterAll', idle: 'border-slate-200 text-slate-700 hover:bg-slate-100' },
    { key: 'suspended', label: 'documentsRegistry.filterSuspended', idle: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' },
    { key: 'review', label: 'documentsRegistry.filterReview', idle: 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100' },
    { key: 'approved', label: 'documentsRegistry.filterApproved', idle: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
  ];

  return (
    <div id="documents-registry-screen" className="space-y-6 text-start">
      {/* Title */}
      <div className="pt-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('documentsRegistry.title')}</h1>
        <p className="text-sm text-slate-600 mt-1">{t('documentsRegistry.subtitle')}</p>
      </div>

      {/* Compliance distribution + trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className={`${card} p-5 space-y-4`}>
          <div>
            <h2 className="text-base font-bold text-slate-900">{t('documentsRegistry.complianceTitle')}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t('documentsRegistry.documentsCount', { count: stats.totalDocuments })}</p>
          </div>
          <div className="flex gap-0.5 h-2.5">
            {segments.map((s) => (
              <span
                key={s.key}
                className={`h-full rounded-full ${s.color}`}
                style={{ width: `${share(s.count)}%` }}
                title={t('documentsRegistry.segmentLabel', { label: t(s.legend, { percent: share(s.count) }), count: s.count })}
              />
            ))}
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            {segments.map((s) => (
              <li key={s.key} className="flex items-center gap-1.5 text-slate-700">
                <span className={`w-2 h-2 rounded-full ${s.color}`} aria-hidden="true" />
                <span className="font-medium">{t(s.legend, { percent: share(s.count) })}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${card} p-5 space-y-3`}>
          <div>
            <h2 className="text-base font-bold text-slate-900">{t('documentsRegistry.trendTitle')}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t('documentsRegistry.trendPeriod')}</p>
          </div>
          <ComplianceTrend />
        </section>
      </div>

      {/* Registry table */}
      <section className={`${card} overflow-hidden`}>
        {/* Toolbar: status tabs on the start side, search + filters on the end side */}
        <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200">
          <div className="flex flex-wrap gap-2" role="group" aria-label={t('documentsRegistry.filtersAria')}>
            {tabs.map((tab) => {
              const active = statusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`h-9 px-3.5 rounded-xl border text-xs font-bold transition-colors ${
                    active ? 'bg-[#2C3E28] border-[#2C3E28] text-white' : tab.idle
                  }`}
                >
                  {t(tab.label, { count: statusTotals[tab.key] })}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('documentsRegistry.searchPlaceholder')}
                aria-label={t('documentsRegistry.searchPlaceholder')}
                className="h-9 w-64 ps-9 pe-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2C3E28]"
              />
            </div>
            <FilterSelect
              label={t('documentsRegistry.filterDepartment')}
              value={department}
              onChange={(v) => setDepartment(v as 'all' | DepartmentId)}
              options={[
                { value: 'all', label: t('documentsRegistry.allDepartments') },
                ...(Object.keys(DEPARTMENTS) as DepartmentId[]).map((id) => ({ value: id, label: DEPARTMENTS[id][lang] })),
              ]}
            />
            <FilterSelect
              label={t('documentsRegistry.filterDate')}
              value={dateRange}
              onChange={(v) => setDateRange(v as DateFilter)}
              options={[
                { value: 'all', label: t('documentsRegistry.allDates') },
                { value: '7', label: t('documentsRegistry.last7Days') },
                { value: '30', label: t('documentsRegistry.last30Days') },
                { value: '90', label: t('documentsRegistry.last90Days') },
              ]}
            />
            <FilterSelect
              label={t('documentsRegistry.filterSeverity')}
              value={severity}
              onChange={(v) => setSeverity(v as 'all' | Severity)}
              options={[
                { value: 'all', label: t('documentsRegistry.allSeverities') },
                { value: 'high', label: t('documentsRegistry.severityHigh') },
                { value: 'medium', label: t('documentsRegistry.severityMedium') },
                { value: 'low', label: t('documentsRegistry.severityLow') },
              ]}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-bold border-b border-slate-200">
                <th scope="col" className="py-3 px-4 text-start">{t('documentsRegistry.colNumber')}</th>
                <th scope="col" className="py-3 px-4 text-start">{t('documentsRegistry.colTitle')}</th>
                <th scope="col" className="py-3 px-4 text-start">{t('documentsRegistry.colDepartment')}</th>
                <th scope="col" className="py-3 px-4 text-start">{t('documentsRegistry.colStage')}</th>
                <th scope="col" className="py-3 px-4 text-start">{t('documentsRegistry.colStatus')}</th>
                <th scope="col" className="py-3 px-4 text-start">{t('documentsRegistry.colAction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((doc) => {
                const badge = statusBadge[doc.status];
                return (
                  <tr key={doc.code} id={`doc-row-${doc.code}`} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <bdi>#{doc.code}</bdi>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-900">{doc.title}</td>
                    <td className="py-4 px-4 text-slate-500 whitespace-nowrap">{DEPARTMENTS[doc.department][lang]}</td>
                    <td className="py-4 px-4">
                      <StageBar doc={doc} />
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold whitespace-nowrap ${badge.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} aria-hidden="true" />
                        {t(badge.label)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        type="button"
                        id={`btn-preview-${doc.code}`}
                        onClick={() => onOpenDocument(doc.code)}
                        disabled={!doc.hasDetailPage}
                        title={doc.hasDetailPage ? undefined : t('documentsRegistry.noDetailPage')}
                        aria-label={t('documentsRegistry.previewAria', { title: doc.title })}
                        className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {t('documentsRegistry.preview')}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-slate-500">
                    {t('documentsRegistry.emptyState')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* "Showing N of total" — only 6 of the 60 documents are detailed in the demo */}
        <div className="px-4 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>{t('documentsRegistry.showing', { shown: filtered.length, total: statusTotals[statusFilter] })}</span>
          {isFiltered && (
            <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1 font-bold text-slate-700 hover:text-slate-900">
              <X className="w-3.5 h-3.5" />
              {t('documentsRegistry.resetFilters')}
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
