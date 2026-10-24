import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import DefaultLayout2 from "../components/layout/DefaultLayout2";
import BannerTTG from "../components/tantruonggiang/BannerTTG";
import BlogHero from "../components/profiles/BlogHero";
import FeedbackSection from "../components/profiles/FeedbackSection";
import PostCard from "../components/common/PostCard";
import { readPostsFromDb, formatPosts } from "../lib/utils";
import ProductSlider from "../components/univisport/ProductSlider";
import CategoryFeaturedProduct from "../components/univisport/CategoryFeaturedProduct";
import CategoryGrid from "../components/univisport/CategoryGrid";
import HeroSection1 from "../components/univisport/HeroSection1";
import PartnersSection from "../components/univisport/PartnersSection";
import FabricCardComponent from "../components/univisport/FabricCardComponent";
import FabricCatalogView from "../components/univisport/chat-lieu-vai/FabricCatalogView";
import Mockup3DSection from "../components/univisport/Mockup3DSection";
import VideoFeedback from "../components/univisport/VideoFeedback";
import db from "../utils/db";
import Product from "../models/Product";
import Feedback from "../models/Feedback";
import HomepageSection from "../models/HomepageSection";
import HomepageFaqSettings from "../models/HomepageFaqSettings";
import { DEFAULT_HOMEPAGE_FAQS } from "../data/homepageFaqs";

// FAQComponent dùng window.AudioContext + Facebook SDK → không SSR được
const FAQComponent = dynamic(
  () => import("../components/univisport/FAQComponent"),
  { ssr: false }
);

// CTABannerSection dùng window.location.pathname → không SSR được
const CTABannerSection = dynamic(
  () => import("../components/univisport/CTABanner"),
  { ssr: false }
);

// ─────────────────────────────────────────────────────────────
// META OBJECT mặc định — dùng khi getServerSideProps lỗi
// Tách ra ngoài để tránh duplicate code ở catch block
// ─────────────────────────────────────────────────────────────
const DEFAULT_META = {
  title: "Đồng Phục Univi: Xưởng May Đồng Phục Thể Thao Tại Hà Nội",
  description:
    "Đồng Phục Univi - xưởng 2.000m² tại phường Chương Mỹ, Hà Nội, công suất 100.000 sp/tháng. Chuyên đồng phục thể thao, giải pháp đồng phục cho các câu lạc bộ, phòng tập & doanh nghiệp B2B. Vải UNI DRY kiểm định QCVN. Thiết kế miễn phí — gọi ngay: 0834.204.999",
  keywords:
    "đồng phục thể thao, đồng phục Gym, đồng phục Yoga, đồng phục Pilates, đồng phục Pickleball, đồng phục Áo Gió, đồng phục Áo Polo, đồng phục phòng tập, xưởng may đồng phục Hà Nội, công nghệ UNI DRY, đồng phục doanh nghiệp B2B, may đồng phục theo yêu cầu, Đồng Phục Univi",
  robots: "index, follow",
  author: "Đồng Phục Univi",
  canonical: "https://dongphucunivi.com/",
  og: {
    title: "Đồng Phục Univi: Xưởng May Đồng Phục Thể Thao Tại Hà Nội",
    description:
      "Xưởng sản xuất đồng phục thể thao chuyên dụng tại Hà Nội - công nghệ UNI DRY, vải nhập khẩu, kiểm định QCVN 01:2017/BCT. Phục vụ phòng tập Gym, Yoga, Pilates, Pickleball, Áo Gió, Áo Polo và doanh nghiệp toàn quốc.",
    type: "website",
    image: "https://dongphucunivi.com/images/banner-home-1.jpg",
    imageWidth: "1200",
    imageHeight: "630",
    imageAlt:
      "Xưởng sản xuất đồng phục thể thao Univi tại phường Chương Mỹ, Hà Nội - công suất 100.000 sản phẩm/tháng",
    url: "https://dongphucunivi.com/",
    site_name: "Đồng Phục Univi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Đồng Phục Univi: Xưởng May Đồng Phục Thể Thao Tại Hà Nội",
    description:
      "Xưởng sản xuất đồng phục thể thao chuyên dụng tại Hà Nội - công nghệ UNI DRY, vải nhập khẩu, kiểm định QCVN 01:2017/BCT.",
    image: "https://dongphucunivi.com/images/banner-home-1.jpg",
  },
  schema: [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://dongphucunivi.com/#webpage",
      "url": "https://dongphucunivi.com/",
      "name": "Đồng Phục Univi: Xưởng May Đồng Phục Thể Thao Tại Hà Nội",
      "description": "Đồng Phục Univi - xưởng 2.000m² tại phường Chương Mỹ, Hà Nội, công suất 100.000 sp/tháng. Chuyên đồng phục thể thao, giải pháp đồng phục cho các câu lạc bộ, phòng tập & doanh nghiệp B2B. Vải UNI DRY kiểm định QCVN. Thiết kế miễn phí — gọi ngay: 0834.204.999",
      "isPartOf": { "@id": "https://dongphucunivi.com/#website" },
      "about": { "@id": "https://dongphucunivi.com/#organization" },
      "inLanguage": "vi-VN",
    },
  ],
};

