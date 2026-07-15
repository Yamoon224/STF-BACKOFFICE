"use client";

import { useState, type FormEvent } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Field, fieldInputClass } from "@/components/ui/FormField";
import { cmsPages as initialCmsPages } from "@/lib/mock-data";

const contentTypes = ["Page", "Article", "Média", "Document"];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function CmsPage() {
  const [cmsPages, setCmsPages] = useState(initialCmsPages);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState(contentTypes[1]);
  const [publish, setPublish] = useState(false);

  function handleCreate(event: FormEvent) {
    event.preventDefault();
    setCmsPages((prev) => [
      {
        title: title.trim(),
        type,
        updated: todayIso(),
        status: publish ? "Publié" : "Brouillon",
      },
      ...prev,
    ]);
    setTitle("");
    setType(contentTypes[1]);
    setPublish(false);
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Gestion des pages, actualités, médias et documents du site public.
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
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {cmsPages.map((c) => (
                <tr key={c.title}>
                  <td className="py-4 font-medium text-stf-navy dark:text-white">{c.title}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{c.type}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{c.updated}</td>
                  <td className="py-4">
                    <Badge tone={c.status === "Publié" ? "green" : "neutral"}>{c.status}</Badge>
                  </td>
                  <td className="py-4">
                    <button className="text-sm font-semibold text-stf-blue hover:text-stf-orange">
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Nouveau contenu">
        <form onSubmit={handleCreate} className="space-y-5">
          <Field label="Titre">
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Lancement de la cohorte 2026"
              className={fieldInputClass}
            />
          </Field>
          <Field label="Type">
            <select value={type} onChange={(e) => setType(e.target.value)} className={fieldInputClass}>
              {contentTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
              className="rounded border-slate-300"
            />
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
              className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90"
            >
              Créer le contenu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
