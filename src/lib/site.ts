import type { Metadata } from "next";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function resolveSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  if (!raw) {
    return "https://outline-practice-book.example";
  }

  return raw.startsWith("http") ? raw : `https://${raw}`;
}

export const siteConfig = {
  name: "空心字练习本",
  shortName: "空心字",
  titleTemplate: "%s | 空心字练习本",
  description: "把普通文字变成能照着写的空心字参考，提供中文优先的风格预览、手写步骤和打印练习页。",
  url: resolveSiteUrl(),
  locale: "zh_CN",
};

export const navItems = [
  { href: "/", label: "首页" },
  { href: "/guides", label: "写法指南" },
  { href: "/print", label: "打印参考页" },
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

interface MetadataInput {
  title: string;
  description: string;
  path: string;
}

export function createPageMetadata({ title, description, path }: MetadataInput): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
  };
}

export function buildSoftwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CNY",
    },
  };
}

export function buildFaqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildHowToJsonLd(title: string, description: string, path: string, steps: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description,
    url: absoluteUrl(path),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step,
    })),
  };
}
