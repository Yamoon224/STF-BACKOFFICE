"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function AuthShowcasePanel() {
  const { t } = useLanguage();

  return (
    <div className="relative hidden overflow-hidden bg-stf-navy lg:block">
      <Image
        src="/brand/connexion-labo.jpg"
        alt=""
        fill
        priority
        sizes="50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stf-navy via-stf-navy/60 to-stf-navy/10" />
      <div className="absolute inset-0 bg-stf-navy/20" />

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
