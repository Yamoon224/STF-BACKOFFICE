import { apiFetch } from "@/lib/api";
import type { Report } from "@/lib/types";
import { SignalementsClient } from "./SignalementsClient";

export default async function SignalementsPage() {
  const reports = await apiFetch<Report[]>("/reports");

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Traitement des signalements et modération des contenus, avec historique et procédure d&apos;escalade.
      </p>

      <SignalementsClient reports={reports} />
    </div>
  );
}
