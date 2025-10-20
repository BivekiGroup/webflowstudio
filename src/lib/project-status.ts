import type { ProjectStatus } from "@prisma/client";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  IN_PROGRESS: "В работе",
  DEMO: "Демо",
  PREPARATION: "Подготовка",
};

export const PROJECT_STATUS_BADGE_CLASSES: Record<ProjectStatus, string> = {
  IN_PROGRESS: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  DEMO: "border-blue-500/40 bg-blue-500/10 text-blue-200",
  PREPARATION: "border-amber-500/40 bg-amber-500/10 text-amber-200",
};
