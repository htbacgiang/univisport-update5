import CategoryPageTemplate from '../../components/univisport/CategoryPageTemplate';
import PickleballUniviPage, { pickleballFaqs } from '../../components/univisport/bai-viet/PickleballUniviPage';
import { getProductsByCategory, getSidebarNavCounts } from '../../lib/getProductsByCategory';
import { getCategoryArticleSetting } from '../../lib/categoryArticleSettings';

const SLUG = 'dong-phuc-pickleball';
const META_TITLE = 'Đồng Phục Pickleball Theo Yêu Cầu Cho CLB | Univi Sport';
const META_DESCRIPTION =
  'Đồng phục Pickleball thiết kế theo yêu cầu cho CLB, học viện, doanh nghiệp và giải đấu. Vải thể thao UNI DRY, xưởng 2.000m², đặt từ 10 áo, tư vấn thiết kế miễn phí.';

const META_KEYWORDS =
  'đồng phục Pickleball, may đồng phục Pickleball, áo Pickleball, áo Polo Pickleball, đồng phục Pickleball theo yêu cầu, đồng phục CLB Pickleball, áo Pickleball in logo, đồng phục giải đấu Pickleball, chất liệu áo Pickleball, UniPick, UNI DRY';
const OG_IMAGE = 'https://dongphucunivi.com/images/dong-phuc-pickleball.jpg';
const OG_IMAGE_ALT =
  'Đồng phục Pickleball thiết kế theo yêu cầu cho CLB học viện và giải đấu';

function buildFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `https://dongphucunivi.com/${SLUG}#faq`,
    'mainEntity': pickleballFaqs.map(([question, answer]) => ({
      '@type': 'Question',
      'name': question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': answer,
      },
    })),
  };
}

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
        '@type': 'Service',
        '@id': `${canonical}#service`,
        'name': 'May đồng phục Pickleball thiết kế theo yêu cầu',
        'description': META_DESCRIPTION,
        'provider': { '@id': 'https://dongphucunivi.com/#organization' },
        'serviceType': 'May đồng phục thể thao theo yêu cầu',
        'category': 'Đồng phục Pickleball',
        'areaServed': { '@type': 'Country', 'name': 'Việt Nam' },
        'url': canonical,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Trang chủ', 'item': 'https://dongphucunivi.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Đồng Phục Pickleball', 'item': canonical },
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
      buildFaqSchema(),
    ],
  };
}

export default function DongPhucPickleball({
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
      ArticleComponent={PickleballUniviPage}
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
