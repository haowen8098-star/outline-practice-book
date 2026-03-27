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
  const shadowId = `${style.id}-shadow-${uniqueId}`;
  const { positions, fontSize } = getPreviewMetrics(text, style.id);
  const strokeLinejoin = style.cornerStyle === "round" ? "round" : "miter";
  const strokeLinecap = style.capStyle === "round" ? "round" : "square";
  const viewHeight = compact ? 280 : 340;
  const boardHeight = compact ? 256 : 312;
  const isAnimated = mode === "animated";
  const finalStrokeWidth = Math.max(3.5, style.strokeWidth * (compact ? 0.42 : 0.48));
  const expandStrokeWidth = Math.max(finalStrokeWidth + 1.5, style.strokeWidth * 0.66);
  const showMeasurementLines = mode === "measure";
  const showFinalOutline = mode === "final" || mode === "measure" || isAnimated;
  const showSourceFill = mode === "source" || isAnimated;
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
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke={style.background.notebook} strokeWidth="1" opacity="0.28" />
              <path d="M 14 0 L 14 28 M 0 14 L 28 14" fill="none" stroke={style.background.notebook} strokeWidth="0.6" opacity="0.08" />
            </>
          ) : (
            <circle cx="12" cy="12" r="1.1" fill={style.background.notebook} opacity="0.24" />
          )}
        </pattern>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#97b5a5" floodOpacity="0.08" />
        </filter>
      </defs>

      <rect x="14" y="12" width="732" height={viewHeight - 24} rx="36" fill="#fffdfa" />
      <rect
        x="36"
        y={compact ? 12 : 18}
        width="688"
        height={boardHeight}
        rx="30"
        fill="#fffdfa"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="2"
        filter={`url(#${shadowId})`}
      />
      <rect x="54" y={compact ? 28 : 34} width="652" height={boardHeight - 32} rx="26" fill={`url(#${patternId})`} />

      {showMeasurementLines ? (
        <>
          <line x1="92" y1="110" x2="668" y2="110" stroke={style.supportColor} strokeDasharray="10 10" strokeWidth="2" opacity="0.4" />
          <line x1="92" y1={viewHeight - 96} x2="668" y2={viewHeight - 96} stroke={style.supportColor} strokeDasharray="10 10" strokeWidth="2" opacity="0.4" />
          <line x1="134" y1="76" x2="134" y2={viewHeight - 72} stroke={style.supportColor} strokeDasharray="10 10" strokeWidth="2" opacity="0.22" />
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
          fill={showSourceFill ? "#6d7471" : "transparent"}
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
              strokeWidth={expandStrokeWidth}
              strokeLinejoin={strokeLinejoin}
              strokeLinecap={strokeLinecap}
              strokeDasharray="14 12"
              strokeDashoffset={isAnimated ? 140 : undefined}
              opacity={isAnimated ? undefined : "0.8"}
              paintOrder="stroke"
              className={isAnimated ? "preview-sequence preview-sequence--expand" : undefined}
            >
              {line.text}
            </text>
          ))
        : null}

      {showFinalOutline && isAnimated
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
              stroke={style.outlineColor}
              strokeWidth={finalStrokeWidth}
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
        : showFinalOutline
          ? positions.map((line) => (
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
              fill="transparent"
              stroke={style.outlineColor}
              strokeWidth={finalStrokeWidth}
              strokeLinejoin={strokeLinejoin}
              strokeLinecap={strokeLinecap}
              paintOrder="stroke"
            >
              {line.text}
            </text>
          ))
          : null}

      {mode === "measure"
        ? positions.map((line) => (
            <text
              key={`measure-${line.text}-${line.y}`}
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
              strokeWidth={Math.max(2, style.innerStrokeWidth - 1)}
              strokeLinejoin={strokeLinejoin}
              strokeLinecap={strokeLinecap}
              opacity="0.16"
              paintOrder="stroke"
            >
              {line.text}
            </text>
          ))
        : null}
    </svg>
  );
});
