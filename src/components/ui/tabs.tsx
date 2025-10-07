"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

type TabsProps = React.HTMLAttributes<HTMLDivElement> & {
  defaultValue: string;
};

type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

type TabsTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

type TabsContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
};

export function Tabs({ defaultValue, className, children, ...props }: TabsProps) {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: TabsListProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 p-1 text-sm font-medium shadow-inner shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/70",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, value, children, ...props }: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within Tabs");
  }

  const isActive = context.value === value;

  return (
    <button
      onClick={() => context.setValue(value)}
      className={cn(
        "flex-1 rounded-full px-4 py-2 transition-all",
        isActive
          ? "bg-emerald-500 text-white shadow shadow-emerald-500/30"
          : "text-slate-500 hover:text-slate-900",
        className,
      )}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ className, value, children, ...props }: TabsContentProps) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within Tabs");
  }

  if (context.value !== value) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-slate-50 p-6 shadow-sm dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
