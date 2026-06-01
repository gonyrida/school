/**
 * useTranslation.ts
 * =================
 * Drop-in hook. Returns a `t()` function bound to the active language.
 *
 * Example:
 *   const { t, lang, dir } = useTranslation();
 *   <h1>{t('home.hero_title')}</h1>
 *   <p dir={dir}>{t('home.hero_subtitle')}</p>
 */

import { useCallback } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { translate, type TranslationKey } from '@/i18n';

export function useTranslation() {
  const { language, setLanguage, dir } = useLanguage();

  const t = useCallback(
    (key: TranslationKey | string, vars?: Record<string, string | number>): string => {
      return translate(key, language, vars);
    },
    [language],
  );

  return { t, lang: language, dir, setLanguage };
}