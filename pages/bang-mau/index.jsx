import DefaultLayout from "../../components/layout/DefaultLayout";
import BangMauHero from "../../components/univisport/bang-mau/BangMauHero";
import FabricColorExplorer from "../../components/univisport/bang-mau/FabricColorExplorer";
import BrandColorMatch from "../../components/univisport/bang-mau/BrandColorMatch";
import BangMauCTA from "../../components/univisport/bang-mau/BangMauCTA";
import { fabrics } from "../../data/fabrics";
import { fabricColors, getFeaturedColors } from "../../data/fabric-colors";

const META_TITLE = "Bảng Màu Vải Univi | Mã Màu Vải Đồng Phục";
const META_DESCRIPTION =
  "Khám phá bảng màu vải Univi với hàng trăm mã màu cho vải UNI COOL PIQUÉ, UNI QUICKDRY, UNI SUPERCOOL và UNI AIR. Lựa chọn màu phù hợp cho đồng phục thể thao và đồng phục doanh nghiệp.";
const CANONICAL = "https://dongphucunivi.com/bang-mau";
const OG_IMAGE = "https://dongphucunivi.com/thumbnail/bang-mau-univi.jpg";
const OG_IMAGE_ALT = "Bảng màu vải Univi - UNI COOL PIQUÉ, UNI QUICKDRY, UNI SUPERCOOL, UNI AIR";

export default function BangMauPage() {
  const featuredColors = getFeaturedColors();

  return (
    <DefaultLayout>
      <div className="h-[70px]" />
      <BangMauHero fabrics={fabrics} />
      <FabricColorExplorer fabrics={fabrics} colors={fabricColors} featuredColors={featuredColors} />
      <BrandColorMatch colors={fabricColors} fabrics={fabrics} />
      <BangMauCTA />
    </DefaultLayout>
  );
}

export async function getServerSideProps() {
  const meta = {
    title: META_TITLE,
    description: META_DESCRIPTION,
    keywords:
      "bảng màu vải Univi, mã màu vải đồng phục, màu vải polo cá sấu, màu vải quickdry, màu vải supercool, màu vải uniair, chọn màu đồng phục thể thao",
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
          { "@type": "ListItem", position: 2, name: "Bảng màu vải", item: CANONICAL },
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
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": `${CANONICAL}#fabric-list`,
        name: "Các dòng chất liệu vải Univi",
        numberOfItems: fabrics.length,
        itemListElement: fabrics.map((fabric, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `Vải ${fabric.name}`,
          url: `${CANONICAL}#${fabric.slug}`,
        })),
      },
    ],
  };

  return { props: { meta } };
}
