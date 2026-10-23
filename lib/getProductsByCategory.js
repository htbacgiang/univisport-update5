// Helper function to get products by category from database
import db from '../utils/db.js';
import Product from '../models/Product.js';
import { computeGymTaxonomyCounts } from './gymTaxonomyCounts.js';
import { computeEnterpriseTaxonomyCounts } from './enterpriseTaxonomyCounts.js';

const CATEGORY_COUNT_SLUGS = [
  'dong-phuc-gym', 'dong-phuc-yoga-pilates', 'dong-phuc-pilates', 'dong-phuc-pickleball',
  'dong-phuc-chay-bo', 'dong-phuc-mma', 'dong-phuc-golf-tennis',
  'dong-phuc-ao-polo', 'dong-phuc-cong-so', 'dong-phuc-team-building',
  'dong-phuc-ao-gio', 'dong-phuc-ao-thun', 'dong-phuc-le-tan', 'dong-phuc-su-kien',
  'dong-phuc-doanh-nghiep',
];

// Keep image paths as-is, let components handle URL conversion
// (same logic as san-pham/[slug] page)
const toLocalImageUrl = (imagePath) => {
  // Return as-is, components will handle conversion
  return imagePath || '/images/placeholder.jpg';
};

// Fetch products data from database
async function getProductsData() {
  try {
    await db.connectDb();
    const products = await Product.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();
    return products || [];
  } catch (error) {
    console.error('Error fetching products from database:', error);
    return [];
  }
}

const ENTERPRISE_LINE_ALIASES = {
  polo: ['dong-phuc-polo', 'dong-phuc-ao-polo', 'polo'],
  'so-mi': ['dong-phuc-so-mi', 'dong-phuc-cong-so', 'so-mi'],
  vest: ['dong-phuc-vest-cong-so', 'dong-phuc-vest', 'vest'],
  'ao-gio': ['dong-phuc-ao-gio-doanh-nghiep'],
  teambuilding: ['dong-phuc-teambuilding', 'teambuilding'],
  'bao-ho': ['bao-ho-lao-dong', 'bao-ho'],
  'phu-kien': ['phu-kien-qua-tang-doanh-nghiep', 'qua-tang-phu-kien-doanh-nghiep', 'phu-kien'],
};

const CATEGORY_ALIASES = {
  'dong-phuc-polo': ['dong-phuc-polo', 'dong-phuc-ao-polo', 'polo'],
  'dong-phuc-ao-polo': ['dong-phuc-polo', 'dong-phuc-ao-polo', 'polo'],
  'dong-phuc-so-mi': ['dong-phuc-so-mi', 'dong-phuc-cong-so', 'so-mi'],
  'dong-phuc-vest-cong-so': ['dong-phuc-vest-cong-so', 'dong-phuc-vest', 'vest'],
  'dong-phuc-vest': ['dong-phuc-vest-cong-so', 'dong-phuc-vest', 'vest'],
  'dong-phuc-teambuilding': ['dong-phuc-teambuilding', 'teambuilding'],
  'dong-phuc-ao-gio-doanh-nghiep': ['dong-phuc-ao-gio-doanh-nghiep'],
  'bao-ho-lao-dong': ['bao-ho-lao-dong', 'bao-ho'],
  'phu-kien-qua-tang-doanh-nghiep': ['phu-kien-qua-tang-doanh-nghiep', 'qua-tang-phu-kien-doanh-nghiep', 'phu-kien'],
};

function formatProductItem(product) {
  return {
    id: product.id,
    maSanPham: product.maSanPham || '',
    name: product.name,
    price: product.price,
    maxPrice: product.originalPrice || 0,
    originalPrice: product.originalPrice,
    description: product.description,
    image: toLocalImageUrl(product.image),
    slug: product.slug,
    colors: Array.isArray(product.colors)
      ? product.colors.map(color => ({
        name: color.name,
        hex: color.hex,
        hex2: color.hex2 || '',
        image: toLocalImageUrl(color.image)
      }))
      : [],
    isNew: product.isNew || false,
    isFeatured: product.isFeatured || false,
    discount: product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0,
    category: product.category,
    categoryNameVN: product.categoryNameVN,
    productLine: product.productLine || '',
    collarType: product.collarType || '',
    rating: product.rating || 0,
    reviewCount: product.reviewCount || 0,
    material: product.material || '',
    visibleOnHome: product.visibleOnHome !== false,
    visibleOnArticle: product.visibleOnArticle !== false,
  };
}

