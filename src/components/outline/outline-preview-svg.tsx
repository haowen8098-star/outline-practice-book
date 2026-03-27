import { forwardRef, useId } from "react";

import { getPreviewMetrics } from "@/lib/outline";
import type { OutlineStylePreset, PracticePaperId } from "@/types/site";

const cjkFontStack =
  "\"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", \"Noto Sans CJK SC\", \"Source Han Sans SC\", sans-serif";

type PreviewMode = "source" | "expand" | "measure" | "final" | "animated";

interface OutlinePreviewSvgProps {
  text: string;
  style: OutlineStylePreset;
  paper?: PracticePaperId;
  mode?: PreviewMode;
  compact?: boolean;
  className?: string;
}

export const OutlinePreviewSvg = forwardRef<SVGSVGElement, OutlinePreviewSvgProps>(function OutlinePreviewSvg(
  { text, style, paper = "grid", mode = "final", compact = false, className },
  ref,
) {
  const uniqueId = useId().replace(/:/g, "");
  const patternId = `${style.id}-${paper}-${uniqueId}`;
  const softPatternId = `${style.id}-soft-${uniqueId}`;
  const shadowId = `${style.id}-shadow-${uniqueId}`;
  const glowId = `${style.id}-glow-${uniqueId}`;
  const strokeGradientId = `${style.id}-stroke-${uniqueId}`;
  const { positions, fontSize } = getPreviewMetrics(text, style.id);
  const strokeLinejoin = style.cornerStyle === "round" ? "round" : "miter";
  const strokeLinecap = style.capStyle === "round" ? "round" : "square";
  const viewHeight = compact ? 280 : 340;
  const boardHeight = compact ? 256 : 312;
  const isAnimated = mode === "animated";
  const stageStrokeWidth =
    mode === "final" ? style.strokeWidth : mode === "measure" ? style.strokeWidth * 0.92 : style.strokeWidth * 0.8;
  const showMeasurementLines = mode === "measure";
  const showFinalAccent = mode === "final" || mode === "measure" || isAnimated;
  const showSourceFill = mode === "source" || mode === "expand" || isAnimated;
  const showExpandStroke = mode === "expand" || isAnimated;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 760 ${viewHeight}`}
      role="img"
      aria-label={`${style.name}预览`}
      className={`${isAnimated ? "outline-preview-svg outline-preview-svg--animated" : "outline-preview-svg"} ${className ?? ""}`.trim()}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={patternId} width={paper === "grid" ? 28 : 24} height={paper === "grid" ? 28 : 24} patternUnits="userSpaceOnUse">
          {paper === "grid" ? (
            <>
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke={style.background.notebook} strokeWidth="1.2" opacity="0.35" />
              <path d="M 14 0 L 14 28 M 0 14 L 28 14" fill="none" stroke={style.background.notebook} strokeWidth="0.8" opacity="0.12" />
            </>
          ) : (
            <circle cx="12" cy="12" r="1.2" fill={style.background.notebook} opacity="0.35" />
          )}
        </pattern>
        <pattern id={softPatternId} width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill={style.supportColor} opacity="0.12" />
        </pattern>
        <radialGradient id={glowId} cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor={style.accentColor} stopOpacity="0.42" />
          <stop offset="58%" stopColor={style.supportColor} stopOpacity="0.18" />
          <stop offset="100%" stopColor={style.background.from} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={strokeGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={style.outlineColor} />
          <stop offset="52%" stopColor={style.accentColor} />
          <stop offset="100%" stopColor={style.supportColor} />
        </linearGradient>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#97b5a5" floodOpacity="0.12" />
        </filter>
      </defs>

      <rect x="14" y="12" width="732" height={viewHeight - 24} rx="36" fill={style.background.from} />
      <rect
        x="36"
        y={compact ? 12 : 18}
        width="688"
        height={boardHeight}
        rx="30"
        fill="white"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="2"
        filter={`url(#${shadowId})`}
      />
      {isAnimated ? (
        <>
          <circle cx="640" cy="74" r="74" fill={`url(#${glowId})`} className="preview-glow-orb preview-glow-orb--top" />
          <circle cx="122" cy={viewHeight - 78} r="62" fill={`url(#${glowId})`} className="preview-glow-orb preview-glow-orb--bottom" />
        </>
      ) : null}
      <rect x="54" y={compact ? 28 : 34} width="652" height={boardHeight - 32} rx="26" fill={`url(#${patternId})`} />
      <rect x="78" y="10" width="120" height="26" rx="13" fill={style.background.tape} opacity="0.92" transform="rotate(-6 78 10)" />
      <rect
        x="572"
        y={viewHeight - 54}
        width="108"
        height="24"
        rx="12"
        fill={style.background.tape}
        opacity="0.82"
        transform={`rotate(7 572 ${viewHeight - 54})`}
      />
      <circle cx="98" cy={viewHeight - 68} r="10" fill={style.accentColor} opacity="0.16" />
      <circle cx="656" cy="56" r="8" fill={style.supportColor} opacity="0.18" />

      {showMeasurementLines ? (
        <>
          <line x1="92" y1="110" x2="668" y2="110" stroke={style.supportColor} strokeDasharray="10 10" strokeWidth="2" opacity="0.55" />
          <line x1="92" y1={viewHeight - 96} x2="668" y2={viewHeight - 96} stroke={style.supportColor} strokeDasharray="10 10" strokeWidth="2" opacity="0.55" />
          <line x1="134" y1="76" x2="134" y2={viewHeight - 72} stroke={style.supportColor} strokeDasharray="10 10" strokeWidth="2" opacity="0.36" />
        </>
      ) : null}

      {positions.map((line) => (
        <text
          key={`source-${line.text}-${line.y}`}
          x={line.x}
          y={line.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily={cjkFontStack}
          fontWeight={style.fontWeight}
          fontSize={fontSize}
          letterSpacing={style.letterSpacing}
          fill={showSourceFill ? "#67706f" : style.softFillColor}
          opacity={showSourceFill && !isAnimated ? 0.18 : undefined}
          className={isAnimated ? "preview-sequence preview-sequence--source" : undefined}
        >
          {line.text}
        </text>
      ))}

      {showExpandStroke
        ? positions.map((line) => (
            <text
              key={`expand-${line.text}-${line.y}`}
              x={line.x}
              y={line.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily={cjkFontStack}
              fontWeight={style.fontWeight}
              fontSize={fontSize}
              letterSpacing={style.letterSpacing}
              fill="transparent"
              stroke={style.supportColor}
              strokeWidth={stageStrokeWidth}
              strokeLinejoin={strokeLinejoin}
              strokeLinecap={strokeLinecap}
              strokeDasharray="14 12"
              strokeDashoffset={isAnimated ? 140 : undefined}
              opacity={isAnimated ? undefined : "0.92"}
              paintOrder="stroke"
              className={isAnimated ? "preview-sequence preview-sequence--expand" : undefined}
            >
              {line.text}
            </text>
          ))
        : null}

      {showFinalAccent
        ? positions.map((line) => (
            <text
              key={`accent-${line.text}-${line.y}`}
              x={line.x}
              y={line.y + 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily={cjkFontStack}
              fontWeight={style.fontWeight}
              fontSize={fontSize}
              letterSpacing={style.letterSpacing}
              fill="transparent"
              stroke={style.accentColor}
              strokeWidth={stageStrokeWidth + 6}
              strokeLinejoin={strokeLinejoin}
              strokeLinecap={strokeLinecap}
              opacity={isAnimated ? undefined : "0.09"}
              paintOrder="stroke"
              className={isAnimated ? "preview-sequence preview-sequence--accent" : undefined}
            >
              {line.text}
            </text>
          ))
        : null}

      {isAnimated
        ? positions.map((line) => (
            <text
              key={`final-outline-${line.text}-${line.y}`}
              x={line.x}
              y={line.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily={cjkFontStack}
              fontWeight={style.fontWeight}
              fontSize={fontSize}
              letterSpacing={style.letterSpacing}
              fill="transparent"
              stroke={`url(#${strokeGradientId})`}
              strokeWidth={stageStrokeWidth}
              strokeLinejoin={strokeLinejoin}
              strokeLinecap={strokeLinecap}
              strokeDasharray="1400"
              strokeDashoffset="1400"
              paintOrder="stroke"
              className="preview-sequence preview-sequence--outline"
            >
              {line.text}
            </text>
          ))
        : positions.map((line) => (
            <text
              key={`final-${line.text}-${line.y}`}
              x={line.x}
              y={line.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily={cjkFontStack}
              fontWeight={style.fontWeight}
              fontSize={fontSize}
              letterSpacing={style.letterSpacing}
              fill={mode === "final" || mode === "measure" ? `url(#${softPatternId})` : "transparent"}
              stroke={mode === "source" ? "transparent" : style.outlineColor}
              strokeWidth={mode === "source" ? 0 : stageStrokeWidth}
              strokeLinejoin={strokeLinejoin}
              strokeLinecap={strokeLinecap}
              paintOrder="stroke"
            >
              {line.text}
            </text>
          ))}

      {isAnimated
        ? positions.map((line) => (
            <text
              key={`final-fill-${line.text}-${line.y}`}
              x={line.x}
              y={line.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily={cjkFontStack}
              fontWeight={style.fontWeight}
              fontSize={fontSize}
              letterSpacing={style.letterSpacing}
              fill={`url(#${softPatternId})`}
              stroke="transparent"
              paintOrder="stroke"
              className="preview-sequence preview-sequence--fill"
            >
              {line.text}
            </text>
          ))
        : null}

      {showFinalAccent
        ? positions.map((line) => (
            <text
              key={`inner-${line.text}-${line.y}`}
              x={line.x}
              y={line.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily={cjkFontStack}
              fontWeight={style.fontWeight}
              fontSize={fontSize}
              letterSpacing={style.letterSpacing}
              fill="transparent"
              stroke={style.supportColor}
              strokeWidth={style.innerStrokeWidth}
              strokeLinejoin={strokeLinejoin}
              strokeLinecap={strokeLinecap}
              opacity={isAnimated ? undefined : "0.32"}
              paintOrder="stroke"
              className={isAnimated ? "preview-sequence preview-sequence--inner" : undefined}
            >
              {line.text}
            </text>
          ))
        : null}
    </svg>
  );
});
