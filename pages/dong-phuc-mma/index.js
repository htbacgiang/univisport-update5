import CategoryPageTemplate from '../../components/univisport/CategoryPageTemplate';
import MMAUniviPage from '../../components/univisport/bai-viet/MMAUniviPage';
import { getProductsByCategory, getSidebarNavCounts } from '../../lib/getProductsByCategory';
import { getCategoryArticleSetting } from '../../lib/categoryArticleSettings';

const SLUG = 'dong-phuc-mma';
const META_TITLE = 'Đồng Phục MMA Võ Thuật | Thiết Kế Riêng Cho CLB';
const META_DESCRIPTION =
  'May đồng phục MMA, Boxing, Kickboxing và võ thuật theo yêu cầu. Form gọn, bền, co giãn tốt, phù hợp tập luyện cường độ cao và nhận diện CLB.';

const META_KEYWORDS =
  'đồng phục MMA, đồng phục võ thuật, đồng phục boxing, đồng phục kickboxing, đồng phục CLB võ thuật, Đồng Phục Univi';
const OG_IMAGE = 'https://dongphucunivi.com/images/banner-mma.jpg';
const OG_IMAGE_ALT =
  'Đồng phục MMA Univi thiết kế riêng cho CLB võ thuật và phòng tập';

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
          { '@type': 'ListItem', 'position': 2, 'name': 'Đồng Phục MMA Võ Thuật', 'item': canonical },
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

export default function DongPhucMMA({
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
      ArticleComponent={MMAUniviPage}
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
