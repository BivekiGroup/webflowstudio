"use client";

import type { CanvasState } from "@/lib/projects";
import type { BlockId } from "@/app/dashboard/projects/block-config";
import { getBlockDefinition, getBlockProps } from "@/app/dashboard/projects/studio-workspace";
import { applyDataToBlockProps } from "@/lib/data-binding";

import type { DataSourceType } from "@prisma/client";
import type { StoredHeaders, StoredConfig } from "@/lib/data-sources";

export type PreviewDataSource = {
  id: string;
  type: DataSourceType;
  endpoint: string | null;
  method: string | null;
  headers: StoredHeaders | null;
  config: StoredConfig;
  samples: Array<{
    id: string;
    label: string;
    payload: unknown;
  }>;
};

export function renderBlock(
  block: CanvasState["blocks"][number],
  dataSources: PreviewDataSource[],
): React.ReactNode {
  const definition = getBlockDefinition(block.blockId);
  if (!definition) {
    return (
      <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
        Неизвестный блок {block.blockId}
      </div>
    );
  }

  let props = getBlockProps(block);
  let dataPreview: unknown = null;

  // Применяем данные из API если есть binding
  if (block.dataBinding?.sourceId) {
    const source = dataSources.find((item) => item.id === block.dataBinding?.sourceId);
    const sample = source?.samples.find((item) => item.id === block.dataBinding?.sampleId);

    if (sample && typeof sample.payload === "object" && sample.payload) {
      // Используем новую систему маппинга данных
      const blockId = block.blockId as BlockId;
      const customMappings = block.dataBinding.fieldMappings || undefined;

      props = applyDataToBlockProps(
        blockId,
        props,
        sample.payload,
        customMappings,
      );

      dataPreview = sample.payload;
    }
  }

  const content = definition.render(props);

  if (dataPreview) {
    return (
      <div className="space-y-4">
        {content}
        <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-4 text-xs text-slate-300">
          <p className="mb-2 font-medium text-slate-200">Пример данных</p>
          <pre className="max-h-40 overflow-auto whitespace-pre-wrap text-[11px] text-emerald-200">
            {JSON.stringify(dataPreview, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return content;
}

export function renderBlockClean(
  block: CanvasState["blocks"][number],
  dataSources: PreviewDataSource[],
  apiDataCache?: Record<string, unknown>,
): React.ReactNode {
  const definition = getBlockDefinition(block.blockId);
  if (!definition) {
    return null;
  }

  let props = getBlockProps(block);

  // Применяем РЕАЛЬНЫЕ данные из API если есть binding
  if (block.dataBinding?.sourceId) {
    const apiData = apiDataCache?.[block.dataBinding.sourceId];

    if (apiData && typeof apiData === "object") {
      // Используем новую систему маппинга данных
      const blockId = block.blockId as BlockId;
      const customMappings = block.dataBinding.fieldMappings || undefined;

      props = applyDataToBlockProps(
        blockId,
        props,
        apiData,
        customMappings,
      );
    }
  }

  return definition.render(props);
}
