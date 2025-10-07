import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WebFlow Studio — Компонентная веб-студия",
  description:
    "Собирайте веб-приложения из готовых компонентов и экспортируйте готовый React-код с shadcn/ui.",
  metadataBase: new URL("https://webflow.studio"),
  openGraph: {
    title: "WebFlow Studio",
    description:
      "Визуальный конструктор, который генерирует чистый React-код и синхронизируется с вашей командой.",
    url: "https://webflow.studio",
    siteName: "WebFlow Studio",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebFlow Studio",
    description:
      "Визуальный редактор, который генерирует shadcn/ui компоненты и GitHub pull request.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
