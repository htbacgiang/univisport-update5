// Cấu hình tập trung cho phân loại sản phẩm sâu hơn category:
// category -> productLine -> collarType
// Không thay thế category hiện tại, chỉ mở rộng thêm 2 tầng phân loại.
// Thêm category/dòng sản phẩm/kiểu cổ mới bằng cách bổ sung vào object bên dưới,
// không cần sửa logic ở nơi khác.

export const productTaxonomy = {
  'dong-phuc-gym': {
    label: 'Đồng phục Gym',
    productLines: {
      'ao-thun-fit-body': {
        label: 'Áo thun Fit Body',
        collarTypes: {
          'co-tron': 'Cổ tròn',
          'co-tru': 'Cổ trụ',
        },
      },
      'polo-the-thao': {
        label: 'Polo thể thao'

      },
    },
  },
  'dong-phuc-pickleball': { label: 'Đồng phục Pickleball', productLines: {} },
  'dong-phuc-yoga-pilates': { label: 'Đồng phục Yoga', productLines: {} },
  'dong-phuc-pilates': { label: 'Đồng phục Pilates', productLines: {} },
  'dong-phuc-golf-tennis': { label: 'Đồng phục Golf - Tennis', productLines: {} },
  'dong-phuc-ao-gio': { label: 'Đồng phục Áo Gió', productLines: {} },
  'dong-phuc-chay-bo': { label: 'Đồng phục Chạy bộ', productLines: {} },
  'dong-phuc-mma': { label: 'Đồng phục MMA', productLines: {} },
  // Nhóm kinh doanh Đồng phục Doanh nghiệp: category -> productLine đóng vai trò
  // categorySlug trong URL /dong-phuc-doanh-nghiep/[categorySlug]. Không có collarType
  // (chỉ 2 tầng: pillar -> category landing -> product).
  'dong-phuc-doanh-nghiep': {
    label: 'Đồng phục Doanh nghiệp',
    productLines: {
      'polo': { label: 'Polo doanh nghiệp', collarTypes: {} },
      'so-mi': { label: 'Sơ mi công sở', collarTypes: {} },
      'vest': { label: 'Vest công sở', collarTypes: {} },
      'teambuilding': { label: 'Đồng phục Teambuilding', collarTypes: {} },
      'bao-ho': { label: 'Bảo hộ lao động', collarTypes: {} },
      'phu-kien': { label: 'Phụ kiện & Quà tặng', collarTypes: {} },
    },
  },
};

export function getProductLineOptions(category) {
  const lines = productTaxonomy[category]?.productLines || {};
  return Object.entries(lines).map(([value, cfg]) => ({ value, label: cfg.label }));
}

export function getCollarTypeOptions(category, productLine) {
  const collarTypes = productTaxonomy[category]?.productLines?.[productLine]?.collarTypes || {};
  return Object.entries(collarTypes).map(([value, label]) => ({ value, label }));
}

export function getProductLineLabel(category, productLine) {
  return productTaxonomy[category]?.productLines?.[productLine]?.label || productLine || '';
}

export function getCollarTypeLabel(category, productLine, collarType) {
  return productTaxonomy[category]?.productLines?.[productLine]?.collarTypes?.[collarType] || collarType || '';
}
