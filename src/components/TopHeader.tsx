import React, { useState, useRef, useEffect } from 'react';
import { Bell, ShieldAlert, Clock, CheckCircle2, CheckCheck, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { formatNodes, useLanguage } from '../i18n';

interface NotificationItem {
  id: string;
  type: 'blocked' | 'review' | 'completed';
  // Badge, text and time come from the dictionary (notifications.<messageKey>)
  messageKey: 'blocked' | 'review';
  isUnread: boolean;
}

interface TopHeaderProps {
  blockedCount?: number;
}

export const TopHeader: React.FC<TopHeaderProps> = () => {
  const { t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'blocked',
      messageKey: 'blocked',
      isUnread: true,
    },
    {
      id: 'notif-2',
      type: 'review',
      messageKey: 'review',
      isUnread: true,
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 h-18 px-6 sm:px-8 flex items-center justify-between">
      
      {/* Right Side: Clean Empty Spacer (No arbitrary text) */}
      <div></div>

      {/* Left Side: Notifications & User Profile Card */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* Theme Toggle (Light / Dark) */}
        <ThemeToggle />

        {/* Language Toggle (Arabic / English) */}
        <LanguageToggle />

        {/* Notification Bell with Dropdown Panel */}
        <div className="relative" ref={dropdownRef}>
          <button 
            id="btn-notifications-toggle"
            title={t('header.notifications')}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`relative p-2.5 rounded-2xl border transition-all shadow-2xs ${
              isDropdownOpen 
                ? 'bg-[#2C3E28] text-white border-[#2C3E28]' 
                : 'border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Bell className="w-5 h-5" />
            
            {/* Red Badge with Count '2' */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isDropdownOpen && (
            <div 
              id="notifications-dropdown-panel"
              className="absolute end-0 top-full mt-2.5 w-84 sm:w-96 bg-white rounded-3xl border border-slate-200 shadow-xl z-50 overflow-hidden text-start animate-in fade-in slide-in-from-top-2 duration-150"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{t('header.notifications')}</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                      {formatNodes(t('header.unreadCount'), { count: unreadCount })}
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    id="btn-mark-all-read"
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#2C3E28] hover:text-[#1E2B1B] transition-colors p-1 rounded-lg hover:bg-slate-200/60"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-[#2C3E28]" />
                    <span>{t('header.markAllRead')}</span>
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 transition-colors flex items-start gap-3 text-start ${
                      item.isUnread ? 'bg-slate-50/90 hover:bg-slate-100/80' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Status Icon */}
                    <div className="mt-0.5 shrink-0">
                      {item.type === 'blocked' && (
                        <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                      )}
                      {item.type === 'review' && (
                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                      )}
                      {item.type === 'completed' && (
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.type === 'blocked'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : item.type === 'review'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {t(`notifications.${item.messageKey}.badge`)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {t(`notifications.${item.messageKey}.time`)}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-slate-800 leading-snug">
                        {t(`notifications.${item.messageKey}.text`)}
                      </p>
                    </div>

                    {/* Unread indicator dot */}
                    {item.isUnread && (
                      <span className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0"></span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Account / Profile Card */}
        <div className="flex items-center gap-3 ps-3 pe-1 py-1.5 rounded-2xl bg-slate-50/80 border border-slate-200 shadow-2xs">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2C3E28] to-[#1E2B1B] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              {t('header.userInitials')}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          </div>

          <div className="flex flex-col text-start">
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
              {t('header.userName')}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {t('header.userRole')}
            </span>
          </div>
        </div>

      </div>

    </header>
  );
};
