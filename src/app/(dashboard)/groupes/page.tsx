import { apiFetch } from "@/lib/api";
import type { Group } from "@/lib/types";
import { GroupesClient } from "./GroupesClient";

export default async function GroupesPage() {
  const groups = await apiFetch<Group[]>("/groups");

  return <GroupesClient groups={groups} />;
}
