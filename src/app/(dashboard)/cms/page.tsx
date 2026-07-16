import { apiFetch } from "@/lib/api";
import type { CmsPage } from "@/lib/types";
import { CmsClient } from "./CmsClient";

export default async function CmsPagesPage() {
  const cmsPages = await apiFetch<CmsPage[]>("/cms/pages");

  return <CmsClient cmsPages={cmsPages} />;
}
