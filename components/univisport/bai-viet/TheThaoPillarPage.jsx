import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ArrowRight,
  CheckCircle,
  Building2,
  Users,
  Package,
  BarChart3,
  Palette,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Share2,
  Activity,
  Dumbbell,
  Zap,
  Layers,
  Award,
  BookOpen
} from "lucide-react";
import PartnersSection from "../PartnersSection";
import ProcessSteps from "../ProcessSteps";
import BangMauHero from '../bang-mau/BangMauHero';
import FabricCardComponent from '../FabricCardComponent';
import { fabrics } from '../../../data/fabrics';

export const theThaoFaqs = [
  ["Đồng phục thể thao chuyên dụng là gì?", "Đồng phục thể thao chuyên dụng là trang phục được thiết kế, lựa chọn chất liệu và hoàn thiện theo đặc thù của từng bộ môn, người mặc, cường độ vận động và môi trường sử dụng."],
  ["Những ai nên sử dụng đồng phục thể thao chuyên dụng?", "Gym, Fitness Center, Yoga/Pilates Studio, CLB Pickleball, đội Running, CLB MMA/Kickfit, đội Golf/Tennis, doanh nghiệp tổ chức team building và các đội nhóm thể thao đều có thể cần đồng phục theo mục đích riêng."],
  ["Đồng phục Gym và Yoga có nên dùng cùng một loại vải không?", "Không nhất thiết. Gym thường cần cân bằng vận động, thoát ẩm và độ bền; Yoga thường chú trọng mềm mại, co giãn và cảm giác trên da."],
  ["Đồng phục Pickleball nên chọn như thế nào?", "Nên xem xét chuyển động ngang, xoay thân, vươn tay, khả năng nhận diện đội nhóm và cách logo hiển thị trên sân."],
  ["Đồng phục Running cần ưu tiên yếu tố nào?", "Running thường ưu tiên sản phẩm nhẹ, thoáng, nhanh khô và không gây vướng khi vận động liên tục."],
  ["Đồng phục MMA và Kickfit cần chú ý gì?", "Nên kiểm tra độ bền, đường may, phạm vi chuyển động, vùng dễ ma sát và khả năng thoát ẩm bằng các động tác thực tế."],
  ["HLV và hội viên có nên mặc cùng một mẫu không?", "Không nhất thiết. HLV cần nhận diện nhanh và thường xuyên vận động; hội viên thường cần sản phẩm dễ mặc và dễ bảo quản. Có thể giữ chung ngôn ngữ thương hiệu nhưng khác form hoặc vật liệu."],
  ["Có thể thiết kế đồng phục theo màu thương hiệu không?", "Có thể tư vấn màu nền, màu phối, vị trí logo và concept theo nhận diện thương hiệu. Màu trên file thiết kế nên được đối chiếu bằng mẫu thực tế."],
  ["Có hỗ trợ thiết kế đồng phục thể thao không?", "Đồng Phục Univi có định hướng tư vấn và lên concept theo bộ môn và nhận diện thương hiệu. Quy trình cụ thể và phạm vi chỉnh sửa cần được xác nhận theo từng dự án."],
  ["Có thể tái sản xuất mẫu cũ không?", "Có thể trao đổi nếu còn mẫu, thông tin thiết kế, màu, logo và bảng size. Nên cung cấp lại dữ liệu cũ để kiểm tra trước khi xác nhận đơn bổ sung."],
  ["Đồng Phục Univi có xưởng sản xuất không?", "Theo hồ sơ hiện có, Univi sở hữu xưởng trên 2.000m² tại phường Chương Mỹ, Hà Nội và công suất gần 100.000 sản phẩm/tháng. Tiến độ thực tế cần xác nhận theo từng mẫu, số lượng, nguyên liệu và lịch sản xuất."],
];

function SectionHeading({ number, children }) {
  return (
    <h2 className="text-xl md:text-xl font-bold text-gray-900 mb-4 leading-tight">
      {number && <span className="text-[#105d97] mr-2">{number}.</span>}
      {children}
    </h2>
  );
}

function SectionSubheading({ children }) {
  return <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 mt-5">{children}</h3>;
}

function Prose({ children }) {
  return <p className="text-base text-gray-700 leading-7 mb-3">{children}</p>;
}

