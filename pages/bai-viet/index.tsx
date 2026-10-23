import { useMemo, useRef, useState } from "react";
import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaCalendarAlt, FaRegCalendarAlt, FaRegComments, FaStar } from "react-icons/fa";
import DefaultLayout2 from "../../components/layout/DefaultLayout2";
import { readAllPostsFromDb, formatPosts } from "../../lib/utils";
import { PostDetail } from "../../utils/types";

type MetaData = {
  title: string;
  description: string;
  keywords: string;
  author: string;
  robots: string;
  canonical: string;
  og: {
    title: string;
    description: string;
    type: string;
    image: string;
    imageWidth: string;
    imageHeight: string;
    url: string;
    site_name: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
};

interface Props {
  initialPosts: PostDetail[];
}

const meta: MetaData = {
  title: "Bài viết - Đồng phục Univi",
  description:
    "Cập nhật các bài viết mới nhất về đồng phục thể thao, đồng phục doanh nghiệp, xu hướng thiết kế và kinh nghiệm chọn đồng phục chất lượng từ Đồng phục Univi",
  keywords:
    "đồng phục thể thao, đồng phục doanh nghiệp, kiến thức chất liệu, công nghệ in thêu, thiết kế đồng phục, bài viết univi",
  author: "Đồng phục Univi",
  robots: "index, follow",
  canonical: "https://dongphucunivi.com/bai-viet",
  og: {
    title: "Bài viết - Đồng phục Univi",
    description:
      "Cập nhật các bài viết mới nhất về đồng phục thể thao, đồng phục doanh nghiệp, xu hướng thiết kế và kinh nghiệm chọn đồng phục chất lượng từ Đồng phục Univi",
    type: "website",
    image: "https://dongphucunivi.com/images/banner-1.webp",
    imageWidth: "1200",
    imageHeight: "630",
    url: "https://dongphucunivi.com/bai-viet",
    site_name: "Đồng phục Univi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bài viết - Đồng phục Univi",
    description:
      "Cập nhật các bài viết mới nhất về đồng phục thể thao, đồng phục doanh nghiệp, xu hướng thiết kế và kinh nghiệm chọn đồng phục chất lượng từ Đồng phục Univi",
    image: "https://dongphucunivi.com/images/banner-1.webp",
  },
};

const DEFAULT_CATEGORIES = [
  "Đồng phục thể thao",
  "Đồng phục doanh nghiệp",
  "Kiến thức chất liệu & công nghệ",
  "Kiến thiết kế & branding",
  "Phản hồi khách hàng",
];

const Blogs: NextPage<Props> = ({ initialPosts = [] }) => {
  const posts = initialPosts;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const filterBarRef = useRef<HTMLDivElement | null>(null);

  const postsPerPage = 12;
  const featuredPostsCount = 5;

  const displayCategories = useMemo(() => {
    const customCats = posts
      .map((p) => p.category?.trim())
      .filter((cat): cat is string => Boolean(cat));
    const allCats = Array.from(new Set([...DEFAULT_CATEGORIES, ...customCats]));

    const seen = new Set<string>();
    const result: string[] = [];

    for (const cat of allCats) {
      const normalized = cat.toLowerCase().trim();
      if (!seen.has(normalized)) {
        const hasPosts = posts.some(
          (p) => (p.category || "").toLowerCase().trim() === normalized
        );
        if (hasPosts) {
          seen.add(normalized);
          result.push(cat);
        }
      }
    }

    return result;
  }, [posts]);

  const formatDate = (date: string): string => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined" && filterBarRef.current) {
      const headerOffset = 90;
      const rect = filterBarRef.current.getBoundingClientRect();
      const top = rect.top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const featuredPosts = useMemo(() => {
    const featured = posts.filter((p) => p.isFeatured === true);
    return featured
      .sort((a, b) => {
        if (a.featuredOrder !== undefined && b.featuredOrder !== undefined) {
          return a.featuredOrder - b.featuredOrder;
        }
        if (a.featuredOrder !== undefined) return -1;
        if (b.featuredOrder !== undefined) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, featuredPostsCount);
  }, [posts]);

  // Standard strict filtering by post.category field only
  const getPostsByCategory = (catTitle: string) => {
    const targetCategory = catTitle.toLowerCase().trim();
    return posts.filter(
      (p) => (p.category || "").toLowerCase().trim() === targetCategory
    );
  };

  // Filtered posts when a specific category tab is chosen
  const categoryFilteredPosts = useMemo(() => {
    if (selectedCategory === "all") return posts;
    return getPostsByCategory(selectedCategory);
  }, [posts, selectedCategory]);

  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedFilteredPosts = categoryFilteredPosts.slice(startIndex, startIndex + postsPerPage);
  const actualTotalPages = Math.max(1, Math.ceil(categoryFilteredPosts.length / postsPerPage));

  const blogSchema = useMemo(() => [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://dongphucunivi.com" },
        { "@type": "ListItem", "position": 2, "name": "Bài viết", "item": "https://dongphucunivi.com/bai-viet" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": "https://dongphucunivi.com/bai-viet#blog",
      name: "Bài viết - Đồng phục Univi",
      description: meta.description,
      url: meta.canonical,
      inLanguage: "vi-VN",
      isPartOf: { "@id": "https://dongphucunivi.com/#website" },
      publisher: { "@id": "https://dongphucunivi.com/#organization" },
      blogPost: posts.slice(0, 10).map((p, index) => ({
        "@type": "BlogPosting",
        headline: p.title,
        url: p.isDirectPost ? `https://dongphucunivi.com/${p.slug}` : `https://dongphucunivi.com/bai-viet/${p.slug}`,
        datePublished: p.createdAt,
        image: p.thumbnail ? [p.thumbnail] : undefined,
        position: index + 1,
      })),
    },
  ], [posts]);

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta name="author" content={meta.author} />
        <meta name="robots" content={meta.robots} key="robots" />
        <link rel="canonical" href={meta.canonical} />
        <meta charSet="UTF-8" />
        <meta property="og:title" content={meta.og.title} />
        <meta property="og:description" content={meta.og.description} />
        <meta property="og:type" content={meta.og.type} />
        <meta property="og:image" content={meta.og.image} />
        <meta property="og:image:width" content={meta.og.imageWidth} />
        <meta property="og:image:height" content={meta.og.imageHeight} />
        <meta property="og:url" content={meta.og.url} />
        <meta property="og:site_name" content={meta.og.site_name} />
        <meta property="og:locale" content="vi_VN" />
        <meta property="og:image:alt" content="Đồng phục Univi" />
        <meta name="twitter:card" content={meta.twitter.card} />
        <meta name="twitter:title" content={meta.twitter.title} />
        <meta name="twitter:description" content={meta.twitter.description} />
        <meta name="twitter:image" content={meta.twitter.image} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        />
      </Head>
      <DefaultLayout2>
        <div className="h-[80px] bg-white"></div>
        <div className="pb-12 mt-6 container mx-auto px-4">
          <div className="flex flex-col gap-4 justify-center w-full">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center space-x-1 text-sm text-gray-500">
                <li>
                  <Link href="/" className="hover:text-[#105d97] transition-colors">
                    Trang chủ
                  </Link>
                </li>
                <li><span className="text-gray-400">/</span></li>
                <li className="text-gray-700 font-medium" aria-current="page">
                  Bài viết & Chia Sẻ
                </li>
              </ol>
            </nav>

            {featuredPosts.length > 0 && selectedCategory === "all" && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4 md:mb-5">
                  <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold text-[#0B1E48]">
                    Bài viết nổi bật
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                  {featuredPosts[0] && (
                    <Link
                      href={featuredPosts[0].isDirectPost ? `/${featuredPosts[0].slug}` : `/bai-viet/${featuredPosts[0].slug}`}
                      className="group relative rounded-lg overflow-hidden aspect-[4/3] md:aspect-auto min-h-0 md:min-h-[420px] lg:h-full p-4 sm:p-5 md:p-7 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <Image
                        src={featuredPosts[0].thumbnail || "/images/banner-1.webp"}
                        alt={featuredPosts[0].title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 transition-colors duration-300" />
                      <div className="relative z-10 mt-auto pt-4 sm:pt-8">
                        <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white leading-snug md:leading-snug mb-1 group-hover:text-blue-200 transition-colors line-clamp-2">
                          {featuredPosts[0].title}
                        </h3>
                        <div className="flex items-center gap-4 text-xs md:text-sm text-gray-200 font-medium">
                          <div className="flex items-center gap-1.5">
                            <FaRegCalendarAlt className="text-sm text-gray-300" />
                            <span>{formatDate(featuredPosts[0].createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 md:gap-3">
                    {featuredPosts.slice(1, 5).map((post, idx) => (
                      <Link
                        key={post.id || idx}
                        href={post.isDirectPost ? `/${post.slug}` : `/bai-viet/${post.slug}`}
                        className="group relative rounded-xl overflow-hidden aspect-[4/3] sm:aspect-auto min-h-0 sm:min-h-[180px] md:min-h-[200px] p-2.5 sm:p-4 md:p-5 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300"
                      >
                        <Image
                          src={post.thumbnail || "/images/banner-1.webp"}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 group-hover:from-black/95 transition-colors duration-300" />
                        <div className="relative z-10 mt-auto pt-2 sm:pt-4">
                          <h3 className="text-[11px] sm:text-sm md:text-md font-bold text-white leading-snug mb-0.5 sm:mb-1 group-hover:text-blue-200 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-3 text-[9px] sm:text-[11px] md:text-xs text-gray-200 font-medium">
                            <div className="flex items-center gap-1">
                              <FaRegCalendarAlt className="text-[10px] sm:text-xs text-gray-300" />
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={filterBarRef} className="pt-2" />

            {/* Category Filter Tabs Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  handlePageChange(1);
                }}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${selectedCategory === "all"
                    ? "bg-[#0B1E48] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Tất cả bài viết
              </button>
              {displayCategories.map((cat) => {
                const isSelected = selectedCategory.toLowerCase().trim() === cat.toLowerCase().trim();
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      handlePageChange(1);
                    }}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${isSelected
                        ? "bg-[#0B1E48] text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {selectedCategory === "all" ? (
              <div className="space-y-12">
                {displayCategories.map((catTitle) => {
                  const catPosts = getPostsByCategory(catTitle);
                  if (catPosts.length === 0) return null;
                  const isFeedbackCategory = catTitle === "PHẢN HỒI KHÁCH HÀNG";
                  return (
                    <div key={catTitle} className="w-full">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-4 flex-1">
                          <h2 className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-wider text-[#0B1E48]">
                            {catTitle}
                          </h2>
                          <div className="flex-1 h-[1px] bg-gray-200/80" />
                        </div>
                        <button
                          onClick={() => {
                            setSelectedCategory(catTitle);
                            handlePageChange(1);
                          }}
                          className="text-xs sm:text-sm font-semibold text-[#105d97] hover:text-[#0B1E48] transition-colors flex items-center gap-1 shrink-0 ml-4"
                        >
                          Xem tất cả <FaArrowRight className="text-xs" />
                        </button>
                      </div>
                      {catPosts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                          {catPosts.slice(0, 4).map((post) => (
                            <article
                              key={post.id}
                              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col justify-between"
                            >
                              <div>
                                <div className="relative aspect-video overflow-hidden rounded-t-xl">
                                  {post.thumbnail ? (
                                    <Image
                                      src={post.thumbnail}
                                      alt={post.title}
                                      fill
                                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-sky-100 flex items-center justify-center">
                                      <span className="text-[#105d97] text-3xl">📄</span>
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="p-4">
                                  <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug group-hover:text-[#105d97] transition-colors line-clamp-2 mb-2">
                                    <Link href={post.isDirectPost ? `/${post.slug}` : `/bai-viet/${post.slug}`}>
                                      {post.title}
                                    </Link>
                                  </h3>
                                </div>
                              </div>
                              <div className="p-4 pt-0 flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 mt-1">
                                <div className="flex items-center gap-1">
                                  <FaCalendarAlt className="text-xs text-gray-400" />
                                  <span>{formatDate(post.createdAt)}</span>
                                </div>
                                <Link
                                  href={post.isDirectPost ? `/${post.slug}` : `/bai-viet/${post.slug}`}
                                  className="inline-flex items-center text-[#105d97] hover:text-[#0e4a7a] font-semibold transition-colors gap-1 text-xs"
                                >
                                  Đọc thêm <FaArrowRight className="text-[10px]" />
                                </Link>
                              </div>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 bg-slate-50 rounded-xl text-center text-sm text-gray-400 border border-gray-100">
                          Đang cập nhật bài viết cho danh mục này...
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setCurrentPage(1);
                      }}
                      className="text-xs font-semibold text-[#105d97] hover:underline mb-2 inline-flex items-center gap-1"
                    >
                      ← Tất cả danh mục
                    </button>
                    <h2 className="text-xl md:text-2xl font-bold text-[#0B1E48] uppercase">
                      {selectedCategory}
                    </h2>
                  </div>
                  <p className="text-gray-500 text-sm">{categoryFilteredPosts.length} bài viết</p>
                </div>

                {paginatedFilteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {paginatedFilteredPosts.map((post) => (
                      <article
                        key={post.id}
                        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-video overflow-hidden rounded-t-xl">
                            {post.thumbnail ? (
                              <Image
                                src={post.thumbnail}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-sky-100 flex items-center justify-center">
                                <span className="text-[#105d97] text-3xl">📄</span>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug group-hover:text-[#105d97] transition-colors line-clamp-2 mb-2">
                              <Link href={post.isDirectPost ? `/${post.slug}` : `/bai-viet/${post.slug}`}>
                                {post.title}
                              </Link>
                            </h3>
                          </div>
                        </div>
                        <div className="p-4 pt-0 flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 mt-1">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="text-xs text-gray-400" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                          <Link
                            href={post.isDirectPost ? `/${post.slug}` : `/bai-viet/${post.slug}`}
                            className="inline-flex items-center text-[#105d97] hover:text-[#0e4a7a] font-semibold transition-colors gap-1 text-xs"
                          >
                            Đọc thêm <FaArrowRight className="text-[10px]" />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl">
                    <p className="text-gray-500">Chưa có bài viết nào trong danh mục này.</p>
                  </div>
                )}

                {actualTotalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-[#105d97] transition-colors font-medium flex items-center gap-2 text-sm"
                    >
                      <FaArrowRight className="rotate-180 text-xs" />
                      Trước
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: actualTotalPages }, (_, i) => i + 1).map((pg) => (
                        <button
                          key={pg}
                          onClick={() => handlePageChange(pg)}
                          className={`w-9 h-9 rounded-full text-sm font-medium transition-colors flex items-center justify-center ${pg === currentPage
                              ? "bg-[#105d97] text-white shadow-md"
                              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                          {pg}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === actualTotalPages}
                      className="px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-[#105d97] transition-colors font-medium flex items-center gap-2 text-sm"
                    >
                      Sau
                      <FaArrowRight className="text-xs" />
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 mb-10 bg-gradient-to-r from-[#031B4E] via-[#0B346A] to-[#105D97] rounded-2xl p-6 md:p-8 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                  <FaRegComments className="text-2xl text-blue-200" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-1">
                    Chưa biết chọn loại đồng phục phù hợp?
                  </h3>
                  <p className="text-sm text-blue-100/90 leading-relaxed">
                    Đội ngũ chuyên gia của Univi sẵn sàng tư vấn miễn phí và đưa ra giải pháp tối ưu cho bạn.
                  </p>
                </div>
              </div>
              <Link
                href="/lien-he"
                className="shrink-0 px-6 py-3.5 bg-white text-[#0B1E48] hover:bg-blue-50 font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 group"
              >
                <span>Nhận tư vấn miễn phí</span>
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </DefaultLayout2>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const raw = await readAllPostsFromDb(false, true);
    const posts = formatPosts(raw) || [];
    return {
      props: {
        initialPosts: posts,
      },
    };
  } catch (error) {
    console.error("Error fetching posts in getServerSideProps:", error);
    return {
      props: {
        initialPosts: [],
      },
    };
  }
};

export default Blogs;
