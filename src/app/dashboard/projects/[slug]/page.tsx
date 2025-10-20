import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getProjectForUserBySlug } from "@/lib/projects";
import { PROJECT_STATUS_BADGE_CLASSES, PROJECT_STATUS_LABELS } from "@/lib/project-status";
import { StudioWorkspace } from "@/app/dashboard/projects/studio-workspace";
import {
  saveCanvasAction,
  loadCanvasStateAction,
  createDataSourceAction,
  updateDataSourceAction,
  deleteDataSourceAction,
  upsertSampleAction,
  deleteSampleAction,
} from "@/app/dashboard/projects/actions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { listDataSources } from "@/lib/data-sources";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function resolveParams(paramsPromise: PageProps["params"]) {
  return await paramsPromise;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await resolveParams(props.params);
  const user = await getCurrentUser();
  if (!user) {
    return {
      title: "Studio — WebFlow",
    };
  }

  const project = await getProjectForUserBySlug(user.id, params.slug);
  if (!project) {
    return {
      title: "Проект не найден — WebFlow Studio",
    };
  }

  return {
    title: `${project.name} — Studio`,
  };
}

export default async function ProjectStudioPage(props: PageProps) {
  const params = await resolveParams(props.params);
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const project = await getProjectForUserBySlug(user.id, params.slug);
  if (!project) {
    notFound();
  }

  const dataSources = await listDataSources(project.id);
  const statusBadgeClasses = PROJECT_STATUS_BADGE_CLASSES[project.status];
  const statusLabel = PROJECT_STATUS_LABELS[project.status];
  const saveCanvas = saveCanvasAction.bind(null, project.id, project.slug);
  const loadCanvas = loadCanvasStateAction.bind(null, project.id);
  const createSource = createDataSourceAction.bind(null, project.id, project.slug);
  const updateSource = updateDataSourceAction.bind(null, project.id, project.slug);
  const removeSource = deleteDataSourceAction.bind(null, project.id, project.slug);
  const saveSample = upsertSampleAction.bind(null, project.id, project.slug);
  const removeSample = deleteSampleAction.bind(null, project.id, project.slug);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_50%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.08),_transparent_55%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full flex-col gap-6 px-6 py-8">
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Назад к проектам
              </Link>
              <span>/</span>
              <span className="text-slate-200">{project.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={cn("border px-3 py-1 text-xs font-semibold uppercase tracking-wide", statusBadgeClasses)}>
                {statusLabel}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              <p className="mt-1 text-sm text-slate-400">
                Визуальный редактор для создания интерфейсов
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/projects/${project.slug}/preview`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-4 text-sm font-medium text-slate-300 transition-colors hover:border-emerald-500/50 hover:bg-slate-800 hover:text-white"
              >
                Предпросмотр
              </Link>
              <Link
                href={`/share/${project.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-4 text-sm font-medium text-slate-300 transition-colors hover:border-emerald-500/50 hover:bg-slate-800 hover:text-white"
              >
                Поделиться
              </Link>
              <Link
                href={`/dashboard/projects/${project.slug}/export`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-4 text-sm font-medium text-slate-300 transition-colors hover:border-emerald-500/50 hover:bg-slate-800 hover:text-white"
              >
                Экспорт кода
              </Link>
            </div>
          </div>
        </header>

        <StudioWorkspace
          key={project.id}
          projectName={project.name}
          initialCanvasState={project.canvasState}
          initialDataSources={dataSources}
          projectSlug={project.slug}
          onSave={saveCanvas}
          onReset={loadCanvas}
          onCreateDataSource={createSource}
          onUpdateDataSource={updateSource}
          onDeleteDataSource={removeSource}
          onUpsertSample={saveSample}
          onDeleteSample={removeSample}
        />

      </div>
    </main>
  );
}
