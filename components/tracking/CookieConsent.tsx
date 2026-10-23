"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import { useCookieConsent } from "../../hooks/useCookieConsent";
import {
  fetchTrackingConfig,
  getDefaultTrackingConfig,
  NOTICE_DISMISSED_STORAGE_KEY,
} from "../../lib/tracking-config";
import type { TrackingConfig } from "../../types/tracking";

export default function CookieConsent() {
  const {
    status,
    mounted,
    isPending,
    acceptCookies,
    rejectCookies,
  } = useCookieConsent();
  const [config, setConfig] = useState<TrackingConfig | null>(null);
  const [noticeDismissed, setNoticeDismissed] = useState(false);

  useEffect(() => {
    let active = true;

    fetchTrackingConfig()
      .then((nextConfig) => {
        if (active) setConfig(nextConfig);
      })
      .catch(() => {
        if (active) setConfig(getDefaultTrackingConfig());
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setNoticeDismissed(window.localStorage.getItem(NOTICE_DISMISSED_STORAGE_KEY) === "true");
  }, []);

  if (!mounted || !config) {
    return null;
  }

  const isNoticeMode = config.trackingMode === "notice";

  if (!config.cookieConsent.enabled) {
    return null;
  }

  if (config.trackingMode === "always") {
    return null;
  }

  if (isNoticeMode && noticeDismissed) {
    return null;
  }

  if (!isNoticeMode && (!isPending || status !== "pending")) {
    return null;
  }

  const primaryColor = config.cookieConsent.primaryColor;
  const dismissNotice = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(NOTICE_DISMISSED_STORAGE_KEY, "true");
    }
    setNoticeDismissed(true);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[999999] px-3 pb-3 sm:px-5 sm:pb-5 pointer-events-none">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl pointer-events-auto sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex gap-3">
          <div
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">Cookie Consent</p>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
              {config.cookieConsent.message}
            </p>
          </div>
        </div>

        <div className={`${isNoticeMode ? "flex" : "grid grid-cols-2 sm:flex"} gap-2 sm:shrink-0`}>
          {!isNoticeMode && (
            <button
              type="button"
              onClick={rejectCookies}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Từ chối
            </button>
          )}
          <button
            type="button"
            onClick={isNoticeMode ? dismissNotice : acceptCookies}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            {isNoticeMode ? "Đã hiểu" : "Đồng ý"}
          </button>
        </div>
      </div>
    </div>
  );
}
