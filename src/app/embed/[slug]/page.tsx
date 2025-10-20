import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug } from "@/lib/projects";
import { listDataSources } from "@/lib/data-sources";
import { StudioPreviewContent } from "@/app/dashboard/projects/studio-preview";
import type { PreviewDataSource } from "@/app/dashboard/projects/studio-preview/renderer";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function resolveParams(paramsPromise: PageProps["params"]) {
  return paramsPromise;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await resolveParams(props.params);
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Embed — WebFlow Studio",
    };
  }

  return {
    title: `Embed — ${project.name}`,
  };
}

export default async function EmbedPreviewPage(props: PageProps) {
  const params = await resolveParams(props.params);
  const project = await getProjectBySlug(params.slug);

  if (!project || !project.canvasState) {
    notFound();
  }

  const dataSources = await listDataSources(project.id);
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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-10">
        <StudioPreviewContent
          canvasState={project.canvasState}
          dataSources={previewDataSources}
          emptyState={
            <div className="rounded-2xl border border-slate-800/60 bg-slate-950/80 p-6 text-center text-slate-400">
              Проект пока пуст. Добавьте блоки в Studio, чтобы увидеть предпросмотр.
            </div>
          }
        />
      </section>
    </main>
  );
}

