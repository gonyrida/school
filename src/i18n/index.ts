/**
 * i18n/index.ts — Lightweight custom translation engine
 * ======================================================
 * No external library required. Works with React context
 * via useLanguage() from hooks/useLanguage.tsx.
 *
 * Usage:
 *   const { t } = useTranslation();
 *   t('home.hero_title')           → "Empowering Minds..."
 *   t('common.view_all')           → "View All"
 *   t('admissions.apply_now')      → "Apply Now"
 */

import type { Language } from '@/hooks/useLanguage';
import en from './locales/en.json';
import km from './locales/km.json';
import ar from './locales/ar.json';

// ── Types ─────────────────────────────────────────────────────────────────────

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : string;
};

type Translations = typeof en;
type TranslationStore = Record<Language, DeepPartial<Translations>>;

// Dot-notation key extractor for type-safety
type DotPaths<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? DotPaths<T[K], `${Prefix}${K}.`>
          : `${Prefix}${K}`
        : never;
    }[keyof T]
  : never;

export type TranslationKey = DotPaths<Translations>;

// ── Translation store ─────────────────────────────────────────────────────────

export const translations: TranslationStore = { en, km, ar };

// ── Core translate function ───────────────────────────────────────────────────

/**
 * Resolve a dot-notation key against the translation store.
 * Falls back: active lang → English → raw key (so UI never breaks).
 */
export function translate(
  key: string,
  lang: Language,
  vars?: Record<string, string | number>,
): string {
  const resolve = (store: DeepPartial<Translations>): string | undefined => {
    const parts = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cursor: any = store;
    for (const part of parts) {
      if (cursor == null || typeof cursor !== 'object') return undefined;
      cursor = cursor[part];
    }
    return typeof cursor === 'string' ? cursor : undefined;
  };

  let result =
    resolve(translations[lang]) ??
    resolve(translations.en) ??
    key; // last-resort fallback: the raw key

  // Simple variable interpolation: t('key', { name: 'Alice' })
  // Template: "Hello {{name}}!" → "Hello Alice!"
  if (vars) {
    result = result.replace(/\{\{(\w+)\}\}/g, (_, k) =>
      vars[k] !== undefined ? String(vars[k]) : `{{${k}}}`,
    );
  }

  return result;
}

// ── Plural helper ─────────────────────────────────────────────────────────────

/**
 * Basic pluralisation — pass the count and key variants:
 *   tPlural('student', count, { one: 'student', other: 'students' })
 */
export function tPlural(
  count: number,
  variants: { one: string; other: string },
): string {
  return count === 1 ? variants.one : variants.other;
}