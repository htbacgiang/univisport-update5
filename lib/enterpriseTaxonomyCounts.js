import { productTaxonomy } from './productTaxonomy.js';

const CATEGORY_SLUG = 'dong-phuc-doanh-nghiep';

const ENTERPRISE_LINE_ALIASES = {
  polo: ['dong-phuc-polo', 'dong-phuc-ao-polo', 'polo'],
  'so-mi': ['dong-phuc-so-mi', 'dong-phuc-cong-so', 'so-mi'],
  vest: ['dong-phuc-vest-cong-so', 'dong-phuc-vest', 'vest'],
  'ao-gio': ['dong-phuc-ao-gio-doanh-nghiep'],
  teambuilding: ['dong-phuc-teambuilding', 'teambuilding'],
  'bao-ho': ['bao-ho-lao-dong', 'bao-ho'],
  'phu-kien': ['phu-kien-qua-tang-doanh-nghiep', 'qua-tang-phu-kien-doanh-nghiep', 'phu-kien'],
};

// Tính số lượng sản phẩm thật theo từng category con (productLine) của
// Đồng phục Doanh nghiệp dựa trên dữ liệu sản phẩm đã fetch từ DB
export function computeEnterpriseTaxonomyCounts(enterpriseProducts = []) {
  const lines = productTaxonomy[CATEGORY_SLUG]?.productLines || {};

  const lineEntries = Object.entries(lines).map(([slug, cfg]) => {
    const aliases = ENTERPRISE_LINE_ALIASES[slug] || [slug];
    const lineProducts = enterpriseProducts.filter(
      (p) => p.productLine === slug || aliases.includes(p.category)
    );
    return {
      slug,
      label: cfg.label,
      count: lineProducts.length,
      image: lineProducts[0]?.image || null,
    };
  });

  return {
    total: enterpriseProducts.length,
    lines: lineEntries,
  };
}

