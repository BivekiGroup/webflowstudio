"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { CanvasState } from "@/lib/projects";
import { renderBlockClean, type PreviewDataSource } from "@/app/dashboard/projects/studio-preview/renderer";
import { fetchApiData } from "@/lib/api-client";

type StudioPreviewProps = {
  canvasState: CanvasState;
  dataSources: PreviewDataSource[];
};

type StudioPreviewContentProps = {
  canvasState: CanvasState;
  dataSources: PreviewDataSource[];
  emptyState?: ReactNode;
};

export function StudioPreviewContent({
  canvasState,
  dataSources,
  emptyState,
}: StudioPreviewContentProps) {
  const [apiDataCache, setApiDataCache] = useState<Record<string, unknown>>({});

  // Загружаем данные для всех source при монтировании
  useEffect(() => {
    async function loadAllData() {
      for (const block of canvasState.blocks) {
        if (block.dataBinding?.sourceId) {
          const sourceId = block.dataBinding.sourceId;

          // Пропускаем если уже загружали
          if (apiDataCache[sourceId]) continue;

          const source = dataSources.find((s) => s.id === sourceId);
          if (!source) continue;

          try {
            const result = await fetchApiData({
              type: source.type,
              endpoint: source.endpoint || "",
              method: source.method,
              headers: source.headers,
              config: source.config,
            });

            if (result.success && result.data) {
              setApiDataCache((prev) => ({
                ...prev,
                [sourceId]: result.data,
              }));
            }
          } catch (error) {
            console.error(`Failed to load data for source ${sourceId}:`, error);
          }
        }
      }
    }

    loadAllData();
  }, [canvasState.blocks, dataSources, apiDataCache]);

  const renderedBlocks = canvasState.blocks.map((block) => ({
    instanceId: block.instanceId,
    content: renderBlockClean(block, dataSources, apiDataCache),
  }));

  if (renderedBlocks.length === 0) {
    return (
      emptyState ?? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Канва пуста</h2>
            <p className="mt-2 text-slate-400">
              Добавьте блоки в Studio, чтобы увидеть предпросмотр
            </p>
          </div>
        </div>
      )
    );
  }

  return (
    <div className="space-y-8">
      {renderedBlocks.map((block) => (
        <div key={block.instanceId}>
          {block.content}
        </div>
      ))}
    </div>
  );
}

export function StudioPreview({ canvasState, dataSources }: StudioPreviewProps) {
  return (
    <main className="min-h-screen bg-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_50%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.08),_transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <StudioPreviewContent canvasState={canvasState} dataSources={dataSources} />
      </div>
    </main>
  );
}
