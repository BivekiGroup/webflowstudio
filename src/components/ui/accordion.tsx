"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
}

export function Accordion({ items, defaultOpenId, className }: AccordionProps) {
  const [openId, setOpenId] = React.useState<string | null>(defaultOpenId ?? null);

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950/70"
          >
            <button
              className="flex w-full items-center justify-between gap-4 text-left"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              type="button"
            >
              <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {item.title}
              </span>
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-sm font-semibold text-slate-500 transition-transform dark:border-slate-700",
                  isOpen ? "bg-emerald-500/10 text-emerald-600" : "bg-white",
                )}
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen ? (
              <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                {item.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
