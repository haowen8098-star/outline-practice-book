import { guidePages } from "@/content/guides";
import { outlineStyles } from "@/content/styles";
import type { GuideSlug, OutlineStyleId } from "@/types/site";

export function getStyleById(styleId: OutlineStyleId) {
  return outlineStyles.find((style) => style.id === styleId) ?? outlineStyles[0];
}

export function getGuideBySlug(slug: GuideSlug) {
  return guidePages.find((guide) => guide.slug === slug) ?? guidePages[0];
}

export function getGuideHref(slug: GuideSlug) {
  return `/guides/${slug}`;
}
