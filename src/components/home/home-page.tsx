import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  FileText,
  Heart,
  NotebookPen,
  PanelsTopLeft,
} from "lucide-react";

import { guidePages } from "@/content/guides";
import { faqItems, scenarioRecommendations } from "@/content/styles";
import { getGuideHref, getStyleById } from "@/lib/content";
import type { SearchState } from "@/types/site";

import { OutlinePreviewSvg } from "../outline/outline-preview-svg";
import { OutlineWorkbench } from "./outline-workbench";

const iconMap = {
  title: PanelsTopLeft,
  journal: Heart,
  notes: NotebookPen,
  blackboard: BookOpenText,
  decor: FileText,
};

const HERO_SAMPLE_TEXT = "宝宝手帐空心字";
const HERO_STYLE_ID = "light-modern" as const;

export function HomePageContent({ initialState }: { initialState: SearchState }) {
  const activeHeroStyle = getStyleById(HERO_STYLE_ID);

  return (
    <div className="space-y-12 pb-24 pt-6 sm:space-y-14">
      <section className="page-shell">
        <div className="overflow-hidden rounded-[42px] border border-[color:var(--border-soft)] bg-[color:var(--surface)] shadow-[var(--shadow-strong)]">
          <div className="grid gap-0 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="order-2 px-6 py-8 sm:px-10 sm:py-10 lg:order-1 lg:px-12 lg:py-12">
              <div className="space-y-6">
                <span className="inline-flex rounded-full bg-[color:var(--soft-mint)] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[color:var(--primary-strong)]">
                  中文空心字参考
                </span>

                <div className="space-y-5">
                  <h1 className="text-balance text-[2.95rem] font-semibold tracking-tight text-[color:var(--foreground)] sm:text-[4.7rem]">
                    把普通字，变成
                    <span className="hero-gradient-text">清楚好抄</span>
                    的空心字。
                  </h1>
                  <p className="max-w-xl text-lg leading-9 text-[color:var(--muted-foreground)]">
                    先看轮廓，再挑写法。想照着练时，直接切到打印参考页就可以。
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="#workbench"
                    className="button-pop inline-flex items-center gap-2 rounded-full bg-[color:var(--primary-strong)] px-5 py-3 text-base font-semibold text-white shadow-[0_16px_36px_rgba(98,137,120,0.2)]"
                  >
                    现在试写
                    <ArrowRight className="size-5" />
                  </Link>
                  <Link
                    href="/guides"
                    className="button-pop inline-flex items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-white px-5 py-3 text-base font-semibold text-[color:var(--foreground)]"
                  >
                    先看写法指南
                  </Link>
                </div>

                <div className="grid gap-3 border-t border-[color:var(--border-soft)] pt-6 sm:grid-cols-3">
                  {[
                    { label: "适合场景", value: "标题 / 手账 / 笔记" },
                    { label: "看什么", value: "轮廓清不清楚" },
                    { label: "下一步", value: "再决定怎么写" },
                  ].map((item) => (
                    <div key={item.label} className="space-y-1">
                      <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--primary-strong)]">{item.label}</p>
                      <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-1 border-b border-[color:var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,253,248,0.98),rgba(248,244,235,0.92))] px-5 py-6 sm:px-8 sm:py-8 lg:order-2 lg:border-b-0 lg:border-l lg:border-t-0 lg:px-10 lg:py-10">
              <div className="grid h-full gap-6 xl:grid-cols-[0.22fr_0.78fr] xl:items-center">
                <div className="flex flex-row flex-wrap gap-2 xl:flex-col xl:gap-3">
                  {[
                    { label: "预览样张", value: activeHeroStyle.name },
                    { label: "看轮廓", value: "别先看颜色" },
                    { label: "写之前", value: "先判断清不清楚" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[20px] border border-[color:var(--border-soft)] bg-white px-4 py-3 xl:px-4 xl:py-4">
                      <p className="text-[11px] font-semibold tracking-[0.18em] text-[color:var(--primary-strong)]">{item.label}</p>
                      <p className="mt-1 text-sm leading-6 text-[color:var(--foreground)]">{item.value}</p>
                    </div>
                  ))}
                </div>

                <article className="overflow-hidden rounded-[34px] border border-[color:var(--border-soft)] bg-white p-4 sm:p-5">
                  <div
                    className="hero-board overflow-hidden rounded-[30px] border border-[color:var(--border-soft)] p-4 shadow-[0_16px_40px_rgba(129,158,142,0.08)]"
                    style={{
                      background: `linear-gradient(145deg, ${activeHeroStyle.background.from} 0%, ${activeHeroStyle.background.via} 54%, ${activeHeroStyle.background.to} 100%)`,
                    }}
                  >
                    <OutlinePreviewSvg text={HERO_SAMPLE_TEXT} style={activeHeroStyle} mode="animated" className="w-full" />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[color:var(--border-soft)] pt-4">
                    {["轻骨架", "外扩轮廓", "成字轮廓"].map((label) => (
                      <span key={label} className="text-xs font-semibold tracking-[0.16em] text-[color:var(--primary-strong)]">
                        {label}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted-foreground)]">
                    先把字写小一点，再沿外侧包边，最后修顺转角，空心字会更清楚。
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell">
        <OutlineWorkbench initialState={initialState} />
      </section>

      <section className="page-shell section-card p-5 sm:p-6">
        <div className="max-w-3xl space-y-3">
          <p className="section-kicker">使用场景推荐</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
            不同场景适合的写法不一样，先按用途挑会更省事。
          </h2>
          <p className="text-base leading-8 text-[color:var(--muted-foreground)]">
            你先决定它是写在课堂标题、手账栏目、工整笔记，还是黑板报大标题上，再选风格，往往会比“先挑最好看”更稳。
          </p>
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-5">
          {scenarioRecommendations.map((scenario) => {
            const Icon = iconMap[scenario.id as keyof typeof iconMap];
            const style = getStyleById(scenario.styleId);

            return (
              <article key={scenario.id} className="soft-panel interactive-card p-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-[color:var(--soft-mint)] text-[color:var(--primary-strong)]">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-[color:var(--foreground)]">{scenario.title}</h3>
                    <p className="text-xs text-[color:var(--muted-foreground)]">{style.name}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted-foreground)]">{scenario.description}</p>
                <p className="mt-4 rounded-[18px] bg-[color:var(--soft-cream)] px-4 py-3 text-sm leading-7 text-[color:var(--foreground)]">
                  {scenario.recommendation}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="page-shell section-card p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl space-y-3">
            <p className="section-kicker">写法指南</p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
              如果你想把某一类空心字写稳，先看对应的中文指南页。
            </h2>
          </div>
          <Link href="/guides" className="text-sm font-semibold text-[color:var(--primary-strong)]">
            查看全部指南
          </Link>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {guidePages.map((guide) => (
            <article key={guide.slug} className="soft-panel interactive-card p-6">
              <p className="section-kicker">Guide</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">{guide.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">{guide.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {guide.scenes.map((scene) => (
                  <span key={scene} className="rounded-full bg-[color:var(--soft-mint)] px-3 py-1 text-xs font-medium text-[color:var(--primary-strong)]">
                    {scene}
                  </span>
                ))}
              </div>
              <Link
                href={getGuideHref(guide.slug)}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--primary-strong)]"
              >
                去看完整写法
                <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className="page-shell section-card p-5 sm:p-6">
        <div className="max-w-3xl space-y-3">
          <p className="section-kicker">常见问题</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
            写中文空心字时，最容易卡住的地方都在这里。
          </h2>
        </div>
        <div className="mt-6 grid gap-4">
          {faqItems.map((item) => (
            <details key={item.question} className="soft-panel interactive-card p-5">
              <summary className="cursor-pointer list-none text-lg font-semibold text-[color:var(--foreground)]">
                {item.question}
              </summary>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted-foreground)]">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="page-shell">
        <div className="section-card overflow-hidden px-5 py-7 sm:px-8 sm:py-8">
          <div className="grid items-center gap-5 md:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-3">
              <p className="section-kicker">收尾动作</p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
                先挑一种风格练顺手，再去扩展更多场景，空心字就会越来越像你自己的字。
              </h2>
              <p className="text-base leading-8 text-[color:var(--muted-foreground)]">
                如果你现在就要抄到本子上，直接去打印参考页会最快；如果你想把某类字练稳，先去对应指南页看完整步骤。
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                href={`/print?style=${initialState.style}&text=${encodeURIComponent(initialState.text)}&paper=${initialState.paper}`}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--primary-strong)] px-5 py-3 text-base font-semibold text-white"
              >
                打印练习页
                <ArrowRight className="size-5" />
              </Link>
              <Link
                href="/guides"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-base font-semibold text-[color:var(--foreground)]"
              >
                浏览全部指南
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