function BulletList({ items }) {
  return (
    <ul className="mb-4 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm md:text-base text-gray-700 leading-relaxed bg-gray-50/80 p-2.5 sm:p-3 rounded-xl border border-gray-100">
          <CheckCircle className="w-4 h-4 text-[#105d97] mt-1 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function NumberedList({ items }) {
  return (
    <ol className="space-y-2 mb-4">
      {items.map(([title, desc], i) => (
        <li key={i} className="flex gap-3 items-start bg-gray-50 rounded-lg p-3 border border-gray-100">
          <span className="font-bold text-[#105d97] w-5 shrink-0">{i + 1}.</span>
          <span className="text-base text-gray-700 leading-6">
            <strong className="text-gray-900">{title}:</strong> {desc}
          </span>
        </li>
      ))}
    </ol>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h3>
      <div className="text-sm text-gray-700 leading-6">{children}</div>
    </div>
  );
}

function InternalLink({ href, children }) {
  return (
    <Link href={href} className="text-[#105d97] underline underline-offset-2 hover:text-[#0d4c7a] transition-colors font-medium">
      {children}
    </Link>
  );
}

function TableSimple({ headers, rows }) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg mb-4 my-4">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left font-semibold text-gray-900 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 align-top text-gray-700">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function ArticleImage({ src, alt, caption, aspectRatio, fullHeight, objectFit }) {
  const isFullHeight = fullHeight || aspectRatio === 'auto';

  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
      {isFullHeight ? (
        <div className="w-full">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            sizes="(max-width: 768px) 100vw, 1000px"
            className="w-full h-auto block"
            quality={85}
          />
        </div>
      ) : (
        <div className="relative w-full" style={{ aspectRatio: aspectRatio || '16/7' }}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className={`${objectFit === 'contain' ? 'object-contain' : 'object-cover'} w-full h-full`}
            quality={82}
          />
        </div>
      )}
      {caption && (
        <figcaption className="px-4 py-2 text-xs text-gray-500 text-center bg-gray-50 border-t border-gray-100">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function ArticleSection({ children, id }) {
  return <section id={id} className="mb-12 scroll-mt-24">{children}</section>;
}

export const sportsCustomers = [
  {
    name: "Chuỗi phòng tập Welly Fitness",
    category: "Phòng tập & Fitness Center",
    description: "Chuỗi phòng tập Gym & Fitness chuyên nghiệp sử dụng hệ thống đồng phục PT, HLV và nhân sự vận hành với công nghệ vải UNI DRY thoát ẩm vượt trội.",
    images: [
      {
        src: "https://live.staticflickr.com/65535/55225861463_3664d1bb27_b.jpg",
        alt: "HLV Welly Fitness mặc đồng phục PT chuyên nghiệp",
      },
      {
        src: "https://live.staticflickr.com/65535/55225691906_723ea37492_b.jpg",
        alt: "Đội ngũ huấn luyện viên Funfit Fitness trong bộ đồng phục Univi",
      },
      {
        src: "https://live.staticflickr.com/65535/55325793257_a0f72e23f3_b.jpg",
        alt: "Hình ảnh thực tế đồng phục Ladysfit Vietnam",
      },
    ],
  },
  {
    name: "Instructor Jumping Fitness, The Fit Space & Home Pilates",
    category: "Yoga, Pilates & Group Fitness",
    description: "Studio Yoga & Pilates ưu tiên chất liệu UNI SUPER COOL mềm mượt, co giãn 4 chiều hỗ trợ chuyển động linh hoạt và tôn vinh vóc dáng.",
    images: [
      {
        src: "/khach-hang/zenfit/chuoi-phong-tap-zenfit.webp",
        alt: "Giáo viên Pilates Home Pilates mặc đồng phục Yoga Pilates Univi",
      },
      {
        src: "/khach-hang/zenfit/1.jpg",
        alt: "HLV Group X Instructor Jumping Fitness với đồng phục thể thao linh hoạt",
      },
      {
        src: "/khach-hang/zenfit/2.jpg",
        alt: "Hình ảnh phòng tập The Fit Space cùng trang phục HLV",
      },
    ],
  },
  {
    name: "The One Kickfit, Kickfit Sport, AhaGym & ByFit",
    category: "Kickfit, MMA & Gym Fitness",
    description: "Đơn vị tập luyện Kickfit & MMA đòi hỏi đường may gia cố siêu bền, độ co giãn vượt trội chịu được ma sát và va đập cường độ cao.",
    images: [
      {
        src: "/khach-hang/kickfit/chuoi-phong-tap-the-one-kickfit.webp",
        alt: "VĐV và HLV The One Kickfit trong đồng phục MMA Kickfit Univi",
      },
      {
        src: "/khach-hang/kickfit/1.jpg",
        alt: "Đội ngũ Kickfit Sport sử dụng áo thể thao Athletic Fit Univi",
      },
      {
        src: "/khach-hang/kickfit/5.jpg",
        alt: "Hình ảnh tập luyện AhaGym và ByFit với đồng phục thể thao",
      },
    ],
  },
];

function CustomerCard({ customer }) {
  const [activeImg, setActiveImg] = useState(0);
  const images = customer.images || [];
  const currentImg = images[activeImg] || images[0];

  return (
    <article className="flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden">
        <Image
          src={currentImg.src}
          alt={currentImg.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-opacity duration-300"
          loading="lazy"
          quality={82}
        />
        {customer.badge && (
          <span className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-sm">
            {customer.badge}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 px-3 py-2 bg-gray-50/80 border-b border-gray-100 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImg(idx)}
              className={`relative w-12 h-9 rounded overflow-hidden border-2 transition-all shrink-0 ${activeImg === idx
                ? "border-[#105d97] ring-1 ring-[#105d97]"
                : "border-transparent opacity-65 hover:opacity-100"
                }`}
              aria-label={`Xem hình ảnh ${idx + 1} của ${customer.name}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="48px"
                className="object-cover"
                loading="lazy"
                quality={60}
              />
            </button>
          ))}
        </div>
      )}

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#105d97] border border-blue-100">
            {customer.category}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {customer.name}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {customer.description}
        </p>
      </div>
    </article>
  );
}

function SportsImageSlider() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const slides = [
    {
      src: "https://live.staticflickr.com/65535/55265020362_ca2f0cac4b_b.jpg",
      alt: "Đồng phục Gym & Fitness Univi",
      title: "Đồng Phục Gym & Fitness Center",
      caption: "Cân bằng hoàn hảo giữa khả năng co giãn, quản lý độ ẩm và nhận diện thương hiệu cho HLV PT.",
    },
    {
      src: "https://live.staticflickr.com/65535/55271837427_17c3ae7f93_b.jpg",
      alt: "Đồng phục Pickleball chuyên dụng Univi",
      title: "Đồng Phục Pickleball & Đội Nhóm",
      caption: "Linh hoạt vai và thân trên, nổi bật màu thương hiệu trên sân đấu.",
    },
    {
      src: "https://live.staticflickr.com/65535/55234415043_453cb017c2_b.jpg",
      alt: "Đồng phục Yoga & Pilates Univi",
      title: "Bộ Trang Phục Yoga & Pilates Studio",
      caption: "Chất liệu mềm mượt UNI SUPER COOL nâng niu làn da, co giãn 4 chiều hỗ trợ mọi động tác kéo giãn.",
    },
    {
      src: "/images/chay-bo.jpg",
      alt: "Đồng phục chạy bộ Running Univi",
      title: "Đồng Phục Running & CLB Chạy Bộ",
      caption: "Công nghệ UNI QUICK DRY siêu nhẹ, siêu thoáng, nhanh khô cho dải cự ly dài.",
    },
    {
      src: "https://live.staticflickr.com/65535/55225839956_d472d7b3bc_b.jpg",
      alt: "Đồng phục võ thuật MMA & Kickfit Univi",
      title: "Đồng Phục MMA & KickFit chuyên nghiệp",
    },
  ];

  const total = slides.length;

  const nextSlide = () => setActiveIdx((prev) => (prev + 1) % total);
  const prevSlide = () => setActiveIdx((prev) => (prev - 1 + total) % total);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div className="my-6 sm:my-10 md:my-12">
      <div
        className="relative flex items-center justify-center min-h-[260px] xs:min-h-[320px] sm:min-h-[440px] md:min-h-[580px] py-3 sm:py-6 px-1 sm:px-2 overflow-hidden select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Navigation Arrow Left */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-1 sm:left-4 lg:left-6 z-40 p-1.5 sm:p-3 rounded-full bg-white/80 backdrop-blur-md shadow-md border border-gray-200/70 text-gray-700 hover:bg-[#105d97] hover:text-white hover:border-[#105d97] transition-all duration-300 cursor-pointer transform hover:scale-110 active:scale-95"
          aria-label="Ảnh trước"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
        </button>

        {/* Navigation Arrow Right */}
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-1 sm:left-auto sm:right-4 lg:right-6 z-40 p-1.5 sm:p-3 rounded-full bg-white/80 backdrop-blur-md shadow-md border border-gray-200/70 text-gray-700 hover:bg-[#105d97] hover:text-white hover:border-[#105d97] transition-all duration-300 cursor-pointer transform hover:scale-110 active:scale-95"
          aria-label="Ảnh tiếp theo"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
        </button>

        {/* Slides Stack Container */}
        <div className="relative w-full max-w-6xl flex items-center justify-center">
          {slides.map((slide, idx) => {
            const isCenter = idx === activeIdx;
            const isLeft = idx === (activeIdx - 1 + total) % total;
            const isRight = idx === (activeIdx + 1) % total;

            if (!isCenter && !isLeft && !isRight) return null;

            let positionClasses = "";
            if (isCenter) {
              positionClasses = "z-20 relative w-full max-w-[880px] lg:max-w-[960px] scale-100 opacity-100 shadow-xl md:shadow-2xl translate-x-0 rotate-0";
            } else if (isLeft) {
              positionClasses = "hidden md:block absolute -left-12 lg:-left-6 z-10 w-[520px] lg:w-[600px] scale-[0.85] opacity-50 blur-[0.5px] hover:opacity-85 cursor-pointer -translate-x-6 -rotate-2";
            } else if (isRight) {
              positionClasses = "hidden md:block absolute -right-12 lg:-right-6 z-10 w-[520px] lg:w-[600px] scale-[0.85] opacity-50 blur-[0.5px] hover:opacity-85 cursor-pointer translate-x-6 rotate-2";
            }

            return (
              <div
                key={slide.title}
                onClick={() => setActiveIdx(idx)}
                className={`group transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-xl sm:rounded-2xl md:rounded-3xl border border-gray-200/90 bg-white overflow-hidden ${positionClasses}`}
              >
                {/* Browser Mockup Header */}
                <div className="bg-gray-900 text-gray-300 px-3 py-1.5 sm:px-5 sm:py-2.5 flex items-center gap-2 sm:gap-3 border-b border-gray-800">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400 inline-block" />
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400 inline-block" />
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400 inline-block" />
                  </div>
                  <div className="bg-gray-800/80 text-gray-400 text-[10px] sm:text-xs px-2.5 py-0.5 sm:px-4 sm:py-1 rounded-md mx-auto truncate max-w-[200px] sm:max-w-[280px] font-mono">
                    dongphucunivi.com/dong-phuc-the-thao
                  </div>
                </div>

                {/* Large Slide Image Container */}
                <div className="relative w-full aspect-[4/3] xs:aspect-[16/10] sm:h-[400px] md:h-[500px] lg:h-[560px] bg-gray-100 overflow-hidden">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 1000px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    priority={isCenter}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Caption & Indicators */}
      <div className="text-center mt-3 sm:mt-5 px-2">
        <h4 className="font-extrabold text-gray-900 text-base sm:text-lg md:text-xl mb-1">
          {slides[activeIdx].title}
        </h4>
        {slides[activeIdx].caption && (
          <p className="text-xs sm:text-sm text-gray-600 italic max-w-lg mx-auto leading-relaxed">
            {slides[activeIdx].caption}
          </p>
        )}

        {/* Slide Pagination Dots */}
        <div className="flex justify-center items-center gap-2 sm:gap-2.5 mt-3 sm:mt-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-500 cursor-pointer ${activeIdx === idx ? "w-6 sm:w-8 bg-[#105d97] shadow-xs" : "w-2 sm:w-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
              aria-label={`Chuyển đến ảnh ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


export default function TheThaoPillarPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-16 lg:py-20 overflow-hidden border-b border-gray-100">
        <div className="container mx-auto px-4 ">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left side: Image Collage */}
            <div className="lg:col-span-6 xl:col-span-6">
              <div className="grid grid-cols-12 gap-3 sm:gap-4 items-stretch">
                {/* Main Big Left Card */}
                <div className="col-span-7">
                  <div className="bg-gray-100 p-1 sm:p-1.5 rounded-[28px] rounded-tr-[84px] border border-gray-200/80 shadow-xs transition-transform duration-300 hover:scale-[1.01] h-full flex flex-col justify-center">
                    <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] rounded-[24px] rounded-tr-[80px] overflow-hidden">
                      <Image
                        src="https://live.staticflickr.com/65535/55380998614_857a01eced_b.jpg"
                        alt="Đồng phục thể thao chuyên dụng Univi cho đội nhóm và phòng tập"
                        fill
                        priority
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 60vw, 35vw"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Stacked Cards */}
                <div className="col-span-5 flex flex-col justify-between gap-3 sm:gap-4">
                  {/* Top Right Card */}
                  <div className="bg-gray-100 p-1 sm:p-1.5 rounded-[22px] rounded-tr-[46px] border border-gray-200/80 shadow-xs transition-transform duration-300 hover:scale-[1.02]">
                    <div className="relative w-full h-[130px] sm:h-[170px] md:h-[195px] rounded-[18px] rounded-tr-[42px] overflow-hidden">
                      <Image
                        src="https://live.staticflickr.com/65535/55271837427_17c3ae7f93_b.jpg"
                        alt="Đồng phục Pickleball chuyên dụng Univi"
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 40vw, 20vw"
                      />
                    </div>
                  </div>

                  {/* Bottom Right Card */}
                  <div className="bg-gray-100 p-1 sm:p-1.5 rounded-[22px] rounded-bl-[46px] border border-gray-200/80 shadow-xs transition-transform duration-300 hover:scale-[1.02]">
                    <div className="relative w-full h-[130px] sm:h-[170px] md:h-[195px] rounded-[18px] rounded-bl-[42px] overflow-hidden">
                      <Image
                        src="https://live.staticflickr.com/65535/55233961430_65e7fb65f4_b.jpg"
                        alt="Đồng phục Yoga Pilates chuyên dụng Univi"
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 40vw, 20vw"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Hero Content & Feature List */}
            <div className="lg:col-span-6 xl:col-span-6">
              <div className="max-w-xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#105d97] mb-3">
                  Giải Pháp Đồng Phục Thể Thao B2B &amp; Đội Nhóm
                </p>
                <h1 className="text-xl sm:text-2xl lg:text-2xl font-extrabold text-gray-900 tracking-tight leading-[1.2] mb-2">
                  Đồng Phục Thể Thao Chuyên Dụng Theo Từng Bộ Môn
                </h1>
                <p className="text-gray-600 text-base leading-relaxed mb-8">
                  Tìm hiểu cách chọn đồng phục thể thao chuyên dụng cho Gym, Yoga, Pickleball, Running, MMA, Golf, Tennis và đội nhóm. Khám phá vật liệu, thiết kế, quy trình và năng lực Đồng Phục Univi.
                </p>

                {/* Feature Items with Circular Icons */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 text-[#105d97] flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base md:text-lg leading-snug">
                        Vật liệu R&amp;D chuyên dụng
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed mt-0.5">
                        Dòng vải UNI QUICK DRY, UNI SUPER COOL, UNI BLENDED cùng công nghệ thoát ẩm UNI DRY vượt trội.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 text-[#105d97] flex items-center justify-center shrink-0">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base md:text-lg leading-snug">
                        Tối ưu form &amp; Hiệu suất vận động
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed mt-0.5">
                        Thiết kế form Athletic Fit, Regular Fit, Compression Fit kiểm tra bằng động tác vận động thực tế.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 text-[#105d97] flex items-center justify-center shrink-0">
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base md:text-lg leading-snug">
                        Thiết kế &amp; Đồng bộ nhận diện
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed mt-0.5">
                        Tư vấn mockup 2D/3D đồng bộ chuẩn xác theo màu thương hiệu phòng tập, CLB và doanh nghiệp.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Call to Action Buttons */}
                <div className="flex flex-wrap gap-3.5">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new Event("openContactModal"))}
                    className="inline-flex items-center gap-2 bg-[#105d97] text-white font-semibold px-6 py-3.5 rounded-full hover:bg-[#0d4c7a] transition-colors shadow-sm cursor-pointer"
                  >
                    Nhận tư vấn &amp; báo giá
                  </button>
                  <Link
                    href="/bang-mau"
                    className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-medium px-6 py-3.5 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Xem bảng màu thể thao
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-[#0d4c7a] border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              { icon: Building2, label: "Xưởng sản xuất", value: "2.000m²" },
              { icon: Package, label: "Công suất", value: "100.000 sp/tháng" },
              { icon: Users, label: "Phòng tập & Đội nhóm", value: "500+" },
              { icon: BarChart3, label: "Kinh nghiệm R&D", value: "9+ năm" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="py-4 px-4 text-center">
                <Icon className="w-5 h-5 text-white/50 mx-auto mb-1" />
                <div className="text-white font-bold text-lg">{value}</div>
                <div className="text-white/60 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-10">
        {/* Introduction */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200/60 shadow-xs">
          <Prose>
            Một chiếc áo thể thao đẹp khi đứng yên chưa chắc đã phù hợp khi vận động.
          </Prose>
          <Prose>
            HLV phải đứng lớp nhiều giờ. PT liên tục nâng tay, cúi người và thị phạm động tác. Người tập Yoga cần sự mềm mại và linh hoạt khi chuyển tư thế. Người chơi Pickleball phải xoay thân và di chuyển ngang. Runner cần sản phẩm nhẹ, thoáng và nhanh khô. VĐV MMA hoặc Kickfit lại cần quan tâm nhiều hơn đến độ bền, phạm vi chuyển động và vùng dễ ma sát.
          </Prose>
          <Prose>
            Đó là lý do <strong>đồng phục thể thao chuyên dụng</strong> không nên được xem đơn giản là một chiếc áo có gắn logo.
          </Prose>
          <Prose>
            Một sản phẩm chuyên dụng cần được lựa chọn từ bộ môn, người mặc, cường độ vận động, môi trường sử dụng, form, chất liệu và nhận diện thương hiệu.
          </Prose>
          <Prose>
            <strong>Đồng Phục Univi</strong> định hướng <strong>TIÊN PHONG</strong> cung cấp giải pháp đồng phục thể thao chuyên nghiệp cho các chuỗi phòng tập và các đội nhóm tập Gym, Fitness, Pickleball, Yoga, Running, Pilates, MMA... tại Việt Nam.
          </Prose>
          <Prose>
            Hoạt động R&amp;D của Univi tập trung vào chất liệu, form dáng, hiệu suất vận động và trải nghiệm sử dụng. Năng lực sản xuất giúp chuyển thiết kế đã duyệt thành hệ thống đồng phục có thể triển khai cho phòng tập, CLB, doanh nghiệp và đội nhóm.
          </Prose>
        </div>

        {/* Section 1 */}
        <ArticleSection id="dong-phuc-the-thao-chuyen-dung-la-gi">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start my-6">
            <div className="lg:col-span-6">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:h-[400px] lg:h-[420px] rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200/80 shadow-sm bg-gray-50">
                <Image
                  src="https://live.staticflickr.com/65535/55265597349_7e56c0fc2b_b.jpg"
                  alt="Đồng phục thể thao chuyên dụng Univi cho PT HLV phòng gym"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  quality={85}
                />
              </div>
              <p className="text-center text-xs text-gray-500 mt-2.5 italic px-2">
                Đồng phục thể thao chuyên dụng được hoàn thiện theo đặc thù từng bộ môn và bối cảnh sử dụng thực tế.
              </p>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center">
              <SectionHeading number="1">Đồng Phục Thể Thao Chuyên Dụng Là Gì?</SectionHeading>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                Đồng phục thể thao chuyên dụng là trang phục được thiết kế, lựa chọn chất liệu và hoàn thiện theo đặc thù của từng bộ môn, cường độ vận động, người mặc và môi trường sử dụng.
              </p>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                Người mặc có thể là HLV, PT, lễ tân phòng tập, quản lý Fitness Center, hội viên, thành viên CLB, đội chạy bộ, người chơi Pickleball, VĐV Golf, Tennis, võ sinh MMA/Kickfit hoặc nhân sự tham gia hoạt động thể thao và team building.
              </p>
              <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/70 border-l-4 border-[#105d97] my-3 shadow-xs">
                <p className="font-semibold text-gray-900 text-sm md:text-base leading-relaxed">
                  Điểm quan trọng nhất là không phải mọi hoạt động thể thao đều tạo ra cùng một yêu cầu đối với trang phục.
                </p>
              </div>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Một mẫu phù hợp cho Yoga chưa chắc phù hợp với Running. Một mẫu polo phù hợp Golf chưa chắc phù hợp với MMA. Một chiếc áo đẹp cho team building chưa chắc phù hợp để HLV mặc và vận động liên tục trong nhiều giờ.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <SectionSubheading>1.1 Đồng phục thể thao chuyên dụng khác áo thể thao thông thường như thế nào?</SectionSubheading>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-3">
              Áo thể thao bán lẻ thường tập trung vào nhu cầu cá nhân. Đồng phục thể thao chuyên dụng phải giải quyết thêm nhiều yếu tố: nhiều người cùng sử dụng, nhiều vóc dáng và bảng size, form phù hợp với hoạt động, chất liệu phù hợp cường độ vận động, logo và màu sắc đồng nhất, khả năng tái sử dụng và khả năng bổ sung sản phẩm.
            </p>
            <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/60 border-l-4 border-amber-400 text-xs sm:text-sm text-gray-700 font-medium italic my-3">
              Vì vậy, không nên đánh giá đồng phục chỉ bằng hình ảnh mẫu hoặc độ bóng của bề mặt vải.
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <SectionSubheading>1.2 Năm câu hỏi cần trả lời trước khi chọn đồng phục</SectionSubheading>
            <BulletList items={[
              "Người mặc vận động như thế nào?",
              "Mồ hôi và độ ẩm được xử lý ra sao?",
              "Form có cho phép chuyển động tự nhiên không?",
              "Nhận diện thương hiệu có rõ trong bối cảnh sử dụng không?",
              "Khi cần bổ sung, mẫu có thể được triển khai nhất quán không?",
            ]} />
            <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-200/70 text-xs sm:text-sm text-gray-700 italic mt-3">
              Đó là nền tảng để phân biệt đồng phục thể thao chuyên dụng với việc chỉ may một chiếc áo thể thao có logo.
            </div>
          </div>
        </ArticleSection>

        {/* Section 2 */}
        <ArticleSection id="vi-sao-nen-chon-theo-bo-mon">
          <div className=" mx-auto mb-8">
            <SectionHeading number="2">Vì Sao Nên Chọn Đồng Phục Theo Bộ Môn?</SectionHeading>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Mỗi bộ môn tạo ra một kiểu chuyển động, cường độ và môi trường sử dụng khác nhau. Vì vậy, đồng phục nên được lựa chọn theo bộ môn thay vì dùng một cấu hình cho tất cả.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#105d97] flex items-center justify-center mb-3">
                <Dumbbell className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">
                2.1 Gym và Fitness cần ưu tiên chuyển động
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                HLV và PT có thể phải nâng tay, kéo, đẩy, squat, cúi người, thị phạm động tác và di chuyển liên tục. Do đó cần cân bằng độ co giãn, độ thoáng, khả năng quản lý độ ẩm, cảm giác trên da và form gọn.
              </p>
              <p className="text-xs text-gray-500">
                Tham khảo <InternalLink href="/dong-phuc-gym">đồng phục Gym</InternalLink> và <InternalLink href="/dong-phuc-fitness-center">đồng phục Fitness Center</InternalLink>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#105d97] flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">
                2.2 Yoga và Pilates cần chú trọng cảm giác mặc
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Yoga và Pilates có nhiều động tác gập, xoắn, kéo giãn, đổi tư thế và giữ tư thế trong thời gian dài. Vì vậy, chất liệu mềm, mượt, co giãn và form phù hợp có vai trò quan trọng.
              </p>
              <p className="text-xs text-gray-500">
                Tham khảo <InternalLink href="/dong-phuc-yoga-pilates">đồng phục Yoga - Pilates</InternalLink>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#105d97] flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">
                2.3 Pickleball cần linh hoạt phần thân và vai
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Pickleball có nhiều chuyển động ngang, cúi, xoay thân, vươn tay và đổi hướng nhanh. Thiết kế cần hỗ trợ chuyển động đồng thời tạo nhận diện rõ cho đội nhóm trên sân.
              </p>
              <p className="text-xs text-gray-500">
                Tham khảo <InternalLink href="/dong-phuc-pickleball">đồng phục Pickleball</InternalLink>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#105d97] flex items-center justify-center mb-3">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">
                2.4 Running cần ưu tiên nhẹ và thoáng
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Running thường yêu cầu trọng lượng nhẹ, thoáng, nhanh khô, không gây vướng khi chạy và nhận diện tốt khi chạy theo đội.
              </p>
              <p className="text-xs text-gray-500">
                Tham khảo <InternalLink href="/dong-phuc-chay-bo">đồng phục chạy bộ</InternalLink>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#105d97] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">
                2.5 MMA và Kickfit cần quan tâm độ bền và ma sát
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                MMA/Kickfit có các động tác đấm, đá, xoay người, vật và ma sát. Vì vậy cần kiểm tra kỹ đường may, phạm vi chuyển động, độ bền và vùng dễ ma sát.
              </p>
              <p className="text-xs text-gray-500">
                Tham khảo <InternalLink href="/dong-phuc-mma">đồng phục MMA</InternalLink>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#105d97] flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">
                2.6 Golf và Tennis cần lịch sự và linh hoạt xoay vai
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Golf và Tennis thường cần cân bằng hình ảnh lịch sự, khả năng vận động vai, cảm giác mặc ngoài trời và độ thoáng. Polo thể thao là lựa chọn phổ biến, cần kiểm tra kỹ cổ áo, tay áo và phạm vi xoay vai.
              </p>
              <p className="text-xs text-gray-500">
                Tham khảo <InternalLink href="/dong-phuc-golf-tennis">đồng phục Golf - Tennis</InternalLink>.
              </p>
            </div>
          </div>

          <SportsImageSlider />
        </ArticleSection>

        {/* Section 3 */}
        <ArticleSection id="cac-loai-dong-phuc-pho-bien">
          <SectionHeading number="3">Các Loại Đồng Phục Thể Thao Chuyên Dụng Phổ Biến</SectionHeading>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 my-6">
            {[
              { src: "https://live.staticflickr.com/65535/55345070285_61882f8b50_b.jpg", alt: "Áo thun thể thao cổ tròn Univi", label: "3.1 Áo thun cổ tròn" },
              { src: "https://live.staticflickr.com/65535/55236119339_0f54998a12_b.jpg", alt: "Áo tank top thể thao Univi", label: "3.2 Tank top" },
              { src: "https://live.staticflickr.com/65535/55265084647_9069991283_b.jpg", alt: "Áo polo thể thao Univi", label: "3.3 Áo polo thể thao" },
              { src: "https://live.staticflickr.com/65535/55320776721_c2ff717f80_b.jpg", alt: "Bộ Yoga và Pilates Univi", label: "3.4 Bộ Yoga & Pilates" },
              { src: "https://live.staticflickr.com/65535/55319937779_bde2f94090_b.jpg", alt: "Đồng phục thi đấu và CLB Univi", label: "3.5 Thi đấu & CLB" },
              { src: "https://live.staticflickr.com/65535/55237998293_6d625a404c_b.jpg", alt: "Áo gió thể thao Univi", label: "3.6 Áo gió thể thao" },
            ].map(({ src, alt, label }) => (
              <figure key={label} className="overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white">
                <div className="relative" style={{ aspectRatio: '4/3' }}>
                  <Image src={src} alt={alt} fill sizes="300px" className="object-cover" quality={80} />
                </div>
                <figcaption className="text-center text-xs font-semibold text-[#105d97] py-2 bg-gray-50 border-t border-gray-100">
                  {label}
                </figcaption>
              </figure>
            ))}
          </div>

          <SectionSubheading>3.1 Áo thun thể thao cổ tròn</SectionSubheading>
          <Prose>
            Áo cổ tròn phù hợp đội nhóm, lớp tập, hội viên, sự kiện thể thao và các chương trình cần triển khai dễ. Khi duyệt mẫu cần kiểm tra độ rộng nách, độ dài thân, độ co giãn, vị trí logo và cảm giác khi giơ tay hoặc cúi người.
          </Prose>

          <SectionSubheading>3.2 Tank top</SectionSubheading>
          <Prose>
            Tank top có thể phù hợp với Gym, Fitness, Jumping, Group X và một số hoạt động cường độ cao. Thiết kế cần chú ý phần nách, vai và độ dài thân.
          </Prose>

          <SectionSubheading>3.3 Áo polo thể thao</SectionSubheading>
          <Prose>
            Polo phù hợp HLV, PT, quản lý, lễ tân, Golf, Tennis, Pickleball và đội nhóm cần hình ảnh chỉn chu. Không nên lựa chọn polo chỉ vì bề mặt giống áo công sở. Cần kiểm tra cổ áo, nẹp áo, vai, tay áo, độ dài thân và khả năng vận động.
          </Prose>

          <SectionSubheading>3.4 Bộ Yoga và Pilates</SectionSubheading>
          <Prose>
            Có thể gồm T-shirt, tank top, sports bra, legging, quần tập và áo khoác nhẹ. Form và chất liệu cần được lựa chọn theo mức độ vận động và yêu cầu về cảm giác mặc.
          </Prose>

          <SectionSubheading>3.5 Đồng phục thi đấu và CLB</SectionSubheading>
          <Prose>
            Có thể gồm Pickleball, Tennis, Golf, Running, MMA và các đội thể thao nội bộ. Cần thống nhất màu đội, logo, tên đội, số áo nếu có, nhà tài trợ nếu có, quy tắc đặt logo và bảng size.
          </Prose>

          <SectionSubheading>3.6 Áo gió thể thao</SectionSubheading>
          <Prose>
            Áo gió phù hợp hoạt động ngoài trời, di chuyển, trước hoặc sau buổi tập, đội nhóm và sự kiện. Tham khảo <InternalLink href="/dong-phuc-ao-gio">đồng phục áo gió</InternalLink>.
          </Prose>
        </ArticleSection>

        {/* Section 4 */}
        <ArticleSection id="dong-phuc-theo-tung-bo-mon">
          <SectionHeading number="4">Đồng Phục Thể Thao Chuyên Dụng Theo Từng Bộ Môn</SectionHeading>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8">
            Phân tích cấu hình và yêu cầu kỹ thuật chi tiết theo đặc thù vận động của 7 nhóm bộ môn phổ biến nhất hiện nay.
          </p>

          <div className="space-y-6 md:space-y-8 my-8">
            {[
              {
                title: "4.1 Đồng phục Gym và Fitness",
                highlight: "Hỗ trợ vận động, thoát ẩm và tạo hình ảnh chuyên nghiệp cho HLV, PT.",
                text: "HLV/PT thường vừa vận động vừa giao tiếp với hội viên. Vì vậy cần cân bằng form, độ co giãn, cảm giác mặc, độ thoáng, khả năng quản lý độ ẩm và nhận diện thương hiệu.",
                imgSrc: "https://live.staticflickr.com/65535/55265366801_2bfa268363_b.jpg",
                imgAlt: "Đồng phục Gym và Fitness HLV PT Univi",
              },
              {
                title: "4.2 Đồng phục Yoga và Pilates",
                highlight: "Ưu tiên mềm mại, co giãn 4 chiều và cảm giác êm ái trên da.",
                text: "Yoga có nhiều tư thế gập, xoắn và kéo giãn. Pilates cần form phù hợp để giáo viên và người tập quan sát chuyển động cơ thể. UNI SUPER COOL là hướng vật liệu phù hợp với nhóm cần bề mặt mềm, mượt, mát và co giãn.",
                imgSrc: "https://live.staticflickr.com/65535/55233703043_72edf2538f_b.jpg",
                imgAlt: "Đồng phục Yoga và Pilates Univi",
              },
              {
                title: "4.3 Đồng phục Pickleball",
                highlight: "Cân bằng khả năng di chuyển ngang, xoay thân và nhận diện nổi bật.",
                text: "Pickleball có nhiều chuyển động ngang, xoay thân và vươn tay. Polo hoặc áo thể thao có thể sử dụng màu nền, màu phối, logo, tên đội và số áo. Thiết kế cần tạo cảm giác đồng bộ khi cả đội xuất hiện trên sân.",
                imgSrc: "https://live.staticflickr.com/65535/55273287874_96694796ef_b.jpg",
                imgAlt: "Đồng phục Pickleball chuyên dụng Univi",
              },
              {
                title: "4.4 Đồng phục Golf và Tennis",
                highlight: "Lịch sự chỉn chu, thoáng khí ngoài trời và tối ưu xoay vai.",
                text: "Golf và Tennis thường cần cân bằng hình ảnh lịch sự, khả năng vận động vai, cảm giác mặc ngoài trời và độ thoáng. Polo thể thao là lựa chọn phổ biến. Tuy nhiên cần kiểm tra cổ áo, tay áo, độ dài thân và khả năng xoay vai. Tham khảo đồng phục Golf - Tennis.",
                imgSrc: "https://live.staticflickr.com/65535/55466651767_d4051f630b_b.jpg",
                imgAlt: "Đồng phục Golf và Tennis Univi",
              },
              {
                title: "4.5 Đồng phục chạy bộ (Running)",
                highlight: "Siêu nhẹ, siêu thoáng, nhanh khô và hạn chế ma sát trên dải cự ly dài.",
                text: "Đồng phục Running nên ưu tiên nhẹ, thoáng, nhanh khô và không gây vướng khi vận động liên tục. Không nên chọn áo quá rộng vì có thể gây vướng. Cũng không nên chọn form quá bó nếu khiến người chạy khó chịu trong quãng đường dài.",
                imgSrc: "/images/chay-bo.jpg",
                imgAlt: "Đồng phục chạy bộ Running Univi",
              },
              {
                title: "4.6 Đồng phục MMA và Kickfit",
                highlight: "Độ bền đường may cao, chịu ma sát và linh hoạt tuyệt đối.",
                text: "MMA/Kickfit cần chú ý độ bền, độ linh hoạt, đường may, phạm vi chuyển động và vùng ma sát. Mẫu cần được thử bằng các động tác thực tế thay vì chỉ mặc đứng.",
                imgSrc: "https://live.staticflickr.com/65535/55225839791_31fb80be62_b.jpg",
                imgAlt: "Đồng phục MMA và Kickfit Univi",
              },
              {
                title: "4.7 Đồng phục Team Building và sự kiện",
                highlight: "Dễ mặc cho nhiều vóc dáng, màu sắc rực rỡ nổi bật ảnh tập thể.",
                text: "Team building thường cần dễ mặc, phù hợp nhiều vóc dáng, màu thương hiệu rõ, thoải mái trong nhiều giờ và dễ nhận diện trong ảnh tập thể. Tham khảo đồng phục teambuilding.",
                imgSrc: "https://live.staticflickr.com/65535/55223495363_430b63f911_b.jpg",
                imgAlt: "Đồng phục teambuilding sự kiện Univi",
              },
            ].map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={item.title}
                  className="grid grid-cols-1 md:grid-cols-2 rounded-2xl md:rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 bg-white"
                >
                  <div
                    className={`p-6 sm:p-8 flex flex-col justify-center bg-gray-50/50 ${isEven ? "md:order-1" : "md:order-2 border-t md:border-t-0 md:border-l border-gray-100"
                      }`}
                  >
                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-sm font-medium text-[#105d97] mb-2 leading-snug">
                      {item.highlight}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.text}
                    </p>
                    {item.title.includes("Golf") && (
                      <p className="mt-2 text-xs">
                        Xem chi tiết <InternalLink href="/dong-phuc-golf-tennis">đồng phục Golf - Tennis</InternalLink>.
                      </p>
                    )}
                    {item.title.includes("Team Building") && (
                      <p className="mt-2 text-xs">
                        Xem chi tiết <InternalLink href="/dong-phuc-teambuilding">đồng phục teambuilding</InternalLink>.
                      </p>
                    )}
                  </div>

                  <div
                    className={`relative w-full h-[240px] sm:h-[280px] md:h-[320px] overflow-hidden bg-gray-100 ${isEven ? "md:order-2 border-t md:border-t-0 md:border-l border-gray-100" : "md:order-1"
                      }`}
                  >
                    <Image
                      src={item.imgSrc}
                      alt={item.imgAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      quality={85}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ArticleSection>

        {/* Section 5 */}
        <ArticleSection id="dong-phuc-theo-doi-tuong">
          <SectionHeading number="5">Đồng Phục Thể Thao Theo Từng Đối Tượng Sử Dụng</SectionHeading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="rounded-xl border border-gray-200 p-5 bg-white shadow-xs">
              <h3 className="font-bold text-gray-900 text-lg mb-2 text-[#105d97]">
                5.1 Đồng phục HLV và PT
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                HLV/PT cần được nhận diện nhanh và phải thường xuyên thị phạm. Athletic Fit có thể phù hợp với nhóm cần hình ảnh gọn nhưng vẫn linh hoạt.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                UNI SUPER COOL hoặc UNI BLENDED có thể được xem xét tùy cường độ, cảm giác mặc và tần suất sử dụng. Logo trước ngực phù hợp nhận diện khi giao tiếp gần. Logo sau lưng hữu ích khi HLV đứng trên sàn tập.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-5 bg-white shadow-xs">
              <h3 className="font-bold text-gray-900 text-lg mb-2 text-[#105d97]">
                5.2 Đồng phục lễ tân và quản lý
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Lễ tân không vận động giống HLV nhưng vẫn phải đứng lâu, di chuyển, giao tiếp và duy trì hình ảnh thương hiệu.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                UNI BLENDED có thể được xem xét khi ưu tiên sự mềm mại, tính thực dụng và sử dụng thường xuyên.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-5 bg-white shadow-xs">
              <h3 className="font-bold text-gray-900 text-lg mb-2 text-[#105d97]">
                5.3 Đồng phục hội viên
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Regular Fit thường dễ triển khai cho nhóm đông và nhiều vóc dáng.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Nếu sản phẩm dùng để bán hoặc tặng hội viên, nên cân nhắc bảng size, màu sắc, kiểu dáng, cách giặt và khả năng mặc trong và ngoài phòng tập. UNI QUICK DRY phù hợp khi ưu tiên sản phẩm nhẹ và nhanh khô.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-5 bg-white shadow-xs">
              <h3 className="font-bold text-gray-900 text-lg mb-2 text-[#105d97]">
                5.4 Đồng phục CLB và đội nhóm
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Đội nhóm cần mức độ đồng bộ cao: tên đội, màu chủ đạo, logo, số áo, nhà tài trợ, bảng size và khả năng bổ sung thành viên.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Nên thống nhất một file nhận diện và mã màu trước khi duyệt mockup.
              </p>
            </div>
          </div>
        </ArticleSection>

        {/* Section 6 */}
        <ArticleSection id="cach-lua-chon-dong-phuc">
          <SectionHeading number="6">Cách Lựa Chọn Đồng Phục Thể Thao Chuyên Dụng</SectionHeading>

          <SectionSubheading>6.1 Bắt đầu từ bối cảnh sử dụng</SectionSubheading>
          <Prose>Đừng bắt đầu bằng câu hỏi &ldquo;Mẫu nào đẹp?&rdquo;. Hãy bắt đầu bằng 7 câu hỏi bối cảnh:</Prose>
          <BulletList items={[
            "Ai mặc?",
            "Mặc ở đâu?",
            "Vận động như thế nào?",
            "Mồ hôi nhiều hay ít?",
            "Mặc trong bao lâu?",
            "Giặt bao nhiêu lần?",
            "Có cần bổ sung về sau không?",
          ]} />

          <SectionSubheading>6.2 Chọn form theo người mặc</SectionSubheading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-bold text-[#105d97] text-sm mb-1">Regular Fit</h4>
              <p className="text-xs text-gray-600 leading-relaxed">Dễ triển khai cho nhóm đông, vừa vặn tự nhiên với nhiều vóc dáng.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-bold text-[#105d97] text-sm mb-1">Athletic Fit</h4>
              <p className="text-xs text-gray-600 leading-relaxed">Phù hợp HLV, PT hoặc người cần form gọn gàng nhưng vẫn đảm bảo linh hoạt.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-bold text-[#105d97] text-sm mb-1">Compression Fit</h4>
              <p className="text-xs text-gray-600 leading-relaxed">Chỉ nên cân nhắc khi phù hợp với mục đích sử dụng đặc thù và nhóm người mặc.</p>
            </div>
          </div>

          <SectionSubheading>6.3 Kiểm tra mẫu bằng động tác thật</SectionSubheading>
          <Prose>
            Mẫu thử nên được kiểm tra bằng nâng tay, xoay vai, cúi người, squat, plank, chạy hoặc động tác đặc trưng của bộ môn. Quan sát vùng nách, vai, lưng, bụng, hông và vị trí logo.
          </Prose>

          <SectionSubheading>6.4 Chuẩn bị brief</SectionSubheading>
          <Prose>Một brief chuẩn bị đặt hàng nên có đầy đủ:</Prose>
          <BulletList items={[
            "Bộ môn & nhóm người mặc",
            "Môi trường sử dụng & số lượng dự kiến",
            "Bảng size & Logo vector",
            "Màu thương hiệu & vị trí logo",
            "Kiểu áo & chất liệu ưu tiên",
            "Thời điểm cần triển khai & khả năng bổ sung",
          ]} />
        </ArticleSection>

        {/* Section 7 */}
        <ArticleSection id="chat-lieu-va-cong-nghe">
          <SectionHeading number="7">Chất Liệu Và Công Nghệ Trong Đồng Phục Thể Thao</SectionHeading>
          <Prose>
            Chất liệu cần được lựa chọn theo bối cảnh sử dụng, không nên có một loại vải được xem là phù hợp cho mọi bộ môn.
          </Prose>

          {/* Fabric Cards Interactive Component */}
          <div className="my-8">
            <FabricCardComponent />
          </div>

          <div className=" my-6">
            <SectionSubheading>Công nghệ UNI DRY là gì?</SectionSubheading>
            <Prose>
              <strong>UNI DRY</strong> được dùng để mô tả định hướng công nghệ quản lý độ ẩm. Định hướng của UNI DRY là đưa độ ẩm ra bề mặt để hỗ trợ bay hơi, giảm cảm giác bí và hỗ trợ vận động.
            </Prose>
            <Prose>
              Tuy nhiên, UNI DRY không có nghĩa một loại vải có thể sử dụng cho mọi bộ môn. Cần xem xét đồng thời vật liệu, cấu trúc vải, form, bộ môn, cường độ vận động và môi trường sử dụng.
            </Prose>
            <Prose>
              Trong quá trình R&amp;D, <strong>Đồng Phục Univi</strong> tập trung vào độ bền, độ co giãn, độ thoáng khí, khả năng thoát ẩm, chống xù lông, độ bền màu và cảm giác thoải mái. Khi cần đánh giá sâu, nên yêu cầu mẫu vải và mẫu sản phẩm cụ thể thay vì quyết định chỉ dựa trên tên gọi.
            </Prose>
          </div>
        </ArticleSection>

        {/* Section 8 */}
        <ArticleSection id="thiet-ke-theo-nhan-dien">
          <SectionHeading number="8">Thiết Kế Đồng Phục Theo Nhận Diện Thương Hiệu</SectionHeading>

          <BangMauHero fabrics={fabrics} />

          <SectionSubheading>8.1 Màu sắc phải bắt đầu từ nhận diện</SectionSubheading>
          <Prose>
            Màu áo thường được nhìn thấy trước logo. Với phòng tập, màu có thể liên kết với không gian và biển hiệu. Với CLB, màu giúp đội nhận diện nhau. Với doanh nghiệp, màu giúp hình ảnh sự kiện đồng nhất.
          </Prose>
          <Prose>
            Có thể sử dụng màu nền, màu phối, viền, tay áo, cổ áo và mảng màu. Tham khảo <InternalLink href="/bang-mau">bảng màu đồng phục thể thao</InternalLink>. Màu hiển thị trên màn hình vẫn cần được đối chiếu bằng mẫu thực tế trước sản xuất.
          </Prose>

          <SectionSubheading>8.2 Logo phải đặt theo bối cảnh</SectionSubheading>
          <BulletList items={[
            "Logo trước ngực: Phù hợp nhận diện khi giao tiếp gần và tư vấn hội viên.",
            "Logo sau lưng: Phù hợp nhận diện từ xa và khi HLV đứng trên sàn tập.",
            "Logo tay áo: Sử dụng khi cần thêm thông tin nhận diện phụ.",
            "Tên đội / Vai trò: Phù hợp CLB, đội nhóm hoặc hệ thống nhiều phân cấp.",
          ]} />

          <SectionSubheading>8.3 Bộ sưu tập giúp rút ngắn thời gian chọn mẫu</SectionSubheading>
          <Prose>
            <InternalLink href="/bo-suu-tap">Bộ sưu tập Đồng Phục Univi</InternalLink> giúp tham khảo kiểu dáng, form, phối màu, phong cách và cách ứng dụng. Mục tiêu không phải sao chép mẫu mà là xác định hướng thẩm mỹ để phát triển thiết kế phù hợp bộ môn và nhận diện thương hiệu.
          </Prose>
        </ArticleSection>

        {/* Section 9 */}
        <ArticleSection id="khach-hang-thuc-te">
          <SectionHeading number="9">Khách Hàng Thực Tế Sử Dụng Đồng Phục Thể Thao Của Đồng Phục Univi</SectionHeading>
          <Prose>
            Thay vì chỉ giới thiệu danh sách khách hàng, phần này tập trung vào những case thực tế đã được Univi công bố, qua đó cho thấy đồng phục thể thao chuyên dụng được lựa chọn và sử dụng như thế nào trong các môi trường vận động khác nhau.
          </Prose>
          <Prose>
            Các case dưới đây được lấy từ những bài viết và trang feedback chính thức của Đồng Phục Univi. Nội dung phân biệt giữa thông tin đã được case study ghi nhận và những nhận định tham khảo, tránh suy diễn các kết quả kinh doanh mà nguồn không công bố.
          </Prose>

          <SectionSubheading>9.1 Goldmark Fitness Yoga &amp; Pool – Đồng phục HLV cho môi trường vận động liên tục</SectionSubheading>
          <ArticleImage
            src="https://live.staticflickr.com/65535/55361725098_34a37e731f_b.jpg"
            alt="Đồng phục HLV Goldmark Fitness Yoga &amp; Pool"
            caption="HLV Goldmark Fitness Yoga &amp; Pool trong bộ đồng phục đứng dáng và dễ vận động"
          />
          <Prose>
            Goldmark Fitness Yoga &amp; Pool là một case tiêu biểu cho bài toán đồng phục HLV trong môi trường có nhiều hoạt động vận động.
          </Prose>
          <Prose>
            Theo case study của Univi, đội ngũ HLV tại Goldmark có thể làm việc từ quầy tư vấn đến sàn tập, hướng dẫn hội viên, tập mẫu trên máy hoặc tham gia các hoạt động cường độ cao như boxing. Vì vậy, yêu cầu đối với đồng phục không chỉ là hình ảnh đồng bộ mà còn phải đáp ứng khả năng vận động và sự thoải mái trong thời gian làm việc dài.
          </Prose>
          <Prose>
            Điểm được feedback Goldmark nhấn mạnh là form áo đứng dáng nhưng vẫn dễ vận động. Đây là tiêu chí quan trọng với HLV/PT: áo cần đủ gọn để tạo hình ảnh khỏe khoắn, nhưng không được bó cứng ở vai, nách hoặc thân áo khi người mặc nâng tay, squat hay thị phạm động tác.
          </Prose>
          <Prose>
            Case study cũng ghi nhận phản hồi từ anh Tuấn – HLV cá nhân tại Goldmark Fitness Yoga &amp; Pool – sau một tháng sử dụng. Phản hồi tập trung vào sự thoải mái ở vùng vai và nách, độ co giãn khi đưa tay lên cao, khả năng thoát mồ hôi và hình ảnh logo nổi bật trên nền áo. Đây là phản hồi trải nghiệm cá nhân của người mặc, không phải kết quả kiểm nghiệm trong phòng thí nghiệm.
          </Prose>
          <div className="p-4 bg-[#105d97]/5 border-l-4 border-[#105d97] rounded-r-xl my-4 text-sm text-gray-700">
            <strong>Bài học từ Goldmark:</strong> nếu đồng phục dành cho HLV, hãy kiểm tra mẫu bằng chính các động tác mà HLV thực hiện hàng ngày thay vì chỉ đánh giá qua ảnh mockup.
          </div>
          <p className="mb-6 text-sm">
            👉 <InternalLink href="/bai-viet/dong-phuc-hlv-goldmark-fitness">Đọc case Đồng Phục HLV Goldmark Fitness</InternalLink>
          </p>

          <SectionSubheading>9.2 The One Kickfit – Áo HLV/PT cho Kickfit, Boxing và MMA</SectionSubheading>
          <ArticleImage
            src="https://live.staticflickr.com/65535/55226243965_056408a6d4_b.jpg"
            alt="Đồng phục HLV The One Kickfit"
            caption="HLV The One Kickfit trong đồng phục Kickfit Boxing MMA nhẹ và co giãn tốt"
          />
          <Prose>
            The One Kickfit là case phù hợp để nhìn vào yêu cầu của đồng phục trong môi trường vận động mạnh.
          </Prose>
          <Prose>
            Theo bài feedback của Univi, The One Kickfit hoạt động với các bộ môn Kickfit, MMA, Boxing và Kickboxing. HLV phải thực hiện các động tác như đấm, đá, xoay người, chỉnh tư thế và di chuyển liên tục trong quá trình hướng dẫn. Vì vậy, vùng vai, nách và thân áo cần có khả năng hỗ trợ chuyển động.
          </Prose>
          <Prose>
            Feedback trực tiếp từ HLV Bùi Quốc Huy tập trung vào ba điểm: áo nhẹ, co giãn tốt và thoải mái khi vận động. Anh cũng đánh giá form áo ôm body, giúp hình ảnh HLV rõ nét hơn khi đứng lớp. Một HLV khác trong cùng bài feedback cũng nhận xét áo nhẹ, thoải mái, co giãn tốt và thoát mồ hôi tốt khi vận động nhiều.
          </Prose>
          <Prose>
            Case này cũng giới thiệu UNI QUICK DRY kết hợp định hướng công nghệ UNI DRY cho nhóm hoạt động cần nhanh khô và quản lý độ ẩm. Bài viết đồng thời nhấn mạnh form Raglan, với đường tay áo hỗ trợ chuyển động vùng vai – một chi tiết đáng xem xét khi thiết kế đồng phục cho Boxing, Kickfit hoặc MMA.
          </Prose>
          <Prose>
            Điểm quan trọng cần hiểu đúng: feedback của HLV là trải nghiệm sử dụng thực tế, không phải phép đo hiệu suất trong phòng thí nghiệm. Giá trị của case nằm ở việc cho thấy các tiêu chí như trọng lượng áo, độ co giãn, cảm giác nóng/bí và khả năng vận động nên được kiểm tra trong môi trường làm việc thật.
          </Prose>
          <div className="p-4 bg-[#105d97]/5 border-l-4 border-[#105d97] rounded-r-xl my-4 text-sm text-gray-700">
            <strong>Bài học từ The One Kickfit:</strong> với các bộ môn cường độ cao, đừng chỉ hỏi &ldquo;áo có đẹp không?&rdquo; mà cần hỏi &ldquo;HLV có thể đấm, đá, xoay, nâng tay và đứng lớp trong nhiều giờ mà vẫn thoải mái không?&rdquo;.
          </div>
          <p className="mb-6 text-sm">
            👉 <InternalLink href="/bai-viet/feedback-the-one-kickfit-ao-gym-pt-thoang-nhe-univi">Đọc case Feedback The One Kickfit</InternalLink>
          </p>

          <SectionSubheading>9.3 Welly Fitness – Đồng phục HLV/PT trong hệ sinh thái nhiều bộ môn</SectionSubheading>
          <ArticleImage
            src="https://live.staticflickr.com/65535/55225938034_6cf39d08ee_b.jpg"
            alt="Đồng phục HLV PT Welly Fitness"
            caption="Đồng phục HLV/PT Welly Fitness thiết kế phân vai chuyên nghiệp"
          />
          <Prose>
            Welly Fitness là case cho thấy một bài toán khác: một hệ thống có nhiều bộ môn nhưng vẫn cần một ngôn ngữ nhận diện thống nhất.
          </Prose>
          <Prose>
            Theo case study của Univi, Welly là hệ sinh thái tập luyện gồm Gym, Yoga, Pilates, GroupX, Kickboxing, bơi lội và các dịch vụ phục hồi. Hồ sơ dự án ghi nhận Welly có nhiều nhóm dịch vụ và nhóm học viên khác nhau; vì vậy đồng phục của đội ngũ phải xuất hiện trong nhiều bối cảnh từ sàn tập, khu máy, lớp nhóm, quầy tư vấn đến sự kiện và nội dung truyền thông.
          </Prose>
          <Prose>
            Mẫu đồng phục được Univi giới thiệu cho Welly có nền đen phối tím, nhận diện Welly và ký hiệu PT. Các chi tiết này giúp phân biệt vai trò của người mặc trong không gian có nhiều hoạt động.
          </Prose>
          <Prose>
            Một điểm đáng chú ý trong case Welly là cách Univi phân tích đồng phục theo hai lớp: &ldquo;gốc&rdquo; và &ldquo;diện&rdquo;.
            <br />&ldquo;Gốc&rdquo; là cảm giác mặc, khả năng quản lý mồ hôi, độ co giãn, độ bền và tính ổn định khi tái sản xuất.
            <br />&ldquo;Diện&rdquo; là màu sắc, logo, form dáng và hình ảnh thương hiệu.
          </Prose>
          <Prose>
            Cách tiếp cận này phù hợp với đồng phục thể thao chuyên dụng vì một thiết kế đẹp nhưng không thoải mái sẽ khó được duy trì trong vận hành thực tế. Ngược lại, một chiếc áo có tính năng tốt nhưng thiếu nhận diện sẽ không phát huy hết giá trị thương hiệu.
          </Prose>
          <Prose>
            Case study Welly cũng chủ động ghi rõ giới hạn dữ liệu: nguồn không công bố số lượng áo của riêng dự án, tỷ lệ hài lòng, mức tăng doanh thu hay tỷ lệ gia hạn hội viên. Vì vậy, không nên sử dụng những kết quả này như các chỉ số thành công đã được chứng minh.
          </Prose>
          <div className="p-4 bg-[#105d97]/5 border-l-4 border-[#105d97] rounded-r-xl my-4 text-sm text-gray-700">
            <strong>Bài học từ Welly Fitness:</strong> khi một hệ thống có nhiều bộ môn và nhiều vai trò, nên xây dựng một hệ đồng phục thay vì chỉ đặt một mẫu áo đơn lẻ.
          </div>
          <p className="mb-6 text-sm">
            👉 <InternalLink href="/bai-viet/welly-fitness-chon-univi-dong-phuc-5-sao">Đọc case Welly Fitness</InternalLink>
          </p>

          <SectionSubheading>9.4 AhaGym – Đồng phục HLV với form thể thao và chất liệu UNI SUPER COOL</SectionSubheading>
          <ArticleImage
            src="https://live.staticflickr.com/65535/55361502236_1d191b3d77_b.jpg"
            alt="Đồng phục HLV AhaGym"
            caption="Đồng phục HLV AhaGym phom ôm vừa tôn dáng cùng chất liệu UNI SUPER COOL"
          />
          <Prose>
            AhaGym là case tập trung khá rõ vào mối quan hệ giữa form áo, màu thương hiệu và chất liệu.
          </Prose>
          <Prose>
            Theo bài feedback của Univi, AhaGym hoạt động với nhiều bộ môn như Fitness, Yoga, Boxing, Aerobic, MMA, Zumba và Sexy Dance, đồng thời có đội ngũ HLV/PT. Điều đó tạo ra yêu cầu đồng phục vừa phải chỉn chu khi giao tiếp với hội viên, vừa đủ thoải mái để HLV liên tục demo động tác và coaching.
          </Prose>
          <Prose>
            Các yêu cầu được ghi nhận trong brief dự án gồm:
          </Prose>
          <BulletList items={[
            "Phom áo ôm vừa, tôn dáng nhưng vẫn hỗ trợ vận động.",
            "Màu sắc thương hiệu AhaGym được giữ nhất quán.",
            "Chất liệu sử dụng là UNI SUPER COOL.",
            "Ưu tiên cảm giác mềm, mịn, mát, nhẹ và thoát ẩm.",
          ]} />
          <Prose>
            Case AhaGym cũng nhấn mạnh rằng form áo không nên được duyệt chỉ bằng hình ảnh. Áo quá rộng có thể khiến tổng thể thiếu gọn; áo quá bó có thể gây khó khăn khi nâng tay, xoay vai hoặc cúi người. Vì vậy, form cần được đánh giá bằng các động tác thực tế mà HLV sử dụng trong ca làm việc.
          </Prose>
          <div className="p-4 bg-[#105d97]/5 border-l-4 border-[#105d97] rounded-r-xl my-4 text-sm text-gray-700">
            <strong>Bài học từ AhaGym:</strong> với đồng phục HLV, &ldquo;tôn dáng&rdquo; và &ldquo;dễ vận động&rdquo; không phải hai mục tiêu đối lập. Form tốt phải tìm được điểm cân bằng giữa hình ảnh thể thao và công năng.
          </div>
          <p className="mb-6 text-sm">
            👉 <InternalLink href="/bai-viet/feedback-ahagym">Đọc case Feedback AhaGym</InternalLink>
          </p>

          <SectionSubheading>9.5 Mysterise Fitness – Đồng phục thể thao cho chuỗi phòng tập</SectionSubheading>
          <ArticleImage
            src="https://live.staticflickr.com/65535/55226107445_2106f30576_b.jpg"
            alt="Đồng phục HLV Mysterise Fitness"
            caption="Mẫu đồng phục HLV Mysterise Fitness với đường cắt cúp tạo sự đồng bộ"
          />
          <Prose>
            Mysterise Fitness là một case feedback trực tiếp trên hệ thống dự án của Đồng Phục Univi.
          </Prose>
          <Prose>
            Trang feedback giới thiệu mẫu đồng phục HLV được phát triển theo hướng chuyên nghiệp, mạnh mẽ và tinh tế, với các đường cắt cúp được tính toán để tôn dáng đội ngũ và tạo sự đồng bộ trong hệ thống phòng tập.
          </Prose>
          <Prose>
            Về chất liệu, case Mysterise sử dụng UNI QUICK DRY, với định hướng nhẹ, thoát ẩm và phù hợp với môi trường vận động cường độ cao. Trang feedback cũng đề cập đến cấu tạo Polyester và thông tin an toàn dệt may theo hồ sơ của dự án.
          </Prose>
          <Prose>
            Điểm đáng chú ý ở case này là sự kết hợp giữa thiết kế nhận diện và tính năng vận động. Đồng phục không chỉ tạo hình ảnh thống nhất cho đội ngũ mà còn được xây dựng quanh nhu cầu chuyển động của HLV trong môi trường Fitness.
          </Prose>
          <div className="p-4 bg-[#105d97]/5 border-l-4 border-[#105d97] rounded-r-xl my-4 text-sm text-gray-700">
            <strong>Bài học từ Mysterise Fitness:</strong> với một chuỗi phòng tập, đồng phục nên được nhìn như một phần của hệ thống nhận diện – từ kiểu dáng, màu sắc, đường cắt đến chất liệu đều cần được kiểm soát nhất quán.
          </div>
          <p className="mb-6 text-sm">
            👉 <InternalLink href="/feedback/chuoi-phong-tap-mysterise-fitness">Đọc Feedback Chuỗi phòng tập Mysterise Fitness</InternalLink>
          </p>

          <SectionSubheading>9.6 Năm case – năm góc nhìn về đồng phục thể thao chuyên dụng</SectionSubheading>
          <Prose>
            Các case trên không đại diện cho một công thức duy nhất. Mỗi dự án bắt đầu từ một bối cảnh khác nhau:
          </Prose>
          <TableSimple
            headers={["Khách hàng", "Bối cảnh", "Điểm nổi bật"]}
            rows={[
              ["Goldmark Fitness Yoga & Pool", "HLV làm việc và vận động liên tục", "Form đứng dáng, dễ vận động, thoáng"],
              ["The One Kickfit", "Kickfit, Boxing, MMA, Kickboxing", "Nhẹ, co giãn, hỗ trợ vận động mạnh"],
              ["Welly Fitness", "Hệ sinh thái nhiều bộ môn", "Hệ nhận diện và phân vai HLV/PT"],
              ["AhaGym", "Fitness, Yoga, Boxing, MMA và nhiều lớp tập", "Form ôm vừa, màu thương hiệu, UNI SUPER COOL"],
              ["Mysterise Fitness", "Chuỗi phòng tập", "Thiết kế đồng bộ, UNI QUICK DRY, thoát ẩm"],
            ]}
          />
          <Prose>
            Điểm chung giữa các case không phải là tất cả đều dùng cùng một mẫu áo hay cùng một loại vải.
          </Prose>
          <Prose>
            Điểm chung là đồng phục được lựa chọn dựa trên bối cảnh sử dụng thực tế.
          </Prose>
          <BulletList items={[
            "HLV cần vận động nhiều thì ưu tiên chuyển động.",
            "Môi trường cường độ cao thì cần quan tâm trọng lượng, độ thoáng và quản lý độ ẩm.",
            "Hệ thống nhiều bộ môn thì cần phân vai và nhận diện.",
            "Nhóm cần hình ảnh khỏe khoắn thì phải cân bằng giữa form và sự thoải mái.",
          ]} />
          <Prose>
            Đây cũng là cách Đồng Phục Univi tiếp cận bài toán đồng phục thể thao chuyên dụng: đúng bộ môn, đúng người mặc, đúng chất liệu và đúng trải nghiệm sử dụng.
          </Prose>

          {/* Partners / Fitness Centers Logo Grid */}
          <div className="py-6 bg-gray-50 rounded-2xl my-6">
            <h3 className="text-center text-lg md:text-xl font-bold tracking-tight text-gray-900 mb-4">
              Các phòng tập &amp; CLB tin tưởng Đồng Phục Thể Thao Univi
            </h3>
            <PartnersSection category="fitness-gym" />
          </div>
        </ArticleSection>

        {/* Section 10 */}
        <ArticleSection id="quy-trinh-dat-hang">
          <SectionHeading number="10">Quy Trình Đặt Đồng Phục Thể Thao Chuyên Dụng</SectionHeading>
          <ProcessSteps />

          <NumberedList items={[
            ["Bước 1: Xác định nhu cầu", "Cần xác định bộ môn, người mặc, môi trường, số lượng, thời gian sử dụng và kiểu dáng mong muốn."],
            ["Bước 2: Tư vấn chất liệu và form", "Sau khi hiểu bối cảnh sử dụng, mới lựa chọn giữa UNI QUICK DRY, UNI SUPER COOL, UNI BLENDED hoặc cấu hình vật liệu phù hợp khác."],
            ["Bước 3: Thiết kế concept", "Concept cần thể hiện màu, logo, vị trí nhận diện, đường phối và form."],
            ["Bước 4: Duyệt mẫu thật", "Mẫu thật giúp kiểm tra cảm giác, độ rủ, độ co giãn, cổ, vai, đường may, vị trí logo và màu sắc."],
            ["Bước 5: Sản xuất và kiểm tra", "Sau khi mẫu được duyệt, sản phẩm được triển khai theo cấu hình đã xác nhận."],
            ["Bước 6: Đánh giá sau sử dụng", "Sau một giai đoạn sử dụng, nên ghi nhận cảm giác mặc, độ thoáng, khả năng thoát ẩm và độ ổn định form."],
          ]} />
        </ArticleSection>

        {/* Section 11 */}
        <ArticleSection id="nang-luc-san-xuat">
          <SectionHeading number="11">Năng Lực Sản Xuất Và Hệ Thống Phát Triển Sản Phẩm Của Đồng Phục Univi</SectionHeading>

          <div className="my-6 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <iframe
              className="aspect-video w-full"
              src="https://www.youtube.com/embed/0AABoh2a-Sk"
              title="Năng lực sản xuất đồng phục thể thao UNIVI"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <SectionSubheading>11.1 R&amp;D theo chất liệu, form và hiệu suất vận động</SectionSubheading>
          <Prose>
            Phòng R&amp;D của UNIVI nghiên cứu chất liệu, form dáng, hiệu suất vận động và trải nghiệm người dùng. Các tiêu chí được nêu trong hồ sơ gồm độ bền, độ co giãn, độ thoáng khí, khả năng thoát ẩm, chống xù lông, độ bền màu và độ thoải mái.
          </Prose>

          <SectionSubheading>11.2 Năng lực xưởng</SectionSubheading>
          <Prose>
            Theo hồ sơ năng lực và nội dung giới thiệu hiện có, Đồng Phục Univi sở hữu xưởng trên 2.000m² tại phường Chương Mỹ, Hà Nội và công suất gần 100.000 sản phẩm/tháng. Tiến độ thực tế phụ thuộc vào mẫu, số lượng, kỹ thuật logo, nguyên liệu và lịch sản xuất.
          </Prose>

          <SectionSubheading>11.3 Giải pháp 2S Uniform</SectionSubheading>
          <Prose>
            Đối với phòng tập và Fitness Center, hệ thống <InternalLink href="/giai-phap-2s">giải pháp 2S Uniform</InternalLink> phân tách:
          </Prose>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <h4 className="font-bold text-[#105d97] text-base mb-1">Staff Uniform</h4>
              <p className="text-xs text-gray-700">HLV, PT, Lễ tân, Quản lý phòng tập.</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <h4 className="font-bold text-indigo-900 text-base mb-1">Member Uniform</h4>
              <p className="text-xs text-gray-700">Hội viên, quà tặng &amp; Chương trình cộng đồng.</p>
            </div>
          </div>
        </ArticleSection>

        {/* Section 12 */}
        <ArticleSection id="bo-suu-tap-va-bang-mau">
          <SectionHeading number="12">Bộ Sưu Tập Và Bảng Màu Đồng Phục Thể Thao</SectionHeading>
          <Prose>
            <InternalLink href="/bo-suu-tap">Bộ sưu tập Đồng Phục Univi</InternalLink> giúp hình dung kiểu dáng, form, phối màu và phong cách. Có thể dùng bộ sưu tập để xác định hướng: Tối giản cho Pilates, Mạnh mẽ cho Kickfit, Linh hoạt cho Pickleball, Đồng bộ cho Fitness.
          </Prose>
          <Prose>
            <InternalLink href="/bang-mau">Bảng màu đồng phục thể thao</InternalLink> giúp chuyển nhận diện thương hiệu thành thiết kế trên trang phục.
          </Prose>

          <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 my-6">
            <SectionSubheading>12.1 Checklist trước khi gửi yêu cầu</SectionSubheading>
            <BulletList items={[
              "Bộ môn thể thao áp dụng",
              "Môi trường sử dụng (Trong nhà / Ngoài trời)",
              "Nhóm người mặc (HLV, Hội viên, Đội nhóm)",
              "Số lượng & phân bổ bảng size",
              "Logo vector (AI / PDF / CDR)",
              "Màu thương hiệu chuẩn",
              "Vị trí in / thêu logo",
              "Kiểu dáng mong muốn (Polo, Cổ tròn, Tanktop...)",
              "Chất liệu ưu tiên (nếu đã có)",
              "Thời điểm cần triển khai",
              "Khả năng đặt bổ sung về sau",
              "Hình ảnh không gian hoặc đồng phục cũ (nếu có)",
            ]} />
          </div>
        </ArticleSection>

        {/* Section 13 */}
        <ArticleSection id="cau-hoi-thuong-gap">
          <SectionHeading number="13">Câu Hỏi Thường Gặp</SectionHeading>
          <div className="space-y-3 my-6">
            {theThaoFaqs.map(([question, answer], index) => (
              <div key={index} className="rounded-xl border border-gray-200 bg-white shadow-xs">
                <button
                  type="button"
                  id={`sport-faq-btn-${index}`}
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left font-semibold text-gray-900 text-sm cursor-pointer"
                  aria-expanded={expandedFaq === index}
                  aria-controls={`sport-faq-answer-${index}`}
                >
                  <span>{question}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${expandedFaq === index ? "rotate-180" : ""}`} />
                </button>
                {expandedFaq === index && (
                  <div
                    id={`sport-faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`sport-faq-btn-${index}`}
                    className="border-t border-gray-100 px-4 py-3.5 text-sm leading-6 text-gray-700"
                  >
                    {answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ArticleSection>

        {/* Conclusion + CTA */}
        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6 md:p-8 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Kết luận</h2>
          <Prose>
            Đồng phục thể thao chuyên dụng không chỉ là áo thể thao có in logo. Một sản phẩm phù hợp phải được xây dựng từ: <strong>Bộ môn + Người mặc + Chuyển động + Chất liệu + Form + Nhận diện thương hiệu</strong>.
          </Prose>
          <Prose>
            Gym cần sự linh hoạt. Yoga và Pilates cần cảm giác mềm mại. Pickleball cần chuyển động và nhận diện đội nhóm. Running cần nhẹ, thoáng và nhanh khô. MMA/Kickfit cần độ bền và phạm vi chuyển động. Golf và Tennis cần cân bằng giữa hình ảnh và chuyển động. Team building cần sự thoải mái và đồng bộ.
          </Prose>
          <Prose>
            Đồng Phục Univi định hướng TIÊN PHONG cung cấp giải pháp đồng phục thể thao chuyên nghiệp cho các chuỗi phòng tập và các đội nhóm tập Gym, Fitness, Pickleball, Yoga, Running, Pilates, MMA... tại Việt Nam.
          </Prose>
          <Prose>
            Với hệ thống R&amp;D theo chất liệu và bộ môn, các dòng vật liệu như UNI QUICK DRY, UNI SUPER COOL, UNI BLENDED, hệ thống 2S Uniform, cùng năng lực xưởng trên 2.000m² và công suất gần 100.000 sản phẩm/tháng, Univi có nền tảng để phát triển và triển khai các giải pháp đồng phục thể thao chuyên dụng.
          </Prose>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-[#0d4c7a] to-[#105d97] text-white p-6 md:p-8 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-3">Bạn đang cần đồng phục thể thao chuyên dụng?</h2>
          <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-6 max-w-xl mx-auto">
            Dành cho Gym, Fitness, Yoga, Pilates, Pickleball, Running, MMA, Golf, Tennis, team building hoặc đội nhóm. Chuẩn bị: Bộ môn, Logo, Màu thương hiệu, Nhóm người mặc &amp; Số lượng dự kiến.
          </p>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("openContactModal"))}
            className="inline-flex items-center gap-2 bg-white text-[#105d97] font-semibold px-7 py-3.5 rounded-full hover:bg-gray-100 transition-colors shadow-md cursor-pointer"
          >
            Nhận tư vấn đồng phục thể thao chuyên dụng
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