export async function getProductsByCategory(categorySlug) {
  const productsData = await getProductsData();

  if (!categorySlug) {
    return productsData
      .filter(product => product.visibleOnArticle !== false)
      .map(formatProductItem);
  }

  const aliases = CATEGORY_ALIASES[categorySlug] || [categorySlug];

  const filtered = productsData.filter(product => {
    if (product.visibleOnArticle === false) return false;
    if (product.category === categorySlug || aliases.includes(product.category)) return true;
    if (product.category === 'dong-phuc-doanh-nghiep') {
      const line = Object.keys(ENTERPRISE_LINE_ALIASES).find(
        (key) => ENTERPRISE_LINE_ALIASES[key].includes(categorySlug)
      );
      if (line && product.productLine === line) return true;
    }
    return false;
  });

  return filtered.map(formatProductItem);
}

// Sản phẩm thuộc một dòng sản phẩm (productLine) cụ thể trong category
export async function getProductsByCategoryAndLine(categorySlug, productLine) {
  const productsData = await getProductsData();
  const lineAliases = ENTERPRISE_LINE_ALIASES[productLine] || [productLine];

  const filtered = productsData.filter(product => {
    if (product.visibleOnArticle === false) return false;
    if (product.category === categorySlug && product.productLine === productLine) return true;
    if (product.category === 'dong-phuc-doanh-nghiep' && product.productLine === productLine) return true;
    if (lineAliases.includes(product.category)) return true;
    return false;
  });

  return filtered.map(formatProductItem);
}

// Sản phẩm thuộc một dòng sản phẩm + kiểu cổ cụ thể trong category
export async function getProductsByCategoryLineAndCollar(categorySlug, productLine, collarType) {
  const products = await getProductsByCategoryAndLine(categorySlug, productLine);
  return products.filter(product => product.collarType === collarType);
}

export async function getAllProducts() {
  return await getProductsByCategory(null);
}

export async function getAllCategoryCounts() {
  const productsData = await getProductsData();
  const counts = {};
  for (const slug of CATEGORY_COUNT_SLUGS) {
    counts[slug] = productsData.filter(
      (p) => p.category === slug && p.visibleOnArticle !== false
    ).length;
  }
  return counts;
}

// Sidebar "Danh mục sản phẩm" dùng chung cho cả nhóm Đồng phục Thể thao và
// Đồng phục Doanh nghiệp cần cả 3 loại dữ liệu đếm cùng lúc (categoryCounts,
// gymCounts, enterpriseCounts). Gộp vào 1 lần quét Product duy nhất thay vì gọi
// getAllCategoryCounts() + getProductsByCategory('dong-phuc-gym') +
// getProductsByCategory('dong-phuc-doanh-nghiep') riêng lẻ trên từng trang.
export async function getSidebarNavCounts() {
  const productsData = await getProductsData();
  const isVisible = (p) => p.visibleOnArticle !== false;

  const categoryCounts = {};
  for (const slug of CATEGORY_COUNT_SLUGS) {
    categoryCounts[slug] = productsData.filter((p) => p.category === slug && isVisible(p)).length;
  }

  const gymProducts = productsData.filter((p) => p.category === 'dong-phuc-gym' && isVisible(p));
  const allEnterpriseAliases = Object.values(ENTERPRISE_LINE_ALIASES).flat();
  const enterpriseProducts = productsData.filter(
    (p) => (p.category === 'dong-phuc-doanh-nghiep' || allEnterpriseAliases.includes(p.category)) && isVisible(p)
  );

  return {
    categoryCounts,
    gymCounts: computeGymTaxonomyCounts(gymProducts),
    enterpriseCounts: computeEnterpriseTaxonomyCounts(enterpriseProducts),
  };
}
