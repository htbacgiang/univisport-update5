export const CATEGORY_ARTICLE_OPTIONS = [
  { slug: "dong-phuc-gym", label: "Đồng phục Gym" },
  { slug: "dong-phuc-yoga-pilates", label: "Đồng phục Yoga" },
  { slug: "dong-phuc-pilates", label: "Đồng phục Pilates" },
  { slug: "dong-phuc-pickleball", label: "Đồng phục Pickleball" },
  { slug: "dong-phuc-chay-bo", label: "Đồng phục Chạy bộ" },
  { slug: "dong-phuc-mma", label: "Đồng phục MMA" },
  { slug: "dong-phuc-golf-tennis", label: "Đồng phục Golf - Tennis" },
  { slug: "dong-phuc-ao-gio", label: "Đồng phục Áo gió" },
  { slug: "dong-phuc-doanh-nghiep", label: "Đồng phục Doanh nghiệp" }
];

export const isValidCategoryArticleSlug = (slug) =>
  CATEGORY_ARTICLE_OPTIONS.some((category) => category.slug === slug);

export const getCategoryArticleLabel = (slug) =>
  CATEGORY_ARTICLE_OPTIONS.find((category) => category.slug === slug)?.label ||
  slug?.replace(/-/g, " ") ||
  "Bài viết danh mục";
