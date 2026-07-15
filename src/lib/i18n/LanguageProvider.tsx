"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { dictionaries, type Locale } from "./dictionaries";

export type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslateFn;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "stf-locale";
const listeners = new Set<() => void>();
let currentLocale: Locale = "fr";
let initialized = false;

function ensureInitialized() {
  if (initialized) return;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "fr" || stored === "en") currentLocale = stored;
  initialized = true;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Locale {
  ensureInitialized();
  return currentLocale;
}

function getServerSnapshot(): Locale {
  return "fr";
}

function setStoredLocale(next: Locale) {
  currentLocale = next;
  initialized = true;
  window.localStorage.setItem(STORAGE_KEY, next);
  listeners.forEach((listener) => listener());
}

function getValue(dict: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, dict);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const t = useMemo(() => {
    return (key: string, vars?: Record<string, string | number>) => {
      const value = getValue(dictionaries[locale], key) ?? getValue(dictionaries.fr, key);
      let result = typeof value === "string" ? value : key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          result = result.replaceAll(`{{${k}}}`, String(v));
        }
      }
      return result;
    };
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale: setStoredLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
