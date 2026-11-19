import React from 'react';
import {
  Home,
  LayoutGrid,
  SlidersHorizontal,
  Stamp,
  ShieldCheck,
  Gauge,
  LucideIcon,
} from 'lucide-react';
import { ActiveScreen } from '../types';
import { TranslationKey, useLanguage } from '../i18n';
import { useDemoDecisions } from '../state/DemoDecisions';

interface SidebarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
}

type BadgeTone = 'neutral' | 'red' | 'amber';

interface NavItem {
  id: string;
  screen: ActiveScreen;
  /** Other screens that keep this item highlighted */
  alsoActiveOn?: ActiveScreen[];
  label: TranslationKey;
  icon: LucideIcon;
  badge?: { count: number; tone: BadgeTone; label: TranslationKey };
}

type Stats = ReturnType<typeof useDemoDecisions>['stats'];

// Order follows the target design; counts come from the central data and the session's decisions
const navItems = (stats: Stats, pendingRequests: number): NavItem[] => [
  { id: 'overview', screen: 'overview', label: 'sidebar.overview', icon: Home },
  {
    id: 'documents',
    screen: 'executive_dashboard',
    alsoActiveOn: ['file_dossier'],
    label: 'sidebar.documents',
    icon: LayoutGrid,
    badge: { count: stats.totalDocuments, tone: 'neutral', label: 'sidebar.documentsBadgeLabel' },
  },
  {
    id: 'indicators',
    screen: 'indicators_hub',
    label: 'sidebar.indicators',
    icon: SlidersHorizontal,
    badge: { count: stats.suspendedAwaitingDecision, tone: 'red', label: 'sidebar.indicatorsBadgeLabel' },
  },
  {
    id: 'approvals',
    screen: 'approval_requests',
    label: 'sidebar.approvals',
    icon: Stamp,
    badge: { count: pendingRequests, tone: 'amber', label: 'sidebar.approvalsBadgeLabel' },
  },
  { id: 'access', screen: 'access_management', label: 'sidebar.accessManagement', icon: ShieldCheck },
  { id: 'tender-risk', screen: 'tender_risk_assessment', label: 'sidebar.tenderRisk', icon: Gauge },
];

const badgeStyles: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  amber: 'bg-amber-50 text-amber-800 border-amber-200',
};

const isNavItemActive = (item: NavItem, activeScreen: ActiveScreen) =>
  item.screen === activeScreen || (item.alsoActiveOn?.includes(activeScreen) ?? false);

export const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onNavigate }) => {
  const { t } = useLanguage();
  const { stats, decisions } = useDemoDecisions();
  // Approval requests awaiting a decision (YQ-8841 urgent approval, PO-3310 exception); the case has its own badge
  const pendingRequests = (decisions.urgent ? 0 : 1) + (decisions.exception ? 0 : 1);

  return (
    <aside
      className="fixed top-0 start-0 h-screen w-72 bg-white border-e border-slate-200 z-40 flex flex-col select-none"
      aria-label={t('sidebar.ariaLabel')}
    >
      {/* Brand */}
      <a href="/" className="h-20 flex items-center px-6 gap-2.5 shrink-0">
        <img
          src="/yaqadha-logo.svg"
          data-brand-logo
          alt={t('sidebar.logoAlt')}
          className="w-11 h-11 object-contain shrink-0 transition-transform duration-300 hover:scale-105"
        />
        <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-[#EFE6C8]">{t('common.brand')}</span>
      </a>

      {/* Navigation */}
      <nav className="px-4 pb-4 space-y-1.5 overflow-y-auto" aria-label={t('sidebar.navAriaLabel')}>
        {navItems(stats, pendingRequests).map((item) => {
          const active = isNavItemActive(item, activeScreen);
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              type="button"
              onClick={() => onNavigate(item.screen)}
              aria-current={active ? 'page' : undefined}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-sm transition-colors text-start ${
                active
                  ? 'bg-[#2C3E28] text-white font-bold shadow-2xs'
                  : 'text-slate-700 font-medium hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-white' : 'text-slate-500'}`} />
                <span className="leading-snug">{t(item.label)}</span>
              </span>
              {item.badge && item.badge.count > 0 && (
                <span
                  className={`min-w-6 h-6 px-1.5 inline-flex items-center justify-center rounded-lg border text-[11px] font-bold font-mono shrink-0 ${
                    active ? 'bg-white/20 text-white border-white/10' : badgeStyles[item.badge.tone]
                  }`}
                  aria-label={t(item.badge.label, { count: item.badge.count })}
                >
                  {item.badge.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
