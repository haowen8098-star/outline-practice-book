import Link from "next/link";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";

import { practicePaperOptions } from "@/content/styles";
import { OutlinePreviewSvg } from "@/components/outline/outline-preview-svg";
import { PrintActions } from "@/components/site/print-actions";
import { getStyleById } from "@/lib/content";
import { createPageMetadata } from "@/lib/site";
import { readSearchState } from "@/lib/outline";

export const metadata = createPageMetadata({
  title: "打印参考页",
  description: "把当前空心字风格整理成 A4 练习参考页，方便照着写和临摹。",
  path: "/print",
});

export default async function PrintPage({
  searchParams,
}: {
  searchParams: Promise<{ text?: string; style?: string; paper?: string }>;
}) {
  const state = readSearchState(await searchParams);
  const style = getStyleById(state.style);
  const paper = practicePaperOptions.find((option) => option.id === state.paper) ?? practicePaperOptions[0];
  const paperClass = state.paper === "dot" ? "dot-page" : "print-page";
  const returnHref = `/?style=${state.style}&text=${encodeURIComponent(state.text)}&paper=${state.paper}`;

  return (
    <div className="page-shell space-y-6 pb-20 pt-8">
      <section className="print-hidden section-card flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link href={returnHref} className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--primary-strong)]">
            <ArrowLeft className="size-4" />
            返回工具页
          </Link>
          <span className="rounded-full bg-[color:var(--soft-mint)] px-3 py-1 text-xs font-semibold text-[color:var(--primary-strong)]">
            {paper.label}
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[color:var(--pill-text)]">{style.name}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PrintActions />
          <Link
            href={returnHref}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]"
          >
            <Download className="size-4" />
            继续调整
          </Link>
        </div>
      </section>

      <section className={`section-card overflow-hidden p-6 sm:p-8 ${paperClass}`}>
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="section-kicker">A4 打印参考页</p>
              <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--foreground)]">{style.name}</h1>
              <p className="text-base leading-8 text-[color:var(--muted-foreground)]">
                {state.text} 这组字已经按 {style.name} 整理成可以照着写的参考页。先看左边成品，再按右边步骤慢慢写。
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/88 px-3 py-1 text-xs font-medium text-[color:var(--pill-text)]">
                  建议先临摹 2 次，再自己默写 1 次
                </span>
                <span className="rounded-full bg-white/88 px-3 py-1 text-xs font-medium text-[color:var(--pill-text)]">
                  当前底纸：{paper.label}
                </span>
              </div>
            </div>

            <div
              className="overflow-hidden rounded-[30px] border border-white/80 p-4 shadow-[0_28px_58px_rgba(133,162,145,0.14)]"
              style={{
                background: `linear-gradient(145deg, ${style.background.from} 0%, ${style.background.via} 52%, ${style.background.to} 100%)`,
              }}
            >
              <div className="mb-4 flex items-center justify-between gap-3 px-1">
                <div>
                  <p className="section-kicker">参考成品</p>
                  <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">先看整体字距和留白，再开始临摹。</p>
                </div>
                <span className="rounded-full bg-white/88 px-3 py-1 text-xs font-semibold text-[color:var(--primary-strong)]">
                  先看整体
                </span>
              </div>
              <OutlinePreviewSvg text={state.text} style={style} paper={state.paper} className="w-full" />
            </div>

            <div className="soft-panel p-5">
              <p className="section-kicker">临摹提醒</p>
              <div className="mt-4 grid gap-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
                <p>
                  <span className="font-semibold text-[color:var(--foreground)]">先写什么：</span>
                  {style.penTips.startingMethod}
                </p>
                <p>
                  <span className="font-semibold text-[color:var(--foreground)]">容易挤的地方：</span>
                  {style.penTips.crowdedParts}
                </p>
                <p>
                  <span className="font-semibold text-[color:var(--foreground)]">适合的笔：</span>
                  {style.penTips.penAdvice}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <article className="soft-panel p-5">
              <p className="section-kicker">四步照着写</p>
              <ol className="mt-4 grid gap-4">
                {style.teachingSteps.map((step, index) => (
                  <li key={step.title} className="rounded-[22px] bg-white px-4 py-4 shadow-[0_18px_36px_rgba(130,160,144,0.1)]">
                    <p className="section-kicker">STEP {index + 1}</p>
                    <h2 className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">{step.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">{step.description}</p>
                  </li>
                ))}
              </ol>
            </article>

            <article className="soft-panel p-5">
              <p className="section-kicker">练习格</p>
              <div className="mt-4 grid gap-4">
                {[1, 2].map((index) => (
                  <div
                    key={index}
                    className={paperClass + " rounded-[22px] border border-dashed border-[color:var(--primary-strong)]/25 bg-white/90 p-4"}
                  >
                    <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--muted-foreground)]">第 {index} 次尝试</p>
                    <div className="mt-4">
                      <OutlinePreviewSvg text={state.text} style={style} paper={state.paper} compact mode="source" className="w-full opacity-70" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 rounded-[18px] bg-white px-4 py-3 text-sm leading-7 text-[color:var(--muted-foreground)] shadow-[0_12px_28px_rgba(130,160,144,0.08)]">
                先临摹一遍字块和字距，再自己写第二遍。第二遍如果觉得某个字一直挤，先缩小骨架，不要急着把外轮廓画厚。
              </p>
            </article>
          </div>
        </div>

        <div className="print-hidden mt-6 flex justify-end">
          <Link href={returnHref} className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--primary-strong)]">
            回到工具页继续调整
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
