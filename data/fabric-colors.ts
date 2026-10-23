// Combined fabric-color dataset + query helpers for the /bang-mau catalog.
// hex values are approximate digital readings of the printed catalog swatches —
// treat them as a close visual reference, not an exact physical color match.
import { poloCaSauColors } from "./colors/polo-ca-sau";
import { quickdryColors } from "./colors/quickdry";
import { supercoolColors } from "./colors/supercool";
import { uniairColors } from "./colors/uniair";

export interface FabricColor {
  id: string;
  fabricSlug: string;
  code: string;
  name: string;
  hex: string;
  family: ColorFamily;
  featured: boolean;
}

export type ColorFamily =
  | "do"
  | "cam"
  | "vang"
  | "xanh-la"
  | "xanh-duong"
  | "tim"
  | "hong"
  | "trang"
  | "den"
  | "xam"
  | "nau";

export const colorFamilies: { slug: ColorFamily; label: string; swatch: string }[] = [
  { slug: "do", label: "Đỏ", swatch: "#C22A2E" },
  { slug: "cam", label: "Cam", swatch: "#F4841D" },
  { slug: "vang", label: "Vàng", swatch: "#F0BC3C" },
  { slug: "xanh-la", label: "Xanh lá", swatch: "#349650" },
  { slug: "xanh-duong", label: "Xanh dương", swatch: "#2554C4" },
  { slug: "tim", label: "Tím", swatch: "#5B3E8C" },
  { slug: "hong", label: "Hồng", swatch: "#F28CA0" },
  { slug: "trang", label: "Trắng", swatch: "#FFFFFF" },
  { slug: "den", label: "Đen", swatch: "#101012" },
  { slug: "xam", label: "Xám", swatch: "#8C8C8C" },
  { slug: "nau", label: "Nâu", swatch: "#7A6355" },
];

export const fabricColors: FabricColor[] = [
  ...poloCaSauColors,
  ...quickdryColors,
  ...supercoolColors,
  ...uniairColors,
];

export function getColorsByFabric(fabricSlug: string): FabricColor[] {
  return fabricColors.filter((c) => c.fabricSlug === fabricSlug);
}

export function getFeaturedColors(): FabricColor[] {
  return fabricColors.filter((c) => c.featured);
}

export function searchColors(colors: FabricColor[], query: string): FabricColor[] {
  const q = query.trim().toLowerCase();
  if (!q) return colors;
  const normalized = q.replace(/^no\.?\s*/, "");
  return colors.filter((c) => {
    const name = c.name.toLowerCase();
    const code = c.code.toLowerCase();
    return name.includes(q) || code.includes(normalized) || `no.${code}`.toLowerCase().includes(q);
  });
}

export function getColorById(id: string): FabricColor | undefined {
  return fabricColors.find((c) => c.id === id);
}
