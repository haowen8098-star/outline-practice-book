import Link from "next/link";

import { getGuideHref } from "@/lib/content";
import { cn } from "@/lib/site";
import type { OutlineStylePreset } from "@/types/site";

import { OutlinePreviewSvg } from "./outline-preview-svg";

interface StyleCardProps {
  text: string;
  style: OutlineStylePreset;
  active: boolean;
  onSelect: () => void;
}

export function StyleCard({ text, style, active, onSelect }: StyleCardProps) {
  return (
    <article
      className={cn(
        "group interactive-card flex h-full flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_22px_52px_rgba(126,160,143,0.1)] transition duration-300",
        active
          ? "border-[color:var(--primary-strong)] shadow-[0_28px_66px_rgba(98,137,120,0.18)]"
          : "hover:-translate-y-1 hover:shadow-[0_28px_66px_rgba(126,160,143,0.18)]",
      )}
    >
      <button type="button" onClick={onSelect} aria-pressed={active} className="flex h-full flex-col text-left">
        <div
          className="rounded-b-[28px] px-4 pt-4"
          style={{
            background: `linear-gradient(135deg, ${style.background.from} 0%, ${style.background.via} 55%, ${style.background.to} 100%)`,
          }}
        >
          <div className="flex items-center justify-between gap-3 px-1 pb-3">
            <span className="rounded-full bg-white/88 px-3 py-1 text-xs font-semibold text-[color:var(--primary-strong)]">
              {style.previewLabel}
            </span>
            <span className="rounded-full bg-white/74 px-3 py-1 text-xs font-medium text-[color:var(--foreground)]">
              {active ? "当前选中" : style.previewBadge}
            </span>
          </div>
          <OutlinePreviewSvg text={text} style={style} compact className="w-full" />
        </div>

        <div className="flex flex-1 flex-col gap-4 px-5 pt-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">{style.name}</h3>
            <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">{style.shortDescription}</p>
          </div>

          <div className="rounded-[22px] bg-[color:var(--soft-cream)] px-4 py-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
            <span className="font-semibold text-[color:var(--foreground)]">适合：</span>
            {style.bestFor}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[color:var(--soft-mint)] px-3 py-1 text-xs font-medium text-[color:var(--primary-strong)]">
              {style.difficulty}
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[color:var(--pill-text)]">
              {style.recommendedLength}
            </span>
            {style.scenarioTags.slice(0, 1).map((tag) => (
              <span key={tag} className="rounded-full bg-[color:var(--soft-mint)] px-3 py-1 text-xs font-medium text-[color:var(--primary-strong)]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </button>

      <div className="mt-auto flex items-center justify-between gap-3 px-5 pb-5 pt-4 text-sm">
        <span className="text-[color:var(--muted-foreground)]">{style.hintSentence}</span>
        <Link href={getGuideHref(style.guideSlug)} className="button-pop shrink-0 font-semibold text-[color:var(--primary-strong)] underline-offset-4 hover:underline">
          看写法
        </Link>
      </div>
    </article>
  );
}
