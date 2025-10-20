import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { getProjectForUserBySlug } from "@/lib/projects";
import { loadCanvasStateAction } from "@/app/dashboard/projects/actions";
import { EnhancedExportView } from "@/app/dashboard/projects/studio-export/enhanced-view";
import { createDefaultCanvas } from "@/app/dashboard/projects/block-config";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function resolveParams(paramsPromise: PageProps["params"]) {
  return paramsPromise;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await resolveParams(props.params);
  const user = await getCurrentUser();
  if (!user) {
    return {
      title: "Экспорт — WebFlow Studio",
    };
  }

  const project = await getProjectForUserBySlug(user.id, params.slug);
  if (!project) {
    return {
      title: "Проект не найден — WebFlow Studio",
    };
  }

  return {
    title: `Экспорт — ${project.name}`,
  };
}

export default async function ProjectExportPage(props: PageProps) {
  const params = await resolveParams(props.params);
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const project = await getProjectForUserBySlug(user.id, params.slug);
  if (!project) {
    notFound();
  }

  const canvas = await loadCanvasStateAction(project.id);
  const canvasState = canvas || createDefaultCanvas();

  return <EnhancedExportView canvasState={canvasState} projectName={project.name} projectSlug={project.slug} />;
}
