import { productTaxonomy } from './productTaxonomy.js';

const CATEGORY_SLUG = 'dong-phuc-gym';

// Tính số lượng sản phẩm thật theo từng productLine/collarType của Đồng phục Gym
// dựa trên danh sách sản phẩm đã fetch từ DB (không hard-code số lượng).
export function computeGymTaxonomyCounts(gymProducts = []) {
  const lines = productTaxonomy[CATEGORY_SLUG]?.productLines || {};

  const lineEntries = Object.entries(lines).map(([slug, cfg]) => {
    const lineProducts = gymProducts.filter((p) => p.productLine === slug);
    const collarEntries = Object.entries(cfg.collarTypes || {}).map(([collarSlug, collarLabel]) => ({
      slug: collarSlug,
      label: collarLabel,
      count: lineProducts.filter((p) => p.collarType === collarSlug).length,
    }));

    return {
      slug,
      label: cfg.label,
      count: lineProducts.length,
      collars: collarEntries,
    };
  });

  return {
    total: gymProducts.length,
    lines: lineEntries,
  };
}
