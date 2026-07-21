import { apiFetch } from "@/lib/api";
import type { CmsPage, Faq, PageSection, Partner, Scholarship, SiteSettings, Testimonial } from "@/lib/types";
import { CmsClient } from "./CmsClient";

export default async function CmsPagesPage() {
  const [cmsPages, partners, scholarships, testimonials, faqs, siteSettings, pageSections] = await Promise.all([
    apiFetch<CmsPage[]>("/cms/pages"),
    apiFetch<Partner[]>("/partners"),
    apiFetch<Scholarship[]>("/scholarships"),
    apiFetch<Testimonial[]>("/testimonials"),
    apiFetch<Faq[]>("/faqs"),
    apiFetch<SiteSettings>("/site-settings"),
    apiFetch<PageSection[]>("/page-sections"),
  ]);

  return (
    <CmsClient
      cmsPages={cmsPages}
      partners={partners}
      scholarships={scholarships}
      testimonials={testimonials}
      faqs={faqs}
      siteSettings={siteSettings}
      pageSections={pageSections}
    />
  );
}
