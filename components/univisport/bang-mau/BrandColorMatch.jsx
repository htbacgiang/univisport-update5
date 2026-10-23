import { useMemo, useState } from "react";
import { ArrowDown, Wand2 } from "lucide-react";
import { isValidHex, normalizeHex, findClosestColors } from "../../../lib/colorMatch";
import ColorSwatchCard from "./ColorSwatchCard";
import ColorDetailModal from "./ColorDetailModal";
import ContactForm from "../../header/ContactForm";

export default function BrandColorMatch({ colors, fabrics }) {
  const [hexInput, setHexInput] = useState("");
  const [activeColor, setActiveColor] = useState(null);
  const [contactModal, setContactModal] = useState({ open: false, source: "" });

  const fabricBySlug = useMemo(() => {
    const map = new Map();
    fabrics.forEach((f) => map.set(f.slug, f));
    return map;
  }, [fabrics]);

  const trimmed = hexInput.trim();
  const valid = trimmed.length > 0 && isValidHex(trimmed);
  const normalized = valid ? normalizeHex(trimmed) : null;

  const suggestions = useMemo(() => {
    if (!normalized) return [];
    return findClosestColors(normalized, colors, 5);
  }, [normalized, colors]);

  const handleRequestSample = (color, fabric) => {
    setActiveColor(null);
    setContactModal({
      open: true,
      source: `Bảng màu - Yêu cầu mẫu vải (theo màu thương hiệu ${normalized || ""}): ${fabric ? `${fabric.name} — ` : ""}${color.name} No.${color.code}`,
    });
  };

  const handleRequestConsult = (color, fabric) => {
    setActiveColor(null);
    setContactModal({
      open: true,
      source: `Bảng màu - Tư vấn màu (theo màu thương hiệu ${normalized || ""}): ${fabric ? `${fabric.name} — ` : ""}${color.name} No.${color.code}`,
    });
  };

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-10 rounded-3xl border border-gray-100 bg-gray-50 p-6 md:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Left: intro + input */}
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#105d97]/10">
              <Wand2 className="h-5 w-5 text-[#105d97]" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-xl font-bold uppercase leading-tight tracking-tight text-gray-900 md:text-2xl">
              Tìm màu phù hợp
              <br />
              cho thương hiệu của bạn
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
              Nhập mã màu thương hiệu của bạn, chúng tôi sẽ gợi ý những màu vải phù hợp nhất.
            </p>

            <div className="mt-6">
              <label htmlFor="brand-hex" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Mã màu thương hiệu (HEX)
              </label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  id="brand-hex"
                  type="text"
                  inputMode="text"
                  value={hexInput}
                  onChange={(e) => setHexInput(e.target.value)}
                  placeholder="Nhập mã màu (ví dụ: #105D97)"
                  maxLength={7}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 transition-colors focus:outline-none focus:ring-1 ${trimmed && !valid
                    ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:border-[#105d97] focus:ring-[#105d97]/30"
                    }`}
                  aria-invalid={trimmed.length > 0 && !valid}
                  aria-describedby="brand-hex-hint"
                />
                <span
                  className={`h-11 w-11 shrink-0 rounded-xl border ${valid ? "border-gray-200" : "border-dashed border-gray-300 bg-white"}`}
                  style={valid ? { backgroundColor: normalized } : undefined}
                  aria-hidden="true"
                />
              </div>
              <p id="brand-hex-hint" className="mt-2 text-xs text-gray-400">
                {trimmed && !valid
                  ? "Mã màu chưa hợp lệ — vui lòng nhập dạng #RRGGBB hoặc #RGB."
                  : "Ví dụ: #105D97, #1A2B3C..."}
              </p>
            </div>

            {valid && (
              <div className="mt-6 flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4">
                <span
                  className="h-14 w-14 shrink-0 rounded-xl border border-gray-200"
                  style={{ backgroundColor: normalized }}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                    Màu thương hiệu
                  </p>
                  <p className="font-mono text-sm font-semibold text-gray-800">{normalized}</p>
                </div>
                <ArrowDown className="ml-auto hidden h-5 w-5 shrink-0 text-gray-300 lg:block" aria-hidden="true" />
              </div>
            )}
          </div>

          {/* Right: suggestions */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              Gợi ý màu vải phù hợp
            </p>

            {!valid ? (
              <div className="mt-4 flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
                <p className="text-sm text-gray-400">
                  Nhập mã màu HEX hợp lệ ở bên trái để xem gợi ý màu vải Univi gần nhất.
                </p>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-3 md:gap-4">
                {suggestions.map((color) => (
                  <ColorSwatchCard
                    key={color.id}
                    color={color}
                    fabricName={fabricBySlug.get(color.fabricSlug)?.name}
                    onClick={() => setActiveColor(color)}
                  />
                ))}
              </div>
            )}

            <p className="mt-4 text-xs text-gray-400">
              Gợi ý dựa trên khoảng cách màu trong không gian Lab — mang tính tham khảo trực quan.
            </p>
          </div>
        </div>
      </div>

      {activeColor && (
        <ColorDetailModal
          color={activeColor}
          fabric={fabricBySlug.get(activeColor.fabricSlug)}
          onClose={() => setActiveColor(null)}
          onRequestSample={handleRequestSample}
          onRequestConsult={handleRequestConsult}
        />
      )}

      <ContactForm
        isModal
        isOpen={contactModal.open}
        source={contactModal.source}
        onClose={() => setContactModal({ open: false, source: "" })}
      />
    </section>
  );
}
