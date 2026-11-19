import React, { useEffect } from 'react';
import { Gauge, Home, LayoutGrid, ShieldCheck, SlidersHorizontal, Stamp, User, X, LucideIcon } from 'lucide-react';
import { ActiveScreen } from '../types';
import { TranslationKey, useLanguage } from '../i18n';
import { CURRENT_USER, DemoNotification } from '../data/demo';
import { useTheme } from '../hooks/useTheme';
import { useDemoDecisions } from '../state/DemoDecisions';
import { DemoModeSwitch, NotificationsBell } from './TopHeader';

// Mobile layout (below lg): compact header, bottom navigation, and the "My account" sheet.

interface MobileHeaderProps {
  onOpenNotification: (notification: DemoNotification) => void;
  onViewAllNotifications: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = (props) => {
  const { t } = useLanguage();
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-[#F8FAFC]/95 dark:bg-[#0E1210]/95 backdrop-blur-md h-16 px-4 flex items-center justify-between border-b border-slate-200/90">
      <a href="/" className="flex items-center gap-2">
        <img src="/yaqadha-logo.svg" data-brand-logo alt={t('sidebar.logoAlt')} className="w-9 h-9 object-contain" />
        <span className="text-xl font-black tracking-tight text-slate-900 dark:text-[#EFE6C8]">{t('common.brand')}</span>
      </a>
      <NotificationsBell {...props} />
    </header>
  );
};

/** Compact demo banner for mobile (the full banner is shown on desktop). */
export const MobileDemoBanner: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="lg:hidden px-4 pt-3" role="status">
      <div className="rounded-2xl border border-sky-200 bg-sky-50 dark:border-[#1E3442] dark:bg-[#0F1C24] px-4 py-2.5 text-sm font-bold text-sky-800 dark:text-sky-300">
        {t('demoBanner.title')}
      </div>
    </div>
  );
};

interface NavEntry {
  id: string;
  label: TranslationKey;
  icon: LucideIcon;
  screens: ActiveScreen[];
}

const BOTTOM_NAV: NavEntry[] = [
  { id: 'home', label: 'mobile.navHome', icon: Home, screens: ['overview'] },
  { id: 'documents', label: 'mobile.navDocuments', icon: LayoutGrid, screens: ['executive_dashboard', 'file_dossier'] },
  { id: 'approvals', label: 'mobile.navApprovals', icon: Stamp, screens: ['approval_requests'] },
  { id: 'risk', label: 'mobile.navRisk', icon: Gauge, screens: ['tender_risk_assessment'] },
];

interface MobileBottomNavProps {
  activeScreen: ActiveScreen;
  isAccountOpen: boolean;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenAccount: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeScreen, isAccountOpen, onNavigate, onOpenAccount }) => {
  const { t } = useLanguage();
  const item = (key: string, label: string, Icon: LucideIcon, active: boolean, onClick: () => void) => (
    <li key={key} className="flex-1">
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
        className={`w-full h-16 flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-colors ${
          active ? 'text-[#2C3E28]' : 'text-slate-500'
        }`}
      >
        <Icon className="w-5 h-5" />
        {label}
      </button>
    </li>
  );
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-[env(safe-area-inset-bottom)] print:hidden"
      aria-label={t('mobile.navAria')}
    >
      <ul className="flex">
        {BOTTOM_NAV.map((entry) =>
          item(entry.id, t(entry.label), entry.icon, !isAccountOpen && entry.screens.includes(activeScreen), () => onNavigate(entry.screens[0]))
        )}
        {item('account', t('mobile.navAccount'), User, isAccountOpen, onOpenAccount)}
      </ul>
    </nav>
  );
};

interface AccountSheetProps {
  isOpen: boolean;
  onClose: () => void;
  demoMode: boolean;
  onToggleDemoMode: () => void;
  onNavigate: (screen: ActiveScreen) => void;
}

/** "My account": name, role, theme, language and demo mode — plus the two pages not in the bottom bar. */
export const AccountSheet: React.FC<AccountSheetProps> = ({ isOpen, onClose, demoMode, onToggleDemoMode, onNavigate }) => {
  const { lang, t, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { stats } = useDemoDecisions();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const row = 'flex items-center justify-between gap-3 py-3.5';
  const go = (screen: ActiveScreen) => {
    onClose();
    onNavigate(screen);
  };
  const isDark = theme === 'dark';

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex items-end" role="dialog" aria-modal="true" aria-labelledby="account-sheet-title">
      <div className="absolute inset-0 bg-slate-900/70" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full bg-white rounded-t-3xl border-t border-slate-200 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-start">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-[#2C3E28] text-white flex items-center justify-center font-bold text-sm">
              {CURRENT_USER.initials[lang]}
            </span>
            <div>
              <h2 id="account-sheet-title" className="text-base font-bold text-slate-900">
                {CURRENT_USER.name[lang]}
              </h2>
              <p className="text-xs text-slate-500">{CURRENT_USER.role[lang]}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label={t('common.close')} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 divide-y divide-slate-100 border-y border-slate-100">
          <div className={row}>
            <span className="text-sm font-medium text-slate-800">{t('mobile.darkMode')}</span>
            <button type="button" role="switch" aria-checked={isDark} aria-label={t('mobile.darkMode')} onClick={toggleTheme} className="flex items-center">
              <span className={`relative w-9 h-5 rounded-full transition-colors ${isDark ? 'bg-emerald-500' : 'bg-slate-300'}`} aria-hidden="true">
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${isDark ? 'start-[18px]' : 'start-0.5'}`} />
              </span>
            </button>
          </div>
          <div className={row}>
            <span className="text-sm font-medium text-slate-800">{t('mobile.language')}</span>
            <button type="button" onClick={toggleLanguage} className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800">
              {t('mobile.switchLanguage')}
            </button>
          </div>
          <div className={row}>
            <span className="text-sm font-medium text-slate-800">{t('header.demoMode')}</span>
            <DemoModeSwitch demoMode={demoMode} onToggle={onToggleDemoMode} compact />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="text-[11px] font-bold text-slate-500">{t('mobile.morePages')}</div>
          <button type="button" onClick={() => go('indicators_hub')} className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-start">
            <span className="flex items-center gap-2.5 text-sm font-bold text-slate-900">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              {t('sidebar.indicators')}
            </span>
            {stats.suspendedAwaitingDecision > 0 && (
              <span className="min-w-6 h-6 px-1.5 inline-flex items-center justify-center rounded-lg border text-[11px] font-bold bg-red-50 text-red-700 border-red-200">
                {stats.suspendedAwaitingDecision}
              </span>
            )}
          </button>
          <button type="button" onClick={() => go('access_management')} className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-900 text-start">
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            {t('sidebar.accessManagement')}
          </button>
        </div>
      </div>
    </div>
  );
};
