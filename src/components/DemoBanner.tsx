import React from 'react';
import { Play } from 'lucide-react';
import { useLanguage } from '../i18n';
import { DEMO_STATS } from '../data/demo';

/** Shown under the header while demo mode is on. */
export const DemoBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div
      id="demo-mode-banner"
      className="border-b border-sky-200 bg-sky-50 dark:border-[#1E3442] dark:bg-[#0F1C24] px-6 lg:px-8 py-3 flex items-center gap-2.5 text-sm"
      role="status"
    >
      <Play className="w-4 h-4 shrink-0 text-sky-700 dark:text-sky-300" />
      <span className="font-bold text-sky-800 dark:text-sky-300 whitespace-nowrap">{t('demoBanner.title')}</span>
      <span className="text-sky-900/70 dark:text-slate-400 truncate">
        {t('demoBanner.body', { documents: DEMO_STATS.totalDocuments, departments: DEMO_STATS.departments })}
      </span>
    </div>
  );
};
