"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Field, fieldInputClass } from "@/components/ui/FormField";
import { createCmsPageAction } from "@/lib/actions/admin";
import { formatDate, statusLabel } from "@/lib/format";
import type { CmsPage } from "@/lib/types";

const contentTypes = [
  { label: "Page", value: "page" },
  { label: "Article", value: "article" },
];

export function CmsClient({ cmsPages }: { cmsPages: CmsPage[] }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createCmsPageAction(formData);
      setOpen(false);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Gestion des pages et actualités du site public.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90"
        >
          + Nouveau contenu
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-border-subtle dark:text-slate-500">
                <th className="py-3">Titre</th>
                <th className="py-3">Type</th>
                <th className="py-3">Mis à jour</th>
                <th className="py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {cmsPages.map((c) => (
                <tr key={c.id}>
                  <td className="py-4 font-medium text-stf-navy dark:text-white">{c.title}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{statusLabel(c.type)}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{formatDate(c.updated_at)}</td>
                  <td className="py-4">
                    <Badge tone={c.status === "publie" ? "green" : "neutral"}>{statusLabel(c.status)}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Nouveau contenu">
        <form action={handleCreate} className="space-y-5">
          <Field label="Titre">
            <input required name="title" placeholder="Ex. Lancement de la cohorte 2026" className={fieldInputClass} />
          </Field>
          <Field label="Type">
            <select name="type" defaultValue={contentTypes[1].value} className={fieldInputClass}>
              {contentTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input type="checkbox" name="publish" className="rounded border-slate-300" />
            Publier immédiatement (sinon enregistré comme brouillon)
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90 disabled:opacity-50"
            >
              Créer le contenu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
