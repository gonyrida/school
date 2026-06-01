/**
 * LanguageSwitcher.tsx
 * ====================
 * Standalone language switcher — can be dropped anywhere in the UI.
 * The Header already embeds a select-based switcher; this component
 * offers a button-pill variant (e.g. for footers or hero areas).
 *
 * Usage:
 *   <LanguageSwitcher />                  ← pill buttons
 *   <LanguageSwitcher variant="select" /> ← dropdown
 */

import { Globe } from "lucide-react";
import { LANGUAGES, type Language } from "@/hooks/useLanguage";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  variant?: "pills" | "select";
  className?: string;
}

export function LanguageSwitcher({ variant = "pills", className = "" }: Props) {
  const { lang, setLanguage, t } = useTranslation();

  if (variant === "select") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-lg border border-ink-300/30 bg-white px-2 py-1.5 focus-within:ring-2 focus-within:ring-brand-700/30 ${className}`}
      >
        <Globe className="icon-no-flip h-4 w-4 text-ink-500 shrink-0" aria-hidden />
        <select
          value={lang}
          onChange={(e) => setLanguage(e.target.value as Language)}
          aria-label={t("common.select_language")}
          className="bg-transparent text-sm cursor-pointer focus:outline-none"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.nativeLabel}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Pills variant
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-xl border border-ink-300/20 bg-surface-muted p-1 ${className}`}
      role="group"
      aria-label={t("common.select_language")}
    >
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLanguage(l.code as Language)}
          aria-pressed={lang === l.code}
          title={l.label}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            lang === l.code
              ? "bg-brand-700 text-white shadow-soft"
              : "text-ink-500 hover:text-ink-900"
          }`}
        >
          {l.nativeLabel}
        </button>
      ))}
    </div>
  );
}