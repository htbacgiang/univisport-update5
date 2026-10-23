import Image from "next/image";
import Link from "next/link";
import { CircleCheckBig, Users, Volume2, VolumeX, Calendar, Factory, Zap, Globe, Tag, Building2, Sparkles, Eye, Compass, Heart, ShieldCheck, Target, Lightbulb, Flame } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import DefaultLayout from "../../components/layout/DefaultLayout";
import AboutNavigation from "../../components/univisport/AboutNavigation";
import AboutUniviPage from "../../components/univisport/AboutUniviPage";
import CategoryGrid from "../../components/univisport/CategoryGrid";
import PartnersSection from "../../components/univisport/PartnersSection";

export default function AboutUs({ meta }) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const yearsExperience = new Date().getFullYear() - 2017;

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) video.play().catch(() => { });
          else video.pause();
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(video);
    return () => { if (video) observer.unobserve(video); };
  }, []);

  return (
    <DefaultLayout>
      <div className="h-[80px]" />

      {/* Hero Video */}
      <div className="relative w-full h-[30vh] md:h-[70vh] overflow-hidden bg-gray-900">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/gioi-thieu-univi.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-colors"
          aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
        >
          {isMuted
            ? <VolumeX className="w-5 h-5 text-[#105d97]" />
            : <Volume2 className="w-5 h-5 text-[#105d97]" />
          }
        </button>
      </div>

      {/* Hành trình */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-5">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#105d97] mb-1">
              Câu chuyện của chúng tôi
            </p>
            <h2 className="text-xl md:text-2xl font-medium tracking-tight leading-6 text-gray-900 uppercase">
              I. Hành trình <span className="text-[#105d97]">{yearsExperience} năm</span> phát triển
            </h2>
            <div className="w-16 h-1 mx-auto mt-2 rounded-full bg-[#105d97]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-2">
              <p className="text-gray-700 leading-6 text-base">
                <span className="font-semibold text-[#105d97]">Đồng Phục Univi</span> là đơn vị  tiên phong cung cấp giải pháp đồng phục thể thao chuyên nghiệp cho các chuỗi phòng tập và đội nhóm thể thao tại Việt Nam
              </p>
              <p className="text-gray-700 leading-6 text-base">
                Với hơn <span className="font-semibold text-[#105d97]">{yearsExperience} năm kinh nghiệm</span> trong lĩnh vực thiết kế đồng phục, chúng tôi đã trở thành một cái tên quen thuộc trong ngành thời trang đồng phục.
              </p>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#105d97]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Tag className="w-4 h-4 text-[#105d97]" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-[0.15em] font-medium">Tên thương hiệu</div>
                      <div className="text-base font-medium text-gray-900">Đồng Phục Univi</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#105d97]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4 text-[#105d97]" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-[0.15em] font-medium">Slogan</div>
                      <div className="font-quote text-sm text-[#105d97]">
                        &ldquo;YOUR UNIFORM, YOUR BRAND!&rdquo;
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#105d97]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4 text-[#105d97]" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-[0.15em] font-medium">Doanh nghiệp sở hữu</div>
                      <div className="text-sm md:text-base font-medium text-gray-900">
                        CÔNG TY CỔ PHẦN TẬP ĐOÀN UNICORE HOLDINGS
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">MST: 0111401705</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chi tiết năng lực & quy mô */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4 mt-4">
                <h3 className="font-medium text-lg md:text-xl text-gray-900 border-b border-gray-200 pb-2">
                  Năng lực & Quy mô sản xuất
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#105d97]" />
                    <span><strong>Thành lập:</strong> 2017</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Factory className="w-4 h-4 text-[#105d97]" />
                    <span><strong>Xưởng sản xuất:</strong> 2.000m²</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#105d97]" />
                    <span><strong>Công suất:</strong> 100.000 sản phẩm/tháng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#105d97]" />
                    <span><strong>Phạm vi phục vụ:</strong> Toàn quốc</span>
                  </div>
                  <div className="flex items-start gap-2 col-span-1 md:col-span-2">
                    <Users className="w-4 h-4 text-[#105d97] mt-0.5" />
                    <span><strong>Khách hàng:</strong> 500+ doanh nghiệp, phòng tập và câu lạc bộ thể thao.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl shadow-lg group">
              <Image
                src="/images/gioi-thieu/xuong-san-xuat.jpg"
                alt="Xưởng sản xuất đồng phục thể thao Đồng Phục Univi tại phường Chương Mỹ, Hà Nội — diện tích 2.000m²"
                width={800}
                height={600}
                className="object-cover w-full transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>

          {/* Tầm nhìn - Sứ mệnh - Giá trị cốt lõi */}
          <div className="mt-16">
            <div className="text-center mb-10">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#105d97] mb-1">
                Định hướng phát triển
              </p>
              <h2 className="text-xl md:text-2xl font-medium tracking-tight leading-6 text-gray-900 uppercase">
                II. Tầm nhìn <span className="text-[#105d97]">- Sứ mệnh</span> - Giá trị cốt lõi
              </h2>
              <div className="w-16 h-1 mx-auto mt-2 rounded-full bg-[#105d97]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tầm nhìn */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#105d97]/10 flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5 text-[#105d97]" />
                  </div>
                  <h3 className="font-medium text-lg md:text-xl text-gray-900">
                    Tầm nhìn chiến lược của Univi
                  </h3>
                </div>
                <ul className="space-y-3 text-gray-700 leading-6">
                  <li className="flex items-start gap-2">
                    <CircleCheckBig className="w-4 h-4 text-[#105d97] mt-1 shrink-0" />
                    <span>Univi định hướng trở thành biểu tượng sáng tạo hàng đầu trong lĩnh vực Đồng phục tại Việt Nam, đặc biệt là vị trí số 1 trong mảng Đồng Phục Thể Thao chuyên sâu.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CircleCheckBig className="w-4 h-4 text-[#105d97] mt-1 shrink-0" />
                    <span>Với tầm nhìn dài hạn, Univi không đơn thuần là một xưởng sản xuất mà hướng tới vai trò là người bạn đồng hành chiến lược, mang đến giải pháp đồng phục toàn diện cho doanh nghiệp, tổ chức và cộng đồng yêu thể thao.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CircleCheckBig className="w-4 h-4 text-[#105d97] mt-1 shrink-0" />
                    <span>Univi hướng tới việc kiến tạo hình ảnh thương hiệu cho khách hàng thông qua sự kết hợp giữa công nghệ sản xuất hiện đại, thiết kế đột phá mang dấu ấn riêng và giải pháp cá nhân hóa linh hoạt cho từng đội nhóm.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CircleCheckBig className="w-4 h-4 text-[#105d97] mt-1 shrink-0" />
                    <span>Hãng tin tưởng rằng khi đồng phục thể hiện được bản sắc, nó sẽ trở thành ngôn ngữ thương hiệu mạnh mẽ nhất để truyền tải giá trị của một tập thể.</span>
                  </li>
                </ul>
              </div>

              {/* Sứ mệnh */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#105d97]/10 flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5 text-[#105d97]" />
                  </div>
                  <h3 className="font-medium text-lg md:text-xl text-gray-900">
                    Sứ mệnh của Univi
                  </h3>
                </div>
                <ul className="space-y-3 text-gray-700 leading-6">
                  <li className="flex items-start gap-2">
                    <CircleCheckBig className="w-4 h-4 text-[#105d97] mt-1 shrink-0" />
                    <span>Đồng hành cùng các chuỗi phòng tập, đội nhóm và doanh nghiệp bằng việc nghiên cứu, thiết kế và sản xuất những sản phẩm đồng phục thể thao chuyên sâu, luôn lấy hiệu suất, sự thoải mái và sức khỏe của người tập làm trung tâm.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CircleCheckBig className="w-4 h-4 text-[#105d97] mt-1 shrink-0" />
                    <span>Lan tỏa tinh thần chăm sóc sức khỏe chủ động tới cộng đồng thông qua thói quen vận động và rèn luyện thể thao.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CircleCheckBig className="w-4 h-4 text-[#105d97] mt-1 shrink-0" />
                    <span>Phát triển thương hiệu thời trang thể thao Việt Nam, tạo ra các sản phẩm do người Việt làm ra đạt chất lượng quốc tế nhưng với mức giá thành phù hợp cho người Việt.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Giá trị cốt lõi */}
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 mt-6">
              <h3 className="font-medium text-lg md:text-xl text-gray-900 text-center">
                Giá trị cốt lõi của Univi
              </h3>
              <p className="text-gray-500 text-center text-sm mt-2 max-w-2xl mx-auto">
                Univi xây dựng và phát triển dựa trên 5 giá trị cốt lõi mang tính định hướng cho mọi hoạt động
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
                {[
                  { icon: Heart, title: "Chân thành", tagline: "Nghĩ thẳng - nói thật" },
                  { icon: ShieldCheck, title: "Trách nhiệm", tagline: "Nghĩ tới - Làm tới" },
                  { icon: Target, title: "Kỷ luật", tagline: "Nghĩ chuẩn - Làm đúng" },
                  { icon: Lightbulb, title: "Sáng tạo", tagline: "Nghĩ khác - Làm mới" },
                  { icon: Flame, title: "Quyết liệt", tagline: "Nghĩ nhanh - Làm nhanh" },
                ].map(({ icon: Icon, title, tagline }) => (
                  <div
                    key={title}
                    className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#105d97]/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#105d97]" />
                    </div>
                    <div className="text-sm font-medium text-gray-900 uppercase">{title}</div>
                    <div className="text-xs text-gray-500 italic">{tagline}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-2xl bg-gray-50 py-6">
            <PartnersSection />
          </div>
        </div>
      </section>

      {/* Lịch sử & Phát triển */}
      <section className="md:py-12 py-6 ">
        <div className="container mx-auto mb-6 px-4">
          <div className="text-center mt-4 md:mt-8">
            <h3 className="text-xl md:text-2xl font-medium tracking-tight leading-6 text-gray-900 uppercase">Dòng sản phẩm chủ lực của Unvi</h3>
            <div className="w-16 h-1 mx-auto mt-3 rounded-full bg-[#105d97]" />
            <p className="text-gray-500 max-w-5xl mx-auto mt-3 text-sm md:text-base">
              Ngay từ những bước đầu, các dòng sản phẩm của Univi đã được đón nhận vượt kỳ vọng từ khách hàng trên toàn quốc.
            </p>
          </div>
          <CategoryGrid />
          <AboutNavigation />
        </div>
      </section>
      <AboutUniviPage />
    </DefaultLayout>
  );
}

// ─── SERVER SIDE PROPS ────────────────────────────────────────
export async function getServerSideProps() {
  const yearsExperience = new Date().getFullYear() - 2017;

  // ── AboutPage + BreadcrumbList schema ──────────────────────
  const schema = [
    // 1. Breadcrumb — giữ nguyên
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://dongphucunivi.com" },
        { "@type": "ListItem", "position": 2, "name": "Giới thiệu", "item": "https://dongphucunivi.com/gioi-thieu" },
      ],
    },

    // 2. AboutPage — chỉ REFERENCE đến Organization, KHÔNG nhúng lại
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "@id": "https://dongphucunivi.com/gioi-thieu#webpage",
      "name": "Giới Thiệu Đồng Phục Univi — Xưởng May Đồng Phục Thể Thao Chuyên Dụng",
      "description": `Đồng Phục Univi thành lập năm 2017, xưởng 2.000m² tại phường Chương Mỹ, Hà Nội. Chuyên đồng phục Gym, Yoga, Pickleball cho phòng tập & doanh nghiệp B2B. Hơn ${yearsExperience} năm kinh nghiệm, 500+ khách hàng tin tưởng, công suất 100.000 sản phẩm/tháng.`,
      "url": "https://dongphucunivi.com/gioi-thieu",
      "inLanguage": "vi-VN",
      "isPartOf": { "@id": "https://dongphucunivi.com/#website" },

      // ✅ Chỉ reference — không nhúng lại Organization
      "about": { "@id": "https://dongphucunivi.com/#organization" },
      "mainEntity": { "@id": "https://dongphucunivi.com/#organization" },

      // Tín hiệu E-E-A-T riêng cho trang About (không trùng Organization)
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://dongphucunivi.com/images/gioi-thieu/xuong-san-xuat.jpg",
        "width": 1200,
        "height": 630,
      },
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", "h2"],
      },
    },
  ];

  const meta = {
    title: `Đồng Phục Univi: Xưởng May ${yearsExperience} Năm Kinh Nghiệm Tại Hà Nội`,
    description: `Đồng Phục Univi thành lập 2017 tại Hà Nội — xưởng 2.000m², công suất 100.000 sp/tháng, ${yearsExperience}+ năm kinh nghiệm. Chuyên đồng phục Gym, Yoga, Pickleball cho phòng tập & doanh nghiệp. Vải UNI DRY kiểm định QCVN. Thiết kế miễn phí.`,
    keywords: `giới thiệu Đồng Phục Univi, xưởng may đồng phục Hà Nội, đồng phục thể thao chuyên dụng, đồng phục Gym Yoga Pickleball, công nghệ UNI DRY, kiểm định QCVN, ${yearsExperience} năm kinh nghiệm`,
    robots: "index, follow",
    author: "Đồng Phục Univi",
    canonical: "https://dongphucunivi.com/gioi-thieu",
    og: {
      title: `Đồng Phục Univi: Xưởng May ${yearsExperience} Năm Kinh Nghiệm`,
      description: `Xưởng sản xuất đồng phục thể thao chuyên dụng tại Hà Nội — ${yearsExperience}+ năm, 2.000m², 100.000 sp/tháng. Vải UNI DRY nhập khẩu, kiểm định QCVN 01:2017/BCT.`,
      type: "website",
      image: "https://dongphucunivi.com/images/gioi-thieu/xuong-san-xuat.jpg",
      imageWidth: "1200",
      imageHeight: "630",
      imageAlt: "Xưởng sản xuất đồng phục thể thao Đồng Phục Univi tại phường Chương Mỹ, Hà Nội — diện tích 2.000m²",
      url: "https://dongphucunivi.com/gioi-thieu",
      site_name: "Đồng Phục Univi",
    },
    twitter: {
      card: "summary_large_image",
      title: `Đồng Phục Univi: Xưởng May ${yearsExperience} Năm Kinh Nghiệm`,
      description: `Xưởng sản xuất đồng phục thể thao chuyên dụng tại Hà Nội — ${yearsExperience}+ năm, 2.000m², 100.000 sp/tháng.`,
      image: "https://dongphucunivi.com/images/gioi-thieu/xuong-san-xuat.jpg",
    },
    schema,
  };

  return { props: { meta } };
}