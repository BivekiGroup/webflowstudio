"use client";

import { useState } from "react";
import JSZip from "jszip";
import { Download, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CanvasState } from "@/lib/projects";
import { exportCanvasToCode, type ExportFormat } from "@/lib/code-export";

type EnhancedExportViewProps = {
  canvasState: CanvasState;
  projectName: string;
  projectSlug: string;
};

export function EnhancedExportView({ canvasState, projectName, projectSlug }: EnhancedExportViewProps) {
  const selectedFormat: ExportFormat = "nextjs";
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const exportResult = exportCanvasToCode(canvasState, selectedFormat, projectName);

  async function handleCopyAll() {
    try {
      const allCode = exportResult.files.map((file) => `// ${file.path}\n${file.content}`).join("\n\n" + "=".repeat(80) + "\n\n");
      await navigator.clipboard.writeText(allCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code", error);
    }
  }

  async function handleDownloadZip() {
    try {
      setIsDownloading(true);
      const zip = new JSZip();

      // Add all files to the zip
      exportResult.files.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Generate the zip file
      const blob = await zip.generateAsync({ type: "blob" });

      // Download the file
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${projectSlug}-${selectedFormat}-export.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate ZIP", error);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_50%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.08),_transparent_55%)]" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Экспорт проекта</h1>
            <p className="mt-2 text-slate-400">{projectName}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCopyAll} variant="ghost" className="gap-2">
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Скопировано
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Скопировать всё
                </>
              )}
            </Button>
            <Button onClick={handleDownloadZip} disabled={isDownloading} className="gap-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400">
              <Download className="h-4 w-4" />
              {isDownloading ? "Скачивание..." : "Скачать ZIP"}
            </Button>
          </div>
        </div>

        {/* Format info */}
        <Card className="border-white/10 bg-slate-800/40">
          <CardHeader>
            <CardTitle className="text-white">Next.js Application</CardTitle>
            <CardDescription>Next.js приложение с App Router. Требует установки зависимостей через npm install.</CardDescription>
          </CardHeader>
        </Card>

        {/* File preview */}
        <Card className="border-white/10 bg-slate-800/40">
          <CardHeader>
            <CardTitle className="text-white">Предпросмотр кода</CardTitle>
            <CardDescription>
              В архиве {exportResult.files.length} файлов: ваши компоненты, UI библиотека shadcn/ui, конфигурация Tailwind и TypeScript
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FilePreviewTabs files={exportResult.files} />
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="border-white/10 bg-slate-800/40">
          <CardHeader>
            <CardTitle className="text-white">Как использовать</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <ol className="list-inside list-decimal space-y-2">
              <li>Нажмите кнопку &quot;Скачать ZIP&quot; чтобы скачать архив с проектом</li>
              <li>Распакуйте архив в папку проекта</li>
              <li>Установите зависимости: <code className="rounded bg-slate-950 px-2 py-1">npm install</code></li>
              <li>Запустите dev-сервер: <code className="rounded bg-slate-950 px-2 py-1">npm run dev</code></li>
              <li>Для продакшена соберите проект: <code className="rounded bg-slate-950 px-2 py-1">npm run build</code></li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function FilePreviewTabs({ files }: { files: { path: string; content: string }[] }) {
  const [showAllFiles, setShowAllFiles] = useState(false);

  // Разделяем файлы на категории
  const mainFiles = files.filter(
    (f) =>
      f.path.includes("page.tsx") ||
      f.path.includes("layout.tsx") ||
      (f.path.startsWith("src/components/") && !f.path.includes("/ui/") && f.path.endsWith(".tsx"))
  );

  const uiFiles = files.filter((f) => f.path.includes("/ui/") && f.path.endsWith(".tsx"));

  const configFiles = files.filter(
    (f) =>
      f.path.endsWith(".json") ||
      f.path.endsWith(".config.ts") ||
      f.path.endsWith(".config.js") ||
      f.path.endsWith(".config.mjs") ||
      f.path.includes("utils.ts") ||
      f.path.includes("gitignore")
  );

  const styleFiles = files.filter((f) => f.path.endsWith(".css"));

  const displayFiles = showAllFiles ? files : mainFiles;
  const defaultFile = mainFiles[0]?.path || files[0]?.path;

  return (
    <div className="space-y-4">
      {/* Главные табы */}
      <Tabs defaultValue={defaultFile} className="w-full">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <TabsList className="flex flex-wrap justify-start gap-2 bg-slate-900/50">
            {displayFiles.slice(0, showAllFiles ? undefined : 6).map((file) => (
              <TabsTrigger
                key={file.path}
                value={file.path}
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950"
              >
                {file.path.split("/").pop()}
              </TabsTrigger>
            ))}
          </TabsList>
          {mainFiles.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setShowAllFiles(!showAllFiles)} className="text-slate-400">
              {showAllFiles ? "Скрыть служебные файлы" : `Показать все файлы (${files.length})`}
            </Button>
          )}
        </div>

        {displayFiles.map((file) => (
          <TabsContent key={file.path} value={file.path}>
            <FilePreview file={file} />
          </TabsContent>
        ))}
      </Tabs>

      {/* Информация о категориях файлов */}
      {!showAllFiles && (
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-slate-900/50 p-4">
            <div className="text-sm font-medium text-white">UI Компоненты</div>
            <div className="mt-1 text-xs text-slate-400">{uiFiles.length} файлов shadcn/ui</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-900/50 p-4">
            <div className="text-sm font-medium text-white">Конфигурация</div>
            <div className="mt-1 text-xs text-slate-400">{configFiles.length} config файлов</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-900/50 p-4">
            <div className="text-sm font-medium text-white">Стили</div>
            <div className="mt-1 text-xs text-slate-400">{styleFiles.length} CSS файлов</div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilePreview({ file }: { file: { path: string; content: string } }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy file content", error);
    }
  }

  const language = file.path.endsWith(".html")
    ? "html"
    : file.path.endsWith(".css")
    ? "css"
    : file.path.endsWith(".js")
    ? "javascript"
    : file.path.endsWith(".tsx") || file.path.endsWith(".ts")
    ? "typescript"
    : file.path.endsWith(".json")
    ? "json"
    : "markdown";

  return (
    <div className="relative">
      <div className="absolute right-2 top-2 z-10">
        <Button onClick={handleCopy} size="sm" variant="ghost" className="gap-2 bg-slate-950/80 backdrop-blur">
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Скопировано
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Копировать
            </>
          )}
        </Button>
      </div>
      <pre className="max-h-[600px] overflow-auto rounded-xl bg-slate-950/80 p-6 text-sm">
        <code className={`language-${language} text-emerald-200`}>{file.content}</code>
      </pre>
    </div>
  );
}
