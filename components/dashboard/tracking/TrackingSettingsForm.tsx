"use client";

import { FormEvent, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FlaskConical, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import type { TrackingConfig, TrackingMode } from "../../../types/tracking";
import {
  canLoadMetaPixel,
  normalizeTrackingConfig,
  TRACKING_CONFIG_EVENT,
  TRACKING_CONFIG_STORAGE_KEY,
} from "../../../lib/tracking-config";
import {
  loadMetaPixelForTest,
  trackPageView,
} from "../../../lib/meta-pixel";
import { setStoredCookieConsent } from "../../../hooks/useCookieConsent";

interface TrackingSettingsFormProps {
  config: TrackingConfig;
  onSaved: (config: TrackingConfig) => void;
}

type ToggleProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const Toggle = ({ label, description, checked, onChange }: ToggleProps) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className="flex w-full items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-[#105d97]/40 hover:bg-slate-50"
  >
    <span>
      <span className="block text-sm font-semibold text-slate-900">{label}</span>
      <span className="mt-0.5 block text-xs leading-6 text-slate-500">{description}</span>
    </span>
    <span
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "bg-[#105d97]" : "bg-slate-300"
      }`}
      aria-hidden="true"
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </span>
  </button>
);

const Field = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
      {label}
    </span>
    {children}
  </label>
);

const TRACKING_MODE_OPTIONS: Array<{
  value: TrackingMode;
  title: string;
  description: string;
}> = [
  {
    value: "consent",
    title: "Consent",
    description: "Hiện banner có Đồng ý/Từ chối. Chỉ tracking sau khi người dùng đồng ý.",
  },
  {
    value: "notice",
    title: "Notice",
    description: "Tracking chạy mặc định. Banner chỉ thông báo và có nút Đã hiểu.",
  },
  {
    value: "always",
    title: "Always",
    description: "Không hiện banner. Tracking chạy mặc định khi provider đang bật.",
  },
];

export default function TrackingSettingsForm({
  config,
  onSaved,
}: TrackingSettingsFormProps) {
  const [form, setForm] = useState<TrackingConfig>(config);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    setForm(config);
  }, [config]);

  const updateForm = (nextConfig: TrackingConfig) => {
    setForm(normalizeTrackingConfig(nextConfig));
  };

  const saveConfig = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      const normalizedConfig = normalizeTrackingConfig(form);
      const response = await fetch("/api/tracking/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: normalizedConfig }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.err || "Có lỗi xảy ra");
      }

      const savedConfig = normalizeTrackingConfig(data.config);
      window.localStorage.setItem(TRACKING_CONFIG_STORAGE_KEY, JSON.stringify(savedConfig));
      window.dispatchEvent(
        new CustomEvent(TRACKING_CONFIG_EVENT, {
          detail: { config: savedConfig },
        })
      );
      onSaved(savedConfig);
      toast.success("Đã lưu thành công");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const testPixel = async () => {
    if (!canLoadMetaPixel(form)) {
      toast.error("Meta Pixel chưa bật hoặc Pixel ID chưa hợp lệ");
      return;
    }

    setTesting(true);
    try {
      setStoredCookieConsent("accepted");
      await loadMetaPixelForTest(form.metaPixel.pixelId);
      const tracked = trackPageView({
        source: "dashboard_test_pixel",
        test_event: true,
      });

      if (!tracked) {
        throw new Error("Pixel chưa sẵn sàng hoặc consent chưa được đồng ý");
      }

      toast.success("Đã gửi test PageView");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setTesting(false);
    }
  };

  return (
    <form onSubmit={saveConfig} className="rounded-[10px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-base font-bold text-slate-950">Cài đặt Tracking</h2>
          <p className="mt-1 text-sm text-slate-500">
            Không hard-code ID trong component. Cấu hình được lưu trong database.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={testPixel}
            disabled={testing}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#105d97]/20 px-4 py-2 text-sm font-semibold text-[#105d97] transition hover:bg-[#105d97]/10 disabled:opacity-60"
          >
            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FlaskConical className="h-4 w-4" />}
            Test Pixel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#105d97] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d4a7a] disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Lưu cấu hình
          </button>
        </div>
      </div>

      <section className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-slate-950">Chế độ tracking</h3>
          <p className="mt-1 text-xs leading-6 text-slate-500">
            Chọn cách website load Meta Pixel/GA4 trên các trang public.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {TRACKING_MODE_OPTIONS.map((option) => {
            const active = form.trackingMode === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateForm({ ...form, trackingMode: option.value })}
                className={`rounded-lg border px-4 py-3 text-left transition ${
                  active
                    ? "border-[#105d97] bg-white ring-2 ring-[#105d97]/15"
                    : "border-slate-200 bg-white hover:border-[#105d97]/40"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-slate-950">{option.title}</span>
                  <span
                    className={`h-3 w-3 rounded-full ${
                      active ? "bg-[#105d97]" : "bg-slate-300"
                    }`}
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-1 block text-xs leading-6 text-slate-500">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section className="space-y-4">
          <Toggle
            label="Meta Pixel"
            description="Bật/Tắt Meta Pixel cho remarketing Facebook"
            checked={form.metaPixel.enabled}
            onChange={(enabled) =>
              updateForm({ ...form, metaPixel: { ...form.metaPixel, enabled } })
            }
          />
          <Field label="Meta Pixel ID">
            <input
              value={form.metaPixel.pixelId}
              onChange={(event) =>
                updateForm({
                  ...form,
                  metaPixel: { ...form.metaPixel, pixelId: event.target.value },
                })
              }
              placeholder="NEXT_PUBLIC_FACEBOOK_PIXEL_ID=YOUR_PIXEL_ID"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#105d97] focus:ring-2 focus:ring-[#105d97]/15"
            />
          </Field>

          <Toggle
            label="Google Analytics 4"
            description="Bật/Tắt GA4, script load theo chế độ tracking"
            checked={form.ga4.enabled}
            onChange={(enabled) => updateForm({ ...form, ga4: { ...form.ga4, enabled } })}
          />
          <Field label="GA4 Measurement ID">
            <input
              value={form.ga4.measurementId}
              onChange={(event) =>
                updateForm({
                  ...form,
                  ga4: { ...form.ga4, measurementId: event.target.value },
                })
              }
              placeholder="G-XXXXXXXXXX"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#105d97] focus:ring-2 focus:ring-[#105d97]/15"
            />
          </Field>
        </section>

        <section className="space-y-4">
          <Toggle
            label="TikTok Pixel"
            description="Bật/Tắt TikTok Pixel, đã chuẩn bị cấu trúc mở rộng"
            checked={form.tiktokPixel.enabled}
            onChange={(enabled) =>
              updateForm({ ...form, tiktokPixel: { ...form.tiktokPixel, enabled } })
            }
          />
          <Field label="TikTok Pixel ID">
            <input
              value={form.tiktokPixel.pixelId}
              onChange={(event) =>
                updateForm({
                  ...form,
                  tiktokPixel: { ...form.tiktokPixel, pixelId: event.target.value },
                })
              }
              placeholder="CXXXXXXXXXXXX"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#105d97] focus:ring-2 focus:ring-[#105d97]/15"
            />
          </Field>

          <Toggle
            label="Cookie Consent"
            description="Bật/Tắt banner. Chế độ Always sẽ không hiện banner."
            checked={form.cookieConsent.enabled}
            onChange={(enabled) =>
              updateForm({
                ...form,
                cookieConsent: { ...form.cookieConsent, enabled },
              })
            }
          />
          <Field label="Nội dung thông báo cookie">
            <textarea
              value={form.cookieConsent.message}
              onChange={(event) =>
                updateForm({
                  ...form,
                  cookieConsent: { ...form.cookieConsent, message: event.target.value },
                })
              }
              rows={4}
              className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#105d97] focus:ring-2 focus:ring-[#105d97]/15"
            />
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[120px_1fr]">
            <Field label="Màu chính">
              <input
                type="color"
                value={form.cookieConsent.primaryColor}
                onChange={(event) =>
                  updateForm({
                    ...form,
                    cookieConsent: {
                      ...form.cookieConsent,
                      primaryColor: event.target.value,
                    },
                  })
                }
                className="h-11 w-full rounded-lg border border-slate-200 bg-white p-1"
              />
            </Field>
            <Field label="Mã màu">
              <input
                value={form.cookieConsent.primaryColor}
                onChange={(event) =>
                  updateForm({
                    ...form,
                    cookieConsent: {
                      ...form.cookieConsent,
                      primaryColor: event.target.value,
                    },
                  })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#105d97] focus:ring-2 focus:ring-[#105d97]/15"
              />
            </Field>
          </div>
        </section>
      </div>
    </form>
  );
}
