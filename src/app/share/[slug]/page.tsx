import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug } from "@/lib/projects";
import { listDataSources } from "@/lib/data-sources";
import { generateReactExport } from "@/app/dashboard/projects/studio-export/codegen";
import { pascalCase } from "@/app/dashboard/projects/studio-export/utils";
import { SharePreviewView } from "@/app/share/[slug]/view";
import type { PreviewDataSource } from "@/app/dashboard/projects/studio-preview/renderer";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function resolveParams(paramsPromise: PageProps["params"]) {
  return paramsPromise;
}

function resolveBaseUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
  return configured ?? "http://localhost:3000";
}

function buildAbsoluteUrl(pathname: string): string {
  const base = resolveBaseUrl().replace(/\/+$/, "");
  return `${base}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await resolveParams(props.params);
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Предпросмотр не найден — WebFlow Studio",
    };
  }

  return {
    title: `Публичный предпросмотр — ${project.name}`,
    description: `Живой предпросмотр проекта «${project.name}» из WebFlow Studio.`,
  };
}

export default async function SharePreviewPage(props: PageProps) {
  const params = await resolveParams(props.params);
  const project = await getProjectBySlug(params.slug);

  if (!project || !project.canvasState) {
    notFound();
  }

  const dataSources = await listDataSources(project.id);
  const componentName = pascalCase(`${project.slug}-preview`) || "StudioExport";

  const code = generateReactExport({
    componentName,
    canvasState: project.canvasState,
    dataSources,
  });

  const previewDataSources: PreviewDataSource[] = dataSources.map((source) => ({
    id: source.id,
    type: source.type,
    endpoint: source.endpoint,
    method: source.method,
    headers: source.headers,
    config: source.config,
    samples: source.samples.map((sample) => ({
      id: sample.id,
      label: sample.label,
      payload: sample.payload,
    })),
  }));

  const studioUrl = `/dashboard/projects/${project.slug}`;
  const shareUrl = buildAbsoluteUrl(`/share/${project.slug}`);
  const embedUrl = buildAbsoluteUrl(`/embed/${project.slug}`);

  return (
    <SharePreviewView
      projectName={project.name}
      updatedAtIso={project.updatedAt.toISOString()}
      shareUrl={shareUrl}
      embedUrl={embedUrl}
      studioUrl={studioUrl}
      code={code}
      componentName={componentName}
      canvasState={project.canvasState}
      dataSources={previewDataSources}
    />
  );
}
