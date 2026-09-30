import React from 'react';
import { 
  LayoutDashboard, 
  SlidersHorizontal, 
  ShieldCheck, 
  ShieldAlert,
  Lock,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { ActiveScreen } from '../types';

interface SidebarProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  onNavigateToIndicators?: () => void;
  blockedCount?: number;
  reviewCount?: number;
  totalDocsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  setActiveScreen,
  onNavigateToIndicators,
  blockedCount = 24,
  reviewCount = 138,
  totalDocsCount = 1482,
}) => {
  const isDocumentsActive = activeScreen === 'executive_dashboard';
  const isIndicatorsActive = 
    activeScreen === 'indicators_hub' || 
    activeScreen === 'yellow_risk_inspection' || 
    activeScreen === 'red_risk_inspection';
  const isAccessActive = activeScreen === 'access_management';

  return (
    <aside 
      className="fixed top-0 right-0 h-screen w-64 lg:w-72 bg-white border-l border-slate-200 z-40 flex flex-col justify-between shadow-xs select-none"
      aria-label="القائمة الجانبية الرئيسية"
    >
      {/* Top Branding & Main Navigation */}
      <div className="flex flex-col">
        {/* Brand Header - Clean logo and name only */}
        <div className="h-18 flex items-center px-6 border-b border-slate-200/90 gap-2.5">
          <div className="flex items-center justify-center shrink-0 -translate-y-0.5">
            <img 
              src="/image_3.png" 
              alt="شعار يقظة" 
              className="w-12 h-12 object-contain shrink-0 transition-transform duration-300 hover:scale-105 select-none"
            />
          </div>
          <div className="flex items-center">
            <span className="text-2xl font-black tracking-tight text-slate-900">يقظة</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2" aria-label="أقسام المنصة">

          {/* 1. سجل المستندات */}
          <button
            id="sidebar-nav-documents"
            onClick={() => setActiveScreen('executive_dashboard')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm transition-all text-right ${
              isDocumentsActive
                ? 'bg-[#2C3E28] text-white font-bold shadow-2xs'
                : 'text-slate-700 font-medium hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard 
                className={`w-5 h-5 shrink-0 ${
                  isDocumentsActive ? 'text-white' : 'text-slate-500'
                }`} 
              />
              <span>سجل المستندات</span>
            </div>
            <span 
              className={`text-[11px] font-mono px-2 py-0.5 rounded-lg ${
                isDocumentsActive 
                  ? 'bg-white/20 text-white' 
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {totalDocsCount}
            </span>
          </button>

          {/* 2. مؤشرات المستندات */}
          <button
            id="sidebar-nav-indicators"
            onClick={() => {
              if (onNavigateToIndicators) {
                onNavigateToIndicators();
              } else {
                setActiveScreen('indicators_hub');
              }
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm transition-all text-right ${
              isIndicatorsActive
                ? 'bg-[#2C3E28] text-white font-bold shadow-2xs'
                : 'text-slate-700 font-medium hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <SlidersHorizontal 
                className={`w-5 h-5 shrink-0 ${
                  isIndicatorsActive ? 'text-white' : 'text-slate-500'
                }`} 
              />
              <span>مؤشرات المستندات</span>
            </div>
            {blockedCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-lg bg-red-100 text-red-700 font-bold border border-red-200">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                <span>{blockedCount}</span>
              </span>
            )}
          </button>

          {/* 3. إدارة الحسابات والصلاحيات */}
          <button
            id="sidebar-nav-access"
            onClick={() => setActiveScreen('access_management')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm transition-all text-right ${
              isAccessActive
                ? 'bg-[#2C3E28] text-white font-bold shadow-2xs'
                : 'text-slate-700 font-medium hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck 
                className={`w-5 h-5 shrink-0 ${
                  isAccessActive ? 'text-white' : 'text-slate-500'
                }`} 
              />
              <span>إدارة الحسابات والصلاحيات</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Simplified Footer */}
      <div className="p-4 border-t border-slate-200/90 bg-slate-50/70 text-center">
        <span className="text-xs font-medium text-slate-400 select-none">
          v1.0 • منصة يقظة
        </span>
      </div>
    </aside>
  );
};
