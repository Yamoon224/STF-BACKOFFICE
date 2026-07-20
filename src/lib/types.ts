export type UserRef = {
  id: number;
  name: string;
  email: string;
};

/** Shape of a Laravel paginator response. */
export type Paginated<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  status: "pending" | "active" | "suspended";
  country: string | null;
  phone: string | null;
  locale: string;
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
  cohort_id: number | null;
  status: "en_attente" | "actif" | "pause" | "termine";
  match_score: number | null;
  notes: string | null;
  mentee: UserRef;
  mentor: UserRef | null;
  program: { id: number; name: string };
  sessions_realisees_count?: number;
};

export type MentorshipSession = {
  id: number;
  pairing_id: number;
  scheduled_at: string;
  duration_minutes: number | null;
  status: "en_attente" | "confirmee" | "realisee" | "annulee";
  topic: string | null;
  location_or_link: string | null;
  pairing: {
    id: number;
    mentee: UserRef;
    mentor: UserRef | null;
  };
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

export type GroupMember = UserRef & {
  pivot: { role_in_group: "membre" | "animatrice"; joined_at: string };
};

export type GroupDetail = Group & {
  members: GroupMember[];
};

export type CmsPage = {
  id: number;
  title: string;
  slug: string;
  type: "page" | "article";
  status: "brouillon" | "publie";
  category: string | null;
  body?: string | null;
  excerpt?: string | null;
  updated_at: string;
};

export type Partner = {
  id: number;
  name: string;
  logo_path: string | null;
  logo_url: string | null;
  url: string | null;
  order: number;
};

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  quote: string;
  program_id: number | null;
  order: number;
};

export type Faq = {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  order: number;
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

export type SiteSettings = Record<string, string | null>;

export type PageSectionType =
  | "hero"
  | "text"
  | "list_title_description"
  | "list_role_mission"
  | "list_title_text"
  | "list_label_value"
  | "list_text";

export type PageSection = {
  id: number;
  page_key: string;
  section_key: string;
  type: PageSectionType;
  payload: Record<string, unknown>;
  order: number;
};

export type Level = {
  id: number;
  name: string;
  slug: string;
  order: number;
};

export type Subject = {
  id: number;
  name: string;
  slug: string;
};

export type Course = {
  id: number;
  level_id: number;
  subject_id: number;
  title: string;
  description: string | null;
  order: number;
  status: "brouillon" | "publie";
};

export type Experiment = {
  id: number;
  subject_id: number;
  level_id: number | null;
  course_id: number | null;
  title: string;
  description: string | null;
  instructions: string | null;
  order: number;
  status: "brouillon" | "publie";
};

export type LiveSession = {
  id: number;
  course_id: number;
  title: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_link: string | null;
  status: "a_venir" | "en_cours" | "termine";
};
