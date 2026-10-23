import DefaultLayout from "../../components/layout/DefaultLayout";
import UniformStylesZippedComponent from "../../components/univisport/UniformStylesZippedComponent";

const META_TITLE = "Mẫu Áo Gym Cổ Có Khoá | Đồng Phục Gym Univi";
const META_DESCRIPTION =
  "BST Mẫu Áo Gym Cổ Có Khoá Univi - Bao gồm Áo cổ tròn có khoá & Áo cổ trụ có khoá Powerzip. Thiết kế thể thao, co giãn 4 chiều, tùy chọn phối màu cổ & tay theo thương hiệu.";
const CANONICAL = "https://dongphucunivi.com/mau-ao-gym-co-co-khoa";
const OG_IMAGE = "https://dongphucunivi.com/mockup/mau-ao-gym-co-polo.png";
const OG_IMAGE_ALT = "Kiểu dáng mẫu áo gym cổ có khoá Univi";

export default function MauAoGymCoCoKhoaPage() {
  return (
    <DefaultLayout>
      <div className="h-[70px]" />
      <main className="bg-white min-h-screen">
        <UniformStylesZippedComponent />
      </main>
    </DefaultLayout>
  );
}

export async function getServerSideProps() {
  const meta = {
    title: META_TITLE,
    description: META_DESCRIPTION,
    keywords:
      "mẫu áo gym cổ có khoá, áo gym cổ tròn có khoá, áo gym cổ trụ có khoá, áo gym khoá kéo powerzip, đồng phục PT gym có khoá, xưởng may đồng phục gym Univi",
    author: "Đồng Phục Univi",
    robots: "index, follow",
    canonical: CANONICAL,
    og: {
      title: META_TITLE,
      description: META_DESCRIPTION,
      type: "website",
      url: CANONICAL,
      site_name: "Đồng Phục Univi",
      locale: "vi_VN",
      image: OG_IMAGE,
      imageAlt: OG_IMAGE_ALT,
    },
    twitter: {
      card: "summary_large_image",
      title: META_TITLE,
      description: META_DESCRIPTION,
      image: OG_IMAGE,
    },
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": `${CANONICAL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://dongphucunivi.com/" },
          { "@type": "ListItem", position: 2, name: "Mẫu áo gym cổ có khoá", item: CANONICAL },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${CANONICAL}#webpage`,
        url: CANONICAL,
        name: META_TITLE,
        description: META_DESCRIPTION,
        inLanguage: "vi-VN",
        isPartOf: { "@id": "https://dongphucunivi.com/#website" },
        about: { "@id": "https://dongphucunivi.com/#organization" },
      },
    ],
  };

  return { props: { meta } };
}
