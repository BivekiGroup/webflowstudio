import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Accordion } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/(auth)/actions";
import { Database, GitMerge, Layers, Rocket, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const features = [
  {
    title: "Компонентные блоки",
    description:
      "Перетаскивайте авторизацию, панели, таблицы данных и готовые лендинги. WebFlow Studio сам простроит структуру.",
    metric: "140+ готовых компонентов",
  },
  {
    title: "Продакшн-код без доработок",
    description:
      "Экспортируйте аккуратные React и shadcn/ui компоненты или синхронизируйте проект с GitHub за один клик.",
    metric: "0 лишних зависимостей",
  },
  {
    title: "Совместная работа",
    description:
      "Комментируйте логику, закрепляйте блоки и утверждайте hand-off в одном окне вместе с командой.",
    metric: "История версий и комментарии",
  },
];

const workflow = [
  {
    stage: "Соберите",
    title: "Схематизируйте сценарии drag-and-drop",
    description:
      "Используйте быстрые горячие клавиши, умное выравнивание и адаптивные брейкпоинты, которые подстраиваются автоматически.",
  },
  {
    stage: "Соедините",
    title: "Подключите данные за пару минут",
    description:
      "Привяжите REST или GraphQL, настройте моковые состояния и авторизацию не покидая холст.",
  },
  {
    stage: "Запустите",
    title: "Сгенерируйте код, который примут в ревью",
    description:
      "Посмотрите готовые хуки, серверные экшены и токены Tailwind перед экспортом.",
  },
];

type HeroHighlight = {
  label: string;
  value: string;
  description: string;
};

type HeroStage = {
  slot: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  tasks: string[];
};

type HeroLogItem = {
  label: string;
  detail: string;
  icon: LucideIcon;
};

const heroHighlights: HeroHighlight[] = [
  {
    label: "Time-to-ship",
    value: "72 ч",
    description: "От брифа до production-ветки без ручной верстки.",
  },
  {
    label: "Команды",
    value: "12",
    description: "Пилотных продуктовых групп уже мигрировали в Studio.",
  },
  {
    label: "UI-токены",
    value: "180+",
    description: "Готовых паттернов и пресетов с типизацией.",
  },
];

const heroStages: HeroStage[] = [
  {
    slot: "09:30",
    title: "Brief sync",
    summary: "Продакт скидывает сценарий и макет. Studio разбивает фичу на секции и связывает с задачами.",
    icon: Layers,
    tasks: [
      "Импорт схемы из Figma и Notion",
      "Автонастройка брейкпоинтов",
    ],
  },
  {
    slot: "13:10",
    title: "Data wiring",
    summary: "Привязываем REST/GraphQL, генерируем типы и моковые состояния для демо.",
    icon: Database,
    tasks: [
      "Заполнены state-пресеты",
      "Прописаны guards и auth",
    ],
  },
  {
    slot: "18:40",
    title: "Code ready",
    summary: "Pull request собирается автоматически: описания, проверка тестов и предпросмотр в Vercel.",
    icon: GitMerge,
    tasks: [
      "CI зелёный",
      "Линтер и визуальные тесты пройдены",
    ],
  },
];

const heroLog: HeroLogItem[] = [
  {
    label: "Design",
    detail: "Передал обновленный UI-kit, токены применены ко всем блокам.",
    icon: Sparkles,
  },
  {
    label: "Backend",
    detail: "Подтвердил схемы GraphQL, загружены моковые ответы для QA.",
    icon: Database,
  },
  {
    label: "Release",
    detail: "PR #412 отправлен, предпросмотр в Vercel доступен для продукта.",
    icon: Rocket,
  },
];

const faqs = [
  {
    id: "pricing",
    title: "Сколько стоит WebFlow Studio?",
    content:
      "На период закрытой беты доступ бесплатный. После релиза появится тариф для команд и свободный план для соло-разработчиков.",
  },
  {
    id: "code",
    title: "Как выглядит сгенерированный код?",
    content:
      "Мы экспортируем чистые React-компоненты с Tailwind и shadcn/ui. Структура повторяет библиотеку вашего дизайна и поддерживает TypeScript.",
  },
  {
    id: "collaboration",
    title: "Можно ли работать всей командой?",
    content:
      "Конечно. Добавляйте дизайнеров, продуктов и QA, чтобы оставлять комментарии, фиксировать секции и утверждать ревью.",
  },
  {
    id: "data",
    title: "Поддерживается ли подключение к реальным данным?",
    content:
      "Подключайте REST, GraphQL или используйте встроенные моковые данные. Для популярных CRM подготовлены пресеты.",
  },
];

export default async function Home() {
  const user = await getCurrentUser();

  const linkButtonBase =
    "inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-60 h-11 px-5 py-2 text-sm font-medium";
  const outlineLinkButton = cn(
    linkButtonBase,
    "border border-slate-700 text-slate-200 hover:bg-slate-800",
  );
  const primaryLinkButton = cn(
    linkButtonBase,
    "bg-emerald-500 text-white hover:bg-emerald-400 shadow-sm shadow-emerald-500/30",
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.08),_transparent_50%)]" />

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-24 px-6 pb-24 pt-16 sm:pt-20 lg:px-12">
        <header className="flex flex-col gap-6">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-white">WebFlow Studio</span>
              <Badge variant="default">Закрытая бета</Badge>
            </div>
            <div className="flex flex-col items-start gap-3 text-sm text-slate-400 sm:items-end">
              <div className="flex flex-wrap items-center gap-3">
                <span>
                  Создано компанией {" "}
                  <a
                    href="https://biveki.ru"
                    className="text-slate-200 underline decoration-emerald-500/40 underline-offset-4 hover:text-emerald-300"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Biveki
                  </a>
                </span>
                <Separator className="hidden h-6 w-px sm:block" />
                <Link className="hover:text-slate-100" href="#workflow">
                  Документация
                </Link>
                <Separator className="hidden h-6 w-px sm:block" />
                <Link className="hover:text-slate-100" href="#faq">
                  Вопросы
                </Link>
              </div>
              {user ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="hidden text-slate-400 sm:inline">
                    Вы вошли как {user.name ?? user.email}
                  </span>
                  <Link href="/dashboard" className={outlineLinkButton}>
                    Панель
                  </Link>
                  <form action={logoutAction}>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="text-slate-200 hover:text-white"
                    >
                      Выйти
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <Link href="/login" className={outlineLinkButton}>
                    Войти
                  </Link>
                  <Link href="/register" className={primaryLinkButton}>
                    Регистрация
                  </Link>
                </div>
              )}
            </div>
          </div>

          <section className="relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-10">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-200">
                  WebFlow Studio 2.0
                </Badge>
                <span className="rounded-full border border-emerald-500/30 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-200/80">
                  Mission control
                </span>
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[56px]">
                  Нарисовали продукт — значит, он почти в проде.
                </h1>
                <p className="text-lg text-slate-300">
                  WebFlow Studio превращает бриф, макет и API в живой сервис с готовым кодом. Продуктовые команды запускают фичи без ожидания фронт-команды и ручной сборки интерфейсов.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg">Запросить пилот</Button>
                <Button variant="ghost" size="lg" className="text-slate-200 hover:text-white">
                  Live-тур по продукту
                </Button>
              </div>
              <div className="grid gap-4 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-2xl">
                {heroHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-5"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">
                      {item.label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-white">{item.value}</p>
                    <p className="mt-1 text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span className="font-medium text-slate-200">Уже в пилоте:</span>
                <span>Shiftly</span>
                <span>NimbusPay</span>
                <span>RevoOps</span>
              </div>
            </div>

            <Card className="relative overflow-hidden border-emerald-500/25 bg-slate-950/85 p-8 shadow-2xl shadow-emerald-500/20">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_58%)]" />
              <div className="pointer-events-none absolute -bottom-20 right-0 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" />
              <CardHeader className="relative space-y-2">
                <div className="flex items-center gap-2 text-emerald-200">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200/80">
                    Control room
                  </span>
                </div>
                <CardTitle className="text-2xl font-semibold text-white">Сборка фичи за день</CardTitle>
                <CardDescription className="text-sm text-slate-300">
                  Последний пилот: из брифа до влитого pull request — один рабочий день. Команда видит весь прогресс синхронно.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <div className="space-y-4">
                  {heroStages.map((stage) => {
                    const Icon = stage.icon;

                    return (
                      <div
                        key={stage.slot}
                        className="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-200/70">
                              {stage.slot}
                            </p>
                            <p className="text-sm font-medium text-white">{stage.title}</p>
                            <p className="text-xs text-slate-300">{stage.summary}</p>
                          </div>
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>
                        <ul className="mt-3 space-y-1 text-xs text-slate-400">
                          {stage.tasks.map((task) => (
                            <li key={task} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
                <Separator className="border-emerald-500/20" />
                <div className="space-y-3 text-xs text-slate-300">
                  {heroLog.map((entry) => {
                    const Icon = entry.icon;

                    return (
                      <div
                        key={entry.label}
                        className="flex items-start justify-between gap-4 rounded-2xl border border-slate-800/70 bg-slate-950/70 p-3"
                      >
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200/70">
                            {entry.label}
                          </p>
                          <p className="mt-1 text-slate-300">{entry.detail}</p>
                        </div>
                        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-200">
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="relative flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-slate-950/70 px-4 py-3 text-xs text-slate-300">
                <span className="font-medium text-slate-200">Nightly build</span>
                <span className="text-emerald-300">Автодеплой завершится через 12 мин</span>
              </CardFooter>
            </Card>
          </section>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-slate-800/60 bg-slate-950/70">
              <CardHeader>
                <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                <CardDescription className="text-slate-300">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="text-sm text-emerald-300">
                {feature.metric}
              </CardFooter>
            </Card>
          ))}
        </section>

        <section
          id="workflow"
          className="grid gap-8 rounded-3xl border border-emerald-500/30 bg-slate-950/80 p-10 shadow-emerald-500/10 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="space-y-6">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-200">
              Воркфлоу
            </Badge>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Один поток от прототипа до pull request.
            </h2>
            <p className="text-slate-300">
              WebFlow Studio поддерживает непрерывную цепочку: визуальное проектирование → настройка данных → экспорт кода. На каждой стадии сохраняется контекст и комментарии команды.
            </p>
          </div>
          <div className="grid gap-4">
            {workflow.map((step) => (
              <Card key={step.stage} className="border-slate-800/60 bg-slate-950/60">
                <CardContent className="gap-3">
                  <Badge variant="soft" className="w-fit text-slate-500">
                    {step.stage}
                  </Badge>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="text-sm text-slate-300">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="integrations" className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-200">
              Интеграции
            </Badge>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Любимые сервисы уже внутри.
            </h2>
            <p className="text-slate-300">
              Подключайте GitHub, Vercel, Linear, Slack и другие инструменты. WebFlow Studio формирует ветки, комментирует задачи и готовит демо-ссылки для ревью.
            </p>
            <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800/50 bg-slate-950/60 px-5 py-4">
                <p className="font-medium text-white">GitHub Actions</p>
                <p className="mt-1 text-slate-400">Готовые CI-сценарии для React, Next.js и Remix</p>
              </div>
              <div className="rounded-2xl border border-slate-800/50 bg-slate-950/60 px-5 py-4">
                <p className="font-medium text-white">Дизайн-токены</p>
                <p className="mt-1 text-slate-400">Импорт переменных и стилей из Figma</p>
              </div>
              <div className="rounded-2xl border border-slate-800/50 bg-slate-950/60 px-5 py-4">
                <p className="font-medium text-white">Уведомления в Slack</p>
                <p className="mt-1 text-slate-400">Апдейты о прогрессе и комментариях в каналах</p>
              </div>
              <div className="rounded-2xl border border-slate-800/50 bg-slate-950/60 px-5 py-4">
                <p className="font-medium text-white">Storybook</p>
                <p className="mt-1 text-slate-400">Экспорт примеров прямо в каталог</p>
              </div>
            </div>
          </div>
          <Card className="border-emerald-500/30 bg-slate-950/80 p-8">
            <CardHeader>
              <CardTitle className="text-xl text-white">Автогенерация pull request</CardTitle>
              <CardDescription className="text-slate-300">
                WebFlow Studio собирает PR, проверяет линтеры и готовит описание релиза.
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-4 text-sm">
              <div className="space-y-2 rounded-2xl border border-emerald-500/20 bg-slate-900/70 p-4">
                <p className="font-mono text-emerald-200">feat: launch analytics hub</p>
                <p className="text-slate-300">
                  - добавлен onboarding flow
                  <br />- подключен GraphQL endpoint
                  <br />- созданы тестовые данные для QA
                </p>
              </div>
              <p className="text-slate-400">
                После мерджа WebFlow Studio обновит дизайн-токены, синхронизирует Storybook и отправит уведомления команде.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="border-emerald-500/40 text-white hover:text-emerald-200">
                Посмотреть процесс
              </Button>
            </CardFooter>
          </Card>
        </section>

        <section
          id="faq"
          className="grid gap-8 rounded-3xl border border-slate-800/60 bg-slate-950/80 p-10 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="space-y-6">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-200">
              Вопросы
            </Badge>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Частые вопросы команд.
            </h2>
            <p className="text-slate-300">
              Не нашли ответ? Напишите нам — поможем подключить команду и настроить пайплайн.
            </p>
          </div>
          <Accordion items={faqs} defaultOpenId="pricing" className="max-w-2xl" />
        </section>

        <section className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 via-slate-950 to-slate-950 p-10 text-white">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4 max-w-xl">
              <h2 className="text-3xl font-semibold sm:text-4xl">
                Присоединяйтесь к закрытой бете WebFlow Studio.
              </h2>
              <p className="text-slate-200">
                Получите ранний доступ к новому уровню визуальной разработки и сэкономьте недели на hand-off.
              </p>
            </div>
            <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <div className="w-full">
                <Label htmlFor="email" className="sr-only">
                  Email
                </Label>
                <Input id="email" placeholder="komanda@biveki.ru" type="email" required />
              </div>
              <Button type="submit" className="whitespace-nowrap">
                Получить инвайт
              </Button>
            </form>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-slate-900/60 bg-slate-950/80 py-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-12">
          <span>
            © {new Date().getFullYear()} WebFlow Studio. Разработка веб-приложений {" "}
            <a
              href="https://biveki.ru"
              className="text-slate-300 underline decoration-emerald-500/40 underline-offset-4 hover:text-emerald-200"
              target="_blank"
              rel="noreferrer"
            >
              Biveki
            </a>
            .
          </span>
          <div className="flex items-center gap-4">
            <span>Политика конфиденциальности</span>
            <span>Условия использования</span>
            <span>Статус сервиса</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
