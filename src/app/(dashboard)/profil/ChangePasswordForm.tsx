"use client";

import { useActionState, useState } from "react";
import { fieldInputClass } from "@/components/ui/FormField";
import { changePasswordAction, type ChangePasswordState } from "@/lib/actions/admin";

export function ChangePasswordForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<ChangePasswordState, FormData>(changePasswordAction, null);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-semibold text-stf-blue hover:text-stf-orange"
      >
        Modifier
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-2">
      <input
        type="password"
        name="current_password"
        placeholder="Mot de passe actuel"
        required
        className={fieldInputClass + " mt-0"}
      />
      <input
        type="password"
        name="password"
        placeholder="Nouveau mot de passe"
        required
        minLength={8}
        className={fieldInputClass + " mt-0"}
      />
      <input
        type="password"
        name="password_confirmation"
        placeholder="Confirmer le nouveau mot de passe"
        required
        minLength={8}
        className={fieldInputClass + " mt-0"}
      />
      {state?.error ? <p className="text-xs text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="text-xs text-stf-green">Mot de passe mis à jour.</p> : null}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-stf-blue px-4 py-2 text-xs font-semibold text-white hover:bg-stf-blue/90 disabled:opacity-50"
        >
          Enregistrer
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