export default function Home({
  posts = [],
  sections = [],
  homepageFaqs = [],
  initialFeedbacks = [],
  meta = DEFAULT_META,
}) {
  return (
    <DefaultLayout2>
      <BannerTTG />
      <div className="container mx-auto px-4">
        <CategoryGrid />
      </div>
      {sections.map((section) =>
        section.products.length > 0 ? (
          <div key={section._id}>
            {section.sectionBanner?.isVisible && section.sectionBanner?.image && (
              <SectionBanner banner={section.sectionBanner} />
            )}
            <ProductSlider
              title={section.title}
              products={section.products}
              viewAllLink={section.viewAllLink}
            />
            {section.featuredProduct && (
              <CategoryFeaturedProduct
                product={section.featuredProduct}
                sectionTitle={section.title}
              />
            )}
          </div>
        ) : null
      )}

      <VideoSection />
      <FeedbackSection initialFeedbacks={initialFeedbacks} />
      <PartnersSection />
      <HeroSection1 />
      <div className="container mx-auto px-2 sm:px-4 mb-6 sm:mb-10 mt-3">
        <FabricCatalogView />
      </div>
      <VideoFeedback />
      <FAQComponent items={homepageFaqs} />
      <BlogHero />
      <div className="container mx-auto px-4 py-4 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="transform transition-all duration-300 hover:scale-105"
            >
              <PostCard post={post} />
            </div>

          ))}
        </div>



        <div className="flex justify-center mt-6">
          <Link
            href="/bai-viet"
            className="group inline-flex items-center text-gray-700 font-medium transform hover:-translate-y-1 transition-all duration-300 hover:text-[#105d97]"
          >
            <span className="mr-3">Xem tất cả</span>

          </Link>
        </div>
      </div>

      <CTABannerSection />
    </DefaultLayout2>
  );
}

