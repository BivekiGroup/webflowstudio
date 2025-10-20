"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CanvasState } from "@/lib/projects";
import { StudioPreviewContent } from "@/app/dashboard/projects/studio-preview";
import type { PreviewDataSource } from "@/app/dashboard/projects/studio-preview/renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type SharePreviewViewProps = {
  projectName: string;
  updatedAtIso: string;
  shareUrl: string;
  embedUrl: string;
  studioUrl: string;
  code: string;
  componentName: string;
  canvasState: CanvasState;
  dataSources: PreviewDataSource[];
};

type CopyButtonProps = {
  value: string;
  idleLabel: string;
  copiedLabel?: string;
  variant?: "default" | "outline" | "ghost";
  className?: string;
};

function CopyButton({ value, idleLabel, copiedLabel = "Скопировано", variant = "default", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard", error);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={handleCopy}
    >
      {copied ? copiedLabel : idleLabel}
    </Button>
  );
}

function formatUpdatedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SharePreviewView(props: SharePreviewViewProps) {
  const { projectName, updatedAtIso, shareUrl, embedUrl, studioUrl, code, componentName, canvasState, dataSources } =
    props;

  const iframeSnippet = useMemo(
    () =>
      `<iframe src="${embedUrl}" width="100%" height="720" style="border:0;border-radius:32px;background:#020817;" loading="lazy"></iframe>`,
    [embedUrl],
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Публичный предпросмотр WebFlow Studio
            </p>
            <div>
              <h1 className="text-3xl font-semibold text-white">«{projectName}»</h1>
              <p className="mt-2 text-sm text-slate-400">
                Поделитесь ссылкой с командой, встроите блоки через iframe или заберите готовый React-компонент.
              </p>
            </div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Обновлено {formatUpdatedAt(updatedAtIso)}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <CopyButton
              value={shareUrl}
              idleLabel="Скопировать ссылку"
              className="bg-emerald-500 text-slate-950 hover:bg-emerald-400"
            />
            <Button
              type="button"
              variant="ghost"
              className="border border-slate-800/60 text-slate-200 hover:border-emerald-500/40 hover:text-white"
              asChild
            >
              <a href={embedUrl} target="_blank" rel="noopener noreferrer">
                Открыть embed
              </a>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="border border-slate-800/60 text-slate-200 hover:border-emerald-500/40 hover:text-white"
              asChild
            >
              <Link href={studioUrl}>Открыть в Studio</Link>
            </Button>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,_1fr)_360px]">
          <section className="space-y-4 rounded-3xl border border-slate-800/60 bg-slate-950/80 p-6 shadow-lg">
            <StudioPreviewContent
              canvasState={canvasState}
              dataSources={dataSources}
              emptyState={
                <Card className="border-slate-800/60 bg-slate-950/60 text-center text-slate-400">
                  <CardHeader>
                    <CardTitle className="text-white">Холст пока пуст</CardTitle>
                    <CardDescription className="text-slate-500">
                      Как только блоки появятся в Studio, они сразу отобразятся здесь.
                    </CardDescription>
                  </CardHeader>
                </Card>
              }
            />
          </section>

          <aside className="space-y-4">
            <Card className="border-slate-800/60 bg-slate-950/80">
              <CardHeader>
                <CardTitle className="text-white">Поделиться</CardTitle>
                <CardDescription className="text-slate-400">
                  Скопируйте ссылку или используйте iframe, чтобы встроить предпросмотр.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Ссылка</p>
                  <code className="block rounded-lg border border-slate-800/60 bg-slate-950/60 px-3 py-2 text-xs text-emerald-200">
                    {shareUrl}
                  </code>
                  <CopyButton
                    value={shareUrl}
                    idleLabel="Скопировать ссылку"
                    variant="ghost"
                    className="w-full border border-slate-800/60 text-slate-200 hover:border-emerald-500/40 hover:text-white"
                  />
                </div>
                <Separator className="border-slate-800/60" />
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Встраивание (iframe)</p>
                  <pre className="max-h-48 overflow-auto rounded-lg border border-slate-800/60 bg-slate-950/60 p-3 text-[11px] text-emerald-200">
                    {iframeSnippet}
                  </pre>
                  <CopyButton
                    value={iframeSnippet}
                    idleLabel="Скопировать iframe"
                    variant="ghost"
                    className="w-full border border-slate-800/60 text-slate-200 hover:border-emerald-500/40 hover:text-white"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800/60 bg-slate-950/80">
              <CardHeader>
                <CardTitle className="text-white">React-компонент</CardTitle>
                <CardDescription className="text-slate-400">
                  Импортируйте компонент <span className="font-mono text-emerald-200">{componentName}</span> в проект.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <CopyButton
                  value={code}
                  idleLabel="Скопировать код"
                  className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                />
                <pre className="max-h-[320px] overflow-auto rounded-lg border border-slate-800/60 bg-slate-950/60 p-4 text-xs text-emerald-200">
                  <code>{code}</code>
                </pre>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}

