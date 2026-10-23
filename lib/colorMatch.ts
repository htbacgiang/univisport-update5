// Simple perceptual color matching used by the /bang-mau brand-color tool.
// Converts sRGB -> CIE Lab (D65) and ranks catalog colors by Lab (CIE76) distance.
// This runs entirely client-side on ~175 known colors — no external API needed.
import type { FabricColor } from "../data/fabric-colors";

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

const HEX_RE = /^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;

export function isValidHex(value: string): boolean {
  return HEX_RE.test(value.trim());
}

export function normalizeHex(value: string): string {
  const trimmed = value.trim().replace(/^#/, "");
  const expanded =
    trimmed.length === 3
      ? trimmed
        .split("")
        .map((ch) => ch + ch)
        .join("")
      : trimmed;
  return `#${expanded.toUpperCase()}`;
}

export function hexToRgb(hex: string): RgbColor {
  const normalized = normalizeHex(hex).slice(1);
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function srgbChannelToLinear(value: number): number {
  const v = value / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

// sRGB -> Lab (D65 reference white), standard CIE formulas.
function rgbToLab({ r, g, b }: RgbColor): [number, number, number] {
  const rl = srgbChannelToLinear(r);
  const gl = srgbChannelToLinear(g);
  const bl = srgbChannelToLinear(b);

  const x = (rl * 0.4124 + gl * 0.3576 + bl * 0.1805) / 0.95047;
  const y = rl * 0.2126 + gl * 0.7152 + bl * 0.0722;
  const z = (rl * 0.0193 + gl * 0.1192 + bl * 0.9505) / 1.08883;

  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

// CIE76 distance — a simple Euclidean distance in Lab space. Good enough for
// ranking "closest fabric colors to this brand hex", not for print-accurate QA.
export function labDistance(hexA: string, hexB: string): number {
  const [l1, a1, b1] = rgbToLab(hexToRgb(hexA));
  const [l2, a2, b2] = rgbToLab(hexToRgb(hexB));
  return Math.sqrt((l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2);
}

export function findClosestColors(
  hex: string,
  colors: FabricColor[],
  count = 5
): FabricColor[] {
  if (!isValidHex(hex)) return [];
  const target = normalizeHex(hex);
  return [...colors]
    .sort((a, b) => labDistance(target, a.hex) - labDistance(target, b.hex))
    .slice(0, count);
}
