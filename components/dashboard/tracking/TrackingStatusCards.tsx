"use client";

import {
  Activity,
  BarChart3,
  CheckCircle2,
  Cookie,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import type { TrackingConfig } from "../../../types/tracking";
import {
  canLoadGa4,
  canLoadMetaPixel,
  isMetaPixelConfigured,
} from "../../../lib/tracking-config";

interface TrackingStatusCardsProps {
  config: TrackingConfig;
  loading?: boolean;
}

const StatusPill = ({ active, label }: { active: boolean; label: string }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
      active
        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
        : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
    }`}
  >
    {active ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
    {label}
  </span>
);

const StatusCard = ({
  title,
  value,
  description,
  active,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  active: boolean;
  icon: typeof Activity;
}) => (
  <div className="rounded-[10px] border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#105d97]/10 text-[#105d97]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950">{title}</p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <StatusPill active={active} label={active ? "Đang bật" : "Đang tắt"} />
    </div>
    <p className="mt-4 break-all rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
      {value || "Chưa cấu hình"}
    </p>
  </div>
);

export default function TrackingStatusCards({
  config,
  loading,
}: TrackingStatusCardsProps) {
  const metaReady = canLoadMetaPixel(config);
  const metaConfigured = isMetaPixelConfigured(config);
  const ga4Ready = canLoadGa4(config);

  return (
    <div className="space-y-5">
      {loading && (
        <div className="rounded-[10px] border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Đang tải cấu hình tracking...
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <StatusCard
          title="Meta Pixel"
          value={config.metaPixel.pixelId}
          description={metaConfigured ? "Pixel ID đã cấu hình" : "Cần nhập Pixel ID thật"}
          active={metaReady}
          icon={Activity}
        />
        <StatusCard
          title="Cookie Consent"
          value={`Mode: ${config.trackingMode} | Mặc định: ${config.cookieConsent.defaultConsent}`}
          description={
            config.trackingMode === "always"
              ? "Banner ẩn, tracking mặc định"
              : config.cookieConsent.enabled
                ? "Banner đang hoạt động"
                : "Banner đang tắt"
          }
          active={config.cookieConsent.enabled}
          icon={Cookie}
        />
        <StatusCard
          title="Google Analytics 4"
          value={config.ga4.measurementId}
          description="Chỉ load sau khi consent accepted"
          active={ga4Ready}
          icon={BarChart3}
        />
        <StatusCard
          title="TikTok Pixel"
          value={config.tiktokPixel.pixelId}
          description="Đã chuẩn bị cấu trúc mở rộng"
          active={config.tiktokPixel.enabled && Boolean(config.tiktokPixel.pixelId)}
          icon={ShieldCheck}
        />
      </div>

      <div className="rounded-[10px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[#105d97]" />
          <h2 className="text-base font-bold text-slate-950">Các event đang được hỗ trợ</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {config.supportedEvents.map((eventName) => (
            <span
              key={eventName}
              className="rounded-full bg-[#105d97]/10 px-3 py-1.5 text-xs font-semibold text-[#105d97]"
            >
              {eventName}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
