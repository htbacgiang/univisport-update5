import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "./utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#105d97] focus:ring-2 focus:ring-[#105d97]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
