import { faqItems } from "@/content/styles";
import { HomePageContent } from "@/components/home/home-page";
import { StructuredData } from "@/components/site/structured-data";
import { buildFaqJsonLd, buildSoftwareApplicationJsonLd, buildWebSiteJsonLd, createPageMetadata } from "@/lib/site";
import { readSearchState } from "@/lib/outline";

export const metadata = createPageMetadata({
  title: "中文空心字转换与手写教学",
  description: "输入一段文字，立即看到 5 种中文友好的空心字风格，并获得适合标题、手账、笔记和板报的手写步骤图示。",
  path: "/",
});

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ text?: string; style?: string; paper?: string }>;
}) {
  const initialState = readSearchState(await searchParams);

  return (
    <>
      <StructuredData data={buildWebSiteJsonLd()} />
      <StructuredData data={buildSoftwareApplicationJsonLd()} />
      <StructuredData data={buildFaqJsonLd(faqItems)} />
      <HomePageContent initialState={initialState} />
    </>
  );
}
