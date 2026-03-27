import { forwardRef, useId } from "react";

import { getPreviewMetrics } from "@/lib/outline";
import type { OutlineStylePreset, PracticePaperId } from "@/types/site";

const cjkFontStack =
  "\"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", \"Noto Sans CJK SC\", \"Source Han Sans SC\", sans-serif";

function getGlyphAdvance(char: string, fontSize: number) {
  if (/\s/.test(char)) return fontSize * 0.34;
  if (/[A-Za-z0-9]/.test(char)) return fontSize * 0.62;
  if (/[，。、《》！？：；、“”‘’（）()【】,.!?;:]/.test(char)) return fontSize * 0.48;
  return fontSize * 0.92;
}

function getPatternValue(values: number[] | undefined, index: number, fallback: number) {
  if (!values || values.length === 0) return fallback;
  return values[index % values.length] ?? fallback;
}

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
  const finalStrokeWidth = Math.max(3, style.strokeWidth * (compact ? 0.35 : 0.4));
  const expandStrokeWidth = Math.max(finalStrokeWidth + 1.1, style.strokeWidth * 0.52);
  const showMeasurementLines = mode === "measure";
  const showFinalOutline = mode === "final" || mode === "measure" || isAnimated;
  const showSourceFill = mode === "source" || isAnimated;
  const showExpandStroke = mode === "expand" || isAnimated;
  const fontFamily = style.fontFamily || cjkFontStack;
  const renderByChar = style.renderMode === "chars";

  const renderLine = (
    line: { text: string; x: number; y: number },
    layer: "source" | "expand" | "final" | "measure",
  ) => {
    const common = {
      fontFamily,
      fontWeight: style.fontWeight,
      fontSize,
      letterSpacing: style.letterSpacing,
    };

    if (!renderByChar) {
      return (
        <text
          key={`${layer}-${line.text}-${line.y}`}
          x={line.x}
          y={line.y}
          textAnchor="middle"
          dominantBaseline="middle"
          {...common}
          fill={layer === "source" ? "#6d7471" : "transparent"}
          opacity={
            layer === "source" && !isAnimated
              ? 0.16
              : layer === "expand" && !isAnimated
                ? 0.8
                : layer === "measure"
                  ? 0.16
                  : undefined
          }
          stroke={
            layer === "expand"
              ? style.supportColor
              : layer === "final"
                ? style.outlineColor
                : layer === "measure"
                  ? style.supportColor
                  : undefined
          }
          strokeWidth={
            layer === "expand"
              ? expandStrokeWidth
              : layer === "final"
                ? finalStrokeWidth
                : layer === "measure"
                  ? Math.max(2, style.innerStrokeWidth - 1)
                  : undefined
          }
          strokeLinejoin={layer === "source" ? undefined : strokeLinejoin}
          strokeLinecap={layer === "source" ? undefined : strokeLinecap}
          strokeDasharray={layer === "expand" ? "14 12" : layer === "final" && isAnimated ? "1400" : undefined}
          strokeDashoffset={layer === "expand" && isAnimated ? 140 : layer === "final" && isAnimated ? 1400 : undefined}
          paintOrder={layer === "source" ? undefined : "stroke"}
          className={
            isAnimated
              ? layer === "source"
                ? "preview-sequence preview-sequence--source"
                : layer === "expand"
                  ? "preview-sequence preview-sequence--expand"
                  : layer === "final"
                    ? "preview-sequence preview-sequence--outline"
                    : undefined
              : undefined
          }
        >
          {line.text}
        </text>
      );
    }

    const chars = [...line.text];
    const widths = chars.map((char) => getGlyphAdvance(char, fontSize));
    const totalWidth = widths.reduce((sum, width) => sum + width, 0) + style.letterSpacing * Math.max(0, chars.length - 1);
    let cursor = line.x - totalWidth / 2;

    return chars.map((char, index) => {
      const width = widths[index];
      const centerX = cursor + width / 2;
      const centerY = line.y + getPatternValue(style.glyphPattern?.yOffsets, index, 0);
      const rotation = getPatternValue(style.glyphPattern?.rotations, index, 0);
      const scale = getPatternValue(style.glyphPattern?.scales, index, 1);
      cursor += width + style.letterSpacing;

      return (
        <text
          key={`${layer}-${line.text}-${line.y}-${index}`}
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          {...common}
          fill={layer === "source" ? "#6d7471" : "transparent"}
          opacity={
            layer === "source" && !isAnimated
              ? 0.16
              : layer === "expand" && !isAnimated
                ? 0.8
                : layer === "measure"
                  ? 0.16
                  : undefined
          }
          stroke={
            layer === "expand"
              ? style.supportColor
              : layer === "final"
                ? style.outlineColor
                : layer === "measure"
                  ? style.supportColor
                  : undefined
          }
          strokeWidth={
            layer === "expand"
              ? expandStrokeWidth
              : layer === "final"
                ? finalStrokeWidth
                : layer === "measure"
                  ? Math.max(2, style.innerStrokeWidth - 1)
                  : undefined
          }
          strokeLinejoin={layer === "source" ? undefined : strokeLinejoin}
          strokeLinecap={layer === "source" ? undefined : strokeLinecap}
          strokeDasharray={layer === "expand" ? "14 12" : layer === "final" && isAnimated ? "1400" : undefined}
          strokeDashoffset={layer === "expand" && isAnimated ? 140 : layer === "final" && isAnimated ? 1400 : undefined}
          paintOrder={layer === "source" ? undefined : "stroke"}
          className={
            isAnimated
              ? layer === "source"
                ? "preview-sequence preview-sequence--source"
                : layer === "expand"
                  ? "preview-sequence preview-sequence--expand"
                  : layer === "final"
                    ? "preview-sequence preview-sequence--outline"
                    : undefined
              : undefined
          }
          transform={
            rotation || scale !== 1
              ? `translate(${centerX} ${centerY}) rotate(${rotation}) scale(${scale}) translate(${-centerX} ${-centerY})`
              : undefined
          }
        >
          {char}
        </text>
      );
    });
  };

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

      {showSourceFill ? positions.flatMap((line) => renderLine(line, "source")) : null}

      {showExpandStroke
        ? positions.flatMap((line) => renderLine(line, "expand"))
        : null}

      {showFinalOutline && isAnimated
        ? positions.flatMap((line) => renderLine(line, "final"))
        : showFinalOutline
          ? positions.flatMap((line) => renderLine(line, "final"))
          : null}

      {mode === "measure"
        ? positions.flatMap((line) => renderLine(line, "measure"))
        : null}
    </svg>
  );
});
