import { Prisma, ProjectStatus } from "@prisma/client";
import type { Project } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ProjectMetric = {
  label: string;
  value: string;
};

export type DashboardProject = {
  id: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  description: string | null;
  owner: string | null;
  repositoryUrl: string | null;
  metrics: ProjectMetric[];
  canvasState: CanvasState | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProjectInput = {
  name: string;
  description: string | null;
  repositoryUrl: string | null;
  status: ProjectStatus;
  owner: string | null;
  createdById: string;
  metrics?: ProjectMetric[];
  canvasState?: CanvasState | null;
};

function mapProjectRecord(project: Project): DashboardProject {
  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
    status: project.status,
    description: project.description,
    owner: project.owner,
    repositoryUrl: project.repositoryUrl,
    metrics: Array.isArray(project.metrics) ? (project.metrics as ProjectMetric[]) : [],
    canvasState: project.canvasState ? (project.canvasState as CanvasState) : null,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

export async function listProjectsForUser(userId: string): Promise<DashboardProject[]> {
  const projects = await prisma.project.findMany({
    where: { createdById: userId },
    orderBy: [{ updatedAt: "desc" }],
  });

  return projects.map(mapProjectRecord);
}

export async function createProject(input: CreateProjectInput) {
  const baseSlug = slugify(input.name);
  const slug = await ensureUniqueSlug(baseSlug);

  const metrics: Prisma.InputJsonValue | undefined = input.metrics?.length ? input.metrics : undefined;
  const canvasState = input.canvasState ? (input.canvasState as Prisma.InputJsonValue) : undefined;

  await prisma.project.create({
    data: {
      name: input.name,
      slug,
      status: input.status,
      description: input.description,
      owner: input.owner,
      repositoryUrl: input.repositoryUrl,
      metrics,
      createdById: input.createdById,
      canvasState,
    },
  });
}

async function ensureUniqueSlug(base: string): Promise<string> {
  const normalizedBase = base || "project";
  let attempt = normalizedBase;
  let counter = 1;

  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug: attempt } });
    if (!existing) {
      return attempt;
    }
    counter += 1;
    attempt = `${normalizedBase}-${counter}`;
  }
}

function slugify(input: string): string {
  const slug = input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "project";
}

export async function getProjectForUserBySlug(userId: string, slug: string): Promise<DashboardProject | null> {
  const project = await prisma.project.findFirst({
    where: {
      slug,
      createdById: userId,
    },
  });

  if (!project) {
    return null;
  }

  return mapProjectRecord(project);
}

export async function getProjectBySlug(slug: string): Promise<DashboardProject | null> {
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  return project ? mapProjectRecord(project) : null;
}

export type CanvasDataBinding = {
  sourceId: string;
  sampleId: string | null;
  fieldPath?: string | null;
  // Пользовательские маппинги полей (опционально)
  fieldMappings?: Array<{
    sourcePath: string;
    targetProp: string;
  }> | null;
};

export type CanvasState = {
  blocks: Array<{
    instanceId: string;
    blockId: string;
    notes?: string;
    dataBinding?: CanvasDataBinding | null;
    props?: Record<string, unknown> | null;
  }>;
  selectedInstanceId: string | null;
};
