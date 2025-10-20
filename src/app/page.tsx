import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/(auth)/actions";
import {
  Wand2,
  Workflow,
  Zap,
  Code2,
  Palette,
  Server,
  ArrowRight,
  Check,
  Sparkles,
  Layout,
  Blocks,
  Globe,
  Database,
  GitBranch
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Визуальный редактор",
    description:
      "Создавайте дизайн сайта перетаскиванием блоков. Никакого кода — только ваше видение и креатив.",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Workflow,
    title: "Блок-схемы логики",
    description:
      "Настраивайте поведение сайта через визуальные блок-схемы. Обработка форм, интеграции, условия — всё наглядно.",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Server,
    title: "Подключение API",
    description:
      "Привязывайте готовые REST и GraphQL API. Интеграция с внешними сервисами и облачными базами данных.",
    gradient: "from-emerald-500/20 to-green-500/20",
  },
  {
    icon: Database,
    title: "Работа с данными",
    description:
      "Подключайте облачные базы данных: Firebase, Supabase, PostgreSQL. Настраивайте через визуальный интерфейс.",
    gradient: "from-violet-500/20 to-purple-500/20",
  },
  {
    icon: Code2,
    title: "Экспорт production-кода",
    description:
      "Скачивайте готовый React/Next.js проект. Чистый код с TypeScript, готовый к деплою на любой платформе.",
    gradient: "from-orange-500/20 to-red-500/20",
  },
  {
    icon: Zap,
    title: "Готовые компоненты",
    description:
      "Библиотека из 100+ UI-компонентов и шаблонов. Формы, таблицы, графики, авторизация — всё готово к использованию.",
    gradient: "from-slate-500/20 to-zinc-500/20",
  },
];

const useCases = [
  {
    title: "Лендинги с формами",
    description: "Создавайте посадочные страницы с автоматической обработкой лидов, интеграцией с CRM и email-уведомлениями.",
    icon: Layout,
  },
  {
    title: "Веб-приложения",
    description: "Стройте полноценные SaaS-сервисы с авторизацией, базой данных и сложной бизнес-логикой.",
    icon: Blocks,
  },
  {
    title: "Порталы и каталоги",
    description: "Разворачивайте контент-платформы, каталоги товаров и информационные порталы за считанные дни.",
    icon: Globe,
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Дизайн интерфейса",
    description: "Соберите страницы из готовых блоков или создайте свои. Адаптивность настраивается автоматически.",
    icon: Palette,
  },
  {
    step: "02",
    title: "Настройка логики",
    description: "Нарисуйте блок-схему: что происходит при отправке формы, как обрабатываются данные, куда идут уведомления.",
    icon: GitBranch,
  },
  {
    step: "03",
    title: "Подключение данных",
    description: "Свяжите с вашим API или облачной базой данных. Интегрируйте внешние сервисы через готовые коннекторы.",
    icon: Database,
  },
  {
    step: "04",
    title: "Экспорт и деплой",
    description: "Скачайте готовый проект и разверните на любой платформе: Vercel, Netlify, собственный сервер.",
    icon: Code2,
  },
];