// ─────────────────────────────────────────────────────────────
// VIDEO SECTION
// ─────────────────────────────────────────────────────────────
function VideoSection() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatVideoTime = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const rest = Math.floor(seconds % 60);
    return `${minutes}:${rest.toString().padStart(2, "0")}`;
  };

  // IntersectionObserver: Tự động phát video khi scroll vào view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Thử phát video (nếu trình duyệt chặn âm thanh tự động, fallback sang muted để phát được)
          const promise = video.play();
          if (promise !== undefined) {
            promise
              .then(() => {
                setPlaying(true);
              })
              .catch(() => {
                // Trình duyệt chặn autoplay có tiếng -> Chuyển sang tắt tiếng (muted) và phát lại
                video.muted = true;
                setMuted(true);
                video
                  .play()
                  .then(() => setPlaying(true))
                  .catch(() => setPlaying(false));
              });
          }
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      if (!video.duration) return;
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
    };
    const updateDuration = () => {
      setDuration(video.duration || 0);
      updateTime();
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    if (video.readyState >= 1) updateDuration();

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => { });
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const handleSeek = (event) => {
    const video = videoRef.current;
    const value = Number(event.target.value);
    setProgress(value);

    if (!video || !video.duration) return;
    video.currentTime = (value / 100) * video.duration;
    setCurrentTime(video.currentTime);
  };

  return (
    <div className="container mx-auto mt-6 mb-2 px-4" style={{ position: "relative" }}>
      <div className="group" style={{ position: "relative", borderRadius: "8px", overflow: "hidden", background: "#0a0a0a" }}>
        <video
          ref={videoRef}
          src="/video-univi-2-baseline.mp4"
          muted={muted}
          loop
          playsInline
          onClick={togglePlay}
          style={{ width: "100%", display: "block", cursor: "pointer" }}
        />

        {!playing && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label="Phát video"
            className="absolute inset-0 z-10 flex items-center justify-center border-0 bg-transparent p-0"
          >
            <span className="flex h-11 w-16 items-center justify-center rounded-xl bg-[#FF0000]/50 shadow-lg transition-transform duration-300 group-hover:scale-110">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <polygon points="6,4 20,12 6,20" />
              </svg>
            </span>
          </button>
        )}

        {/* Controls overlay */}
        <div
          onClick={(event) => event.stopPropagation()}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          <div className="pointer-events-auto absolute inset-x-0 bottom-0 h-4">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/40">
              <div
                className="h-full bg-red-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div
              className="absolute bottom-0 h-3 w-3 translate-y-1/2 rounded-full bg-red-500 shadow"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onInput={handleSeek}
              onChange={handleSeek}
              aria-label="Tua video"
              className="absolute inset-x-0 bottom-[-6px] m-0 h-6 w-full cursor-pointer opacity-0"
            />
          </div>

          <div
            className="pointer-events-auto flex items-center gap-3 px-4 pb-5 pt-12"
            style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.72))" }}
          >
            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              aria-label={playing ? "Tạm dừng" : "Phát"}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "50%",
                width: 40,
                height: 40,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.35)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
            >
              {playing ? (
                // Pause icon
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <rect x="5" y="3" width="4" height="18" rx="1" />
                  <rect x="15" y="3" width="4" height="18" rx="1" />
                </svg>
              ) : (
                // Play icon
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>

            {/* Mute / Unmute */}
            <button
              onClick={toggleMute}
              aria-label={muted ? "Bật tiếng" : "Tắt tiếng"}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "50%",
                width: 40,
                height: 40,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.35)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
            >
              {muted ? (
                // Muted icon
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                // Sound icon
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>

            <span className="ml-auto whitespace-nowrap text-xs tabular-nums text-white/80 sm:text-sm">
              {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION BANNER
// ─────────────────────────────────────────────────────────────
function BannerImg({ src, mobileSrc, alt, radius }) {
  return (
    <picture className="block">
      <source media="(max-width: 639px)" srcSet={mobileSrc} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="block h-auto w-full"
        style={{ borderRadius: `${radius}px` }}
      />
    </picture>
  );
}

function SectionBanner({ banner }) {
  const radius = banner.borderRadius ?? 8;
  const mobileSrc = banner.mobileImage || banner.image;

  const content = (
    <div
      className="w-full overflow-hidden container mx-auto"
      style={{ borderRadius: `${radius}px` }}
    >
      <BannerImg
        src={banner.image}
        mobileSrc={mobileSrc}
        alt="banner"
        radius={radius}
      />
    </div>
  );

  return (
    <div className="container mx-auto mb-2 mt-3 ">
      {banner.link ? (
        <Link
          href={banner.link}
          className="block"
          aria-label="banner"
          {...(banner.openInNewTab
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {content}
        </Link>
      ) : content}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAP PRODUCT — không đổi
// ─────────────────────────────────────────────────────────────
function mapProduct(product) {
  if (!product) return null;
  return {
    id: product.id,
    name: product.name,
    maSanPham: product.maSanPham || "",
    description: product.description || "",
    price: product.price,
    maxPrice: product.originalPrice || product.price,
    discount: product.originalPrice
      ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
      : 0,
    isNew: product.isNew || false,
    isFeatured: product.isFeatured || false,
    featuredConfig: product.featuredConfig
      ? {
        customTitle: product.featuredConfig.customTitle || "",
        customSubtitle: product.featuredConfig.customSubtitle || "",
        customDescription: product.featuredConfig.customDescription || "",
        customImage: product.featuredConfig.customImage || "",
        customSecondaryImage: product.featuredConfig.customSecondaryImage || "",
        videoUrl: product.featuredConfig.videoUrl || "",
        badgeText: product.featuredConfig.badgeText || "",
        soldCount: product.featuredConfig.soldCount || "",
        recentCustomers: product.featuredConfig.recentCustomers || "",
      }
      : null,
    rating: product.rating ?? 5,
    reviewCount: product.reviewCount ?? 15,
    categoryNameVN: product.categoryNameVN || "",
    sizes: product.sizes && product.sizes.length > 0
      ? product.sizes
      : ["Extra Large", "Extra Small", "Large", "Medium", "Small"],
    colors: Array.isArray(product.colors)
      ? product.colors.map((color) => ({
        name: color.name || "Màu",
        hex: color.hex || "#000000",
        hex2: color.hex2 || "",
        image: color.image || "",
      }))
      : [],
    gallery: Array.isArray(product.gallery)
      ? product.gallery.map((g) => (typeof g === "string" ? g : g.src || ""))
      : [],
    image:
      product.colors && product.colors.length > 0
        ? product.colors[0].image
        : product.image || "",
    slug: product.slug || "",
  };
}

// ─────────────────────────────────────────────────────────────
// FALLBACK SECTIONS & CORPORATE CATEGORY FILTER
// ─────────────────────────────────────────────────────────────
const SECTION_CATEGORY_ALIASES = {
  "dong-phuc-polo": ["dong-phuc-polo", "dong-phuc-ao-polo", "polo"],
  "dong-phuc-ao-polo": ["dong-phuc-polo", "dong-phuc-ao-polo", "polo"],
  "polo": ["dong-phuc-polo", "dong-phuc-ao-polo", "polo"],

  "dong-phuc-so-mi": ["dong-phuc-so-mi", "so-mi"],
  "so-mi": ["dong-phuc-so-mi", "so-mi"],

  "dong-phuc-vest-cong-so": ["dong-phuc-vest-cong-so", "dong-phuc-vest", "vest"],
  "dong-phuc-vest": ["dong-phuc-vest-cong-so", "dong-phuc-vest", "vest"],
  "vest": ["dong-phuc-vest-cong-so", "dong-phuc-vest", "vest"],

  "dong-phuc-teambuilding": ["dong-phuc-teambuilding", "teambuilding"],
  "teambuilding": ["dong-phuc-teambuilding", "teambuilding"],

  "dong-phuc-ao-gio-doanh-nghiep": ["dong-phuc-ao-gio-doanh-nghiep", "dong-phuc-ao-gio", "ao-gio"],

  "bao-ho-lao-dong": ["bao-ho-lao-dong", "bao-ho"],
  "bao-ho": ["bao-ho-lao-dong", "bao-ho"],

  "phu-kien-qua-tang-doanh-nghiep": [
    "phu-kien-qua-tang-doanh-nghiep",
    "qua-tang-phu-kien-doanh-nghiep",
    "phu-kien",
  ],
  "phu-kien": [
    "phu-kien-qua-tang-doanh-nghiep",
    "qua-tang-phu-kien-doanh-nghiep",
    "phu-kien",
  ],
};

const CORPORATE_CATEGORY_MAP = {
  "dong-phuc-polo": "polo",
  "dong-phuc-ao-polo": "polo",
  "polo": "polo",
  "dong-phuc-so-mi": "so-mi",
  "so-mi": "so-mi",
  "dong-phuc-vest-cong-so": "vest",
  "dong-phuc-vest": "vest",
  "vest": "vest",
  "dong-phuc-teambuilding": "teambuilding",
  "teambuilding": "teambuilding",
  "dong-phuc-ao-gio-doanh-nghiep": "ao-gio",
  "bao-ho-lao-dong": "bao-ho",
  "bao-ho": "bao-ho",
  "phu-kien-qua-tang-doanh-nghiep": "phu-kien",
  "phu-kien": "phu-kien",
};

function filterProductsForSection(products, sectionCategory) {
  const aliases = SECTION_CATEGORY_ALIASES[sectionCategory] || [sectionCategory];
  const mappedProductLine = CORPORATE_CATEGORY_MAP[sectionCategory];

  return products.filter((p) => {
    if (aliases.includes(p.category)) return true;
    if (p.category === "dong-phuc-doanh-nghiep") {
      if (sectionCategory === "dong-phuc-doanh-nghiep") return true;
      if (mappedProductLine && p.productLine === mappedProductLine) return true;
    }
    return false;
  });
}

const FALLBACK_SECTIONS = [
  {
    _id: "gym",
    title: "Đồng Phục Gym",
    category: "dong-phuc-gym",
    viewAllLink: "/dong-phuc-gym",
    productLimit: 12,
  },
  {
    _id: "polo",
    title: "Polo Doanh Nghiệp",
    category: "dong-phuc-polo",
    viewAllLink: "/dong-phuc-polo",
    productLimit: 12,
  },
  {
    _id: "pickleball",
    title: "Đồng Phục Pickleball",
    category: "dong-phuc-pickleball",
    viewAllLink: "/dong-phuc-pickleball",
    productLimit: 12,
  },
  {
    _id: "yoga",
    title: "Đồng Phục Yoga",
    category: "dong-phuc-yoga-pilates",
    viewAllLink: "/dong-phuc-yoga-pilates",
    productLimit: 12,
  },
  {
    _id: "ao-gio",
    title: "Đồng Phục Áo Gió",
    category: "dong-phuc-ao-gio",
    viewAllLink: "/dong-phuc-ao-gio",
    productLimit: 12,
  },
  {
    _id: "golf",
    title: "Đồng Phục Golf - Tennis",
    category: "dong-phuc-golf-tennis",
    viewAllLink: "/dong-phuc-golf-tennis",
    productLimit: 12,
  },
];

// ─────────────────────────────────────────────────────────────
// GET SERVER SIDE PROPS
// ─────────────────────────────────────────────────────────────
export async function getServerSideProps() {
  try {
    const posts = await readPostsFromDb(3, 0);
    const formattedPosts = formatPosts(posts);

    await db.connectDb();
    const productsData = (await Product.find({ visibleOnHome: { $ne: false } }).sort({ displayOrder: 1, createdAt: -1 }).lean()) || [];

    let sectionConfigs = [];
    try {
      sectionConfigs = await HomepageSection.find({ isVisible: true })
        .sort({ order: 1 })
        .lean();
    } catch {
      // ignore — fallback bên dưới xử lý
    }
    if (!sectionConfigs || sectionConfigs.length === 0) {
      sectionConfigs = FALLBACK_SECTIONS;
    }

    const sections = sectionConfigs.map((section) => {
      const categoryProducts = filterProductsForSection(productsData, section.category);
      const featured = categoryProducts.find((p) => p.isFeatured === true) || null;
      return {
        _id: String(section._id),
        title: section.title,
        viewAllLink: section.viewAllLink,
        sectionBanner: section.sectionBanner
          ? {
            image: section.sectionBanner.image || "",
            mobileImage: section.sectionBanner.mobileImage || "",
            link: section.sectionBanner.link || "",
            openInNewTab: section.sectionBanner.openInNewTab ?? false,
            isVisible: section.sectionBanner.isVisible ?? false,
            borderRadius: section.sectionBanner.borderRadius ?? 8,
          }
          : null,
        products: categoryProducts
          .slice(0, section.productLimit)
          .map(mapProduct),
        featuredProduct: featured ? mapProduct(featured) : null,
      };
    });

    const faqSettings = await HomepageFaqSettings.findOne({
      key: "homepage",
    }).lean();
    const faqSource = faqSettings
      ? faqSettings.faqs
      : DEFAULT_HOMEPAGE_FAQS;
    const homepageFaqs = [...faqSource]
      .filter((faq) => faq.isVisible !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((faq, index) => ({
        _id: faq._id ? String(faq._id) : `default-${index}`,
        question: faq.question,
        answer: faq.answer,
        image: faq.image || "/images/thumb-univi.jpg",
        video: faq.video || "",
      }));

    // Fetch 15 feedback mới nhất cho SSR — Google thấy nội dung thật
    let initialFeedbacks = [];
    try {
      const rawFeedbacks = await Feedback.find({}).sort({ createdAt: -1 }).limit(15).lean();
      initialFeedbacks = rawFeedbacks.map(p => ({
        title: p.title,
        image: p.image || '/images/dong-phuc-default.jpg',
        link: `/feedback/${p.slug}`,
      }));
    } catch {
      // ignore — FeedbackSection sẽ tự fetch client-side nếu không có SSR data
    }

    return {
      props: {
        posts: formattedPosts,
        sections,
        homepageFaqs,
        initialFeedbacks,
        meta: DEFAULT_META,
      },
    };
  } catch (error) {
    console.error("getServerSideProps error:", error.message, error.stack);
    return {
      props: {
        posts: [],
        sections: [],
        homepageFaqs: DEFAULT_HOMEPAGE_FAQS,
        initialFeedbacks: [],
        meta: DEFAULT_META,
      },
    };
  }
}
