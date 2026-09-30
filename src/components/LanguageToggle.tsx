import React from 'react';
import { useLanguage } from '../i18n';

export const LanguageToggle: React.FC = () => {
  const { t, toggleLanguage } = useLanguage();
  const label = t('header.languageToggleLabel');

  return (
    <button
      id="btn-language-toggle"
      type="button"
      title={label}
      aria-label={label}
      onClick={toggleLanguage}
      className="relative p-2.5 rounded-2xl border transition-all shadow-2xs border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50"
    >
      <span className="flex w-5 h-5 items-center justify-center text-sm font-bold leading-none">
        {t('header.languageToggle')}
      </span>
    </button>
  );
};
