import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Панель управления — WebFlow Studio",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.12),_transparent_60%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-20">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold text-white">Привет, {user.name ?? user.email}</h1>
            <p className="text-slate-400">
              Здесь появятся проекты, коннекторы данных и отчеты по команде. Пока вы только начали — добро пожаловать!
            </p>
        </div>
        <form action={logoutAction}>
          <Button type="submit" variant="outline" className="border-emerald-500/40 text-slate-100 hover:text-white">
            Выйти
          </Button>
        </form>
        </section>

        <Card className="border-emerald-500/20 bg-slate-950/75 shadow-[0_35px_120px_-60px_rgba(16,185,129,0.9)]">
          <CardHeader>
            <CardTitle className="text-white">Следующие шаги</CardTitle>
            <CardDescription className="text-slate-400">
              Чтобы развернуть первую сборку, подключите репозиторий и настройте источники данных.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-300">
          <div className="flex flex-col gap-2 rounded-2xl border border-slate-800/60 bg-slate-950/60 p-4">
            <span className="font-medium text-white">1. Подключите GitHub</span>
            <span>Откройте доступ к репозиторию, чтобы Studio собирала pull request автоматически.</span>
            <Link href="#" className="text-emerald-300 hover:text-emerald-200">Настроить интеграцию</Link>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl border border-slate-800/60 bg-slate-950/60 p-4">
            <span className="font-medium text-white">2. Добавьте участников</span>
            <span>Пригласите дизайнеров, бекенд и QA. Все комментарии и истории сохранятся в Studio.</span>
            <Link href="#" className="text-emerald-300 hover:text-emerald-200">Отправить инвайты</Link>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl border border-slate-800/60 bg-slate-950/60 p-4">
            <span className="font-medium text-white">3. Заполните дизайн-токены</span>
            <span>Импортируйте переменные, чтобы генерировать интерфейс в точности как в макетах.</span>
            <Link href="#" className="text-emerald-300 hover:text-emerald-200">Загрузить токены</Link>
          </div>
        </CardContent>
        </Card>

        <Separator className="border-slate-800/70" />

        <section className="grid gap-6 md:grid-cols-2">
          <Card className="border-slate-800/60 bg-slate-950/75">
            <CardHeader>
              <CardTitle className="text-white">Аккаунт</CardTitle>
              <CardDescription className="text-slate-400">
                Данные пользователя и активные сессии.
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Email</span>
              <span className="text-white">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Имя</span>
              <span className="text-white">{user.name ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Создан</span>
              <span className="text-white">{user.createdAt.toLocaleDateString("ru-RU")}</span>
            </div>
          </CardContent>
          </Card>
          <Card className="border-slate-800/60 bg-slate-950/75">
            <CardHeader>
              <CardTitle className="text-white">Правила доступа</CardTitle>
              <CardDescription className="text-slate-400">
                Скоро появится разграничение по ролям и интеграции SSO.
              </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-300">
            <p>
              Сейчас учетные записи работают по email и паролю. Мы готовим поддержку командных ролей, SSO и входа по
              корпоративным доменам.
            </p>
          </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
