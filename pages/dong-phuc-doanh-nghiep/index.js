import DefaultLayout2 from '../../components/layout/DefaultLayout2';
import DoanhNghiepPillarPage, { doanhNghiepFaqs } from '../../components/univisport/bai-viet/DoanhNghiepPillarPage';

const SLUG = 'dong-phuc-doanh-nghiep';
const META_TITLE = 'Đồng Phục Doanh Nghiệp | Giải Pháp Đồng Bộ Nhận Diện B2B';
const META_DESCRIPTION =
  'Đồng phục doanh nghiệp theo nhận diện, vị trí và mục đích sử dụng. Tư vấn chọn mẫu, chất liệu, size, quy trình và giải pháp B2B cùng Đồng Phục Univi.';
const META_KEYWORDS =
  'đồng phục doanh nghiệp, đồng phục công ty, đồng phục doanh nghiệp cao cấp, đồng phục công ty đẹp, đồng phục doanh nghiệp theo yêu cầu, may đồng phục doanh nghiệp, đặt đồng phục công ty, đồng phục nhân viên, đồng phục công sở doanh nghiệp, đồng phục doanh nghiệp B2B, đồng phục công ty số lượng lớn, thiết kế đồng phục doanh nghiệp';
const OG_IMAGE = 'https://dongphucunivi.com/images/banner-home-1.jpg';
const OG_IMAGE_ALT = 'Đồng phục doanh nghiệp Univi thiết kế theo nhận diện thương hiệu';

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
          { '@type': 'ListItem', 'position': 2, 'name': 'Đồng Phục Doanh Nghiệp', 'item': canonical },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        'mainEntity': doanhNghiepFaqs.map(([question, answer]) => ({
          '@type': 'Question',
          'name': question,
          'acceptedAnswer': { '@type': 'Answer', 'text': answer },
        })),
      },
    ],
  };
}

export default function DongPhucDoanhNghiep() {
  return (
    <DefaultLayout2>
      <div className="h-[70px]" />
      <DoanhNghiepPillarPage />
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
