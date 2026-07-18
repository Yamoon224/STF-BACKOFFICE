"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Field, fieldInputClass } from "@/components/ui/FormField";
import {
  createCmsPageAction,
  createFaqAction,
  createPartnerAction,
  createTestimonialAction,
  deleteCmsPageAction,
  deleteFaqAction,
  deletePartnerAction,
  deleteTestimonialAction,
  updateCmsPageAction,
  updateFaqAction,
  updatePartnerAction,
  updateTestimonialAction,
} from "@/lib/actions/admin";
import { formatDate, statusLabel } from "@/lib/format";
import type { CmsPage, Faq, Partner, Testimonial } from "@/lib/types";

const contentTypes = [
  { label: "Page", value: "page" },
  { label: "Article", value: "article" },
];

const tabs = [
  { key: "pages", label: "Pages" },
  { key: "partners", label: "Partenaires" },
  { key: "testimonials", label: "Témoignages" },
  { key: "faqs", label: "FAQ" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export function CmsClient({
  cmsPages,
  partners,
  testimonials,
  faqs,
}: {
  cmsPages: CmsPage[];
  partners: Partner[];
  testimonials: Testimonial[];
  faqs: Faq[];
}) {
  const [tab, setTab] = useState<TabKey>("pages");

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Gestion des pages et actualités du site public, ainsi que des partenaires, témoignages et FAQ.
      </p>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              tab === t.key
                ? "bg-stf-blue text-white"
                : "border border-slate-200 bg-white text-slate-500 dark:border-border-default dark:bg-white/5 dark:text-slate-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "pages" ? <PagesPanel cmsPages={cmsPages} /> : null}
      {tab === "partners" ? <PartnersPanel partners={partners} /> : null}
      {tab === "testimonials" ? <TestimonialsPanel testimonials={testimonials} /> : null}
      {tab === "faqs" ? <FaqsPanel faqs={faqs} /> : null}
    </div>
  );
}

function PagesPanel({ cmsPages }: { cmsPages: CmsPage[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CmsPage | null>(null);
  const [pending, startTransition] = useTransition();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createCmsPageAction(formData);
      setOpen(false);
    });
  }

  function handleUpdate(formData: FormData) {
    if (!editing) return;
    startTransition(async () => {
      await updateCmsPageAction(editing.id, formData);
      setEditing(null);
    });
  }

  function handleDelete(pageId: number) {
    if (!confirm("Supprimer ce contenu ?")) return;
    startTransition(async () => {
      await deleteCmsPageAction(pageId);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
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
                <tr key={c.id}>
                  <td className="py-4 font-medium text-stf-navy dark:text-white">{c.title}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{statusLabel(c.type)}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{formatDate(c.updated_at)}</td>
                  <td className="py-4">
                    <Badge tone={c.status === "publie" ? "green" : "neutral"}>{statusLabel(c.status)}</Badge>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditing(c)}
                        className="text-xs font-semibold text-slate-500 hover:text-stf-orange dark:text-slate-300"
                      >
                        Modifier
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="text-xs font-semibold text-stf-red hover:text-stf-orange">
                        Supprimer
                      </button>
                    </div>
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

      <Modal open={editing !== null} onClose={() => setEditing(null)} title="Modifier le contenu">
        {editing ? (
          <form action={handleUpdate} className="space-y-5">
            <Field label="Titre">
              <input required name="title" defaultValue={editing.title} className={fieldInputClass} />
            </Field>
            <Field label="Extrait">
              <textarea name="excerpt" defaultValue={editing.excerpt ?? ""} rows={2} className={fieldInputClass} />
            </Field>
            <Field label="Contenu">
              <textarea name="body" defaultValue={editing.body ?? ""} rows={5} className={fieldInputClass} />
            </Field>
            <Field label="Catégorie">
              <input name="category" defaultValue={editing.category ?? ""} className={fieldInputClass} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input type="checkbox" name="publish" defaultChecked={editing.status === "publie"} className="rounded border-slate-300" />
              Publié (sinon brouillon)
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90 disabled:opacity-50"
              >
                Enregistrer
              </button>
            </div>
          </form>
        ) : null}
      </Modal>
    </div>
  );
}

function PartnersPanel({ partners }: { partners: Partner[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [pending, startTransition] = useTransition();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createPartnerAction(formData);
      setOpen(false);
    });
  }

  function handleUpdate(formData: FormData) {
    if (!editing) return;
    startTransition(async () => {
      await updatePartnerAction(editing.id, formData);
      setEditing(null);
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Supprimer ce partenaire ?")) return;
    startTransition(async () => {
      await deletePartnerAction(id);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90"
        >
          + Ajouter un partenaire
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-border-subtle dark:text-slate-500">
                <th className="py-3">Nom</th>
                <th className="py-3">Site web</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {partners.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                    Aucun partenaire pour le moment.
                  </td>
                </tr>
              ) : (
                partners.map((p) => (
                  <tr key={p.id}>
                    <td className="py-4 font-medium text-stf-navy dark:text-white">{p.name}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{p.url ?? "—"}</td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditing(p)}
                          className="text-xs font-semibold text-slate-500 hover:text-stf-orange dark:text-slate-300"
                        >
                          Modifier
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="text-xs font-semibold text-stf-red hover:text-stf-orange">
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Ajouter un partenaire">
        <form action={handleCreate} className="space-y-5">
          <Field label="Nom">
            <input required name="name" className={fieldInputClass} />
          </Field>
          <Field label="Site web">
            <input name="url" type="url" placeholder="https://" className={fieldInputClass} />
          </Field>
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
              Ajouter
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title="Modifier le partenaire">
        {editing ? (
          <form action={handleUpdate} className="space-y-5">
            <Field label="Nom">
              <input required name="name" defaultValue={editing.name} className={fieldInputClass} />
            </Field>
            <Field label="Site web">
              <input name="url" type="url" defaultValue={editing.url ?? ""} className={fieldInputClass} />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90 disabled:opacity-50"
              >
                Enregistrer
              </button>
            </div>
          </form>
        ) : null}
      </Modal>
    </div>
  );
}

function TestimonialsPanel({ testimonials }: { testimonials: Testimonial[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [pending, startTransition] = useTransition();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createTestimonialAction(formData);
      setOpen(false);
    });
  }

  function handleUpdate(formData: FormData) {
    if (!editing) return;
    startTransition(async () => {
      await updateTestimonialAction(editing.id, formData);
      setEditing(null);
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Supprimer ce témoignage ?")) return;
    startTransition(async () => {
      await deleteTestimonialAction(id);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90"
        >
          + Ajouter un témoignage
        </button>
      </div>

      <Card>
        <div className="space-y-3">
          {testimonials.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">Aucun témoignage pour le moment.</p>
          ) : (
            testimonials.map((t) => (
              <div key={t.id} className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 p-4 dark:border-border-subtle">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stf-navy dark:text-white">
                    {t.name} <span className="font-normal text-slate-400">— {t.role}</span>
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">&laquo; {t.quote} &raquo;</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => setEditing(t)}
                    className="text-xs font-semibold text-slate-500 hover:text-stf-orange dark:text-slate-300"
                  >
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="text-xs font-semibold text-stf-red hover:text-stf-orange">
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Ajouter un témoignage">
        <form action={handleCreate} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nom">
              <input required name="name" className={fieldInputClass} />
            </Field>
            <Field label="Rôle">
              <input required name="role" placeholder="Ex. Mentée, cohorte 2025" className={fieldInputClass} />
            </Field>
          </div>
          <Field label="Témoignage">
            <textarea required name="quote" rows={3} className={fieldInputClass} />
          </Field>
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
              Ajouter
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title="Modifier le témoignage">
        {editing ? (
          <form action={handleUpdate} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nom">
                <input required name="name" defaultValue={editing.name} className={fieldInputClass} />
              </Field>
              <Field label="Rôle">
                <input required name="role" defaultValue={editing.role} className={fieldInputClass} />
              </Field>
            </div>
            <Field label="Témoignage">
              <textarea required name="quote" defaultValue={editing.quote} rows={3} className={fieldInputClass} />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90 disabled:opacity-50"
              >
                Enregistrer
              </button>
            </div>
          </form>
        ) : null}
      </Modal>
    </div>
  );
}

function FaqsPanel({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [pending, startTransition] = useTransition();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createFaqAction(formData);
      setOpen(false);
    });
  }

  function handleUpdate(formData: FormData) {
    if (!editing) return;
    startTransition(async () => {
      await updateFaqAction(editing.id, formData);
      setEditing(null);
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Supprimer cette question ?")) return;
    startTransition(async () => {
      await deleteFaqAction(id);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90"
        >
          + Ajouter une question
        </button>
      </div>

      <Card>
        <div className="space-y-3">
          {faqs.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">Aucune question pour le moment.</p>
          ) : (
            faqs.map((f) => (
              <div key={f.id} className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 p-4 dark:border-border-subtle">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stf-navy dark:text-white">{f.question}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{f.answer}</p>
                  {f.category ? <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{f.category}</p> : null}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => setEditing(f)}
                    className="text-xs font-semibold text-slate-500 hover:text-stf-orange dark:text-slate-300"
                  >
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(f.id)} className="text-xs font-semibold text-stf-red hover:text-stf-orange">
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Ajouter une question">
        <form action={handleCreate} className="space-y-5">
          <Field label="Question">
            <input required name="question" className={fieldInputClass} />
          </Field>
          <Field label="Réponse">
            <textarea required name="answer" rows={3} className={fieldInputClass} />
          </Field>
          <Field label="Catégorie">
            <input name="category" placeholder="Ex. mentorat" className={fieldInputClass} />
          </Field>
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
              Ajouter
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title="Modifier la question">
        {editing ? (
          <form action={handleUpdate} className="space-y-5">
            <Field label="Question">
              <input required name="question" defaultValue={editing.question} className={fieldInputClass} />
            </Field>
            <Field label="Réponse">
              <textarea required name="answer" defaultValue={editing.answer} rows={3} className={fieldInputClass} />
            </Field>
            <Field label="Catégorie">
              <input name="category" defaultValue={editing.category ?? ""} className={fieldInputClass} />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90 disabled:opacity-50"
              >
                Enregistrer
              </button>
            </div>
          </form>
        ) : null}
      </Modal>
    </div>
  );
}
