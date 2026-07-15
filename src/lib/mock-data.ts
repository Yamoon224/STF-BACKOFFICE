export const kpis = [
  { label: "Mentées actives", value: "1 860", trend: "+4.2% ce mois" },
  { label: "Mentores validées", value: "180", trend: "+6 ce mois" },
  { label: "Binômes actifs", value: "950", trend: "+18 ce mois" },
  { label: "Sessions ce mois", value: "612", trend: "+3.8%" },
];

export const pendingMentors = [
  { name: "Sarah N'Guessan", expertise: "Data science", submitted: "2026-07-10", country: "Côte d'Ivoire" },
  { name: "Julie Amoussou", expertise: "Génie civil", submitted: "2026-07-11", country: "Bénin" },
  { name: "Kadidia Traoré", expertise: "Cybersécurité", submitted: "2026-07-13", country: "Mali" },
];

export const recentAlerts = [
  { type: "Signalement", detail: "Message signalé dans le binôme #482", severity: "high", time: "il y a 2h" },
  { type: "Inactivité", detail: "Aucune session depuis 30 jours — binôme #217", severity: "medium", time: "il y a 1j" },
  { type: "Validation", detail: "3 mentores en attente de validation", severity: "low", time: "il y a 1j" },
];

export const activityByProgram = [
  { program: "Mentorat STIM", mentees: 1200, sessions: 4100, retention: 86 },
  { program: "Découverte Primaire", mentees: 540, sessions: 890, retention: 91 },
  { program: "Campus numérique", mentees: 420, sessions: 980, retention: 78 },
  { program: "Leadership jeunes femmes", mentees: 240, sessions: 620, retention: 82 },
];

export const users = [
  { name: "Aïcha Diallo", role: "Mentée", status: "Active", program: "Mentorat STIM", country: "Côte d'Ivoire" },
  { name: "Fatou Konaté", role: "Mentore", status: "Validée", program: "Mentorat STIM", country: "Sénégal" },
  { name: "Mariam Sow", role: "Mentée", status: "Active", program: "Campus numérique", country: "Mali" },
  { name: "Sarah N'Guessan", role: "Mentore", status: "En attente", program: "—", country: "Côte d'Ivoire" },
  { name: "Ndeye Fall", role: "Mentée", status: "En attente", program: "Mentorat STIM", country: "Sénégal" },
  { name: "Julie Amoussou", role: "Mentore", status: "En attente", program: "—", country: "Bénin" },
];

export const programs = [
  { name: "Mentorat STIM", cohorts: 6, mentees: 1200, cycle: "Jan – Déc 2026", status: "En cours" },
  { name: "Découverte Primaire", cohorts: 4, mentees: 540, cycle: "Fév – Juin 2026", status: "En cours" },
  { name: "Campus numérique", cohorts: 3, mentees: 420, cycle: "Mars – Août 2026", status: "En cours" },
  { name: "Leadership jeunes femmes", cohorts: 2, mentees: 240, cycle: "Sept – Déc 2026", status: "À venir" },
];

export const matchingSuggestions = [
  { mentee: "Ndeye Fall", level: "1ère S", interest: "Robotique", suggestedMentor: "Kadidia Traoré", score: 92 },
  { mentee: "Awa Camara", level: "Licence 2", interest: "Data science", suggestedMentor: "Sarah N'Guessan", score: 88 },
  { mentee: "Bintou Diarra", level: "Terminale", interest: "Génie civil", suggestedMentor: "Julie Amoussou", score: 84 },
];

export const pairings = [
  { mentee: "Aïcha Diallo", mentor: "Fatou Konaté", program: "Mentorat STIM", sessions: 6, status: "Actif" },
  { mentee: "Mariam Sow", mentor: "Fatou Konaté", program: "Campus numérique", sessions: 3, status: "Actif" },
  { mentee: "Ndeye Fall", mentor: "—", program: "Mentorat STIM", sessions: 0, status: "En attente de matching" },
];

export const groups = [
  { name: "Cohorte Lycée Abidjan 2026", type: "Automatique", members: 42, status: "Actif" },
  { name: "Atelier Robotique — Projet pilote", type: "Travail", members: 18, status: "Actif" },
  { name: "Mentorat collectif — Data science", type: "Mentorat", members: 12, status: "En validation" },
];

export const cmsPages = [
  { title: "Accueil", type: "Page", updated: "2026-07-10", status: "Publié" },
  { title: "Lancement de la cohorte 2026", type: "Article", updated: "2026-07-05", status: "Publié" },
  { title: "Nouveau partenariat Fondation Numérique", type: "Article", updated: "2026-06-28", status: "Brouillon" },
  { title: "Programmes", type: "Page", updated: "2026-06-20", status: "Publié" },
];

export const reports = [
  { name: "Rapport trimestriel — Q2 2026", program: "Tous programmes", format: "PDF" },
  { name: "Export utilisatrices actives", program: "Mentorat STIM", format: "CSV" },
  { name: "Indicateurs bailleur — Fondation Numérique", program: "Campus numérique", format: "PDF" },
];

export const signalements = [
  { id: "#482", context: "Messagerie — binôme mentorat", reporter: "Aïcha Diallo", status: "En cours", date: "2026-07-13" },
  { id: "#479", context: "Groupe — Atelier Robotique", reporter: "Mariam Sow", status: "Résolu", date: "2026-07-08" },
  { id: "#471", context: "Messagerie — binôme mentorat", reporter: "Ndeye Fall", status: "Résolu", date: "2026-06-30" },
];

export const auditLogs = [
  { actor: "Administratrice STF", action: "Validation compte mentore", target: "Sarah N'Guessan", time: "2026-07-14 09:12" },
  { actor: "Fatou Konaté (Mentore)", action: "Consultation profil mentée", target: "Aïcha Diallo", time: "2026-07-14 08:40" },
  { actor: "Administratrice STF", action: "Suspension compte", target: "Compte test #0093", time: "2026-07-13 17:02" },
  { actor: "Système", action: "Signalement créé", target: "Binôme #482", time: "2026-07-13 15:55" },
];

export const roles = [
  { name: "Administratrice STF", access: "Accès global, rôles, permissions, sécurité", mfa: true },
  { name: "Collaboratrice STF", access: "Selon mission : suivi, contenu, données, modération", mfa: false },
  { name: "Mentore", access: "Mentées affectées, sessions, messagerie", mfa: false },
  { name: "Mentée", access: "Profil, mentorat, modules, projets", mfa: false },
  { name: "Bailleur / partenaire", access: "Données agrégées et rapports autorisés", mfa: false },
];
