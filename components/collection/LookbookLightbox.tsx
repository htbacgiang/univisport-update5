import { useEffect, useRef } from "react";
import { LookbookItem } from "../../data/collection/lookbookItems";

interface LookbookLightboxProps {
  items: LookbookItem[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}

// Modal/focus-trap behaviour mirrors components/univisport/CTABanner.jsx's
// existing contact-form modal so the whole site shares one accessible pattern.
export default function LookbookLightbox({ items, index, onClose, onNavigate }: LookbookLightboxProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const prevFocusRef = useRef<Element | null>(null);
  const current = items[index];

  const goPrev = () => onNavigate((index - 1 + items.length) % items.length);
  const goNext = () => onNavigate((index + 1) % items.length);

  useEffect(() => {
    const modal = modalRef.current;
    const focusables = modal?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables?.[0];
    const last = focusables?.[focusables.length - 1];

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Tab" && focusables && focusables.length > 0) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    prevFocusRef.current = document.activeElement;
    first?.focus({ preventScroll: true });
    window.addEventListener("keydown", onKeyDown);

    const html = document.documentElement;
    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "contain";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      html.style.overflow = "";
      html.style.overscrollBehavior = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      const prev = prevFocusRef.current;
      if (prev && "focus" in prev) (prev as HTMLElement).focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={current.alt}
        onClick={(e) => e.target === e.currentTarget && onClose()}
        className="relative w-full h-full flex items-center justify-center"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-3 right-3 md:top-6 md:right-6 z-10 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {items.length > 1 && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Ảnh trước"
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.image}
          alt={current.alt}
          className="max-h-[82vh] max-w-full md:max-w-[85vw] w-auto h-auto object-contain rounded-lg select-none"
        />

        {items.length > 1 && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Ảnh tiếp theo"
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        <p className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs md:text-sm">
          {index + 1} / {items.length}
        </p>
      </div>
    </div>
  );
}
