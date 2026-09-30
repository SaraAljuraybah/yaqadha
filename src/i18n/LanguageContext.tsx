import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ar } from './ar';
import { en } from './en';
import type { Lang } from './localize';
import type { Dictionary, TranslationKey, TranslationVars } from './types';

const STORAGE_KEY = 'yaqadha_lang';
const dictionaries: Record<Lang, Dictionary> = { ar, en };

interface LanguageContextValue {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  t: (key: TranslationKey, vars?: TranslationVars) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// The inline script in index.html has already applied the saved lang/dir before first paint
const getInitialLang = (): Lang => (document.documentElement.lang === 'en' ? 'en' : 'ar');

const lookup = (dictionary: Dictionary, key: TranslationKey): string => {
  let node: unknown = dictionary;
  for (const part of key.split('.')) {
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === 'string' ? node : key;
};

const interpolate = (template: string, vars?: TranslationVars): string =>
  vars ? template.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match)) : template;

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(getInitialLang);
  const dir: LanguageContextValue['dir'] = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
    document.title = dictionaries[lang].meta.title;
  }, [lang, dir]);

  const toggleLanguage = useCallback(() => {
    const next: Lang = lang === 'ar' ? 'en' : 'ar';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable: the choice still applies for this session
    }
    setLang(next);
  }, [lang]);

  const t = useCallback(
    (key: TranslationKey, vars?: TranslationVars) => interpolate(lookup(dictionaries[lang], key), vars),
    [lang]
  );

  const value = useMemo(() => ({ lang, dir, t, toggleLanguage }), [lang, dir, t, toggleLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside <LanguageProvider>');
  }
  return context;
};
