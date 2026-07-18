export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  active: "Active",
  suspended: "Suspendue",
  en_attente: "En attente",
  actif: "Actif",
  pause: "En pause",
  termine: "Terminé",
  a_venir: "À venir",
  en_cours: "En cours",
  archive: "Archivé",
  nouveau: "Nouveau",
  resolu: "Résolu",
  brouillon: "Brouillon",
  publie: "Publié",
  en_validation: "En validation",
  automatique: "Automatique",
  travail: "Travail",
  mentorat: "Mentorat",
  confirmee: "Confirmée",
  realisee: "Réalisée",
  annulee: "Annulée",
};

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Administratrice STF",
  staff: "Collaboratrice STF",
  mentor: "Mentore",
  mentee: "Mentée",
  donor: "Bailleur / partenaire",
};

export function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}
