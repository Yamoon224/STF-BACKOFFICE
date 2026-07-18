import { apiFetch } from "@/lib/api";
import type { AdminUser, Cohort, MentorshipPairing, MentorshipSession, Program } from "@/lib/types";
import { BinomesClient } from "./BinomesClient";

export default async function BinomesPage() {
  const [pairings, sessions, mentees, mentors, programs, cohorts] = await Promise.all([
    apiFetch<{ data: MentorshipPairing[] }>("/pairings"),
    apiFetch<{ data: MentorshipSession[] }>("/sessions"),
    apiFetch<{ data: AdminUser[] }>("/users?role=mentee"),
    apiFetch<{ data: AdminUser[] }>("/users?role=mentor"),
    apiFetch<Program[]>("/programs"),
    apiFetch<Cohort[]>("/cohorts"),
  ]);

  return (
    <BinomesClient
      pairings={pairings.data}
      sessions={sessions.data}
      mentees={mentees.data}
      mentors={mentors.data}
      programs={programs}
      cohorts={cohorts}
    />
  );
}
