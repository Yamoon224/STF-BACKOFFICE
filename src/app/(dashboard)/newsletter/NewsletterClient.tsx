"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { TrashIcon } from "@/components/ui/Icons";
import { formatDateTime } from "@/lib/format";
import { deleteNewsletterSubscriberAction } from "@/lib/actions/admin";
import type { NewsletterSubscriber } from "@/lib/types";

export function NewsletterClient({
  subscribers,
  pagination,
}: {
  subscribers: NewsletterSubscriber[];
  pagination: { currentPage: number; lastPage: number; total: number; perPage: number };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete(subscriber: NewsletterSubscriber) {
    if (!confirm(`Supprimer ${subscriber.email} de la liste des abonnées ?`)) return;
    startTransition(async () => {
      await deleteNewsletterSubscriberAction(subscriber.id);
    });
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-border-subtle dark:text-slate-500">
              <th className="py-3">Email</th>
              <th className="py-3">Nom</th>
              <th className="py-3">Statut</th>
              <th className="py-3">Abonnée le</th>
              <th className="py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id}>
                <td className="py-4 font-medium text-stf-navy dark:text-white">{subscriber.email}</td>
                <td className="py-4 text-slate-500 dark:text-slate-400">{subscriber.name ?? "—"}</td>
                <td className="py-4">
                  <Badge tone={subscriber.status === "actif" ? "green" : "neutral"}>
                    {subscriber.status === "actif" ? "Actif" : "Désabonnée"}
                  </Badge>
                </td>
                <td className="py-4 text-slate-500 dark:text-slate-400">{formatDateTime(subscriber.subscribed_at)}</td>
                <td className="py-4 text-right">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleDelete(subscriber)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-stf-red/30 px-3 py-1.5 text-xs font-semibold text-stf-red hover:bg-stf-red-light disabled:opacity-50 dark:hover:bg-stf-red/15"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 dark:text-slate-500">
                  Aucune abonnée pour le moment.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <Pagination
        page={pagination.currentPage}
        totalPages={pagination.lastPage}
        total={pagination.total}
        pageSize={pagination.perPage}
        onChange={(page) => router.push(`/newsletter?page=${page}`)}
      />
    </Card>
  );
}
