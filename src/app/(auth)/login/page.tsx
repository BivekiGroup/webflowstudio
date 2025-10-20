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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.12),_transparent_60%)]" />

      <Link
        href="/"
        className="absolute left-6 top-6 z-10 flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        На главную
      </Link>

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="space-y-4 text-center">
          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-200">
            WebFlow Studio
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Войдите в аккаунт
          </h1>
          <p className="text-base text-slate-400">
            Продолжайте управлять проектами и публиковать фичи
          </p>
        </div>

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

        <div className="space-y-4 text-center">
          <p className="text-sm text-slate-400">
            Нет аккаунта?{" "}
            <Link className="font-medium text-emerald-400 transition-colors hover:text-emerald-300" href="/register">
              Создайте команду
            </Link>
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
            <Link href="#" className="transition-colors hover:text-slate-300">
              Забыли пароль?
            </Link>
            <span>•</span>
            <Link href="#" className="transition-colors hover:text-slate-300">
              Поддержка
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
