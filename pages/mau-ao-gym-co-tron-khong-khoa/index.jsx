import DefaultLayout from "../../components/layout/DefaultLayout";
import UniformStylesComponent from "../../components/univisport/UniformStylesComponent";

const META_TITLE = "Mẫu Áo Gym Cổ Tròn Không Khoá | Đồng Phục Gym Univi";
const META_DESCRIPTION =
  "BST Mẫu Áo Gym Cổ Tròn Không Khoá Univi - Thiết kế chuẩn Athletic Fit, chất liệu UNI DRY thoát ẩm nhanh chóng, tùy chọn phối màu cổ & tay theo thương hiệu.";
const CANONICAL = "https://dongphucunivi.com/mau-ao-gym-co-tron-khong-khoa";
const OG_IMAGE = "https://dongphucunivi.com/mockup/mau-ao-gym-co-tron-ko-khoa.jpg";
const OG_IMAGE_ALT = "Kiểu dáng mẫu áo gym cổ tròn không khoá Univi";

export default function MauAoGymCoTronKhongKhoaPage() {
  return (
    <DefaultLayout>
      <div className="h-[70px]" />
      <main className="bg-white min-h-screen">
        <UniformStylesComponent />
      </main>
    </DefaultLayout>
  );
}

export async function getServerSideProps() {
  const meta = {
    title: META_TITLE,
    description: META_DESCRIPTION,
    keywords:
      "mẫu áo gym cổ tròn không khoá, áo gym Univi, đồng phục PT gym cổ tròn, áo thun gym phối tay raglan, xưởng may đồng phục gym Univi",
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
          { "@type": "ListItem", position: 2, name: "Mẫu áo gym cổ tròn không khoá", item: CANONICAL },
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
