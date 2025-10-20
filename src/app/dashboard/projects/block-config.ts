import type { CanvasState } from "@/lib/projects";

export type BlockId = "hero" | "stats" | "workflow" | "cta" | "form";

export type HeroProps = {
  badge: string;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
};

export type StatsMetric = {
  label: string;
  value: string;
  detail: string;
};

export type StatsProps = {
  metrics: StatsMetric[];
};

export type WorkflowStage = {
  id: string;
  label: string;
  title: string;
  description: string;
  tags: string[];
};

export type WorkflowProps = {
  stages: WorkflowStage[];
};

export type CtaProps = {
  badge: string;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
};

export type FormProps = {
  title: string;
  description: string;
  emailLabel: string;
  commentLabel: string;
  submitLabel: string;
};

export type BlockPropsMap = {
  hero: HeroProps;
  stats: StatsProps;
  workflow: WorkflowProps;
  cta: CtaProps;
  form: FormProps;
};

type DefaultPropsFactory<K extends BlockId> = () => BlockPropsMap[K];

const defaultPropsFactories: Record<BlockId, DefaultPropsFactory<BlockId>> = {
  hero: () => ({
    badge: "Новое",
    title: "Соберите экран за пару минут",
    description:
      "Настройте состояние, добавьте данные и автоматически сгенерируйте React-компоненты из библиотеки Studio.",
    primaryLabel: "Добавить этап",
    secondaryLabel: "Открыть гайд",
  }),
  stats: () => ({
    metrics: [
      { label: "Команды", value: "12", detail: "Работают в Studio ежедневно" },
      { label: "Компоненты", value: "140+", detail: "Готовых шаблонов shadcn/ui" },
      { label: "Сборка", value: "72 ч", detail: "От прототипа до production-ветки" },
    ],
  }),
  workflow: () => ({
    stages: [
      {
        id: "plan",
        label: "Планирование",
        title: "Задайте контекст",
        description:
          "Сформулируйте сценарий, отметьте зависимости и заполните чек-лист требований. Studio предложит готовые блоки.",
        tags: ["Требования", "Документация"],
      },
      {
        id: "build",
        label: "Сборка",
        title: "Соберите интерфейс",
        description: "Добавляйте блоки drag-n-drop, настраивайте состояния и подключайте моковые данные.",
        tags: ["shadcn/ui", "State presets"],
      },
      {
        id: "handoff",
        label: "Передача",
        title: "Подготовьте hand-off",
        description: "Экспортируйте код, сформируйте заметки для QA и поделитесь предпросмотром.",
        tags: ["CI/CD", "Review"],
      },
    ],
  }),
  cta: () => ({
    badge: "Экспорт",
    title: "Готовы к ревью?",
    description: "Сгенерируйте продакшн-код и отправьте Pull Request прямо из Studio.",
    primaryLabel: "Создать Pull Request",
    secondaryLabel: "Посмотреть diff",
  }),
  form: () => ({
    title: "Обратная связь команды",
    description:
      "Отправьте сценарий на ревью — дизайнеры получат уведомление и смогут оставить комментарий прямо в Studio.",
    emailLabel: "Email",
    commentLabel: "Комментарий",
    submitLabel: "Отправить",
  }),
};

export function createInstanceId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `block-${crypto.randomUUID()}`;
  }
  return `block-${Math.random().toString(36).slice(2, 10)}`;
}

export function createDefaultProps<K extends BlockId>(blockId: K): BlockPropsMap[K] {
  return clone(defaultPropsFactories[blockId]()) as BlockPropsMap[K];
}

export function createDefaultCanvas(): CanvasState {
  const heroId = createInstanceId();
  const statsId = createInstanceId();
  const workflowId = createInstanceId();
  return {
    blocks: [
      { blockId: "hero", instanceId: heroId, props: createDefaultProps("hero") },
      { blockId: "stats", instanceId: statsId, props: createDefaultProps("stats") },
      { blockId: "workflow", instanceId: workflowId, props: createDefaultProps("workflow") },
    ],
    selectedInstanceId: heroId,
  };
}

export function normalizeCanvasState(state: CanvasState): CanvasState {
  return {
    blocks: state.blocks.map((block) => ({
      ...block,
      props: normalizeProps(block.blockId as BlockId, block.props),
    })),
    selectedInstanceId: state.selectedInstanceId,
  };
}

