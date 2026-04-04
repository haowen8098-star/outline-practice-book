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

type PreviewMode = "source" | "expand" | "measure" | "final" | "animated" | "timeline";

interface OutlinePreviewSvgProps {
  text: string;
  style: OutlineStylePreset;
  paper?: PracticePaperId;
  mode?: PreviewMode;
  compact?: boolean;
  layout?: "default" | "mobile";
  visualWeight?: "default" | "hero";
  animationVariant?: "default" | "solid-to-outline";
  className?: string;
}

export const OutlinePreviewSvg = forwardRef<SVGSVGElement, OutlinePreviewSvgProps>(function OutlinePreviewSvg(
  {
    text,
    style,
    paper = "grid",
    mode = "final",
    compact = false,
    layout = "default",
    visualWeight = "default",
    animationVariant = "default",
    className,
  },
  ref,
) {
  const uniqueId = useId().replace(/:/g, "");
  const patternId = `${style.id}-${paper}-${uniqueId}`;
  const shadowId = `${style.id}-shadow-${uniqueId}`;
  const { positions, fontSize } = getPreviewMetrics(text, style.id);
  const strokeLinejoin = style.cornerStyle === "round" ? "round" : "miter";
  const strokeLinecap = style.capStyle === "round" ? "round" : "square";
  const isAnimated = mode === "animated";
  const isGsapTimeline = mode === "timeline";
  const hasAnimationLayers = isAnimated || isGsapTimeline;
  const isHeroWeight = visualWeight === "hero";
  const isMobileLayout = layout === "mobile";
  const useSolidToOutline = hasAnimationLayers && animationVariant === "solid-to-outline";
  const viewHeight = compact ? 280 : isHeroWeight ? 456 : isMobileLayout ? 304 : 340;
  const boardHeight = compact ? 256 : isHeroWeight ? 410 : isMobileLayout ? 274 : 312;
  const finalStrokeWidth = Math.max(3, style.strokeWidth * (compact ? 0.35 : isMobileLayout ? 0.44 : 0.4));
  const expandStrokeWidth = Math.max(finalStrokeWidth + 1.1, style.strokeWidth * 0.52);
  const showMeasurementLines = mode === "measure";
  const showFinalOutline = mode === "final" || mode === "measure" || hasAnimationLayers;
  const showSourceFill = mode === "source" || hasAnimationLayers;
  const showExpandStroke = (mode === "expand" || isAnimated) && !useSolidToOutline;
  const fontFamily = style.fontFamily || cjkFontStack;
  const latinFontFamily = style.latinFontFamily || fontFamily;
  const isShadowVariant = style.renderVariant === "shadow";
  const renderByChar =
    style.renderMode === "chars" || compact || isMobileLayout || (isHeroWeight && hasAnimationLayers && !isShadowVariant);
  const shadowColor = style.shadow?.color ?? "#95684b";
  const shadowOffsetX = style.shadow?.offsetX ?? 6;
  const shadowOffsetY = style.shadow?.offsetY ?? 7;
  const displayFontSize = isHeroWeight
    ? Math.min(178, Math.max(122, fontSize * 1.42))
    : isMobileLayout
      ? Math.min(104, Math.max(74, fontSize * 0.82))
      : fontSize;
  const displayLetterSpacing = isHeroWeight
    ? style.letterSpacing + 26
    : isMobileLayout
      ? Math.max(4, style.letterSpacing * 0.4)
      : style.letterSpacing;
  const displayLineGap = isHeroWeight
    ? displayFontSize * 1.42
    : isMobileLayout
      ? displayFontSize * 1.02
      : fontSize * 1.05;
  const displayCenterY = compact ? 160 : isHeroWeight ? 206 : isMobileLayout ? 152 : 160;
  const displayPositions = positions.map((line, index) => ({
    ...line,
    lineIndex: index,
    y: displayCenterY - (displayLineGap * Math.max(0, positions.length - 1)) / 2 + index * displayLineGap,
  }));

  const renderLine = (
    line: { text: string; x: number; y: number; lineIndex?: number },
    layer: "source" | "expand" | "final" | "measure",
  ) => {
    const common = {
      fontFamily,
      fontWeight: style.fontWeight,
      fontSize: displayFontSize,
      letterSpacing: displayLetterSpacing,
    };

    const animationClass =
      hasAnimationLayers
        ? layer === "source"
          ? `preview-sequence preview-sequence--source${useSolidToOutline ? " preview-sequence--solid-source" : ""}`
          : layer === "expand"
            ? "preview-sequence preview-sequence--expand"
            : layer === "final"
              ? `preview-sequence preview-sequence--outline${useSolidToOutline ? " preview-sequence--solid-outline" : ""}`
              : undefined
        : undefined;

    if (isShadowVariant && !renderByChar) {
      const shadowTransform = `translate(${shadowOffsetX} ${shadowOffsetY})`;

      if (layer === "source") {
        return (
          <text
            key={`${layer}-${line.text}-${line.y}`}
            x={line.x}
            y={line.y}
            textAnchor="middle"
            dominantBaseline="middle"
            {...common}
            fill="#7d7b74"
            opacity={hasAnimationLayers ? undefined : 0.18}
            className={animationClass}
          >
            {line.text}
          </text>
        );
      }

      if (layer === "expand") {
        return (
          <text
            key={`${layer}-${line.text}-${line.y}`}
            x={line.x}
            y={line.y}
            textAnchor="middle"
            dominantBaseline="middle"
            {...common}
            fill={shadowColor}
            opacity={hasAnimationLayers ? undefined : 0.28}
            transform={shadowTransform}
            className={animationClass}
          >
            {line.text}
          </text>
        );
      }

      if (layer === "measure") {
        return [
          <text
            key={`${layer}-shadow-${line.text}-${line.y}`}
            x={line.x}
            y={line.y}
            textAnchor="middle"
            dominantBaseline="middle"
            {...common}
            fill={shadowColor}
            opacity={0.24}
            transform={shadowTransform}
          >
            {line.text}
          </text>,
          <text
            key={`${layer}-fill-${line.text}-${line.y}`}
            x={line.x}
            y={line.y}
            textAnchor="middle"
            dominantBaseline="middle"
            {...common}
            fill={style.outlineColor}
            opacity={0.26}
          >
            {line.text}
          </text>,
        ];
      }

      return [
        <text
          key={`${layer}-shadow-${line.text}-${line.y}`}
          x={line.x}
          y={line.y}
          textAnchor="middle"
          dominantBaseline="middle"
          {...common}
          fill={shadowColor}
          transform={shadowTransform}
          className={animationClass}
        >
          {line.text}
        </text>,
        <text
          key={`${layer}-fill-${line.text}-${line.y}`}
          x={line.x}
          y={line.y}
          textAnchor="middle"
          dominantBaseline="middle"
          {...common}
          fill={style.outlineColor}
          className={animationClass}
        >
          {line.text}
        </text>,
      ];
    }

    if (!renderByChar) {
      return (
        <text
          key={`${layer}-${line.text}-${line.y}`}
          x={line.x}
          y={line.y}
          textAnchor="middle"
          dominantBaseline="middle"
          {...common}
          fill={layer === "source" ? (useSolidToOutline ? style.outlineColor : "#6d7471") : "transparent"}
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
          className={animationClass}
        >
          {line.text}
        </text>
      );
    }

    const chars = [...line.text];
    const widths = chars.map((char) => getGlyphAdvance(char, fontSize));
    const totalWidth = widths.reduce((sum, width) => sum + width, 0) + displayLetterSpacing * Math.max(0, chars.length - 1);
    let cursor = line.x - totalWidth / 2;

    return chars.map((char, index) => {
      const width = widths[index];
      const centerX = cursor + width / 2;
      const centerY = line.y + getPatternValue(style.glyphPattern?.yOffsets, index, 0);
      const rotation = getPatternValue(style.glyphPattern?.rotations, index, 0);
      const scale = getPatternValue(style.glyphPattern?.scales, index, 1);
      cursor += width + displayLetterSpacing;

      return (
        isShadowVariant ? (
          [
            layer === "source" ? (
              <text
                key={`${layer}-fill-${line.text}-${line.y}-${index}`}
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="middle"
                {...common}
                fontFamily={/[A-Za-z0-9]/.test(char) ? latinFontFamily : fontFamily}
                fill="#7d7b74"
                opacity={isAnimated ? undefined : 0.18}
                className={animationClass}
                data-line-index={line.lineIndex}
                data-char-index={index}
                data-char-count={chars.length}
                transform={
                  rotation || scale !== 1
                    ? `translate(${centerX} ${centerY}) rotate(${rotation}) scale(${scale}) translate(${-centerX} ${-centerY})`
                    : undefined
                }
              >
                {char}
              </text>
            ) : null,
            layer === "expand" || layer === "measure" || layer === "final" ? (
              <text
                key={`${layer}-shadow-${line.text}-${line.y}-${index}`}
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="middle"
                {...common}
                fontFamily={/[A-Za-z0-9]/.test(char) ? latinFontFamily : fontFamily}
                fill={shadowColor}
            opacity={layer === "expand" && !hasAnimationLayers ? 0.28 : layer === "measure" ? 0.24 : undefined}
                className={animationClass}
                data-line-index={line.lineIndex}
                data-char-index={index}
                data-char-count={chars.length}
                transform={`translate(${centerX + shadowOffsetX} ${centerY + shadowOffsetY}) rotate(${rotation}) scale(${scale}) translate(${-centerX} ${-centerY})`}
              >
                {char}
              </text>
            ) : null,
            layer === "measure" || layer === "final" ? (
              <text
                key={`${layer}-fill-${line.text}-${line.y}-${index}`}
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="middle"
                {...common}
                fontFamily={/[A-Za-z0-9]/.test(char) ? latinFontFamily : fontFamily}
                fill={style.outlineColor}
                stroke={style.outlineColor}
                strokeWidth={1.05}
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity={layer === "measure" ? 0.26 : undefined}
                className={animationClass}
                data-line-index={line.lineIndex}
                data-char-index={index}
                data-char-count={chars.length}
                transform={
                  rotation || scale !== 1
                    ? `translate(${centerX} ${centerY}) rotate(${rotation}) scale(${scale}) translate(${-centerX} ${-centerY})`
                    : undefined
                }
              >
                {char}
              </text>
            ) : null,
          ]
        ) : (
          <text
            key={`${layer}-${line.text}-${line.y}-${index}`}
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            {...common}
            fontFamily={/[A-Za-z0-9]/.test(char) ? latinFontFamily : fontFamily}
            fill={layer === "source" ? (useSolidToOutline ? style.outlineColor : "#6d7471") : "transparent"}
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
            className={animationClass}
            data-line-index={line.lineIndex}
            data-char-index={index}
            data-char-count={chars.length}
            transform={
              rotation || scale !== 1
                ? `translate(${centerX} ${centerY}) rotate(${rotation}) scale(${scale}) translate(${-centerX} ${-centerY})`
                : undefined
            }
          >
            {char}
          </text>
        )
      );
    });
  };

  return (
    <svg
      ref={ref}
      viewBox={`0 0 760 ${viewHeight}`}
      role="img"
      aria-label={`${style.name}预览`}
      preserveAspectRatio="xMidYMid meet"
      className={`${isAnimated ? "outline-preview-svg outline-preview-svg--animated" : "outline-preview-svg"} ${isGsapTimeline ? "outline-preview-svg--timeline" : ""} ${useSolidToOutline ? "outline-preview-svg--solid-to-outline" : ""} ${className ?? ""}`.trim()}
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

      {showSourceFill ? displayPositions.flatMap((line) => renderLine(line, "source")) : null}

      {showExpandStroke
        ? displayPositions.flatMap((line) => renderLine(line, "expand"))
        : null}

      {showFinalOutline && isAnimated
        ? displayPositions.flatMap((line) => renderLine(line, "final"))
        : showFinalOutline
          ? displayPositions.flatMap((line) => renderLine(line, "final"))
          : null}

      {mode === "measure"
        ? displayPositions.flatMap((line) => renderLine(line, "measure"))
        : null}
    </svg>
  );
});
