"use client";

import Link from "next/link";
import {
  Copy,
  Download,
  Eraser,
  ExternalLink,
  Link2,
  Printer,
  RefreshCcw,
} from "lucide-react";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { exampleTexts, outlineStyles, practicePaperOptions } from "@/content/styles";
import { getGuideHref, getStyleById } from "@/lib/content";
import {
  DEFAULT_SAMPLE_TEXT,
  buildSearchParams,
  getVisibleCharCount,
  needsLengthWarning,
  readSearchState,
} from "@/lib/outline";
import { cn } from "@/lib/site";
import type { SearchState } from "@/types/site";

import { OutlinePreviewSvg } from "../outline/outline-preview-svg";
import { StyleCard } from "../outline/style-card";
import { TeachingPanel } from "../outline/teaching-panel";

type StatusTone = "neutral" | "success" | "warning";

export function OutlineWorkbench({ initialState }: { initialState: SearchState }) {
  const router = useRouter();
  const pathname = usePathname();
  const workbenchRef = useRef<HTMLElement>(null);
  const detailRef = useRef<HTMLElement>(null);
  const previewCardRef = useRef<HTMLDivElement>(null);
  const exportTargetRef = useRef<SVGSVGElement>(null);
  const [textInput, setTextInput] = useState(initialState.text);
  const [activeStyleId, setActiveStyleId] = useState(initialState.style);
  const [paper, setPaper] = useState(initialState.paper);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<StatusTone>("neutral");
  const [showMobileBar, setShowMobileBar] = useState(false);

  const previewText = textInput.trim() ? readSearchState({ text: textInput }).text : DEFAULT_SAMPLE_TEXT;
  const deferredText = useDeferredValue(previewText);
  const activeStyle = useMemo(() => getStyleById(activeStyleId), [activeStyleId]);
  const prioritizedStyles = useMemo(() => {
    const priorityOrder = ["light-modern", "neat-title", "soft-candy", "journal-decor", "shadow-note", "chalk-board"] as const;
    return [...outlineStyles].sort((left, right) => priorityOrder.indexOf(left.id) - priorityOrder.indexOf(right.id));
  }, []);
  const printHref = `/print?${buildSearchParams({
    text: previewText,
    style: activeStyleId,
    paper,
  })}`;
  const warning = needsLengthWarning(previewText);
  const isEmptyInput = textInput.trim() === "";
  const visibleCharCount = getVisibleCharCount(textInput);
  const inputLineCount = Math.min(2, Math.max(1, textInput.replace(/\r/g, "").split("\n").filter(Boolean).length || 1));

  const syncUrl = useEffectEvent((nextState: SearchState) => {
    router.replace(`${pathname}?${buildSearchParams(nextState)}`, { scroll: false });
  });

  useEffect(() => {
    startTransition(() => {
      syncUrl({
        text: previewText,
        style: activeStyleId,
        paper,
      });
    });
  }, [activeStyleId, paper, pathname, previewText]);

  useEffect(() => {
    const node = previewCardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowMobileBar(!entry.isIntersecting);
      },
      {
        threshold: 0.18,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function announceStatus(message: string, tone: StatusTone = "neutral") {
    setStatus(message);
    setStatusTone(tone);
  }

  async function handleExport() {
    const svg = exportTargetRef.current;
    if (!svg) return;

    try {
      announceStatus("正在整理 PNG…");
      const serializer = new XMLSerializer();
      const svgMarkup = serializer.serializeToString(svg);
      const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const image = new Image();
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("当前浏览器无法创建导出画布。");
      }

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("预览图加载失败。"));
        image.src = url;
      });

      const viewBox = svg.viewBox.baseVal;
      const exportWidth = 1680;
      const exportHeight = Math.round(exportWidth * (viewBox.height / viewBox.width));
      canvas.width = exportWidth;
      canvas.height = exportHeight;
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.fillStyle = "#fffdf8";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `${activeStyle.name}-${previewText.slice(0, 8)}.png`;
      link.click();
      announceStatus("PNG 已经准备好，可以拿去照着写了。", "success");
    } catch (error) {
      announceStatus(error instanceof Error ? error.message : "导出失败了，先用打印页也可以。", "warning");
    }
  }

  async function handleCopyShare() {
    try {
      const shareUrl = new URL(
        `${pathname}?${buildSearchParams({
          text: previewText,
          style: activeStyleId,
          paper,
        })}`,
        window.location.origin,
      ).toString();

      await navigator.clipboard.writeText(shareUrl);
      announceStatus("当前预览链接已经复制，发给自己或同学都能直接打开。", "success");
    } catch {
      announceStatus("复制链接失败了，可以先直接从地址栏复制。", "warning");
    }
  }

  function handleChange(value: string) {
    const lines = value.replace(/\r/g, "").split("\n").slice(0, 2);
    setTextInput(lines.join("\n"));
  }

  function handleSelectStyle(styleId: SearchState["style"]) {
    setActiveStyleId(styleId);
    previewCardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleNextExample() {
    const nextIndex = (sampleIndex + 1) % exampleTexts.length;
    setSampleIndex(nextIndex);
    setTextInput(exampleTexts[nextIndex]);
  }

  return (
    <section ref={workbenchRef} id="workbench" className="scroll-mt-24 space-y-8 sm:scroll-mt-28">
      <div className="overflow-hidden rounded-[42px] border border-[color:var(--border-soft)] bg-[color:var(--surface)] shadow-[var(--shadow-soft)]">
        <div className="grid gap-0 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="order-2 space-y-6 border-b border-[color:var(--border-soft)] px-5 py-6 sm:px-6 sm:py-7 xl:order-1 xl:border-b-0 xl:border-r">
            <div className="space-y-2">
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
                输入文字，直接看空心字轮廓。
              </h2>
              <p className="max-w-xl text-base leading-8 text-[color:var(--muted-foreground)]">
                先挑一款顺眼的，再往下看怎么写。
              </p>
            </div>

            <div className="paper-panel soft-panel p-5">
              <div className="relative z-10">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <label htmlFor="outline-input" className="section-kicker">
                      输入文字
                    </label>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
                      支持中文、英文和常见符号，最多两行。短一点更适合照着写。
                    </p>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[color:var(--pill-text)] shadow-[0_10px_24px_rgba(134,163,148,0.08)]">
                    {visibleCharCount} 字 · {inputLineCount} / 2 行
                  </div>
                </div>

                <textarea
                  id="outline-input"
                  value={textInput}
                  onChange={(event) => handleChange(event.target.value)}
                  placeholder="比如：春日学习计划"
                  className="mt-4 min-h-36 w-full resize-none rounded-[26px] border border-white/80 bg-white/90 px-5 py-4 text-xl leading-9 text-[color:var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-[color:var(--primary-strong)] focus:shadow-[0_0_0_4px_rgba(98,137,120,0.12)]"
                />

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {exampleTexts.slice(0, 3).map((example, index) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => {
                        setSampleIndex(index);
                        setTextInput(example);
                      }}
                    className={cn(
                        "button-pop rounded-full px-3 py-2 text-sm font-medium transition",
                        textInput === example
                          ? "bg-[color:var(--primary-strong)] text-white shadow-[0_18px_34px_rgba(98,137,120,0.18)]"
                          : "bg-white text-[color:var(--muted-foreground)] hover:bg-[color:var(--soft-mint)] hover:text-[color:var(--foreground)]",
                      )}
                    >
                      {example}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[color:var(--muted-foreground)]">
                  <button
                    type="button"
                    onClick={handleNextExample}
                    className="button-pop inline-flex items-center gap-2 rounded-full bg-[color:var(--soft-blue)] px-4 py-2 font-medium text-[color:var(--foreground)]"
                  >
                    <RefreshCcw className="size-4" />
                    换个示例
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextInput("")}
                    className="button-pop inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-medium text-[color:var(--foreground)]"
                  >
                    <Eraser className="size-4" />
                    清空输入
                  </button>
                </div>

                {isEmptyInput ? (
                  <p className="mt-4 rounded-[20px] bg-[color:var(--soft-blue)] px-4 py-3 text-sm leading-7 text-[color:var(--foreground)]">
                    先用示例看版面，你一输入就会立刻更新。
                  </p>
                ) : null}

                {warning ? (
                  <p className="mt-4 rounded-[20px] bg-[color:var(--soft-pink)] px-4 py-3 text-sm leading-7 text-[color:var(--foreground)]">
                    这段字已经偏长了。想写得更清楚的话，建议拆成两行。
                  </p>
                ) : null}
              </div>
            </div>

            <div className="soft-panel p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="section-kicker">打印纸样</p>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
                    打印参考页会沿用这里的底纸样式。
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {practicePaperOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setPaper(option.id)}
                      className={cn(
                        "button-pop rounded-full px-4 py-2 text-sm font-medium transition",
                        paper === option.id
                          ? "bg-[color:var(--primary-strong)] text-white shadow-[0_18px_34px_rgba(98,137,120,0.2)]"
                          : "bg-[color:var(--soft-cream)] text-[color:var(--muted-foreground)] hover:bg-[color:var(--soft-mint)]",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted-foreground)]">
                {practicePaperOptions.find((option) => option.id === paper)?.description}
              </p>
            </div>
          </div>

          <div className="order-1 space-y-6 px-5 py-6 sm:px-6 sm:py-7 xl:order-2">
            <div
              ref={previewCardRef}
              className="overflow-hidden rounded-[34px] border border-[color:var(--border-soft)] p-4 shadow-[0_20px_48px_rgba(130,160,143,0.08)] sm:p-6"
              style={{
                background: `linear-gradient(145deg, ${activeStyle.background.from} 0%, ${activeStyle.background.via} 50%, ${activeStyle.background.to} 100%)`,
              }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 px-2 pb-3">
                <div>
                  <p className="section-kicker">当前预览</p>
                  <h3 className="mt-1 text-2xl font-semibold text-[color:var(--foreground)]">{activeStyle.name}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyShare}
                    className="button-pop inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] shadow-[0_18px_32px_rgba(123,147,135,0.14)]"
                  >
                    <Link2 className="size-4" />
                    复制
                  </button>
                  <button
                    type="button"
                    onClick={handleExport}
                    className="button-pop inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] shadow-[0_18px_32px_rgba(123,147,135,0.14)]"
                  >
                    <Download className="size-4" />
                    下载
                  </button>
                  <Link
                    href={printHref}
                    className="button-pop inline-flex items-center gap-2 rounded-full bg-[color:var(--primary-strong)] px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(98,137,120,0.24)]"
                  >
                    <Printer className="size-4" />
                    打印
                  </Link>
                </div>
              </div>

              <OutlinePreviewSvg ref={exportTargetRef} text={deferredText} style={activeStyle} paper={paper} className="w-full" />

              <div className="mt-4 space-y-3 border-t border-[color:var(--border-soft)] pt-4">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[color:var(--soft-mint)] px-3 py-1 text-xs font-medium text-[color:var(--primary-strong)]">
                    {activeStyle.previewLabel}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[color:var(--pill-text)]">
                    {activeStyle.difficulty}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[color:var(--pill-text)]">
                    {activeStyle.recommendedLength}
                  </span>
                  {activeStyle.scenarioTags.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[color:var(--pill-text)]">
                      {tag}
                    </span>
                  ))}
                </div>
                <p
                  className={cn(
                    "rounded-[18px] px-4 py-3 text-sm leading-7",
                    statusTone === "success"
                      ? "bg-[color:var(--soft-mint)] text-[color:var(--primary-deep)]"
                      : statusTone === "warning"
                        ? "bg-[color:var(--soft-pink)] text-[color:var(--foreground)]"
                        : "bg-[color:var(--soft-cream)] text-[color:var(--foreground)]",
                  )}
                >
                  {status ?? activeStyle.exportCaption}
                </p>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="section-kicker">换一组看看</p>
                <p className="text-sm text-[color:var(--muted-foreground)]">先看哪一种最清楚，再决定要不要往下学。</p>
              </div>
              <div className="soft-scroll mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-3 2xl:grid-cols-6">
                {prioritizedStyles.map((style) => (
                  <div key={style.id} className="w-[272px] shrink-0 snap-center md:w-auto md:min-w-0">
                    <StyleCard
                      text={deferredText}
                      style={style}
                      active={style.id === activeStyleId}
                      onSelect={() => handleSelectStyle(style.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section ref={detailRef} className="section-card overflow-hidden p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl space-y-3">
            <p className="section-kicker">风格详解</p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
              {activeStyle.name}怎么在本子上写得更顺手？
            </h2>
            <p className="text-base leading-8 text-[color:var(--muted-foreground)]">
              {activeStyle.shortDescription} 这类字最关键的是：{activeStyle.hintSentence}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[color:var(--soft-mint)] px-3 py-1 text-xs font-medium text-[color:var(--primary-strong)]">
                {activeStyle.previewLabel}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[color:var(--pill-text)]">
                {activeStyle.difficulty}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[color:var(--pill-text)]">
                {activeStyle.recommendedLength}
              </span>
            </div>
          </div>
          <Link
            href={`${getGuideHref(activeStyle.guideSlug)}?${buildSearchParams({
              text: previewText,
              style: activeStyle.id,
              paper,
            })}`}
            className="button-pop inline-flex items-center gap-2 rounded-full bg-[color:var(--soft-cream)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]"
          >
            看对应指南
            <ExternalLink className="size-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <TeachingPanel text={deferredText} style={activeStyle} />

          <aside className="space-y-5">
            <section className="soft-panel p-5">
              <p className="section-kicker">下笔提醒</p>
              <div className="mt-4 grid gap-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
                <p>
                  <span className="font-semibold text-[color:var(--foreground)]">先写什么：</span>
                  {activeStyle.penTips.startingMethod}
                </p>
                <p>
                  <span className="font-semibold text-[color:var(--foreground)]">最容易挤的地方：</span>
                  {activeStyle.penTips.crowdedParts}
                </p>
                <p>
                  <span className="font-semibold text-[color:var(--foreground)]">更适合的笔：</span>
                  {activeStyle.penTips.penAdvice}
                </p>
                <p>
                  <span className="font-semibold text-[color:var(--foreground)]">新手常犯错：</span>
                  {activeStyle.penTips.beginnerMistake}
                </p>
              </div>
            </section>

            <section className="soft-panel p-5">
              <p className="section-kicker">最常见的翻车点</p>
              <ul className="mt-4 grid gap-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
                {activeStyle.commonMistakes.map((mistake) => (
                  <li key={mistake} className="rounded-[18px] bg-[color:var(--soft-cream)] px-4 py-3">
                    {mistake}
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </section>

      <div
        className={cn(
          "print-hidden fixed inset-x-0 bottom-4 z-30 mx-auto flex w-[min(620px,calc(100%-20px))] items-center justify-between gap-3 rounded-[26px] border border-white/80 bg-white/92 px-4 py-3 shadow-[0_24px_54px_rgba(130,160,144,0.2)] transition duration-300 md:hidden",
          showMobileBar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
        )}
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[color:var(--foreground)]">{activeStyle.name}</p>
          <p className="truncate text-xs text-[color:var(--muted-foreground)]">{previewText}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyShare}
            className="button-pop inline-flex items-center justify-center rounded-full bg-[color:var(--soft-cream)] p-2.5 text-[color:var(--foreground)]"
            aria-label="复制当前预览链接"
          >
            <Copy className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="button-pop inline-flex items-center gap-2 rounded-full bg-[color:var(--soft-cream)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]"
          >
            <Download className="size-4" />
            PNG
          </button>
          <Link href={printHref} className="button-pop inline-flex items-center gap-2 rounded-full bg-[color:var(--primary-strong)] px-4 py-2 text-sm font-semibold text-white">
            <Printer className="size-4" />
            打印
          </Link>
        </div>
      </div>
    </section>
  );
}