const pricing = [
  {
    name: "Starter",
    price: "Бесплатно",
    description: "Для личных проектов и экспериментов",
    features: [
      "1 проект",
      "Базовые блоки и компоненты",
      "Экспорт кода проекта",
      "Подключение облачных БД",
      "Базовые интеграции",
    ],
  },
  {
    name: "Pro",
    price: "1 990 ₽",
    period: "/мес",
    description: "Для профессиональных сайтов",
    features: [
      "5 проектов",
      "Все блоки и шаблоны",
      "Продвинутые блок-схемы",
      "Все интеграции (API, БД)",
      "Экспорт с TypeScript",
      "Приоритетная поддержка",
    ],
    popular: true,
  },
  {
    name: "Team",
    price: "4 990 ₽",
    period: "/мес",
    description: "Для команд и агентств",
    features: [
      "Безлимитные проекты",
      "Всё из Pro",
      "Совместная работа",
      "Кастомные компоненты",
      "API для автоматизации",
      "Выделенная поддержка",
      "SLA 99.9%",
    ],
  },
];

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
              <span className="text-base sm:text-xl font-bold text-white whitespace-nowrap">WebFlow Studio</span>
              <Badge variant="outline" className="hidden xs:inline-flex border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs px-1.5 py-0.5">
                Beta
              </Badge>
            </div>
            <div className="hidden h-6 w-px bg-white/10 sm:block" />
            <a
              href="https://biveki.ru"
              target="_blank"
              rel="noreferrer"
              className="hidden text-xs sm:text-sm text-slate-400 transition-colors hover:text-slate-300 sm:block"
            >
              by <span className="font-medium text-slate-300">Biveki</span>
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
              <Link className="transition-colors hover:text-white" href="#features">
                Возможности
              </Link>
              <Link className="transition-colors hover:text-white" href="#how-it-works">
                Как работает
              </Link>
              <Link className="transition-colors hover:text-white" href="#pricing">
                Тарифы
              </Link>
            </div>

            <div className="hidden sm:block h-6 w-px bg-white/10" />

            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm">
                    <span className="hidden sm:inline">Панель управления</span>
                    <span className="sm:hidden">Панель</span>
                  </Button>
                </Link>
                <form action={logoutAction} className="hidden sm:block">
                  <Button type="submit" variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                    Выйти
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                    Войти
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                    <span className="hidden sm:inline">Начать бесплатно</span>
                    <span className="sm:hidden">Начать</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="relative">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="outline" className="mb-6 sm:mb-8 border-emerald-500/40 bg-emerald-500/10 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm text-emerald-300">
              <Wand2 className="mr-1.5 sm:mr-2 inline h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden xs:inline">Визуальная разработка нового поколения</span>
              <span className="xs:hidden">Визуальная разработка</span>
            </Badge>

            <h1 className="mb-6 sm:mb-8 bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-transparent">
              Создавайте функциональные сайты
              <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text">без написания кода</span>
            </h1>

            <p className="mb-8 sm:mb-12 text-base sm:text-xl lg:text-2xl leading-relaxed text-slate-300 px-4 sm:px-0">
              Визуальный редактор для дизайна + блок-схемы для логики.
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              Привязывайте бэкенд или используйте встроенную базу данных.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row w-full sm:w-auto px-4 sm:px-0">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="h-11 sm:h-12 w-full sm:w-auto bg-emerald-500 px-6 sm:px-8 text-sm sm:text-base hover:bg-emerald-400">
                  Начать бесплатно
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-11 sm:h-12 w-full sm:w-auto border-slate-700 px-6 sm:px-8 text-sm sm:text-base hover:bg-slate-800">
                  Как это работает
                </Button>
              </Link>
            </div>

            <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-400 px-4">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                Готов за 5 минут
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                Бесплатный план навсегда
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                Экспорт чистого кода
              </div>
            </div>
          </div>

          <div className="relative mx-auto mt-24 max-w-5xl">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-sm">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 rounded-lg bg-slate-800/50 px-4 py-2 text-sm text-slate-400">
                    webflowstudio.ru/editor
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-6">
                    <Palette className="mb-4 h-10 w-10 text-emerald-400" />
                    <h3 className="mb-2 font-semibold text-white">Визуальный редактор</h3>
                    <p className="text-sm text-slate-400">Drag & drop интерфейс для создания дизайна</p>
                  </div>
                  <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6">
                    <Workflow className="mb-4 h-10 w-10 text-cyan-400" />
                    <h3 className="mb-2 font-semibold text-white">Блок-схемы логики</h3>
                    <p className="text-sm text-slate-400">Настройка поведения без программирования</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-white/5 bg-slate-900/50 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="mb-4 border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
                Возможности
              </Badge>
              <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
                Всё для создания современных веб-приложений
              </h2>
              <p className="text-lg text-slate-400">
                Объединили лучшее от конструкторов сайтов и платформ автоматизации
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="group relative overflow-hidden border-white/10 bg-slate-900/50 backdrop-blur-sm transition-all hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
                    <CardHeader className="relative">
                      <div className="mb-4 inline-flex rounded-xl bg-slate-800/50 p-3">
                        <Icon className="h-6 w-6 text-emerald-400" />
                      </div>
                      <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="mb-4 border-cyan-500/40 bg-cyan-500/10 text-cyan-300">
                Как это работает
              </Badge>
              <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
                От идеи до запуска за 4 простых шага
              </h2>
              <p className="text-lg text-slate-400">
                Никаких сложных настроек — всё интуитивно и наглядно
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-4xl space-y-12">
              {howItWorks.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="relative flex gap-8">
                    {index !== howItWorks.length - 1 && (
                      <div className="absolute left-8 top-20 h-full w-px bg-gradient-to-b from-emerald-500/50 to-transparent" />
                    )}
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm">
                      <Icon className="h-7 w-7 text-emerald-400" />
                      <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-slate-950">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1 pb-12">
                      <h3 className="mb-3 text-2xl font-bold text-white">{item.title}</h3>
                      <p className="text-lg leading-relaxed text-slate-400">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-slate-900/50 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="mb-4 border-purple-500/40 bg-purple-500/10 text-purple-300">
                Примеры использования
              </Badge>
              <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
                Что можно создать
              </h2>
              <p className="text-lg text-slate-400">
                От простых лендингов до сложных веб-приложений
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
              {useCases.map((useCase) => {
                const Icon = useCase.icon;
                return (
                  <Card
                    key={useCase.title}
                    className="border-white/10 bg-slate-900/50 backdrop-blur-sm transition-all hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10"
                  >
                    <CardHeader>
                      <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4">
                        <Icon className="h-8 w-8 text-purple-400" />
                      </div>
                      <CardTitle className="text-xl text-white">{useCase.title}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {useCase.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="mb-4 border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
                Тарифы
              </Badge>
              <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
                Начните бесплатно, растите вместе с нами
              </h2>
              <p className="text-lg text-slate-400">
                Выберите план, который подходит именно вам
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-3">
              {pricing.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative border-white/10 bg-slate-900/50 backdrop-blur-sm ${
                    plan.popular
                      ? "ring-2 ring-emerald-500/50 shadow-2xl shadow-emerald-500/20"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <Badge className="bg-emerald-500 text-slate-950 font-semibold shadow-lg">
                        Популярный
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-white">{plan.price}</span>
                      {plan.period && <span className="text-slate-400">{plan.period}</span>}
                    </div>
                    <CardDescription className="mt-2 text-slate-400">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/register">
                      <Button
                        className={`mb-8 w-full ${
                          plan.popular
                            ? "bg-emerald-500 hover:bg-emerald-400"
                            : "bg-slate-800 hover:bg-slate-700"
                        }`}
                      >
                        Начать
                      </Button>
                    </Link>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-slate-300">
                          <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-gradient-to-br from-emerald-500/10 via-slate-900/50 to-cyan-500/10 py-24">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
              Готовы создать свой первый проект?
            </h2>
            <p className="mb-10 text-xl text-slate-300">
              Присоединяйтесь к тысячам создателей, которые уже строят будущее без кода
            </p>
            <form className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <Label htmlFor="email" className="sr-only">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ваш@email.com"
                  className="h-12 border-white/20 bg-slate-900/50 text-white placeholder:text-slate-500"
                  required
                />
              </div>
              <Link href="/register" className="shrink-0">
                <Button type="button" size="lg" className="h-12 w-full bg-emerald-500 px-8 hover:bg-emerald-400 sm:w-auto">
                  Начать бесплатно
                </Button>
              </Link>
            </form>
            <p className="mt-6 text-sm text-slate-500">
              Бесплатный план — навсегда бесплатно
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-slate-950/50 py-12 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                <span className="font-bold text-white">WebFlow Studio</span>
              </div>
              <p className="text-sm text-slate-400">
                Визуальная платформа для создания функциональных веб-приложений без кода
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-white">Продукт</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="#features" className="transition-colors hover:text-white">
                    Возможности
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="transition-colors hover:text-white">
                    Как работает
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="transition-colors hover:text-white">
                    Тарифы
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="transition-colors hover:text-white">
                    Начать бесплатно
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-white">Поддержка</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Документация
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Связаться с нами
                  </Link>
                </li>
                <li>
                  <a
                    href="https://biveki.ru"
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-white"
                  >
                    О компании Biveki
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-white">Юридическое</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/privacy" className="transition-colors hover:text-white">
                    Политика конфиденциальности
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="transition-colors hover:text-white">
                    Условия использования
                  </Link>
                </li>
                <li>
                  <Link href="/offer" className="transition-colors hover:text-white">
                    Договор оферты
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-white/5 pt-8 text-center text-sm text-slate-500">
            <p>
              © {new Date().getFullYear()} WebFlow Studio. Разработано{" "}
              <a
                href="https://biveki.ru"
                className="text-emerald-400 transition-colors hover:text-emerald-300"
                target="_blank"
                rel="noreferrer"
              >
                Biveki
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
