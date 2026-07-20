"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Locale } from "@/lib/i18n/dictionaries";

const options: { value: Locale; label: string; name: string }[] = [
  { value: "fr", label: "FR", name: "Français" },
  { value: "en", label: "US", name: "English" },
];

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const current = options.find((o) => o.value === locale) ?? options[0];

  return (
    <div ref={containerRef} className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choix de la langue"
        className={`flex h-9 items-center gap-1.5 rounded-full border pl-3 pr-2.5 text-xs font-bold transition-colors ${
          open
            ? "border-stf-orange text-stf-orange"
            : "border-slate-200 text-slate-600 hover:border-stf-orange hover:text-stf-orange dark:border-border-default dark:text-slate-300"
        }`}
      >
        <Globe className="h-4 w-4" strokeWidth={1.8} />
        <span>{current.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Langue"
          className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-black/5 dark:border-border-default dark:bg-surface"
        >
          {options.map((option) => {
            const selected = option.value === locale;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setLocale(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${
                  selected
                    ? "bg-stf-orange-light text-stf-orange"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                }`}
              >
                <span
                  aria-hidden
                  className={`flex h-5 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
                    selected
                      ? "bg-stf-orange/15 text-stf-orange"
                      : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                  }`}
                >
                  {option.label}
                </span>
                {option.name}
                {selected ? <Check className="ml-auto h-4 w-4" strokeWidth={2} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
