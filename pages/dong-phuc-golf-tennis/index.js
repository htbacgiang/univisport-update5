import CategoryPageTemplate from '../../components/univisport/CategoryPageTemplate';
import GolfTennisUniviPage from '../../components/univisport/bai-viet/GolfTennisUniviPage';
import { getProductsByCategory, getSidebarNavCounts } from '../../lib/getProductsByCategory';
import { getCategoryArticleSetting } from '../../lib/categoryArticleSettings';

const SLUG = 'dong-phuc-golf-tennis';
const META_TITLE = 'Đồng Phục Golf Tennis Cho CLB | Thiết Kế Theo Yêu Cầu';
const META_DESCRIPTION =
  'May đồng phục Golf Tennis theo yêu cầu cho CLB, đội nhóm, học viện và sự kiện. Thiết kế lịch sự, thoáng nhẹ, giữ form tốt và đồng bộ thương hiệu.';

const META_KEYWORDS =
  'đồng phục golf, đồng phục tennis, may đồng phục golf tennis, áo golf đồng phục, áo tennis đồng phục, Đồng Phục Univi';
const OG_IMAGE = 'https://dongphucunivi.com/images/banner-golf-tennis.jpg';
const OG_IMAGE_ALT =
  'Đồng phục Golf Tennis Univi thiết kế riêng cho CLB và đội nhóm';

function buildMeta(products = []) {
  const canonical = `https://dongphucunivi.com/${SLUG}`;
  return {
    title: META_TITLE,
    description: META_DESCRIPTION,
    keywords: META_KEYWORDS,
    author: 'Đồng Phục Univi',
    robots: 'index, follow',
    canonical,
    og: {
      title: META_TITLE,
      description: META_DESCRIPTION,
      type: 'website',
      image: OG_IMAGE,
      imageWidth: '1200',
      imageHeight: '630',
      imageAlt: OG_IMAGE_ALT,
      url: canonical,
      site_name: 'Đồng Phục Univi',
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title: META_TITLE,
      description: META_DESCRIPTION,
      image: OG_IMAGE,
    },
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${canonical}#webpage`,
        'url': canonical,
        'name': META_TITLE,
        'description': META_DESCRIPTION,
        'isPartOf': { '@id': 'https://dongphucunivi.com/#website' },
        'about': { '@id': 'https://dongphucunivi.com/#organization' },
        'inLanguage': 'vi-VN',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Trang chủ', 'item': 'https://dongphucunivi.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Đồng Phục Golf - Tennis', 'item': canonical },
        ],
      },
      ...(products.length > 0 ? [{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        '@id': `${canonical}#itemlist`,
        'name': META_TITLE,
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

export default function DongPhucGolfTennis({
  initialProducts,
  categoryCounts,
  gymCounts,
  enterpriseCounts,
  categoryArticle,
}) {
  return (
    <CategoryPageTemplate
      categorySlug={SLUG}
      initialProducts={initialProducts}
      categoryCounts={categoryCounts}
      gymCounts={gymCounts}
      enterpriseCounts={enterpriseCounts}
      ArticleComponent={GolfTennisUniviPage}
      categoryArticle={categoryArticle}
    />
  );
}

export async function getServerSideProps() {
  try {
    const [initialProducts, sidebarCounts, categoryArticle] = await Promise.all([
      getProductsByCategory(SLUG),
      getSidebarNavCounts(),
      getCategoryArticleSetting(SLUG),
    ]);

    return {
      props: {
        initialProducts,
        categoryCounts: sidebarCounts.categoryCounts,
        gymCounts: sidebarCounts.gymCounts,
        enterpriseCounts: sidebarCounts.enterpriseCounts,
        categoryArticle,
        meta: buildMeta(initialProducts),
      },
    };
  } catch (error) {
    console.error(`Error fetching products for ${SLUG}:`, error.message);

    return {
      props: {
        initialProducts: [],
        categoryCounts: {},
        gymCounts: { total: 0, lines: [] },
        enterpriseCounts: { total: 0, lines: [] },
        categoryArticle: null,
        meta: buildMeta(),
      },
    };
  }
}
