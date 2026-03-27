import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { guidePages } from "@/content/guides";
import { getStyleById } from "@/lib/content";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "空心字写法指南",
  description: "按场景浏览中文空心字写法：入门、课堂标题、手账装饰和黑板报大标题，各自都有适合普通人的步骤拆解。",
  path: "/guides",
});

export default function GuidesIndexPage() {
  return (
    <div className="page-shell space-y-8 pb-20 pt-8">
      <section className="section-card overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold tracking-[0.18em] text-[color:var(--primary-strong)]">中文写法指南</p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
            想把某一类空心字写稳，先看场景对应的写法拆解。
          </h1>
          <p className="text-lg leading-8 text-[color:var(--muted-foreground)]">
            每一页都把适合场景、起笔顺序和最容易写歪的地方整理好了，翻到哪一页都能直接照着练。
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
