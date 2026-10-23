import {
  getProductsByCategoryAndLine,
  getSidebarNavCounts,
} from './getProductsByCategory';
import { productTaxonomy } from './productTaxonomy';
import { getEnterpriseCategoryContent } from './enterpriseHierarchyContent';

const ENTERPRISE_CATEGORY_SLUG = 'dong-phuc-doanh-nghiep';
const ENTERPRISE_CATEGORY_LABEL = 'Đồng phục Doanh nghiệp';

function buildMeta({ flatSlug, lineLabel, products, content }) {
  const canonical = `https://dongphucunivi.com/${flatSlug}`;
  const title = content?.metaTitle || `${lineLabel} - Đồng Phục Doanh Nghiệp Theo Yêu Cầu | UNIVI`;
  const description =
    content?.metaDescription ||
    `Mẫu ${lineLabel} thuộc Đồng phục Doanh nghiệp UNIVI, thiết kế và may theo yêu cầu, giao hàng toàn quốc.`;
  const ogImage = content?.ogImage || 'https://dongphucunivi.com/logo-univi.jpg';

  return {
    title,
    description,
    robots: 'index, follow',
    canonical,
    og: {
      title,
      description,
      type: 'website',
      url: canonical,
      image: ogImage,
      imageWidth: '1200',
      imageHeight: '630',
      imageAlt: title,
      site_name: 'Đồng Phục Univi',
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: ogImage,
    },
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${canonical}#webpage`,
        'url': canonical,
        'name': title,
        'description': description,
        'isPartOf': { '@id': 'https://dongphucunivi.com/#website' },
        'inLanguage': 'vi-VN',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Trang chủ', 'item': 'https://dongphucunivi.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': ENTERPRISE_CATEGORY_LABEL, 'item': `https://dongphucunivi.com/${ENTERPRISE_CATEGORY_SLUG}` },
          { '@type': 'ListItem', 'position': 3, 'name': lineLabel, 'item': canonical },
        ],
      },
      ...(products.length > 0 ? [{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        '@id': `${canonical}#itemlist`,
        'name': title,
        'url': canonical,
        'numberOfItems': products.length,
        'itemListElement': products.slice(0, 20).map((p, i) => ({
          '@type': 'ListItem',
          'position': i + 1,
          'url': `https://dongphucunivi.com/san-pham/${p.slug}`,
          'name': p.name,
        })),
      }] : []),
    ],
  };
}

export function createEnterpriseFlatGetServerSideProps(productLine, flatSlug) {
  return async function getServerSideProps() {
    const lineConfig = productTaxonomy[ENTERPRISE_CATEGORY_SLUG]?.productLines?.[productLine];

    if (!lineConfig) {
      return { notFound: true };
    }

    try {
      const [lineProducts, sidebarCounts] = await Promise.all([
        getProductsByCategoryAndLine(ENTERPRISE_CATEGORY_SLUG, productLine),
        getSidebarNavCounts(),
      ]);

      const content = getEnterpriseCategoryContent(productLine);
      const lineLabel = lineConfig.label;

      return {
        props: {
          productLine,
          lineLabel,
          content,
          products: lineProducts,
          enterpriseCounts: sidebarCounts.enterpriseCounts,
          gymCounts: sidebarCounts.gymCounts,
          categoryCounts: sidebarCounts.categoryCounts,
          meta: buildMeta({ flatSlug, lineLabel, products: lineProducts, content }),
        },
      };
    } catch (error) {
      console.error(`Error fetching products for ${flatSlug}:`, error.message);
      return { notFound: true };
    }
  };
}
