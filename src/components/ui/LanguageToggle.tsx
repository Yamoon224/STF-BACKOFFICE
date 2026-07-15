"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Locale } from "@/lib/i18n/dictionaries";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      aria-label="Choix de la langue"
      className={`h-9 shrink-0 rounded-full border border-slate-200 bg-transparent px-3 text-xs font-bold text-slate-600 outline-none transition-colors hover:border-stf-orange focus:border-stf-blue dark:border-border-default dark:bg-surface dark:text-slate-300 ${className}`}
    >
      <option value="fr">FR</option>
      <option value="en">US</option>
    </select>
  );
}
