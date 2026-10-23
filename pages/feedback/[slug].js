import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import DefaultLayout2 from "../../components/layout/DefaultLayout2";
import Gallery from "react-photo-gallery";
import db from "../../utils/db";
import Feedback from "../../models/Feedback";
import ContactForm from "../../components/header/ContactForm";
import {
  FaArrowRight,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaTshirt,
  FaBuilding,
  FaUser,
  FaTag,
} from "react-icons/fa";
import CTABannerSection from "../../components/univisport/CTABanner";
// ─── SidebarForm ─────────────────────────────────────────────────────────────
function SidebarForm({ source }) {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Đang gửi...");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, service: "dong-phuc-univi", source: source || "" }),
      });
      if (response.ok) {
        setStatus("Thành công! Chúng tôi sẽ liên hệ sớm.");
        setFormData({ name: "", phone: "", message: "" });
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("Lỗi, vui lòng thử lại.");
      }
    } catch {
      setStatus("Lỗi, vui lòng thử lại.");
    }
  };

  return (
    <div className="bg-white rounded-[24px] p-3 shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 uppercase mb-6">ĐẶT LỊCH TƯ VẤN</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Họ và tên *"
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#105d97]/40 focus:border-[#105d97] transition-all"
          />
        </div>
        <div>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Số điện thoại *"
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#105d97]/40 focus:border-[#105d97] transition-all"
          />
        </div>
        <div>
          <textarea
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Yêu cầu thiết kế đồng phục của bạn..."
            rows={4}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#105d97]/40 focus:border-[#105d97] transition-all resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={status === "Đang gửi..."}
          className="w-full bg-[#105d97] text-white hover:bg-[#0d4a7a] font-bold text-base py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70 mt-2 shadow-sm"
        >
          {status === "Đang gửi..." ? "ĐANG GỬI..." : "GỬI THÔNG TIN →"}
        </button>
        {status && status !== "Đang gửi..." && (
          <p className="text-center text-gray-600 text-sm mt-2 font-medium">{status}</p>
        )}
      </form>
    </div>
  );
}

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ photos, currentIndex, onClose, onNext, onPrev }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "unset";
    };
  }, [onClose, onNext, onPrev]);

  const photo = photos[currentIndex];
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2.5 md:p-3 z-10 transition-colors"
        aria-label="Ảnh trước"
      >
        <FaChevronLeft className="text-xl md:text-2xl" />
      </button>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2.5 md:p-3 z-10 transition-colors"
        aria-label="Ảnh sau"
      >
        <FaChevronRight className="text-xl md:text-2xl" />
      </button>

      {/* Image */}
      <div
        className="relative inline-flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button on Top Right of Image */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-2 md:-top-7 md:-right-10 bg-gray-600 hover:bg-red-700 text-white rounded-full p-2 md:p-2.5 z-10 transition-colors shadow-lg"
          aria-label="Đóng"
        >
          <FaTimes className="text-base md:text-lg" />
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={`Ảnh ${currentIndex + 1}`}
          className="max-w-[85vw] max-h-[85vh] md:max-w-[90vw] md:max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
      </div>

      {/* Counter */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/80 text-sm">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FeedbackDetailPage({ projectData, relatedProjects = [] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const galleryContainerRef = useRef(null);
  const [targetRowHeight, setTargetRowHeight] = useState(250);
  const [limitNodeSearch, setLimitNodeSearch] = useState(3);

  // Calculate gallery layout values based on screen size
  useEffect(() => {
    const calculateTargetRowHeight = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      let baseHeight = 250;
      let nodeSearch = 2;

      if (isMobile) {
        baseHeight = 150;
        nodeSearch = 2;
      } else if (isTablet) {
        baseHeight = 200;
        nodeSearch = 3;
      } else {
        baseHeight = 350;
        nodeSearch = 4; // allow more photos per row on desktop
      }

      setTargetRowHeight(baseHeight);
      setLimitNodeSearch(nodeSearch);
    };

    calculateTargetRowHeight();

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateTargetRowHeight, 300);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const openLightbox = useCallback((event, { index }) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const nextImage = useCallback(() => {
    setLightboxIndex((i) => {
      const len = Array.isArray(projectData?.gallery) && projectData.gallery.length > 0 ? projectData.gallery.length : 1;
      return (i + 1) % len;
    });
  }, [projectData]);
  const prevImage = useCallback(() => {
    setLightboxIndex((i) => {
      const len = Array.isArray(projectData?.gallery) && projectData.gallery.length > 0 ? projectData.gallery.length : 1;
      return (i - 1 + len) % len;
    });
  }, [projectData]);

  const galleryPhotos = useMemo(() => {
    if (!projectData) return [];
    const gallery = Array.isArray(projectData.gallery) && projectData.gallery.length > 0
      ? projectData.gallery
      : [projectData.image].filter(Boolean).map(src => ({ src, width: 4, height: 3 }));

    return gallery.map((item, index) => {
      return {
        src: item.src || item,
        width: item.width || 4,
        height: item.height || 3,
        alt: `${projectData?.title || 'Dự án'} - ảnh ${index + 1}`
      };
    });
  }, [projectData]);

  if (!projectData) {
    return (
      <DefaultLayout2>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-800 mb-4">Không tìm thấy dự án</p>
            <p className="text-gray-500 mb-8">
              Dự án bạn tìm kiếm không tồn tại hoặc đã được gỡ bỏ.
            </p>
            <Link
              href="/feedback"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#105d97] hover:bg-[#0d4c7a] text-white font-bold rounded-full transition-colors"
            >
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </DefaultLayout2>
    );
  }

  return (
    <DefaultLayout2>
      <div className="min-h-screen bg-white">
        {/* ── Hero Section ───────────────────────────────────────────────── */}
        <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
          {projectData.image && (
            <Image
              src={projectData.image}
              alt={projectData.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#105d97]/80 via-black/60 to-black/50" />

          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="text-center text-white max-w-3xl">
              {/* Breadcrumb */}
              <nav className="flex items-center justify-center gap-2 text-white/60 text-sm mb-4">
                <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
                <span>/</span>
                <Link href="/feedback" className="hover:text-white transition-colors">Feedback</Link>
                <span>/</span>
                <span className="text-white/90 truncate max-w-[200px]">{projectData.title}</span>
              </nav>

              <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-2xl">
                {projectData.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-4 text-white/85">
                <span className="flex items-center gap-2">
                  {projectData.category === "Đồng phục thể thao"
                    ? <FaTshirt className="text-[#d2a35b]" />
                    : <FaBuilding className="text-[#d2a35b]" />}
                  {projectData.category}
                </span>
                {projectData.customer && (
                  <span className="flex items-center gap-2">
                    <FaUser className="text-[#d2a35b]" />
                    {projectData.customer}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Image Gallery Section ───────────────────────────────────────── */}
        {galleryPhotos.length > 0 && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4 max-w-8xl">
              {/* Mobile: CSS Grid with 2 columns */}
              <div className="md:hidden grid grid-cols-2 gap-2">
                {galleryPhotos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-[16/9] overflow-hidden rounded-lg cursor-pointer group"
                    onClick={() => openLightbox(null, { photo, index })}

                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt || projectData.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>

              {/* Desktop: React Photo Gallery with justified layout */}
              <div className="hidden md:block container mx-auto" ref={galleryContainerRef}>
                <div className="flex justify-center">
                  <div
                    style={{
                      minHeight: `${Math.max(targetRowHeight, 400)}px`,
                      width: '100%',
                      position: 'relative'
                    }}
                  >
                    {targetRowHeight > 0 && (
                      <Gallery
                        photos={galleryPhotos}
                        direction="row"
                        margin={4}
                        targetRowHeight={Math.max(targetRowHeight, 400)}
                        imagePadding={8}
                        limitNodeSearch={limitNodeSearch}
                        onClick={openLightbox}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Detail + Sidebar ───────────────────────────────────────────── */}
        <section className="py-8">
          <div className="container mx-auto px-4 md:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Description */}
              <div className="lg:col-span-2 order-2 lg:order-1">

                {projectData.overview && (
                  <div className="">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                      Thông tin chi tiết
                    </h2>
                    <div
                      className="blog prose prose-lg max-w-full text-gray-600 leading-6"
                      dangerouslySetInnerHTML={{ __html: projectData.overview }}
                    />
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 order-1 lg:order-1">
                <div className="sticky top-24">
                  <SidebarForm source={`Feedback: ${projectData.title}`} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Related Projects ───────────────────────────────────────────── */}
        {relatedProjects.length > 0 && (
          <section className="py-14 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <p className="text-xs font-bold uppercase tracking-widest text-[#105d97] mb-2">
                  Xem thêm Feedback của Univi
                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.map((related) => (
                  <Link
                    key={related.id}
                    href={`/feedback/${related.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[5/3] overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1.5">
                      <Image
                        src={related.image}
                        alt={related.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#105d97]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 text-white translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <p className="font-bold text-base drop-shadow">{related.title}</p>
                        <p className="text-sm text-white/80">{related.category}</p>
                      </div>
                    </div>
                    <div className="pt-3 px-1">
                      <p className="font-semibold text-gray-800 group-hover:text-[#105d97] transition-colors duration-200 truncate">
                        {related.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-10">
                <Link
                  href="/feedback"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#105d97] hover:bg-[#0d4c7a] text-white font-bold rounded-full transition-all duration-200 hover:shadow-lg"
                >
                  Xem tất cả dự án
                  <FaArrowRight className="text-sm" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── CTA Section ────────────────────────────────────────────────── */}
        <CTABannerSection />
      </div>

      {/* ── Lightbox ───────────────────────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={galleryPhotos.map(p => p.src)}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}

      {/* ── Contact Form Modal ─────────────────────────────────────────────── */}
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
            <ContactForm source={`Feedback: ${projectData.title}`} />
          </div>
        </div>
      )}
    </DefaultLayout2>
  );
}

// ─── getServerSideProps ──────────────────────────────────────────────────────
export async function getServerSideProps({ params }) {
  try {
    const { slug } = params;
    await db.connectDb();
    const fetchedProject = await Feedback.findOne({ slug }).lean();

    if (!fetchedProject) return { notFound: true };

    const project = {
      ...fetchedProject,
      _id: fetchedProject._id.toString(),
      gallery: fetchedProject.gallery ? fetchedProject.gallery.map(g => ({ ...g, _id: g._id?.toString() || null })) : [],
      createdAt: fetchedProject.createdAt ? fetchedProject.createdAt.toString() : null,
      updatedAt: fetchedProject.updatedAt ? fetchedProject.updatedAt.toString() : null
    };

    // Related: same category, exclude current, max 3
    const fetchedRelated = await Feedback.find({ _id: { $ne: fetchedProject._id }, category: project.category }).limit(3).lean();
    const related = fetchedRelated.map(f => ({
      ...f,
      _id: f._id.toString(),
      gallery: f.gallery ? f.gallery.map(g => ({ ...g, _id: g._id?.toString() || null })) : [],
      createdAt: f.createdAt ? f.createdAt.toString() : null,
      updatedAt: f.updatedAt ? f.updatedAt.toString() : null
    }));

    return {
      props: {
        projectData: project,
        relatedProjects: related,
        meta: {
          title: `${project.title} – Feedback Đồng phục Univi`,
          description: `Xem hình ảnh thực tế đồng phục ${project.category.toLowerCase()} cho ${project.customer} từ Đồng phục Univi. Thiết kế hiện đại, chuyên nghiệp.`,
          keywords: `đồng phục, feedback, ${project.title}, ${project.category}, Univi`,
          canonical: `https://dongphucunivi.com/feedback/${project.slug}`,
          og: {
            title: `${project.title} – Feedback Đồng phục Univi`,
            description: `Feedback đồng phục ${project.category.toLowerCase()} cho ${project.customer}.`,
            type: "article",
            image: project.image || "/images/dong-phuc-default.jpg",
            url: `https://dongphucunivi.com/feedback/${project.slug}`,
          },
        },
      },
    };
  } catch (error) {
    console.error("getServerSideProps error:", error);
    return { notFound: true };
  }
}