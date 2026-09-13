import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { SupportedLanguage } from '../types';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import bn from '../locales/bn.json';
import te from '../locales/te.json';
import mr from '../locales/mr.json';
import ta from '../locales/ta.json';
import gu from '../locales/gu.json';
import kn from '../locales/kn.json';
import ml from '../locales/ml.json';
import pa from '../locales/pa.json';
import od from '../locales/od.json';
import as from '../locales/as.json';

const translations: Record<SupportedLanguage, any> = {
  en,
  hi,
  bn,
  te,
  mr,
  ta,
  gu,
  kn,
  ml,
  pa,
  od,
  as,
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (path: string, fallback?: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (path: string) => path,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useLanguageState() {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('pravah_language') as SupportedLanguage;
      if (saved && translations[saved]) return saved;
    } catch {
      // LocalStorage access fallback
    }
    return 'en';
  });

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('pravah_language', lang);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (path: string, fallback?: string): string => {
      const dict = translations[language] || translations.en;
      const keys = path.split('.');
      let current: any = dict;

      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          // Fallback to English dictionary
          let enCurrent: any = translations.en;
          for (const enKey of keys) {
            if (enCurrent && typeof enCurrent === 'object' && enKey in enCurrent) {
              enCurrent = enCurrent[enKey];
            } else {
              enCurrent = undefined;
              break;
            }
          }
          return typeof enCurrent === 'string' ? enCurrent : fallback || path;
        }
      }

      return typeof current === 'string' ? current : fallback || path;
    },
    [language]
  );

  return { language, setLanguage, t };
}
