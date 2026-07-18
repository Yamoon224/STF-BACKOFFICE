import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { apiFetch } from "@/lib/api";
import { statusLabel } from "@/lib/format";
import type { AdminUser, GroupDetail } from "@/lib/types";
import { GroupMembersClient } from "./GroupMembersClient";

export default async function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [group, users] = await Promise.all([
    apiFetch<GroupDetail>(`/groups/${id}`),
    apiFetch<{ data: AdminUser[] }>("/users"),
  ]);

  return (
    <div className="space-y-6">
      <Link href="/groupes" className="text-sm font-semibold text-stf-blue hover:text-stf-orange">
        ← Retour aux groupes
      </Link>

      <Card>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-stf-navy dark:text-white">{group.name}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {statusLabel(group.type)} · {group.members.length} membre(s)
            </p>
          </div>
          <Badge tone={group.status === "actif" ? "green" : group.status === "archive" ? "neutral" : "orange"}>
            {statusLabel(group.status)}
          </Badge>
        </div>
      </Card>

      <Card title="Membres">
        <GroupMembersClient group={group} allUsers={users.data} />
      </Card>
    </div>
  );
}
