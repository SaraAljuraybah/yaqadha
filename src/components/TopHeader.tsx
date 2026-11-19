import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, ArrowLeftRight, Bell, CheckCircle2, Clock, Eye, Play, LucideIcon } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '../i18n';
import { CURRENT_USER, DemoNotification, NotificationKind, getNotifications } from '../data/demo';
import { useDemoDecisions } from '../state/DemoDecisions';

interface TopHeaderProps {
  demoMode: boolean;
  onToggleDemoMode: () => void;
  onOpenNotification: (notification: DemoNotification) => void;
  onViewAllNotifications: () => void;
}

const kindStyles: Record<NotificationKind, { icon: LucideIcon; tile: string }> = {
  urgent_approval: { icon: Clock, tile: 'bg-amber-50 text-amber-700 border-amber-200' },
  exception_request: { icon: ArrowLeftRight, tile: 'bg-amber-50 text-amber-700 border-amber-200' },
  suspension: { icon: AlertTriangle, tile: 'bg-red-50 text-red-700 border-red-200' },
  after_hours: { icon: Eye, tile: 'bg-amber-50 text-amber-700 border-amber-200' },
  chain_completed: { icon: CheckCircle2, tile: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  demoMode,
  onToggleDemoMode,
  onOpenNotification,
  onViewAllNotifications,
}) => {
  const { lang, t } = useLanguage();
  const { resolved } = useDemoDecisions();
  // Decision notifications disappear once the decision has been taken
  const notifications = useMemo(
    () => getNotifications(lang).filter((n) => !(n.group === 'decision' && resolved.includes(n.code))),
    [lang, resolved]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<'decision' | 'info'>('decision');
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());
  const menuRef = useRef<HTMLDivElement>(null);

  const decisionItems = notifications.filter((n) => n.group === 'decision');
  const infoItems = notifications.filter((n) => n.group === 'info');
  const visibleItems = tab === 'decision' ? decisionItems : infoItems;
  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  // Close the menu on outside click or Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  const handleSelect = (notification: DemoNotification) => {
    setReadIds((prev) => new Set(prev).add(notification.id));
    setIsOpen(false);
    onOpenNotification(notification);
  };

  const iconButton =
    'relative p-2.5 rounded-2xl border transition-all shadow-2xs border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50';

  return (
    <header className="sticky top-0 z-30 bg-[#F8FAFC]/95 dark:bg-[#0E1210]/95 backdrop-blur-md border-b border-slate-200/90 h-20 px-6 lg:px-8 flex items-center justify-end gap-3">
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Demo mode switch */}
        <button
          id="btn-demo-mode"
          type="button"
          role="switch"
          aria-checked={demoMode}
          aria-label={demoMode ? t('header.demoModeOnLabel') : t('header.demoModeOffLabel')}
          onClick={onToggleDemoMode}
          className="h-11 flex items-center gap-2.5 ps-3 pe-2.5 rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Play className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-medium whitespace-nowrap">{t('header.demoMode')}</span>
          <span
            className={`relative w-9 h-5 rounded-full transition-colors ${demoMode ? 'bg-emerald-500' : 'bg-slate-300'}`}
            aria-hidden="true"
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                demoMode ? 'start-[18px]' : 'start-0.5'
              }`}
            />
          </span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={menuRef}>
          <button
            id="btn-notifications-toggle"
            type="button"
            title={t('header.notificationsCount', { count: unreadCount })}
            aria-label={t('header.notificationsCount', { count: unreadCount })}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
            className={`${iconButton} ${isOpen ? '!bg-slate-100' : ''}`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -end-1.5 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#F8FAFC] dark:ring-[#0E1210]">
                {unreadCount}
              </span>
            )}
          </button>

          {isOpen && (
            <div
              id="notifications-dropdown-panel"
              className="absolute end-0 top-full mt-2.5 w-[22rem] bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-3 text-start"
            >
              {/* Tabs */}
              <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 mb-3" role="tablist">
                {(['decision', 'info'] as const).map((key) => {
                  const selected = tab === key;
                  const count = key === 'decision' ? decisionItems.length : infoItems.length;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setTab(key)}
                      className={`h-8 rounded-lg text-xs font-bold transition-colors ${
                        selected ? 'bg-[#2C3E28] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t(key === 'decision' ? 'header.tabDecision' : 'header.tabInfo', { count })}
                    </button>
                  );
                })}
              </div>

              {/* Items */}
              <div className="space-y-2" role="tabpanel">
                {visibleItems.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-6">{t('header.noNotifications')}</p>
                )}
                {visibleItems.map((item) => {
                  const style = kindStyles[item.kind];
                  const Icon = style.icon;
                  const unread = !readIds.has(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors text-start"
                    >
                      <span className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${style.tile}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-xs font-bold text-slate-900">
                          {item.label} — <bdi className="font-mono">{item.code}</bdi>
                        </span>
                        <span className="block text-[11px] text-slate-500 mt-0.5 leading-snug">{item.body}</span>
                      </span>
                      {unread && <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onViewAllNotifications();
                }}
                className="w-full mt-3 pt-3 border-t border-slate-100 text-xs font-bold text-slate-700 hover:text-slate-900 underline underline-offset-4"
              >
                {t('header.viewAllNotifications')}
              </button>
            </div>
          )}
        </div>

        <LanguageToggle />
        <ThemeToggle />

        {/* User card */}
        <div className="flex items-center gap-2.5 ps-1.5 pe-3 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-[#2C3E28] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {CURRENT_USER.initials[lang]}
          </div>
          <div className="hidden md:flex flex-col text-start">
            <span className="text-sm font-bold text-slate-900 leading-tight whitespace-nowrap">{CURRENT_USER.name[lang]}</span>
            <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">{CURRENT_USER.role[lang]}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
