import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { electionData } from "@/lib/generated-data";
import { SampleDataNotice } from "./components/SampleDataNotice";
import { SiteHeader, SiteFooter } from "./components/SiteHeader";
import "./globals.css";

const siteName = "ふくおか・みらいマッチ";
const description = "20の質問から、考えの近い候補者を探す無党派のボートマッチ。回答は送信・保存せず、すべての立場を出典つきで公開します。";

export const metadata: Metadata = {
  metadataBase: new URL("https://fukuoka-votematch-2026-uzu83s-projects.vercel.app"),
  title: { default: `${siteName}｜2026年福岡市長選挙`, template: `%s｜${siteName}` },
  description,
  applicationName: siteName,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website", locale: "ja_JP", siteName,
    title: `${siteName}｜2026年福岡市長選挙`, description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "20の質問で、自分の考えを確かめる。ふくおか・みらいマッチ" }],
  },
  twitter: { card: "summary_large_image", title: siteName, description, images: ["/og.png"] },
};

export const viewport: Viewport = {
  themeColor: "#fbfcfa",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <SiteHeader />
        {electionData.source === "fixtures" ? <SampleDataNotice /> : null}
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
