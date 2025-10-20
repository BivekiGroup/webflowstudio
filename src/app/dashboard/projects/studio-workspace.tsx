"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DataSourceType } from "@prisma/client";
import {
  Database,
  Edit3,
  GripVertical,
  LayoutTemplate,
  Layers,
  Plus,
  RefreshCw,
  Settings,
  Share2,
  Sparkles,
  Trash,
  Trash2,
  Wand2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { CanvasState, CanvasDataBinding } from "@/lib/projects";
import type { DataSourceRecord, DataSampleRecord, StoredConfig } from "@/lib/data-sources";
import {
  type BlockId,
  type HeroProps,
  type StatsProps,
  type StatsMetric,
  type WorkflowProps,
  type WorkflowStage,
  type CtaProps,
  type FormProps,
  type BlockPropsMap,
  createInstanceId,
  createDefaultProps,
  createDefaultCanvas,
  normalizeCanvasState,
  normalizeProps,
} from "@/app/dashboard/projects/block-config";
import { FieldMappingEditor } from "@/app/dashboard/projects/field-mapping-editor";
import { applyDataToBlockProps } from "@/lib/data-binding";
import { fetchApiData } from "@/lib/api-client";

type BlockDefinition<K extends BlockId = BlockId> = {
  id: K;
  title: string;
  description: string;
  createDefaultProps: () => BlockPropsMap[K];
  render: (props: BlockPropsMap[K]) => ReactNode;
  preview: ReactNode;
  tags: string[];
};

const heroBlock: BlockDefinition<"hero"> = {
  id: "hero",
  title: "Hero-блок",
  description: "Заголовок, описание и CTA с бейджем статуса.",
  tags: ["Маркетинг", "CTA"],
  createDefaultProps: () => createDefaultProps("hero"),
  render: (props: HeroProps) => (
    <Card className="border-emerald-500/20 bg-slate-950/80">
      <CardHeader className="gap-2">
        <Badge className="w-fit border border-emerald-500/40 bg-emerald-500/10 text-emerald-200">{props.badge}</Badge>
        <CardTitle className="text-2xl text-white">{props.title}</CardTitle>
        <CardDescription className="max-w-2xl text-base text-slate-300">{props.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-3">
        <Button className="bg-emerald-500 text-slate-950 hover:bg-emerald-400">{props.primaryLabel}</Button>
        <Button variant="ghost" className="text-slate-200 hover:text-white">
          {props.secondaryLabel}
        </Button>
      </CardContent>
    </Card>
  ),
  preview: (
    <div className="rounded-xl border border-emerald-500/20 bg-slate-950/70 p-4 text-xs text-slate-300 shadow-sm">
      <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-200">
        <Sparkles className="h-3 w-3" />
        Hero
      </div>
      <div className="text-sm font-semibold text-white">Соберите экран за пару минут</div>
      <div className="mt-1 h-2 w-24 rounded bg-slate-700" />
    </div>
  ),
};

const statsBlock: BlockDefinition<"stats"> = {
  id: "stats",
  title: "Карточки метрик",
  description: "Три карточки с ключевыми показателями продукта.",
  tags: ["Аналитика", "Дэшборд"],
  createDefaultProps: () => createDefaultProps("stats"),
  render: (props: StatsProps) => (
    <div className="grid gap-3 md:grid-cols-3">
      {props.metrics.map((metric: StatsMetric, index: number) => (
        <Card key={`${metric.label}-${index}`} className="border-slate-800/60 bg-slate-950/75">
          <CardHeader className="space-y-1">
            <CardDescription className="text-xs uppercase tracking-wide text-slate-400">
              {metric.label}
            </CardDescription>
            <CardTitle className="text-3xl text-white">{metric.value}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-400">{metric.detail}</CardContent>
        </Card>
      ))}
    </div>
  ),
  preview: (
    <div className="grid gap-1 rounded-xl border border-slate-800/60 bg-slate-950/70 p-3 text-xs text-slate-300">
      <div className="h-2 w-16 rounded bg-slate-700" />
      <div className="h-3 w-12 rounded bg-emerald-500/60" />
      <div className="h-2 w-24 rounded bg-slate-700" />
    </div>
  ),
};

const workflowBlock: BlockDefinition<"workflow"> = {
  id: "workflow",
  title: "Этапы флоу",
  description: "Табулированный сценарий с переключениями этапов.",
  tags: ["Флоу", "Навигация"],
  createDefaultProps: () => createDefaultProps("workflow"),
  render: (props: WorkflowProps) => {
    const initialStageId = props.stages[0]?.id ?? "stage-0";
    return (
      <Tabs defaultValue={initialStageId} className="w-full">
        <TabsList>
          {props.stages.map((stage: WorkflowStage) => (
            <TabsTrigger key={stage.id} value={stage.id}>
              {stage.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {props.stages.map((stage: WorkflowStage) => (
          <TabsContent key={stage.id} value={stage.id}>
            <div className="space-y-3 text-slate-300">
              <h3 className="text-xl font-semibold text-white">{stage.title}</h3>
              <p>{stage.description}</p>
              <Separator className="border-slate-800/60" />
              <div className="flex flex-wrap gap-2">
                {stage.tags.map((tag: string, tagIndex: number) => (
                  <Badge key={`${stage.id}-${tag}-${tagIndex}`} className="border border-slate-700 bg-slate-800/70 text-slate-200">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    );
  },
  preview: (
    <div className="rounded-xl border border-slate-800/60 bg-slate-950/70 p-3 text-xs text-slate-300">
      <div className="mb-2 flex gap-1">
        <span className="rounded-full bg-emerald-500/80 px-2 py-1 text-white">Plan</span>
        <span className="rounded-full bg-slate-800 px-2 py-1 text-slate-500">Build</span>
        <span className="rounded-full bg-slate-800 px-2 py-1 text-slate-500">Handoff</span>
      </div>
      <div className="h-2 w-28 rounded bg-slate-700" />
      <div className="mt-1 h-2 w-16 rounded bg-slate-700" />
    </div>
  ),
};

const ctaBlock: BlockDefinition<"cta"> = {
  id: "cta",
  title: "Call-to-action",
  description: "Карточка с текстом, бейджем и кнопкой.",
  tags: ["CTA", "Маркетинг"],
  createDefaultProps: () => createDefaultProps("cta"),
  render: (props: CtaProps) => (
    <Card className="border-blue-500/30 bg-slate-950/75">
      <CardHeader className="space-y-2">
        <Badge className="w-fit border border-blue-400/40 bg-blue-500/10 text-blue-200">{props.badge}</Badge>
        <CardTitle className="text-2xl text-white">{props.title}</CardTitle>
        <CardDescription className="text-base text-slate-300">{props.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        <Button className="bg-blue-500 text-white hover:bg-blue-400">{props.primaryLabel}</Button>
        <Button variant="ghost" className="text-slate-200 hover:text-white">
          {props.secondaryLabel}
        </Button>
      </CardContent>
    </Card>
  ),
  preview: (
    <div className="rounded-xl border border-blue-500/20 bg-slate-950/70 p-3 text-xs text-slate-300">
      <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-blue-200">
        CTA
      </div>
      <div className="text-sm font-semibold text-white">Готовы к ревью?</div>
      <div className="mt-1 h-2 w-24 rounded bg-slate-700" />
    </div>
  ),
};

const formBlock: BlockDefinition<"form"> = {
  id: "form",
  title: "Форма отклика",
  description: "Мини-форма с полями и кнопкой, собранная на shadcn/ui.",
  tags: ["Форма", "Onboarding"],
  createDefaultProps: () => createDefaultProps("form"),
  render: (props: FormProps) => (
    <Card className="border-slate-800/60 bg-slate-950/80">
      <CardHeader>
        <CardTitle className="text-white">{props.title}</CardTitle>
        <CardDescription className="text-slate-400">{props.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-200">{props.emailLabel}</Label>
          <Input placeholder="team@yourcompany.com" className="border-slate-800 bg-slate-950 text-white" />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-200">{props.commentLabel}</Label>
          <textarea
            placeholder="Опишите, что нужно проверить или собрать."
            className="min-h-[96px] w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
          />
        </div>
        <Button className="bg-emerald-500 text-slate-950 hover:bg-emerald-400">{props.submitLabel}</Button>
      </CardContent>
    </Card>
  ),
  preview: (
    <div className="rounded-xl border border-slate-800/60 bg-slate-950/70 p-3 text-xs text-slate-300">
      <div className="h-2 w-16 rounded bg-slate-700" />
      <div className="mt-2 h-8 rounded bg-slate-900" />
      <div className="mt-2 h-6 w-20 rounded bg-emerald-500/70" />
    </div>
  ),
};

export const blockPalette: readonly BlockDefinition[] = [
  heroBlock as BlockDefinition,
  statsBlock as BlockDefinition,
  workflowBlock as BlockDefinition,
  ctaBlock as BlockDefinition,
  formBlock as BlockDefinition,
];

const blockPaletteById = new Map<BlockId, BlockDefinition>(
  blockPalette.map((definition) => [definition.id, definition as BlockDefinition]),
);

export function getBlockDefinition(blockId: string): BlockDefinition | undefined {
  return blockPaletteById.get(blockId as BlockId);
}

export function getBlockProps(block: CanvasState["blocks"][number]): BlockPropsMap[BlockId] {
  return normalizeProps(block.blockId as BlockId, block.props);
}

type CreateSourcePayload = {
  name: string;
  type: DataSourceType;
  endpoint?: string | null;
  method?: string | null;
  description?: string | null;
  config?: StoredConfig;
};

type UpdateSourcePayload = {
  name?: string;
  type?: DataSourceType;
  endpoint?: string | null;
  method?: string | null;
  description?: string | null;
  config?: StoredConfig;
};

type SampleUpsertPayload = {
  sourceId: string;
  sampleId?: string;
  label: string;
  payload: unknown;
};

type StudioWorkspaceProps = {
  projectName: string;
  initialCanvasState: CanvasState | null;
  initialDataSources: DataSourceRecord[];
  projectSlug: string;
  onSave: (state: CanvasState) => Promise<void>;
  onReset: () => Promise<CanvasState | null>;
  onCreateDataSource: (payload: CreateSourcePayload) => Promise<DataSourceRecord>;
  onUpdateDataSource: (sourceId: string, patch: UpdateSourcePayload) => Promise<DataSourceRecord>;
  onDeleteDataSource: (sourceId: string) => Promise<void>;
  onUpsertSample: (payload: SampleUpsertPayload) => Promise<DataSampleRecord>;
  onDeleteSample: (sampleId: string) => Promise<void>;
};

export function StudioWorkspace({
  projectName,
  initialCanvasState,
  initialDataSources,
  projectSlug,
  onSave,
  onReset,
  onCreateDataSource,
  onUpdateDataSource,
  onDeleteDataSource,
  onUpsertSample,
  onDeleteSample,
}: StudioWorkspaceProps) {
  const defaultCanvas = useMemo<CanvasState>(() => createDefaultCanvas(), []);
  const [canvas, setCanvas] = useState<CanvasState>(initialCanvasState ?? defaultCanvas);
  const canvasRef = useRef(canvas);
  const lastPersistedCanvasRef = useRef<CanvasState>(initialCanvasState ?? defaultCanvas);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const skipAutoSaveRef = useRef(false);
  const isInitialRenderRef = useRef(true);

  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [dataSources, setDataSources] = useState<DataSourceRecord[]>(initialDataSources);
  const [activeSourceId, setActiveSourceId] = useState<string | null>(initialDataSources[0]?.id ?? null);
  const [dataMessage, setDataMessage] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [dataPending, setDataPending] = useState(false);
  const dataMessageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Реальные данные из API для каждого source
  // { sourceId: { data, loading, error } }
  const [apiDataCache, setApiDataCache] = useState<Record<string, { data: unknown; loading: boolean; error?: string }>>({});

  useEffect(() => {
    canvasRef.current = canvas;
  }, [canvas]);

  useEffect(() => {
    const sourceState = initialCanvasState ?? defaultCanvas;
    const currentStateSnapshot = canvasRef.current;
    const isSameState = areCanvasStatesEqual(normalizeCanvasState(sourceState), normalizeCanvasState(currentStateSnapshot));

    if (isSameState) {
      return;
    }

    const normalized = normalizeCanvasState(sourceState);
    skipAutoSaveRef.current = true;
    setCanvas(normalized);
    lastPersistedCanvasRef.current = normalized;

    const nextNotes: Record<string, string> = {};
    normalized.blocks.forEach((block) => {
      if (block.notes) {
        nextNotes[block.instanceId] = block.notes;
      }
    });
    setNotesDraft(nextNotes);
  }, [initialCanvasState, defaultCanvas]);

  useEffect(() => {
    setDataSources(initialDataSources);
  }, [initialDataSources]);

  useEffect(() => {
    if (activeSourceId && !dataSources.some((source) => source.id === activeSourceId)) {
      setActiveSourceId(dataSources[0]?.id ?? null);
    }
  }, [dataSources, activeSourceId]);

  useEffect(() => {
    const current = canvasRef.current;
    const availableSourceIds = new Set(dataSources.map((source) => source.id));
    let changed = false;

    const nextBlocks = current.blocks.map((block) => {
      if (block.dataBinding && !availableSourceIds.has(block.dataBinding.sourceId)) {
        changed = true;
        const nextBlock = { ...block };
        delete nextBlock.dataBinding;
        return nextBlock;
      }

      if (block.dataBinding?.sampleId) {
        const source = dataSources.find((item) => item.id === block.dataBinding?.sourceId);
        if (!source?.samples.some((sample) => sample.id === block.dataBinding?.sampleId)) {
          changed = true;
          return {
            ...block,
            dataBinding: {
              ...block.dataBinding,
              sampleId: null,
            },
          };
        }
      }

      return block;
    });

    if (changed) {
      syncCanvas({
        blocks: nextBlocks,
        selectedInstanceId: current.selectedInstanceId,
      });
    }
  }, [dataSources]);

  useEffect(() => {
    const currentTimeout = dataMessageTimeoutRef.current;
    return () => {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, []);

  const placedBlocks = canvas.blocks;
  const selectedInstanceId = canvas.selectedInstanceId;

  const selectedBlock = useMemo(
    () => placedBlocks.find((item) => item.instanceId === selectedInstanceId) ?? null,
    [placedBlocks, selectedInstanceId],
  );

  const selectedDefinition = selectedBlock ? getBlockDefinition(selectedBlock.blockId) ?? null : null;
  const selectedProps = selectedBlock ? getBlockProps(selectedBlock) : null;
  const binding = selectedBlock?.dataBinding ?? null;
  const boundSource = binding ? dataSources.find((source) => source.id === binding.sourceId) ?? null : null;
  const boundSample =
    binding && boundSource ? boundSource.samples.find((sample) => sample.id === binding.sampleId) ?? null : null;

  useEffect(() => {
    if (binding?.sourceId) {
      setActiveSourceId((prev) => (prev === binding.sourceId ? prev : binding.sourceId));
    }
  }, [binding?.sourceId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  function syncCanvas(nextCanvas: CanvasState) {
    setCanvas(nextCanvas);
  }

  useEffect(() => {
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return;
    }

    if (skipAutoSaveRef.current) {
      skipAutoSaveRef.current = false;
      return;
    }

    if (areCanvasStatesEqual(canvas, lastPersistedCanvasRef.current)) {
      setSaveStatus("success");
      setSaveMessage("Черновик актуален.");
      return;
    }

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    setSaveStatus("idle");
    setSaveMessage("Автосохранение...");

    autoSaveTimerRef.current = setTimeout(async () => {
      setIsAutoSaving(true);
      try {
        await onSave(canvas);
        lastPersistedCanvasRef.current = canvas;
        setSaveStatus("success");
        setSaveMessage("Автосохранено.");
      } catch (error) {
        console.error("Failed to auto-save canvas", error);
        setSaveStatus("error");
        setSaveMessage(error instanceof Error ? error.message : "Не удалось автосохранить.");
      } finally {
        setIsAutoSaving(false);
        autoSaveTimerRef.current = null;
      }
    }, 1200);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    };
  }, [canvas, onSave]);

  useEffect(
    () => () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      if (dataMessageTimeoutRef.current) {
        clearTimeout(dataMessageTimeoutRef.current);
      }
    },
    [],
  );

  function showDataMessage(message: string) {
    if (dataMessageTimeoutRef.current) {
      clearTimeout(dataMessageTimeoutRef.current);
    }
    setDataError(null);
    setDataMessage(message);
    dataMessageTimeoutRef.current = setTimeout(() => setDataMessage(null), 4000);
  }

  function showDataError(message: string) {
    if (dataMessageTimeoutRef.current) {
      clearTimeout(dataMessageTimeoutRef.current);
    }
    setDataMessage(null);
    setDataError(message);
    dataMessageTimeoutRef.current = setTimeout(() => setDataError(null), 6000);
  }

  function handleAddBlock(blockId: string) {
    const instanceId = createInstanceId();
    const defaultProps = createDefaultProps(blockId as BlockId);
    const nextBlocks = [
      ...placedBlocks,
      {
        blockId,
        instanceId,
        props: defaultProps,
      },
    ];
    syncCanvas({ blocks: nextBlocks, selectedInstanceId: instanceId });
  }

  function handleSelectBlock(instanceId: string) {
    syncCanvas({ blocks: placedBlocks, selectedInstanceId: instanceId });
    setInspectorSheetOpen(true);
  }

  function handleRemoveBlock(instanceId: string) {
    const nextBlocks = placedBlocks.filter((item) => item.instanceId !== instanceId);
    const nextSelected =
      selectedInstanceId === instanceId ? nextBlocks[0]?.instanceId ?? null : selectedInstanceId;
    const nextNotes = { ...notesDraft };
    delete nextNotes[instanceId];
    setNotesDraft(nextNotes);
    syncCanvas({ blocks: nextBlocks, selectedInstanceId: nextSelected });
  }

  function handleClearCanvas() {
    syncCanvas({ blocks: [], selectedInstanceId: null });
    setNotesDraft({});
    setSaveStatus("idle");
    setSaveMessage(null);
  }

  async function handleSave() {
    if (isSaving) return;
    skipAutoSaveRef.current = true;
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    const currentCanvas: CanvasState = normalizeCanvasState({
      blocks: placedBlocks.map((block) => ({
        ...block,
        notes: notesDraft[block.instanceId] ?? block.notes,
      })),
      selectedInstanceId,
    });

    try {
      setIsSaving(true);
      setSaveStatus("idle");
      setSaveMessage(null);
      syncCanvas(currentCanvas);
      await onSave(currentCanvas);
      lastPersistedCanvasRef.current = currentCanvas;
      setSaveStatus("success");
      setSaveMessage("Черновик сохранен.");
    } catch (error) {
      console.error("Failed to save canvas", error);
      setSaveStatus("error");
      setSaveMessage(error instanceof Error ? error.message : "Не удалось сохранить. Попробуйте еще раз.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReset() {
    if (isResetting) return;
    try {
      setIsResetting(true);
      skipAutoSaveRef.current = true;
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
      const resetCanvas = await onReset();
      const normalized = normalizeCanvasState(resetCanvas ?? defaultCanvas);
      setCanvas(normalized);
      lastPersistedCanvasRef.current = normalized;
      const nextNotes: Record<string, string> = {};
      normalized.blocks.forEach((block) => {
        if (block.notes) {
          nextNotes[block.instanceId] = block.notes;
        }
      });
      setNotesDraft(nextNotes);
      setSaveStatus("success");
      setSaveMessage(resetCanvas ? "Состояние восстановлено." : "Загружен стартовый шаблон.");
    } catch (error) {
      console.error("Failed to load canvas state", error);
      setSaveStatus("error");
      setSaveMessage(error instanceof Error ? error.message : "Не удалось загрузить сохранение.");
    } finally {
      setIsResetting(false);
    }
  }

  const selectedNotes = selectedInstanceId ? notesDraft[selectedInstanceId] ?? "" : "";
  const saveMessageTone =
    saveStatus === "success" ? "text-emerald-300" : saveStatus === "error" ? "text-red-400" : "text-slate-400";

  function handleNotesChange(event: ChangeEvent<HTMLTextAreaElement>) {
    if (!selectedInstanceId) return;
    const value = event.target.value;
    setNotesDraft((prev) => {
      if (!value.trim()) {
        const next = { ...prev };
        delete next[selectedInstanceId];
        return next;
      }
      return { ...prev, [selectedInstanceId]: value };
    });
    const nextBlocks = placedBlocks.map((block) =>
      block.instanceId === selectedInstanceId ? { ...block, notes: value.trim() ? value : undefined } : block,
    );
    syncCanvas({ blocks: nextBlocks, selectedInstanceId });
    setSaveStatus("idle");
    setSaveMessage(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = placedBlocks.findIndex((block) => block.instanceId === active.id);
    const newIndex = placedBlocks.findIndex((block) => block.instanceId === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(placedBlocks, oldIndex, newIndex);
    const newSelected =
      selectedInstanceId && reordered.some((block) => block.instanceId === selectedInstanceId)
        ? selectedInstanceId
        : reordered[0]?.instanceId ?? null;

    syncCanvas({ blocks: reordered, selectedInstanceId: newSelected });
  }

  function updateBlockBinding(nextBinding: CanvasDataBinding | null | undefined) {
    if (!selectedInstanceId) return;
    let changed = false;
    const nextBlocks = placedBlocks.map((block) => {
      if (block.instanceId !== selectedInstanceId) {
        return block;
      }

      if (!nextBinding) {
        if (!block.dataBinding) {
          return block;
        }
        changed = true;
        const nextBlock = { ...block };
        delete nextBlock.dataBinding;
        return nextBlock;
      }

      changed = true;
      return {
        ...block,
        dataBinding: nextBinding,
      };
    });

    if (changed) {
      syncCanvas({ blocks: nextBlocks, selectedInstanceId });
      setSaveStatus("idle");
      setSaveMessage(null);
    }
  }

  function updateBlockProps<K extends BlockId>(
    blockId: K,
    updater: (prev: BlockPropsMap[K]) => BlockPropsMap[K] | BlockPropsMap[K],
  ) {
    if (!selectedInstanceId) return;
    const nextBlocks = placedBlocks.map((block) => {
      if (block.instanceId !== selectedInstanceId || block.blockId !== blockId) {
        return block;
      }
      const prevProps = getBlockProps(block) as BlockPropsMap[K];
      const nextPropsDraft = updater(prevProps);
      const normalized = normalizeProps(blockId, nextPropsDraft);
      return { ...block, props: normalized };
    });
    syncCanvas({ blocks: nextBlocks, selectedInstanceId });
    setSaveStatus("idle");
    setSaveMessage(null);
  }

  function handleBindingSourceChange(event: ChangeEvent<HTMLSelectElement>) {
    const sourceId = event.target.value;
    if (!sourceId) {
      updateBlockBinding(undefined);
      return;
    }
    updateBlockBinding({ sourceId, sampleId: null });
  }

  function handleBindingSampleChange(event: ChangeEvent<HTMLSelectElement>) {
    if (!binding) return;
    const sampleId = event.target.value;
    updateBlockBinding({
      ...binding,
      sampleId: sampleId || null,
    });
  }

  function handleBindingClear() {
    updateBlockBinding(undefined);
  }

  function handleFieldMappingsChange(mappings: Array<{ sourcePath: string; targetProp: string }>) {
    if (!binding) return;
    updateBlockBinding({
      ...binding,
      fieldMappings: mappings.length > 0 ? mappings : null,
    });
  }

  // Загрузка данных из API для source
  async function loadApiData(sourceId: string) {
    const source = dataSources.find((s) => s.id === sourceId);
    if (!source) return;

    setApiDataCache((prev) => ({
      ...prev,
      [sourceId]: { data: null, loading: true },
    }));

    try {
      const result = await fetchApiData({
        type: source.type,
        endpoint: source.endpoint || "",
        method: source.method,
        headers: source.headers,
        config: source.config,
      });

      setApiDataCache((prev) => ({
        ...prev,
        [sourceId]: {
          data: result.success ? result.data : null,
          loading: false,
          error: result.error,
        },
      }));
    } catch (error) {
      setApiDataCache((prev) => ({
        ...prev,
        [sourceId]: {
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : "Неизвестная ошибка",
        },
      }));
    }
  }

  // Автоматическая загрузка при выборе source
  useEffect(() => {
    if (binding?.sourceId) {
      // Загружаем если еще не загружали
      if (!apiDataCache[binding.sourceId]) {
        loadApiData(binding.sourceId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [binding?.sourceId, apiDataCache]);

  async function handleTestApiRequest() {
    if (!boundSource) return;
    await loadApiData(boundSource.id);
  }

  function clearBindingsForSource(sourceId: string) {
    const current = canvasRef.current;
    let changed = false;
    const nextBlocks = current.blocks.map((block) => {
      if (block.dataBinding?.sourceId === sourceId) {
        changed = true;
        const nextBlock = { ...block };
        delete nextBlock.dataBinding;
        return nextBlock;
      }
      return block;
    });

    if (changed) {
      syncCanvas({ blocks: nextBlocks, selectedInstanceId: current.selectedInstanceId });
      setSaveStatus("idle");
      setSaveMessage(null);
    }
  }

  function clearBindingForSample(sourceId: string, sampleId: string) {
    const current = canvasRef.current;
    let changed = false;
    const nextBlocks = current.blocks.map((block) => {
      if (block.dataBinding?.sourceId === sourceId && block.dataBinding?.sampleId === sampleId) {
        changed = true;
        return {
          ...block,
          dataBinding: {
            ...block.dataBinding,
            sampleId: null,
          },
        };
      }
      return block;
    });

    if (changed) {
      syncCanvas({ blocks: nextBlocks, selectedInstanceId: current.selectedInstanceId });
      setSaveStatus("idle");
      setSaveMessage(null);
    }
  }

  async function handleCreateSource(payload: CreateSourcePayload) {
    setDataPending(true);
    try {
      const created = await onCreateDataSource(payload);
      setDataSources((prev) => [...prev, created]);
      setActiveSourceId(created.id);
      showDataMessage("Источник данных создан.");
      return created;
    } catch (error) {
      console.error("Failed to create data source", error);
      showDataError(error instanceof Error ? error.message : "Не удалось создать источник данных.");
      throw error;
    } finally {
      setDataPending(false);
    }
  }

  async function handleUpdateSource(sourceId: string, patch: UpdateSourcePayload) {
    setDataPending(true);
    try {
      const updated = await onUpdateDataSource(sourceId, patch);
      setDataSources((prev) => prev.map((source) => (source.id === sourceId ? updated : source)));
      showDataMessage("Источник обновлён.");
      return updated;
    } catch (error) {
      console.error("Failed to update data source", error);
      showDataError(error instanceof Error ? error.message : "Не удалось обновить источник.");
      throw error;
    } finally {
      setDataPending(false);
    }
  }

  async function handleDeleteSource(sourceId: string) {
    setDataPending(true);
    try {
      await onDeleteDataSource(sourceId);
      setDataSources((prev) => prev.filter((source) => source.id !== sourceId));
      if (activeSourceId === sourceId) {
        const remaining = dataSources.filter((source) => source.id !== sourceId);
        setActiveSourceId(remaining[0]?.id ?? null);
      }
      clearBindingsForSource(sourceId);
      showDataMessage("Источник удалён.");
    } catch (error) {
      console.error("Failed to delete data source", error);
      showDataError(error instanceof Error ? error.message : "Не удалось удалить источник.");
      throw error;
    } finally {
      setDataPending(false);
    }
  }

  async function handleUpsertSampleForSource(payload: SampleUpsertPayload) {
    setDataPending(true);
    try {
      const result = await onUpsertSample(payload);
      setDataSources((prev) =>
        prev.map((source) => {
          if (source.id !== payload.sourceId) {
            return source;
          }
          const existingIndex = source.samples.findIndex((sample) => sample.id === result.id);
          if (existingIndex !== -1) {
            const nextSamples = [...source.samples];
            nextSamples[existingIndex] = result;
            return { ...source, samples: nextSamples };
          }
          return { ...source, samples: [...source.samples, result] };
        }),
      );
      showDataMessage(payload.sampleId ? "Пример обновлён." : "Пример добавлен.");
      return result;
    } catch (error) {
      console.error("Failed to upsert sample", error);
      showDataError(error instanceof Error ? error.message : "Не удалось сохранить пример.");
      throw error;
    } finally {
      setDataPending(false);
    }
  }

  async function handleDeleteSampleFromSource(sourceId: string, sampleId: string) {
    setDataPending(true);
    try {
      await onDeleteSample(sampleId);
      setDataSources((prev) =>
        prev.map((source) =>
          source.id === sourceId
            ? { ...source, samples: source.samples.filter((sample) => sample.id !== sampleId) }
            : source,
        ),
      );
      clearBindingForSample(sourceId, sampleId);
      showDataMessage("Пример удалён.");
    } catch (error) {
      console.error("Failed to delete sample", error);
      showDataError(error instanceof Error ? error.message : "Не удалось удалить пример.");
      throw error;
    } finally {
      setDataPending(false);
    }
  }

  const [blocksSheetOpen, setBlocksSheetOpen] = useState(false);
  const [inspectorSheetOpen, setInspectorSheetOpen] = useState(false);
  const [dataSheetOpen, setDataSheetOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/share/${projectSlug}` : "";

  async function handleCopyShareLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareLinkCopied(true);
      setTimeout(() => setShareLinkCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy share link", error);
    }
  }

  return (
    <>
      <div className="w-full">
        <Card className="border-slate-700/60 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-800/60 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sheet open={blocksSheetOpen} onOpenChange={setBlocksSheetOpen}>
                  <SheetTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="border border-slate-800/60 text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-white"
                    >
                      <Layers className="mr-1.5 h-4 w-4" />
                      Блоки
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[400px] overflow-y-auto sm:max-w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Библиотека блоков</SheetTitle>
                      <SheetDescription>
                        Добавляйте компоненты на холст
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-2">
                      {blockPalette.map((block) => (
                        <div
                          key={block.id}
                          className="group rounded-lg border border-slate-800/60 bg-slate-800/40 p-3 transition-all hover:border-emerald-500/40 hover:bg-slate-800/70"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="text-sm font-semibold text-white">{block.title}</h3>
                              <p className="mt-0.5 text-xs leading-snug text-slate-400">{block.description}</p>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => {
                                handleAddBlock(block.id);
                                setBlocksSheetOpen(false);
                              }}
                              className="shrink-0 bg-emerald-500 text-white hover:bg-emerald-400"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {block.tags.map((tag) => (
                              <span key={tag} className="rounded-md bg-slate-800/50 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-slate-500">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>

                <Sheet open={dataSheetOpen} onOpenChange={setDataSheetOpen}>
                  <SheetTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="border border-slate-800/60 text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-white"
                    >
                      <Database className="mr-1.5 h-4 w-4" />
                      Данные
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[400px] overflow-y-auto sm:max-w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Источники данных</SheetTitle>
                      <SheetDescription>
                        REST, GraphQL или Mock данные
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <DataSourcesPanel
                        sources={dataSources}
                        activeSourceId={activeSourceId}
                        onSelectSource={setActiveSourceId}
                        onCreateSource={handleCreateSource}
                        onUpdateSource={handleUpdateSource}
                        onDeleteSource={handleDeleteSource}
                        onUpsertSample={handleUpsertSampleForSource}
                        onDeleteSample={handleDeleteSampleFromSource}
                        pending={dataPending}
                        message={dataMessage}
                        error={dataError}
                        boundSourceId={binding?.sourceId ?? null}
                        boundSampleId={binding?.sampleId ?? null}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="h-6 w-px bg-slate-800/60" />

                <div className="flex items-center gap-2">
                  <LayoutTemplate className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-medium text-white">Канва</span>
                  <span className="text-xs text-slate-500">
                    {placedBlocks.length > 0
                      ? `${placedBlocks.length} ${placedBlocks.length === 1 ? 'блок' : 'блоков'}`
                      : "пусто"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedBlock && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:border-emerald-500/60 hover:bg-emerald-500/20 hover:text-emerald-300"
                    onClick={() => setInspectorSheetOpen(true)}
                  >
                    <Settings className="mr-1.5 h-4 w-4" />
                    Настроить блок
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="border border-slate-800/60 text-slate-300 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                  onClick={handleClearCanvas}
                  disabled={placedBlocks.length === 0}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Очистить
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="border border-slate-800/60 text-slate-300 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
                  onClick={handleReset}
                  disabled={isResetting}
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  {isResetting ? "Сброс..." : "Сброс"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="border border-slate-800/60 text-slate-300 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
                  onClick={() => setShareDialogOpen(true)}
                >
                  <Share2 className="mr-1.5 h-3.5 w-3.5" />
                  Поделиться
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
                  onClick={handleSave}
                  disabled={isSaving || isAutoSaving}
                >
                  <Wand2 className="mr-1.5 h-3.5 w-3.5" />
                  {isSaving ? "Сохранение..." : isAutoSaving ? "Авто..." : "Сохранить"}
                </Button>
              </div>
            </div>
            {saveMessage && (
              <div className={cn("mt-3 rounded-lg border px-3 py-2 text-xs", saveMessageTone)}>
                {saveMessage}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {placedBlocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800/70 bg-slate-800/30 px-6 py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
                  <Sparkles className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Канва пуста</h3>
                <p className="mb-6 max-w-md text-sm text-slate-400">
                  Начните создавать интерфейс проекта «{projectName}», добавив первый блок из библиотеки
                </p>
                <Button
                  type="button"
                  className="bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
                  onClick={() => setBlocksSheetOpen(true)}
                >
                  <Layers className="mr-2 h-4 w-4" />
                  Открыть библиотеку блоков
                </Button>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={placedBlocks.map((block) => block.instanceId)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-6">
                    {placedBlocks.map((placedBlock) => {
                      const definition = getBlockDefinition(placedBlock.blockId);
                      if (!definition) {
                        return null;
                      }
                      let blockProps = getBlockProps(placedBlock);

                      // Применяем РЕАЛЬНЫЕ данные из API если есть binding
                      if (placedBlock.dataBinding?.sourceId) {
                        const apiData = apiDataCache[placedBlock.dataBinding.sourceId];

                        if (apiData && apiData.data && !apiData.loading && !apiData.error) {
                          const blockId = placedBlock.blockId as BlockId;
                          const customMappings = placedBlock.dataBinding.fieldMappings || undefined;

                          blockProps = applyDataToBlockProps(
                            blockId,
                            blockProps,
                            apiData.data,
                            customMappings,
                          );
                        }
                      }

                      return (
                        <CanvasBlockItem
                          key={placedBlock.instanceId}
                          block={placedBlock}
                          definition={definition}
                          props={blockProps}
                          selected={selectedInstanceId === placedBlock.instanceId}
                          onSelect={() => handleSelectBlock(placedBlock.instanceId)}
                          onRemove={() => handleRemoveBlock(placedBlock.instanceId)}
                        />
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>
      </div>

      <Sheet open={inspectorSheetOpen} onOpenChange={setInspectorSheetOpen}>
        <SheetContent side="right" className="w-[450px] overflow-y-auto sm:max-w-[450px]">
          <SheetHeader>
            <SheetTitle>
              {selectedBlock && selectedDefinition ? selectedDefinition.title : "Инспектор блока"}
            </SheetTitle>
            <SheetDescription>
              {selectedBlock ? "Настройте параметры и подключите данные" : "Выберите блок на холсте"}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4 text-sm text-slate-300">
            {selectedBlock && selectedDefinition && selectedProps ? (
              <>
                <div className="rounded-lg border border-slate-800/60 bg-slate-800/40 p-3">
                  <div className="flex flex-wrap gap-1">
                    {selectedDefinition.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-slate-800/50 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-slate-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{selectedDefinition.description}</p>
                </div>
                <Separator className="border-slate-800/60" />
                <div className="space-y-2">
                  <Label htmlFor="block-notes" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Заметки
                  </Label>
                  <textarea
                    id="block-notes"
                    placeholder="Опишите, какие данные подтянуть или что изменить в следующей итерации."
                    className="min-h-[120px] w-full rounded-lg border border-slate-800 bg-slate-800/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
                    value={selectedNotes}
                    onChange={handleNotesChange}
                  />
                </div>
                <Separator className="border-slate-800/60" />
                <div className="space-y-2">
                  <Label htmlFor="block-data-source" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Источник данных
                  </Label>
                  <select
                    id="block-data-source"
                    value={binding?.sourceId ?? ""}
                    onChange={handleBindingSourceChange}
                    className="h-10 w-full rounded-lg border border-slate-800 bg-slate-800/60 px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 disabled:opacity-60"
                    disabled={dataSources.length === 0}
                  >
                    <option value="">Не подключен</option>
                    {dataSources.map((source) => (
                      <option key={source.id} value={source.id}>
                        {source.name}
                      </option>
                    ))}
                  </select>
                  {dataSources.length === 0 && (
                    <p className="text-xs text-slate-500">Источников пока нет. Добавьте их в панели «Источники данных».</p>
                  )}
                </div>
                {binding?.sourceId ? (
                  <div className="space-y-2">
                    <Label htmlFor="block-data-sample" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Схема данных (для выбора полей)
                    </Label>
                    <select
                      id="block-data-sample"
                      value={binding.sampleId ?? ""}
                      onChange={handleBindingSampleChange}
                      className="h-10 w-full rounded-lg border border-slate-800 bg-slate-800/60 px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 disabled:opacity-60"
                      disabled={!boundSource || boundSource.samples.length === 0}
                    >
                      <option value="">Выберите схему</option>
                      {boundSource?.samples.map((sample) => (
                        <option key={sample.id} value={sample.id}>
                          {sample.label}
                        </option>
                      ))}
                    </select>
                    {boundSource && boundSource.samples.length === 0 && (
                      <p className="text-xs text-slate-500">Добавьте схему (пример структуры) для выбора полей.</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="flex-1 border border-emerald-500/40 text-emerald-400 hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:text-emerald-300"
                        onClick={handleTestApiRequest}
                        disabled={!boundSource || (boundSource?.id ? apiDataCache[boundSource.id]?.loading : false)}
                      >
                        {boundSource?.id && apiDataCache[boundSource.id]?.loading ? "Загрузка..." : "Обновить данные"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="border border-slate-800/60 text-slate-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                        onClick={handleBindingClear}
                      >
                        Отключить
                      </Button>
                    </div>
                    {boundSource && apiDataCache[boundSource.id] && (
                      <div
                        className={cn(
                          "rounded-lg border p-3 text-xs",
                          apiDataCache[boundSource.id].error
                            ? "border-red-500/40 bg-red-500/10 text-red-200"
                            : apiDataCache[boundSource.id].data
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                            : "border-slate-700/60 bg-slate-800/40 text-slate-400"
                        )}
                      >
                        <p className="mb-1 font-semibold">
                          {apiDataCache[boundSource.id].error
                            ? "✗ Ошибка запроса"
                            : apiDataCache[boundSource.id].data
                            ? "✓ Данные загружены из API"
                            : "⏳ Загрузка..."}
                        </p>
                        {apiDataCache[boundSource.id].error && (
                          <p className="text-[11px]">{String(apiDataCache[boundSource.id].error)}</p>
                        )}
                        {Boolean(apiDataCache[boundSource.id].data) && (
                          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-[10px]">
                            {JSON.stringify(apiDataCache[boundSource.id].data, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                    {boundSample && (
                      <>
                        <div className="rounded-lg border border-slate-800/60 bg-slate-800/40 p-3 text-xs text-slate-400">
                          <p className="mb-1 font-semibold text-slate-200">{boundSample.label}</p>
                          <pre className="max-h-40 overflow-auto whitespace-pre-wrap text-[11px] text-slate-400">
                            {formatJsonPreview(boundSample.payload, 320)}
                          </pre>
                        </div>
                        <FieldMappingEditor
                          blockId={selectedBlock.blockId as BlockId}
                          currentMappings={binding.fieldMappings ?? null}
                          sampleData={boundSample.payload}
                          onChange={handleFieldMappingsChange}
                        />
                      </>
                    )}
                  </div>
                ) : null}
                <Separator className="border-slate-800/60" />
                <BlockPropsEditor
                  blockId={selectedDefinition.id}
                  props={selectedProps}
                  onChange={(updater) => updateBlockProps(selectedDefinition.id, updater)}
                />
              </>
            ) : (
              <div className="space-y-3">
                <div className="rounded-xl border border-dashed border-slate-800/60 bg-slate-800/30 p-8 text-center">
                  <Sparkles className="mx-auto mb-3 h-10 w-10 text-slate-600" />
                  <p className="text-sm text-slate-400">
                    Выберите блок на холсте для редактирования
                  </p>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Share Dialog */}
      <Sheet open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto border-l border-slate-800/60 bg-slate-900/95 p-0 text-slate-100 backdrop-blur-md sm:max-w-md">
          <div className="space-y-6 p-6">
            <SheetHeader>
              <SheetTitle className="text-white">Поделиться проектом</SheetTitle>
              <SheetDescription className="text-slate-400">
                Скопируйте ссылку для публичного просмотра проекта
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Публичная ссылка
                </Label>
                <div className="rounded-lg border border-slate-700/60 bg-slate-800/40 p-3">
                  <code className="block break-all text-xs text-emerald-200">
                    {shareUrl}
                  </code>
                </div>
                <Button
                  type="button"
                  className="w-full bg-emerald-500 text-white hover:bg-emerald-400"
                  onClick={handleCopyShareLink}
                >
                  {shareLinkCopied ? "✓ Скопировано" : "Скопировать ссылку"}
                </Button>
              </div>

              <Separator className="border-slate-800/60" />

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Что включено
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Просмотр всех блоков с реальными данными из API</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Read-only режим (без редактирования)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Возможность скопировать React код</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Доступно без авторизации</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-blue-200">
                <p className="font-semibold">💡 Совет</p>
                <p className="mt-1 text-blue-300/80">
                  Все кто имеет эту ссылку смогут просмотреть проект. Используйте для демо клиентам или команде.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                className="w-full border border-slate-800/60 text-slate-400 hover:text-white"
                asChild
              >
                <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                  Открыть публичную страницу
                </a>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

type DataSourcesPanelProps = {
  sources: DataSourceRecord[];
  activeSourceId: string | null;
  onSelectSource: (sourceId: string | null) => void;
  onCreateSource: (payload: CreateSourcePayload) => Promise<DataSourceRecord>;
  onUpdateSource: (sourceId: string, patch: UpdateSourcePayload) => Promise<DataSourceRecord>;
  onDeleteSource: (sourceId: string) => Promise<void>;
  onUpsertSample: (payload: SampleUpsertPayload) => Promise<DataSampleRecord>;
  onDeleteSample: (sourceId: string, sampleId: string) => Promise<void>;
  pending: boolean;
  message: string | null;
  error: string | null;
  boundSourceId: string | null;
  boundSampleId: string | null;
};

function DataSourcesPanel({
  sources,
  activeSourceId,
  onSelectSource,
  onCreateSource,
  onUpdateSource,
  onDeleteSource,
  onUpsertSample,
  onDeleteSample,
  pending,
  message,
  error,
  boundSourceId,
  boundSampleId,
}: DataSourcesPanelProps) {
  const activeSource = sources.find((source) => source.id === activeSourceId) ?? sources[0] ?? null;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    name: "",
    type: DataSourceType.REST as DataSourceType,
    endpoint: "",
    method: "GET",
    description: "",
    graphqlQuery: "",
    mockPayload: "{\n  \"key\": \"value\"\n}",
  });

  const [sampleEditor, setSampleEditor] = useState<{
    sourceId: string;
    sampleId?: string;
    label: string;
    payload: string;
    error?: string | null;
  } | null>(null);

  useEffect(() => {
    if (!activeSource && sources.length > 0) {
      onSelectSource(sources[0].id);
    }
  }, [activeSource, sources, onSelectSource]);

  useEffect(() => {
    if (activeSource) {
      setSampleEditor((prev) =>
        prev && prev.sourceId === activeSource.id
          ? prev
          : {
              sourceId: activeSource.id,
              label: "",
              payload: "{\n  \n}",
              error: null,
            },
      );
    } else {
      setSampleEditor(null);
    }
  }, [activeSource]);

  function resetCreateForm() {
    setCreateForm({
      name: "",
      type: DataSourceType.REST,
      endpoint: "",
      method: "GET",
      description: "",
      graphqlQuery: "",
      mockPayload: "{\n  \"key\": \"value\"\n}",
    });
    setCreateError(null);
  }

  async function handleCreateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const name = createForm.name.trim();
    if (!name) {
      setCreateError("Укажите название источника.");
      return;
    }

    const payload: CreateSourcePayload = {
      name,
      type: createForm.type,
      description: createForm.description.trim() ? createForm.description.trim() : null,
    };

    if (createForm.type === DataSourceType.REST) {
      if (!createForm.endpoint.trim()) {
        setCreateError("Укажите endpoint для REST источника.");
        return;
      }
      payload.endpoint = createForm.endpoint.trim();
      payload.method = createForm.method.trim().toUpperCase() || "GET";
    }

    if (createForm.type === DataSourceType.GRAPHQL) {
      if (!createForm.endpoint.trim()) {
        setCreateError("Укажите endpoint GraphQL.");
        return;
      }
      if (!createForm.graphqlQuery.trim()) {
        setCreateError("Укажите GraphQL query.");
        return;
      }
      payload.endpoint = createForm.endpoint.trim();
      payload.method = "POST";
      payload.config = {
        query: createForm.graphqlQuery,
      };
    }

    if (createForm.type === DataSourceType.MOCK) {
      try {
        const parsed = JSON.parse(createForm.mockPayload);
        payload.config = { mock: parsed };
      } catch {
        setCreateError("Некорректный JSON для моковых данных.");
        return;
      }
    }

    try {
      const created = await onCreateSource(payload);
      resetCreateForm();
      setIsCreateOpen(false);
      onSelectSource(created.id);
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : "Не удалось создать источник.");
    }
  }

  async function handleRenameSource(source: DataSourceRecord) {
    const nextName = prompt("Новое название источника", source.name);
    if (!nextName || nextName.trim() === source.name) {
      return;
    }
    try {
      await onUpdateSource(source.id, { name: nextName.trim() });
    } catch {
      // сообщение уже отображено выше
    }
  }

  async function handleDeleteSourceClick(source: DataSourceRecord) {
    if (!confirm(`Удалить источник «${source.name}» вместе с примерами?`)) {
      return;
    }
    try {
      await onDeleteSource(source.id);
    } catch {
      // сообщение уже отображено выше
    }
  }

  function openSampleEditor(sourceId: string, sample?: DataSampleRecord) {
    if (pending) return;
    if (sample) {
      setSampleEditor({
        sourceId,
        sampleId: sample.id,
        label: sample.label,
        payload: JSON.stringify(sample.payload, null, 2),
        error: null,
      });
    } else {
      setSampleEditor({
        sourceId,
        label: "",
        payload: "{\n  \n}",
        error: null,
      });
    }
  }

  async function handleSampleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!sampleEditor || pending) return;

    const { sourceId, sampleId, label, payload } = sampleEditor;
    if (!label.trim()) {
      setSampleEditor({ ...sampleEditor, error: "Укажите название примера." });
      return;
    }

    let parsed: unknown;
    try {
      parsed = payload.trim() ? JSON.parse(payload) : {};
    } catch {
      setSampleEditor({ ...sampleEditor, error: "Некорректный JSON." });
      return;
    }

    try {
      await onUpsertSample({
        sourceId,
        sampleId,
        label: label.trim(),
        payload: parsed,
      });
      setSampleEditor({
        sourceId,
        label: "",
        payload: "{\n  \n}",
        error: null,
      });
    } catch (err) {
      setSampleEditor({
        ...sampleEditor,
        error: err instanceof Error ? err.message : "Не удалось сохранить пример.",
      });
    }
  }

  async function handleSampleDelete(sourceId: string, sample: DataSampleRecord) {
    if (!confirm(`Удалить пример «${sample.label}»?`)) {
      return;
    }
    try {
      await onDeleteSample(sourceId, sample.id);
    } catch {
      // уже показано
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Источники данных</h3>
        <Button
          type="button"
          size="sm"
          className="h-8 bg-emerald-500 px-3 text-white hover:bg-emerald-400"
          onClick={() => {
            if (pending) return;
            setIsCreateOpen((prev) => !prev);
            setCreateError(null);
          }}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Добавить
        </Button>
      </div>
      <div className="space-y-3 text-sm text-slate-300">

        {isCreateOpen && (
          <form className="space-y-3 rounded-lg border border-slate-800/60 bg-slate-800/40 p-4" onSubmit={handleCreateSubmit}>
            <div className="space-y-1">
              <Label htmlFor="create-source-name" className="text-xs uppercase tracking-wide text-slate-500">
                Название
              </Label>
              <Input
                id="create-source-name"
                value={createForm.name}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Например, Users API"
                className="border-slate-800 bg-slate-800/60 text-white"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="create-source-type" className="text-xs uppercase tracking-wide text-slate-500">
                Тип
              </Label>
              <select
                id="create-source-type"
                value={createForm.type}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    type: event.target.value as DataSourceType,
                  }))
                }
                className="h-10 w-full rounded-lg border border-slate-800 bg-slate-800/60 px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              >
                <option value={DataSourceType.REST}>REST</option>
                <option value={DataSourceType.GRAPHQL}>GraphQL</option>
                <option value={DataSourceType.MOCK}>Mock</option>
              </select>
            </div>
            {createForm.type !== DataSourceType.MOCK && (
              <div className="space-y-1">
                <Label htmlFor="create-source-endpoint" className="text-xs uppercase tracking-wide text-slate-500">
                  Endpoint
                </Label>
                <Input
                  id="create-source-endpoint"
                  value={createForm.endpoint}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, endpoint: event.target.value }))}
                  placeholder="https://api.example.com/users"
                  className="border-slate-800 bg-slate-800/60 text-white"
                />
              </div>
            )}
            {createForm.type === DataSourceType.REST && (
              <div className="space-y-1">
                <Label htmlFor="create-source-method" className="text-xs uppercase tracking-wide text-slate-500">
                  Метод
                </Label>
                <Input
                  id="create-source-method"
                  value={createForm.method}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, method: event.target.value }))}
                  placeholder="GET"
                  className="border-slate-800 bg-slate-800/60 text-white"
                />
              </div>
            )}
            {createForm.type === DataSourceType.GRAPHQL && (
              <div className="space-y-1">
                <Label htmlFor="create-source-query" className="text-xs uppercase tracking-wide text-slate-500">
                  GraphQL Query
                </Label>
                <textarea
                  id="create-source-query"
                  value={createForm.graphqlQuery}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, graphqlQuery: event.target.value }))}
                  placeholder={`query Users {\n  users {\n    id\n    name\n  }\n}`}
                  className="min-h-[120px] w-full rounded-lg border border-slate-800 bg-slate-800/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
                />
              </div>
            )}
            {createForm.type === DataSourceType.MOCK && (
              <div className="space-y-1">
                <Label htmlFor="create-source-mock" className="text-xs uppercase tracking-wide text-slate-500">
                  Моковые данные (JSON)
                </Label>
                <textarea
                  id="create-source-mock"
                  value={createForm.mockPayload}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, mockPayload: event.target.value }))}
                  className="min-h-[140px] w-full rounded-lg border border-slate-800 bg-slate-800/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
                />
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="create-source-description" className="text-xs uppercase tracking-wide text-slate-500">
                Описание
              </Label>
              <Input
                id="create-source-description"
                value={createForm.description}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Для списков пользователей в админке"
                className="border-slate-800 bg-slate-800/60 text-white"
              />
            </div>
            {createError && <p className="text-xs text-red-400">{createError}</p>}
            <div className="flex items-center gap-2">
              <Button type="submit" className="bg-emerald-500 text-slate-950 hover:bg-emerald-400" disabled={pending}>
                Создать
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="text-slate-300 hover:text-white"
                onClick={() => {
                  if (pending) return;
                  setIsCreateOpen(false);
                  resetCreateForm();
                }}
              >
                Отмена
              </Button>
            </div>
          </form>
        )}

        {message && <p className="text-xs text-emerald-300">{message}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="space-y-2">
          {sources.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-800/60 bg-slate-800/30 p-4 text-center">
              <p className="text-xs text-slate-500">Нажмите + чтобы добавить источник</p>
            </div>
          ) : (
            sources.map((source) => {
              const isActive = source.id === activeSourceId;
              const isBound = source.id === boundSourceId;
              return (
                <div
                  key={source.id}
                  className={cn(
                    "rounded-lg border border-slate-800/60 bg-slate-800/40 p-3 transition-all",
                    isActive && "border-emerald-500/50 bg-slate-800/70",
                    isBound && "shadow-md shadow-emerald-500/20",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelectSource(source.id)}
                    className="flex w-full items-start justify-between gap-2 text-left transition hover:text-white"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{source.name}</p>
                      <p className="text-xs text-slate-500">
                        {source.type === DataSourceType.REST && "REST endpoint"}
                        {source.type === DataSourceType.GRAPHQL && "GraphQL API"}
                        {source.type === DataSourceType.MOCK && "Mock data"}
                      </p>
                    </div>
                    <Badge className="border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-200">
                      {source.samples.length} примеров
                    </Badge>
                  </button>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="border border-slate-800/60 px-2 text-xs text-slate-400 hover:border-emerald-500/40 hover:text-emerald-200"
                      onClick={() => handleRenameSource(source)}
                      disabled={pending}
                    >
                      <Edit3 className="mr-1 h-3.5 w-3.5" />
                      Переименовать
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="border border-slate-800/60 px-2 text-xs text-slate-400 hover:border-red-500/40 hover:text-red-300"
                      onClick={() => handleDeleteSourceClick(source)}
                      disabled={pending}
                    >
                      <Trash className="mr-1 h-3.5 w-3.5" />
                      Удалить
                    </Button>
                  </div>
                  {source.description && <p className="mt-2 text-xs text-slate-500">{source.description}</p>}
                  <div className="mt-3 space-y-2">
                    {source.samples.length === 0 ? (
                      <p className="text-xs text-slate-500">Примеров данных пока нет.</p>
                    ) : (
                      source.samples.map((sample) => {
                        const isSampleActive = sampleEditor?.sampleId === sample.id;
                        const isSampleBound = source.id === boundSourceId && sample.id === boundSampleId;
                        return (
                          <div
                            key={sample.id}
                            className={cn(
                              "rounded-lg border border-slate-800/60 bg-slate-800/50 p-3 text-xs text-slate-400 transition",
                              isSampleBound && "border-emerald-500/50 bg-slate-800/80",
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-medium text-slate-200">{sample.label}</p>
                                <pre className="mt-1 max-h-24 overflow-auto whitespace-pre-wrap text-[11px] text-slate-500">
                                  {formatJsonPreview(sample.payload, 180)}
                                </pre>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-slate-400 hover:text-emerald-300"
                                  onClick={() => openSampleEditor(source.id, sample)}
                                  disabled={pending}
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-slate-400 hover:text-red-400"
                                  onClick={() => handleSampleDelete(source.id, sample)}
                                  disabled={pending}
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                            {isSampleActive && <p className="mt-2 text-[11px] text-emerald-300">Редактируется</p>}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {activeSource && sampleEditor && sampleEditor.sourceId === activeSource.id && (
          <form
            className="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4"
            onSubmit={handleSampleSubmit}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {sampleEditor.sampleId ? "Редактирование примера" : "Новый пример"}
              </p>
              {pending && <RefreshCw className="h-4 w-4 animate-spin text-slate-500" />}
            </div>
            <div className="space-y-1">
              <Label htmlFor="sample-label" className="text-xs uppercase tracking-wide text-slate-500">
                Название
              </Label>
              <Input
                id="sample-label"
                value={sampleEditor.label}
                onChange={(event) =>
                  setSampleEditor((prev) => prev && { ...prev, label: event.target.value, error: null })
                }
                placeholder="Например, Успешный ответ"
                className="border-slate-800 bg-slate-800/60 text-white"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sample-payload" className="text-xs uppercase tracking-wide text-slate-500">
                JSON
              </Label>
              <textarea
                id="sample-payload"
                value={sampleEditor.payload}
                onChange={(event) =>
                  setSampleEditor((prev) => prev && { ...prev, payload: event.target.value, error: null })
                }
                className="min-h-[160px] w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              />
            </div>
            {sampleEditor.error && <p className="text-xs text-red-400">{sampleEditor.error}</p>}
            <div className="flex items-center gap-2">
              <Button type="submit" className="bg-emerald-500 text-slate-950 hover:bg-emerald-400" disabled={pending}>
                {sampleEditor.sampleId ? "Обновить" : "Добавить"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="text-slate-300 hover:text-white"
                onClick={() =>
                  setSampleEditor({
                    sourceId: activeSource.id,
                    label: "",
                    payload: "{\n  \n}",
                    error: null,
                  })
                }
              >
                Сбросить
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

type CanvasBlockItemProps = {
  block: CanvasState["blocks"][number];
  definition: BlockDefinition;
  props: BlockPropsMap[BlockId];
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
};

function CanvasBlockItem({ block, definition, props, selected, onSelect, onRemove }: CanvasBlockItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.instanceId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative transition-all",
        selected
          ? "ring-2 ring-emerald-500/60 ring-offset-2 ring-offset-slate-900 rounded-lg"
          : "",
        isDragging && "opacity-50",
      )}
      onClick={onSelect}
    >
      {/* Контролы - показываются при наведении или выборе */}
      <div
        className={cn(
          "absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-800/95 px-3 py-1.5 shadow-lg backdrop-blur-sm transition-opacity",
          selected || isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
      >
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs font-medium text-slate-300 transition hover:text-white cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-3.5 w-3.5" />
          {definition.title}
        </button>
        <div className="h-3 w-px bg-slate-700" />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Удалить блок"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Блок в финальном виде без дополнительных оберток */}
      {definition.render(props)}
    </div>
  );
}

type BlockPropsEditorProps<K extends BlockId> = {
  blockId: K;
  props: BlockPropsMap[K];
  onChange: (updater: (prev: BlockPropsMap[K]) => BlockPropsMap[K]) => void;
};

function BlockPropsEditor<K extends BlockId>({ blockId, props, onChange }: BlockPropsEditorProps<K>) {
  switch (blockId) {
    case "hero":
      return <HeroPropsEditor props={props as HeroProps} onChange={onChange as unknown as (updater: (prev: HeroProps) => HeroProps) => void} />;
    case "stats":
      return (
        <StatsPropsEditor
          props={props as StatsProps}
          onChange={onChange as unknown as (updater: (prev: StatsProps) => StatsProps) => void}
        />
      );
    case "workflow":
      return (
        <WorkflowPropsEditor
          props={props as WorkflowProps}
          onChange={onChange as unknown as (updater: (prev: WorkflowProps) => WorkflowProps) => void}
        />
      );
    case "cta":
      return <CtaPropsEditor props={props as CtaProps} onChange={onChange as unknown as (updater: (prev: CtaProps) => CtaProps) => void} />;
    case "form":
      return <FormPropsEditor props={props as FormProps} onChange={onChange as unknown as (updater: (prev: FormProps) => FormProps) => void} />;
    default:
      return null;
  }
}

function HeroPropsEditor({
  props,
  onChange,
}: {
  props: HeroProps;
  onChange: (updater: (prev: HeroProps) => HeroProps) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs uppercase tracking-wide text-slate-500">Бейдж</Label>
        <Input
          value={props.badge}
          onChange={(event) => onChange((prev) => ({ ...prev, badge: event.target.value }))}
          className="border-slate-800 bg-slate-950 text-white"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs uppercase tracking-wide text-slate-500">Заголовок</Label>
        <Input
          value={props.title}
          onChange={(event) => onChange((prev) => ({ ...prev, title: event.target.value }))}
          className="border-slate-800 bg-slate-950 text-white"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs uppercase tracking-wide text-slate-500">Описание</Label>
        <textarea
          value={props.description}
          onChange={(event) => onChange((prev) => ({ ...prev, description: event.target.value }))}
          className="min-h-[96px] w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs uppercase tracking-wide text-slate-500">Кнопка</Label>
        <Input
          value={props.primaryLabel}
          onChange={(event) => onChange((prev) => ({ ...prev, primaryLabel: event.target.value }))}
          className="border-slate-800 bg-slate-950 text-white"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs uppercase tracking-wide text-slate-500">Доп. действие</Label>
        <Input
          value={props.secondaryLabel}
          onChange={(event) => onChange((prev) => ({ ...prev, secondaryLabel: event.target.value }))}
          className="border-slate-800 bg-slate-950 text-white"
        />
      </div>
    </div>
  );
}

function StatsPropsEditor({
  props,
  onChange,
}: {
  props: StatsProps;
  onChange: (updater: (prev: StatsProps) => StatsProps) => void;
}) {
  function updateMetric(index: number, patch: Partial<StatsMetric>) {
    onChange((prev) => {
      const metrics = prev.metrics.map((metric, metricIndex) =>
        metricIndex === index ? { ...metric, ...patch } : metric,
      );
      return { ...prev, metrics };
    });
  }

  function addMetric() {
    onChange((prev) => ({
      ...prev,
      metrics: [
        ...prev.metrics,
        { label: "Новая метрика", value: "0", detail: "Опишите значение" },
      ],
    }));
  }

  function removeMetric(index: number) {
    onChange((prev) => {
      if (prev.metrics.length <= 1) {
        return prev;
      }
      const metrics = prev.metrics.filter((_, metricIndex) => metricIndex !== index);
      return { ...prev, metrics };
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-wide text-slate-500">Метрики</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="border border-slate-800/60 px-2 text-xs text-slate-400 hover:border-emerald-500/40 hover:text-emerald-200"
          onClick={addMetric}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Добавить
        </Button>
      </div>
      {props.metrics.map((metric, index) => (
        <div key={`${metric.label}-${index}`} className="space-y-2 rounded-xl border border-slate-800/60 bg-slate-950/60 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-slate-500">#{index + 1}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-red-400"
              onClick={() => removeMetric(index)}
              disabled={props.metrics.length <= 1}
            >
              <Trash className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-500">Заголовок</Label>
            <Input
              value={metric.label}
              onChange={(event) => updateMetric(index, { label: event.target.value })}
              className="border-slate-800 bg-slate-950 text-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-500">Значение</Label>
            <Input
              value={metric.value}
              onChange={(event) => updateMetric(index, { value: event.target.value })}
              className="border-slate-800 bg-slate-950 text-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-500">Описание</Label>
            <textarea
              value={metric.detail}
              onChange={(event) => updateMetric(index, { detail: event.target.value })}
              className="min-h-[72px] w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkflowPropsEditor({
  props,
  onChange,
}: {
  props: WorkflowProps;
  onChange: (updater: (prev: WorkflowProps) => WorkflowProps) => void;
}) {
  function updateStage(index: number, patch: Partial<WorkflowStage>) {
    onChange((prev) => {
      const stages = prev.stages.map((stage, stageIndex) =>
        stageIndex === index ? { ...stage, ...patch } : stage,
      );
      return { ...prev, stages };
    });
  }

  function updateTags(index: number, value: string) {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    updateStage(index, { tags });
  }

  function addStage() {
    const newId = `stage-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 8)}`;
    onChange((prev) => ({
      ...prev,
      stages: [
        ...prev.stages,
        {
          id: newId,
          label: "Новый этап",
          title: "Опишите этап",
          description: "Добавьте детали, чтобы команда понимала контекст.",
          tags: ["Tag"],
        },
      ],
    }));
  }

  function removeStage(index: number) {
    onChange((prev) => {
      if (prev.stages.length <= 1) {
        return prev;
      }
      const stages = prev.stages.filter((_, stageIndex) => stageIndex !== index);
      return { ...prev, stages };
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-wide text-slate-500">Этапы</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="border border-slate-800/60 px-2 text-xs text-slate-400 hover-border-emerald-500/40 hover:text-emerald-200"
          onClick={addStage}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Добавить
        </Button>
      </div>
      {props.stages.map((stage, index) => (
        <div key={stage.id} className="space-y-2 rounded-xl border border-slate-800/60 bg-slate-950/60 p-3">
          <div className="flex items-center justify-between gap-2">
            <Input
              value={stage.label}
              onChange={(event) => updateStage(index, { label: event.target.value })}
              className="border-slate-800 bg-slate-950 text-white"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-red-400"
              onClick={() => removeStage(index)}
              disabled={props.stages.length <= 1}
            >
              <Trash className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Input
            value={stage.title}
            onChange={(event) => updateStage(index, { title: event.target.value })}
            className="border-slate-800 bg-slate-950 text-white"
          />
          <textarea
            value={stage.description}
            onChange={(event) => updateStage(index, { description: event.target.value })}
            className="min-h-[96px] w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
          />
          <Input
            value={stage.tags.join(", ")}
            onChange={(event) => updateTags(index, event.target.value)}
            placeholder="Теги через запятую"
            className="border-slate-800 bg-slate-950 text-white"
          />
        </div>
      ))}
    </div>
  );
}

function CtaPropsEditor({
  props,
  onChange,
}: {
  props: CtaProps;
  onChange: (updater: (prev: CtaProps) => CtaProps) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs uppercase tracking-wide text-slate-500">Бейдж</Label>
        <Input
          value={props.badge}
          onChange={(event) => onChange((prev) => ({ ...prev, badge: event.target.value }))}
          className="border-slate-800 bg-slate-950 text-white"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs uppercase tracking-wide text-slate-500">Заголовок</Label>
        <Input
          value={props.title}
          onChange={(event) => onChange((prev) => ({ ...prev, title: event.target.value }))}
          className="border-slate-800 bg-slate-950 text-white"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs uppercase tracking-wide текст-сlate-500">Описание</Label>
        <textarea
          value={props.description}
          onChange={(event) => onChange((prev) => ({ ...prev, description: event.target.value }))}
          className="min-h-[96px] w-full rounded-md border border-сlate-800 bg-сlate-950 px-3 py-2 text-sm text-white placeholder:text-сlate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs uppercase tracking-wide text-slate-500">Кнопка</Label>
        <Input
          value={props.primaryLabel}
          onChange={(event) => onChange((prev) => ({ ...prev, primaryLabel: event.target.value }))}
          className="border-slate-800 bg-slate-950 text-white"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs uppercase tracking-wide text-slate-500">Доп. действие</Label>
        <Input
          value={props.secondaryLabel}
          onChange={(event) => onChange((prev) => ({ ...prev, secondaryLabel: event.target.value }))}
          className="border-slate-800 bg-slate-950 text-white"
        />
      </div>
    </div>
  );
}

function FormPropsEditor({
  props,
  onChange,
}: {
  props: FormProps;
  onChange: (updater: (prev: FormProps) => FormProps) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs uppercase tracking-wide text-slate-500">Заголовок</Label>
        <Input
          value={props.title}
          onChange={(event) => onChange((prev) => ({ ...prev, title: event.target.value }))}
          className="border-slate-800 bg-slate-950 text-white"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs uppercase tracking-wide text-slate-500">Описание</Label>
        <textarea
          value={props.description}
          onChange={(event) => onChange((prev) => ({ ...prev, description: event.target.value }))}
          className="min-h-[96px] w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs uppercase tracking-wide text-slate-500">Поле Email</Label>
        <Input
          value={props.emailLabel}
          onChange={(event) => onChange((prev) => ({ ...prev, emailLabel: event.target.value }))}
          className="border-slate-800 bg-slate-950 text-white"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs uppercase tracking-wide text-slate-500">Поле комментария</Label>
        <Input
          value={props.commentLabel}
          onChange={(event) => onChange((prev) => ({ ...prev, commentLabel: event.target.value }))}
          className="border-slate-800 bg-slate-950 text-white"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs uppercase tracking-wide text-slate-500">Кнопка</Label>
        <Input
          value={props.submitLabel}
          onChange={(event) => onChange((prev) => ({ ...prev, submitLabel: event.target.value }))}
          className="border-slate-800 bg-slate-950 text-white"
        />
      </div>
    </div>
  );
}

export { createDefaultCanvas, normalizeCanvasState } from "@/app/dashboard/projects/block-config";

function areCanvasStatesEqual(a: CanvasState, b: CanvasState): boolean {
  if (a.selectedInstanceId !== b.selectedInstanceId) {
    return false;
  }
  if (a.blocks.length !== b.blocks.length) {
    return false;
  }
  for (let index = 0; index < a.blocks.length; index += 1) {
    const blockA = a.blocks[index];
    const blockB = b.blocks[index];
    if (blockA.blockId !== blockB.blockId || blockA.instanceId !== blockB.instanceId) {
      return false;
    }
    const propsA = normalizeProps(blockA.blockId as BlockId, blockA.props);
    const propsB = normalizeProps(blockB.blockId as BlockId, blockB.props);
    if (JSON.stringify(propsA) !== JSON.stringify(propsB)) {
      return false;
    }
    if (blockA.notes !== blockB.notes) {
      return false;
    }
    if (JSON.stringify(blockA.dataBinding ?? null) !== JSON.stringify(blockB.dataBinding ?? null)) {
      return false;
    }
  }
  return true;
}

function formatJsonPreview(value: unknown, maxLength = 160): string {
  try {
    const stringified = typeof value === "string" ? value : JSON.stringify(value, null, 2);
    return stringified.length > maxLength ? `${stringified.slice(0, maxLength)}…` : stringified;
  } catch {
    return "[unserializable]";
  }
}
