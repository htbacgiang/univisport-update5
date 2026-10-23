// Fabric catalog metadata for the /bang-mau fabric color library.
// Data source: internal Univi fabric color catalogs (POLO/QUICKDRY/SUPERCOOL/UNIAIR reference sheets).

export interface Fabric {
  slug: string;
  name: string;
  composition: string;
  weight: string;
  description: string;
  colorCount: number;
}

export const fabrics: Fabric[] = [
  {
    slug: "polo-ca-sau",
    name: "UNI COOL PIQUÉ - UNIA114",
    composition: "86% Polyamide / 14% Elastane",
    weight: "ĐỊNH LƯỢNG: 175 GAM",
    description: "Dòng vải Piqué (cá sấu) thể thao cao cấp sử dụng tỷ lệ Polyamide và Elastane cao, kết hợp vẻ ngoài lịch sự của Polo với cảm giác mềm mát của trang phục thể thao.",
    colorCount: 38,
  },
  {
    slug: "quickdry",
    name: "UNI QUICKDRY - UNIA01",
    composition: "88% Polyester / 12% Elastane",
    weight: "ĐỊNH LƯỢNG: 180 GAM",
    description: "Vải thể thao mỏng, mịn, nhẹ, thoát ẩm tốt, co giãn 4 chiều, siêu nhanh khô — phù hợp cho Gym, Running, Pickleball, Tennis.",
    colorCount: 40,
  },
  {
    slug: "supercool",
    name: "UNI SUPERCOOL - UNIA02",
    composition: "89% Polyamide / 11% Elastane",
    weight: "ĐỊNH LƯỢNG: 180 GAM",
    description: "Dòng vải thể thao cao cấp, mềm mượt, mát mịn, co giãn 4 chiều, chống nhăn, chuẩn form PT — phù hợp Yoga, Pilates, Gym.",
    colorCount: 78,
  },
  {
    slug: "uniair",
    name: "UNI AIR - UNIA12",
    composition: "90% Polyester / 10% Elastane",
    weight: "ĐỊNH LƯỢNG: 150 GAM",
    description: "Vải thể thao mỏng nhẹ, dệt lỗ thoáng khí chuyên dụng, tối ưu trọng lượng và khả năng lưu thông không khí.",
    colorCount: 19,
  },
];

export function getFabricBySlug(slug: string): Fabric | undefined {
  return fabrics.find((f) => f.slug === slug);
}
