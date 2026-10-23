import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface SeoMetricCardProps {
  title: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
}

export function SeoMetricCard({ title, value, hint, icon: Icon }: SeoMetricCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.04em] text-slate-500 dark:text-slate-400">{title}</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-slate-950 dark:text-white">{value}</p>
            {hint && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#105d97]/10 text-[#105d97] dark:bg-blue-400/10 dark:text-blue-300">
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