export function normalizeProps<K extends BlockId>(blockId: K, props: unknown): BlockPropsMap[K] {
  switch (blockId) {
    case "hero": {
      const defaults = defaultPropsFactories.hero() as HeroProps;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const candidate = (props ?? {}) as any;
      const result: HeroProps = {
        badge: typeof candidate.badge === "string" ? candidate.badge : defaults.badge,
        title: typeof candidate.title === "string" ? candidate.title : defaults.title,
        description: typeof candidate.description === "string" ? candidate.description : defaults.description,
        primaryLabel: typeof candidate.primaryLabel === "string" ? candidate.primaryLabel : defaults.primaryLabel,
        secondaryLabel:
          typeof candidate.secondaryLabel === "string" ? candidate.secondaryLabel : defaults.secondaryLabel,
      };
      return result as BlockPropsMap[K];
    }
    case "stats": {
      const defaults = defaultPropsFactories.stats() as StatsProps;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const candidate = props as any;
      const metricsSource =
        candidate?.metrics && Array.isArray(candidate.metrics) && candidate.metrics.length > 0
          ? candidate.metrics
          : defaults.metrics;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const metrics = metricsSource.map((metric: any, index: number) => {
        const fallback = defaults.metrics[index % defaults.metrics.length];
        return {
          label: typeof metric?.label === "string" ? metric.label : fallback.label,
          value: typeof metric?.value === "string" ? metric.value : fallback.value,
          detail: typeof metric?.detail === "string" ? metric.detail : fallback.detail,
        };
      });
      const result: StatsProps = { metrics };
      return result as BlockPropsMap[K];
    }
    case "workflow": {
      const defaults = defaultPropsFactories.workflow() as WorkflowProps;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const candidate = props as any;
      const stagesSource =
        candidate?.stages && Array.isArray(candidate.stages) && candidate.stages.length > 0
          ? candidate.stages
          : defaults.stages;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stages = stagesSource.map((stage: any, index: number) => {
        const fallback = defaults.stages[index % defaults.stages.length];
        return {
          id: typeof stage?.id === "string" && stage.id.trim() ? stage.id : fallback.id,
          label: typeof stage?.label === "string" ? stage.label : fallback.label,
          title: typeof stage?.title === "string" ? stage.title : fallback.title,
          description: typeof stage?.description === "string" ? stage.description : fallback.description,
          tags:
            Array.isArray(stage?.tags) && stage.tags.length > 0
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                stage.tags.filter((tag: any): tag is string => typeof tag === "string" && tag.trim().length > 0)
              : fallback.tags,
        };
      });
      const result: WorkflowProps = { stages };
      return result as BlockPropsMap[K];
    }
    case "cta": {
      const defaults = defaultPropsFactories.cta() as CtaProps;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const candidate = (props ?? {}) as any;
      const result: CtaProps = {
        badge: typeof candidate.badge === "string" ? candidate.badge : defaults.badge,
        title: typeof candidate.title === "string" ? candidate.title : defaults.title,
        description: typeof candidate.description === "string" ? candidate.description : defaults.description,
        primaryLabel: typeof candidate.primaryLabel === "string" ? candidate.primaryLabel : defaults.primaryLabel,
        secondaryLabel:
          typeof candidate.secondaryLabel === "string" ? candidate.secondaryLabel : defaults.secondaryLabel,
      };
      return result as BlockPropsMap[K];
    }
    case "form": {
      const defaults = defaultPropsFactories.form() as FormProps;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const candidate = (props ?? {}) as any;
      const result: FormProps = {
        title: typeof candidate.title === "string" ? candidate.title : defaults.title,
        description: typeof candidate.description === "string" ? candidate.description : defaults.description,
        emailLabel: typeof candidate.emailLabel === "string" ? candidate.emailLabel : defaults.emailLabel,
        commentLabel: typeof candidate.commentLabel === "string" ? candidate.commentLabel : defaults.commentLabel,
        submitLabel: typeof candidate.submitLabel === "string" ? candidate.submitLabel : defaults.submitLabel,
      };
      return result as BlockPropsMap[K];
    }
    default:
      return props as BlockPropsMap[K];
  }
}

export function getBlockDefaultProps(blockId: BlockId): BlockPropsMap[BlockId] {
  return createDefaultProps(blockId);
}

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}
