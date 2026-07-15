"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Choix de la langue"
      className={`flex h-10 shrink-0 items-center rounded-full border border-slate-200 p-1 text-xs font-bold dark:border-border-default ${className}`}
    >
      <button
        type="button"
        onClick={() => setLocale("fr")}
        aria-pressed={locale === "fr"}
        className={`rounded-full px-2.5 py-1.5 transition-colors ${
          locale === "fr"
            ? "bg-stf-orange text-white"
            : "text-slate-500 hover:text-stf-navy dark:text-slate-400 dark:hover:text-white"
        }`}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`rounded-full px-2.5 py-1.5 transition-colors ${
          locale === "en"
            ? "bg-stf-orange text-white"
            : "text-slate-500 hover:text-stf-navy dark:text-slate-400 dark:hover:text-white"
        }`}
      >
        US
      </button>
    </div>
  );
}
