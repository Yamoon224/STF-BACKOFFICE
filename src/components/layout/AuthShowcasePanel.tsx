"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";
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
          <ShieldCheck className="h-7 w-7" strokeWidth={1.6} />
        </span>
        <h1 className="max-w-sm text-3xl font-bold leading-tight">{t("connexion.panelTitle")}</h1>
        <p className="mt-3 max-w-sm text-sm text-slate-300">{t("connexion.panelDescription")}</p>
      </div>
    </div>
  );
}
