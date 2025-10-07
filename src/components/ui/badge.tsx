import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "outline" | "soft";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  outline:
    "border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-100",
  soft: "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
