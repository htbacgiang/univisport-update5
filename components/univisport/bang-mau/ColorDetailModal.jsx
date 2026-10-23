import { useEffect, useRef } from "react";
import { hexToRgb } from "../../../lib/colorMatch";

function isLightColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 > 235;
}

export default function ColorDetailModal({ color, fabric, onClose, onRequestSample, onRequestConsult }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    closeBtnRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const html = document.documentElement;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      html.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [onClose]);

  const light = isLightColor(color.hex);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="color-detail-title"
        className="relative w-full max-w-lg animate-fade-up rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mx-auto mt-3 block h-1 w-10 rounded-full bg-gray-200 sm:hidden" aria-hidden="true" />

        <div className="p-6 sm:p-8">
          <span
            className={`block aspect-[16/9] w-full rounded-2xl ${light ? "border border-gray-200" : ""}`}
            style={{ backgroundColor: color.hex }}
          />

          <div className="mt-5">
            <h2 id="color-detail-title" className="text-2xl font-bold uppercase tracking-tight text-gray-900">
              {color.name}
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">No.{color.code}</p>
          </div>

          {fabric && (
            <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#105d97]">
                Vải {fabric.name}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
                <span>{fabric.composition}</span>
                <span>{fabric.weight}</span>
              </div>
            </div>
          )}

          <p className="mt-4 text-xs leading-5 text-gray-400">
            Màu hiển thị là mô phỏng kỹ thuật số (mã {color.hex}) và có thể chênh lệch nhẹ so với màu vải thực tế
            tùy theo thiết bị hiển thị. Vui lòng yêu cầu mẫu vải để xem màu chuẩn xác nhất.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onRequestSample(color, fabric)}
              className="flex-1 rounded-full bg-[#105d97] px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#0c4d7d]"
            >
              Yêu cầu mẫu vải
            </button>
            <button
              type="button"
              onClick={() => onRequestConsult(color, fabric)}
              className="flex-1 rounded-full border-2 border-[#105d97] px-5 py-3 text-center text-sm font-semibold text-[#105d97] transition-colors hover:bg-[#eaf2fb]"
            >
              Tư vấn màu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
