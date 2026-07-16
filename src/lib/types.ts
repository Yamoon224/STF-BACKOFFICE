export type UserRef = {
  id: number;
  name: string;
  email: string;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  status: "pending" | "active" | "suspended";
  country: string | null;
  roles: { name: string }[];
  mentor_profile: { id: number; expertise: string; capacity: number; validated_at: string | null } | null;
  mentee_profile: { id: number; level: string | null } | null;
};

export type Program = {
  id: number;
  name: string;
  slug: string;
  audience: string | null;
  status: "a_venir" | "en_cours" | "archive";
  cycle_start: string | null;
  cycle_end: string | null;
  cohorts_count?: number;
  mentees_count?: number;
};

export type Cohort = {
  id: number;
  program_id: number;
  name: string;
  start_date: string | null;
  end_date: string | null;
  status: "a_venir" | "en_cours" | "termine";
  program?: Program;
};

export type MentorshipPairing = {
  id: number;
  mentee_id: number;
  mentor_id: number | null;
  program_id: number;
  status: "en_attente" | "actif" | "pause" | "termine";
  match_score: number | null;
  mentee: UserRef;
  mentor: UserRef | null;
  program: { id: number; name: string };
  sessions_realisees_count?: number;
};

export type MatchingSuggestion = {
  pairing_id: number;
  mentee: UserRef;
  program: { id: number; name: string };
  suggested_mentor: UserRef | null;
  score: number | null;
};

export type Group = {
  id: number;
  name: string;
  type: "automatique" | "travail" | "mentorat";
  status: "en_validation" | "actif" | "archive";
  members_count?: number;
};

export type CmsPage = {
  id: number;
  title: string;
  slug: string;
  type: "page" | "article";
  status: "brouillon" | "publie";
  category: string | null;
  updated_at: string;
};

export type Report = {
  id: number;
  reporter_id: number;
  context_type: string;
  context_id: number | null;
  description: string;
  status: "nouveau" | "en_cours" | "resolu";
  created_at: string;
  reporter: UserRef;
};

export type AuditLog = {
  id: number;
  actor_id: number | null;
  action: string;
  target_type: string | null;
  target_id: number | null;
  meta: Record<string, unknown> | null;
  created_at: string;
  actor: UserRef | null;
};

export type Role = {
  id: number;
  name: string;
  permissions: string[];
};

export type Kpis = {
  active_mentees: number;
  validated_mentors: number;
  active_pairings: number;
  sessions_this_month: number;
};

export type Alerts = {
  pending_mentors: number;
  open_reports: number;
  inactive_pairings: number;
};

export type ActivityByProgram = {
  id: number;
  name: string;
  mentees_count: number;
  sessions_count: number;
};
