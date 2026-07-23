"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Field, fieldInputClass } from "@/components/ui/FormField";
import { Pagination, usePagination } from "@/components/ui/Pagination";
import { PencilIcon, PlusIcon, TrashIcon } from "@/components/ui/Icons";
import {
  createCourseAction,
  createExperimentAction,
  createLiveSessionAction,
  deleteCourseAction,
  deleteExperimentAction,
  deleteLiveSessionAction,
  updateCourseAction,
  updateExperimentAction,
  updateLiveSessionAction,
} from "@/lib/actions/admin";
import { formatDateTime, statusLabel } from "@/lib/format";
import type { Course, Experiment, Level, LiveSession, Subject } from "@/lib/types";

const tabs = [
  { key: "courses", label: "Cours de renforcement" },
  { key: "experiments", label: "Labo virtuel" },
  { key: "sessions", label: "Sessions live" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const courseStatuses = [
  { label: "Brouillon", value: "brouillon" },
  { label: "Publié", value: "publie" },
];

const liveSessionStatuses = [
  { label: "À venir", value: "a_venir" },
  { label: "En cours", value: "en_cours" },
  { label: "Terminée", value: "termine" },
];

export function ExperiencesVirtuellesClient({
  levels,
  subjects,
  courses,
  experiments,
  liveSessions,
}: {
  levels: Level[];
  subjects: Subject[];
  courses: Course[];
  experiments: Experiment[];
  liveSessions: LiveSession[];
}) {
  const [tab, setTab] = useState<TabKey>("courses");

  const levelMap = Object.fromEntries(levels.map((l) => [l.id, l.name]));
  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s.name]));
  const courseMap = Object.fromEntries(courses.map((c) => [c.id, c.title]));

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Gestion des cours de renforcement, du labo virtuel d&apos;expériences et des sessions en direct proposés sur
        le site public.
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

      {tab === "courses" ? <CoursesPanel courses={courses} levels={levels} subjects={subjects} levelMap={levelMap} subjectMap={subjectMap} /> : null}
      {tab === "experiments" ? (
        <ExperimentsPanel
          experiments={experiments}
          levels={levels}
          subjects={subjects}
          courses={courses}
          levelMap={levelMap}
          subjectMap={subjectMap}
          courseMap={courseMap}
        />
      ) : null}
      {tab === "sessions" ? <SessionsPanel liveSessions={liveSessions} courses={courses} courseMap={courseMap} /> : null}
    </div>
  );
}

