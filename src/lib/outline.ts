import type { OutlineStyleId, PracticePaperId, SearchState } from "@/types/site";

export const DEFAULT_SAMPLE_TEXT = "我爱你";
export const SOFT_WARNING_LIMIT = 20;
export const MAX_LINE_COUNT = 2;

export const DEFAULT_SEARCH_STATE: SearchState = {
  text: DEFAULT_SAMPLE_TEXT,
  style: "light-modern",
  paper: "grid",
};

const validStyles = new Set<OutlineStyleId>([
  "soft-candy",
  "neat-title",
  "journal-decor",
  "chalk-board",
  "light-modern",
]);

const validPapers = new Set<PracticePaperId>(["grid", "dot"]);

export function sanitizeInput(raw: string) {
  const normalized = raw.replace(/\r/g, "").replace(/\t/g, " ").trim();
  const lines = normalized
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, MAX_LINE_COUNT);

  return lines.join("\n") || DEFAULT_SAMPLE_TEXT;
}

export function getVisibleCharCount(value: string) {
  return [...value.replace(/\s+/g, "")].length;
}

export function needsLengthWarning(value: string) {
  return getVisibleCharCount(value) > SOFT_WARNING_LIMIT;
}

function weightedLineLength(line: string) {
  return [...line].reduce((total, char) => {
    if (/\s/.test(char)) return total + 0.35;
    if (/[A-Za-z0-9]/.test(char)) return total + 0.7;
    return total + 1;
  }, 0);
}

export function splitDisplayLines(text: string) {
  const sanitized = sanitizeInput(text);
  const lines = sanitized.split("\n");
  if (lines.length > 1) {
    return lines.slice(0, MAX_LINE_COUNT);
  }

  const line = lines[0];
  const length = weightedLineLength(line);
  if (length <= 7.8) {
    return [line];
  }

  const chars = [...line];
  const midpoint = Math.ceil(chars.length / 2);
  return [chars.slice(0, midpoint).join(""), chars.slice(midpoint).join("")];
}

export function getPreviewMetrics(text: string, styleId: OutlineStyleId) {
  const lines = splitDisplayLines(text);
  const lineCount = lines.length;
  const longestLine = Math.max(...lines.map(weightedLineLength));
  const styleBonus =
    styleId === "chalk-board"
      ? -7
      : styleId === "light-modern"
        ? 2
        : styleId === "journal-decor"
          ? -5
          : styleId === "soft-candy"
            ? -2
            : 0;
  const fontSize = Math.max(60, Math.min(136, 144 - longestLine * 8.8 - (lineCount - 1) * 26 + styleBonus));
  const lineGap = fontSize * 1.05;
  const totalHeight = lineGap * (lineCount - 1);
  const startY = 160 - totalHeight / 2;
  const positions = lines.map((line, index) => ({
    text: line,
    x: 380,
    y: startY + index * lineGap,
  }));

  return {
    fontSize,
    positions,
    lineCount,
  };
}

export function readSearchState(
  source: URLSearchParams | Record<string, string | string[] | undefined> | undefined,
): SearchState {
  const text =
    source instanceof URLSearchParams
      ? source.get("text")
      : typeof source?.text === "string"
        ? source.text
        : Array.isArray(source?.text)
          ? source?.text[0]
          : undefined;
  const style =
    source instanceof URLSearchParams
      ? source.get("style")
      : typeof source?.style === "string"
        ? source.style
        : Array.isArray(source?.style)
          ? source?.style[0]
          : undefined;
  const paper =
    source instanceof URLSearchParams
      ? source.get("paper")
      : typeof source?.paper === "string"
        ? source.paper
        : Array.isArray(source?.paper)
          ? source?.paper[0]
          : undefined;

  return {
    text: sanitizeInput(text ?? DEFAULT_SEARCH_STATE.text),
    style: validStyles.has(style as OutlineStyleId) ? (style as OutlineStyleId) : DEFAULT_SEARCH_STATE.style,
    paper: validPapers.has(paper as PracticePaperId) ? (paper as PracticePaperId) : DEFAULT_SEARCH_STATE.paper,
  };
}

export function buildSearchParams(state: SearchState) {
  const params = new URLSearchParams();
  params.set("text", sanitizeInput(state.text));
  params.set("style", state.style);
  params.set("paper", state.paper);
  return params.toString();
}
