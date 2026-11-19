import React from 'react';
import { Hammer } from 'lucide-react';
import { useLanguage } from '../i18n';

/** Temporary stand-in for pages that are built in a later redesign stage. */
export const PlaceholderScreen: React.FC<{ title: string; stage: number }> = ({ title, stage }) => {
  const { t } = useLanguage();
  return (
    <div className="space-y-6 text-start">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight pt-1">{title}</h1>
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 flex flex-col items-center text-center gap-3">
        <span className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
          <Hammer className="w-5 h-5 text-slate-500" />
        </span>
        <h2 className="text-base font-bold text-slate-900">{t('placeholder.title')}</h2>
        <p className="text-sm text-slate-600">{t('placeholder.body', { page: title, stage })}</p>
      </div>
    </div>
  );
};
