import type { CanvasState } from "@/lib/projects";
import type { DataSourceRecord } from "@/lib/data-sources";
import {
  normalizeCanvasState,
  normalizeProps,
  type BlockId,
  type BlockPropsMap,
} from "@/app/dashboard/projects/block-config";

type ExportBlock = {
  id: BlockId;
  props: BlockPropsMap[BlockId] & { data?: unknown };
};

export function generateReactExport({
  componentName,
  canvasState,
  dataSources,
}: {
  componentName: string;
  canvasState: CanvasState;
  dataSources: DataSourceRecord[];
}): string {
  const normalized = normalizeCanvasState(canvasState);

  const blocks: ExportBlock[] = normalized.blocks.map((block) => {
    const props = normalizeProps(block.blockId as BlockId, block.props);

    if (block.dataBinding?.sourceId) {
      const source = dataSources.find((item) => item.id === block.dataBinding?.sourceId);
      const sample = source?.samples.find((item) => item.id === block.dataBinding?.sampleId);

      if (sample && typeof sample.payload === "object" && sample.payload) {
        (props as Record<string, unknown>).data = sample.payload;
      }
    }

    return {
      id: block.blockId as BlockId,
      props,
    };
  });

  const blocksLiteral = JSON.stringify(blocks, null, 2);

  return `import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const blocks = ${blocksLiteral};

export function ${componentName}() {
  return (
    <div className="space-y-12 bg-slate-950 p-10 text-slate-100">
      {blocks.map((block, index) => (
        <section
          key={index}
          className="rounded-3xl border border-slate-800/60 bg-slate-950/80 p-6 shadow-lg"
        >
          {renderBlock(block)}
        </section>
      ))}
    </div>
  );
}

function renderBlock(block) {
  switch (block.id) {
    case "hero":
      return (
        <ExportContainer data={block.props.data}>
          <Card className="border-emerald-500/20 bg-slate-950/80">
            <CardHeader className="gap-2">
              <Badge className="w-fit border border-emerald-500/40 bg-emerald-500/10 text-emerald-200">
                {block.props.badge}
              </Badge>
              <CardTitle className="text-2xl text-white">{block.props.title}</CardTitle>
              <CardDescription className="max-w-2xl text-base text-slate-300">
                {block.props.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button className="bg-emerald-500 text-slate-950 hover:bg-emerald-400">{block.props.primaryLabel}</Button>
              <Button variant="ghost" className="text-slate-200 hover:text-white">
                {block.props.secondaryLabel}
              </Button>
            </CardContent>
          </Card>
        </ExportContainer>
      );
    case "stats":
      return (
        <ExportContainer data={block.props.data}>
          <div className="grid gap-3 md:grid-cols-3">
            {block.props.metrics.map((metric, metricIndex) => (
              <Card key={metricIndex} className="border-slate-800/60 bg-slate-950/75">
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
        </ExportContainer>
      );
    case "workflow":
      return (
        <ExportContainer data={block.props.data}>
          <Tabs defaultValue={block.props.stages[0]?.id ?? "stage-0"} className="w-full">
            <TabsList>
              {block.props.stages.map((stage) => (
                <TabsTrigger key={stage.id} value={stage.id}>
                  {stage.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {block.props.stages.map((stage) => (
              <TabsContent key={stage.id} value={stage.id}>
                <div className="space-y-3 text-slate-300">
                  <h3 className="text-xl font-semibold text-white">{stage.title}</h3>
                  <p>{stage.description}</p>
                  <Separator className="border-slate-800/60" />
                  <div className="flex flex-wrap gap-2">
                    {stage.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} className="border border-slate-700 bg-slate-900/60 text-slate-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </ExportContainer>
      );
    case "cta":
      return (
        <ExportContainer data={block.props.data}>
          <Card className="border-blue-500/30 bg-slate-950/75">
            <CardHeader className="space-y-2">
              <Badge className="w-fit border border-blue-400/40 bg-blue-500/10 text-blue-200">
                {block.props.badge}
              </Badge>
              <CardTitle className="text-2xl text-white">{block.props.title}</CardTitle>
              <CardDescription className="text-base text-slate-300">{block.props.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Button className="bg-blue-500 text-white hover:bg-blue-400">{block.props.primaryLabel}</Button>
              <Button variant="ghost" className="text-slate-200 hover:text-white">
                {block.props.secondaryLabel}
              </Button>
            </CardContent>
          </Card>
        </ExportContainer>
      );
    case "form":
      return (
        <ExportContainer data={block.props.data}>
          <Card className="border-slate-800/60 bg-slate-950/80">
            <CardHeader>
              <CardTitle className="text-white">{block.props.title}</CardTitle>
              <CardDescription className="text-slate-400">{block.props.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-200">{block.props.emailLabel}</Label>
                <Input placeholder="team@yourcompany.com" className="border-slate-800 bg-slate-950 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-200">{block.props.commentLabel}</Label>
                <textarea
                  placeholder="Опишите, что нужно проверить или собрать."
                  className="min-h-[96px] w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
                />
              </div>
              <Button className="bg-emerald-500 text-slate-950 hover:bg-emerald-400">{block.props.submitLabel}</Button>
            </CardContent>
          </Card>
        </ExportContainer>
      );
    default:
      return <div>Unknown block {String(block.id)}</div>;
  }
}

function ExportContainer({ data, children }) {
  if (!data) {
    return <>{children}</>;
  }
  return (
    <div className="space-y-4">
      {children}
      <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-4 text-xs text-slate-300">
        <p className="mb-2 font-medium text-slate-200">Пример данных</p>
        <pre className="max-h-40 overflow-auto whitespace-pre-wrap text-[11px] text-emerald-200">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
`;
}
