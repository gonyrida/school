import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * LANGUAGE CONTEXT
 * ================
 * Stores the active UI language and persists it to localStorage. Pages can
 * read the current language and render localized content accordingly.
 *
 * Three languages are supported out of the box: English, Khmer, Arabic.
 * Arabic is right-to-left; the provider sets `dir="rtl"` on <html> so all
 * Tailwind layouts flip naturally.
 *
 * For multilingual page content, the recommended pattern is to store
 * translations alongside the original text in the section data
 * (e.g., title_en / title_km / title_ar) and pick the active one at render
 * time using `useLanguage()`. Migration of existing single-language content
 * is graceful — if a translation is missing, the renderer falls back to the
 * default-language value.
 */

export type Language = 'en' | 'km' | 'ar';

export const LANGUAGES: Array<{
  code: Language;
  label: string;
  nativeLabel: string;
  dir: 'ltr' | 'rtl';
}> = [
  { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr' },
  { code: 'km', label: 'Khmer', nativeLabel: 'ខ្មែរ', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', dir: 'rtl' },
];

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'site.language';

function readStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'km' || stored === 'ar') return stored;
  // Fall back to browser language if it matches one we support
  const navLang = window.navigator.language.toLowerCase();
  if (navLang.startsWith('km')) return 'km';
  if (navLang.startsWith('ar')) return 'ar';
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  // Apply language attributes to <html> so CSS / RTL flips work site-wide.
  useEffect(() => {
    const def = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];
    document.documentElement.lang = def.code;
    document.documentElement.dir = def.dir;
  }, [language]);

  const dir = LANGUAGES.find((l) => l.code === language)?.dir ?? 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Soft fallback so components don't crash if rendered outside the provider
    return { language: 'en', setLanguage: () => {}, dir: 'ltr' };
  }
  return ctx;
}

/**
 * Resolve a possibly-localized text value. Accepts either a plain string
 * (already in the active language) or an object map keyed by language code.
 * Falls back to English if the active language isn't present.
 */
export function localized(
  value: string | Partial<Record<Language, string>> | undefined | null,
  active: Language,
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[active] ?? value.en ?? Object.values(value).find(Boolean) ?? '';
}
