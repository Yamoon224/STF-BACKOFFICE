"use client";

import { useActionState, useState, useTransition } from "react";
import { fieldInputClass } from "@/components/ui/FormField";
import {
  confirmMfaAction,
  disableMfaAction,
  setupMfaAction,
  type MfaConfirmState,
  type MfaDisableState,
  type MfaSetupState,
} from "@/lib/actions/admin";

export function MfaForm({ mfaEnabled }: { mfaEnabled: boolean }) {
  if (mfaEnabled) {
    return <DisableMfa />;
  }
  return <EnableMfa />;
}

function EnableMfa() {
  const [open, setOpen] = useState(false);
  const [setup, setSetup] = useState<MfaSetupState>(null);
  const [pending, startTransition] = useTransition();
  const [confirmState, confirmAction, confirmPending] = useActionState<MfaConfirmState, FormData>(
    confirmMfaAction,
    null
  );

  if (confirmState && "recoveryCodes" in confirmState) {
    return (
      <div className="space-y-3 rounded-xl border border-stf-green/30 bg-stf-green-light p-4 text-sm dark:bg-stf-green/10">
        <p className="font-semibold text-stf-navy dark:text-white">
          Double authentification activée. Conservez ces codes de récupération, ils ne seront plus affichés :
        </p>
        <ul className="grid grid-cols-2 gap-2 font-mono text-xs">
          {confirmState.recoveryCodes.map((code) => (
            <li key={code} className="rounded-lg bg-white px-2 py-1 text-stf-navy dark:bg-white/10 dark:text-white">
              {code}
            </li>
          ))}
        </ul>
        <button
          onClick={() => {
            setOpen(false);
            setSetup(null);
          }}
          className="rounded-full bg-stf-blue px-4 py-2 text-xs font-semibold text-white hover:bg-stf-blue/90"
        >
          Terminé
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => {
          setOpen(true);
          startTransition(async () => {
            setSetup(await setupMfaAction());
          });
        }}
        className="text-sm font-semibold text-stf-blue hover:text-stf-orange"
      >
        Activer
      </button>
    );
  }

  if (pending || !setup) {
    return <p className="text-xs text-slate-400 dark:text-slate-500">Génération du secret…</p>;
  }

  if ("error" in setup) {
    return <p className="text-xs text-red-600">{setup.error}</p>;
  }

  return (
    <div className="space-y-3">
      <div
        className="h-32 w-32 [&>svg]:h-full [&>svg]:w-full"
        dangerouslySetInnerHTML={{ __html: setup.qr_code_svg }}
      />
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Scannez ce QR code avec votre application d&apos;authentification, ou saisissez manuellement :{" "}
        <span className="font-mono">{setup.secret}</span>
      </p>
      <form action={confirmAction} className="space-y-2">
        <input
          name="code"
          placeholder="Code à 6 chiffres"
          required
          inputMode="numeric"
          className={fieldInputClass + " mt-0"}
        />
        {confirmState?.error ? <p className="text-xs text-red-600">{confirmState.error}</p> : null}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={confirmPending}
            className="rounded-full bg-stf-blue px-4 py-2 text-xs font-semibold text-white hover:bg-stf-blue/90 disabled:opacity-50"
          >
            Confirmer
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setSetup(null);
            }}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 dark:border-border-default dark:text-slate-300"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

function DisableMfa() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<MfaDisableState, FormData>(disableMfaAction, null);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-sm font-semibold text-stf-red hover:text-stf-orange">
        Désactiver
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-2">
      <input
        type="password"
        name="password"
        placeholder="Confirmer avec votre mot de passe"
        required
        className={fieldInputClass + " mt-0"}
      />
      {state?.error ? <p className="text-xs text-red-600">{state.error}</p> : null}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full border border-stf-red/30 px-4 py-2 text-xs font-semibold text-stf-red hover:bg-stf-red-light disabled:opacity-50"
        >
          Désactiver la MFA
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 dark:border-border-default dark:text-slate-300"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
