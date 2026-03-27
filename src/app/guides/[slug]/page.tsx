import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { guidePages } from "@/content/guides";
import { exampleTexts } from "@/content/styles";
import { OutlinePreviewSvg } from "@/components/outline/outline-preview-svg";
import { StructuredData } from "@/components/site/structured-data";
import { getStyleById } from "@/lib/content";
import { buildHowToJsonLd, createPageMetadata } from "@/lib/site";

export function generateStaticParams() {
  return guidePages.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = guidePages.find((item) => item.slug === slug);

  if (!guide) {
    return createPageMetadata({
      title: "写法指南",
      description: "中文空心字写法指南。",
      path: "/guides",
    });
  }

  return createPageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
  });
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guidePages.find((item) => item.slug === slug);

  if (!guide) {
    notFound();
  }

  const recommendedStyle = getStyleById(guide.recommendedStyle);
  const previewText =
    guide.slug === "title-outline"
      ? "课堂重点标题"
      : guide.slug === "journal-outline"
        ? "今日手账页签"
        : guide.slug === "blackboard-outline"
          ? "班级活动主题"
          : exampleTexts[0];
  const backHref = `/?style=${recommendedStyle.id}&text=${encodeURIComponent(previewText)}&paper=grid`;

  return (
    <div className="page-shell space-y-8 pb-20 pt-8">
      <StructuredData
        data={buildHowToJsonLd(
          guide.howToName,
          guide.description,
          `/guides/${guide.slug}`,
          guide.steps.map((step) => `${step.title}：${step.body}`),
        )}
      />

      <section className="section-card overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
        <Link href="/guides" className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--primary-strong)]">
          <ArrowLeft className="size-4" />
          返回指南列表
        </Link>

        <div className="mt-5 grid items-start gap-8 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="space-y-5">
            <p className="text-sm font-semibold tracking-[0.18em] text-[color:var(--primary-strong)]">{recommendedStyle.name}</p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
              {guide.title}
            </h1>
            <p className="text-lg leading-8 text-[color:var(--muted-foreground)]">{guide.intro}</p>
            <div className="flex flex-wrap gap-2">
              {guide.scenes.map((scene) => (
                <span key={scene} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[color:var(--muted-foreground)]">
                  {scene}
                </span>
              ))}
            </div>
          </div>

          <div
            className="overflow-hidden rounded-[30px] border border-white/80 p-4 shadow-[0_28px_58px_rgba(133,162,145,0.14)]"
            style={{
              background: `linear-gradient(140deg, ${recommendedStyle.background.from} 0%, ${recommendedStyle.background.via} 50%, ${recommendedStyle.background.to} 100%)`,
            }}
          >
            <OutlinePreviewSvg text={previewText} style={recommendedStyle} className="w-full" />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <article className="section-card p-6">
          <p className="text-sm font-semibold tracking-[0.18em] text-[color:var(--primary-strong)]">为什么会写歪</p>
          <p className="mt-4 text-base leading-8 text-[color:var(--muted-foreground)]">{guide.problem}</p>
        </article>

        <article className="section-card p-6">
          <p className="text-sm font-semibold tracking-[0.18em] text-[color:var(--primary-strong)]">推荐风格</p>
          <h2 className="mt-3 text-2xl font-semibold text-[color:var(--foreground)]">{recommendedStyle.name}</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">{recommendedStyle.shortDescription}</p>
          <Link
            href={backHref}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[color:var(--primary-strong)] px-4 py-2 text-sm font-semibold text-white"
          >
            带着这个风格回工具页
            <ArrowRight className="size-4" />
          </Link>
        </article>
      </section>

      <section className="section-card p-5 sm:p-6">
        <p className="text-sm font-semibold tracking-[0.18em] text-[color:var(--primary-strong)]">分步写法</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {guide.steps.map((step, index) => (
            <article key={step.title} className="rounded-[26px] bg-white p-5 shadow-[0_22px_44px_rgba(130,160,144,0.12)]">
              <p className="text-sm font-semibold tracking-[0.18em] text-[color:var(--primary-strong)]">STEP {index + 1}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">{step.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card p-5 sm:p-6">
        <p className="text-sm font-semibold tracking-[0.18em] text-[color:var(--primary-strong)]">最容易犯的错误</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {guide.mistakes.map((mistake) => (
            <article key={mistake} className="rounded-[24px] bg-white px-5 py-4 text-sm leading-7 text-[color:var(--muted-foreground)] shadow-[0_18px_36px_rgba(130,160,144,0.1)]">
              {mistake}
            </article>
          ))}
        </div>
        <p className="mt-5 rounded-[22px] bg-white px-5 py-4 text-sm leading-7 text-[color:var(--foreground)] shadow-[0_18px_36px_rgba(130,160,144,0.1)]">
          {guide.closingNote}
        </p>
      </section>
    </div>
  );
}
