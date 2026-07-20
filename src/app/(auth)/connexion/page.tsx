"use client";

import Image from "next/image";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { useActionState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { loginAction, type AuthActionState } from "@/lib/actions/auth";

const fieldInputClass =
  "w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-stf-blue dark:border-border-default dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500";

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-slate-400 dark:text-slate-500">
      {children}
    </span>
  );
}

export default function ConnexionPage() {
  const { t } = useLanguage();
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(loginAction, null);

  return (
    <div className="w-full max-w-sm">
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-black/5">
            <Image src="/brand/logo.jpg" alt="STF" fill sizes="36px" className="object-cover" />
          </span>
          <span className="text-sm font-semibold text-stf-navy dark:text-white">{t("nav.backofficeStf")}</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-stf-navy dark:text-white">{t("connexion.title")}</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t("connexion.description")}</p>

      <form action={formAction} className="mt-8 space-y-5">
        <div>
          <label className="text-sm font-semibold text-stf-navy dark:text-white">{t("connexion.email")}</label>
          <div className="relative mt-2">
            <FieldIcon>
              <Mail className="h-5 w-5" strokeWidth={1.8} />
            </FieldIcon>
            <input
              type="email"
              name="email"
              required
              className={fieldInputClass}
              placeholder="vous@stf-organisation.org"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-stf-navy dark:text-white">{t("connexion.password")}</label>
          <div className="relative mt-2">
            <FieldIcon>
              <Lock className="h-5 w-5" strokeWidth={1.8} />
            </FieldIcon>
            <PasswordInput
              name="password"
              required
              className={fieldInputClass}
              placeholder="••••••••"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-stf-navy dark:text-white">{t("connexion.mfa")}</label>
          <div className="relative mt-2">
            <FieldIcon>
              <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
            </FieldIcon>
            <input
              type="text"
              name="code"
              inputMode="numeric"
              className={fieldInputClass}
              placeholder="123 456"
            />
          </div>
          {state?.mfaRequired ? (
            <p className="mt-1 text-xs text-stf-orange">Double authentification requise pour ce compte.</p>
          ) : null}
        </div>

        {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-stf-orange px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stf-orange/90 disabled:opacity-60"
        >
          {pending ? "Connexion…" : t("connexion.submit")}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
        {t("connexion.auditNote")}
      </p>
    </div>
  );
}
