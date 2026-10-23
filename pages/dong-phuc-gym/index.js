import CategoryPageTemplate from '../../components/univisport/CategoryPageTemplate';
import GymUniviPage, { gymFaqs } from '../../components/univisport/bai-viet/GymUniviPage';
import { getProductsByCategory, getSidebarNavCounts } from '../../lib/getProductsByCategory';
import { getCategoryArticleSetting } from '../../lib/categoryArticleSettings';

const SLUG = 'dong-phuc-gym';
const META_TITLE = 'May Đồng Phục Gym Theo Yêu Cầu Cho Phòng Tập & Fitness Center | UNIVI';
const META_DESCRIPTION =
  'May đồng phục Gym theo yêu cầu cho phòng tập, PT Studio và chuỗi Fitness Center. Tư vấn UNI DRY, thiết kế miễn phí, lưu chuẩn tái sản xuất, giao toàn quốc.';
const AUTHOR_URL = 'https://dongphucunivi.com/dong-sang-lap-univi-sport-tran-hien';
const AUTHOR_ID = `${AUTHOR_URL}#person`;

const META_KEYWORDS =
  'đồng phục Gym, may đồng phục Gym, đồng phục phòng tập Gym, đồng phục Fitness Center, đồng phục PT Gym, đồng phục huấn luyện viên Gym, đồng phục lễ tân phòng Gym, đồng phục nhân viên phòng tập, áo Gym đồng phục, đồng phục phòng tập theo yêu cầu, xưởng may đồng phục Gym, UNI DRY, UNI QUICK DRY, UNI SUPER COOL, Giải pháp 2S Uniform';
const OG_IMAGE = 'https://dongphucunivi.com/images/banner-ao-gym.jpg';
const OG_IMAGE_ALT =
  'Đồng phục Gym thiết kế theo yêu cầu cho phòng tập và chuỗi Fitness Center';

function buildFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `https://dongphucunivi.com/${SLUG}#faq`,
    'mainEntity': gymFaqs.map(([question, answer]) => ({
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
    author: 'Trần Hiền',
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
        'author': { '@id': AUTHOR_ID },
        'inLanguage': 'vi-VN',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${canonical}#service`,
        'name': 'May đồng phục Gym thiết kế theo yêu cầu',
        'description': META_DESCRIPTION,
        'provider': { '@id': 'https://dongphucunivi.com/#organization' },
        'serviceType': 'May đồng phục thể thao theo yêu cầu',
        'category': 'Đồng phục Gym',
        'areaServed': { '@type': 'Country', 'name': 'Việt Nam' },
        'url': canonical,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Trang chủ', 'item': 'https://dongphucunivi.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Đồng Phục Gym', 'item': canonical },
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

export default function DongPhucGym({
  initialProducts,
  categoryCounts,
  enterpriseCounts,
  categoryArticle,
}) {
  return (
    <CategoryPageTemplate
      categorySlug={SLUG}
      initialProducts={initialProducts}
      categoryCounts={categoryCounts}
      enterpriseCounts={enterpriseCounts}
      ArticleComponent={GymUniviPage}
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
        enterpriseCounts: { total: 0, lines: [] },
        categoryArticle: null,
        meta: buildMeta(),
      },
    };
  }
}
