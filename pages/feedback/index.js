import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import DefaultLayout2 from "../../components/layout/DefaultLayout2";
import ContactForm from "../../components/header/ContactForm";
import db from "../../utils/db";
import Feedback from "../../models/Feedback";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaBuilding,
  FaTshirt,
  FaStar,
  FaMapMarkerAlt,
  FaUsers,
  FaSyncAlt,
  FaTag,
  FaCalendarAlt,
  FaSearch,
  FaDumbbell,
  FaRunning,
  FaGolfBall,
  FaPhoneAlt,
  FaTimes,
} from "react-icons/fa";
import { GiMeditation, GiPingPongBat, GiWeightLiftingUp, GiBoxingGlove, GiTennisRacket } from "react-icons/gi";

const PROJECTS_PER_PAGE = 9;

const CATEGORIES = ["Đồng phục doanh nghiệp", "Đồng phục thể thao", "Đồng phục CLB",];

const TRUST_STATS = {
  avgRating: "4.9/5",
  totalCustomers: "1.000+",
  provinces: "63",
  returnRate: "98%",
};

const INDUSTRIES = [
  { key: "Gym", label: "Gym", Icon: FaDumbbell, bg: "bg-emerald-600" },
  { key: "Yoga", label: "Yoga", Icon: GiMeditation, bg: "bg-purple-600" },
  { key: "Pickleball", label: "Pickleball", Icon: GiPingPongBat, bg: "bg-orange-500" },
  { key: "Fitness", label: "Fitness", Icon: GiWeightLiftingUp, bg: "bg-rose-600" },
  { key: "MMA", label: "MMA", Icon: GiBoxingGlove, bg: "bg-red-700" },
  { key: "Running", label: "Running", Icon: FaRunning, bg: "bg-teal-600" },
  { key: "Golf", label: "Golf", Icon: FaGolfBall, bg: "bg-green-700" },
  { key: "Tennis", label: "Tennis", Icon: GiTennisRacket, bg: "bg-lime-600" },
];
const INDUSTRY_META = INDUSTRIES.reduce((acc, i) => ({ ...acc, [i.key]: i }), {});

function getBadgeMeta(project) {
  if (project.category === "Đồng phục doanh nghiệp") {
    return { label: "DOANH NGHIỆP", Icon: FaBuilding, bg: "bg-[#105d97]" };
  }
  if (project.category === "Đồng phục CLB") {
    return { label: project.industry || "CLB", Icon: FaUsers, bg: "bg-indigo-600" };
  }
  const meta = INDUSTRY_META[project.industry];
  if (meta) return { label: meta.label.toUpperCase(), Icon: meta.Icon, bg: meta.bg };
  return { label: "THỂ THAO", Icon: FaTshirt, bg: "bg-slate-600" };
}

function StatItem({ Icon, value, label, dark }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className={dark ? "text-[#d2a35b] text-xl shrink-0" : "text-[#105d97] text-xl shrink-0"} />
      <div className="text-left">
        <div className={`text-lg md:text-xl font-bold leading-none ${dark ? "text-white" : "text-gray-800"}`}>
          {value}
        </div>
        <div className={`text-xs mt-1 ${dark ? "text-white/70" : "text-gray-500"}`}>{label}</div>
      </div>
    </div>
  );
}

