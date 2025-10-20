import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Sparkles, BookOpen, FileCode, Palette, ExternalLink, User, CreditCard, TrendingUp } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/(auth)/actions";
import { listProjectsForUser } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateProjectForm } from "@/app/dashboard/create-project-form";
import { ProjectCard } from "@/app/dashboard/project-card";

export const metadata = {
  title: "Панель управления — WebFlow Studio",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const projects = await listProjectsForUser(user.id);
  const activeProjects = projects.filter((p) => p.status === "IN_PROGRESS").length;

  return (
    <div className="relative min-h-screen bg-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_50%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.08),_transparent_55%)]" />

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <span className="text-lg font-bold text-white">WebFlow Studio</span>
            </Link>
            <div className="hidden h-4 w-px bg-white/10 sm:block" />
            <a
              href="https://biveki.ru"
              target="_blank"
              rel="noreferrer"
              className="hidden text-xs text-slate-400 transition-colors hover:text-slate-300 sm:block"
            >
              by <span className="font-medium text-slate-300">Biveki</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-400 sm:block">
              {user.name ?? user.email}
            </span>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" size="sm" className="h-8 text-slate-300 hover:text-white">
                Выйти
              </Button>
            </form>
          </div>
        </div>
      </nav>

      <main className="relative mx-auto max-w-[1400px] px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Панель управления</h1>
            <p className="mt-1 text-base text-slate-400">
              Управляйте проектами и создавайте сайты визуально
            </p>
          </div>
          <CreateProjectForm ownerHint={user.name ?? user.email} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Основная колонка */}
          <div className="space-y-6">
            {/* Статистика сверху */}
            <div className="flex items-center gap-8 rounded-xl border border-white/10 bg-slate-800/40 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800/50">
                  <TrendingUp className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Всего проектов</p>
                  <p className="text-xl font-bold text-white">{projects.length}</p>
                </div>
              </div>

              <div className="h-8 w-px bg-white/10" />

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Активных</p>
                  <p className="text-xl font-bold text-emerald-400">{activeProjects}</p>
                </div>
              </div>

              <div className="h-8 w-px bg-white/10" />

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800/50">
                  <CreditCard className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Тариф</p>
                  <p className="text-base font-bold text-white">Starter</p>
                </div>
              </div>
            </div>

            {/* Проекты */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  Мои проекты
                </h2>
                {projects.length > 0 && (
                  <span className="text-sm text-slate-500">{projects.length} {projects.length === 1 ? 'проект' : 'проектов'}</span>
                )}
              </div>

              {projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                    />
                  ))}
                </div>
              ) : (
                <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-slate-800/60 to-slate-800/30 text-center backdrop-blur-sm">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
                  <CardContent className="relative py-16">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 shadow-lg shadow-emerald-500/20">
                      <Plus className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white">Создайте первый проект</h3>
                    <p className="text-sm text-slate-400">
                      Начните создавать сайты визуально с помощью WebFlow Studio
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Сайдбар */}
          <aside className="space-y-5">
            {/* Аккаунт */}
            <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-800/50 backdrop-blur-sm">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
              <CardHeader className="relative pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                    <User className="h-4.5 w-4.5 text-emerald-400" />
                  </div>
                  <CardTitle className="text-base font-bold text-white">Аккаунт</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-lg bg-slate-800/30 px-3 py-2.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Email</span>
                  <span className="font-semibold text-white">{user.email}</span>
                </div>
                {user.name && (
                  <div className="flex items-center justify-between rounded-lg bg-slate-800/30 px-3 py-2.5">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Имя</span>
                    <span className="font-semibold text-white">{user.name}</span>
                  </div>
                )}
                <div className="flex items-center justify-between rounded-lg bg-slate-800/30 px-3 py-2.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Регистрация</span>
                  <span className="font-semibold text-white">
                    {user.createdAt.toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Тарифный план */}
            <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 backdrop-blur-sm">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/[0.05] to-transparent" />
              <CardContent className="relative p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20">
                      <CreditCard className="h-4.5 w-4.5 text-emerald-400" />
                    </div>
                    <span className="text-base font-bold text-white">Тарифный план</span>
                  </div>
                  <Badge className="bg-emerald-500 text-white font-bold text-xs px-2.5 py-1 shadow-lg shadow-emerald-500/30">
                    Starter
                  </Badge>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-slate-400">
                  Бесплатный план с базовыми возможностями
                </p>
                <Link href="/#pricing">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-full border-emerald-500/30 bg-emerald-500/5 text-sm font-semibold text-emerald-400 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300"
                  >
                    Посмотреть тарифы
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Полезные ссылки */}
            <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-800/50 backdrop-blur-sm">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
              <CardHeader className="relative pb-4">
                <CardTitle className="text-base font-bold text-white">Ресурсы</CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-1">
                <Link
                  href="#"
                  className="group flex items-center justify-between rounded-xl bg-slate-800/20 px-3.5 py-3 text-sm text-slate-300 transition-all hover:bg-slate-800/40 hover:text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
                      <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <span className="text-xs font-medium">Документация</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  href="#"
                  className="group flex items-center justify-between rounded-xl bg-slate-800/20 px-3.5 py-3 text-sm text-slate-300 transition-all hover:bg-slate-800/40 hover:text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 transition-colors group-hover:bg-purple-500/20">
                      <Palette className="h-3.5 w-3.5 text-purple-400" />
                    </div>
                    <span className="text-xs font-medium">Библиотека компонентов</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  href="#"
                  className="group flex items-center justify-between rounded-xl bg-slate-800/20 px-3.5 py-3 text-sm text-slate-300 transition-all hover:bg-slate-800/40 hover:text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 transition-colors group-hover:bg-cyan-500/20">
                      <FileCode className="h-3.5 w-3.5 text-cyan-400" />
                    </div>
                    <span className="text-xs font-medium">Примеры проектов</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <a
                  href="https://biveki.ru"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-xl bg-slate-800/20 px-3.5 py-3 text-sm text-slate-300 transition-all hover:bg-slate-800/40 hover:text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <span className="text-xs font-medium">О компании Biveki</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <footer className="mt-8 border-t border-white/5 bg-slate-950/50 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>© {new Date().getFullYear()} WebFlow Studio</span>
          </div>
          <div>
            Разработано{" "}
            <a
              href="https://biveki.ru"
              className="text-emerald-400 transition-colors hover:text-emerald-300"
              target="_blank"
              rel="noreferrer"
            >
              Biveki
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
