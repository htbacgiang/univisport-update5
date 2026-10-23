import { HTMLAttributes } from "react";
import { cn } from "./utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "secondary";

const variants: Record<BadgeVariant, string> = {
  default: "bg-[#105d97]/10 text-[#105d97] dark:bg-blue-400/10 dark:text-blue-300",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  danger: "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300",
  secondary: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold", variants[variant], className)}
      {...props}
    />
  );
}
