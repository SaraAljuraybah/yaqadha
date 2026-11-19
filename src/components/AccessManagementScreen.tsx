import React, { useMemo, useState } from 'react';
import { ArrowLeftRight, ChevronLeft, Plus, Search, ShieldCheck, X } from 'lucide-react';
import { TranslationKey, useLanguage } from '../i18n';
import {
  DELEGABLE_PERMISSIONS,
  DEMO_NOW,
  Delegation,
  UserAccount,
  daysBetween,
  delegationPhase,
  formatDateRange,
  formatDayMonth,
  getUsers,
} from '../data/demo';
import { useDemoDecisions } from '../state/DemoDecisions';

// إدارة الحسابات والصلاحيات — accounts, permissions and temporary delegations

type FilterKey = 'all' | 'signers' | 'auditors' | 'suspended' | 'temporary';
type Tone = 'green' | 'red' | 'sky';
interface RowView {
  tone: Tone;
  status: string;
  access: string;
  /** Pill colour of the access level when it differs from the status colour */
  accessTone?: Tone;
}

const card = 'bg-white rounded-2xl border border-slate-200 shadow-2xs';
const SKY = 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-[#0F1C24] dark:text-sky-300 dark:border-[#1E3442]';
const toneCls: Record<Tone, string> = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  sky: SKY,
};
const dotCls: Record<Tone, string> = { green: 'bg-emerald-500', red: 'bg-red-500', sky: 'bg-sky-500' };

const isSigner = (u: UserAccount) => u.accessLevel === 'executive_signature' || u.accessLevel === 'financial_approval';
const isAuditor = (u: UserAccount) => u.accessLevel === 'full_audit' || u.accessLevel === 'internal_audit' || u.accessLevel === 'legal_compliance';

/** First letter of the name after the honorific (د. / أ. / Dr. / Mr. …). */
const initialOf = (name: string) => name.replace(/^(أ\.|د\.|م\.|Mr\.|Ms\.|Dr\.|Eng\.)\s*/, '').charAt(0);

