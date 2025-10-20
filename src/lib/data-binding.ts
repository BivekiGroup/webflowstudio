import type { BlockId, BlockPropsMap } from "@/app/dashboard/projects/block-config";

type MetricItem = {
  label?: string;
  name?: string;
  value?: string | number;
  count?: string | number;
  detail?: string;
  description?: string;
};

type StageItem = {
  id?: string;
  label?: string;
  name?: string;
  title?: string;
  description?: string;
  tags?: string[];
};

type DataWithMetrics = {
  metrics?: MetricItem[];
};

type DataWithStages = {
  stages?: StageItem[];
};

/**
 * Извлекает значение из объекта по пути (например, "user.name" или "items[0].title")
 */
export function getValueByPath(data: unknown, path: string): unknown {
  if (!path || !data || typeof data !== "object") {
    return undefined;
  }

  const parts = path.split(".");
  let current: unknown = data;

  for (const part of parts) {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    // Обработка массивов: items[0]
    const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      const [, key, index] = arrayMatch;
      const obj = current as Record<string, unknown>;
      const arr = obj[key];
      if (Array.isArray(arr)) {
        current = arr[parseInt(index, 10)];
      } else {
        return undefined;
      }
    } else {
      const obj = current as Record<string, unknown>;
      current = obj[part];
    }

    if (current === undefined || current === null) {
      return undefined;
    }
  }

  return current;
}

/**
 * Определяет, как маппить поля из JSON в props блока
 */
export type FieldMapping = {
  sourcePath: string; // путь в JSON, например "user.name"
  targetProp: string; // поле в props блока, например "title"
};

/**
 * Конфигурация маппинга для каждого типа блока
 */
export type BlockDataMapping = {
  [K in BlockId]?: {
    fields: FieldMapping[];
    // Можно добавить трансформации
    transform?: (data: unknown) => Partial<BlockPropsMap[K]>;
  };
};

/**
 * Стандартные маппинги для блоков
 * Пользователь может их переопределить через UI
 */
export const defaultBlockMappings: BlockDataMapping = {
  hero: {
    fields: [
      { sourcePath: "badge", targetProp: "badge" },
      { sourcePath: "title", targetProp: "title" },
      { sourcePath: "description", targetProp: "description" },
      { sourcePath: "primaryButton", targetProp: "primaryLabel" },
      { sourcePath: "secondaryButton", targetProp: "secondaryLabel" },
    ],
  },
  stats: {
    fields: [{ sourcePath: "metrics", targetProp: "metrics" }],
    transform: (data: unknown) => {
      const typedData = data as DataWithMetrics;
      // Если data.metrics - массив объектов с нужной структурой
      if (Array.isArray(typedData?.metrics)) {
        return {
          metrics: typedData.metrics.map((item: MetricItem) => ({
            label: item.label || item.name || "",
            value: String(item.value || item.count || ""),
            detail: item.detail || item.description || "",
          })),
        };
      }
      return {};
    },
  },
  workflow: {
    fields: [{ sourcePath: "stages", targetProp: "stages" }],
    transform: (data: unknown) => {
      const typedData = data as DataWithStages;
      if (Array.isArray(typedData?.stages)) {
        return {
          stages: typedData.stages.map((item: StageItem, index: number) => ({
            id: item.id || `stage-${index}`,
            label: item.label || item.name || "",
            title: item.title || "",
            description: item.description || "",
            tags: Array.isArray(item.tags) ? item.tags : [],
          })),
        };
      }
      return {};
    },
  },
  cta: {
    fields: [
      { sourcePath: "badge", targetProp: "badge" },
      { sourcePath: "title", targetProp: "title" },
      { sourcePath: "description", targetProp: "description" },
      { sourcePath: "primaryButton", targetProp: "primaryLabel" },
      { sourcePath: "secondaryButton", targetProp: "secondaryLabel" },
    ],
  },
  form: {
    fields: [
      { sourcePath: "title", targetProp: "title" },
      { sourcePath: "description", targetProp: "description" },
      { sourcePath: "emailLabel", targetProp: "emailLabel" },
      { sourcePath: "commentLabel", targetProp: "commentLabel" },
      { sourcePath: "submitLabel", targetProp: "submitLabel" },
    ],
  },
};

/**
 * Применяет данные из API к props блока
 * ТОЛЬКО если есть явный маппинг - автоматический режим убран
 */
export function applyDataToBlockProps<K extends BlockId>(
  blockId: K,
  currentProps: BlockPropsMap[K],
  apiData: unknown,
  customMapping?: FieldMapping[],
): BlockPropsMap[K] {
  if (!apiData || typeof apiData !== "object") {
    return currentProps;
  }

  // Работаем ТОЛЬКО с явным маппингом
  // Автоматический режим полностью убран
  if (!customMapping || customMapping.length === 0) {
    return currentProps;
  }

  const updates: Partial<BlockPropsMap[K]> = {};

  for (const field of customMapping) {
    const value = getValueByPath(apiData, field.sourcePath);
    if (value !== undefined) {
      (updates as Record<string, unknown>)[field.targetProp] = value;
    }
  }

  return {
    ...currentProps,
    ...updates,
  } as BlockPropsMap[K];
}

/**
 * Определяет, какие поля доступны для маппинга в данных
 */
export function extractAvailableFields(data: unknown, prefix = ""): string[] {
  const fields: string[] = [];

  if (!data || typeof data !== "object") {
    return fields;
  }

  for (const [key, value] of Object.entries(data)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object") {
      if (Array.isArray(value)) {
        fields.push(path);
        // Для массивов показываем структуру первого элемента
        if (value.length > 0 && typeof value[0] === "object") {
          const subFields = extractAvailableFields(value[0], `${path}[0]`);
          fields.push(...subFields);
        }
      } else {
        fields.push(path);
        const subFields = extractAvailableFields(value, path);
        fields.push(...subFields);
      }
    } else {
      fields.push(path);
    }
  }

  return fields;
}

/**
 * Создает превью данных для отображения в UI
 */
export function createDataPreview(data: unknown): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}
