// Bộ lọc bộ sưu tập — id khớp với category slug thật (dùng để lọc Lookbook client-side
// và điều hướng sang trang danh mục thật tương ứng). "all" chỉ reset bộ lọc, không điều hướng.
export interface CollectionFilter {
  id: string;
  label: string;
  href?: string;
}

export const collectionFilters: CollectionFilter[] = [
  { id: "all", label: "Tất cả" },
  { id: "gym", label: "Gym", href: "/dong-phuc-gym" },
  { id: "pickleball", label: "Pickleball", href: "/dong-phuc-pickleball" },
  { id: "yoga-pilates", label: "Yoga & Pilates", href: "/dong-phuc-yoga-pilates" },
  { id: "chay-bo", label: "Chạy bộ", href: "/dong-phuc-chay-bo" },
  { id: "mma", label: "MMA", href: "/dong-phuc-mma" },
  { id: "golf-tennis", label: "Golf & Tennis", href: "/dong-phuc-golf-tennis" },
];
