import React from "react";

interface SmallCardProps {
  data: {
    title: string;
    number: number;
    iconBg: string;
    icon: React.ComponentType<{ className?: string }>;
  };
}

const BG_MAP: Record<string, string> = {
  "bg-green-600":  "bg-[#dcfce7] text-[#16a34a]",
  "bg-red-600":    "bg-[#fef2f2] text-[#dc2626]",
  "bg-orange-600": "bg-[#fff7ed] text-[#ea580c]",
  "bg-purple-600": "bg-[#f5f3ff] text-[#7c3aed]",
  "bg-blue-600":   "bg-[#eff6ff] text-[#2563eb]",
};

export default function SmallCard({ data }: SmallCardProps) {
  const { title, number, iconBg, icon: Icon } = data;
  const iconClass = BG_MAP[iconBg] ?? "bg-[#f1f5f9] text-[#475569]";
  const formatted = new Intl.NumberFormat("vi-VN").format(number);

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[10px] px-4 py-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-[#64748b] font-medium mb-0.5">{title}</p>
        <p className="text-xl font-bold text-[#0f172a] leading-none">{formatted}</p>
      </div>
    </div>
  );
}