function CoursesPanel({
  courses,
  levels,
  subjects,
  levelMap,
  subjectMap,
}: {
  courses: Course[];
  levels: Level[];
  subjects: Subject[];
  levelMap: Record<number, string>;
  subjectMap: Record<number, string>;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [pending, startTransition] = useTransition();
  const { pageItems, page, setPage, totalPages, total, pageSize } = usePagination(courses);

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createCourseAction(formData);
      setOpen(false);
    });
  }

  function handleUpdate(formData: FormData) {
    if (!editing) return;
    startTransition(async () => {
      await updateCourseAction(editing.id, formData);
      setEditing(null);
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Supprimer ce cours ? Les expériences et sessions liées perdront leur rattachement.")) return;
    startTransition(async () => {
      await deleteCourseAction(id);
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
          Nouveau cours
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-border-subtle dark:text-slate-500">
                <th className="py-3">Titre</th>
                <th className="py-3">Niveau</th>
                <th className="py-3">Matière</th>
                <th className="py-3">Statut</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                    Aucun cours pour le moment.
                  </td>
                </tr>
              ) : (
                pageItems.map((c) => (
                  <tr key={c.id}>
                    <td className="py-4 font-medium text-stf-navy dark:text-white">{c.title}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{levelMap[c.level_id] ?? "-"}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{subjectMap[c.subject_id] ?? "-"}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onChange={setPage} />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Nouveau cours de renforcement">
        <CourseForm levels={levels} subjects={subjects} onSubmit={handleCreate} onCancel={() => setOpen(false)} pending={pending} submitLabel="Créer le cours" />
      </Modal>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title="Modifier le cours">
        {editing ? (
          <CourseForm
            levels={levels}
            subjects={subjects}
            course={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
            pending={pending}
            submitLabel="Enregistrer"
          />
        ) : null}
      </Modal>
    </div>
  );
}

function CourseForm({
  levels,
  subjects,
  course,
  onSubmit,
  onCancel,
  pending,
  submitLabel,
}: {
  levels: Level[];
  subjects: Subject[];
  course?: Course;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  pending: boolean;
  submitLabel: string;
}) {
  return (
    <form action={onSubmit} className="space-y-5">
      <Field label="Titre">
        <input required name="title" defaultValue={course?.title ?? ""} className={fieldInputClass} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Niveau">
          <select required name="level_id" defaultValue={course?.level_id ?? ""} className={fieldInputClass}>
            <option value="" disabled>
              Choisir un niveau
            </option>
            {levels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Matière">
          <select required name="subject_id" defaultValue={course?.subject_id ?? ""} className={fieldInputClass}>
            <option value="" disabled>
              Choisir une matière
            </option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Description">
        <textarea name="description" rows={3} defaultValue={course?.description ?? ""} className={fieldInputClass} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Ordre d'affichage">
          <input type="number" name="order" min={0} defaultValue={course?.order ?? 0} className={fieldInputClass} />
        </Field>
        <Field label="Statut">
          <select name="status" defaultValue={course?.status ?? "brouillon"} className={fieldInputClass}>
            {courseStatuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90 disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function ExperimentsPanel({
  experiments,
  levels,
  subjects,
  courses,
  levelMap,
  subjectMap,
  courseMap,
}: {
  experiments: Experiment[];
  levels: Level[];
  subjects: Subject[];
  courses: Course[];
  levelMap: Record<number, string>;
  subjectMap: Record<number, string>;
  courseMap: Record<number, string>;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Experiment | null>(null);
  const [pending, startTransition] = useTransition();
  const { pageItems, page, setPage, totalPages, total, pageSize } = usePagination(experiments);

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createExperimentAction(formData);
      setOpen(false);
    });
  }

  function handleUpdate(formData: FormData) {
    if (!editing) return;
    startTransition(async () => {
      await updateExperimentAction(editing.id, formData);
      setEditing(null);
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Supprimer cette expérience ?")) return;
    startTransition(async () => {
      await deleteExperimentAction(id);
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
          Nouvelle expérience
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-border-subtle dark:text-slate-500">
                <th className="py-3">Titre</th>
                <th className="py-3">Matière</th>
                <th className="py-3">Niveau</th>
                <th className="py-3">Cours lié</th>
                <th className="py-3">Statut</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                    Aucune expérience pour le moment.
                  </td>
                </tr>
              ) : (
                pageItems.map((e) => (
                  <tr key={e.id}>
                    <td className="py-4 font-medium text-stf-navy dark:text-white">{e.title}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{subjectMap[e.subject_id] ?? "-"}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">
                      {e.level_id ? levelMap[e.level_id] ?? "-" : "-"}
                    </td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">
                      {e.course_id ? courseMap[e.course_id] ?? "-" : "Aucun"}
                    </td>
                    <td className="py-4">
                      <Badge tone={e.status === "publie" ? "green" : "neutral"}>{statusLabel(e.status)}</Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => setEditing(e)}
                          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-stf-orange dark:text-slate-300"
                        >
                          <PencilIcon className="h-3.5 w-3.5" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(e.id)}
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

      <Modal open={open} onClose={() => setOpen(false)} title="Nouvelle expérience de labo virtuel">
        <ExperimentForm
          levels={levels}
          subjects={subjects}
          courses={courses}
          onSubmit={handleCreate}
          onCancel={() => setOpen(false)}
          pending={pending}
          submitLabel="Créer l'expérience"
        />
      </Modal>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title="Modifier l'expérience">
        {editing ? (
          <ExperimentForm
            levels={levels}
            subjects={subjects}
            courses={courses}
            experiment={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
            pending={pending}
            submitLabel="Enregistrer"
          />
        ) : null}
      </Modal>
    </div>
  );
}

function ExperimentForm({
  levels,
  subjects,
  courses,
  experiment,
  onSubmit,
  onCancel,
  pending,
  submitLabel,
}: {
  levels: Level[];
  subjects: Subject[];
  courses: Course[];
  experiment?: Experiment;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  pending: boolean;
  submitLabel: string;
}) {
  return (
    <form action={onSubmit} className="space-y-5">
      <Field label="Titre">
        <input required name="title" defaultValue={experiment?.title ?? ""} className={fieldInputClass} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Matière">
          <select required name="subject_id" defaultValue={experiment?.subject_id ?? ""} className={fieldInputClass}>
            <option value="" disabled>
              Choisir une matière
            </option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Niveau (optionnel)">
          <select name="level_id" defaultValue={experiment?.level_id ?? ""} className={fieldInputClass}>
            <option value="">Tous niveaux</option>
            {levels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Cours lié (optionnel)">
        <select name="course_id" defaultValue={experiment?.course_id ?? ""} className={fieldInputClass}>
          <option value="">Aucun</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Description">
        <textarea name="description" rows={2} defaultValue={experiment?.description ?? ""} className={fieldInputClass} />
      </Field>
      <Field label="Instructions (étapes numérotées, ex. « 1. … 2. … »)">
        <textarea name="instructions" rows={4} defaultValue={experiment?.instructions ?? ""} className={fieldInputClass} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Ordre d'affichage">
          <input type="number" name="order" min={0} defaultValue={experiment?.order ?? 0} className={fieldInputClass} />
        </Field>
        <Field label="Statut">
          <select name="status" defaultValue={experiment?.status ?? "brouillon"} className={fieldInputClass}>
            {courseStatuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90 disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function SessionsPanel({
  liveSessions,
  courses,
  courseMap,
}: {
  liveSessions: LiveSession[];
  courses: Course[];
  courseMap: Record<number, string>;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LiveSession | null>(null);
  const [pending, startTransition] = useTransition();
  const { pageItems, page, setPage, totalPages, total, pageSize } = usePagination(liveSessions);

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createLiveSessionAction(formData);
      setOpen(false);
    });
  }

  function handleUpdate(formData: FormData) {
    if (!editing) return;
    startTransition(async () => {
      await updateLiveSessionAction(editing.id, formData);
      setEditing(null);
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Supprimer cette session live ?")) return;
    startTransition(async () => {
      await deleteLiveSessionAction(id);
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
          Nouvelle session live
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-border-subtle dark:text-slate-500">
                <th className="py-3">Titre</th>
                <th className="py-3">Cours</th>
                <th className="py-3">Date</th>
                <th className="py-3">Durée</th>
                <th className="py-3">Statut</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                    Aucune session en direct pour le moment.
                  </td>
                </tr>
              ) : (
                pageItems.map((s) => (
                  <tr key={s.id}>
                    <td className="py-4 font-medium text-stf-navy dark:text-white">{s.title}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{courseMap[s.course_id] ?? "-"}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{formatDateTime(s.scheduled_at)}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{s.duration_minutes} min</td>
                    <td className="py-4">
                      <Badge tone={s.status === "a_venir" ? "orange" : s.status === "en_cours" ? "green" : "neutral"}>
                        {liveSessionStatuses.find((st) => st.value === s.status)?.label ?? s.status}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => setEditing(s)}
                          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-stf-orange dark:text-slate-300"
                        >
                          <PencilIcon className="h-3.5 w-3.5" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
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

      <Modal open={open} onClose={() => setOpen(false)} title="Nouvelle session live">
        <form action={handleCreate} className="space-y-5">
          <Field label="Cours">
            <select required name="course_id" defaultValue="" className={fieldInputClass}>
              <option value="" disabled>
                Choisir un cours
              </option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Titre">
            <input required name="title" placeholder="Ex. Atelier questions-réponses" className={fieldInputClass} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Date et heure">
              <input required type="datetime-local" name="scheduled_at" className={fieldInputClass} />
            </Field>
            <Field label="Durée (minutes)">
              <input type="number" name="duration_minutes" min={15} max={240} defaultValue={60} className={fieldInputClass} />
            </Field>
          </div>
          <Field label="Lien de connexion (optionnel)">
            <input name="meeting_link" placeholder="https://meet.google.com/…" className={fieldInputClass} />
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
              Planifier
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title="Modifier la session live">
        {editing ? (
          <form action={handleUpdate} className="space-y-5">
            <Field label="Cours">
              <input disabled value={courseMap[editing.course_id] ?? ""} className={`${fieldInputClass} opacity-60`} />
            </Field>
            <Field label="Titre">
              <input required name="title" defaultValue={editing.title} className={fieldInputClass} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Date et heure">
                <input
                  required
                  type="datetime-local"
                  name="scheduled_at"
                  defaultValue={editing.scheduled_at.slice(0, 16)}
                  className={fieldInputClass}
                />
              </Field>
              <Field label="Durée (minutes)">
                <input
                  type="number"
                  name="duration_minutes"
                  min={15}
                  max={240}
                  defaultValue={editing.duration_minutes}
                  className={fieldInputClass}
                />
              </Field>
            </div>
            <Field label="Lien de connexion (optionnel)">
              <input name="meeting_link" defaultValue={editing.meeting_link ?? ""} className={fieldInputClass} />
            </Field>
            <Field label="Statut">
              <select name="status" defaultValue={editing.status} className={fieldInputClass}>
                {liveSessionStatuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
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
