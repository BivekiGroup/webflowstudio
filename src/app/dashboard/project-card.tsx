"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, User, Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_BADGE_CLASSES } from "@/lib/project-status";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ProjectStatus } from "@prisma/client";

type ProjectCardProps = {
  project: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    status: ProjectStatus;
    updatedAt: Date;
    owner: string | null;
  };
};

function formatUpdatedAt(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "только что";
  if (diffMins < 60) return `${diffMins} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;
  if (diffDays < 7) return `${diffDays} д назад`;

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/share/${project.slug}`
    : "";

  async function handleCopyShareLink(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareLinkCopied(true);
      setTimeout(() => setShareLinkCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy share link", error);
    }
  }

  return (
    <>
      <Link href={`/dashboard/projects/${project.slug}`}>
        <Card className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-sm transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
          <CardContent className="relative flex items-center justify-between p-5">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-white transition-colors group-hover:text-emerald-400">
                  {project.name}
                </h3>
                <Badge
                  className={cn(
                    "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm",
                    PROJECT_STATUS_BADGE_CLASSES[project.status],
                  )}
                >
                  {PROJECT_STATUS_LABELS[project.status]}
                </Badge>
              </div>
              {project.description && (
                <p className="line-clamp-1 text-sm leading-relaxed text-slate-400">{project.description}</p>
              )}
              <div className="flex items-center gap-5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatUpdatedAt(project.updatedAt)}</span>
                </div>
                {project.owner && (
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    <span>{project.owner}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Share button */}
              <button
                onClick={handleCopyShareLink}
                className="flex items-center gap-2 rounded-lg bg-slate-700/40 px-3 py-2 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-700/60 hover:text-white"
                title="Скопировать ссылку для публикации"
              >
                {shareLinkCopied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="hidden sm:inline text-emerald-400">Скопировано</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Поделиться</span>
                  </>
                )}
              </button>

              {/* Open button */}
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400 transition-all group-hover:bg-emerald-500/20 group-hover:text-emerald-300">
                <span className="hidden sm:inline">Открыть</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </>
  );
}
