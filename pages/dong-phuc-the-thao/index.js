import DefaultLayout2 from '../../components/layout/DefaultLayout2';
import TheThaoPillarPage, { theThaoFaqs } from '../../components/univisport/bai-viet/TheThaoPillarPage';

const SLUG = 'dong-phuc-the-thao';
const META_TITLE = 'Đồng Phục Thể Thao Chuyên Dụng Theo Bộ Môn | Univi';
const META_DESCRIPTION =
  'Tìm hiểu cách chọn đồng phục thể thao chuyên dụng cho Gym, Yoga, Pickleball, Running, MMA, Golf, Tennis và đội nhóm. Khám phá vật liệu, thiết kế, quy trình và năng lực Đồng Phục Univi.';
const META_KEYWORDS =
  'đồng phục thể thao chuyên dụng, đồng phục thể thao, may đồng phục thể thao, đồng phục phòng tập, đồng phục Gym, đồng phục Fitness, đồng phục Yoga Pilates, đồng phục Pickleball, đồng phục chạy bộ, đồng phục MMA, đồng phục đội nhóm, đồng phục HLV PT, áo polo thể thao, chất liệu đồng phục thể thao';
const OG_IMAGE = 'https://dongphucunivi.com/images/dong-phuc-the-thao.jpg';
const OG_IMAGE_ALT = 'Đồng phục thể thao chuyên dụng theo từng bộ môn Univi';

function buildMeta() {
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
        '@type': 'WebPage',
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
          { '@type': 'ListItem', 'position': 2, 'name': 'Đồng Phục Thể Thao', 'item': canonical },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        'mainEntity': theThaoFaqs.map(([question, answer]) => ({
          '@type': 'Question',
          'name': question,
          'acceptedAnswer': { '@type': 'Answer', 'text': answer },
        })),
      },
    ],
  };
}

export default function DongPhucTheThaoPage() {
  return (
    <DefaultLayout2>
      <div className="h-[70px]" />
      <TheThaoPillarPage />
    </DefaultLayout2>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      meta: buildMeta(),
    },
  };
}
