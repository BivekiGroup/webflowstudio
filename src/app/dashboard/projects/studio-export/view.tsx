"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StudioExportViewProps = {
  code: string;
  projectName: string;
};

export function StudioExportView({ code, projectName }: StudioExportViewProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy export code", error);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Экспорт проекта «{projectName}»</h1>
            <p className="text-sm text-slate-400">
              Скопируйте компонент и вставьте его в свой фронтенд. В коде используются компоненты shadcn/ui.
            </p>
          </div>
          <Button onClick={handleCopy} className="bg-emerald-500 text-slate-950 hover:bg-emerald-400">
            {copied ? "Скопировано" : "Скопировать"}
          </Button>
        </div>
        <Card className="border-slate-800/60 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-white">Компонент React</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-[70vh] overflow-auto rounded-xl bg-slate-900/80 p-6 text-sm text-emerald-200">
              <code>{code}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
