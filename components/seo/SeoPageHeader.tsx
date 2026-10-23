import { LucideIcon } from "lucide-react";

interface SeoPageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  generatedAt?: string;
}

export function SeoPageHeader({ title, description, icon: Icon, generatedAt }: SeoPageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-[#105d97]" />
          <h1 className="text-2xl font-bold tracking-normal text-slate-950 dark:text-white">{title}</h1>
        </div>
        <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      {generatedAt && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Cập nhật: {new Date(generatedAt).toLocaleString("vi-VN")}
        </p>
      )}
    </div>
  );
}
