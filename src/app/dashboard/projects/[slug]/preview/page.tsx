import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { getProjectForUserBySlug } from "@/lib/projects";
import { listDataSources } from "@/lib/data-sources";
import { StudioPreview } from "@/app/dashboard/projects/studio-preview";
import { loadCanvasStateAction } from "@/app/dashboard/projects/actions";

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
      title: "Предпросмотр — WebFlow Studio",
    };
  }

  const project = await getProjectForUserBySlug(user.id, params.slug);
  if (!project) {
    return {
      title: "Проект не найден — WebFlow Studio",
    };
  }

  return {
    title: `Предпросмотр — ${project.name}`,
  };
}

export default async function ProjectPreviewPage(props: PageProps) {
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
  if (!canvas) {
    notFound();
  }

  const dataSources = await listDataSources(project.id);

  return (
    <StudioPreview
      canvasState={canvas}
      dataSources={dataSources}
    />
  );
}
