export type OutlineStyleId =
  | "soft-candy"
  | "neat-title"
  | "journal-decor"
  | "chalk-board"
  | "light-modern"
  | "shadow-note";

export type GuideSlug =
  | "outline-basics"
  | "title-outline"
  | "journal-outline"
  | "blackboard-outline";

export type PracticePaperId = "grid" | "dot";

export interface TeachingStep {
  title: string;
  shortLabel: string;
  description: string;
  coaching: string;
  emphasis: string;
}

export interface PenTips {
  startingMethod: string;
  crowdedParts: string;
  penAdvice: string;
  beginnerMistake: string;
}

export interface StyleBackground {
  from: string;
  via: string;
  to: string;
  notebook: string;
  tape: string;
}

export interface GlyphPattern {
  rotations?: number[];
  yOffsets?: number[];
  scales?: number[];
}

export interface ShadowSettings {
  color: string;
  offsetX: number;
  offsetY: number;
}

export interface OutlineStylePreset {
  id: OutlineStyleId;
  name: string;
  shortDescription: string;
  tone: string;
  previewLabel: string;
  previewBadge: string;
  bestFor: string;
  difficulty: string;
  recommendedLength: string;
  guideSlug: GuideSlug;
  strokeWidth: number;
  innerStrokeWidth: number;
  letterSpacing: number;
  fontWeight: number;
  fontFamily: string;
  latinFontFamily?: string;
  renderMode?: "line" | "chars";
  renderVariant?: "outline" | "shadow";
  glyphPattern?: GlyphPattern;
  capStyle: "round" | "square";
  cornerStyle: "round" | "square";
  accentColor: string;
  outlineColor: string;
  softFillColor: string;
  supportColor: string;
  shadow?: ShadowSettings;
  background: StyleBackground;
  exportCaption: string;
  hintSentence: string;
  scenarioTags: string[];
  commonMistakes: string[];
  teachingSteps: TeachingStep[];
  penTips: PenTips;
}

export interface ScenarioRecommendation {
  id: string;
  title: string;
  description: string;
  recommendation: string;
  styleId: OutlineStyleId;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface GuideStep {
  title: string;
  body: string;
}

export interface GuidePage {
  slug: GuideSlug;
  title: string;
  description: string;
  intro: string;
  problem: string;
  scenes: string[];
  steps: GuideStep[];
  mistakes: string[];
  closingNote: string;
  recommendedStyle: OutlineStyleId;
  howToName: string;
}

export interface PracticePaperOption {
  id: PracticePaperId;
  label: string;
  description: string;
}

export interface SearchState {
  text: string;
  style: OutlineStyleId;
  paper: PracticePaperId;
}
