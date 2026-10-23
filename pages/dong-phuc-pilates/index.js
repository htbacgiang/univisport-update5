import CategoryPageTemplate from '../../components/univisport/CategoryPageTemplate';
import PilatesUniviPage, { pilatesFaqs } from '../../components/univisport/bai-viet/PilatesUniviPage';
import { getProductsByCategory, getSidebarNavCounts } from '../../lib/getProductsByCategory';
import { getCategoryArticleSetting } from '../../lib/categoryArticleSettings';

const SLUG = 'dong-phuc-pilates';
const META_TITLE = 'Đồng phục Pilates cho studio & HLV | Đồng phục Univi';
const META_DESCRIPTION =
  'Cách chọn đồng phục Pilates cho studio và HLV: chất liệu, form, màu, các mẫu Pilates, quy trình đặt may và giải pháp từ Univi.';
const META_KEYWORDS =
  'đồng phục Pilates, đồng phục Pilates Studio, đồng phục HLV Pilates, đồng phục giáo viên Pilates, đồng phục Pilates Reformer, may đồng phục Pilates, vải Super Cool, công nghệ UNI DRY, giải pháp 2S Uniform, jumpsuit Pilates';
const OG_IMAGE = 'https://dongphucunivi.com/thumbnail/dong-phuc-pilates.jpg';
const OG_IMAGE_ALT = 'Đồng phục Pilates chuyên nghiệp cho studio và HLV - Đồng phục Univi';

function buildFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `https://dongphucunivi.com/${SLUG}#faq`,
    'mainEntity': pilatesFaqs.map(([question, answer]) => ({
      '@type': 'Question',
      'name': question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': answer,
      },
    })),
  };
}

function buildArticleSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `https://dongphucunivi.com/${SLUG}#article`,
    'headline': 'Đồng phục Pilates: giải pháp đồng phục chuyên nghiệp cho studio và HLV',
    'description': META_DESCRIPTION,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://dongphucunivi.com/${SLUG}`,
    },
    'author': {
      '@type': 'Organization',
      'name': 'Đồng Phục Univi',
      'url': 'https://dongphucunivi.com',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Đồng Phục Univi',
      'url': 'https://dongphucunivi.com',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://dongphucunivi.com/logo-univi.webp',
      },
    },
    'inLanguage': 'vi-VN',
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
        'name': 'May đồng phục Pilates thiết kế theo yêu cầu cho Studio & HLV',
        'description': META_DESCRIPTION,
        'provider': { '@id': 'https://dongphucunivi.com/#organization' },
        'serviceType': 'May đồng phục thể thao theo yêu cầu',
        'category': 'Đồng phục Pilates',
        'areaServed': { '@type': 'Country', 'name': 'Việt Nam' },
        'url': canonical,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Trang chủ', 'item': 'https://dongphucunivi.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Đồng Phục Pilates', 'item': canonical },
        ],
      },
      ...(products.length > 0
        ? [
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': `${canonical}#itemlist`,
            'name': 'Bộ sưu tập Yoga – Pilates của Univi',
            'url': canonical,
            'numberOfItems': products.length,
            'itemListElement': products.slice(0, 20).map((p, i) => ({
              '@type': 'ListItem',
              'position': i + 1,
              'url': `https://dongphucunivi.com/san-pham/${p.slug}`,
              'name': p.name,
            })),
          },
        ]
        : [
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': `${canonical}#itemlist`,
            'name': 'Bộ sưu tập Yoga – Pilates của Univi',
            'url': canonical,
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'AG29', 'url': 'https://dongphucunivi.com/san-pham/ao-dong-phuc-pilates-ag29' },
              { '@type': 'ListItem', 'position': 2, 'name': 'PL15', 'url': 'https://dongphucunivi.com/san-pham/dong-phuc-pilates-pl15' },
              { '@type': 'ListItem', 'position': 3, 'name': 'ACT1', 'url': 'https://dongphucunivi.com/san-pham/dong-phuc-yoga-act1' },
              { '@type': 'ListItem', 'position': 4, 'name': 'ACT7', 'url': 'https://dongphucunivi.com/san-pham/dong-phuc-yoga-act7' },
              { '@type': 'ListItem', 'position': 5, 'name': 'APL1', 'url': 'https://dongphucunivi.com/san-pham/dong-phuc-pilates-apl1' },
              { '@type': 'ListItem', 'position': 6, 'name': 'BDCV', 'url': 'https://dongphucunivi.com/san-pham/dong-phuc-yoga-bdcv' },
            ],
          },
        ]),
      buildArticleSchema(),
      buildFaqSchema(),
    ],
  };
}

export default function DongPhucPilates({ initialProducts, categoryCounts, gymCounts, enterpriseCounts, categoryArticle }) {
  return (
    <CategoryPageTemplate
      categorySlug={SLUG}
      initialProducts={initialProducts}
      categoryCounts={categoryCounts}
      gymCounts={gymCounts}
      enterpriseCounts={enterpriseCounts}
      ArticleComponent={PilatesUniviPage}
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
    console.error('Error fetching products for dong-phuc-pilates:', error.message);
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
