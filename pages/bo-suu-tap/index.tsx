import { useState } from "react";
import DefaultLayout2 from "../../components/layout/DefaultLayout2";
import CollectionHero from "../../components/collection/CollectionHero";
import CollectionFilter from "../../components/collection/CollectionFilter";
import Reveal from "../../components/collection/Reveal";
import EditorialLookbook from "../../components/collection/EditorialLookbook";
import CollectionShowcase from "../../components/collection/CollectionShowcase";
import FeaturedProducts, { FeaturedProduct } from "../../components/collection/FeaturedProducts";
import TheUniviLook from "../../components/collection/TheUniviLook";
import TechnologySection from "../../components/collection/TechnologySection";
import B2BSolutions from "../../components/collection/B2BSolutions";
import CollectionCTA from "../../components/collection/CollectionCTA";
import CTABannerSection from "../../components/univisport/CTABanner";
import { collectionFilters } from "../../data/collection/filters";
import { lookbookItems as fallbackItems, LookbookItem as LookbookItemType } from "../../data/collection/lookbookItems";
import { collectionEntries } from "../../data/collection/collections";
import { technologies } from "../../data/collection/technologies";
import { solutions } from "../../data/collection/solutions";
import { getAllProducts } from "../../lib/getProductsByCategory";
import db from "../../utils/db";
import LookbookItemModel from "../../models/LookbookItem";

const SLUG = "bo-suu-tap";
const META_TITLE = "Bộ Sưu Tập Đồng Phục Thể Thao 2026 | Đồng Phục Univi";
const META_DESCRIPTION =
  "Khám phá bộ sưu tập đồng phục thể thao chuyên nghiệp của Đồng Phục Univi dành cho Gym, Fitness, Pickleball, Yoga, Running, MMA, đội nhóm và doanh nghiệp.";
const OG_IMAGE = "https://dongphucunivi.com/thumbnail/bo-suu-tap.jpg";

function buildMeta(featuredProducts: FeaturedProduct[]) {
  const canonical = `https://dongphucunivi.com/${SLUG}`;
  return {
    title: META_TITLE,
    description: META_DESCRIPTION,
    keywords:
      "bộ sưu tập đồng phục thể thao, đồng phục Gym, đồng phục Pickleball, đồng phục Yoga Pilates, đồng phục chạy bộ, đồng phục MMA, đồng phục doanh nghiệp, Đồng Phục Univi",
    robots: "index, follow",
    canonical,
    og: {
      title: META_TITLE,
      description: META_DESCRIPTION,
      type: "website",
      image: OG_IMAGE,
      imageWidth: "1200",
      imageHeight: "630",
      imageAlt: "Bộ sưu tập đồng phục thể thao Đồng Phục Univi",
      url: canonical,
      site_name: "Đồng Phục Univi",
      locale: "vi_VN",
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
        "@type": "CollectionPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: META_TITLE,
        description: META_DESCRIPTION,
        isPartOf: { "@id": "https://dongphucunivi.com/#website" },
        about: { "@id": "https://dongphucunivi.com/#organization" },
        inLanguage: "vi-VN",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://dongphucunivi.com/" },
          { "@type": "ListItem", position: 2, name: "Bộ sưu tập", item: canonical },
        ],
      },
      ...(featuredProducts.length > 0
        ? [
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "@id": `${canonical}#itemlist`,
            name: META_TITLE,
            url: canonical,
            numberOfItems: featuredProducts.length,
            itemListElement: featuredProducts.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://dongphucunivi.com/san-pham/${p.slug}`,
              name: p.name,
            })),
          },
        ]
        : []),
    ],
  };
}

interface BoSuuTapPageProps {
  featuredProducts: FeaturedProduct[];
  lookbookList: LookbookItemType[];
}
export default function BoSuuTapPage({ featuredProducts, lookbookList }: BoSuuTapPageProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const itemsToRender = lookbookList && lookbookList.length > 0 ? lookbookList : fallbackItems;

  return (
    <DefaultLayout2>
      <CollectionHero />
      <Reveal className="container mx-auto px-4 md:px-6 pt-10 md:pt-20">
        <p className="text-center text-secondary-dark text-sm md:text-base mb-4 md:mb-6">
          Chọn bộ môn bạn quan tâm để xem bộ sưu tập tương ứng.
        </p>
        <CollectionFilter filters={collectionFilters} activeId={activeFilter} onChange={setActiveFilter} />
      </Reveal>

      <EditorialLookbook items={itemsToRender} filters={collectionFilters} activeFilter={activeFilter} />

      <CollectionShowcase collections={collectionEntries} />

      <FeaturedProducts products={featuredProducts} />

      <TheUniviLook />

      <TechnologySection technologies={technologies} />

      <B2BSolutions solutions={solutions} />

      <CollectionCTA />

    </DefaultLayout2>
  );
}

export async function getServerSideProps() {
  const allProducts = await getAllProducts();

  const targetCategorySlugs = [
    "dong-phuc-gym",
    "dong-phuc-pickleball",
    "dong-phuc-yoga-pilates",
  ];

  const targetProducts = allProducts.filter((p: any) => {
    if (targetCategorySlugs.includes(p.category)) return true;
    const catVN = (p.categoryNameVN || "").toLowerCase();
    return catVN.includes("gym") || catVN.includes("pickleball") || catVN.includes("yoga") || catVN.includes("pilates");
  });

  const featuredPool = targetProducts.filter((p: any) => p.isFeatured);
  const backfillPool = targetProducts.filter((p: any) => !p.isFeatured);
  const remainingPool = allProducts.filter((p: any) => !targetProducts.some((tp: any) => tp.id === p.id));

  const finalPool = [...featuredPool, ...backfillPool, ...remainingPool];

  const featuredProducts = finalPool.slice(0, 8).map((p: any) => ({
    id: p.id,
    maSanPham: p.maSanPham || "",
    name: p.name,
    image: p.image,
    slug: p.slug,
    categoryNameVN: p.categoryNameVN || "",
  }));

  let lookbookList: LookbookItemType[] = fallbackItems;
  try {
    await db.connectDb();
    const dbItems = await LookbookItemModel.find({ isVisible: { $ne: false } })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    if (dbItems && dbItems.length > 0) {
      lookbookList = dbItems.map((item: any) => ({
        id: item._id ? item._id.toString() : item.id,
        image: item.image,
        alt: item.alt,
        filterIds: item.filterIds || [],
        size: item.size || "md",
      }));
    }
  } catch (err) {
    lookbookList = fallbackItems;
  }

  return {
    props: {
      featuredProducts,
      lookbookList,
      meta: buildMeta(featuredProducts),
    },
  };
}
