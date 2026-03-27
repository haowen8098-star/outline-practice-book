import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { guidePages } from "@/content/guides";
import { getStyleById } from "@/lib/content";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "手账空心字写法指南",
  description:
    "按手账场景浏览空心字教程：新手入门、工整标题、可爱页签、阴影字和封面大标题，每一页都能直接照着练。",
  path: "/guides",
  keywords: ["手账空心字", "手账标题字", "手账阴影字", "可爱空心字", "手账写法指南"],
});

export default function GuidesIndexPage() {
  return (
    <div className="page-shell space-y-8 pb-20 pt-8">
      <section className="section-card overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold tracking-[0.18em] text-[color:var(--primary-strong)]">手账写法指南</p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
            想写日记标题、月计划页签或封面大字，先挑最像你本子的那一页。
          </h1>
          <p className="text-lg leading-8 text-[color:var(--muted-foreground)]">
            每一页都把适合页面、下笔顺序、常见错误和小女生手账里最常搜的问题整理好了，点开就能直接照着练。
          </p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {guidePages.map((guide) => {
          const style = getStyleById(guide.recommendedStyle);
          return (
            <article key={guide.slug} className="section-card p-6">
              <p className="text-sm font-semibold tracking-[0.18em] text-[color:var(--primary-strong)]">{style.name}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">{guide.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted-foreground)]">{guide.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {guide.scenes.map((scene) => (
                  <span key={scene} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[color:var(--muted-foreground)]">
                    {scene}
                  </span>
                ))}
              </div>
              <Link
                href={`/guides/${guide.slug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[color:var(--primary-strong)] px-4 py-2 text-sm font-semibold text-white"
              >
                进入指南
                <ArrowRight className="size-4" />
              </Link>
            </article>
          );
        })}
      </section>
    </div>
  );
}
