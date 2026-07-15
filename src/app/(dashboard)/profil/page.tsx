import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { currentUser } from "@/lib/mock-data";

export default function ProfilPage() {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-stf-orange-light text-lg font-bold text-stf-orange">
              {currentUser.initials}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-stf-navy">{currentUser.name}</h2>
              <p className="truncate text-sm text-slate-500">{currentUser.email}</p>
            </div>
          </div>
          <Link
            href="/connexion"
            className="rounded-full border border-stf-red/30 px-5 py-2.5 text-center text-sm font-semibold text-stf-red hover:bg-stf-red-light"
          >
            Se déconnecter
          </Link>
        </div>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card title="Informations du compte">
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
              Rôle
              <span className="text-right font-medium text-stf-navy">{currentUser.role}</span>
            </li>
            <li className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
              Niveau d&apos;accès
              <span className="text-right font-medium text-stf-navy">{currentUser.access}</span>
            </li>
            <li className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
              Dernière connexion
              <span className="text-right font-medium text-stf-navy">{currentUser.lastLogin}</span>
            </li>
          </ul>
        </Card>

        <Card title="Sécurité">
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
              Authentification multi-facteurs (MFA)
              <Badge tone={currentUser.mfa ? "green" : "orange"}>
                {currentUser.mfa ? "Activée" : "Désactivée"}
              </Badge>
            </li>
            <li className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
              Mot de passe
              <button className="shrink-0 text-sm font-semibold text-stf-blue hover:text-stf-orange">
                Modifier
              </button>
            </li>
            <li className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
              Historique des actions
              <Link href="/audit-logs" className="shrink-0 text-sm font-semibold text-stf-blue hover:text-stf-orange">
                Voir les journaux
              </Link>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
