/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShieldAlert,
  KeyRound,
  CheckCircle2,
  XCircle,
  Scale,
  ArrowLeft,
  Moon,
  Sun,
  Fingerprint,
  X,
  ChevronDown,
  MoveHorizontal,
  SlidersHorizontal,
  Layers,
  LayoutGrid,
  ShieldCheck,
  Gauge,
  UserCheck
} from 'lucide-react';
import { motion, MotionConfig } from 'motion/react';
import { CURRENT_USER } from '../data/currentUser';

// Demo values for the "fill demo data" button in the demo-request form. Name, title and department
// come from the platform's current user (Dr. Fahad) so they match the platform exactly; the email
// and phone are fictional (example.com domain, placeholder number). The landing page is Arabic-only.
const DEMO_FORM_DATA = {
  name: CURRENT_USER.name.ar,
  org: CURRENT_USER.department.ar,
  role: CURRENT_USER.role.ar,
  email: 'fahd.alhudhali@example.com',
  phone: '0500000000',
};

// Official Yaqadha Brand Emblem with unified dark/light palette (#A1C89C in Dark Mode / #273E26 in Light Mode)
function YaqadhaLogo({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <div
      className={`${className} shrink-0 bg-[#273E26] dark:bg-[#A1C89C] transition-colors duration-[350ms] ease-in-out`}
      style={{
        maskImage: 'url(/landing/logo-mask.png)',
        WebkitMaskImage: 'url(/landing/logo-mask.png)',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
      role="img"
      aria-label="شعار منصة يقظة"
    />
  );
}

// Organic Multi-directional Sparkles & Soft Ambient Emerald Glow distributed across perimeter, flanks & corners
function SparklesOverlay() {
  return (
    <>
      {/* Subtle & Soft Ambient Sovereign Emerald Glow - gentle, eye-friendly, strictly behind button (z-0) */}
      <div 
        className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-500/15 via-emerald-400/20 to-teal-400/15 dark:from-[#275C2D]/25 dark:via-[#A1C89C]/20 dark:to-[#275C2D]/25 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        aria-hidden="true" 
      />

      {/* Under-button Sparkles: positioned strictly behind button (z-0), distributed across bottom perimeter, lateral flanks and corners */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-visible transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 z-0"
        aria-hidden="true"
      >
        {/* 1. Right Lateral Flank: Bursts outward to the right */}
        <span className="absolute -right-2.5 top-1/2 -translate-y-1/2 text-emerald-500 dark:text-[#A1C89C] opacity-90 animate-sparkle-1 pointer-events-none">
          <svg className="w-3.5 h-3.5 fill-current drop-shadow-[0_0_8px_rgba(16,185,129,0.85)] dark:drop-shadow-[0_0_8px_rgba(161,200,156,0.9)]" viewBox="0 0 24 24">
            <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z"/>
          </svg>
        </span>

        {/* 2. Upper Right Flank: Bursts out to right and down */}
        <span className="absolute -right-1 top-1/4 text-emerald-400 dark:text-[#86efac] opacity-85 animate-sparkle-2 pointer-events-none">
          <span className="block w-2 h-2 rounded-full bg-current shadow-[0_0_8px_rgba(16,185,129,0.9)] dark:shadow-[0_0_8px_#A1C89C]"></span>
        </span>

        {/* 3. Bottom-Right Corner: Curves outward around bottom right corner */}
        <span className="absolute -right-1.5 -bottom-1.5 text-emerald-500 dark:text-[#A1C89C] opacity-95 animate-sparkle-3 pointer-events-none">
          <svg className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(16,185,129,0.85)] dark:drop-shadow-[0_0_8px_rgba(161,200,156,0.9)]" viewBox="0 0 24 24">
            <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z"/>
          </svg>
        </span>

        {/* 4. Lower Right Rim: Descends down and right */}
        <span className="absolute right-[22%] -bottom-2 text-emerald-400 dark:text-[#86efac] opacity-90 animate-sparkle-4 pointer-events-none">
          <span className="block w-2 h-2 rounded-full bg-current shadow-[0_0_8px_rgba(16,185,129,0.85)] dark:shadow-[0_0_8px_#A1C89C]"></span>
        </span>

        {/* 5. Center Bottom: Projects straight down beneath button */}
        <span className="absolute left-1/2 -translate-x-1/2 -bottom-2.5 text-emerald-500 dark:text-[#A1C89C] opacity-90 animate-sparkle-5 pointer-events-none">
          <svg className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(16,185,129,0.85)] dark:drop-shadow-[0_0_8px_rgba(161,200,156,0.9)]" viewBox="0 0 24 24">
            <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z"/>
          </svg>
        </span>

        {/* 6. Lower Left Rim: Descends down and left */}
        <span className="absolute left-[22%] -bottom-2 text-emerald-400 dark:text-[#86efac] opacity-90 animate-sparkle-6 pointer-events-none">
          <span className="block w-2 h-2 rounded-full bg-current shadow-[0_0_8px_rgba(16,185,129,0.85)] dark:shadow-[0_0_8px_#A1C89C]"></span>
        </span>

        {/* 7. Bottom-Left Corner: Curves outward around bottom left corner */}
        <span className="absolute -left-1.5 -bottom-1.5 text-emerald-500 dark:text-[#A1C89C] opacity-95 animate-sparkle-7 pointer-events-none">
          <svg className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(16,185,129,0.85)] dark:drop-shadow-[0_0_8px_rgba(161,200,156,0.9)]" viewBox="0 0 24 24">
            <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z"/>
          </svg>
        </span>

        {/* 8. Upper Left Flank: Bursts out to left and down */}
        <span className="absolute -left-1 top-1/4 text-emerald-400 dark:text-[#86efac] opacity-85 animate-sparkle-8 pointer-events-none">
          <span className="block w-2 h-2 rounded-full bg-current shadow-[0_0_8px_rgba(16,185,129,0.9)] dark:shadow-[0_0_8px_#A1C89C]"></span>
        </span>

        {/* 9. Left Lateral Flank: Bursts outward to the left */}
        <span className="absolute -left-2.5 top-1/2 -translate-y-1/2 text-emerald-500 dark:text-[#A1C89C] opacity-90 animate-sparkle-9 pointer-events-none">
          <svg className="w-3.5 h-3.5 fill-current drop-shadow-[0_0_8px_rgba(16,185,129,0.85)] dark:drop-shadow-[0_0_8px_rgba(161,200,156,0.9)]" viewBox="0 0 24 24">
            <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z"/>
          </svg>
        </span>

        {/* 10. Accent Lower Corner Right: Fine ember accent */}
        <span className="absolute right-3 -bottom-1 text-emerald-400 dark:text-[#A1C89C] opacity-85 animate-sparkle-10 pointer-events-none">
          <span className="block w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_6px_rgba(16,185,129,0.9)] dark:shadow-[0_0_6px_#A1C89C]"></span>
        </span>

        {/* 11. Accent Lower Corner Left: Fine ember accent */}
        <span className="absolute left-3 -bottom-1 text-emerald-400 dark:text-[#A1C89C] opacity-85 animate-sparkle-11 pointer-events-none">
          <span className="block w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_6px_rgba(16,185,129,0.9)] dark:shadow-[0_0_6px_#A1C89C]"></span>
        </span>
      </div>
    </>
  );
}

// Interactive Screens Configuration for Split Slider Comparison
const DASHBOARD_SCREENS = [
  {
    id: 'documents',
    title: 'سجل المستندات',
    icon: LayoutGrid,
    darkImg: '/landing/documents-dark.png',
    lightImg: '/landing/documents-light.png',
  },
  {
    id: 'document-metrics',
    title: 'مؤشرات المستندات',
    icon: SlidersHorizontal,
    darkImg: '/landing/indicators-dark.png',
    lightImg: '/landing/indicators-light.png',
  },
  {
    id: 'accounts-permissions',
    title: 'إدارة الحسابات والصلاحيات',
    icon: ShieldCheck,
    darkImg: '/landing/access-dark.png',
    lightImg: '/landing/access-light.png',
  },
  {
    id: 'competition-risk',
    title: 'تقييم مخاطر منافسة',
    icon: Gauge,
    darkImg: '/landing/tender-risk-dark.png',
    lightImg: '/landing/tender-risk-light.png',
  }
];

const HERO_TYPING_PHRASES = [
  'النزاهة الاستباقية',
  'الرقابة اللحظية',
  'الامتثال المؤسسي',
  'الحصانة الشاملة',
] as const;

const MAIN_PLATFORM_URL = '/platform/';
const THEME_STORAGE_KEY = 'yaqadha_theme';

export default function LandingPage() {
  // Shared with the platform (/platform/) via localStorage 'yaqadha_theme'.
  // The inline script in index.html applies html.dark before first paint.
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const toggleTheme = () => {
    const next = !isDark;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      // Storage unavailable: the choice still applies for this visit
    }
    setIsDark(next);
  };
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [activeHeroCard, setActiveHeroCard] = useState(0);
  const [activeComparisonTab, setActiveComparisonTab] = useState<'yaqadha' | 'traditional'>('yaqadha');

  // Dynamic typing headline state (starts empty at load, types cleanly through the 4 phrases)
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingReady, setTypingReady] = useState(false);

  // Subtle Cyber Grid pointer tracking inside Hero section only
  const heroRef = useRef<HTMLElement>(null);
  const heroRafRef = useRef<number | null>(null);
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    org: '',
    email: '',
    phone: '',
    role: '',
  });

  // Keep <html> and <body> in sync with RTL and the active theme
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('dir', 'rtl');
    root.setAttribute('lang', 'ar');
    document.body.setAttribute('dir', 'rtl');
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Initial gentle start for Dynamic Typing Headline (respects reduced motion)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTypedText(HERO_TYPING_PHRASES[0]);
      return;
    }
    const timer = window.setTimeout(() => {
      setTypingReady(true);
    }, 360);
    return () => window.clearTimeout(timer);
  }, []);

  // Typing & deleting loop for Hero dynamic headline
  useEffect(() => {
    if (!typingReady) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const currentPhrase = HERO_TYPING_PHRASES[phraseIndex];
    let timeoutId: number;

    if (!isDeleting && typedText.length < currentPhrase.length) {
      timeoutId = window.setTimeout(() => {
        setTypedText(currentPhrase.slice(0, typedText.length + 1));
      }, 62);
    } else if (!isDeleting && typedText.length === currentPhrase.length) {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(true);
      }, 2100);
    } else if (isDeleting && typedText.length > 0) {
      timeoutId = window.setTimeout(() => {
        setTypedText(currentPhrase.slice(0, typedText.length - 1));
      }, 34);
    } else {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % HERO_TYPING_PHRASES.length);
      }, 220);
    }

    return () => window.clearTimeout(timeoutId);
  }, [typingReady, typedText, isDeleting, phraseIndex]);

  // Auto-rotate Dashboard Preview screens every 20 seconds strictly on mobile viewports (< 768px)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    if (!mq.matches) return;

    const timer = window.setInterval(() => {
      setActiveScreenIndex((prev) => (prev + 1) % DASHBOARD_SCREENS.length);
    }, 20000);

    return () => window.clearInterval(timer);
  }, [activeScreenIndex]);

  // Auto-highlight loop across the 4 Hero cards every 5 seconds strictly on mobile viewports (< 768px)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timerId: number | null = null;

    const syncInterval = () => {
      if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
      }
      if (mq.matches && !reducedMotionMq.matches) {
        timerId = window.setInterval(() => {
          setActiveHeroCard((prev) => (prev + 1) % 4);
        }, 5000);
      }
    };

    syncInterval();
    mq.addEventListener('change', syncInterval);
    return () => {
      if (timerId !== null) window.clearInterval(timerId);
      mq.removeEventListener('change', syncInterval);
    };
  }, []);

  // Clean up any pending animation frame on unmount
  useEffect(() => {
    return () => {
      if (heroRafRef.current !== null) {
        cancelAnimationFrame(heroRafRef.current);
      }
    };
  }, []);

  const handleHeroMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = (x / Math.max(rect.width, 1) - 0.5) * 10;
    const normY = (y / Math.max(rect.height, 1) - 0.5) * 8;

    if (heroRafRef.current !== null) {
      cancelAnimationFrame(heroRafRef.current);
    }
    heroRafRef.current = requestAnimationFrame(() => {
      el.style.setProperty('--hero-mx', `${x.toFixed(1)}px`);
      el.style.setProperty('--hero-my', `${y.toFixed(1)}px`);
      el.style.setProperty('--hero-px', `${(-normX).toFixed(2)}px`);
      el.style.setProperty('--hero-py', `${(-normY).toFixed(2)}px`);
    });
  }, []);

  const handleHeroMouseLeave = useCallback(() => {
    setIsHeroHovered(false);
    const el = heroRef.current;
    if (!el) return;
    el.style.setProperty('--hero-px', '0px');
    el.style.setProperty('--hero-py', '0px');
  }, []);

  const isTypingActive =
    typingReady &&
    (isDeleting || typedText.length < HERO_TYPING_PHRASES[phraseIndex].length);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    setDemoSubmitted(true);
  };

  return (
    <MotionConfig reducedMotion="user">
    <div dir="rtl" className={`min-h-screen w-full transition-colors duration-[350ms] ease-in-out ${
      isDark ? 'bg-[#0D1210] text-slate-100' : 'bg-[#F6FAF7] text-slate-900'
    } font-['IBM_Plex_Sans_Arabic']`}>
      
      {/* 1. NAVBAR (Header without English text, with icon-only toggle and rock-solid CTA button) */}
      <header className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-[350ms] ease-in-out ${
        isDark ? 'bg-[#0D1210]/95 border-emerald-950/40 text-slate-100' : 'bg-white/95 border-emerald-900/10 text-slate-900 shadow-[0_2px_16px_rgba(39,92,45,0.05)]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 h-16 md:h-20 flex items-center justify-between gap-3 md:gap-8">
          
          {/* Brand Logo & Pure Arabic Identity */}
          <a href="#" className="flex items-center gap-2.5 md:gap-3 shrink-0 focus-visible:outline-none">
            <YaqadhaLogo className="w-10 h-10 md:w-12 md:h-12" />
            <div className="flex flex-col text-right">
              <span className={`text-lg md:text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                يقظة
              </span>
              <span className={`hidden md:block text-[11px] font-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                منظومة النزاهة الاستباقية والحوكمة الرقمية
              </span>
            </div>
          </a>

          {/* Navigation Links (hidden on mobile for a clean header, unchanged on md+) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#hero" className={`transition-colors whitespace-nowrap ${isDark ? 'text-slate-300 hover:text-[#A1C89C]' : 'text-slate-700 hover:text-[#273E26]'}`}>
              نظرة عامة
            </a>
            <a href="#features" className={`transition-colors whitespace-nowrap ${isDark ? 'text-slate-300 hover:text-[#A1C89C]' : 'text-slate-700 hover:text-[#273E26]'}`}>
              المميزات
            </a>
            <a href="#dashboard-preview" className={`transition-colors whitespace-nowrap ${isDark ? 'text-slate-300 hover:text-[#A1C89C]' : 'text-slate-700 hover:text-[#273E26]'}`}>
              الواجهات
            </a>
            <a href="#comparison" className={`transition-colors whitespace-nowrap ${isDark ? 'text-slate-300 hover:text-[#A1C89C]' : 'text-slate-700 hover:text-[#273E26]'}`}>
              التقليدي مقابل يقظة
            </a>
          </nav>

          {/* Right Actions: Symmetrical Icon-Only Theme Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Theme Toggle Button: Icon Only (White Sun in Dark Mode, Deep Green Moon in Light Mode) */}
            <button
              onClick={toggleTheme}
              className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all shrink-0 cursor-pointer ${
                isDark 
                  ? 'bg-[#141B18] border-emerald-900/50 hover:border-emerald-500/50 hover:bg-[#1a2420]' 
                  : 'bg-white border-emerald-800/20 hover:border-emerald-600 hover:bg-[#F2FAF5] shadow-[0_2px_8px_rgba(39,92,45,0.06)]'
              }`}
              title={isDark ? 'التحويل إلى الوضع الفاتح' : 'التحويل إلى الوضع الداكن'}
              aria-label="تبديل مظهر الصفحة"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-[#273E26]" />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section
        ref={heroRef}
        id="hero"
        onMouseMove={handleHeroMouseMove}
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={handleHeroMouseLeave}
        className={`pt-12 pb-14 md:pt-20 md:pb-24 border-b transition-colors duration-[350ms] ease-in-out relative overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-b from-[#0D1210] via-[#111915] to-[#0D1210] border-emerald-950/40' 
            : 'bg-gradient-to-b from-[#FFFFFF] via-[#F0F7F2] to-[#F6FAF7] border-emerald-900/10'
        }`}
      >
        {/* Subtle Sovereign Cyber Grid Background (Base + Mouse-Reactive Highlight & Aura) */}
        <div className="absolute inset-0 pointer-events-none z-0 hero-cyber-grid" aria-hidden="true" />
        <div
          className={`absolute -inset-4 pointer-events-none z-0 hero-cyber-grid-active ${
            isHeroHovered ? 'opacity-100' : 'opacity-35'
          }`}
          aria-hidden="true"
        />
        <div
          className={`absolute inset-0 pointer-events-none z-0 hero-cursor-aura ${
            isHeroHovered ? 'opacity-100' : 'opacity-30'
          }`}
          aria-hidden="true"
        />

        {/* Soft Ambient Sovereign Glow */}
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[320px] rounded-full blur-[120px] pointer-events-none transition-opacity z-0 ${
          isDark ? 'bg-emerald-900/25 opacity-70' : 'bg-emerald-400/25 opacity-65'
        }`} />

        <div className="max-w-6xl mx-auto px-3 md:px-6 lg:px-8 text-center space-y-5 md:space-y-8 relative z-10">
          
          {/* Main Title - Direct, calm formula with Dynamic Typing Headline in a strictly fixed bounding box */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className={`text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.4] md:leading-[1.25] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span>
              يقظة: عهد جديد من{' '}
              <span className={isDark ? 'text-[#A1C89C]' : 'text-[#273E26]'}>
                الحوكمة الرقمية
              </span>
            </span>{' '}
            <span className="inline md:block md:mt-1">
              <span className="inline-grid align-baseline md:align-middle justify-items-center max-w-full whitespace-nowrap">
                {/* Invisible reference spacers locking exact width & height to the longest phrases */}
                <span
                  aria-hidden="true"
                  className="col-start-1 row-start-1 invisible select-none pointer-events-none inline-flex items-center justify-center px-1 md:px-2"
                >
                  <span>النزاهة الاستباقية</span>
                  <span className="inline-block w-[2px] md:w-[2.5px] lg:w-[3px] h-[0.8em] ms-2" />
                </span>
                <span
                  aria-hidden="true"
                  className="col-start-1 row-start-1 invisible select-none pointer-events-none inline-flex items-center justify-center px-1 md:px-2"
                >
                  <span>الامتثال المؤسسي</span>
                  <span className="inline-block w-[2px] md:w-[2.5px] lg:w-[3px] h-[0.8em] ms-2" />
                </span>

                {/* Live typing text strictly confined within the fixed layout box */}
                <span className="col-start-1 row-start-1 inline-flex items-center justify-center px-1 md:px-2">
                  <span>{typedText}</span>
                  <span
                    aria-hidden="true"
                    className={`inline-block w-[2px] md:w-[2.5px] lg:w-[3px] h-[0.8em] rounded-full align-middle transition-colors duration-[350ms] ease-in-out ${
                      typedText ? 'ms-2' : 'ms-0'
                    } ${
                      isDark ? 'bg-[#A1C89C]' : 'bg-[#273E26]'
                    } ${isTypingActive ? 'opacity-100' : 'animate-typing-cursor'}`}
                  />
                </span>
              </span>
            </span>
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={`text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            المنظومة الرقمية المتقدمة لكشف التجاوزات اللحظية، وتجميد المعاملات غير المصرحة آلياً قبل تمريرها، مع توثيق مشفر لكافة سلاسل الاعتماد والمنافسات الحكومية والشركات.
          </motion.p>

          {/* Action Button: Unified "طلب عرض تجريبي" */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.27, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center pt-1 md:pt-2 relative"
          >
            {/* Primary Action Button with organic perimeter sparkles on hover - isolated z-10 stacking */}
            <div className="relative group inline-flex isolate">
              <SparklesOverlay />
              <button
                onClick={() => {
                  setDemoSubmitted(false);
                  setDemoModalOpen(true);
                }}
                className={`relative z-10 px-6 py-3.5 md:px-8 md:py-4 text-sm md:text-base font-bold rounded-xl text-white transition-all active:scale-95 flex items-center gap-2.5 md:gap-3 cursor-pointer ${
                  isDark
                    ? 'bg-[#275C2D] hover:bg-[#2e6e35] shadow-[0_4px_14px_rgba(0,0,0,0.35)] hover:shadow-[0_6px_20px_rgba(39,92,45,0.25)]'
                    : 'bg-[#273E26] hover:bg-[#325031] shadow-[0_4px_14px_rgba(39,62,38,0.18)] hover:shadow-[0_6px_20px_rgba(39,62,38,0.22)]'
                }`}
              >
                <span>طلب عرض تجريبي</span>
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </motion.div>

          {/* 4 Separate Grid Cards with Enhanced Enterprise Depth & Crystal Clear Typography */}
          <div className="mt-9 md:mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 text-right">
            
            {/* Card 1: استباقية */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
            <div
              className={`card-glow h-full relative p-4 md:p-6 rounded-2xl border transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden cursor-default md:cursor-pointer ${
              isDark 
                ? 'bg-gradient-to-br from-[#16221B]/95 via-[#111915]/95 to-[#0D1310] border-[#275C2D]/50 md:hover:border-[#A1C89C]/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)]' 
                : 'bg-gradient-to-br from-white via-[#F9FCFA] to-[#EDF6F0] border-emerald-700/25 md:hover:border-emerald-600 shadow-[0_4px_20px_rgba(39,92,45,0.06)] md:hover:shadow-[0_10px_32px_rgba(39,92,45,0.16)]'
            } ${activeHeroCard === 0 ? 'hero-card-active' : ''}`}>
              <div className={`md:hidden absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                activeHeroCard === 0 ? 'opacity-100' : 'opacity-0'
              } ${isDark ? 'bg-[radial-gradient(circle_at_85%_15%,rgba(161,200,156,0.12),transparent_68%)]' : 'bg-[radial-gradient(circle_at_85%_15%,rgba(16,185,129,0.10),transparent_68%)]'}`} />
              <div className={`absolute top-0 right-0 left-0 h-[1.5px] pointer-events-none transition-opacity duration-300 ${
                isDark
                  ? activeHeroCard === 0
                    ? 'bg-gradient-to-r from-transparent via-[#A1C89C]/90 to-transparent md:via-[#A1C89C]/40'
                    : 'bg-gradient-to-r from-transparent via-[#A1C89C]/40 to-transparent'
                  : activeHeroCard === 0
                    ? 'bg-gradient-to-r from-transparent via-emerald-500/85 to-transparent md:via-emerald-600/35'
                    : 'bg-gradient-to-r from-transparent via-emerald-600/35 to-transparent'
              }`} />
              <div className="space-y-1.5 md:space-y-2 relative z-10">
                <div className={`text-lg md:text-2xl font-bold tracking-tight ${isDark ? 'text-[#A1C89C]' : 'text-[#1E3B22]'}`}>
                  استباقية
                </div>
                <div className={`text-xs md:text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  حوكمة قبل الصرف
                </div>
                <p className={`text-[11px] md:text-xs leading-relaxed ${isDark ? 'text-white' : 'text-slate-600'}`}>
                  منع تمرير الصفقات المخالفة قبل خروجها للتنفيذ
                </p>
              </div>
            </div>
            </motion.div>

            {/* Card 2: رصد لحظي */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
            <div
              className={`card-glow h-full relative p-4 md:p-6 rounded-2xl border transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden cursor-default md:cursor-pointer ${
              isDark 
                ? 'bg-gradient-to-br from-[#16221B]/95 via-[#111915]/95 to-[#0D1310] border-[#275C2D]/50 md:hover:border-[#A1C89C]/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)]' 
                : 'bg-gradient-to-br from-white via-[#F9FCFA] to-[#EDF6F0] border-emerald-700/25 md:hover:border-emerald-600 shadow-[0_4px_20px_rgba(39,92,45,0.06)] md:hover:shadow-[0_10px_32px_rgba(39,92,45,0.16)]'
            } ${activeHeroCard === 1 ? 'hero-card-active' : ''}`}>
              <div className={`md:hidden absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                activeHeroCard === 1 ? 'opacity-100' : 'opacity-0'
              } ${isDark ? 'bg-[radial-gradient(circle_at_85%_15%,rgba(161,200,156,0.12),transparent_68%)]' : 'bg-[radial-gradient(circle_at_85%_15%,rgba(16,185,129,0.10),transparent_68%)]'}`} />
              <div className={`absolute top-0 right-0 left-0 h-[1.5px] pointer-events-none transition-opacity duration-300 ${
                isDark
                  ? activeHeroCard === 1
                    ? 'bg-gradient-to-r from-transparent via-[#A1C89C]/90 to-transparent md:via-[#A1C89C]/40'
                    : 'bg-gradient-to-r from-transparent via-[#A1C89C]/40 to-transparent'
                  : activeHeroCard === 1
                    ? 'bg-gradient-to-r from-transparent via-emerald-500/85 to-transparent md:via-emerald-600/35'
                    : 'bg-gradient-to-r from-transparent via-emerald-600/35 to-transparent'
              }`} />
              <div className="space-y-1.5 md:space-y-2 relative z-10">
                <div className={`text-lg md:text-2xl font-bold tracking-tight ${isDark ? 'text-[#A1C89C]' : 'text-[#1E3B22]'}`}>
                  رصد لحظي
                </div>
                <div className={`text-xs md:text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  تجميد آلي فوري
                </div>
                <p className={`text-[11px] md:text-xs leading-relaxed ${isDark ? 'text-white' : 'text-slate-600'}`}>
                  إيقاف المعاملة فور محاولة تخطي مصفوفة التواقيع
                </p>
              </div>
            </div>
            </motion.div>

            {/* Card 3: توثيق مشفر */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
            <div
              className={`card-glow h-full relative p-4 md:p-6 rounded-2xl border transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden cursor-default md:cursor-pointer ${
              isDark 
                ? 'bg-gradient-to-br from-[#16221B]/95 via-[#111915]/95 to-[#0D1310] border-[#275C2D]/50 md:hover:border-[#A1C89C]/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)]' 
                : 'bg-gradient-to-br from-white via-[#F9FCFA] to-[#EDF6F0] border-emerald-700/25 md:hover:border-emerald-600 shadow-[0_4px_20px_rgba(39,92,45,0.06)] md:hover:shadow-[0_10px_32px_rgba(39,92,45,0.16)]'
            } ${activeHeroCard === 2 ? 'hero-card-active' : ''}`}>
              <div className={`md:hidden absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                activeHeroCard === 2 ? 'opacity-100' : 'opacity-0'
              } ${isDark ? 'bg-[radial-gradient(circle_at_85%_15%,rgba(161,200,156,0.12),transparent_68%)]' : 'bg-[radial-gradient(circle_at_85%_15%,rgba(16,185,129,0.10),transparent_68%)]'}`} />
              <div className={`absolute top-0 right-0 left-0 h-[1.5px] pointer-events-none transition-opacity duration-300 ${
                isDark
                  ? activeHeroCard === 2
                    ? 'bg-gradient-to-r from-transparent via-[#A1C89C]/90 to-transparent md:via-[#A1C89C]/40'
                    : 'bg-gradient-to-r from-transparent via-[#A1C89C]/40 to-transparent'
                  : activeHeroCard === 2
                    ? 'bg-gradient-to-r from-transparent via-emerald-500/85 to-transparent md:via-emerald-600/35'
                    : 'bg-gradient-to-r from-transparent via-emerald-600/35 to-transparent'
              }`} />
              <div className="space-y-1.5 md:space-y-2 relative z-10">
                <div className={`text-lg md:text-2xl font-bold tracking-tight ${isDark ? 'text-[#A1C89C]' : 'text-[#1E3B22]'}`}>
                  توثيق مشفر
                </div>
                <div className={`text-xs md:text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  سجل أثر رقمي
                </div>
                <p className={`text-[11px] md:text-xs leading-relaxed ${isDark ? 'text-white' : 'text-slate-600'}`}>
                  توثيق كامل غير قابل للتعديل أو الإنكار
                </p>
              </div>
            </div>
            </motion.div>

            {/* Card 4: حماية عتادية */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
            <div
              className={`card-glow h-full relative p-4 md:p-6 rounded-2xl border transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden cursor-default md:cursor-pointer ${
              isDark 
                ? 'bg-gradient-to-br from-[#16221B]/95 via-[#111915]/95 to-[#0D1310] border-[#275C2D]/50 md:hover:border-[#A1C89C]/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)]' 
                : 'bg-gradient-to-br from-white via-[#F9FCFA] to-[#EDF6F0] border-emerald-700/25 md:hover:border-emerald-600 shadow-[0_4px_20px_rgba(39,92,45,0.06)] md:hover:shadow-[0_10px_32px_rgba(39,92,45,0.16)]'
            } ${activeHeroCard === 3 ? 'hero-card-active' : ''}`}>
              <div className={`md:hidden absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                activeHeroCard === 3 ? 'opacity-100' : 'opacity-0'
              } ${isDark ? 'bg-[radial-gradient(circle_at_85%_15%,rgba(161,200,156,0.12),transparent_68%)]' : 'bg-[radial-gradient(circle_at_85%_15%,rgba(16,185,129,0.10),transparent_68%)]'}`} />
              <div className={`absolute top-0 right-0 left-0 h-[1.5px] pointer-events-none transition-opacity duration-300 ${
                isDark
                  ? activeHeroCard === 3
                    ? 'bg-gradient-to-r from-transparent via-[#A1C89C]/90 to-transparent md:via-[#A1C89C]/40'
                    : 'bg-gradient-to-r from-transparent via-[#A1C89C]/40 to-transparent'
                  : activeHeroCard === 3
                    ? 'bg-gradient-to-r from-transparent via-emerald-500/85 to-transparent md:via-emerald-600/35'
                    : 'bg-gradient-to-r from-transparent via-emerald-600/35 to-transparent'
              }`} />
              <div className="space-y-1.5 md:space-y-2 relative z-10">
                <div className={`text-lg md:text-2xl font-bold tracking-tight ${isDark ? 'text-[#A1C89C]' : 'text-[#1E3B22]'}`}>
                  حماية عتادية
                </div>
                <div className={`text-xs md:text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  مصادقة عتادية مادية
                </div>
                <p className={`text-[11px] md:text-xs leading-relaxed ${isDark ? 'text-white' : 'text-slate-600'}`}>
                  حماية الصلاحيات بمفاتيح أمان FIDO2 تمنع الانتحال
                </p>
              </div>
            </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 3. CORE FEATURES SECTION (Unified typography and green text colors) */}
      <section id="features" className={`pt-14 pb-6 md:pt-20 md:pb-28 border-b transition-colors duration-[350ms] ease-in-out ${
        isDark ? 'bg-[#0D1210] border-emerald-950/40' : 'bg-white border-slate-200/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-7 md:space-y-10">
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-3xl mx-auto space-y-2.5 md:space-y-3"
          >
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              مميزات يقظة
            </h2>
            <p className={`text-sm md:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              مميزات وتقنيات متطورة تضمن إحكام دورة المستندات والمنافسات دون ثغرات
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 md:gap-6 items-start content-start md:content-normal min-h-[415px] md:min-h-0 mb-0 md:mb-8">
            
            {/* Feature 1: الرصد والتجميد الآلي الفوري */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-auto md:h-[195px] w-full"
            >
              <div 
                onClick={() => setActiveFeature(activeFeature === 1 ? null : 1)}
                className={`group relative md:absolute md:top-0 md:right-0 md:left-0 p-4 md:p-6 rounded-2xl border transition-all duration-300 ease-out flex flex-col justify-start cursor-pointer overflow-hidden ${
                  activeFeature === 1
                    ? isDark
                      ? 'pb-3 md:pb-6 z-30 bg-gradient-to-br from-[#16221B]/95 via-[#111915]/95 to-[#0D1310] border-[#A1C89C]/80 shadow-[0_8px_32px_rgba(39,92,45,0.4)]'
                      : 'pb-3 md:pb-6 z-30 bg-gradient-to-br from-[#FFFFFF] via-[#F4FAF6] to-[#E3F4EA] border-emerald-600 shadow-[0_12px_28px_rgba(39,92,45,0.12)]'
                    : isDark 
                      ? 'z-10 bg-gradient-to-br from-[#16221B]/95 via-[#111915]/95 to-[#0D1310] border-[#275C2D]/50 hover:z-30 hover:border-[#A1C89C]/70 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_32px_rgba(39,92,45,0.3)]' 
                      : 'z-10 bg-gradient-to-br from-[#FFFFFF] via-[#F6FAF7] to-[#EDF7F1] border-emerald-700/25 hover:z-30 hover:border-emerald-500 hover:shadow-[0_8px_24px_rgba(39,92,45,0.10)] shadow-xs'
                }`}
              >
                <div className={`absolute top-0 right-0 left-0 h-[1.5px] pointer-events-none ${isDark ? 'bg-gradient-to-r from-transparent via-[#A1C89C]/40 to-transparent' : 'bg-gradient-to-r from-transparent via-emerald-600/30 to-transparent'}`} />
                <div className="flex items-center gap-3.5 md:block md:space-y-4 relative z-10">
                  <div className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl flex items-center justify-center border transition-all ${
                    isDark 
                      ? 'bg-rose-950/60 border-rose-800/40 text-rose-400' 
                      : 'bg-gradient-to-br from-rose-100 via-rose-50 to-rose-100/70 border-rose-300 text-rose-700 shadow-[0_2px_10px_rgba(225,29,72,0.15)]'
                  }`}>
                    <ShieldAlert className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  
                  {/* Stable Title: does NOT turn green on hover */}
                  <h3 className={`text-sm md:text-base leading-snug md:leading-normal font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    01. الرصد والتجميد الآلي الفوري
                  </h3>
                  <ChevronDown className={`w-4 h-4 shrink-0 ms-auto md:hidden transition-transform duration-300 ${
                    activeFeature === 1
                      ? `rotate-180 ${isDark ? 'text-[#A1C89C]' : 'text-[#273E26]'}`
                      : isDark ? 'text-slate-400' : 'text-emerald-800/60'
                  }`} />
                </div>

                {/* Hover & Tap Expandable Detailed Text */}
                <div className={`grid transition-all duration-300 ease-out relative z-10 ${
                  activeFeature === 1 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100'
                }`}>
                  <div className="overflow-hidden">
                    <p className={`pt-2.5 md:pt-4 text-xs leading-relaxed border-t mt-2.5 md:mt-4 ${
                      isDark ? 'border-[#275C2D]/40 text-slate-200' : 'border-emerald-800/15 text-slate-600'
                    }`}>
                      بمجرد رصد محاولة اعتماد بتوقيع منفرد أو تخطٍ لسلسلة الاعتمادات، يقوم النظام آليًا بتجميد الوثيقة فورًا وسحب صلاحية النشر لمنع أي صرف مالي غير معتمد.
                    </p>
                  </div>
                </div>

                {/* Subtle Interactive Expand Indicator (hidden on mobile, preserved on md+) */}
                <div className="hidden md:flex items-center justify-between pt-4 mt-auto relative z-10">
                  <span className={`text-[11px] font-medium transition-colors ${
                    isDark ? 'text-slate-400 group-hover:text-[#A1C89C]' : 'text-emerald-800/70 group-hover:text-[#273E26]'
                  }`}>
                    {activeFeature === 1 ? 'إخفاء التفاصيل' : 'التفاصيل'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                    activeFeature === 1 ? 'rotate-180 text-[#A1C89C]' : 'group-hover:rotate-180 text-emerald-800/60 dark:text-slate-400'
                  }`} />
                </div>
              </div>
            </motion.div>

            {/* Feature 2: سجل الأثر والتوثيق المشفر */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-auto md:h-[195px] w-full"
            >
              <div 
                onClick={() => setActiveFeature(activeFeature === 2 ? null : 2)}
                className={`group relative md:absolute md:top-0 md:right-0 md:left-0 p-4 md:p-6 rounded-2xl border transition-all duration-300 ease-out flex flex-col justify-start cursor-pointer overflow-hidden ${
                  activeFeature === 2
                    ? isDark
                      ? 'pb-3 md:pb-6 z-30 bg-gradient-to-br from-[#16221B]/95 via-[#111915]/95 to-[#0D1310] border-[#A1C89C]/80 shadow-[0_8px_32px_rgba(39,92,45,0.4)]'
                      : 'pb-3 md:pb-6 z-30 bg-gradient-to-br from-[#FFFFFF] via-[#F4FAF6] to-[#E3F4EA] border-emerald-600 shadow-[0_12px_28px_rgba(39,92,45,0.12)]'
                    : isDark 
                      ? 'z-10 bg-gradient-to-br from-[#16221B]/95 via-[#111915]/95 to-[#0D1310] border-[#275C2D]/50 hover:z-30 hover:border-[#A1C89C]/70 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_32px_rgba(39,92,45,0.3)]' 
                      : 'z-10 bg-gradient-to-br from-[#FFFFFF] via-[#F6FAF7] to-[#EDF7F1] border-emerald-700/25 hover:z-30 hover:border-emerald-500 hover:shadow-[0_8px_24px_rgba(39,92,45,0.10)] shadow-xs'
                }`}
              >
                <div className={`absolute top-0 right-0 left-0 h-[1.5px] pointer-events-none ${isDark ? 'bg-gradient-to-r from-transparent via-[#A1C89C]/40 to-transparent' : 'bg-gradient-to-r from-transparent via-emerald-600/30 to-transparent'}`} />
                <div className="flex items-center gap-3.5 md:block md:space-y-4 relative z-10">
                  <div className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl flex items-center justify-center border transition-all ${
                    isDark 
                      ? 'bg-emerald-950/60 border-emerald-800/40 text-[#A1C89C]' 
                      : 'bg-gradient-to-br from-emerald-100 via-emerald-50 to-emerald-100/70 border-emerald-300 text-emerald-800 shadow-[0_2px_10px_rgba(16,185,129,0.18)]'
                  }`}>
                    <Fingerprint className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  
                  {/* Stable Title: does NOT turn green on hover */}
                  <h3 className={`text-sm md:text-base leading-snug md:leading-normal font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    02. سجل الأثر والتوثيق المشفر
                  </h3>
                  <ChevronDown className={`w-4 h-4 shrink-0 ms-auto md:hidden transition-transform duration-300 ${
                    activeFeature === 2
                      ? `rotate-180 ${isDark ? 'text-[#A1C89C]' : 'text-[#273E26]'}`
                      : isDark ? 'text-slate-400' : 'text-emerald-800/60'
                  }`} />
                </div>

                {/* Hover & Tap Expandable Detailed Text */}
                <div className={`grid transition-all duration-300 ease-out relative z-10 ${
                  activeFeature === 2 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100'
                }`}>
                  <div className="overflow-hidden">
                    <p className={`pt-2.5 md:pt-4 text-xs leading-relaxed border-t mt-2.5 md:mt-4 ${
                      isDark ? 'border-[#275C2D]/40 text-slate-200' : 'border-emerald-800/15 text-slate-600'
                    }`}>
                      توثيق دقيق لكل عملية اطلاع أو توقيع أو تخطٍ لسلسلة الصلاحيات مع وسم فوري للوثائق المحظورة بختم رقمي مشفر يمنح جهتك دليلاً قطعياً أمام الجهات الرقابية.
                    </p>
                  </div>
                </div>

                {/* Subtle Interactive Expand Indicator (hidden on mobile, preserved on md+) */}
                <div className="hidden md:flex items-center justify-between pt-4 mt-auto relative z-10">
                  <span className={`text-[11px] font-medium transition-colors ${
                    isDark ? 'text-slate-400 group-hover:text-[#A1C89C]' : 'text-emerald-800/70 group-hover:text-[#273E26]'
                  }`}>
                    {activeFeature === 2 ? 'إخفاء التفاصيل' : 'التفاصيل'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                    activeFeature === 2 ? 'rotate-180 text-[#A1C89C]' : 'group-hover:rotate-180 text-emerald-800/60 dark:text-slate-400'
                  }`} />
                </div>
              </div>
            </motion.div>

            {/* Feature 3: الحماية والمصادقة العتادية */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-auto md:h-[195px] w-full"
            >
              <div 
                onClick={() => setActiveFeature(activeFeature === 3 ? null : 3)}
                className={`group relative md:absolute md:top-0 md:right-0 md:left-0 p-4 md:p-6 rounded-2xl border transition-all duration-300 ease-out flex flex-col justify-start cursor-pointer overflow-hidden ${
                  activeFeature === 3
                    ? isDark
                      ? 'pb-3 md:pb-6 z-30 bg-gradient-to-br from-[#16221B]/95 via-[#111915]/95 to-[#0D1310] border-[#A1C89C]/80 shadow-[0_8px_32px_rgba(39,92,45,0.4)]'
                      : 'pb-3 md:pb-6 z-30 bg-gradient-to-br from-[#FFFFFF] via-[#F4FAF6] to-[#E3F4EA] border-emerald-600 shadow-[0_12px_28px_rgba(39,92,45,0.12)]'
                    : isDark 
                      ? 'z-10 bg-gradient-to-br from-[#16221B]/95 via-[#111915]/95 to-[#0D1310] border-[#275C2D]/50 hover:z-30 hover:border-[#A1C89C]/70 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_32px_rgba(39,92,45,0.3)]' 
                      : 'z-10 bg-gradient-to-br from-[#FFFFFF] via-[#F6FAF7] to-[#EDF7F1] border-emerald-700/25 hover:z-30 hover:border-emerald-500 hover:shadow-[0_8px_24px_rgba(39,92,45,0.10)] shadow-xs'
                }`}
              >
                <div className={`absolute top-0 right-0 left-0 h-[1.5px] pointer-events-none ${isDark ? 'bg-gradient-to-r from-transparent via-[#A1C89C]/40 to-transparent' : 'bg-gradient-to-r from-transparent via-emerald-600/30 to-transparent'}`} />
                <div className="flex items-center gap-3.5 md:block md:space-y-4 relative z-10">
                  <div className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl flex items-center justify-center border transition-all ${
                    isDark 
                      ? 'bg-cyan-950/60 border-cyan-800/40 text-cyan-400' 
                      : 'bg-gradient-to-br from-sky-100 via-sky-50 to-sky-100/70 border-sky-300 text-sky-800 shadow-[0_2px_10px_rgba(2,132,199,0.16)]'
                  }`}>
                    <KeyRound className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  
                  {/* Stable Title: does NOT turn green on hover */}
                  <h3 className={`text-sm md:text-base leading-snug md:leading-normal font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    03. الحماية والمصادقة العتادية
                  </h3>
                  <ChevronDown className={`w-4 h-4 shrink-0 ms-auto md:hidden transition-transform duration-300 ${
                    activeFeature === 3
                      ? `rotate-180 ${isDark ? 'text-[#A1C89C]' : 'text-[#273E26]'}`
                      : isDark ? 'text-slate-400' : 'text-emerald-800/60'
                  }`} />
                </div>

                {/* Hover & Tap Expandable Detailed Text */}
                <div className={`grid transition-all duration-300 ease-out relative z-10 ${
                  activeFeature === 3 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100'
                }`}>
                  <div className="overflow-hidden">
                    <p className={`pt-2.5 md:pt-4 text-xs leading-relaxed border-t mt-2.5 md:mt-4 ${
                      isDark ? 'border-[#275C2D]/40 text-slate-200' : 'border-emerald-800/15 text-slate-600'
                    }`}>
                      حصر الصلاحيات الحساسة برموز أمان مادية غير قابلة للنسخ أو المشاركة، مع تجميد فوري وتقييد لحساب أي مسؤول يرصد له نشاط غير مصرح به تلقائياً.
                    </p>
                  </div>
                </div>

                {/* Subtle Interactive Expand Indicator (hidden on mobile, preserved on md+) */}
                <div className="hidden md:flex items-center justify-between pt-4 mt-auto relative z-10">
                  <span className={`text-[11px] font-medium transition-colors ${
                    isDark ? 'text-slate-400 group-hover:text-[#A1C89C]' : 'text-emerald-800/70 group-hover:text-[#273E26]'
                  }`}>
                    {activeFeature === 3 ? 'إخفاء التفاصيل' : 'التفاصيل'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                    activeFeature === 3 ? 'rotate-180 text-[#A1C89C]' : 'group-hover:rotate-180 text-emerald-800/60 dark:text-slate-400'
                  }`} />
                </div>
              </div>
            </motion.div>

            {/* Feature 4: ذكاء وفحص مخاطر المنافسات */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-auto md:h-[195px] w-full"
            >
              <div 
                onClick={() => setActiveFeature(activeFeature === 4 ? null : 4)}
                className={`group relative md:absolute md:top-0 md:right-0 md:left-0 p-4 md:p-6 rounded-2xl border transition-all duration-300 ease-out flex flex-col justify-start cursor-pointer overflow-hidden ${
                  activeFeature === 4
                    ? isDark
                      ? 'pb-3 md:pb-6 z-30 bg-gradient-to-br from-[#16221B]/95 via-[#111915]/95 to-[#0D1310] border-[#A1C89C]/80 shadow-[0_8px_32px_rgba(39,92,45,0.4)]'
                      : 'pb-3 md:pb-6 z-30 bg-gradient-to-br from-[#FFFFFF] via-[#F4FAF6] to-[#E3F4EA] border-emerald-600 shadow-[0_12px_28px_rgba(39,92,45,0.12)]'
                    : isDark 
                      ? 'z-10 bg-gradient-to-br from-[#16221B]/95 via-[#111915]/95 to-[#0D1310] border-[#275C2D]/50 hover:z-30 hover:border-[#A1C89C]/70 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_32px_rgba(39,92,45,0.3)]' 
                      : 'z-10 bg-gradient-to-br from-[#FFFFFF] via-[#F6FAF7] to-[#EDF7F1] border-emerald-700/25 hover:z-30 hover:border-emerald-500 hover:shadow-[0_8px_24px_rgba(39,92,45,0.10)] shadow-xs'
                }`}
              >
                <div className={`absolute top-0 right-0 left-0 h-[1.5px] pointer-events-none ${isDark ? 'bg-gradient-to-r from-transparent via-[#A1C89C]/40 to-transparent' : 'bg-gradient-to-r from-transparent via-emerald-600/30 to-transparent'}`} />
                <div className="flex items-center gap-3.5 md:block md:space-y-4 relative z-10">
                  <div className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl flex items-center justify-center border transition-all ${
                    isDark 
                      ? 'bg-amber-950/60 border-amber-800/40 text-amber-400' 
                      : 'bg-gradient-to-br from-amber-100 via-amber-50 to-amber-100/70 border-amber-300 text-amber-800 shadow-[0_2px_10px_rgba(217,119,6,0.18)]'
                  }`}>
                    <Scale className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  
                  {/* Stable Title: does NOT turn green on hover */}
                  <h3 className={`text-sm md:text-base leading-snug md:leading-normal font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    04. ذكاء وفحص مخاطر المنافسات
                  </h3>
                  <ChevronDown className={`w-4 h-4 shrink-0 ms-auto md:hidden transition-transform duration-300 ${
                    activeFeature === 4
                      ? `rotate-180 ${isDark ? 'text-[#A1C89C]' : 'text-[#273E26]'}`
                      : isDark ? 'text-slate-400' : 'text-emerald-800/60'
                  }`} />
                </div>

                {/* Hover & Tap Expandable Detailed Text */}
                <div className={`grid transition-all duration-300 ease-out relative z-10 ${
                  activeFeature === 4 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100'
                }`}>
                  <div className="overflow-hidden">
                    <p className={`pt-2.5 md:pt-4 text-xs leading-relaxed border-t mt-2.5 md:mt-4 ${
                      isDark ? 'border-[#275C2D]/40 text-slate-200' : 'border-emerald-800/15 text-slate-600'
                    }`}>
                      خوارزميات فحص متقدمة لعروض المنافسات والمشتريات لكشف شبهات التواطؤ، انخفاض أعداد المتنافسين المصطنع، وتركز الترسيات غير المبرر.
                    </p>
                  </div>
                </div>

                {/* Subtle Interactive Expand Indicator (hidden on mobile, preserved on md+) */}
                <div className="hidden md:flex items-center justify-between pt-4 mt-auto relative z-10">
                  <span className={`text-[11px] font-medium transition-colors ${
                    isDark ? 'text-slate-400 group-hover:text-[#A1C89C]' : 'text-emerald-800/70 group-hover:text-[#273E26]'
                  }`}>
                    {activeFeature === 4 ? 'إخفاء التفاصيل' : 'التفاصيل'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                    activeFeature === 4 ? 'rotate-180 text-[#A1C89C]' : 'group-hover:rotate-180 text-emerald-800/60 dark:text-slate-400'
                  }`} />
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 3.5. INTERACTIVE DASHBOARD COMPARISON SLIDER (واجهات المنظومة الحقيقية - مقارنة انزلاقية تفاعلية بين الوضع الداكن والفاتح) */}
      <section id="dashboard-preview" className={`py-14 md:py-24 border-b transition-colors duration-[350ms] ease-in-out relative overflow-hidden ${
        isDark ? 'bg-[#0D1210] border-emerald-950/40' : 'bg-gradient-to-b from-[#FFFFFF] via-[#F3FAF5] to-[#FFFFFF] border-emerald-900/10'
      }`}>
        {/* Soft Background Radial Glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] rounded-full blur-[140px] pointer-events-none transition-opacity ${
          isDark ? 'bg-emerald-900/15 opacity-60' : 'bg-emerald-400/20 opacity-45'
        }`} />

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-6 md:space-y-10 relative z-10">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-3xl mx-auto space-y-2.5 md:space-y-3"
          >
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              واجهات يقظة
            </h2>
            <p className={`text-sm md:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              قارن تفاعليًا بين الوضع الداكن والوضع الفاتح، واطلع على الشاشات التشغيلية لمنظومة يقظة.
            </p>
          </motion.div>

          {/* Screen Selection Tabs (Hidden on mobile for clean auto-rotating view; 4 Clean Tab Boxes on md+) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:grid md:grid-cols-4 gap-3.5 max-w-5xl mx-auto"
          >
            {DASHBOARD_SCREENS.map((screen, idx) => {
              const ScreenIcon = screen.icon;
              const isActive = activeScreenIndex === idx;
              return (
                <button
                  key={screen.id}
                  onClick={() => setActiveScreenIndex(idx)}
                  className={`px-3 py-3.5 rounded-xl border text-center transition-colors duration-[350ms] ease-in-out flex items-center justify-center gap-2.5 relative cursor-pointer ${
                    isActive
                      ? isDark
                        ? 'bg-gradient-to-br from-[#16221B] via-[#111915] to-[#0D1310] border-[#A1C89C] text-white shadow-[0_0_24px_rgba(161,200,156,0.3)] ring-1 ring-[#A1C89C]/30'
                        : 'bg-gradient-to-br from-white to-[#EAF6EF] border-[#273E26] text-[#1E3B22] shadow-[0_4px_16px_rgba(39,62,38,0.12)] ring-1 ring-[#273E26]/25'
                      : isDark
                        ? 'bg-[#111915]/90 border-[#275C2D]/50 text-slate-300'
                        : 'bg-white/95 border-emerald-900/15 text-slate-700 hover:border-emerald-600/40 hover:bg-[#F3FAF5] shadow-xs'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    isActive
                      ? isDark
                        ? 'bg-[#15211B] text-[#A1C89C] border-[#A1C89C]/60'
                        : 'bg-emerald-100 text-[#273E26] border-emerald-300'
                      : isDark
                        ? 'bg-[#131A17] text-slate-400 border-[#275C2D]/40'
                        : 'bg-[#EDF7F1] text-emerald-800 border-emerald-200/80'
                  }`}>
                    <ScreenIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold truncate">
                    {screen.title}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Interactive Split Comparison Frame - Calm and stable without hover effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`max-w-5xl mx-auto rounded-2xl border overflow-hidden shadow-2xl transition-colors duration-[350ms] ease-in-out ${
              isDark 
                ? 'bg-gradient-to-b from-[#131D18] to-[#0D1310] border-[#275C2D]/60 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(39,92,45,0.15)]' 
                : 'bg-white border-emerald-800/25 shadow-[0_20px_50px_rgba(39,62,38,0.14)]'
            }`}
          >
            
            {/* Window Top Bar with 3 Quick Ratio Presets (clean centered screen title only on mobile) */}
            <div className={`px-4 py-2.5 md:px-5 md:py-3 border-b flex items-center justify-between gap-2 text-xs transition-colors duration-[350ms] ease-in-out ${
              isDark ? 'bg-[#131D18] border-[#275C2D]/40 text-slate-300' : 'bg-[#F2F8F4] border-emerald-900/10 text-slate-700'
            }`}>
              {/* Traffic Light Dots (desktop/tablet) & Active Screen Name (mobile) */}
              <div className="hidden md:flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              </div>
              <div className={`flex md:hidden items-center justify-center w-full gap-2 text-xs font-bold truncate ${
                isDark ? 'text-[#A1C89C]' : 'text-[#273E26]'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                <span className="truncate">{DASHBOARD_SCREENS[activeScreenIndex].title}</span>
              </div>

              {/* Quick Ratio Presets (Desktop & Tablet only; removed on mobile for clean uncluttered UI) */}
              <div className="hidden md:flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setSliderPos(0)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer ${
                    sliderPos === 0
                      ? isDark
                        ? 'bg-emerald-950 text-[#A1C89C] border-emerald-700'
                        : 'bg-[#273E26] text-white border-[#273E26]'
                      : isDark
                        ? 'bg-[#16221C] text-slate-400 border-emerald-950'
                        : 'bg-white text-emerald-950 border-emerald-800/20 hover:border-emerald-600 hover:bg-[#EBF5EF]'
                  }`}
                >
                  100% داكن
                </button>
                <button
                  type="button"
                  onClick={() => setSliderPos(50)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer ${
                    sliderPos === 50
                      ? isDark
                        ? 'bg-emerald-950 text-[#A1C89C] border-emerald-700'
                        : 'bg-[#273E26] text-white border-[#273E26]'
                      : isDark
                        ? 'bg-[#16221C] text-slate-400 border-emerald-950'
                        : 'bg-white text-emerald-950 border-emerald-800/20 hover:border-emerald-600 hover:bg-[#EBF5EF]'
                  }`}
                >
                  50 / 50 مقارنة
                </button>
                <button
                  type="button"
                  onClick={() => setSliderPos(100)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer ${
                    sliderPos === 100
                      ? isDark
                        ? 'bg-emerald-950 text-[#A1C89C] border-emerald-700'
                        : 'bg-[#273E26] text-white border-[#273E26]'
                      : isDark
                        ? 'bg-[#16221C] text-slate-400 border-emerald-950'
                        : 'bg-white text-emerald-950 border-emerald-800/20 hover:border-emerald-600 hover:bg-[#EBF5EF]'
                  }`}
                >
                  100% فاتح
                </button>
              </div>
            </div>

            {/* Split Comparison Image Canvas (dir="ltr" ensures direct natural left-to-right tracking) */}
            <div 
              dir="ltr"
              className="relative aspect-[16/10] sm:aspect-[16/9.5] w-full overflow-hidden bg-slate-950 select-none group"
            >
              
              {/* BASE LAYER: Dark Mode Screenshot (Always Full Width at base) */}
              <img
                src={DASHBOARD_SCREENS[activeScreenIndex].darkImg}
                alt={`${DASHBOARD_SCREENS[activeScreenIndex].title} - الوضع الداكن`}
                className="absolute inset-0 w-full h-full object-cover object-top select-none pointer-events-none"
              />

              {/* CLIPPED OVERLAY LAYER: Light Mode Screenshot (Clipped horizontally based on sliderPos) */}
              <div 
                className="absolute inset-0 overflow-hidden pointer-events-none select-none transition-none"
                style={{
                  clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`
                }}
              >
                <img
                  src={DASHBOARD_SCREENS[activeScreenIndex].lightImg}
                  alt={`${DASHBOARD_SCREENS[activeScreenIndex].title} - الوضع الفاتح`}
                  className="absolute inset-0 w-full h-full object-cover object-top select-none pointer-events-none"
                />
              </div>

              {/* Divider Line and Handle - Matching Active Border Color #A1C89C */}
              <div 
                className="absolute top-0 bottom-0 z-20 pointer-events-none -translate-x-1/2"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-[3px] h-full bg-[#A1C89C] shadow-[0_0_16px_rgba(161,200,156,0.9)] relative">
                  {/* Central Draggable Knob */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-[#0D1210] border-2 border-[#A1C89C] text-[#A1C89C] flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.8),0_0_12px_rgba(161,200,156,0.3)] transition-transform group-hover:scale-105">
                    <MoveHorizontal className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Natural Range Input (dir="ltr" gives intuitive, responsive 1:1 motion with mouse/touch) */}
              <input
                type="range"
                dir="ltr"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 m-0 p-0"
                aria-label="شريط مقارنة الشاشات التفاعلي"
              />
            </div>

          </motion.div>

          {/* Mobile-only interactive pagination dots for auto-rotating screens */}
          <div className="flex md:hidden items-center justify-center gap-2">
            {DASHBOARD_SCREENS.map((screen, idx) => (
              <button
                key={screen.id}
                type="button"
                onClick={() => setActiveScreenIndex(idx)}
                aria-label={screen.title}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeScreenIndex === idx
                    ? isDark
                      ? 'w-6 bg-[#A1C89C]'
                      : 'w-6 bg-[#273E26]'
                    : isDark
                      ? 'w-2 bg-emerald-900/60'
                      : 'w-2 bg-emerald-800/25'
                }`}
              />
            ))}
          </div>

          {/* Clean Text Hint Directly Below the Preview Window */}
          <p className={`text-center text-xs font-medium tracking-wide flex items-center justify-center gap-2 ${
            isDark ? 'text-slate-400' : 'text-emerald-800/80 font-medium'
          }`}>
            <span>💡</span>
            <span>اسحب السهم يمينًا ويسارًا للمقارنة</span>
          </p>

        </div>
      </section>

      {/* 4. UPDATED COMPARISON SECTION (الرقابة التقليدية مقابل منصة يقظة - مع عكس الأماكن وتطبيق الألوان الدقيقة) */}
      <section id="comparison" className={`py-14 md:py-24 border-b transition-colors duration-[350ms] ease-in-out ${
        isDark ? 'bg-[#0D1210] border-emerald-950/40' : 'bg-white border-slate-200/80'
      }`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 space-y-6 md:space-y-12">
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-3xl mx-auto space-y-2.5 md:space-y-3"
          >
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              التقليدي مقابل يقظة
            </h2>
            <p className={`text-sm md:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              تحول استراتيجي كامل من معالجة واكتشاف الأضرار مستقبلًا، إلى تحصين القرارات لحظة اتخاذها:
            </p>
          </motion.div>

          {/* Mobile-only Segmented Tabs Toggle (< 768px) */}
          <div
            role="tablist"
            aria-label="المقارنة بين منصة يقظة والرقابة التقليدية"
            className={`grid md:hidden grid-cols-2 gap-1.5 p-1.5 rounded-2xl border ${
              isDark
                ? 'bg-[#121A16] border-[#275C2D]/40 shadow-[0_4px_16px_rgba(0,0,0,0.4)]'
                : 'bg-[#F3F8F5] border-emerald-700/15 shadow-xs'
            }`}
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeComparisonTab === 'yaqadha'}
              onClick={() => setActiveComparisonTab('yaqadha')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeComparisonTab === 'yaqadha'
                  ? isDark
                    ? 'bg-[#1D3024] text-[#A1C89C] border border-[#275C2D]/80 shadow-xs'
                    : 'bg-white text-[#1E3B22] border border-emerald-600/35 shadow-[0_2px_10px_rgba(39,92,45,0.10)]'
                  : isDark
                    ? 'text-slate-400 border border-transparent hover:text-slate-200'
                    : 'text-slate-600 border border-transparent hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${
                activeComparisonTab === 'yaqadha'
                  ? isDark ? 'text-[#A1C89C]' : 'text-[#273E26]'
                  : 'opacity-65'
              }`} />
              <span>منصة يقظة</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeComparisonTab === 'traditional'}
              onClick={() => setActiveComparisonTab('traditional')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeComparisonTab === 'traditional'
                  ? isDark
                    ? 'bg-[#281619] text-[#FFA0A3] border border-[#642227] shadow-xs'
                    : 'bg-white text-rose-800 border border-rose-300 shadow-[0_2px_10px_rgba(225,29,72,0.10)]'
                  : isDark
                    ? 'text-slate-400 border border-transparent hover:text-slate-200'
                    : 'text-slate-600 border border-transparent hover:text-slate-900'
              }`}
            >
              <XCircle className={`w-3.5 h-3.5 shrink-0 ${
                activeComparisonTab === 'traditional'
                  ? isDark ? 'text-[#FFA0A3]' : 'text-rose-600'
                  : 'opacity-65'
              }`} />
              <span>الرقابة التقليدية</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 items-stretch">
            
            {/* RIGHT SIDE (الجهة اليمنى في RTL): النزاهة الاستباقية مع يقظة */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`col-start-1 row-start-1 md:col-start-auto md:row-start-auto flex ${
                activeComparisonTab === 'yaqadha'
                  ? 'z-10 pointer-events-auto md:z-auto'
                  : 'z-0 pointer-events-none md:z-auto md:pointer-events-auto'
              }`}
            >
              <div className={`w-full relative p-5 md:p-8 rounded-2xl border transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden ${
                activeComparisonTab === 'yaqadha'
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-1.5 md:opacity-100 md:translate-y-0'
              } ${
                isDark 
                  ? 'bg-gradient-to-br from-[#16221B]/95 via-[#111915]/95 to-[#0D1310] border-[#275C2D]/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]' 
                  : 'bg-gradient-to-br from-[#FFFFFF] via-[#F3FAF5] to-[#E4F4EA] border-emerald-600/35 shadow-[0_4px_24px_rgba(39,92,45,0.08)]'
              }`}>
              <div className={`absolute top-0 right-0 left-0 h-[1.5px] pointer-events-none ${isDark ? 'bg-gradient-to-r from-transparent via-[#A1C89C]/40 to-transparent' : 'bg-gradient-to-r from-transparent via-emerald-600/35 to-transparent'}`} />
              <div className="space-y-5 md:space-y-6 relative z-10">
                <div className={`pb-4 border-b flex items-center justify-between gap-2 flex-wrap ${
                  isDark ? 'border-[#275C2D]/50' : 'border-emerald-600/20'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${isDark ? 'text-[#A1C89C]' : 'text-[#273E26]'}`} />
                    <span className={`font-bold text-base md:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      النزاهة الاستباقية مع يقظة
                    </span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${
                    isDark 
                      ? 'bg-[#15231B] text-[#A1C89C] border-[#275C2D]/60' 
                      : 'bg-[#DCF2E4] text-[#1E3B22] border-emerald-500/40'
                  }`}>
                    لحظياً وقبل التنفيذ
                  </span>
                </div>

                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <span className={`font-bold text-sm shrink-0 mt-0.5 ${isDark ? 'text-[#A1C89C]' : 'text-[#273E26]'}`}>✓</span>
                    <div>
                      <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-[#1E3B22]'}`}>
                        تجميد آلي فوري يمنع خروج الوثيقة
                      </h4>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-white' : 'text-slate-600'}`}>
                        منع إصدار تصريح النشر أو تداول أي وثيقة لم تستوفِ كافة التواقيع الإلزامية بنسبة 100%.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className={`font-bold text-sm shrink-0 mt-0.5 ${isDark ? 'text-[#A1C89C]' : 'text-[#273E26]'}`}>✓</span>
                    <div>
                      <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-[#1E3B22]'}`}>
                        حظر الصرف والتنفيذ المالي مسبقاً
                      </h4>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-white' : 'text-slate-600'}`}>
                        توفير الحماية المسبقة لأموال المنشأة وميزانياتها المعتمدة قبل حدوث أي التزام تعاقدي مخالف.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className={`font-bold text-sm shrink-0 mt-0.5 ${isDark ? 'text-[#A1C89C]' : 'text-[#273E26]'}`}>✓</span>
                    <div>
                      <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-[#1E3B22]'}`}>
                        مصادقة عتادية بمفاتيح Hardware Tokens
                      </h4>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-white' : 'text-slate-600'}`}>
                        إلزام المفوضين بمفاتيح أمان مادية لا تقبل النسخ، مع تقييد فوري وتلقائي للحساب عند الاشتباه.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className={`font-bold text-sm shrink-0 mt-0.5 ${isDark ? 'text-[#A1C89C]' : 'text-[#273E26]'}`}>✓</span>
                    <div>
                      <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-[#1E3B22]'}`}>
                        سجل أثر رقمي مشفر يمنح حصانة قانونية
                      </h4>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-white' : 'text-slate-600'}`}>
                        تسجيل زمني قطعي لكافة محاولات الاطلاع والتوقيع يضمن الشفافية الكاملة أمام الجهات الرقابية وهيئة النزاهة.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className={`p-4 rounded-xl text-xs mt-6 border font-medium relative z-10 ${
                isDark 
                  ? 'bg-[#15231B] border-[#275C2D]/60 text-white' 
                  : 'bg-gradient-to-r from-[#E7F6ED] to-[#DBF1E3] border-emerald-600/30 text-[#1E3B22] font-semibold'
              }`}>
                النتيجة: صفر تجاوزات نافذة، حماية مطلقة لأصحاب القرار، وامتثال مؤسسي استباقي 100%.
              </div>
              </div>
            </motion.div>

            {/* LEFT SIDE (الجهة اليسرى في RTL): الرقابة التقليدية اللاحقة */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className={`col-start-1 row-start-1 md:col-start-auto md:row-start-auto flex ${
                activeComparisonTab === 'traditional'
                  ? 'z-10 pointer-events-auto md:z-auto'
                  : 'z-0 pointer-events-none md:z-auto md:pointer-events-auto'
              }`}
            >
              <div className={`w-full relative p-5 md:p-8 rounded-2xl border transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden ${
                activeComparisonTab === 'traditional'
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-1.5 md:opacity-100 md:translate-y-0'
              } ${
                isDark 
                  ? 'bg-gradient-to-br from-[#181113]/95 via-[#130E10]/95 to-[#0E0A0B] border-[#4A1D20]/60 shadow-[0_4px_20px_rgba(0,0,0,0.5)]' 
                  : 'bg-gradient-to-br from-[#FFFFFF] via-[#FDF3F3] to-[#FCE8E8] border-rose-300/75 shadow-[0_4px_24px_rgba(225,29,72,0.06)]'
              }`}>
              <div className={`absolute top-0 right-0 left-0 h-[1.5px] pointer-events-none ${isDark ? 'bg-gradient-to-r from-transparent via-rose-500/30 to-transparent' : 'bg-gradient-to-r from-transparent via-rose-400/30 to-transparent'}`} />
              <div className="space-y-5 md:space-y-6 relative z-10">
                <div className={`pb-4 border-b flex items-center justify-between gap-2 flex-wrap ${
                  isDark ? 'border-[#4A1D20]/50' : 'border-rose-200/80'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <XCircle className={`w-5 h-5 shrink-0 ${isDark ? 'text-[#FFA0A3]' : 'text-rose-600'}`} />
                    <span className={`font-bold text-base md:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      الرقابة التقليدية اللاحقة
                    </span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${
                    isDark 
                      ? 'bg-[#221719] text-[#FFA0A3] border-[#642227]' 
                      : 'bg-[#FCE5E5] text-rose-800 border-rose-300/80'
                  }`}>
                    بعد وقوع المخالفة
                  </span>
                </div>

                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <span className={`font-bold text-sm shrink-0 mt-0.5 ${isDark ? 'text-[#FFA0A3]' : 'text-rose-600'}`}>✕</span>
                    <div>
                      <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-rose-950 font-bold'}`}>
                        اكتشاف التجاوزات بعد الصرف المالي
                      </h4>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-white' : 'text-slate-600'}`}>
                        تُكتشف الأخطاء بعد أسابيع أو أشهر من توقيع العقود، حين يصبح استرداد الأموال معقداً أو مستحيلاً.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className={`font-bold text-sm shrink-0 mt-0.5 ${isDark ? 'text-[#FFA0A3]' : 'text-rose-600'}`}>✕</span>
                    <div>
                      <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-rose-950 font-bold'}`}>
                        تخطي مصفوفات الصلاحيات الإدارية
                      </h4>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-white' : 'text-slate-600'}`}>
                        توقيع منفرد يمرر التزامات مالية بالملايين دون إشعار أو موافقة مسبقة من الإدارات القانونية والمالية.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className={`font-bold text-sm shrink-0 mt-0.5 ${isDark ? 'text-[#FFA0A3]' : 'text-rose-600'}`}>✕</span>
                    <div>
                      <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-rose-950 font-bold'}`}>
                        مشاركة كلمات المرور وسهولة الإنكار
                      </h4>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-white' : 'text-slate-600'}`}>
                        انعدام التحقق العتادي يتيح ادعاء التوقيع بالنيابة أو استخدام الحساب من قبل موظف آخر.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className={`font-bold text-sm shrink-0 mt-0.5 ${isDark ? 'text-[#FFA0A3]' : 'text-rose-600'}`}>✕</span>
                    <div>
                      <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-rose-950 font-bold'}`}>
                        تحقيقات مرهقة وأضرار جسيمة بالسمعة
                      </h4>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-white' : 'text-slate-600'}`}>
                        استنزاف ساعات عمل طويلة للجان التدقيق، مع تعرض مسؤولي الجهة للمساءلة الرقابية والقانونية.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className={`p-4 rounded-xl text-xs mt-6 border font-medium relative z-10 ${
                isDark 
                  ? 'bg-[#221719] border-[#4A1D20]/60 text-white' 
                  : 'bg-gradient-to-r from-[#FDF0F0] to-[#FCE5E5] border-rose-300/60 text-rose-900 font-semibold'
              }`}>
                النتيجة: مخاطر مالية مستمرة، ميزانيات مهدرة، وفقدان الثقة في منظومة الحوكمة.
              </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 5. CTA SECTION (Unified "طلب عرض تجريبي" action) */}
      <section id="demo" className={`py-12 px-4 md:py-16 md:px-0 transition-colors duration-[350ms] ease-in-out border-b ${
        isDark ? 'bg-[#0D1210] border-emerald-950/40' : 'bg-white border-slate-200/80'
      }`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className={`relative max-w-4xl mx-auto px-5 py-8 md:px-8 md:py-10 rounded-2xl border text-center space-y-4 md:space-y-5 transition-colors duration-[350ms] ease-in-out overflow-hidden ${
            isDark 
              ? 'bg-gradient-to-br from-[#16221B]/95 via-[#111915]/95 to-[#0D1310] border-[#275C2D]/50 shadow-[0_4px_24px_rgba(0,0,0,0.6)]' 
              : 'bg-gradient-to-br from-[#FFFFFF] via-[#F4FAF6] to-[#E6F4EB] border-emerald-600/35 shadow-[0_12px_40px_rgba(39,92,45,0.12)]'
          }`}
        >
          <div className={`absolute top-0 right-0 left-0 h-[1.5px] pointer-events-none ${isDark ? 'bg-gradient-to-r from-transparent via-[#A1C89C]/40 to-transparent' : 'bg-gradient-to-r from-transparent via-emerald-600/30 to-transparent'}`} />
          <h2 className={`text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-balance ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            جاهزون لنقل منظومتكم إلى عهد النزاهة الاستباقية؟
          </h2>

          <p className={`text-xs md:text-sm lg:text-base max-w-xl mx-auto leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            سجل بياناتك لطلب عرض تجريبي لمنصة يقظة، واكتشف منصة يقظة عن قرب.
          </p>

          <div className="pt-1 flex justify-center">
            {/* Primary Action Button with organic perimeter sparkles on hover - isolated z-10 stacking */}
            <div className="relative group inline-flex isolate">
              <SparklesOverlay />
              <button
                onClick={() => {
                  setDemoSubmitted(false);
                  setDemoModalOpen(true);
                }}
                className={`relative z-10 px-6 py-3 md:px-7 md:py-3.5 text-sm font-bold rounded-xl text-white transition-all active:scale-95 flex items-center gap-2.5 cursor-pointer ${
                  isDark
                    ? 'bg-[#275C2D] hover:bg-[#2e6e35] shadow-[0_4px_14px_rgba(0,0,0,0.35)] hover:shadow-[0_6px_20px_rgba(39,92,45,0.25)]'
                    : 'bg-[#273E26] hover:bg-[#325031] shadow-[0_4px_14px_rgba(39,62,38,0.18)] hover:shadow-[0_6px_20px_rgba(39,62,38,0.22)]'
                }`}
              >
                <span>طلب عرض تجريبي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className={`text-[11px] md:text-xs pt-2 flex flex-wrap md:flex-nowrap items-center justify-center gap-x-3 gap-y-1.5 md:gap-5 ${isDark ? 'text-slate-400' : 'text-emerald-900/80 font-medium'}`}>
            <span>✓ متوافق مع الأنظمة واللوائح</span>
            <span className="hidden md:inline">·</span>
            <span>✓ استضافة سيادية داخل المملكة</span>
            <span className="hidden md:inline">·</span>
            <span>✓ حماية متقدمة بمفاتيح Hardware Tokens</span>
          </div>
        </motion.div>
      </section>

      {/* 6. ENTERPRISE FOOTER */}
      <footer className={`py-6 md:py-8 transition-colors duration-[350ms] ease-in-out border-t ${
        isDark ? 'bg-[#0D1210] border-emerald-950/40 text-slate-400' : 'bg-[#EDF6F0] border-emerald-900/15 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <p className="text-xs font-medium">
            جميع الحقوق محفوظة لمنصة يقظة © 2026
          </p>
        </div>
      </footer>

      {/* DEMO REQUEST MODAL */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border p-5 md:p-8 text-right shadow-2xl transition-colors duration-[350ms] ease-in-out ${
            isDark 
              ? 'bg-[#131A17] border-emerald-500/40 text-slate-100' 
              : 'bg-gradient-to-br from-white via-[#F9FCFA] to-[#EDF6F0] border-emerald-600/30 text-slate-900 shadow-[0_20px_60px_rgba(39,92,45,0.18)]'
          }`}>
            
            <button
              onClick={() => setDemoModalOpen(false)}
              className={`absolute top-4 left-4 p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-emerald-100/60'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {!demoSubmitted ? (
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    طلب عرض تجريبي لمنصة يقظة
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setFormData({ ...DEMO_FORM_DATA })}
                  className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors active:scale-95 cursor-pointer ${
                    isDark
                      ? 'border-[#A1C89C]/50 text-[#A1C89C] bg-emerald-950/30 hover:bg-emerald-900/40'
                      : 'border-emerald-700/30 text-[#273E26] bg-white/70 hover:bg-emerald-50'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>إدخال بيانات تجريبية</span>
                </button>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="د. فهد الهذلي"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                        isDark 
                          ? 'bg-[#18221E] border-emerald-900/50 text-white placeholder-slate-500 focus:border-[#A1C89C]' 
                          : 'bg-white border-emerald-800/20 text-slate-900 placeholder-slate-400 focus:border-emerald-600'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        اسم الجهة أو الشركة *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="وزارة / هيئة / شركة"
                        value={formData.org}
                        onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                          isDark 
                            ? 'bg-[#18221E] border-emerald-900/50 text-white placeholder-slate-500 focus:border-[#A1C89C]' 
                            : 'bg-white border-emerald-800/20 text-slate-900 placeholder-slate-400 focus:border-emerald-600'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        المسمى الوظيفي
                      </label>
                      <input
                        type="text"
                        placeholder="مدير مراجعة داخلية / امتثال"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                          isDark 
                            ? 'bg-[#18221E] border-emerald-900/50 text-white placeholder-slate-500 focus:border-[#A1C89C]' 
                            : 'bg-white border-emerald-800/20 text-slate-900 placeholder-slate-400 focus:border-emerald-600'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        البريد الإلكتروني المؤسسي *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@organization.gov.sa"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                          isDark 
                            ? 'bg-[#18221E] border-emerald-900/50 text-white placeholder-slate-500 focus:border-[#A1C89C]' 
                            : 'bg-white border-emerald-800/20 text-slate-900 placeholder-slate-400 focus:border-emerald-600'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        رقم التواصل *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+966 5X XXX XXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                          isDark 
                            ? 'bg-[#18221E] border-emerald-900/50 text-white placeholder-slate-500 focus:border-[#A1C89C]' 
                            : 'bg-white border-emerald-800/20 text-slate-900 placeholder-slate-400 focus:border-emerald-600'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                      isDark 
                        ? 'bg-[#355B32] hover:bg-[#3f6b3b]' 
                        : 'bg-[#273E26] hover:bg-[#325031]'
                    }`}
                  >
                    <span>طلب عرض تجريبي</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <p className={`text-[11px] text-center mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    نلتزم بالسرية التامة وحماية البيانات الشخصية وفق الضوابط والأنظمة.
                  </p>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 space-y-5">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border ${
                  isDark ? 'bg-emerald-950/80 border-[#A1C89C] text-[#A1C89C]' : 'bg-emerald-100 border-[#273E26] text-[#273E26]'
                }`}>
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  تم استلام طلبكم بنجاح
                </h3>
                <div className="pt-1 flex justify-center">
                  <a
                    href={MAIN_PLATFORM_URL}
                    onClick={() => setDemoModalOpen(false)}
                    className={`inline-flex items-center justify-center px-7 py-3 rounded-xl text-white text-sm font-bold transition-all active:scale-95 cursor-pointer ${
                      isDark
                        ? 'bg-gradient-to-r from-[#2E6F35] to-[#1F4E24] hover:from-[#36823F] hover:to-[#275C2D] border border-[#A1C89C]/60 shadow-[0_6px_20px_rgba(161,200,156,0.22)]'
                        : 'bg-gradient-to-r from-[#1F4E24] to-[#2E6B34] hover:from-[#275C2D] hover:to-[#357B3B] shadow-[0_6px_20px_rgba(39,92,45,0.22)]'
                    }`}
                  >
                    جرب يقظة الآن
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
    </MotionConfig>
  );
}
