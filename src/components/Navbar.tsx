import React from 'react';
import { ActiveScreen } from '../types';
import { 
  LayoutDashboard, 
  SlidersHorizontal
} from 'lucide-react';

interface NavbarProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  blockedCount?: number;
  reviewCount?: number;
  safeCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  setActiveScreen,
}) => {
  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand & System Identity */}
          <div className="flex items-center gap-4">
            <div 
              onClick={() => setActiveScreen('executive_dashboard')} 
              className="flex items-center gap-2.5 cursor-pointer group"
              id="brand-logo-btn"
            >
              <div className="flex items-center justify-center shrink-0 -translate-y-0.5">
                <img 
                  src="/image_3.png" 
                  alt="شعار يقظة" 
                  className="w-12 h-12 object-contain shrink-0 transition-transform duration-300 group-hover:scale-105 select-none"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-slate-900">يقظة</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Screen Navigation Tabs - Standardized Fixed-Dimension Primary Control */}
          <nav 
            className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-2xs h-13 box-border" 
            aria-label="الشاشات الرئيسية"
          >
            {/* سجل المستندات */}
            <button
              id="nav-tab-dashboard"
              onClick={() => setActiveScreen('executive_dashboard')}
              className={`flex items-center justify-center gap-2.5 px-4 h-11 min-w-[165px] rounded-xl text-sm transition-all select-none box-border ${
                activeScreen === 'executive_dashboard'
                  ? 'bg-[#2C3E28] text-white font-bold shadow-2xs'
                  : 'text-slate-700 font-medium hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard 
                className={`w-4.5 h-4.5 shrink-0 ${
                  activeScreen === 'executive_dashboard' 
                    ? 'text-white' 
                    : 'text-slate-600'
                }`} 
              />
              <span className="truncate">سجل المستندات</span>
            </button>

            {/* مؤشرات المستندات */}
            <button
              id="nav-tab-indicators"
              onClick={() => setActiveScreen('indicators_hub')}
              className={`flex items-center justify-center gap-2.5 px-4 h-11 min-w-[165px] rounded-xl text-sm transition-all select-none box-border ${
                activeScreen === 'indicators_hub' || activeScreen === 'yellow_risk_inspection' || activeScreen === 'red_risk_inspection'
                  ? 'bg-[#2C3E28] text-white font-bold shadow-2xs'
                  : 'text-slate-700 font-medium hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal 
                className={`w-4.5 h-4.5 shrink-0 ${
                  activeScreen === 'indicators_hub' || activeScreen === 'yellow_risk_inspection' || activeScreen === 'red_risk_inspection' 
                    ? 'text-white' 
                    : 'text-slate-600'
                }`} 
              />
              <span className="truncate">مؤشرات المستندات</span>
            </button>

          </nav>

        </div>
      </div>
    </header>
  );
};
