import { apiFetch } from "@/lib/api";
import type { CmsPage, Faq, Partner, Testimonial } from "@/lib/types";
import { CmsClient } from "./CmsClient";

export default async function CmsPagesPage() {
  const [cmsPages, partners, testimonials, faqs] = await Promise.all([
    apiFetch<CmsPage[]>("/cms/pages"),
    apiFetch<Partner[]>("/partners"),
    apiFetch<Testimonial[]>("/testimonials"),
    apiFetch<Faq[]>("/faqs"),
  ]);

  return <CmsClient cmsPages={cmsPages} partners={partners} testimonials={testimonials} faqs={faqs} />;
}