const Avatar: React.FC<{ name: string; tone: Tone }> = ({ name, tone }) => (
  <span className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 ${toneCls[tone]}`} aria-hidden="true">
    {initialOf(name)}
  </span>
);

const Pill: React.FC<{ tone: Tone; dot?: boolean; children: React.ReactNode }> = ({ tone, dot, children }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold whitespace-nowrap ${toneCls[tone]}`}>
    {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotCls[tone]}`} aria-hidden="true" />}
    {children}
  </span>
);

const daysLeftKey = (n: number): TranslationKey =>
  n <= 1 ? 'accessManagement.daysLeftOne' : n === 2 ? 'accessManagement.daysLeftTwo' : n <= 10 ? 'accessManagement.daysLeftFew' : 'accessManagement.daysLeftMany';

const fieldCls =
  'w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2C3E28]';

const emptyForm = { fromUserId: '', toUserId: '', permissionId: '', startIso: '2026-11-20', endIso: '2026-11-27' };

export const AccessManagementScreen: React.FC = () => {
  const { lang, t } = useLanguage();
  const { decisions, delegations, addDelegation, cancelDelegation } = useDemoDecisions();
  const users = useMemo(() => getUsers(lang), [lang]);
  const usersById = useMemo(() => Object.fromEntries(users.map((u) => [u.id, u])) as Record<string, UserAccount>, [users]);

  const [filter, setFilter] = useState<FilterKey>('all');
  const [query, setQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<TranslationKey | null>(null);

  const permission = (id: string) => DELEGABLE_PERMISSIONS.find((p) => p.id === id);
  const visibleDelegations = delegations.filter((d) => delegationPhase(d) !== 'ended');
  const active = delegations.filter((d) => delegationPhase(d) === 'active');

  // An account suspended by the DOC-2026-01 case is restored when the suspension is lifted
  const isSuspended = (u: UserAccount) => u.status === 'restricted' && !(u.id === 'u-2' && decisions.case === 'lifted');

  /** Status, access label and colour of a row, including active delegations. */
  const rowView = (u: UserAccount): RowView => {
    const asDelegator = active.find((d) => d.fromUserId === u.id);
    const asDelegate = active.find((d) => d.toUserId === u.id);
    if (isSuspended(u)) return { tone: 'red', status: t('accessManagement.statusSuspended'), access: u.accessLevelLabel };
    if (asDelegator)
      return { tone: 'sky', status: t('accessManagement.statusDelegatorUntil', { date: formatDayMonth(asDelegator.endIso, lang) }), access: u.accessLevelLabel, accessTone: 'green' };
    if (asDelegate) {
      const scope = permission(asDelegate.permissionId)?.short[lang] ?? '';
      return { tone: 'sky', status: t('accessManagement.statusTemporary'), access: t('accessManagement.delegatedAccess', { scope }) };
    }
    return { tone: 'green', status: t('accessManagement.statusActive'), access: u.accessLevelLabel };
  };

  const counts: Record<FilterKey, number> = {
    all: users.length,
    signers: users.filter(isSigner).length,
    auditors: users.filter(isAuditor).length,
    suspended: users.filter(isSuspended).length,
    temporary: users.filter((u) => active.some((d) => d.toUserId === u.id)).length,
  };

  const filtered = users.filter((u) => {
    if (filter === 'signers' && !isSigner(u)) return false;
    if (filter === 'auditors' && !isAuditor(u)) return false;
    if (filter === 'suspended' && !isSuspended(u)) return false;
    if (filter === 'temporary' && !active.some((d) => d.toUserId === u.id)) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const view = rowView(u);
    return `${u.name} ${u.role} ${u.department} ${view.access} ${view.status}`.toLowerCase().includes(q);
  });

  // ---- new delegation ----
  const submitDelegation = (event: React.FormEvent) => {
    event.preventDefault();
    const { fromUserId, toUserId, permissionId, startIso, endIso } = form;
    const from = usersById[fromUserId];
    const to = usersById[toUserId];
    const error: TranslationKey | null =
      !from || !to || !permissionId || !startIso || !endIso
        ? 'accessManagement.errRequired'
        : fromUserId === toUserId
        ? 'accessManagement.errSamePerson'
        : visibleDelegations.some((d) => d.toUserId === fromUserId)
        ? 'accessManagement.errRedelegation'
        : isSuspended(from) || isSuspended(to)
        ? 'accessManagement.errSuspended'
        : startIso < DEMO_NOW.isoDate
        ? 'accessManagement.errPast'
        : endIso < startIso
        ? 'accessManagement.errDates'
        : null;
    setFormError(error);
    if (error) return;
    addDelegation({ fromUserId, toUserId, permissionId, startIso, endIso });
    setForm(emptyForm);
    setIsFormOpen(false);
  };

  const tabs: { key: FilterKey; label: TranslationKey; idle: string }[] = [
    { key: 'all', label: 'accessManagement.filterAll', idle: 'border-slate-200 text-slate-700 hover:bg-slate-100' },
    { key: 'signers', label: 'accessManagement.filterSigners', idle: 'border-slate-200 text-slate-700 hover:bg-slate-100' },
    { key: 'auditors', label: 'accessManagement.filterAuditors', idle: 'border-slate-200 text-slate-700 hover:bg-slate-100' },
    { key: 'suspended', label: 'accessManagement.filterSuspended', idle: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' },
    { key: 'temporary', label: 'accessManagement.filterTemporary', idle: `${SKY} hover:opacity-90` },
  ];

  const renderDelegation = (d: Delegation) => {
    const from = usersById[d.fromUserId];
    const to = usersById[d.toUserId];
    if (!from || !to) return null;
    const phase = delegationPhase(d);
    const daysLeft = daysBetween(DEMO_NOW.isoDate, d.endIso);
    return (
      <li key={d.id} className={`rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-4 ${SKY}`}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5">
            <Avatar name={from.name} tone="sky" />
            <div>
              <div className="text-sm font-bold text-slate-900">{from.name}</div>
              <div className="text-[11px] text-slate-500">
                {t('accessManagement.delegatorRole')}
                {d.reason ? ` · ${d.reason[lang]}` : ''}
              </div>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-slate-400 ltr:rotate-180" aria-hidden="true" />
          <div className="flex items-center gap-2.5">
            <Avatar name={to.name} tone="sky" />
            <div>
              <div className="text-sm font-bold text-slate-900">{to.name}</div>
              <div className="text-[11px] text-slate-500">{t('accessManagement.delegateRole')}</div>
            </div>
          </div>
          <div className="text-xs space-y-1 text-slate-600">
            <div>
              <span className="text-slate-500">{t('accessManagement.scopeLabel')} </span>
              {permission(d.permissionId)?.scope[lang]}
            </div>
            <div>
              <span className="text-slate-500">{t('accessManagement.periodLabel')} </span>
              {formatDateRange(d.startIso, d.endIso, lang)} ·{' '}
              <span className="font-bold text-sky-700 dark:text-sky-300">
                {phase === 'scheduled'
                  ? t('accessManagement.startsOn', { date: formatDayMonth(d.startIso, lang) })
                  : t(daysLeftKey(daysLeft), { count: daysLeft })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone={phase === 'active' ? 'green' : 'sky'} dot>
            {t(phase === 'active' ? 'accessManagement.phaseActive' : 'accessManagement.phaseScheduled')}
          </Pill>
          <button
            type="button"
            onClick={() => cancelDelegation(d.id)}
            aria-label={t('accessManagement.cancelDelegationAria', { from: from.name, to: to.name })}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            {t('accessManagement.cancelDelegation')}
          </button>
        </div>
      </li>
    );
  };

  return (
    <div id="access-management-screen" className="space-y-6 text-start">
      <div className="pt-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('accessManagement.title')}</h1>
        <p className="text-sm text-slate-600 mt-1">{t('accessManagement.subtitle')}</p>
      </div>

      {/* Temporary delegation */}
      <section className={`${card} p-5 space-y-4`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${SKY}`}>
              <ArrowLeftRight className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">{t('accessManagement.delegationTitle')}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{t('accessManagement.delegationSubtitle')}</p>
            </div>
          </div>
          <button
            type="button"
            id="btn-new-delegation"
            aria-expanded={isFormOpen}
            aria-controls="new-delegation-form"
            onClick={() => {
              setIsFormOpen((open) => !open);
              setFormError(null);
            }}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#2C3E28] hover:bg-[#233220] text-white text-sm font-bold transition-colors"
          >
            {isFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isFormOpen ? t('accessManagement.closeForm') : t('accessManagement.newDelegation')}
          </button>
        </div>

        {visibleDelegations.length === 0 ? (
          <p className="text-sm text-slate-500">{t('accessManagement.noDelegations')}</p>
        ) : (
          <ul className="space-y-3">
            {visibleDelegations.map(renderDelegation)}
          </ul>
        )}

        {isFormOpen && (
          <form id="new-delegation-form" onSubmit={submitDelegation} className="space-y-3 pt-2 border-t border-slate-100" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
              <label className="space-y-1.5">
                <span className="block text-xs font-bold text-slate-600">{t('accessManagement.formDelegator')}</span>
                <select className={fieldCls} value={form.fromUserId} onChange={(e) => setForm({ ...form, fromUserId: e.target.value })}>
                  <option value="">{t('accessManagement.chooseEmployee')}</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="block text-xs font-bold text-slate-600">{t('accessManagement.formDelegate')}</span>
                <select className={fieldCls} value={form.toUserId} onChange={(e) => setForm({ ...form, toUserId: e.target.value })}>
                  <option value="">{t('accessManagement.chooseEmployee')}</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="block text-xs font-bold text-slate-600">{t('accessManagement.formPermission')}</span>
                <select className={fieldCls} value={form.permissionId} onChange={(e) => setForm({ ...form, permissionId: e.target.value })}>
                  <option value="">{t('accessManagement.choosePermission')}</option>
                  {DELEGABLE_PERMISSIONS.map((p) => (
                    <option key={p.id} value={p.id}>{p.scope[lang]}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="block text-xs font-bold text-slate-600">{t('accessManagement.formFrom')}</span>
                <input type="date" className={fieldCls} min={DEMO_NOW.isoDate} value={form.startIso} onChange={(e) => setForm({ ...form, startIso: e.target.value })} />
              </label>
              <label className="space-y-1.5">
                <span className="block text-xs font-bold text-slate-600">{t('accessManagement.formTo')}</span>
                <input type="date" className={fieldCls} min={form.startIso || DEMO_NOW.isoDate} value={form.endIso} onChange={(e) => setForm({ ...form, endIso: e.target.value })} />
              </label>
            </div>
            {formError && (
              <p className="text-xs font-bold text-red-700" role="alert">
                {t(formError)}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-500">{t('accessManagement.delegationRule')}</p>
              <button
                type="submit"
                id="btn-create-delegation"
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#2C3E28] hover:bg-[#233220] text-white text-sm font-bold transition-colors"
              >
                <ArrowLeftRight className="w-4 h-4" />
                {t('accessManagement.createDelegation')}
              </button>
            </div>
          </form>
        )}
        {!isFormOpen && <p className="text-xs text-slate-500">{t('accessManagement.delegationRule')}</p>}
      </section>

      {/* Accounts table */}
      <section className={`${card} overflow-hidden`}>
        <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200">
          <div className="flex flex-wrap gap-2" role="group" aria-label={t('accessManagement.filtersAria')}>
            {tabs.map((tab) => {
              const selected = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setFilter(tab.key)}
                  className={`h-9 px-3.5 rounded-xl border text-xs font-bold transition-colors ${
                    selected ? 'bg-[#2C3E28] border-[#2C3E28] text-white' : tab.idle
                  }`}
                >
                  {t(tab.label, { count: counts[tab.key] })}
                </button>
              );
            })}
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('accessManagement.searchPlaceholder')}
              aria-label={t('accessManagement.searchPlaceholder')}
              className="h-9 w-full sm:w-72 ps-9 pe-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2C3E28]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[880px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-bold border-b border-slate-200">
                <th scope="col" className="py-3 px-4 text-start">{t('accessManagement.colAccount')}</th>
                <th scope="col" className="py-3 px-4 text-start">{t('accessManagement.colDepartment')}</th>
                <th scope="col" className="py-3 px-4 text-start">{t('accessManagement.colAccessLevel')}</th>
                <th scope="col" className="py-3 px-4 text-start">{t('accessManagement.colTwoFactor')}</th>
                <th scope="col" className="py-3 px-4 text-start">{t('accessManagement.colStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => {
                const view = rowView(u);
                return (
                  <tr key={u.id} id={`user-row-${u.id}`} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} tone={view.tone} />
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-xs text-slate-500">{u.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{u.department}</td>
                    <td className="py-3.5 px-4">
                      <Pill tone={view.accessTone ?? view.tone}>{view.access}</Pill>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-emerald-700 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {t('accessManagement.twoFactorEnabled')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Pill tone={view.tone} dot>
                        {view.status}
                      </Pill>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-slate-500">
                    {t('accessManagement.emptyState')}{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setFilter('all');
                        setQuery('');
                      }}
                      className="font-bold text-slate-700 underline underline-offset-4"
                    >
                      {t('accessManagement.resetFilters')}
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
