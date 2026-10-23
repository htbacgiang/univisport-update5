import DefaultLayout from "../../components/layout/DefaultLayout";
import ContactPage from "../../components/univi/ContactPage";

export default function LienHe({ meta }) {
  return (
    <DefaultLayout
      title={meta?.title}
      desc={meta?.description}
      thumbnail={meta?.og?.image}
      meta={meta}
    >
      <h1 className="hidden">
        Liên hệ Đồng phục Univi - Tư vấn may đồng phục chất lượng cao
      </h1>

      <ContactPage />
    </DefaultLayout>
  );
}

export async function getServerSideProps() {
  const meta = {
    title: "Liên hệ Đồng phục Univi - Tư vấn may đồng phục chất lượng cao miễn phí",
    description:
      "Liên hệ ngay với Đồng phục Univi để được tư vấn may đồng phục chất lượng cao miễn phí. Hotline: 0834.204.999. Email: dongphucunivi@gmail.com. Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn 24/7.",
    keywords:
      "liên hệ Đồng phục Univi, tư vấn may đồng phục, hotline Đồng phục Univi, địa chỉ Đồng phục Univi, email Đồng phục Univi, tư vấn miễn phí, may đồng phục, đồng phục học sinh, đồng phục công sở",
    robots: "index, follow",
    author: "Đồng phục Univi",
    canonical: "https://dongphucunivi.com/lien-he",
    og: {
      title: "Liên hệ Đồng phục Univi - Tư vấn may đồng phục chất lượng cao miễn phí",
      description:
        "Liên hệ ngay với Đồng phục Univi để được tư vấn may đồng phục chất lượng cao miễn phí. Hotline: 0834.204.999. Email: dongphucunivi@gmail.com. Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn 24/7.",
      type: "website",
      image: "https://dongphucunivi.com/images/banner-home-1.jpg",
      imageWidth: "1200",
      imageHeight: "630",
      url: "https://dongphucunivi.com/lien-he",
      site_name: "Đồng phục Univi",
    },
    twitter: {
      card: "summary_large_image",
      title: "Liên hệ Đồng phục Univi - Tư vấn may đồng phục chất lượng cao miễn phí",
      description:
        "Liên hệ ngay với Đồng phục Univi để được tư vấn may đồng phục chất lượng cao miễn phí. Hotline: 0834.204.999. Email: dongphucunivi@gmail.com. Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn 24/7.",
      image: "https://dongphucunivi.com/images/banner-home-1.jpg",
      site: "@DongphucUnivi",
    },
    // ── Schema: BreadcrumbList + ContactPage (chỉ reference Organization qua @id) ──
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://dongphucunivi.com" },
          { "@type": "ListItem", "position": 2, "name": "Liên hệ", "item": "https://dongphucunivi.com/lien-he" },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "@id": "https://dongphucunivi.com/lien-he#webpage",
        "name": "Liên hệ Đồng phục Univi",
        "description": "Liên hệ với Đồng phục Univi để được tư vấn may đồng phục chất lượng cao. Hotline: 0834.204.999.",
        "url": "https://dongphucunivi.com/lien-he",
        "inLanguage": "vi-VN",
        "isPartOf": { "@id": "https://dongphucunivi.com/#website" },
        // Chỉ REFERENCE Organization qua @id — KHÔNG nhúng lại toàn bộ entity
        "about": { "@id": "https://dongphucunivi.com/#organization" },
        "mainEntity": { "@id": "https://dongphucunivi.com/#organization" },
      },
    ],
  };

  return {
    props: {
      meta,
    },
  };
}