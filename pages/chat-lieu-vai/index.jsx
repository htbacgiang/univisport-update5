import React from 'react';
import DefaultLayout2 from '../../components/layout/DefaultLayout2';
import FabricCatalogView from '../../components/univisport/chat-lieu-vai/FabricCatalogView';
import { FABRIC_MATERIALS, FABRIC_FAQS } from '../../data/fabricMaterials';

const CANONICAL_URL = "https://dongphucunivi.com/chat-lieu-vai";
const META_TITLE = "Chất Liệu Vải May Đồng Phục Thể Thao Cao Cấp | Univi";
const META_DESCRIPTION =
  "Tổng hợp các dòng chất liệu vải thể thao cao cấp Univi: Uni Air, Uni Supercool, Uni Cool Piqué, Uni Elite, Uni Quickdry. Định lượng chuẩn 150-180 GSM, co giãn 4 chiều, nhanh khô, kiểm định chất lượng.";

export default function ChatLieuVaiPage({ meta }) {
  return (
    <DefaultLayout2>
      {/* 
          Trang Chất Liệu Vải — Giao diện chuẩn 100% brochure catalog theo thiết kế mẫu.
          Gọn gàng, tỉ lệ chuẩn, hiển thị trọn vẹn trên màn hình.
      */}
      <div className="bg-white min-h-[calc(100vh-140px)] pt-16 sm:pt-20 pb-6 sm:pb-10 px-2 sm:px-4 flex items-center justify-center">
        <h1 className="sr-only">
          Chất Liệu Vải May Đồng Phục Thể Thao Cao Cấp Univi
        </h1>
        <FabricCatalogView syncHash={true} />
      </div>
    </DefaultLayout2>
  );
}

// ─────────────────────────────────────────────────────────────
// SERVER SIDE PROPS - TOÀN BỘ THẺ META SEO & SCHEMA.ORG JSON-LD
// ─────────────────────────────────────────────────────────────
export async function getServerSideProps() {
  const meta = {
    title: META_TITLE,
    description: META_DESCRIPTION,
    keywords:
      "chất liệu vải univi, chất liệu vải thể thao, vải may đồng phục gym, vải uniair, vải supercool, vải cool pique, vải uni elite, vải quickdry, vải polyamide thể thao, vải polyester elastane, xưởng may đồng phục thể thao",
    author: "Đồng Phục Univi",
    robots: "index, follow",
    canonical: CANONICAL_URL,
    og: {
      title: META_TITLE,
      description: META_DESCRIPTION,
      type: "website",
      url: CANONICAL_URL,
      site_name: "Đồng Phục Univi",
      locale: "vi_VN",
      image: "https://dongphucunivi.com/images/chat-lieu-vai.webp",
      imageWidth: "1200",
      imageHeight: "630",
      imageAlt: "Bảng các dòng chất liệu vải may đồng phục thể thao cao cấp Univi",
    },
    twitter: {
      card: "summary_large_image",
      title: META_TITLE,
      description: META_DESCRIPTION,
      image: "https://dongphucunivi.com/images/chat-lieu-vai.webp",
    },
    schema: [
      // 1. BreadcrumbList Schema
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": `${CANONICAL_URL}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Trang chủ",
            item: "https://dongphucunivi.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Chất liệu vải",
            item: CANONICAL_URL,
          },
        ],
      },
      // 2. CollectionPage / WebPage Schema
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${CANONICAL_URL}#webpage`,
        url: CANONICAL_URL,
        name: META_TITLE,
        description: META_DESCRIPTION,
        inLanguage: "vi-VN",
        isPartOf: { "@id": "https://dongphucunivi.com/#website" },
        about: { "@id": "https://dongphucunivi.com/#organization" },
      },
      // 3. ItemList Schema (Danh mục 5 dòng vải)
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": `${CANONICAL_URL}#fabric-list`,
        name: "5 Dòng Chất Liệu Vải Thể Thao Cao Cấp Univi",
        description: "Danh sách các dòng chất liệu vải thể thao may đồng phục chuyên dụng",
        numberOfItems: FABRIC_MATERIALS.length,
        itemListElement: FABRIC_MATERIALS.map((fabric, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: `Chất liệu vải ${fabric.name}`,
          description: `${fabric.badge} - ${fabric.compositionText} - ${fabric.weight}`,
          url: `${CANONICAL_URL}#${fabric.id}`,
        })),
      },
      // 4. Product / Service Offer Schema
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${CANONICAL_URL}#product`,
        name: "Chất Liệu Vải May Đồng Phục Thể Thao Univi",
        image: "https://dongphucunivi.com/images/chat-lieu-vai.webp",
        description:
          "Dòng chất liệu vải thể thao cao cấp UniAir, SuperCool, Cool Piqué, Uni Elite, QuickDry phục vụ may đo đồng phục doanh nghiệp, phòng Gym, Yoga, Golf, Pickleball.",
        brand: {
          "@type": "Brand",
          name: "UNIVI",
        },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "VND",
          lowPrice: "120000",
          highPrice: "350000",
          offerCount: "5",
          availability: "https://schema.org/InStock",
          seller: { "@id": "https://dongphucunivi.com/#organization" },
        },
      },
      // 5. FAQPage Schema
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${CANONICAL_URL}#faq`,
        mainEntity: FABRIC_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return {
    props: {
      meta,
    },
  };
}
