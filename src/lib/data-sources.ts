import { Prisma, DataSourceType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type StoredHeaders = Record<string, string>;

export type StoredConfig =
  | {
      query?: string;
      variables?: Record<string, unknown>;
    }
  | {
      mock?: Record<string, unknown>;
    }
  | Record<string, unknown>
  | null;

export type DataSampleRecord = {
  id: string;
  label: string;
  payload: Prisma.JsonValue;
  createdAt: Date;
};

export type DataSourceRecord = {
  id: string;
  projectId: string;
  name: string;
  type: DataSourceType;
  endpoint: string | null;
  method: string | null;
  headers: StoredHeaders | null;
  description: string | null;
  config: StoredConfig;
  createdAt: Date;
  updatedAt: Date;
  samples: DataSampleRecord[];
};

export type CreateDataSourceInput = {
  projectId: string;
  name: string;
  type: DataSourceType;
  endpoint?: string | null;
  method?: string | null;
  headers?: StoredHeaders | null;
  description?: string | null;
  config?: StoredConfig;
  samples?: Array<{ label: string; payload: Prisma.JsonValue }>;
};

export type UpdateDataSourceInput = Partial<Omit<CreateDataSourceInput, "projectId">>;

type PrismaDataSourceWithSamples = Prisma.DataSourceGetPayload<{
  include: { samples: true };
}>;

export async function listDataSources(projectId: string): Promise<DataSourceRecord[]> {
  const sources = await prisma.dataSource.findMany({
    where: { projectId },
    orderBy: [{ createdAt: "asc" }],
    include: { samples: { orderBy: [{ createdAt: "asc" }] } },
  });

  return sources.map(normalizeDataSource);
}

export async function getDataSource(projectId: string, sourceId: string): Promise<DataSourceRecord | null> {
  const source = await prisma.dataSource.findFirst({
    where: { id: sourceId, projectId },
    include: { samples: { orderBy: [{ createdAt: "asc" }] } },
  });

  return source ? normalizeDataSource(source) : null;
}

export async function createDataSource(input: CreateDataSourceInput): Promise<DataSourceRecord> {
  const { projectId, name, type, endpoint, method, description, headers, config, samples } = input;

  const created = await prisma.dataSource.create({
    data: {
      projectId,
      name,
      type,
      endpoint,
      method,
      description,
      headers: (headers ?? undefined) as Prisma.InputJsonValue | undefined,
      config: (config ?? undefined) as Prisma.InputJsonValue | undefined,
      samples: samples
        ? {
            createMany: {
              data: samples.map((sample) => ({
                label: sample.label,
                payload: sample.payload as Prisma.InputJsonValue,
              })),
            },
          }
        : undefined,
    },
    include: { samples: { orderBy: [{ createdAt: "asc" }] } },
  });

  return normalizeDataSource(created);
}

export async function updateDataSource(
  projectId: string,
  sourceId: string,
  patch: UpdateDataSourceInput,
): Promise<DataSourceRecord> {
  const existing = await prisma.dataSource.findUnique({
    where: { id: sourceId },
  });

  if (!existing || existing.projectId !== projectId) {
    throw new Error("Источника данных не существует или нет доступа.");
  }

  const updated = await prisma.dataSource.update({
    where: { id: sourceId },
    data: {
      name: patch.name ?? undefined,
      type: patch.type ?? undefined,
      endpoint: patch.endpoint ?? undefined,
      method: patch.method ?? undefined,
      description: patch.description ?? undefined,
      headers: (patch.headers ?? undefined) as Prisma.InputJsonValue | undefined,
      config: (patch.config ?? undefined) as Prisma.InputJsonValue | undefined,
    },
    include: { samples: { orderBy: [{ createdAt: "asc" }] } },
  });

  return normalizeDataSource(updated);
}

export async function deleteDataSource(projectId: string, sourceId: string): Promise<void> {
  const existing = await prisma.dataSource.findUnique({
    where: { id: sourceId },
  });

  if (!existing || existing.projectId !== projectId) {
    throw new Error("Источника данных не существует или нет доступа.");
  }

  await prisma.dataSource.delete({
    where: { id: sourceId },
  });
}

export async function upsertSample(params: {
  projectId: string;
  sourceId: string;
  sampleId?: string;
  label: string;
  payload: Prisma.JsonValue;
}): Promise<DataSampleRecord> {
  const { projectId, sourceId, sampleId, label, payload } = params;

  if (sampleId) {
    const updated = await prisma.dataSample.update({
      where: { id: sampleId },
      data: {
        label,
        payload: payload as Prisma.InputJsonValue,
      },
      include: {
        dataSource: true,
      },
    });

    if (updated.dataSource.projectId !== projectId || updated.dataSourceId !== sourceId) {
      throw new Error("Недостаточно прав для обновления примера данных.");
    }

    return {
      id: updated.id,
      label: updated.label,
      payload: updated.payload,
      createdAt: updated.createdAt,
    };
  }

  const created = await prisma.dataSample.create({
    data: {
      dataSourceId: sourceId,
      label,
      payload: payload as Prisma.InputJsonValue,
    },
  });

  // Ensure the source belongs to the project
  const source = await prisma.dataSource.findUnique({
    where: { id: sourceId },
    select: { projectId: true },
  });

  if (!source || source.projectId !== projectId) {
    throw new Error("Источника данных не существует или нет доступа.");
  }

  return {
    id: created.id,
    label: created.label,
    payload: created.payload,
    createdAt: created.createdAt,
  };
}

export async function deleteSample(projectId: string, sampleId: string): Promise<void> {
  const sample = await prisma.dataSample.findUnique({
    where: { id: sampleId },
    include: { dataSource: true },
  });

  if (!sample || sample.dataSource.projectId !== projectId) {
    throw new Error("Пример данных не найден или нет доступа.");
  }

  await prisma.dataSample.delete({ where: { id: sampleId } });
}

function normalizeDataSource(source: PrismaDataSourceWithSamples): DataSourceRecord {
  return {
    id: source.id,
    projectId: source.projectId,
    name: source.name,
    type: source.type,
    endpoint: source.endpoint,
    method: source.method,
    headers: (source.headers as StoredHeaders | null) ?? null,
    description: source.description,
    config: (source.config as StoredConfig) ?? null,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
    samples: source.samples.map((sample) => ({
      id: sample.id,
      label: sample.label,
      payload: sample.payload,
      createdAt: sample.createdAt,
    })),
  } satisfies DataSourceRecord;
}
