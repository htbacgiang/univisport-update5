"use client";

import { FlaskConical, Phone, RotateCcw, Send, UserRoundCheck } from "lucide-react";
import toast from "react-hot-toast";
import type { TrackingConfig } from "../../../types/tracking";
import { canLoadMetaPixel } from "../../../lib/tracking-config";
import {
  loadMetaPixelForTest,
  trackContact,
  trackLead,
  trackPageView,
  trackPhoneClick,
  trackViewContent,
  trackZaloClick,
} from "../../../lib/meta-pixel";
import {
  resetStoredCookieConsent,
  setStoredCookieConsent,
} from "../../../hooks/useCookieConsent";

interface TrackingTestPanelProps {
  config: TrackingConfig;
}

export default function TrackingTestPanel({ config }: TrackingTestPanelProps) {
  const preparePixel = async () => {
    if (!canLoadMetaPixel(config)) {
      throw new Error("Meta Pixel chưa bật hoặc Pixel ID chưa hợp lệ");
    }

    setStoredCookieConsent("accepted");
    await loadMetaPixelForTest(config.metaPixel.pixelId);
  };

  const runTest = async (label: string, callback: () => boolean) => {
    try {
      await preparePixel();
      const tracked = callback();
      if (!tracked) throw new Error("Không gửi được event. Kiểm tra consent hoặc Pixel Helper.");
      toast.success(`Đã gửi ${label}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    }
  };

  const resetConsent = () => {
    resetStoredCookieConsent();
    toast.success("Đã reset consent trên trình duyệt này");
  };

  const buttons = [
    {
      label: "Test PageView",
      icon: Send,
      onClick: () =>
        runTest("PageView", () =>
          trackPageView({ source: "dashboard_test_panel", test_event: true })
        ),
    },
    {
      label: "Test ViewContent",
      icon: FlaskConical,
      onClick: () =>
        runTest("ViewContent", () =>
          trackViewContent({
            content_name: "Dashboard tracking test",
            content_category: "tracking",
            test_event: true,
          })
        ),
    },
    {
      label: "Test Lead",
      icon: UserRoundCheck,
      onClick: () =>
        runTest("Lead", () =>
          trackLead({ source: "dashboard_test_panel", test_event: true })
        ),
    },
    {
      label: "Test Contact",
      icon: UserRoundCheck,
      onClick: () =>
        runTest("Contact", () =>
          trackContact({ source: "dashboard_test_panel", test_event: true })
        ),
    },
    {
      label: "Test click hotline",
      icon: Phone,
      onClick: () =>
        runTest("PhoneClick", () =>
          trackPhoneClick("0834204999", {
            source: "dashboard_test_panel",
            test_event: true,
          })
        ),
    },
    {
      label: "Test click Zalo",
      icon: Send,
      onClick: () =>
        runTest("ZaloClick", () =>
          trackZaloClick({
            source: "dashboard_test_panel",
            test_event: true,
          })
        ),
    },
  ];

  return (
    <div className="rounded-[10px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-base font-bold text-slate-950">Kiểm tra sự kiện</h2>
          <p className="mt-1 text-sm text-slate-500">
            Các nút test chỉ load Pixel khi admin bấm, không tự tracking dashboard.
          </p>
        </div>
        <button
          type="button"
          onClick={resetConsent}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          Reset consent
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {buttons.map((button) => {
          const Icon = button.icon;
          return (
            <button
              key={button.label}
              type="button"
              onClick={button.onClick}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#105d97]/40 hover:bg-[#105d97]/5 hover:text-[#105d97]"
            >
              <Icon className="h-4 w-4" />
              {button.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
