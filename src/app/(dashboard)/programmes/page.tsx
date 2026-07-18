import { apiFetch } from "@/lib/api";
import type { Cohort, Program } from "@/lib/types";
import { ProgrammesClient } from "./ProgrammesClient";

export default async function ProgrammesPage() {
  const [programs, cohorts] = await Promise.all([
    apiFetch<Program[]>("/programs"),
    apiFetch<Cohort[]>("/cohorts"),
  ]);

  const cohortsByProgram = new Map<number, Cohort[]>();
  for (const cohort of cohorts) {
    const list = cohortsByProgram.get(cohort.program_id) ?? [];
    list.push(cohort);
    cohortsByProgram.set(cohort.program_id, list);
  }

  return <ProgrammesClient programs={programs} cohortsByProgram={Object.fromEntries(cohortsByProgram)} />;
}
