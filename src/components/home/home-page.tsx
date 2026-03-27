import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  FileText,
  Heart,
  NotebookPen,
  PanelsTopLeft,
  PenTool,
  Printer,
  Sparkles,
} from "lucide-react";

import { guidePages } from "@/content/guides";
import { faqItems, outlineStyles, scenarioRecommendations } from "@/content/styles";
import { getGuideHref, getStyleById } from "@/lib/content";
import { DEFAULT_SAMPLE_TEXT } from "@/lib/outline";
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

const quickWins = [
  {
    title: "5 套中文风格",
    description: "同一段字可以直接比较 5 种写法，先挑最适合你这一页用途的那一种。",
    icon: Sparkles,
  },
  {
    title: "4 步照着下笔",
    description: "从轻骨架、外扩轮廓到统一线宽和修角留白，一步一步讲给你看。",
    icon: PenTool,
  },
  {
    title: "打印后就能练",
    description: "当前风格可以直接导出 PNG，也能切到 A4 临摹参考页继续写。",
    icon: Printer,
  },
];

export function HomePageContent({ initialState }: { initialState: SearchState }) {
  const activeHeroStyle = getStyleById(initialState.style);

  return (
    <div className="space-y-12 pb-24 pt-6 sm:space-y-14">
      <section className="page-shell">
        <div className="section-card overflow-hidden px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
          <div className="grid items-start gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
            <div className="space-y-7">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[color:var(--soft-blue)] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[color:var(--primary-strong)]">
                  普通字 → 空心字 → 手写教学
                </span>
                <span className="rounded-full bg-[color:var(--soft-mint)] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[color:var(--primary-strong)]">
                  中文优先
                </span>
                <span className="rounded-full bg-[color:var(--soft-cream)] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[color:var(--primary-strong)]">
                  可打印临摹
                </span>
              </div>

              <div className="space-y-5">
                <h1 className="text-balance text-[2.9rem] font-semibold tracking-tight text-[color:var(--foreground)] sm:text-6xl">
                  把普通文字，变成真正能照着写的
                  <span className="hero-gradient-text">中文空心字参考</span>
                  。
                </h1>
                <p className="max-w-2xl text-lg leading-9 text-[color:var(--muted-foreground)]">
                  打开就能输入中文，立刻比较 5 种空心字风格。旁边会同步给出手写步骤、临摹提示和打印参考，方便你直接挑一种顺手的写法开始练。
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="#workbench"
                  className="button-pop inline-flex items-center gap-2 rounded-full bg-[color:var(--primary-strong)] px-5 py-3 text-base font-semibold text-white shadow-[0_24px_48px_rgba(98,137,120,0.22)]"
                >
                  现在试写
                  <ArrowRight className="size-5" />
                </Link>
                <Link
                  href="/guides"
                  className="button-pop inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-base font-semibold text-[color:var(--foreground)] shadow-[0_22px_44px_rgba(130,160,144,0.12)]"
                >
                  先看写法指南
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                {["课堂标题", "手账栏目", "清爽笔记", "手抄报大字", "日记装饰字"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/75 bg-white/72 px-3 py-1.5 text-sm font-medium text-[color:var(--pill-text)]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {quickWins.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article key={item.title} className="soft-panel interactive-card p-4">
                      <span className="flex size-11 items-center justify-center rounded-2xl bg-[color:var(--soft-mint)] text-[color:var(--primary-strong)]">
                        <Icon className="size-5" />
                      </span>
                      <h2 className="mt-4 text-lg font-semibold text-[color:var(--foreground)]">{item.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">{item.description}</p>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 lg:pl-4">
              <article className="soft-panel interactive-card overflow-hidden p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="section-kicker">先看参考板</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
                      中文空心字参考板
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-7 text-[color:var(--muted-foreground)]">
                      先看看版面节奏，再把下面的字换成你自己的内容。风格一切换，参考布局和写法提示都会一起更新。
                    </p>
                  </div>
                  <span className="rounded-full bg-[color:var(--soft-berry)] px-3 py-1.5 text-sm font-semibold text-[color:var(--primary-deep)]">
                    {activeHeroStyle.name}
                  </span>
                </div>

                <div
                  className="hero-board mt-5 overflow-hidden rounded-[30px] border border-white/80 p-4 shadow-[0_26px_56px_rgba(129,158,142,0.12)]"
                  style={{
                    background: `linear-gradient(145deg, ${activeHeroStyle.background.from} 0%, ${activeHeroStyle.background.via} 54%, ${activeHeroStyle.background.to} 100%)`,
                  }}
                >
                  <OutlinePreviewSvg text={DEFAULT_SAMPLE_TEXT} style={activeHeroStyle} mode="animated" className="w-full" />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {["轻骨架", "外扩轮廓", "修角成字"].map((label) => (
                    <span
                      key={label}
                      className="rounded-full bg-white/78 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-[color:var(--primary-strong)]"
                    >
                      {label}
                    </span>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {[
                    {
                      title: "先轻写骨架",
                      body: "起稿写小一点，给外轮廓和留白预留空间。",
                    },
                    {
                      title: "再慢慢包边",
                      body: "保持距离一致，结构会比直接描边更稳。",
                    },
                    {
                      title: "最后修转角",
                      body: "空心字的精致感，往往来自收角和呼吸感。",
                    },
                  ].map((tip) => (
                    <div key={tip.title} className="rounded-[22px] bg-[color:var(--soft-cream)] px-4 py-4">
                      <p className="text-sm font-semibold text-[color:var(--foreground)]">{tip.title}</p>
                      <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">{tip.body}</p>
                    </div>
                  ))}
                </div>
              </article>

              <div className="grid gap-4 sm:grid-cols-2">
                <article className="soft-panel interactive-card overflow-hidden p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="section-kicker">STEP 1</p>
                      <h3 className="mt-1 text-lg font-semibold text-[color:var(--foreground)]">先定位原字结构</h3>
                    </div>
                    <span className="rounded-full bg-[color:var(--soft-mint)] px-3 py-1 text-xs font-semibold text-[color:var(--primary-strong)]">
                      骨架稿
                    </span>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-[24px] bg-[color:var(--soft-blue)]">
                    <OutlinePreviewSvg text={DEFAULT_SAMPLE_TEXT} style={outlineStyles[1]} compact mode="source" className="w-full" />
                  </div>
                </article>

                <article className="soft-panel interactive-card overflow-hidden p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="section-kicker">STEP 2</p>
                      <h3 className="mt-1 text-lg font-semibold text-[color:var(--foreground)]">沿外侧包出轮廓</h3>
                    </div>
                    <span className="rounded-full bg-[color:var(--soft-pink)] px-3 py-1 text-xs font-semibold text-[color:var(--primary-deep)]">
                      外扩示意
                    </span>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-[24px] bg-[color:var(--soft-cream)]">
                    <OutlinePreviewSvg text={DEFAULT_SAMPLE_TEXT} style={outlineStyles[0]} compact mode="expand" className="w-full" />
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "中文结构优先",
              description: "偏旁、上下左右结构和字心留白都会一起照顾到，写起来更稳，也更容易看清。",
            },
            {
              title: "边看边学怎么写",
              description: "每种风格旁边都配四步图示和下笔提醒，不让你只看得懂效果、却不知道怎么落笔。",
            },
            {
              title: "导出后还能继续练",
              description: "可以把当前预览保存为 PNG，或者切到打印页，直接生成更适合照着写的参考布局。",
            },
          ].map((item) => (
            <article key={item.title} className="soft-panel interactive-card p-6">
              <h2 className="text-xl font-semibold text-[color:var(--foreground)]">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">{item.description}</p>
            </article>
          ))}
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