function FeedbackCard({ project }) {
  const badge = getBadgeMeta(project);
  return (
    <Link href={`/feedback/${project.slug}`} className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
        <Image
          src={project.image || "/images/dong-phuc-default.jpg"}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 z-10">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-white shadow-md ${badge.bg}`}>
            <badge.Icon className="text-xs" />
            {badge.label}
          </span>
        </div>
        {project.logo && (
          <div className="absolute top-3 right-3 z-10 w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center p-1.5">
            <div className="relative w-full h-full">
              <Image src={project.logo} alt={`${project.title} logo`} fill className="object-contain" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-gray-800 text-base leading-6 group-hover:text-[#105d97] transition-colors line-clamp-1">
            {project.title}
          </h3>
          <span className="flex items-center gap-1 text-amber-500 text-sm font-semibold shrink-0">
            <FaStar className="text-xs" />
            {Number(project.rating || 5).toFixed(1)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-sm text-gray-500 truncate">{project.description}</p>
          {project.location && (
            <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
              <FaMapMarkerAlt className="text-[#105d97]" />
              {project.location}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-xs">
          <div>
            <div className="flex items-center gap-1 text-gray-700 font-semibold">
              <FaUsers className="text-gray-400 shrink-0" />
              <span className="truncate">{project.employeeCount || "—"}</span>
            </div>
            <div className="text-gray-400 mt-0.5">Nhân sự</div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-gray-700 font-semibold">
              <FaTag className="text-gray-400 shrink-0" />
              <span className="truncate">{project.serviceTags || "—"}</span>
            </div>
            <div className="text-gray-400 mt-0.5">{project.productLines || 0} dòng sản phẩm</div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-gray-700 font-semibold">
              <FaCalendarAlt className="text-gray-400 shrink-0" />
              {project.year || "—"}
            </div>
            <div className="text-gray-400 mt-0.5">Năm hợp tác</div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#105d97] group-hover:gap-2.5 transition-all">
            Xem chi tiết dự án
            <FaArrowRight className="text-xs" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function FeedbackPage({ meta = {}, initialProjects = [] }) {
  const [projects] = useState(initialProjects);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const counts = useMemo(() => {
    const c = { all: projects.length };
    CATEGORIES.forEach((cat) => {
      c[cat] = projects.filter((p) => p.category === cat).length;
    });
    return c;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      const matchesIndustry = !industryFilter || p.industry === industryFilter;
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        p.title?.toLowerCase().includes(term) ||
        p.customer?.toLowerCase().includes(term);
      return matchesCategory && matchesIndustry && matchesSearch;
    });
  }, [projects, categoryFilter, industryFilter, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE));
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      document.getElementById("projects-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCategoryChange = (cat) => {
    setCategoryFilter(cat);
    setIndustryFilter("");
    setCurrentPage(1);
  };

  const defaultMeta = {
    title: "Phản Hồi Khách Hàng – Đồng Phục Univi",
    description:
      "Xem đánh giá từ khách hàng về đồng phục Univi: chất lượng cao, thiết kế miễn phí, giao hàng toàn quốc.",
    keywords:
      "phản hồi đồng phục Univi, đánh giá khách hàng, đồng phục chất lượng",
    author: "Đồng Phục Univi",
    robots: "index, follow",
    canonical: "https://dongphucunivi.com/feedback",
    og: {
      title: "Phản Hồi Khách Hàng – Đồng Phục Univi",
      description:
        "Xem đánh giá từ khách hàng về đồng phục Univi: chất lượng cao, thiết kế miễn phí, giao hàng toàn quốc.",
      type: "website",
      image: "https://dongphucunivi.com/images/banner-feedback.jpg",
      imageWidth: "1200",
      imageHeight: "630",
      url: "https://dongphucunivi.com/feedback",
      site_name: "Đồng Phục Univi",
      locale: "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
      title: "Phản Hồi Khách Hàng – Đồng Phục Univi",
      description: "Khám phá phản hồi từ khách hàng về đồng phục Univi.",
      image: "",
      site: "@DongPhucUnivi",
    },
  };

  const safeMeta = {
    ...defaultMeta,
    ...meta,
    og: { ...defaultMeta.og, ...meta.og },
    twitter: { ...defaultMeta.twitter, ...meta.twitter },
  };

  return (
    <DefaultLayout2>
      <div className="min-h-screen bg-gray-50">
        {/* ── Hero Section ── */}
        <section className="relative pt-28 pb-28 md:pt-36 md:pb-40 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/banner-feedback.jpg"
            alt="Khách hàng Univi"
            fill
            priority
            className="object-cover"
          />
          {/* Lớp phủ đen opacity 50% */}
          <div className="absolute inset-0 bg-black/50 z-0" />

          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#d2a35b] mb-3">
              Phản hồi khách hàng
            </p>
            <h1 className="text-2xl md:text-5xl font-bold mb-4 leading-6">
              HƠN 1.000+ DỰ ÁN
              <br />
              ĐỒNG HÀNH CÙNG KHÁCH HÀNG
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-6 mb-8">
              Từ phòng tập Gym, CLB thể thao đến doanh nghiệp.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mb-8">
              <StatItem Icon={FaStar} value={TRUST_STATS.avgRating} label="Đánh giá trung bình" dark />
              <StatItem Icon={FaUsers} value={TRUST_STATS.totalCustomers} label="Khách hàng tin tưởng" dark />
              <StatItem Icon={FaMapMarkerAlt} value={TRUST_STATS.provinces} label="Tỉnh thành" dark />
              <StatItem Icon={FaSyncAlt} value={TRUST_STATS.returnRate} label="Khách hàng quay lại" dark />
            </div>


          </div>
        </section>

        {/* ── Filter / Grid Card ── */}
        <section className="relative z-20 -mt-14 md:-mt-14 pb-14">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-3xl shadow-xl p-4 md:p-6">
              {/* Category tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${categoryFilter === "all"
                    ? "bg-[#105d97] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  Tất cả ({counts.all})
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-3 py-2.5 rounded-full text-sm font-semibold transition-colors ${categoryFilter === cat
                      ? "bg-[#105d97] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {cat} ({counts[cat] || 0})
                  </button>
                ))}
              </div>

              {/* Secondary stats row */}
              <div className="flex flex-wrap items-center justify-between gap-6 py-5 px-2 md:px-4 border-y border-gray-100 mb-6">
                <StatItem Icon={FaUsers} value={TRUST_STATS.totalCustomers} label="Khách hàng" />
                <StatItem Icon={FaBuilding} value="120+" label="Chuỗi phòng tập" />
                <StatItem Icon={FaMapMarkerAlt} value={TRUST_STATS.provinces} label="Tỉnh thành" />
                <StatItem Icon={FaSyncAlt} value={TRUST_STATS.returnRate} label="Khách hàng quay lại" />
              </div>

              {/* Filter row */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                {categoryFilter === "Đồng phục thể thao" ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-500 mr-1 shrink-0">Lọc theo ngành</span>
                    <button
                      onClick={() => setIndustryFilter("")}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${!industryFilter ? "bg-[#105d97] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                      Tất cả
                    </button>
                    {INDUSTRIES.map(({ key, label, Icon }) => (
                      <button
                        key={key}
                        onClick={() => setIndustryFilter(industryFilter === key ? "" : key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${industryFilter === key
                          ? "bg-[#105d97] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                      >
                        <Icon className="text-sm" />
                        {label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div />
                )}

                <div className="relative w-full lg:w-80 shrink-0">
                  <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Tìm kiếm khách hàng, dự án..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#105d97]/40 focus:border-[#105d97]"
                  />
                </div>
              </div>

              {/* Grid */}
              <div id="projects-grid" className="scroll-mt-24">
                {paginatedProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {paginatedProjects.map((project) => (
                      <FeedbackCard key={project.slug || project._id} project={project} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">Không tìm thấy dự án phù hợp.</p>
                  </div>
                )}
              </div>

              {/* Promo CTA card */}
              <div className="mt-8 bg-[#eaf2fb] rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <FaTshirt className="text-[#105d97] text-2xl" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className="font-bold text-gray-800 text-lg">
                    Bạn muốn thương hiệu của mình xuất hiện tại đây?
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Đồng Phục Univi sẵn sàng đồng hành cùng bạn!
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#105d97] hover:bg-[#0d4c7a] text-white font-bold rounded-full text-sm transition-colors shadow-sm"
                  >
                    NHẬN TƯ VẤN NGAY
                    <FaArrowRight className="text-xs" />
                  </button>
                  <a href="tel:0834204999" className="hidden md:flex items-center gap-2 text-[#105d97] font-bold text-sm">
                    <FaPhoneAlt className="text-xs" />
                    0834.204.999
                  </a>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center bg-white text-[#105d97] rounded-full border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#105d97] hover:text-white transition-all duration-200"
                    aria-label="Trang trước"
                  >
                    <FaChevronLeft className="text-sm" />
                  </button>

                  <div className="flex items-center gap-1">
                    {(() => {
                      const pages = [];
                      const maxVisible = 5;
                      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                      let end = Math.min(totalPages, start + maxVisible - 1);
                      if (end - start + 1 < maxVisible) {
                        start = Math.max(1, end - maxVisible + 1);
                      }

                      if (start > 1) {
                        pages.push(
                          <button
                            key={1}
                            onClick={() => handlePageChange(1)}
                            className="w-10 h-10 bg-white text-[#105d97] rounded-full border border-gray-200 hover:bg-gray-50 transition-colors font-medium"
                          >
                            1
                          </button>
                        );
                        if (start > 2)
                          pages.push(
                            <span key="s-el" className="px-1 text-gray-400">
                              …
                            </span>
                          );
                      }

                      for (let i = start; i <= end; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`w-10 h-10 rounded-full font-medium transition-all duration-200 ${i === currentPage
                              ? "bg-[#105d97] text-white shadow-md"
                              : "bg-white text-[#105d97] border border-gray-200 hover:bg-gray-50"
                              }`}
                          >
                            {i}
                          </button>
                        );
                      }

                      if (end < totalPages) {
                        if (end < totalPages - 1)
                          pages.push(
                            <span key="e-el" className="px-1 text-gray-400">
                              …
                            </span>
                          );
                        pages.push(
                          <button
                            key={totalPages}
                            onClick={() => handlePageChange(totalPages)}
                            className="w-10 h-10 bg-white text-[#105d97] rounded-full border border-gray-200 hover:bg-gray-50 transition-colors font-medium"
                          >
                            {totalPages}
                          </button>
                        );
                      }

                      return pages;
                    })()}
                  </div>

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center bg-white text-[#105d97] rounded-full border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#105d97] hover:text-white transition-all duration-200"
                    aria-label="Trang sau"
                  >
                    <FaChevronRight className="text-sm" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-[99998] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setIsFormOpen(false); }}
        >
          <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-gray-100 hover:bg-red-500 hover:text-white text-gray-600 rounded-full flex items-center justify-center transition-colors"
              onClick={() => setIsFormOpen(false)}
              aria-label="Đóng"
            >
              <FaTimes />
            </button>
            <ContactForm source="Feedback: Nhận tư vấn ngay" />
          </div>
        </div>
      )}
    </DefaultLayout2>
  );
}

export async function getServerSideProps() {
  try {
    // Fetch trực tiếp từ DB — Google crawl thấy nội dung thật, không cần client-side fetch
    await db.connectDb();
    const rawFeedbacks = await Feedback.find({}).sort({ createdAt: -1 }).lean();
    const initialProjects = rawFeedbacks.map(p => ({
      _id: String(p._id),
      slug: p.slug || '',
      title: p.title || '',
      customer: p.customer || '',
      image: p.image || '/images/dong-phuc-default.jpg',
      logo: p.logo || '',
      category: p.category || '',
      industry: p.industry || '',
      description: p.description || '',
      rating: typeof p.rating === 'number' ? p.rating : 5,
      location: p.location || '',
      employeeCount: p.employeeCount || '',
      serviceTags: p.serviceTags || '',
      productLines: typeof p.productLines === 'number' ? p.productLines : 0,
      year: p.year || null,
    }));

    const meta = {
      title: "Phản Hồi Khách Hàng – Đồng Phục Univi",
      description:
        "Xem đánh giá từ khách hàng về đồng phục Univi: chất lượng cao, thiết kế miễn phí, giao hàng toàn quốc. Gửi phản hồi của bạn ngay!",
      keywords:
        "phản hồi đồng phục Univi, đánh giá khách hàng, đồng phục chất lượng, đồng phục công ty, thiết kế đồng phục",
      author: "Đồng Phục Univi",
      robots: "index, follow",
      canonical: "https://dongphucunivi.com/feedback",
      og: {
        title: "Phản Hồi Khách Hàng – Đồng Phục Univi",
        description:
          "Đọc đánh giá từ khách hàng về đồng phục Univi. Chất lượng cao, thiết kế miễn phí, giao hàng toàn quốc.",
        type: "website",
        image: "/images/banner-home-1.jpg",
        imageWidth: "1200",
        imageHeight: "630",
        url: "https://dongphucunivi.com/feedback",
        site_name: "Đồng Phục Univi",
        locale: "vi_VN",
      },
      twitter: {
        card: "summary_large_image",
        title: "Phản Hồi Khách Hàng – Đồng Phục Univi",
        description:
          "Khám phá phản hồi từ khách hàng về đồng phục Univi. Thiết kế miễn phí, giao hàng toàn quốc.",
        image: "/images/banner-home-1.jpg",
        site: "@DongPhucUnivi",
      },
    };
    return { props: { meta, initialProjects } };
  } catch (error) {
    console.error("getServerSideProps error:", error);
    return { props: { meta: {}, initialProjects: [] } };
  }
}
