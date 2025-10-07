import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "../actions";
import { defaultAuthState } from "../auth-state";
import { AuthForm, AuthFormField } from "../components/auth-form";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Войти в WebFlow Studio",
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.12),_transparent_60%)]" />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-20 lg:flex-row lg:items-center lg:gap-24">
        <div className="flex-1 space-y-8 text-left">
          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-200">
            WebFlow Studio · Sign in
          </Badge>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Синхронизируйтесь с командой и продолжайте сборку.
            </h1>
            <p className="max-w-xl text-lg text-slate-300">
              Авторизуйтесь, чтобы управлять проектами, подключать данные и публиковать фичи напрямую в WebFlow Studio.
            </p>
          </div>
          <div className="grid gap-3 rounded-3xl border border-slate-800/60 bg-slate-950/70 p-6 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span>Доступ к Canvas и совместным сессиям команды в реальном времени.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
              <span>Синхронизация с GitHub, Vercel и Storybook без выходов из Studio.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span>Все обсуждения, ревью и статусы задач остаются в рамках одного рабочего пространства.</span>
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-md flex-col gap-6">
          <AuthForm action={loginAction} initialState={defaultAuthState} submitLabel="Войти в аккаунт">
            <AuthFormField
              label="Email"
              name="email"
              type="email"
              placeholder="team@company.ru"
              autoComplete="email"
              required
            />
            <AuthFormField
              label="Пароль"
              name="password"
              type="password"
              placeholder="Введите пароль"
              autoComplete="current-password"
              required
            />
          </AuthForm>
          <p className="text-center text-sm text-slate-400">
            Нет аккаунта?{" "}
            <Link className="text-emerald-300 hover:text-emerald-200" href="/register">
              Создайте команду
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
