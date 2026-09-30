import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي';

  return (
    <button
      id="btn-theme-toggle"
      type="button"
      title={label}
      aria-label={label}
      onClick={toggleTheme}
      className="relative p-2.5 rounded-2xl border transition-all shadow-2xs border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};
