import { apiFetch } from "@/lib/api";
import type { Course, Experiment, Level, LiveSession, Subject } from "@/lib/types";
import { ExperiencesVirtuellesClient } from "./ExperiencesVirtuellesClient";

export default async function ExperiencesVirtuellesPage() {
  const [levels, subjects, courses, experiments, liveSessions] = await Promise.all([
    apiFetch<Level[]>("/levels"),
    apiFetch<Subject[]>("/subjects"),
    apiFetch<Course[]>("/courses"),
    apiFetch<Experiment[]>("/experiments"),
    apiFetch<LiveSession[]>("/live-sessions"),
  ]);

  return (
    <ExperiencesVirtuellesClient
      levels={levels}
      subjects={subjects}
      courses={courses}
      experiments={experiments}
      liveSessions={liveSessions}
    />
  );
}
