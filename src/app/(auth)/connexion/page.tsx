import Image from "next/image";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function ConnexionPage() {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-surface">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-black/5">
            <Image src="/brand/logo.jpg" alt="STF" fill sizes="36px" className="object-cover" />
          </span>
          <span className="text-sm font-semibold text-stf-navy dark:text-white">Back-office STF</span>
        </div>
        <ThemeToggle />
      </div>

      <h1 className="mt-6 text-2xl font-bold text-stf-navy dark:text-white">Connexion sécurisée</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Réservé aux collaboratrices et à l&apos;administratrice STF.
      </p>

      <form className="mt-8 space-y-5">
        <div>
          <label className="text-sm font-semibold text-stf-navy dark:text-white">Email professionnel</label>
          <input
            type="email"
            required
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-stf-blue dark:border-border-default dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
            placeholder="vous@stf-organisation.org"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-stf-navy dark:text-white">Mot de passe</label>
          <input
            type="password"
            required
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-stf-blue dark:border-border-default dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-stf-navy dark:text-white">Code de vérification (MFA)</label>
          <input
            type="text"
            inputMode="numeric"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-stf-blue dark:border-border-default dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
            placeholder="123 456"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-stf-orange px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stf-orange/90"
        >
          Se connecter
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
        Toute connexion est journalisée dans les logs d&apos;audit.
      </p>
    </div>
  );
}
