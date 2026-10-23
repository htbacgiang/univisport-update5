import Head from "next/head";
import DefaultLayout from "../components/layout/DefaultLayout";
import Link from "next/link";
import Image from "next/image";
import { FaCheckCircle, FaCheck, FaArrowRight, FaPhone, FaTags, FaFileAlt, FaCamera, FaVideo, FaHeadphones, FaSync, FaTruck, FaPencilAlt, FaEnvelope } from "react-icons/fa";
import { Store, TrendingUp, RefreshCw, Layers, ShieldCheck, Video as LucideVideo, DollarSign, Users, Scissors, Printer, Package, Cpu, ArrowRight } from "lucide-react";
import PartnersSection from "../components/univisport/PartnersSection";
import { useState, useEffect, useRef } from "react";

export default function DealerPolicy() {
  const [activeReason, setActiveReason] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);

  // States for Section 2 animation
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const reasons = [
    {
      id: "01",
      title: "Sản phẩm chất lượng kiểm định",
      desc: "Vải nhập khẩu từ nước ngoài, công nghệ UNI DRY độc quyền, kiểm định đạt QCVN 01:2017/BCT",
      img: "https://live.staticflickr.com/65535/55255763715_ff43b3f548_b.jpg"
    },
    {
      id: "02",
      title: "Đa dạng mẫu mã — hàng chục màu",
      desc: "Mỗi mẫu sản phẩm có hàng chục màu tùy chọn. Đại lý dễ dàng đáp ứng mọi yêu cầu mà không cần nhập nhiều SKU.",
      img: "https://live.staticflickr.com/65535/55262378931_6ed4de935d_b.jpg"
    },
    {
      id: "03",
      title: "Nguồn hàng ổn định — xưởng 2.000m²",
      desc: "Xưởng sản xuất 2.000m² tại phường Chương Mỹ, Hà Nội với ~100 công nhân. Không lo thiếu hàng, không lo giao chậm.",
      img: "https://live.staticflickr.com/65535/55238265665_1be5d2dc7b_b.jpg"
    },
    {
      id: "04",
      title: "Đầy đủ hóa đơn — minh bạch",
      desc: "Univi cam kết cung cấp đầy đủ hóa đơn đầu vào, phiếu xuất kho rõ ràng, giúp đại lý dễ dàng chứng minh nguồn gốc.",
      img: "https://live.staticflickr.com/65535/55258289010_c075b06bc2_b.jpg"
    },
    {
      id: "05",
      title: "Hỗ trợ marketing toàn diện",
      desc: "Kho ảnh sản phẩm chuyên nghiệp, video demo, bài viết mẫu và tư vấn chiến lược bán hàng từ đội ngũ 9+ năm kinh nghiệm.",
      img: "https://live.staticflickr.com/65535/55238039716_e624ae5587_b.jpg  "
    }
  ];
  const meta = {
    title: "Chính Sách Đại Lý Univi – Nguồn Hàng Thể Thao Uy Tín, Hỗ Trợ Toàn Diện",
    description: "Trở thành đại lý Univi – nhận nguồn hàng đồng phục thể thao chất lượng cao từ xưởng 2.000m² tại phường Chương Mỹ, Hà Nội. Có hóa đơn, hỗ trợ marketing, từ 10 sản phẩm. Liên hệ ngay!",
    keywords: "chính sách đại lý, đại lý univi, xưởng may đồng phục, đồng phục thể thao, nguồn hàng sỉ",
    robots: "index, follow",
    author: "Đồng Phục Univi",
    canonical: "https://dongphucunivi.com/chinh-sach-dai-ly",
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Số lượng tối thiểu để trở thành đại lý là bao nhiêu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Từ 10 sản phẩm trở lên đã được hưởng chính sách đại lý."
        }
      },
      {
        "@type": "Question",
        "name": "Tôi chưa có kinh nghiệm bán hàng thể thao có làm được không?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Được. Univi hỗ trợ toàn bộ công cụ marketing, hình ảnh, video và tư vấn chiến lược bán hàng."
        }
      },
      {
        "@type": "Question",
        "name": "Sản phẩm có thể trả lại nếu không bán được không?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Univi có chính sách đổi trả linh hoạt. Chi tiết sẽ được thỏa thuận trong hợp đồng hợp tác."
        }
      },
      {
        "@type": "Question",
        "name": "Tôi ở tỉnh xa có hợp tác được không?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Có. Univi giao hàng toàn quốc qua đơn vị vận chuyển uy tín."
        }
      },
      {
        "@type": "Question",
        "name": "Làm CTV không cần nhập hàng có được hỗ trợ hình ảnh không?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Có. CTV và KOC được cung cấp miễn phí kho ảnh và video sản phẩm chuyên nghiệp."
        }
      },
      {
        "@type": "Question",
        "name": "Univi có cung cấp phôi áo trơn để tôi tự in không?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Có. Univi cung cấp phôi áo Gym và Polo thể thao, hỗ trợ in logo hoặc giao phôi trơn theo yêu cầu."
        }
      }
    ]
  };

  return (
    <DefaultLayout>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta name="robots" content={meta.robots} key="robots" />
        <meta name="author" content={meta.author} />
        <link rel="canonical" href={meta.canonical} />

        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={meta.canonical} />
        <meta property="og:image" content="https://dongphucunivi.com/images/banner-home-1.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content="https://dongphucunivi.com/images/banner-home-1.jpg" />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </Head>

      <div className="h-[80px]"></div>

      <div className="min-h-screen">
        <div className="container mx-auto px-4">
          <div className="container mx-auto">
            {/* HERO */}
            <div className="text-center py-2 md:py-10">
              <h1 className="text-2xl md:text-3xl font-bold text-[#105d97] mb-2">
                Trở Thành Đại Lý Univi - Bán Hàng Chất Lượng Cao, Ít Rủi Ro, Hỗ Trợ Toàn Diện
              </h1>
              <p className="text-sm md:text-base text-gray-700 leading-6 mb-6">
                Đồng phục thể thao chuyên dụng sản xuất tại Việt Nam - kiểm định an toàn - hỗ trợ marketing - cam kết lợi nhuận. Từ 10 sản phẩm đã là đối tác của Univi.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/dang-ky-dai-ly" className="px-6 py-3 bg-[#105d97] text-white font-medium rounded hover:bg-[#0d4a7a] transition-colors">
                  Đăng Ký Đại Lý Ngay
                </Link>
                <a href="tel:0834204999" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors">
                  Gọi Tư Vấn: 0834.204.999
                </a>
              </div>
            </div>
            <div className="prose prose-lg max-w-none text-gray-800">

              {/* SECTION 2 — NỖI ĐAU */}
              <section
                ref={sectionRef}
                className="about-us relative overflow-hidden py-2 md:py-10"
              >
                <div className="container mx-auto relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: About Us Images - trượt từ trái */}
                    <div
                      className={`about-us-images relative order-1 pr-0 lg:pr-[100px] pb-0 lg:pb-[180px] mr-0 lg:mr-[30px] transition-all duration-1000 ease-out ${isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                        }`}
                      style={{
                        transitionDelay: isInView ? "0ms" : "0ms",
                      }}
                    >
                      {/* Dotted pattern placeholder instead of SVG background */}
                      <div className="absolute left-10 bottom-24 w-32 h-32 bg-[radial-gradient(#105d97_3px,transparent_3px)] [background-size:16px_16px] opacity-20 z-0"></div>

                      {/* About Image 1 - normal flow, top left */}
                      <div className="about-img-1 block relative z-10">
                        <figure className="about-img-figure group relative overflow-hidden rounded-[2rem] shadow-lg border border-gray-100">
                          <Image
                            src="https://live.staticflickr.com/65535/55262672714_f3432d990c_b.jpg"
                            alt="Univi Production"
                            width={650}
                            height={456}
                            className="w-full aspect-[4/3] object-cover"
                          />
                          <span className="about-img-glass absolute inset-0 pointer-events-none transition-transform duration-500 ease-out origin-left scale-x-0 group-hover:scale-x-100 bg-white/20" aria-hidden />
                        </figure>
                      </div>

                      {/* About Image 2 - absolute bottom right + Experience counter inside */}
                      <div className="about-img-2 absolute w-full max-w-[260px] top-1/2 -translate-y-1/4 right-0 z-20 hidden lg:block">
                        <figure className="about-img-figure group relative overflow-hidden rounded-[2rem] shadow-xl border-8 border-white bg-white">
                          <Image
                            src="https://live.staticflickr.com/65535/55238039716_e624ae5587_b.jpg"
                            alt="Univi Products"
                            width={350}
                            height={293}
                            className="w-full aspect-square object-cover"
                          />
                          <span className="about-img-glass absolute inset-0 pointer-events-none transition-transform duration-500 ease-out origin-left scale-x-0 group-hover:scale-x-100 bg-white/20" aria-hidden />
                        </figure>
                      </div>

                      {/* Feedback Counter - Positive Feedback (vertical) above circle 95% (vertical) */}
                      <div className="feedback-counter absolute right-3 md:right-0 top-[20%] -translate-y-1/2 flex flex-col items-center gap-3 py-4 px-2 z-10 hidden lg:flex">
                        <h3
                          className="feedback-counter-label text-[#105d97] text-xs font-bold uppercase tracking-widest"
                          style={{ writingMode: "vertical-rl" }}
                        >
                          Đại lý đồng hành
                        </h3>
                        <div className="feedback-counter-circle w-10 h-10 rounded-full bg-[#105d97] flex items-center justify-center flex-shrink-0">
                          <span
                            className="text-white text-sm font-bold"
                            style={{ writingMode: "vertical-rl" }}
                          >
                            500+
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: About Us Content - từng khối trượt từ phải, delay so le */}
                    <div className="relative order-2 about-us-content space-y-6">
                      <div
                        className={`section-title space-y-4 transition-all duration-1000 ease-out ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                          }`}
                        style={{ transitionDelay: isInView ? "80ms" : "0ms" }}
                      >
                        <h3 className="text-[#105d97] text-sm font-medium uppercase tracking-wide flex items-center gap-2">
                          <FaCheckCircle className="w-4 h-4" /> Vấn Đề Bạn Gặp Phải
                        </h3>
                        <h2 className="text-xl md:text-3xl font-bold text-gray-900 leading-6 ">
                          Bạn Đang Đau Đầu Tìm Nguồn Hàng?
                        </h2>
                        <p className="text-sm md:text-base text-gray-700 leading-6">
                          Nhiều chủ shop và đại lý đang mất đi khách hàng tiềm năng vì những khó khăn trong việc tìm kiếm nguồn hàng ổn định. Univi hiểu rõ những &quot;nỗi đau&quot; này và mang đến giải pháp toàn diện cho bạn.
                        </p>
                      </div>
                      <div className="about-us-content-body space-y-6">
                        <div
                          className={`about-us-content-info space-y-5 transition-all duration-1000 ease-out ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                            }`}
                          style={{ transitionDelay: isInView ? "160ms" : "0ms" }}
                        >
                          <div className="about-us-content-list">
                            <ul className="space-y-3">
                              {[
                                "Hàng Trung Quốc giá rẻ, chất lượng kém, không hóa đơn.",
                                "Mẫu mã nội địa nghèo nàn, form dáng không chuẩn.",
                                "Nhập số lượng lớn gây đọng vốn, tồn kho cao.",
                                "Nhà cung cấp không hỗ trợ marketing và chốt sale."
                              ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm md:text-base text-gray-700 font-medium">
                                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#105d97] flex items-center justify-center">
                                    <FaCheck className="text-white text-[10px]" />
                                  </span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 3 — TẠI SAO CHỌN UNIVI? (NEW DESIGN) */}
              <section className="py-2 md:py-10">
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-[#105d97]"></span>
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#105d97] border border-blue-200 px-3 py-1 rounded-full bg-blue-50">
                      TẠI SAO CHỌN UNIVI
                    </span>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-4 lg:items-end justify-between">
                    <h2 className="text-xl md:text-3xl font-bold text-gray-900 leading-[1.2] tracking-tight m-0">
                      Khám Phá <span className="text-[#105d97]">5 Lý Do </span>
                      <span className="text-[#105d97]">Đại Lý Univi</span>  <br />Kinh Doanh Bền Vững
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 max-w-lg leading-6 m-0 pb-1">
                      Chúng tôi cam kết mang đến giá trị thực, chất lượng chuẩn mực và sự đồng hành tận tâm nhất cho từng đối tác kinh doanh.
                    </p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-stretch mt-2">
                  {/* Left: Image & Text Box */}
                  <div className="relative rounded-3xl overflow-hidden aspect-square w-full shadow-md group">
                    <Image
                      src={reasons[activeReason].img}
                      alt={reasons[activeReason].title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                    <div className="absolute bottom-2 left-4 right-4 md:bottom-3 md:left-6 md:right-auto md:w-[85%] bg-black/50 backdrop-blur-md border border-white/10 p-3 rounded-2xl text-white transform transition-all duration-500">
                      <p className="text-sm md:text-base leading-6 font-medium m-0">
                        {reasons[activeReason].desc}
                      </p>
                    </div>
                  </div>

                  {/* Right: Interactive List */}
                  <div className="flex flex-col justify-center">
                    {reasons.map((reason, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveReason(idx)}
                        className={`flex items-center justify-between py-4 md:py-5 cursor-pointer border-b border-gray-200 transition-all duration-300 group ${activeReason === idx ? '' : 'hover:border-gray-400'}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`text-sm font-bold w-6 transition-colors duration-300 ${activeReason === idx ? 'text-[#105d97]' : 'text-gray-500'}`}>
                            {reason.id}
                          </span>
                          <h3 className={`text-base md:text-lg font-bold m-0 transition-colors duration-300 ${activeReason === idx ? 'text-[#105d97]' : 'text-gray-800 group-hover:text-gray-600'}`}>
                            {reason.title}
                          </h3>
                        </div>
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors duration-300 flex-shrink-0 ${activeReason === idx ? 'bg-[#105d97] text-white' : 'bg-blue-50 text-[#105d97] group-hover:bg-[#105d97] group-hover:text-white'}`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${activeReason === idx ? 'rotate-90' : 'rotate-0'}`}>
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 4 — PHÂN LOẠI ĐẠI LÝ */}
              <section className="relative bg-white py-2 md:py-10">
                <div className="text-center mb-4 md:mb-8">
                  <h2 className="text-xl md:text-3xl font-bold text-gray-900 leading-6">
                    Khám Phá <span className="text-[#105d97]">Mô Hình Phù Hợp</span> Với Bạn
                  </h2>
                </div>

                {/* Block 1 */}
                <div className="grid md:grid-cols-2 gap-8 items-center mb-2">
                  <div className="order-2 md:order-1">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Đại Lý Shop Thời Trang</h3>
                    <p className="text-sm md:text-base text-gray-600 leading-6 mb-6">
                      Mô hình phù hợp cho các chủ shop muốn nhập hàng về bán sẵn. Univi cung cấp nguồn hàng ổn định, chất lượng cao với chiết khấu tốt nhất, giúp bạn chủ động bán lẻ và tối ưu lợi nhuận.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-y-4 gap-x-4 mb-6">
                      <div className="flex items-center gap-3">
                        <Store className="w-5 h-5 text-[#105d97]" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-gray-800">Nhập hàng từ kho</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-[#105d97]" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-gray-800">Giá sỉ cạnh tranh</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <RefreshCw className="w-5 h-5 text-[#105d97]" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-gray-800">Đổi trả linh hoạt</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5 text-[#105d97]" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-gray-800">Từ 10 sản phẩm</span>
                      </div>
                    </div>
                    <Link
                      href="/dang-ky-dai-ly"
                      aria-label="Đăng ký đại lý shop thời trang"
                      title="Đăng ký đại lý shop thời trang"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-[#105d97] hover:border-[#105d97] transition-colors group"
                    >
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white" aria-hidden="true" />
                    </Link>
                  </div>
                  <div className="order-1 md:order-2 relative aspect-[4/3] w-full rounded-xl overflow-hidden shadow-sm">
                    <Image src="https://live.staticflickr.com/65535/55262878780_7c4ed3f7bb_b.jpg" alt="Đại Lý Shop Thời Trang" fill className="object-cover" />
                  </div>
                </div>

                {/* Block 2 */}
                <div className="grid md:grid-cols-2 gap-8 items-center mb-1">
                  <div className="order-1 relative aspect-[4/3] w-full rounded-xl overflow-hidden shadow-sm">
                    <Image src="https://live.staticflickr.com/65535/55262878240_1dbc9fb261_b.jpg" alt="CTV KOC Bán Online" fill className="object-cover" />
                  </div>
                  <div className="order-2">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">CTV / KOC Bán Online</h3>
                    <p className="text-sm md:text-base text-gray-600 leading-6 mb-6">
                      Mô hình kinh doanh 0 đồng vốn dành cho người đam mê bán hàng online. Bạn tập trung vào marketing và chốt sale, phần vận hành và đóng gói để Univi lo.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-y-4 gap-x-4 mb-6">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-[#105d97]" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-gray-800">Không cần vốn</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <LucideVideo className="w-5 h-5 text-[#105d97]" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-gray-800">Kho ảnh & video</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-[#105d97]" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-gray-800">Hoa hồng cao</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-[#105d97]" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-gray-800">Hỗ trợ 1-kèm-1</span>
                      </div>
                    </div>
                    <Link
                      href="/dang-ky-dai-ly"
                      aria-label="Đăng ký cộng tác viên hoặc KOC bán online"
                      title="Đăng ký cộng tác viên hoặc KOC bán online"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-[#105d97] hover:border-[#105d97] transition-colors group"
                    >
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                {/* Block 3 */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Đơn Vị May Thương Mại</h3>
                    <p className="text-sm md:text-base text-gray-600 leading-6 mb-6">
                      Giải pháp cho các xưởng in ấn, đồng phục. Cung cấp sẵn các mẫu phôi thể thao chất lượng cao để bạn tùy biến, tiết kiệm thời gian cắt may.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-y-4 gap-x-4 mb-6">
                      <div className="flex items-center gap-3">
                        <Scissors className="w-5 h-5 text-[#105d97]" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-gray-800">Phôi Gym, Polo</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Printer className="w-5 h-5 text-[#105d97]" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-gray-800">In logo, ép nhiệt</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-[#105d97]" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-gray-800">Đơn hàng lớn</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Cpu className="w-5 h-5 text-[#105d97]" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-gray-800">Tối ưu chi phí</span>
                      </div>
                    </div>
                    <Link
                      href="/dang-ky-dai-ly"
                      aria-label="Đăng ký đơn vị may thương mại"
                      title="Đăng ký đơn vị may thương mại"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-[#105d97] hover:border-[#105d97] transition-colors group"
                    >
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white" aria-hidden="true" />
                    </Link>
                  </div>
                  <div className="order-1 md:order-2 relative aspect-[4/3] w-full rounded-xl overflow-hidden shadow-sm">
                    <Image src="https://live.staticflickr.com/65535/55260553340_97ff74083d_b.jpg" alt="Đơn Vị May Thương Mại" fill className="object-cover" />
                  </div>
                </div>
              </section>

              {/* SECTION 5 — QUYỀN LỢI ĐẠI LÝ */}
              <section className="relative bg-white py-2 md:py-10">
                <div className="text-center container mx-auto mb-10">
                  <h2 className="text-xl md:text-3xl font-bold text-gray-900 leading-6 mb-3">
                    8 Đặc Quyền Khi Trở Thành Đại Lý Univi
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 leading-6">
                    Chúng tôi cam kết đồng hành và hỗ trợ tối đa để đại lý phát triển kinh doanh bền vững và đạt lợi nhuận cao nhất.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
                  {[
                    { icon: <FaTags className="w-5 h-5" />, label: "QUYỀN LỢI 1", title: "Giá sỉ ưu đãi", desc: "Chiết khấu hấp dẫn theo từng cấp bậc đơn hàng." },
                    { icon: <FaFileAlt className="w-5 h-5" />, label: "QUYỀN LỢI 2", title: "Hóa đơn đầy đủ", desc: "Cung cấp hóa đơn đầu vào, phiếu xuất kho rõ ràng." },
                    { icon: <FaCamera className="w-5 h-5" />, label: "QUYỀN LỢI 3", title: "Hỗ trợ hình ảnh", desc: "Sử dụng miễn phí kho ảnh sản phẩm chuyên nghiệp." },
                    { icon: <FaVideo className="w-5 h-5" />, label: "QUYỀN LỢI 4", title: "Hỗ trợ video", desc: "Cung cấp video demo, review chi tiết sản phẩm." },
                    { icon: <FaHeadphones className="w-5 h-5" />, label: "QUYỀN LỢI 5", title: "Tư vấn bán hàng", desc: "Đội ngũ chuyên gia marketing đồng hành và hỗ trợ." },
                    { icon: <FaSync className="w-5 h-5" />, label: "QUYỀN LỢI 6", title: "Đổi trả linh hoạt", desc: "Chính sách đổi trả minh bạch, giảm thiểu rủi ro." },
                    { icon: <FaTruck className="w-5 h-5" />, label: "QUYỀN LỢI 7", title: "Giao hàng toàn quốc", desc: "Giao hàng nhanh chóng 2-3 ngày với mẫu có sẵn." },
                    { icon: <FaPencilAlt className="w-5 h-5" />, label: "QUYỀN LỢI 8", title: "Thiết kế riêng", desc: "Hỗ trợ thiết kế độc quyền theo yêu cầu đại lý." },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center p-5 rounded-xl border border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(16,93,151,0.08)] transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="mb-3 flex justify-center items-center w-12 h-12 rounded-full bg-blue-50 text-[#105d97]">
                        {item.icon}
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-[#c77f34]">
                        {item.label}
                      </p>
                      <h3 className="text-base font-bold text-gray-900 leading-6 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-6">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 6 — SOCIAL PROOF */}
              <section className="py-2 md:py-10">
                <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 text-center  mx-auto  ">Đối Tác & Khách Hàng Của Univi</h2>
                <div className="mb-6">
                  <PartnersSection />
                </div>
                <div className="text-left">
                  <Link href="/feedback/feedback-fitcaree" className="text-sm md:text-base text-[#105d97] hover:underline font-medium">
                    Xem thêm hình ảnh thực tế từ khách hàng
                  </Link>
                </div>
              </section>

              {/* SECTION 7 — FAQ */}
              <section className="py-2 md:py-10">
                <div className="grid lg:grid-cols-2 gap-10 items-stretch">
                  {/* Left: Text & Accordion */}
                  <div className="flex flex-col justify-center">
                    <div className="mb-8">
                      <h2 className="text-xl md:text-3xl font-bold text-gray-900 leading-6 mb-3">
                        Câu Hỏi Thường Gặp
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 leading-6">
                        Đội ngũ Univi luôn lắng nghe và làm việc chặt chẽ để hiểu ý tưởng của bạn và hiện thực hóa với sự chăm chút từng chi tiết.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { q: "Số lượng tối thiểu để trở thành đại lý là bao nhiêu?", a: "Từ 10 sản phẩm trở lên đã được hưởng chính sách đại lý." },
                        { q: "Tôi chưa có kinh nghiệm bán hàng thể thao có làm được không?", a: "Được. Univi hỗ trợ toàn bộ công cụ marketing, hình ảnh, video và tư vấn chiến lược bán hàng." },
                        { q: "Sản phẩm có thể trả lại nếu không bán được không?", a: "Univi có chính sách đổi trả linh hoạt. Chi tiết sẽ được thỏa thuận trong hợp đồng hợp tác." },
                        { q: "Tôi ở tỉnh xa có hợp tác được không?", a: "Có. Univi giao hàng toàn quốc qua đơn vị vận chuyển uy tín." },
                        { q: "Làm CTV không cần nhập hàng có được hỗ trợ hình ảnh không?", a: "Có. CTV và KOC được cung cấp miễn phí kho ảnh và video sản phẩm chuyên nghiệp." },
                        { q: "Univi có cung cấp phôi áo trơn để tôi tự in không?", a: "Có. Univi cung cấp phôi áo Gym và Polo thể thao, hỗ trợ in logo hoặc giao phôi trơn theo yêu cầu." },
                      ].map((faq, idx) => (
                        <div key={idx} className="border border-gray-100 rounded-lg bg-white overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-shadow">
                          <button
                            onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                            className="w-full text-left px-5 py-4 flex items-center justify-between focus:outline-none"
                          >
                            <div className="flex items-start gap-3 pr-4">
                              <span className="text-[#c77f34] font-bold mt-0.5">{idx + 1}.</span>
                              <span className="font-semibold text-gray-800 text-sm md:text-base">{faq.q}</span>
                            </div>
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 transition-transform duration-300">
                              {activeFaq === idx ? (
                                <span className="font-medium text-lg leading-none transform -translate-y-[1px]">-</span>
                              ) : (
                                <span className="font-medium text-lg leading-none transform -translate-y-[1px]">+</span>
                              )}
                            </div>
                          </button>
                          <div
                            className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === idx ? "max-h-40 pb-4 opacity-100" : "max-h-0 opacity-0"
                              }`}
                          >
                            <p className="text-sm md:text-base text-gray-600 ml-6">{faq.a}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Image */}
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-full w-full shadow-lg mb-4">
                    <Image
                      src="https://live.staticflickr.com/65535/55258289010_c075b06bc2_b.jpg"
                      alt="Tư vấn đại lý Univi"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>

      {/* SECTION 8 — CTA CUỐI TRANG */}
      <section
        className="relative min-h-[50vh] flex items-center overflow-hidden bg-cover bg-center bg-no-repeat px-6"
        style={{
          backgroundImage: "url('/images/slide-02.webp')",
          backgroundAttachment: "fixed",
        }}
        aria-label="Kêu gọi hành động - Đăng ký đại lý"
      >
        <div className="absolute inset-0 z-[1] bg-black/70" aria-hidden />

        <div className="container mx-auto px-4 relative z-10 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Trái: Tiêu đề + mô tả */}
            <div className="lg:col-span-7">
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-6 mb-4">
                Sẵn Sàng Bắt Đầu? Đừng Để Cơ Hội Chờ Đợi
              </h2>
              <p className="text-sm md:text-base text-[#D3D3D3] leading-6 max-w-2xl mb-6">
                Đội ngũ tư vấn Univi luôn sẵn sàng hỗ trợ bạn từ bước đầu tiên — từ chọn sản phẩm phù hợp đến chiến lược bán hàng hiệu quả.
              </p>
            </div>

            {/* Phải: Nút CTA + Liên hệ */}
            <div className="lg:col-span-4 lg:col-start-9 md:col-span-6 flex flex-col items-start lg:items-start">
              <Link
                href="/dang-ky-dai-ly"
                className="inline-block w-full px-8 py-4 bg-[#105d97] text-white font-semibold uppercase tracking-wider text-sm text-center hover:bg-[#0d4c7a] transition-colors mb-10 rounded-sm"
              >
                Đăng Ký Trở Thành Đại Lý
              </Link>

              <div className="flex flex-col gap-6 w-full">
                <a href="tel:0834204999" className="flex items-start gap-4 group">
                  <span className="flex-shrink-0 w-11 h-11 rounded bg-[#105d97] border border-[#0d4c7a] flex items-center justify-center text-white group-hover:bg-[#0d4c7a] transition-colors">
                    <FaPhone className="w-4 h-4" />
                  </span>
                  <span className="block">
                    <span className="block text-white font-semibold">0834 204 999</span>
                    <span className="block text-[#C0C0C0] text-sm mt-0.5">Hotline tư vấn</span>
                  </span>
                </a>
                <a href="mailto:dongphucunivi@gmail.com" className="flex items-start gap-4 group">
                  <span className="flex-shrink-0 w-11 h-11 rounded bg-[#105d97] border border-[#0d4c7a] flex items-center justify-center text-white group-hover:bg-[#0d4c7a] transition-colors">
                    <FaEnvelope className="w-4 h-4" />
                  </span>
                  <span className="block">
                    <span className="block text-white font-semibold">dongphucunivi@gmail.com</span>
                    <span className="block text-[#C0C0C0] text-sm mt-0.5">Liên hệ email</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
