import DefaultLayout from "../../components/layout/DefaultLayout";
import UniformStylesPoloComponent from "../../components/univisport/UniformStylesPoloComponent";

const META_TITLE = "Mẫu Áo Gym Cổ Polo | Đồng Phục Gym Univi";
const META_DESCRIPTION =
  "BST Mẫu Áo Gym Cổ Polo Univi - Bao gồm thiết kế Áo Polo Cổ Cúc truyền thống & Áo Polo Cổ Khóa Kéo Powerzip. Tùy chọn phối màu cổ & tay theo nhận diện thương hiệu.";
const CANONICAL = "https://dongphucunivi.com/mau-ao-gym-co-polo";
const OG_IMAGE = "https://dongphucunivi.com/mockup/mau-ao-gym-co-khoa.png";
const OG_IMAGE_ALT = "Kiểu dáng mẫu áo gym cổ polo Univi";

export default function MauAoGymCoPoloPage() {
  return (
    <DefaultLayout>
      <div className="h-[70px]" />
      <main className="bg-white min-h-screen">
        <UniformStylesPoloComponent />
      </main>
    </DefaultLayout>
  );
}

export async function getServerSideProps() {
  const meta = {
    title: META_TITLE,
    description: META_DESCRIPTION,
    keywords:
      "mẫu áo gym cổ polo, áo polo gym Univi, áo polo có cúc gym, áo polo có khóa kéo gym, đồng phục lễ tân gym polo, xưởng may đồng phục gym Univi",
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
          { "@type": "ListItem", position: 2, name: "Mẫu áo gym cổ polo", item: CANONICAL },
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
