import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LegalLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
            <span className="text-base sm:text-xl font-bold text-white">WebFlow Studio</span>
            <Badge variant="outline" className="hidden xs:inline-flex border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs px-1.5 py-0.5">
              Beta
            </Badge>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">На главную</span>
          </Link>
        </div>
      </nav>

      <main className="relative mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 lg:px-8">
        <div className="mb-8 sm:mb-12">
          <h1 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">{title}</h1>
          <p className="text-sm sm:text-base text-slate-400">
            Последнее обновление: {new Date().toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="prose prose-invert prose-slate max-w-none">
          <div className="space-y-6 text-slate-300 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_p]:leading-relaxed [&_ul]:space-y-2 [&_ul]:pl-6 [&_li]:leading-relaxed [&_strong]:text-white [&_a]:text-emerald-400 [&_a]:underline [&_a:hover]:text-emerald-300">
            {children}
          </div>
        </div>

        <div className="mt-12 sm:mt-16 border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-800/40 p-4 sm:p-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-white">Есть вопросы?</h3>
              <p className="text-sm text-slate-400">
                Свяжитесь с нами для получения дополнительной информации
              </p>
            </div>
            <a
              href="mailto:support@webflowstudio.ru"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              Написать нам
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 bg-slate-950/50 py-8 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>© {new Date().getFullYear()} WebFlow Studio</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/privacy" className="transition-colors hover:text-slate-300">
                Политика конфиденциальности
              </Link>
              <span className="hidden sm:inline">•</span>
              <Link href="/terms" className="transition-colors hover:text-slate-300">
                Условия использования
              </Link>
              <span className="hidden sm:inline">•</span>
              <Link href="/offer" className="transition-colors hover:text-slate-300">
                Договор оферты
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
