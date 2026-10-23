export const DEFAULT_BLOG_CATEGORIES = [
  "Đồng phục thể thao",
  "Đồng phục doanh nghiệp",
  "Kiến thức chất liệu & công nghệ",
  "Kiến thiết kế & branding",
  "Phản hồi khách hàng",
] as const;

export type BlogCategory = typeof DEFAULT_BLOG_CATEGORIES[number] | string;
