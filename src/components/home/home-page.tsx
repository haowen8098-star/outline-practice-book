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

import { HeroAnimatedPreview } from "./hero-animated-preview";
import { OutlineWorkbench } from "./outline-workbench";

const iconMap = {
  title: PanelsTopLeft,
  journal: Heart,
  notes: NotebookPen,
  blackboard: BookOpenText,
  decor: FileText,
};

const HERO_SAMPLE_TEXT = "宝宝手帐\n空心字";
const HERO_STYLE_ID = "light-modern" as const;

export function HomePageContent({ initialState }: { initialState: SearchState }) {
  const activeHeroStyle = getStyleById(HERO_STYLE_ID);

  return (
    <div className="space-y-12 pb-24 pt-6 sm:space-y-14">
      <section className="page-shell">
        <div className="hero-stage overflow-hidden px-6 py-8 sm:px-10 sm:py-10 xl:px-12 xl:py-12">
          <div className="grid items-center gap-8 xl:grid-cols-[0.62fr_1.38fr] xl:gap-5">
            <div className="space-y-7 xl:ml-auto xl:max-w-[34rem] xl:pr-5 xl:pb-8">
              <span className="inline-flex rounded-full bg-[color:var(--soft-mint)] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[color:var(--primary-strong)]">
                中文空心字参考
              </span>

              <div className="space-y-5">
                <h1 className="max-w-[10.8ch] text-[clamp(3.05rem,4.85vw,5.15rem)] font-semibold leading-[0.92] tracking-[-0.072em] text-[color:var(--foreground)]">
                  <span className="block whitespace-nowrap">轻松改写</span>
                  <span className="block whitespace-nowrap">
                    手抄<span className="hero-gradient-text">空心字。</span>
                  </span>
                </h1>
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
                  className="button-pop inline-flex items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-white/88 px-5 py-3 text-base font-semibold text-[color:var(--foreground)]"
                >
                  先看写法指南
                </Link>
              </div>
            </div>

            <div className="hero-visual-shell w-full xl:-ml-6">
              <div
                className="hero-board hero-board--stage overflow-hidden rounded-[38px] border border-white/70 p-4 sm:p-5 lg:p-6"
                style={{
                  background: `linear-gradient(145deg, ${activeHeroStyle.background.from} 0%, ${activeHeroStyle.background.via} 54%, ${activeHeroStyle.background.to} 100%)`,
                }}
              >
                <HeroAnimatedPreview text={HERO_SAMPLE_TEXT} style={activeHeroStyle} />
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
