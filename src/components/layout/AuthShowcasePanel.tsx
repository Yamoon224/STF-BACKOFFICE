"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function AuthShowcasePanel() {
  const { t } = useLanguage();

  return (
    <div className="relative hidden overflow-hidden bg-stf-navy lg:block">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(85% 65% at 30% 30%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(85% 65% at 30% 30%, black 30%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -top-24 -left-10 h-96 w-96 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(245,148,31,0.35), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 h-80 w-80 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(29,78,137,0.55), transparent 70%)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stf-navy via-stf-navy/40 to-transparent" />

      <div className="relative flex h-full flex-col justify-end p-12 text-white">
        <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z" />
            <path d="m9.3 12 1.8 1.8 3.6-3.6" />
          </svg>
        </span>
        <h1 className="max-w-sm text-3xl font-bold leading-tight">{t("connexion.panelTitle")}</h1>
        <p className="mt-3 max-w-sm text-sm text-slate-300">{t("connexion.panelDescription")}</p>
      </div>
    </div>
  );
}
