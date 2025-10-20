import Link from "next/link";
import { redirect } from "next/navigation";
import { registerAction } from "../actions";
import { defaultAuthState } from "../auth-state";
import { AuthForm, AuthFormField } from "../components/auth-form";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth";
import { DesktopOnlyWrapper } from "@/components/desktop-only-wrapper";

export const metadata = {
  title: "Регистрация в WebFlow Studio",
};

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <DesktopOnlyWrapper>
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
            Создайте аккаунт
          </h1>
          <p className="text-base text-slate-400">
            Объедините команду и запускайте продукты быстрее
          </p>
        </div>

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

        <div className="space-y-4 text-center">
          <p className="text-sm text-slate-400">
            Уже есть аккаунт?{" "}
            <Link className="font-medium text-emerald-400 transition-colors hover:text-emerald-300" href="/login">
              Войдите
            </Link>
          </p>
          <p className="text-xs text-slate-500">
            Создавая аккаунт, вы соглашаетесь с{" "}
            <Link href="/terms" className="underline transition-colors hover:text-slate-300">
              условиями использования
            </Link>{" "}
            и{" "}
            <Link href="/privacy" className="underline transition-colors hover:text-slate-300">
              политикой конфиденциальности
            </Link>
          </p>
        </div>
      </div>
    </main>
    </DesktopOnlyWrapper>
  );
}
