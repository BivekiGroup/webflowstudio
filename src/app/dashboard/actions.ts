"use server";

import { revalidatePath } from "next/cache";
import { ProjectStatus } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { createProject } from "@/lib/projects";

export type CreateProjectFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function createProjectAction(
  _prevState: CreateProjectFormState,
  formData: FormData,
): Promise<CreateProjectFormState> {
  const user = await getCurrentUser();
  if (!user) {
    return { status: "error", message: "Требуется авторизация." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const repositoryUrl = String(formData.get("repositoryUrl") ?? "").trim() || null;
  const ownerFromForm = String(formData.get("owner") ?? "").trim();
  const statusFromForm = String(formData.get("status") ?? "IN_PROGRESS").toUpperCase();

  if (!name) {
    return { status: "error", message: "Укажите название проекта." };
  }

  const owner = ownerFromForm || user.name || user.email;
  const status: ProjectStatus =
    statusFromForm === "DEMO" || statusFromForm === "PREPARATION" ? statusFromForm : "IN_PROGRESS";

  try {
    await createProject({
      name,
      description,
      repositoryUrl,
      status,
      owner,
      createdById: user.id,
    });
    revalidatePath("/dashboard");
    return { status: "success", message: "Проект создан." };
  } catch (error) {
    console.error("Failed to create project", error);
    return { status: "error", message: "Не удалось создать проект. Попробуйте еще раз." };
  }
}
