"use client";

import { Monitor, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DesktopOnlyWrapper({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Детект мобильного устройства
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice = mobileRegex.test(userAgent);
      const isSmallScreen = window.innerWidth < 1024; // < lg breakpoint

      return isMobileDevice || isSmallScreen;
    };

    setIsMobile(checkIfMobile());
    setIsLoading(false);

    // Слушаем resize для обновления
    const handleResize = () => {
      setIsMobile(checkIfMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    // Показываем пустой экран пока проверяем
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />

        <Card className="relative w-full max-w-md border-white/10 bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20">
              <Monitor className="h-10 w-10 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-2xl text-white">
                Требуется компьютер
              </CardTitle>
              <CardDescription className="mt-2 text-base text-slate-400">
                WebFlow Studio работает только на десктопных устройствах
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-slate-800/40 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2">
                  <Smartphone className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="font-semibold text-white">Почему только десктоп?</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                Визуальный редактор требует большой экран и точное управление мышью для комфортной работы с блоками, drag & drop и настройкой интерфейса.
              </p>
            </div>

            <div className="space-y-2 rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-4">
              <h4 className="font-semibold text-white">Рекомендуемые требования:</h4>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-emerald-400">•</span>
                  <span>Экран с разрешением от 1280x720</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-emerald-400">•</span>
                  <span>Современный браузер (Chrome, Firefox, Safari, Edge)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-emerald-400">•</span>
                  <span>Клавиатура и мышь</span>
                </li>
              </ul>
            </div>

            <p className="text-center text-sm text-slate-500">
              Откройте WebFlow Studio на компьютере для полного доступа ко всем возможностям
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
