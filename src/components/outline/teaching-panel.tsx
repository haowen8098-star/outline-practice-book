import type { OutlineStylePreset } from "@/types/site";

import { OutlinePreviewSvg } from "./outline-preview-svg";

const modes = ["source", "expand", "measure", "final"] as const;

export function TeachingPanel({ text, style }: { text: string; style: OutlineStylePreset }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {style.teachingSteps.map((step, index) => (
        <article key={step.title} className="soft-panel overflow-hidden p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="section-kicker">STEP {index + 1}</p>
              <h3 className="mt-1 text-lg font-semibold text-[color:var(--foreground)]">{step.title}</h3>
            </div>
            <span className="rounded-full bg-[color:var(--soft-mint)] px-3 py-1 text-xs font-semibold text-[color:var(--primary-strong)]">
              {step.shortLabel}
            </span>
          </div>

          <div
            className="overflow-hidden rounded-[24px] border border-white/70"
            style={{
              background: `linear-gradient(135deg, ${style.background.from} 0%, ${style.background.via} 48%, ${style.background.to} 100%)`,
            }}
          >
            <OutlinePreviewSvg text={text} style={style} compact mode={modes[index]} className="w-full" />
          </div>

          <div className="mt-4 space-y-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
            <p>{step.description}</p>
            <p className="rounded-[18px] bg-[color:var(--soft-cream)] px-4 py-3">
              <span className="font-semibold text-[color:var(--foreground)]">下笔提醒：</span>
              {step.coaching}
            </p>
            <p className="rounded-[18px] bg-white px-4 py-3 font-medium text-[color:var(--primary-strong)] shadow-[0_10px_24px_rgba(130,160,144,0.08)]">
              {step.emphasis}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
