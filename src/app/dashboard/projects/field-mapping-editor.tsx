"use client";

import { useState } from "react";
import type { BlockId } from "@/app/dashboard/projects/block-config";
import { extractAvailableFields } from "@/lib/data-binding";

type FieldMapping = {
  sourcePath: string;
  targetProp: string;
};

type FieldMappingEditorProps = {
  blockId: BlockId;
  currentMappings: FieldMapping[] | null | undefined;
  sampleData: unknown;
  onChange: (mappings: FieldMapping[]) => void;
};

/**
 * Возвращает список props для блока, которые можно замаппить
 */
function getBlockPropsKeys(blockId: BlockId): string[] {
  switch (blockId) {
    case "hero":
      return ["badge", "title", "description", "primaryLabel", "secondaryLabel"];
    case "stats":
      return ["metrics"];
    case "workflow":
      return ["stages"];
    case "cta":
      return ["badge", "title", "description", "primaryLabel", "secondaryLabel"];
    case "form":
      return ["title", "description", "emailLabel", "commentLabel", "submitLabel"];
    default:
      return [];
  }
}

/**
 * Компонент для настройки маппинга полей между JSON и props блока
 * ВСЕГДА показывает ручную настройку - автоматический режим убран
 */
export function FieldMappingEditor({ blockId, currentMappings, sampleData, onChange }: FieldMappingEditorProps) {
  const [mappings, setMappings] = useState<FieldMapping[]>(currentMappings || []);

  // Извлекаем доступные поля из JSON
  const availableFields = sampleData ? extractAvailableFields(sampleData) : [];
  const blockProps = getBlockPropsKeys(blockId);

  if (!sampleData) {
    return (
      <div className="rounded-lg border border-slate-700/60 bg-slate-800/40 p-3 text-xs text-slate-400">
        Выберите sample для настройки маппинга полей
      </div>
    );
  }

  function handleMappingChange(targetProp: string, sourcePath: string) {
    const newMappings = mappings.filter((m) => m.targetProp !== targetProp);

    if (sourcePath) {
      newMappings.push({ targetProp, sourcePath });
    }

    setMappings(newMappings);
    onChange(newMappings);
  }

  function getCurrentSourcePath(targetProp: string): string {
    return mappings.find((m) => m.targetProp === targetProp)?.sourcePath || "";
  }

  function handleClearAll() {
    setMappings([]);
    onChange([]);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-slate-200">Маппинг полей API</label>
        <button
          type="button"
          onClick={handleClearAll}
          className="text-[11px] text-slate-400 hover:text-red-400"
        >
          Очистить все
        </button>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg border border-slate-700/60 bg-slate-800/40 p-3">
          <p className="mb-3 text-xs font-medium text-slate-200">Выберите поля из API для блока</p>

          <div className="space-y-2">
            {blockProps.map((propKey) => (
              <div key={propKey} className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-300">{propKey}</label>
                <select
                  value={getCurrentSourcePath(propKey)}
                  onChange={(e) => handleMappingChange(propKey, e.target.value)}
                  className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-2 py-1.5 text-xs text-slate-200 focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
                >
                  <option value="">-- Не подключено --</option>
                  {availableFields.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
          <p className="mb-2 text-xs font-medium text-emerald-200">Доступные поля в API ответе</p>
          <div className="max-h-32 overflow-auto">
            <pre className="whitespace-pre-wrap text-[10px] text-slate-300">
              {availableFields.length > 0 ? availableFields.join("\n") : "Нет полей"}
            </pre>
          </div>
        </div>

        <div className="rounded-lg border border-slate-700/60 bg-slate-800/40 p-3">
          <p className="mb-2 text-xs font-medium text-slate-200">Схема ответа (пример)</p>
          <pre className="max-h-40 overflow-auto whitespace-pre-wrap text-[10px] text-emerald-200">
            {JSON.stringify(sampleData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
