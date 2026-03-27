import type { MetadataRoute } from "next";

import { guidePages } from "@/content/guides";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: "2026-03-27",
    },
    {
      url: absoluteUrl("/guides"),
      lastModified: "2026-03-27",
    },
    {
      url: absoluteUrl("/print"),
      lastModified: "2026-03-27",
    },
    ...guidePages.map((guide) => ({
      url: absoluteUrl(`/guides/${guide.slug}`),
      lastModified: "2026-03-27",
    })),
  ];
}
