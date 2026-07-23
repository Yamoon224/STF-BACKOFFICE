import { apiFetch } from "@/lib/api";
import type { NewsletterSubscriber, Paginated } from "@/lib/types";
import { NewsletterClient } from "./NewsletterClient";

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const subscribers = await apiFetch<Paginated<NewsletterSubscriber>>(
    `/newsletter/subscribers${page ? `?page=${page}` : ""}`
  );

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Personnes abonnées à la newsletter STF via le site vitrine.
      </p>

      <NewsletterClient
        subscribers={subscribers.data}
        pagination={{
          currentPage: subscribers.current_page,
          lastPage: subscribers.last_page,
          total: subscribers.total,
          perPage: subscribers.per_page,
        }}
      />
    </div>
  );
}
