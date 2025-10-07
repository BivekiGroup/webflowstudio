import Link from "next/link";
import { redirect } from "next/navigation";
import { registerAction } from "../actions";
import { defaultAuthState } from "../auth-state";
import { AuthForm, AuthFormField } from "../components/auth-form";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Регистрация в WebFlow Studio",
};

export default async function RegisterPage() {
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
            WebFlow Studio · Create account
          </Badge>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Соберите команду и выпускайте продукты быстрее.
            </h1>
            <p className="max-w-xl text-lg text-slate-300">
              Создайте рабочее пространство WebFlow Studio, чтобы объединить дизайн, данные и код в одной среде.
            </p>
          </div>
          <div className="grid gap-3 rounded-3xl border border-slate-800/60 bg-slate-950/70 p-6 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span>Добавляйте дизайнеров, продактов и разработчиков с гибкими правами доступа.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
              <span>Подключайте REST, GraphQL и моковые источники без переключения из Studio.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span>Готовьте релизы: Studio собирает pull request, описания и предпросмотр автоматически.</span>
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-md flex-col gap-6">
          <AuthForm action={registerAction} initialState={defaultAuthState} submitLabel="Создать аккаунт">
            <AuthFormField
              label="Имя или название команды"
              name="name"
              placeholder="Команда Atlas"
              autoComplete="name"
            />
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
              placeholder="Минимум 8 символов"
              autoComplete="new-password"
              required
            />
            <AuthFormField
              label="Подтвердите пароль"
              name="confirmPassword"
              type="password"
              placeholder="Повторите пароль"
              autoComplete="new-password"
              required
            />
          </AuthForm>
          <p className="text-center text-sm text-slate-400">
            Уже есть аккаунт?{" "}
            <Link className="text-emerald-300 hover:text-emerald-200" href="/login">
              Войдите
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
