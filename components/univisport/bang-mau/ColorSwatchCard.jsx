import { hexToRgb } from "../../../lib/colorMatch";

function isLightColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  // Perceived luminance (ITU-R BT.601) — swatches above this read as "light"
  // and need a hairline border to stay visible against white cards.
  return (r * 299 + g * 587 + b * 114) / 1000 > 235;
}

export default function ColorSwatchCard({ color, fabricName, onClick, size = "md" }) {
  const light = isLightColor(color.hex);
  const padding = size === "sm" ? "p-2" : "p-2.5";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col rounded-2xl bg-white ${padding} text-left border border-gray-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#105d97] focus-visible:ring-offset-2`}
      aria-label={`Xem chi tiết màu ${color.name}, mã No.${color.code}${fabricName ? `, vải ${fabricName}` : ""}`}
    >
      <span
        className={`relative block aspect-square w-full rounded-xl transition-transform duration-200 group-hover:scale-[1.03] ${light ? "border border-gray-200" : ""}`}
        style={{ backgroundColor: color.hex }}
      >
        <span className="absolute inset-0 flex items-end justify-center rounded-xl bg-gradient-to-t from-black/45 via-black/0 to-black/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="mb-2 text-[11px] font-semibold text-white">Xem chi tiết →</span>
        </span>
      </span>
      <span className="mt-2 block truncate text-[13px] font-semibold uppercase tracking-wide text-gray-900">
        {color.name}
      </span>
      <span className="flex items-center justify-between">
        <span className="text-xs text-gray-500">No.{color.code}</span>
        {fabricName && (
          <span className="truncate text-[11px] font-medium text-[#105d97]">{fabricName}</span>
        )}
      </span>
    </button>
  );
}
