"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Field, fieldInputClass } from "@/components/ui/FormField";
import { Pagination, usePagination } from "@/components/ui/Pagination";
import { PencilIcon, PlusIcon, TrashIcon } from "@/components/ui/Icons";
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
  updatePageSectionAction,
  updatePartnerAction,
  updateSiteSettingsAction,
  updateTestimonialAction,
} from "@/lib/actions/admin";
import { formatDate, statusLabel } from "@/lib/format";
import type { CmsPage, Faq, PageSection, Partner, SiteSettings, Testimonial } from "@/lib/types";

const contentTypes = [
  { label: "Page", value: "page" },
  { label: "Article", value: "article" },
];

const partnerTypes = [
  { label: "Ils nous font confiance", value: "confiance" },
  { label: "Partenaires", value: "partenaire" },
];

function partnerTypeLabel(type: Partner["type"]): string {
  return partnerTypes.find((t) => t.value === type)?.label ?? type;
}

const tabs = [
  { key: "pages", label: "Pages" },
  { key: "partners", label: "Partenaires" },
  { key: "testimonials", label: "Témoignages" },
  { key: "faqs", label: "FAQ" },
  { key: "sections", label: "Sections du site" },
  { key: "settings", label: "Paramètres" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export function CmsClient({
  cmsPages,
  partners,
  testimonials,
  faqs,
  siteSettings,
  pageSections,
}: {
  cmsPages: CmsPage[];
  partners: Partner[];
  testimonials: Testimonial[];
  faqs: Faq[];
  siteSettings: SiteSettings;
  pageSections: PageSection[];
}) {
  const [tab, setTab] = useState<TabKey>("pages");

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Gestion des pages et actualités du site public, ainsi que des partenaires, témoignages, FAQ, sections de
        contenu et paramètres.
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
      {tab === "sections" ? <PageSectionsPanel pageSections={pageSections} /> : null}
      {tab === "settings" ? <SiteSettingsPanel siteSettings={siteSettings} /> : null}
    </div>
  );
}

function PagesPanel({ cmsPages }: { cmsPages: CmsPage[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CmsPage | null>(null);
  const [pending, startTransition] = useTransition();
  const { pageItems, page, setPage, totalPages, total, pageSize } = usePagination(cmsPages);

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
          className="flex items-center gap-1.5 rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90"
        >
          <PlusIcon className="h-4 w-4" />
          Nouveau contenu
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
              {pageItems.map((c) => (
                <tr key={c.id}>
                  <td className="py-4 font-medium text-stf-navy dark:text-white">{c.title}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{statusLabel(c.type)}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{formatDate(c.updated_at)}</td>
                  <td className="py-4">
                    <Badge tone={c.status === "publie" ? "green" : "neutral"}>{statusLabel(c.status)}</Badge>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditing(c)}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-stf-orange dark:text-slate-300"
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="flex items-center gap-1 text-xs font-semibold text-stf-red hover:text-stf-orange"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onChange={setPage} />
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
  const { pageItems, page, setPage, totalPages, total, pageSize } = usePagination(partners);

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
          className="flex items-center gap-1.5 rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90"
        >
          <PlusIcon className="h-4 w-4" />
          Ajouter un partenaire
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-border-subtle dark:text-slate-500">
                <th className="py-3">Logo</th>
                <th className="py-3">Nom</th>
                <th className="py-3">Type</th>
                <th className="py-3">Site web</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                    Aucun partenaire pour le moment.
                  </td>
                </tr>
              ) : (
                pageItems.map((p) => (
                  <tr key={p.id}>
                    <td className="py-4">
                      {p.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.logo_url}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg border border-slate-100 object-contain dark:border-border-default"
                        />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-300 dark:border-border-default dark:text-slate-600">
                          —
                        </span>
                      )}
                    </td>
                    <td className="py-4 font-medium text-stf-navy dark:text-white">{p.name}</td>
                    <td className="py-4">
                      <Badge tone={p.type === "confiance" ? "orange" : "neutral"}>{partnerTypeLabel(p.type)}</Badge>
                    </td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{p.url ?? "—"}</td>
                    <td className="py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => setEditing(p)}
                          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-stf-orange dark:text-slate-300"
                        >
                          <PencilIcon className="h-3.5 w-3.5" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-stf-red hover:text-stf-orange"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
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
        <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onChange={setPage} />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Ajouter un partenaire">
        <form action={handleCreate} className="space-y-5">
          <Field label="Nom">
            <input required name="name" className={fieldInputClass} />
          </Field>
          <Field label="Type">
            <select name="type" defaultValue="confiance" className={fieldInputClass}>
              {partnerTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Site web">
            <input name="url" type="url" placeholder="https://" className={fieldInputClass} />
          </Field>
          <Field label="Logo (optionnel)">
            <input name="logo" type="file" accept="image/*" className={fieldInputClass} />
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
            <Field label="Type">
              <select name="type" defaultValue={editing.type} className={fieldInputClass}>
                {partnerTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Site web">
              <input name="url" type="url" defaultValue={editing.url ?? ""} className={fieldInputClass} />
            </Field>
            <Field label="Logo (optionnel)">
              <div className="space-y-2">
                {editing.logo_url ? (
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editing.logo_url}
                      alt={editing.name}
                      className="h-12 w-12 rounded-lg border border-slate-100 object-contain dark:border-border-default"
                    />
                    <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <input type="checkbox" name="remove_logo" className="rounded border-slate-300" />
                      Retirer le logo actuel
                    </label>
                  </div>
                ) : null}
                <input name="logo" type="file" accept="image/*" className={fieldInputClass} />
              </div>
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
  const { pageItems, page, setPage, totalPages, total, pageSize } = usePagination(testimonials);

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
          className="flex items-center gap-1.5 rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90"
        >
          <PlusIcon className="h-4 w-4" />
          Ajouter un témoignage
        </button>
      </div>

      <Card>
        <div className="space-y-3">
          {pageItems.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">Aucun témoignage pour le moment.</p>
          ) : (
            pageItems.map((t) => (
              <div key={t.id} className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 p-4 dark:border-border-subtle">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stf-navy dark:text-white">
                    {t.name} <span className="font-normal text-slate-400">— {t.role}</span>
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">&laquo; {t.quote} &raquo;</p>
                </div>
                <div className="flex shrink-0 gap-3">
                  <button
                    onClick={() => setEditing(t)}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-stf-orange dark:text-slate-300"
                  >
                    <PencilIcon className="h-3.5 w-3.5" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-stf-red hover:text-stf-orange"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onChange={setPage} />
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
  const { pageItems, page, setPage, totalPages, total, pageSize } = usePagination(faqs);

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
          className="flex items-center gap-1.5 rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90"
        >
          <PlusIcon className="h-4 w-4" />
          Ajouter une question
        </button>
      </div>

      <Card>
        <div className="space-y-3">
          {pageItems.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">Aucune question pour le moment.</p>
          ) : (
            pageItems.map((f) => (
              <div key={f.id} className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 p-4 dark:border-border-subtle">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stf-navy dark:text-white">{f.question}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{f.answer}</p>
                  {f.category ? <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{f.category}</p> : null}
                </div>
                <div className="flex shrink-0 gap-3">
                  <button
                    onClick={() => setEditing(f)}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-stf-orange dark:text-slate-300"
                  >
                    <PencilIcon className="h-3.5 w-3.5" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-stf-red hover:text-stf-orange"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onChange={setPage} />
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

const settingsGroups: { title: string; fields: { key: string; label: string }[] }[] = [
  {
    title: "Contact",
    fields: [
      { key: "address", label: "Adresse / siège" },
      { key: "phone", label: "Téléphone" },
      { key: "email_primary", label: "Email principal" },
      { key: "email_secondary", label: "Email secondaire" },
      { key: "site_url", label: "Site web" },
    ],
  },
  {
    title: "Réseaux sociaux",
    fields: [
      { key: "social_linkedin", label: "LinkedIn" },
      { key: "social_facebook", label: "Facebook" },
      { key: "social_instagram", label: "Instagram" },
      { key: "social_youtube", label: "YouTube" },
      { key: "social_x", label: "X (Twitter)" },
    ],
  },
];

function SiteSettingsPanel({ siteSettings }: { siteSettings: SiteSettings }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateSiteSettingsAction(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <Card>
      <form action={handleSubmit} className="space-y-8">
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-stf-orange">{group.title}</h3>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {group.fields.map((field) => (
                <Field key={field.key} label={field.label}>
                  <input
                    name={field.key}
                    defaultValue={siteSettings[field.key] ?? ""}
                    className={fieldInputClass}
                  />
                </Field>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-end gap-3 pt-2">
          {saved ? <span className="text-sm font-semibold text-stf-green">Enregistré</span> : null}
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90 disabled:opacity-50"
          >
            {pending ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>
    </Card>
  );
}

const pageLabels: Record<string, string> = {
  "a-propos": "À propos",
  politiques: "Politiques",
  impact: "Impact",
  mentorat: "Mentorat",
  partenaires: "Partenaires",
  programmes: "Programmes",
  blog: "Blog",
  "experiences-virtuelles": "Expériences virtuelles",
  contact: "Contact",
};

const sectionLabels: Record<string, string> = {
  hero: "En-tête",
  histoire: "Notre histoire",
  mission: "Notre mission",
  values: "Valeurs",
  governance: "Gouvernance",
  policies: "Politiques",
  indicators: "Indicateurs",
  mentee_path: "Parcours mentée",
  mentor_path: "Parcours mentore",
  security: "Sécurité",
  cta: "Appel à l'action",
};

function sectionSummary(section: PageSection): string {
  const p = section.payload as Record<string, unknown>;
  if (typeof p.title === "string") return p.title;
  if (Array.isArray(p.items)) return `${p.items.length} élément(s)`;
  return "—";
}

function PageSectionsPanel({ pageSections }: { pageSections: PageSection[] }) {
  const [editing, setEditing] = useState<PageSection | null>(null);

  const grouped = pageSections.reduce<Record<string, PageSection[]>>((acc, section) => {
    (acc[section.page_key] ??= []).push(section);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([pageKey, sections]) => (
        <Card key={pageKey}>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-stf-orange">
            {pageLabels[pageKey] ?? pageKey}
          </h3>
          <div className="mt-4 divide-y divide-slate-100 dark:divide-border-subtle">
            {sections.map((section) => (
              <div key={section.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stf-navy dark:text-white">
                    {sectionLabels[section.section_key] ?? section.section_key}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                    {sectionSummary(section)}
                  </p>
                </div>
                <button
                  onClick={() => setEditing(section)}
                  className="flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-500 hover:text-stf-orange dark:text-slate-300"
                >
                  <PencilIcon className="h-3.5 w-3.5" />
                  Modifier
                </button>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing ? `${pageLabels[editing.page_key] ?? editing.page_key} — ${sectionLabels[editing.section_key] ?? editing.section_key}` : ""}
        className="max-w-2xl"
      >
        {editing ? <SectionEditorForm section={editing} onDone={() => setEditing(null)} /> : null}
      </Modal>
    </div>
  );
}

function SectionEditorForm({ section, onDone }: { section: PageSection; onDone: () => void }) {
  const [payload, setPayload] = useState<Record<string, unknown>>(section.payload);
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      await updatePageSectionAction(section.id, payload);
      onDone();
    });
  }

  const listFieldsByType: Record<string, { key: string; label: string; multiline?: boolean }[]> = {
    list_title_description: [
      { key: "title", label: "Titre" },
      { key: "description", label: "Description", multiline: true },
    ],
    list_role_mission: [
      { key: "role", label: "Rôle" },
      { key: "mission", label: "Mission", multiline: true },
    ],
    list_title_text: [
      { key: "title", label: "Titre" },
      { key: "text", label: "Texte", multiline: true },
    ],
    list_label_value: [
      { key: "label", label: "Libellé" },
      { key: "value", label: "Valeur" },
    ],
  };

  return (
    <div className="space-y-5">
      {section.type === "hero" ? (
        <>
          <Field label="Eyebrow">
            <input
              defaultValue={(payload.eyebrow as string) ?? ""}
              onChange={(e) => setPayload((p) => ({ ...p, eyebrow: e.target.value }))}
              className={fieldInputClass}
            />
          </Field>
          <Field label="Titre">
            <input
              defaultValue={(payload.title as string) ?? ""}
              onChange={(e) => setPayload((p) => ({ ...p, title: e.target.value }))}
              className={fieldInputClass}
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={3}
              defaultValue={(payload.description as string) ?? ""}
              onChange={(e) => setPayload((p) => ({ ...p, description: e.target.value }))}
              className={fieldInputClass}
            />
          </Field>
        </>
      ) : null}

      {section.type === "text" ? (
        <>
          {"eyebrow" in payload ? (
            <Field label="Eyebrow">
              <input
                defaultValue={(payload.eyebrow as string) ?? ""}
                onChange={(e) => setPayload((p) => ({ ...p, eyebrow: e.target.value }))}
                className={fieldInputClass}
              />
            </Field>
          ) : null}
          <Field label="Titre">
            <input
              defaultValue={(payload.title as string) ?? ""}
              onChange={(e) => setPayload((p) => ({ ...p, title: e.target.value }))}
              className={fieldInputClass}
            />
          </Field>
          <Field label="Texte">
            <textarea
              rows={4}
              defaultValue={(payload.body as string) ?? ""}
              onChange={(e) => setPayload((p) => ({ ...p, body: e.target.value }))}
              className={fieldInputClass}
            />
          </Field>
        </>
      ) : null}

      {section.type === "list_text" ? (
        <StringListEditor
          items={(payload.items as string[]) ?? []}
          onChange={(items) => setPayload((p) => ({ ...p, items }))}
        />
      ) : null}

      {listFieldsByType[section.type] ? (
        <ObjectListEditor
          items={(payload.items as Record<string, string>[]) ?? []}
          fields={listFieldsByType[section.type]}
          onChange={(items) => setPayload((p) => ({ ...p, items }))}
        />
      ) : null}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onDone}
          className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90 disabled:opacity-50"
        >
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}

function StringListEditor({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-stf-navy dark:text-white">Éléments</label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <textarea
            rows={2}
            value={item}
            onChange={(e) => onChange(items.map((it, idx) => (idx === i ? e.target.value : it)))}
            className={fieldInputClass + " mt-0"}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="shrink-0 text-xs font-semibold text-stf-red hover:text-stf-orange"
          >
            Retirer
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="text-xs font-semibold text-stf-blue hover:text-stf-orange"
      >
        + Ajouter un élément
      </button>
    </div>
  );
}

function ObjectListEditor({
  items,
  fields,
  onChange,
}: {
  items: Record<string, string>[];
  fields: { key: string; label: string; multiline?: boolean }[];
  onChange: (items: Record<string, string>[]) => void;
}) {
  function updateItem(index: number, key: string, value: string) {
    onChange(items.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)));
  }

  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-stf-navy dark:text-white">Éléments</label>
      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-xl border border-slate-100 p-4 dark:border-border-subtle">
          {fields.map((field) =>
            field.multiline ? (
              <textarea
                key={field.key}
                rows={2}
                placeholder={field.label}
                value={item[field.key] ?? ""}
                onChange={(e) => updateItem(i, field.key, e.target.value)}
                className={fieldInputClass + " mt-0"}
              />
            ) : (
              <input
                key={field.key}
                placeholder={field.label}
                value={item[field.key] ?? ""}
                onChange={(e) => updateItem(i, field.key, e.target.value)}
                className={fieldInputClass + " mt-0"}
              />
            )
          )}
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="text-xs font-semibold text-stf-red hover:text-stf-orange"
          >
            Retirer cet élément
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, Object.fromEntries(fields.map((f) => [f.key, ""]))])}
        className="text-xs font-semibold text-stf-blue hover:text-stf-orange"
      >
        + Ajouter un élément
      </button>
    </div>
  );
}
