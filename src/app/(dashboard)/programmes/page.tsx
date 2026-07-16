import { apiFetch } from "@/lib/api";
import type { Program } from "@/lib/types";
import { ProgrammesClient } from "./ProgrammesClient";

export default async function ProgrammesPage() {
  const programs = await apiFetch<Program[]>("/programs");

  return <ProgrammesClient programs={programs} />;
}
