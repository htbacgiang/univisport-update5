import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "./utils";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#105d97] focus:ring-2 focus:ring-[#105d97]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";
