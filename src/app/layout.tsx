import type { Metadata } from "next";
import "./globals.css";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body>
        <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
          <SiteHeader />
          <main className="min-h-[calc(100vh-180px)]">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
