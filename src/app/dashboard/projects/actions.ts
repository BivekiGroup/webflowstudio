"use server";

import { revalidatePath } from "next/cache";
import { Prisma, DataSourceType } from "@prisma/client";
import type { CanvasState } from "@/lib/projects";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createDataSource,
  updateDataSource,
  deleteDataSource,
  upsertSample,
  deleteSample,
  type CreateDataSourceInput,
  type UpdateDataSourceInput,
  type StoredConfig,
} from "@/lib/data-sources";

function isCanvasStateUnsupported(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message ?? "";
  return (
    message.includes("Unknown argument `canvasState`") ||
    message.includes("Unknown field `canvasState`") ||
    message.includes('column "canvasState" does not exist') ||
    message.includes('column "canvas_state" does not exist')
  );
}

async function assertProjectAccess(projectId: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      createdById: userId,
    },
    select: { id: true },
  });

  if (!project) {
    throw new Error("Проект не найден или у вас нет доступа.");
  }

  return project;
}

export async function saveCanvasAction(projectId: string, projectSlug: string, state: CanvasState): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Требуется авторизация.");
  }

  await assertProjectAccess(projectId, user.id);

  try {
    await prisma.project.update({
      where: { id: projectId },
      data: {
        canvasState: state as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    if (isCanvasStateUnsupported(error)) {
      throw new Error(
        "Поле canvasState ещё не создано в базе. Выполните миграцию (`npx prisma migrate dev --name add_canvas_state` или `npx prisma db push`) и перезапустите dev-сервер.",
      );
    }
    throw error;
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/projects/${projectSlug}`);
}

export async function loadCanvasStateAction(projectId: string): Promise<CanvasState | null> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Требуется авторизация.");
  }

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        createdById: user.id,
      },
      select: {
        canvasState: true,
      },
    });

    if (!project) {
      throw new Error("Проект не найден или у вас нет доступа.");
    }

    return project.canvasState as CanvasState | null;
  } catch (error) {
    if (isCanvasStateUnsupported(error)) {
      return null;
    }
    throw error;
  }
}

type DataSourcePayload = {
  name: string;
  type: DataSourceType;
  endpoint?: string | null;
  method?: string | null;
  headers?: Record<string, string> | null;
  description?: string | null;
  config?: StoredConfig;
  samples?: Array<{ label: string; payload: unknown }>;
};

export async function createDataSourceAction(
  projectId: string,
  projectSlug: string,
  payload: DataSourcePayload,
) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Требуется авторизация.");
  }

  await assertProjectAccess(projectId, user.id);

  const created = await createDataSource({
    projectId,
    name: payload.name,
    type: payload.type,
    endpoint: payload.endpoint ?? null,
    method: payload.method ?? null,
    headers: payload.headers ?? null,
    description: payload.description ?? null,
    config: payload.config ?? undefined,
    samples: payload.samples?.map((sample) => ({
      label: sample.label,
      payload: sample.payload as Prisma.JsonValue,
    })),
  } satisfies CreateDataSourceInput);

  revalidatePath(`/dashboard/projects/${projectSlug}`);

  return created;
}

export async function updateDataSourceAction(
  projectId: string,
  projectSlug: string,
  sourceId: string,
  patch: UpdateDataSourceInput,
) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Требуется авторизация.");
  }

  await assertProjectAccess(projectId, user.id);

  const updated = await updateDataSource(projectId, sourceId, patch);

  revalidatePath(`/dashboard/projects/${projectSlug}`);

  return updated;
}

export async function deleteDataSourceAction(projectId: string, projectSlug: string, sourceId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Требуется авторизация.");
  }

  await assertProjectAccess(projectId, user.id);
  await deleteDataSource(projectId, sourceId);

  revalidatePath(`/dashboard/projects/${projectSlug}`);
}

export async function upsertSampleAction(
  projectId: string,
  projectSlug: string,
  params: {
    sourceId: string;
    sampleId?: string;
    label: string;
    payload: unknown;
  },
) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Требуется авторизация.");
  }

  await assertProjectAccess(projectId, user.id);

  const sample = await upsertSample({
    projectId,
    sourceId: params.sourceId,
    sampleId: params.sampleId,
    label: params.label,
    payload: params.payload as Prisma.JsonValue,
  });

  revalidatePath(`/dashboard/projects/${projectSlug}`);

  return sample;
}

export async function deleteSampleAction(projectId: string, projectSlug: string, sampleId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Требуется авторизация.");
  }

  await assertProjectAccess(projectId, user.id);
  await deleteSample(projectId, sampleId);

  revalidatePath(`/dashboard/projects/${projectSlug}`);
}

type TestApiRequestParams = {
  type: DataSourceType;
  endpoint: string;
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  query?: string;
  variables?: Record<string, unknown>;
};

type TestApiResponse = {
  success: true;
  data: unknown;
  status?: number;
} | {
  success: false;
  error: string;
};

export async function testApiRequestAction(
  projectId: string,
  params: TestApiRequestParams
): Promise<TestApiResponse> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Требуется авторизация.");
  }

  await assertProjectAccess(projectId, user.id);

  try {
    if (params.type === "REST") {
      const method = params.method || "GET";
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...params.headers,
      };

      const options: RequestInit = {
        method,
        headers,
        ...(method !== "GET" && method !== "HEAD" && params.body
          ? { body: JSON.stringify(params.body) }
          : {}),
      };

      const response = await fetch(params.endpoint, options);

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();

      return {
        success: true,
        data,
        status: response.status,
      };
    } else if (params.type === "GRAPHQL") {
      if (!params.query) {
        return {
          success: false,
          error: "GraphQL query is required",
        };
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...params.headers,
      };

      const body = {
        query: params.query,
        ...(params.variables ? { variables: params.variables } : {}),
      };

      const response = await fetch(params.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const result = await response.json();

      if (result.errors) {
        return {
          success: false,
          error: result.errors.map((e: { message: string }) => e.message).join(", "),
        };
      }

      return {
        success: true,
        data: result.data,
        status: response.status,
      };
    } else {
      return {
        success: false,
        error: "MOCK type does not support testing",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
