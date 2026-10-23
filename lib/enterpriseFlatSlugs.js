// Ánh xạ productLine (key trong productTaxonomy['dong-phuc-doanh-nghiep'].productLines)
// sang slug phẳng 1 cấp dùng làm URL trang riêng, vd /dong-phuc-polo — thay cho
// URL lồng /dong-phuc-doanh-nghiep/[categorySlug] trước đây.
// 'ao-thun' và 'ao-gio' phải dùng hậu tố "-doanh-nghiep" vì /dong-phuc-ao-thun và
// /dong-phuc-ao-gio đã là 2 category độc lập khác (dữ liệu sản phẩm riêng theo
// product.category, không thuộc nhóm Đồng phục Doanh nghiệp) — xem
// pages/dong-phuc-ao-thun và pages/dong-phuc-ao-gio.
export const ENTERPRISE_FLAT_SLUGS = {
  'polo': 'dong-phuc-polo',
  'so-mi': 'dong-phuc-so-mi',
  'vest': 'dong-phuc-vest-cong-so',
  'teambuilding': 'dong-phuc-teambuilding',
  'bao-ho': 'bao-ho-lao-dong',
  'phu-kien': 'phu-kien-qua-tang-doanh-nghiep',
};

export const ENTERPRISE_SLUG = 'dong-phuc-doanh-nghiep';

export function getEnterpriseFlatSlug(productLine) {
  return ENTERPRISE_FLAT_SLUGS[productLine] || null;
}

export function isEnterprisePath(path = '') {
  if (!path) return false;
  const cleanPath = path.split('?')[0];
  if (cleanPath === `/${ENTERPRISE_SLUG}` || cleanPath.startsWith(`/${ENTERPRISE_SLUG}/`)) return true;
  return Object.values(ENTERPRISE_FLAT_SLUGS).some(
    (slug) => cleanPath === `/${slug}` || cleanPath.startsWith(`/${slug}/`)
  );
}

export function isSportPath(path = '') {
  if (!path) return false;
  const cleanPath = path.split('?')[0];
  if (cleanPath === '/dong-phuc-the-thao' || cleanPath.startsWith('/dong-phuc-the-thao/')) return true;
  if (isEnterprisePath(cleanPath)) return false;
  return cleanPath.startsWith('/dong-phuc-');
}
