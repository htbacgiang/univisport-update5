import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowRight, CheckCircle, Building2, Users, Package, BarChart3, Palette, ShieldCheck, Sparkles, ChevronLeft, ChevronRight, TrendingUp, Share2 } from "lucide-react";
import PartnersSection from "../PartnersSection";
import ProcessSteps from "../ProcessSteps";
import BangMauHero from '../bang-mau/BangMauHero';
import { fabrics } from '../../../data/fabrics';

export const doanhNghiepFaqs = [
  ["Đồng phục doanh nghiệp gồm những gì?", "Có thể gồm polo, sơ mi, vest, áo gió, áo sự kiện, teambuilding, bảo hộ và phụ kiện. Không phải doanh nghiệp nào cũng cần tất cả; lựa chọn phụ thuộc vị trí, môi trường và mục đích sử dụng."],
  ["Doanh nghiệp nên chọn Polo hay sơ mi?", "Chọn sơ mi khi cần hình ảnh công sở, sales hoặc gặp khách hàng. Chọn polo khi môi trường linh hoạt, hoạt động nội bộ, dịch vụ hoặc di chuyển nhiều. Có thể dùng cả hai trong cùng một hệ nhận diện."],
  ["Có thể làm nhiều kiểu đồng phục cho cùng một công ty không?", "Có. Doanh nghiệp có thể dùng nhiều form theo vai trò, miễn giữ quy chuẩn chung về màu, logo, font và cách phối."],
  ["Có thể thiết kế theo nhận diện thương hiệu không?", "Có. Doanh nghiệp nên cung cấp logo gốc, màu thương hiệu, font, slogan và quy tắc sử dụng. Nhà cung cấp cần thể hiện các yếu tố này trên mockup để duyệt trước."],
  ["Nên chọn chất liệu nào?", "Chọn theo bối cảnh. Văn phòng ưu tiên đứng form và dễ chăm sóc; ngoài trời ưu tiên nhẹ, thoáng; vận động ưu tiên co giãn và thoát ẩm; bảo hộ ưu tiên độ bền và yêu cầu môi trường. Không nên dùng một chất liệu cho mọi nhóm."],
  ["Làm sao chọn size cho nhiều nhân viên?", "Dùng bảng size có số đo, hướng dẫn đo và một biểu mẫu tập trung. Nên thử mẫu trên nhiều vóc dáng trước khi khóa số lượng."],
  ["Đặt đồng phục số lượng lớn cần chuẩn bị gì?", "Chuẩn bị bộ nhận diện, nhóm nhân sự, số lượng theo size, mục đích sử dụng, deadline, yêu cầu chất liệu, kỹ thuật logo và phương án bổ sung."],
  ["Chi phí phụ thuộc vào yếu tố nào?", "Chi phí phụ thuộc vào loại áo, chất liệu, số lượng, thiết kế, in/thêu, số vị trí logo, phụ kiện, đóng gói, yêu cầu đặc biệt và thời gian. Cần báo giá theo cấu hình thực tế."],
  ["Có được duyệt mẫu trước sản xuất không?", "Theo quy trình công bố của Univi, khách hàng được hỗ trợ lên mockup và nhận mẫu để kiểm tra form, màu, đường may và logo trước khi sản xuất toàn bộ."],
  ["Có thể đặt bổ sung khi tuyển thêm nhân sự không?", "Có thể trao đổi phương án bổ sung. Khả năng đồng nhất phụ thuộc việc doanh nghiệp lưu mã mẫu, chất liệu, màu, file logo và thông số của đợt đầu."],
  ["Univi có nhận đơn hàng doanh nghiệp số lượng lớn không?", "Website Univi công bố năng lực xưởng 2.000m², công suất 100.000 sản phẩm/tháng và phục vụ toàn quốc. Số lượng, cấu hình và tiến độ cụ thể cần được xác nhận theo từng dự án."],
  ["Làm sao bắt đầu một đơn hàng đồng phục doanh nghiệp?", "Gửi brief gồm ngành nghề, nhóm người mặc, số lượng dự kiến, mục đích, màu thương hiệu, deadline và yêu cầu chất liệu. Univi sẽ tư vấn cấu hình, lên mockup và hướng dẫn bước duyệt mẫu."],
];

function SectionHeading({ number, children }) {
  return (
    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-tight">
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
    <ul className="mb-4 space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-base text-gray-700 leading-7">
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
      <p className="text-sm text-gray-700 leading-6">{children}</p>
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
    <div className="overflow-x-auto border border-gray-200 rounded-lg mb-4">
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
  return <section id={id} className="mb-10">{children}</section>;
}

export const univiCustomers = [
  {
    name: "GHT Group",
    category: "Đồng phục văn phòng",
    description: "Doanh nghiệp sử dụng đồng phục văn phòng với áo sơ mi và trang phục công sở đồng bộ cho đội ngũ nhân sự.",
    images: [
      {
        src: "/khach-hang/dong-phuc-ght-group-univi-01.jpg",
        alt: "Đội ngũ nhân sự GHT Group mặc đồng phục văn phòng Univi",
      },
      {
        src: "/khach-hang/dong-phuc-ght-group-univi-02.jpg",
        alt: "Tập thể cán bộ nhân viên GHT Group với đồng phục doanh nghiệp",
      },
      {
        src: "/khach-hang/dong-phuc-ght-group-univi-03.jpg",
        alt: "Tập thể cán bộ nhân viên GHT Group với đồng phục doanh nghiệp",
      },
      {
        src: "/khach-hang/dong-phuc-ght-group-univi-04.jpg",
        alt: "Tập thể cán bộ nhân viên GHT Group với đồng phục doanh nghiệp",
      },
      {
        src: "/khach-hang/dong-phuc-ght-group-univi-05.jpg",
        alt: "Tập thể cán bộ nhân viên GHT Group với đồng phục doanh nghiệp",
      },
    ],
  },
  {
    name: "PSC Cars - Thành Công Group",
    badge: "Thành viên của Thành Công Group",
    category: "Đồng phục dịch vụ & vận hành",
    description: "Đơn vị dịch vụ ô tô sử dụng đồng phục cho các vị trí dịch vụ và vận hành.",
    images: [
      {
        src: "/khach-hang/dong-phuc-psc-cars-thanh-cong-group-univi-04.jpg",
        alt: "Nhân sự PSC Cars mặc đồng phục doanh nghiệp",
      },

      {
        src: "/khach-hang/dong-phuc-psc-cars-thanh-cong-group-univi-06.jpg",
        alt: "Hình ảnh nhân sự PSC Cars Thành Công Group với đồng phục Univi",
      },
      {
        src: "/khach-hang/dong-phuc-psc-cars-thanh-cong-group-univi-01.jpg",
        alt: "Hình ảnh nhân sự PSC Cars Thành Công Group với đồng phục Univi",
      },
      {
        src: "/khach-hang/dong-phuc-doanh-nghiep-psc-car.jpg",
        alt: "Hình ảnh nhân sự PSC Cars Thành Công Group với đồng phục Univi",
      },
      {
        src: "/khach-hang/dong-phuc-psc-cars-thanh-cong-group-univi-03.jpg",
        alt: "Hình ảnh nhân sự PSC Cars Thành Công Group với đồng phục Univi",
      },
      {
        src: "/khach-hang/dong-phuc-doanh-nghiep-psc.jpg",
        alt: "Hình ảnh nhân sự PSC Cars Thành Công Group với đồng phục Univi",
      },
    ],
  },
  {
    name: "Sun World Hạ Long",
    category: "Đồng phục dịch vụ – du lịch",
    description: "Đội ngũ nhân sự trong môi trường khu vui chơi – du lịch với đồng phục nhận diện thương hiệu.",
    images: [
      {
        src: "/khach-hang/dong-phuc-sun-world-ha-long-univi-03.jpg",
        alt: "Vật phẩm nhận diện và đồng phục quà tặng Sun World Hạ Long",
      },
      {
        src: "/khach-hang/dong-phuc-sun-world-ha-long-univi-01.jpg",
        alt: "Nhân sự Sun World Hạ Long trong đồng phục dịch vụ",
      },
      {
        src: "/khach-hang/dong-phuc-sun-world-ha-long-univi-02.jpg",
        alt: "Vật phẩm nhận diện và đồng phục quà tặng Sun World Hạ Long",
      },

      {
        src: "/khach-hang/dong-phuc-sun-world-ha-long-univi-04.jpg",
        alt: "Vật phẩm nhận diện và đồng phục quà tặng Sun World Hạ Long",
      },
      {
        src: "/khach-hang/dong-phuc-sun-world-ha-long-univi-05.jpg",
        alt: "Vật phẩm nhận diện và đồng phục quà tặng Sun World Hạ Long",
      },
      {
        src: "/khach-hang/dong-phuc-sun-world-ha-long-univi-06.jpg",
        alt: "Vật phẩm nhận diện và đồng phục quà tặng Sun World Hạ Long",
      },
    ],
  },
  {
    name: "Sun World Sầm Sơn",
    category: "Đồng phục dịch vụ – du lịch",
    description: "Nhân sự vận hành dịch vụ tại khu vui chơi – du lịch với trang phục đồng bộ theo nhận diện thương hiệu.",
    images: [
      {
        src: "/khach-hang/dong-phuc-sun-world-sam-son-univi-01.jpg",
        alt: "Nhân sự Sun World Sầm Sơn trong đồng phục thương hiệu",
      },
      {
        src: "/khach-hang/dong-phuc-sun-world-sam-son-univi-02.jpg",
        alt: "Đội ngũ nhân sự vận hành Sun World Sầm Sơn với trang phục đồng bộ",
      },
      {
        src: "/khach-hang/dong-phuc-sun-world-sam-son-univi-03.jpg",
        alt: "Đội ngũ nhân sự vận hành Sun World Sầm Sơn với trang phục đồng bộ",
      },
      {
        src: "/khach-hang/dong-phuc-sun-world-sam-son-univi-04.jpg",
        alt: "Đội ngũ nhân sự vận hành Sun World Sầm Sơn với trang phục đồng bộ",
      },
      {
        src: "/khach-hang/dong-phuc-sun-world-sam-son-univi-05.jpg",
        alt: "Đội ngũ nhân sự vận hành Sun World Sầm Sơn với trang phục đồng bộ",
      },
    ],
  },
  {
    name: "AMT Việt Nam",
    category: "Đồng phục kỹ thuật – doanh nghiệp",
    description: "Đội ngũ nhân sự doanh nghiệp trong trang phục đồng phục phục vụ môi trường làm việc kỹ thuật và sản xuất.",
    images: [
      {
        src: "/khach-hang/dong-phuc-amt-viet-nam-univi-01.jpg",
        alt: "Đội ngũ nhân sự AMT Việt Nam mặc đồng phục doanh nghiệp",
      },
      {
        src: "/khach-hang/dong-phuc-amt-viet-nam-univi-02.jpg",
        alt: "Nhân sự AMT Việt Nam trong môi trường làm việc kỹ thuật sản xuất",
      },
      {
        src: "/khach-hang/dong-phuc-amt-viet-nam-univi-03.jpg",
        alt: "Đồng phục doanh nghiệp kỹ thuật AMT Việt Nam do Univi sản xuất",
      },

    ],
  },
  {
    name: "Tập đoàn Than – Khoáng sản Việt Nam",
    category: "Đồng phục áo Polo",
    description: "Đơn vị trong lĩnh vực khai thác khoáng sản và công nghiệp sử dụng trang phục đồng bộ cho môi trường làm việc kỹ thuật, sản xuất và vận hành.",
    images: [
      {
        src: "/khach-hang/than-khoang-san-viet.jpg",
        alt: "Đồng phục Tập đoàn Than – Khoáng sản Việt Nam do Univi sản xuất",
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

function Section2ImageSlider() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const slides = [
    {
      src: "/so-mi-cong-so/dong-phuc-cong-so-nam-nu-ao-so-mi-tim-nhat.png",
      alt: "Đồng phục công sở & văn phòng Univi",
      title: "Đồng Phục Công Sở & Văn Phòng",
      caption: "Nhất quán nhận diện thương hiệu tại mọi điểm chạm trực tiếp với khách hàng.",
    },
    {
      src: "/vest-cong-so/vest-nam-nu-dong-phuc-doanh-nghiep.jpg",
      alt: "Đồng phục doanh nghiệp chuyên nghiệp Univi",
      title: "Hệ Thống Đồng Phục Doanh Nghiệp",
      caption: "Phát triển theo vị trí nhân sự – từ văn phòng, quản lý đến kỹ thuật vận hành.",
    },
    {
      src: "/images/xuong-san-xuat.jpg",
      alt: "Xưởng sản xuất đồng phục quy mô lớn Univi",
      title: "Quy Trình & Năng Lực Sản Xuất",
      caption: "Lưu giữ mẫu duyệt và thông số kỹ thuật giúp doanh nghiệp tái đặt hàng nhanh chóng.",
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
                    dongphucunivi.com
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
        <p className="text-xs sm:text-sm text-gray-600 italic max-w-lg mx-auto leading-relaxed">
          {slides[activeIdx].caption}
        </p>

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

export default function DoanhNghiepPillarPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="bg-white py-12 md:py-16 lg:py-20 overflow-hidden border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* Left side: Image Collage */}
            <div className="lg:col-span-6 xl:col-span-6">
              <div className="grid grid-cols-12 gap-3 sm:gap-4 items-stretch">

                {/* Main Big Left Card */}
                <div className="col-span-7">
                  <div className="bg-gray-100 p-1 sm:p-1.5 rounded-[28px] rounded-tr-[84px] border border-gray-200/80 shadow-xs transition-transform duration-300 hover:scale-[1.01] h-full flex flex-col justify-center">
                    <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] rounded-[24px] rounded-tr-[80px] overflow-hidden">
                      <Image
                        src="/images/dong-phuc-cong-ty.webp"
                        alt="Đồng phục doanh nghiệp cho công ty Univi"
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
                        src="/images/xuong-san-xuat.jpg"
                        alt="Xưởng sản xuất đồng phục Univi"
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
                        src="/vest-cong-so/corporate-outfit-vest-doanh-nghiep.jpg"
                        alt="Mẫu đồng phục áo polo doanh nghiệp"
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
                  Giải pháp đồng bộ nhận diện B2B
                </p>
                <h1 className="text-xl sm:text-3xl lg:text-3xl font-extrabold text-gray-900 tracking-tight leading-[1.2] mb-2">
                  Đồng Phục Doanh Nghiệp Cho Công Ty
                </h1>
                <p className="text-gray-600 text-base leading-relaxed mb-8">
                  Đồng phục doanh nghiệp theo nhận diện, vị trí và mục đích sử dụng. Tư vấn chọn mẫu, chất liệu, size, quy trình và giải pháp B2B cùng Đồng Phục Univi.
                </p>

                {/* Feature Items with Circular Icons */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 text-[#105d97] flex items-center justify-center shrink-0">
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base md:text-lg leading-snug">
                        Thiết kế &amp; Nhận diện B2B
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed mt-0.5">
                        Đồng bộ chuẩn xác theo màu sắc, logo và bộ nhận diện thương hiệu công ty.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 text-[#105d97] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base md:text-lg leading-snug">
                        Chất liệu &amp; Form dáng chuẩn
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed mt-0.5">
                        Chất liệu thoáng khí, độ bền cao, đường may tỉ mỉ tối ưu cho mọi môi trường.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 text-[#105d97] flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base md:text-lg leading-snug">
                        Tư vấn &amp; Trải nghiệm mẫu
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed mt-0.5">
                        Hỗ trợ phác thảo mockup 2D/3D, may mẫu thực tế và duyệt trước khi sản xuất.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Call to Action Buttons */}
                <div className="flex flex-wrap gap-3.5">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new Event("openContactModal"))}
                    className="inline-flex items-center gap-2 bg-[#105d97] text-white font-semibold px-6 py-3.5 rounded-full hover:bg-[#0d4c7a] transition-colors shadow-sm"
                  >
                    Nhận tư vấn &amp; báo giá
                  </button>

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
              { icon: Users, label: "Doanh nghiệp phục vụ", value: "500+" },
              { icon: BarChart3, label: "Kinh nghiệm", value: "9+ năm" },
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
      <div className="container mx-auto px-4 py-10 ">

        {/* Introduction */}
        <div className="mb-10 p-6 bg-gray-50 rounded-xl border border-gray-200/60">
          <Prose>
            Một doanh nghiệp có thể có nhân viên văn phòng, sales, quản lý, kỹ thuật, nhân sự sự kiện và đội ngũ thường xuyên làm việc ngoài trời. Họ không nhất thiết phải mặc cùng một loại áo. Áo sơ mi có thể phù hợp với cuộc gặp khách hàng, trong khi áo polo hoặc áo thể thao lại thực tế hơn cho ngày hoạt động nội bộ.
          </Prose>
          <Prose>
            Vấn đề thường không nằm ở việc doanh nghiệp thiếu mẫu áo. Vấn đề là các mẫu được đặt rời rạc, không cùng màu thương hiệu, không có quy chuẩn logo, thiếu dữ liệu size và khó đặt bổ sung khi nhân sự tăng. Đồng Phục Univi nhìn bài toán này từ nhu cầu vận hành B2B: bộ nhận diện → vị trí nhân sự → môi trường sử dụng → thiết kế → sản xuất → quản lý → tái đặt hàng.
          </Prose>
        </div>

        {/* Section 1 */}
        <ArticleSection id="dong-phuc-doanh-nghiep-la-gi">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start my-6">

            {/* Left side: Image Showcase */}
            <div className="lg:col-span-6">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:h-[400px] lg:h-[420px] rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200/80 shadow-sm bg-gray-50">
                <Image
                  src="/khach-hang/dong-phuc-doanh-nghiep-psc-car.jpg"
                  alt="Đồng phục doanh nghiệp – hệ thống polo, sơ mi, vest, áo gió theo nhận diện công ty"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  quality={85}
                />
              </div>
              <p className="text-center text-xs text-gray-500 mt-2.5 italic px-2">
                Một hệ thống đồng phục doanh nghiệp đúng nghĩa dùng chung ngôn ngữ màu sắc, logo và chất liệu.
              </p>
            </div>

            {/* Right side: Section Content */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <SectionHeading number="1">Đồng phục doanh nghiệp là gì?</SectionHeading>

              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                Đồng phục doanh nghiệp là nhóm trang phục được xây dựng cho người lao động trong cùng một tổ chức, dựa trên nhận diện thương hiệu, vị trí công việc và bối cảnh sử dụng. Cụm &quot;đồng phục công ty&quot; thường được dùng theo nghĩa tương tự.
              </p>

              <p className="font-bold text-gray-900 text-sm md:text-base mb-3">Một hệ thống hợp lý có thể gồm:</p>

              {/* Checklist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {[
                  "Polo cho ngày làm việc linh hoạt, hoạt động nội bộ",
                  "Sơ mi cho văn phòng, sales & gặp đối tác",
                  "Vest cho ban lãnh đạo & sự kiện trang trọng",
                  "Áo gió cho ngoài trời & di chuyển",
                  "Áo sự kiện, teambuilding theo ngành nghề",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-gray-800 bg-gray-50/80 p-2.5 sm:p-3 rounded-xl border border-gray-100 shadow-2xs">
                    <CheckCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Các dòng trên vẫn thuộc cùng một hệ thống nếu dùng chung ngôn ngữ thương hiệu: màu chủ đạo, cách đặt logo, kiểu chữ, quy tắc phối màu và tiêu chuẩn hoàn thiện.
              </p>
            </div>

          </div>
        </ArticleSection>

        {/* Section 2 */}
        <ArticleSection id="vi-sao-can-he-thong">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <SectionHeading number="2">Vì sao doanh nghiệp cần một hệ thống đồng phục?</SectionHeading>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Quy chuẩn hệ thống đồng phục giúp doanh nghiệp kiểm soát tốt nhận diện thương hiệu, nâng cao trải nghiệm người dùng và tạo nền tảng vững chắc cho vận hành B2B.
            </p>
          </div>

          {/* 6 Feature Grid matching reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 my-8">
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#105d97] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-xs md:text-sm mb-2 uppercase tracking-wide">
                2.1 Nhận diện thương hiệu nhất quán
              </h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                Quy chuẩn đồng phục giúp Marketing kiểm soát hình ảnh trong ảnh tuyển dụng, sự kiện, video và các điểm chạm trực tiếp với khách hàng.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#105d97] flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-xs md:text-sm mb-2 uppercase tracking-wide">
                2.2 Trải nghiệm khách hàng phù hợp
              </h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                Hệ thống đồng phục giúp chọn đúng trang phục cho từng điểm chạm: từ lễ tân, sales đến kỹ thuật viên, đảm bảo hình ảnh khớp với dịch vụ.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#105d97] flex items-center justify-center mb-3">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-xs md:text-sm mb-2 uppercase tracking-wide">
                2.3 Phân biệt vai trò và bộ phận
              </h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                Màu phụ, đường phối, bảng tên hoặc cách đặt logo giúp nhận biết người cần liên hệ trực quan tại showroom, nhà máy và sự kiện.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#105d97] flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-xs md:text-sm mb-2 uppercase tracking-wide">
                2.4 Hỗ trợ văn hóa doanh nghiệp
              </h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                Đồng phục tạo gắn kết khi người mặc thấy thoải mái. HR thu thập phản hồi, thử động tác thực tế để đảm bảo tính ứng dụng trước khi đặt số lượng lớn.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#105d97] flex items-center justify-center mb-3">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-xs md:text-sm mb-2 uppercase tracking-wide">
                2.5 Đồng bộ truyền thông &amp; Sự kiện
              </h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                Company trip, hội nghị hay triển lãm với trang phục cùng hệ màu và quy tắc logo giúp hình ảnh truyền thông dễ nhận diện và chuyên nghiệp.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#105d97] flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-xs md:text-sm mb-2 uppercase tracking-wide">
                2.6 Thuận tiện khi doanh nghiệp mở rộng
              </h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                Hồ sơ kỹ thuật, mã màu, mẫu duyệt, bảng size được lưu lại giúp Procurement tái đặt hàng nhanh chóng và giảm thiểu sai lệch qua các đợt.
              </p>
            </div>
          </div>

          {/* Bottom 3-Image Carousel Stack matching reference */}
          <Section2ImageSlider />

        </ArticleSection>

        {/* Section 3 */}
        <ArticleSection id="he-thong-dong-phuc">
          <SectionHeading number="3">Một hệ thống đồng phục doanh nghiệp gồm những gì?</SectionHeading>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 my-6">
            {[
              { src: "/polo-doanh-nghiep/ao-polo-van-phong.jpg", alt: "Đồng phục áo Polo doanh nghiệp", label: "Polo" },
              { src: "/so-mi-cong-so/dong-phuc-cong-so-ao-so-mi-xanh-dai-tay.jpg", alt: "Đồng phục áo sơ mi công sở", label: "Sơ mi" },
              { src: "/vest-cong-so/vest-cong-so-dong-phuc-doanh-nghiep-cao-cap.jpg", alt: "Đồng phục vest công sở doanh nghiệp", label: "Vest" },
              { src: "https://live.staticflickr.com/65535/55342001057_0c6a0bbbfd_b.jpg", alt: "Đồng phục áo gió doanh nghiệp", label: "Áo gió" },
              { src: "/teambuilding/dong-phuc-teambuilding-doanh-nghiep-tap-the.jpg", alt: "Đồng phục teambuilding công ty", label: "Teambuilding" },
              { src: "/bhld/quan-ao-bao-ho-lao-dong.jpg", alt: "Đồng phục bảo hộ lao động", label: "Bảo hộ" },
            ].map(({ src, alt, label }) => (
              <figure key={label} className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                <div className="relative" style={{ aspectRatio: '4/3' }}>
                  <Image src={src} alt={alt} fill sizes="300px" className="object-cover" quality={80} />
                </div>
                <figcaption className="text-center text-xs font-semibold text-[#105d97] py-2 bg-gray-50 border-t border-gray-100">
                  {label}
                </figcaption>
              </figure>
            ))}
          </div>
          <SectionSubheading>3.1 Đồng phục Polo doanh nghiệp</SectionSubheading>
          <Prose>Polo phù hợp với doanh nghiệp có môi trường làm việc linh hoạt, đội ngũ sales, vận hành, dịch vụ hoặc hoạt động nội bộ. Cổ áo tạo cảm giác chỉn chu hơn áo thun, trong khi form vẫn dễ mặc và dễ phối. Xem thêm <InternalLink href="/dong-phuc-ao-polo-doanh-nghiep">đồng phục áo Polo doanh nghiệp</InternalLink> nếu doanh nghiệp đang tìm một cấu hình Polo chuyên sâu. Với nhu cầu vận động, trang <InternalLink href="/dong-phuc-the-thao">đồng phục thể thao theo yêu cầu</InternalLink> là điểm tham khảo phù hợp hơn một mẫu polo thời trang đơn lẻ.</Prose>
          <SectionSubheading>3.2 Đồng phục áo sơ mi</SectionSubheading>
          <Prose>Sơ mi thường phù hợp với văn phòng, sales, quản lý, lễ tân và môi trường corporate. Nếu nhu cầu tập trung vào sơ mi công sở, nên chuyển sang trang chuyên sâu về <InternalLink href="/dong-phuc-ao-so-mi">đồng phục áo sơ mi</InternalLink> để xem thêm form, chất liệu và cách triển khai. Khi chọn sơ mi, doanh nghiệp nên ưu tiên độ đứng form, cảm giác dễ chịu trong thời gian ngồi hoặc di chuyển dài, khả năng chăm sóc và mức độ phù hợp với quy tắc ăn mặc.</Prose>
          <SectionSubheading>3.3 Vest công sở</SectionSubheading>
          <Prose>Vest dành cho các vai trò cần mức độ trang trọng cao hơn như quản lý, lễ tân, hội nghị, sự kiện đối tác hoặc hình ảnh đại diện. Doanh nghiệp có thể xem thêm <InternalLink href="/vest-cong-so-dong-phuc-doanh-nghiep-cao-cap">vest công sở đồng phục doanh nghiệp</InternalLink> khi cần triển khai riêng nhóm trang phục này. Vest không nên được đưa vào toàn bộ nhân sự chỉ vì cảm giác cao cấp.</Prose>
          <SectionSubheading>3.4 Đồng phục áo gió</SectionSubheading>
          <Prose>Áo gió phù hợp với nhân sự làm việc ngoài trời, đội ngũ phải di chuyển, sự kiện, hoạt động cộng đồng và chương trình có yếu tố gió hoặc nắng. Khi duyệt, hãy kiểm tra khóa kéo, bo tay, độ linh hoạt vai, vị trí logo và khả năng phối với lớp áo bên trong.</Prose>
          <SectionSubheading>3.5 Đồng phục teambuilding</SectionSubheading>
          <Prose>Teambuilding, company trip và Family Day cần trang phục dễ nhận diện, dễ vận động và phù hợp với thời gian mặc cả ngày. Xem thêm <InternalLink href="/dong-phuc-teambuilding">đồng phục teambuilding</InternalLink> nếu chương trình cần một hệ áo riêng theo chủ đề.</Prose>
          <SectionSubheading>3.6 Đồng phục bảo hộ lao động</SectionSubheading>
          <Prose>Nhà máy, công trường, kỹ thuật, sản xuất, xăng dầu và ngành nghề đặc thù cần được tư vấn theo môi trường làm việc thực tế. Với nhu cầu chuyên sâu, xem <InternalLink href="/bao-ho-lao-dong">đồng phục bảo hộ lao động</InternalLink>. Không nên lấy một mẫu áo sự kiện rồi gọi đó là bảo hộ nếu chưa có căn cứ kỹ thuật và tiêu chuẩn áp dụng.</Prose>
          <SectionSubheading>3.7 Phụ kiện và quà tặng doanh nghiệp</SectionSubheading>
          <Prose>Mũ, túi, bảng tên hoặc vật phẩm đi kèm có thể dùng cho onboarding, hội nghị, sự kiện và chương trình tri ân. Chỉ nên đưa phụ kiện vào hệ thống khi chúng dùng chung ngôn ngữ màu sắc và có quy cách logo rõ ràng.</Prose>
        </ArticleSection>

        {/* Section 4 */}
        <ArticleSection id="chon-theo-vi-tri-nhan-su">
          <SectionHeading number="4">Chọn đồng phục theo vị trí nhân sự</SectionHeading>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8">
            Từng vị trí – quản lý, văn phòng, sales, dịch vụ, kỹ thuật và sự kiện – có thể dùng kiểu dáng, chất liệu và mức trang trọng phù hợp nhất trong cùng một ngôn ngữ nhận diện thương hiệu.
          </p>

          {/* Alternating 2-Column Checkerboard Rows for all 6 Sub-items */}
          <div className="space-y-6 md:space-y-8 my-8">
            {[
              {
                title: "4.1 Ban Lãnh Đạo Và Quản Lý",
                highlight: "Hình ảnh trang trọng, chỉn chu & đại diện thương hiệu B2B.",
                text: "Ưu tiên form gọn, màu ổn định và mức độ trang trọng phù hợp với tần suất gặp khách hàng. Một số doanh nghiệp dùng sơ mi hoặc vest làm trang phục đại diện, đồng thời dùng polo trong hoạt động nội bộ.",
                imgSrc: "/vest-cong-so/dong-phuc-vest-cong-so.jpg",
                imgAlt: "Đồng phục vest công sở ban lãnh đạo và quản lý",
              },
              {
                title: "4.2 Nhân Viên Văn Phòng",
                highlight: "Cân bằng giữa hình ảnh thanh lịch và sự thoải mái làm việc cả ngày.",
                text: "Văn phòng cần cân bằng giữa hình ảnh, sự thoải mái khi ngồi lâu và khả năng chăm sóc. Sơ mi, polo hoặc bộ phối công sở có thể được chọn tùy văn hóa doanh nghiệp. Hãy thử mẫu vào một ngày làm việc bình thường.",
                imgSrc: "/so-mi-cong-so/dong-phuc-cong-so-nam-nu-ao-so-mi-ke-soc-xanh.png",
                imgAlt: "Đồng phục áo sơ mi nhân viên văn phòng",
              },
              {
                title: "4.3 Nhân Viên Kinh Doanh",
                highlight: "Linh hoạt di chuyển, logo sắc nét dễ nhận diện ở khoảng cách giao tiếp.",
                text: "Sales cần trang phục giữ hình ảnh trong cuộc gặp nhưng vẫn linh hoạt khi di chuyển. Logo nên gọn, dễ nhận diện ở khoảng cách giao tiếp. Nếu sales thường tham gia sự kiện, có thể xây dựng thêm phiên bản polo hoặc áo gió cùng hệ màu.",
                imgSrc: "/polo-doanh-nghiep/ao-polo-van-phong.jpg",
                imgAlt: "Đồng phục áo polo nhân viên kinh doanh sales",
              },
              {
                title: "4.4 Nhân Viên Dịch Vụ",
                highlight: "Thoáng khí, bền màu, nhận diện nhanh tại cửa hàng & điểm chạm.",
                text: "Nhân sự dịch vụ cần được nhận biết nhanh và phải mặc trong nhiều giờ. Độ thoáng, độ bền màu, form không gây vướng và khả năng giặt lặp lại là các tiêu chí quan trọng.",
                imgSrc: "/polo-doanh-nghiep/dong-phuc-ao-polo-nam-nu.png",
                imgAlt: "Đồng phục nhân viên dịch vụ",
              },
              {
                title: "4.5 Nhân Viên Kỹ Thuật",
                highlight: "Tối ưu vận động, an toàn lao động & độ bền đường may cao.",
                text: "Kỹ thuật cần trang phục phù hợp với chuyển động, môi trường, dụng cụ và quy định an toàn. Doanh nghiệp nên kiểm tra vùng vai, nách, gấu áo, túi và độ bền đường may bằng các động tác thật.",
                imgSrc: "/khach-hang/dong-phuc-ky-thuat.jpg",
                imgAlt: "Đồng phục kỹ thuật sản xuất AMT Việt Nam",
              },
              {
                title: "4.6 Nhân Sự Sự Kiện",
                highlight: "Chất liệu nhẹ, màu sắc nổi bật, dễ nhận diện từ xa.",
                text: "Nhân sự sự kiện thường làm việc trong thời gian dài, di chuyển nhiều và cần được nhận biết từ xa. Màu tương phản vừa đủ, logo ở trước và sau, chất liệu nhẹ cùng danh sách size chính xác sẽ giúp vận hành thuận lợi.",
                imgSrc: "/khach-hang/nhan-vien-su-kien-sun.jpg",
                imgAlt: "Đồng phục sự kiện và teambuilding doanh nghiệp VIB",
              },
            ].map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={item.title}
                  className="grid grid-cols-1 md:grid-cols-2 rounded-2xl md:rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 bg-white"
                >
                  {/* Text Column */}
                  <div
                    className={`p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-gray-50/50 ${isEven ? "md:order-1" : "md:order-2 border-t md:border-t-0 md:border-l border-gray-100"
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
                  </div>

                  {/* Image Column */}
                  <div
                    className={`relative w-full h-[260px] sm:h-[320px] md:h-[380px] overflow-hidden bg-gray-100 ${isEven ? "md:order-2 border-t md:border-t-0 md:border-l border-gray-100" : "md:order-1"
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
        <ArticleSection id="dong-phuc-theo-nganh-nghe">
          <SectionHeading number="5">Đồng phục doanh nghiệp theo ngành nghề</SectionHeading>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
            Mỗi ngành nghề có bối cảnh sử dụng và mức trang trọng khác nhau – lựa chọn đồng phục cần xuất phát từ đặc thù công việc thực tế của từng lĩnh vực.
          </p>

          {/* Industry Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
            {[
              {
                title: "5.1 Ngân Hàng & Tài Chính",
                text: "Ngành tài chính thường cần hình ảnh đáng tin cậy, tiết chế và nhất quán. Sơ mi, vest hoặc bộ phối công sở phù hợp cho giao dịch, hội nghị và tiếp khách.",
                imgSrc: "/vest-cong-so/vest-doanh-nghiep-theo-nganh.jpg",
                imgAlt: "Đồng phục doanh nghiệp ngành ngân hàng và tài chính VIB",
              },
              {
                title: "5.2 Bất Động Sản",
                text: "Sales bất động sản vừa làm việc tại văn phòng vừa đi thị trường. Trang phục cần đủ lịch sự khi tiếp khách và linh hoạt khi di chuyển.",
                imgSrc: "/vest-cong-so/dong-phuc-vest.jpg",
                imgAlt: "Đồng phục công sở doanh nghiệp bất động sản GHT Group",
              },
              {
                title: "5.3 Công Nghệ",
                text: "Doanh nghiệp công nghệ thường có văn hóa linh hoạt. Polo, áo thun sự kiện hoặc áo khoác nhẹ phù hợp với văn phòng và hoạt động đội nhóm.",
                imgSrc: "/polo-doanh-nghiep/ao-polo-phong-cach-doanh-nghiep.jpg",
                imgAlt: "Đồng phục áo polo doanh nghiệp công nghệ",
              },
              {
                title: "5.4 Giáo Dục & Đào Tạo",
                text: "Trường học và đơn vị giáo dục cần phân biệt giáo viên, tư vấn viên, vận hành và sự kiện. Trang phục phải dễ nhận biết và thoải mái cả ngày.",
                imgSrc: "/khach-hang/luu-y-khi-dat-may-dong-phuc-giao-vien-mam-non.jpg",
                imgAlt: "Đồng phục giáo dục và trung tâm đào tạo",
              },
              {
                title: "5.5 Nhà Hàng, Khách Sạn & F&B",
                text: "F&B chú trọng hình ảnh, độ thoáng và độ bền khi giặt lặp lại. Lễ tân, phục vụ, bếp và quản lý có các cấu hình trang phục chuyên biệt.",
                imgSrc: "/khach-hang/dong-phuc-fb.jpg",
                imgAlt: "Đồng phục nhà hàng khách sạn và F&B Sun World",
              },
              {
                title: "5.6 Bán Lẻ & Chuỗi Cửa Hàng",
                text: "Nhân viên bán lẻ là điểm tiếp xúc trực tiếp với khách hàng. Đồng phục cần giúp nhận diện nhanh, dễ bảo quản và bền đẹp qua nhiều ca làm.",
                imgSrc: "/khach-hang/dong-phuc-nhan-vien-viettel.jpg",
                imgAlt: "Đồng phục bán lẻ và chuỗi cửa hàng",
              },
              {
                title: "5.7 Sản Xuất & Nhà Máy",
                text: "Nhà máy xuất phát từ môi trường làm việc và quy định an toàn. Cần lập nhóm riêng cho kỹ thuật, quản lý chuyền, kho và khách tham quan.",
                imgSrc: "/bhld/dong-phuc-linama.jpg",
                imgAlt: "Đồng phục sản xuất và nhà máy AMT",
              },
              {
                title: "5.8 Xây Dựng & Công Trình",
                text: "Công trường ưu tiên độ bền, khả năng vận động, túi đựng và mức độ nhận biết. Chi tiết phản quang và an toàn được chốt theo thực tế.",
                imgSrc: "/bhld/kien-truc-su-dong-phuc.jpg",
                imgAlt: "Đồng phục công trường xây dựng bảo hộ lao động",
              },
              {
                title: "5.9 Logistics & Vận Chuyển",
                text: "Nhân sự logistics di chuyển nhiều trong các điều kiện thời tiết. Polo, áo gió hoặc trang phục chuyên dụng cần độ nhẹ, thoáng và bền màu.",
                imgSrc: "/bhld/dong-phuc-vtp.jpg",
                imgAlt: "Đồng phục logistics áo gió ngoài trời",
              },
              {
                title: "5.10 Ngành Xăng Dầu & Đặc Thù",
                text: "Ngành đặc thù cần xác định kỹ tiêu chuẩn an toàn lao động. Hồ sơ kỹ thuật, quy định sử dụng và mẫu duyệt phải được Procurement lưu lại.",
                imgSrc: "/bhld/dong-phuc-nhan-vien-petrolimex.webp",
                imgAlt: "Đồng phục bảo hộ ngành xăng dầu kỹ thuật",
              },
              {
                title: "5.11 Thể Thao & Fitness",
                text: "Ngành thể thao cần đồng phục giải quyết đồng thời nhận diện và vận động. HLV, PT, lễ tân và quản lý sử dụng các dòng chuyên sâu.",
                imgSrc: "/bo-suu-tap/gym-2.jpg",
                imgAlt: "Đồng phục thể thao phòng gym HLV PT",
              },
              {
                title: "5.12 Doanh Nghiệp Dịch Vụ",
                text: "Doanh nghiệp dịch vụ xuất phát từ điểm khách hàng gặp nhân viên. Trang phục giúp tạo cảm giác chỉn chu, tin cậy và tiện làm việc.",
                imgSrc: "/khach-hang/dong-phuc-doanh-nghiep-psc.jpg",
                imgAlt: "Đồng phục doanh nghiệp dịch vụ PSC Cars",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="flex flex-col bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 group"
              >
                <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden">
                  <Image
                    src={card.imgSrc}
                    alt={card.imgAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    quality={82}
                  />
                </div>
                <div className="px-5 py-2 flex flex-col flex-grow bg-white">
                  <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#105d97] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {card.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200/60 text-sm text-gray-700 leading-6">
            Với nhóm thể thao và fitness, các cụm chuyên sâu để tham khảo riêng:{" "}
            <InternalLink href="/dong-phuc-gym">đồng phục Gym</InternalLink>,{" "}
            <InternalLink href="/dong-phuc-pt">đồng phục PT</InternalLink> và{" "}
            <InternalLink href="/dong-phuc-yoga-pilates">đồng phục Yoga - Pilates</InternalLink>.
          </div>
        </ArticleSection>

        {/* Section 7 */}
        <ArticleSection id="nhan-dien-mau-sac-thiet-ke">
          <SectionHeading number="7">Nhận diện, màu sắc và thiết kế</SectionHeading>
          <BangMauHero fabrics={fabrics} />


          <SectionSubheading>7.1 Màu sắc thương hiệu</SectionSubheading>
          <Prose>Doanh nghiệp nên xác định màu chủ đạo, màu phụ và phạm vi sử dụng trước khi chọn vải. Màu trên màn hình có thể khác màu thực tế theo ánh sáng và bề mặt vải, vì vậy cần duyệt mẫu vật lý hoặc mẫu màu thực tế. Có thể tham khảo <InternalLink href="/bang-mau">bảng màu đồng phục</InternalLink> trước khi chốt cấu hình.</Prose>
          <SectionSubheading>7.2 Logo, font chữ và slogan</SectionSubheading>
          <Prose>Logo ngực trái phù hợp cho nhận diện ở cự ly gần; lưng hoặc tay áo có thể hỗ trợ nhận diện trong sự kiện. Kích thước phải cân bằng với form áo. Font và slogan cần dùng đúng file thương hiệu, không tự dựng lại logo hoặc thay đổi tỷ lệ. Marketing nên cung cấp bộ nhận diện gốc cho nhà cung cấp.</Prose>
          <SectionSubheading>7.3 Họa tiết và quy tắc sử dụng</SectionSubheading>
          <Prose>Họa tiết nên có lý do: phân vai, gợi liên tưởng ngành hoặc tạo điểm nhận diện. Một thiết kế nhiều chi tiết nhưng khó sản xuất lại sẽ gây sai màu và khó tái đặt. Hồ sơ cuối cùng nên ghi rõ mã màu, vị trí in/thêu, kích thước, khoảng cách và cách xử lý phiên bản nam nữ.</Prose>
          <SectionSubheading>7.4 Thiết kế tối giản và thiết kế theo bộ phận</SectionSubheading>
          <Prose>Thiết kế tối giản dễ dùng lâu dài, dễ phối và ít lỗi khi đặt bổ sung. Thiết kế theo bộ phận phù hợp khi công việc, cấp độ trang trọng hoặc môi trường khác nhau. Hai hướng có thể kết hợp bằng cách giữ nền màu và ngôn ngữ logo giống nhau, chỉ thay form, đường phối hoặc màu phụ.</Prose>
          <SectionSubheading>7.5 Bộ sưu tập và thiết kế để có thể tái đặt</SectionSubheading>
          <Prose>Doanh nghiệp có thể tham khảo <InternalLink href="/bo-suu-tap">bộ sưu tập đồng phục</InternalLink> để hình dung các hướng phối kiểu dáng, màu sắc và cách thể hiện nhận diện trước khi phát triển mẫu riêng. Ngay từ đợt đầu, hãy lưu tên mẫu, mã vải, màu, bảng size, file logo, thông số in/thêu và mẫu đã duyệt.</Prose>
        </ArticleSection>

        {/* Section 8 */}
        <ArticleSection id="chat-lieu-form-size">
          <SectionHeading number="8">Chất liệu, form nam nữ và quản lý size</SectionHeading>

          <SectionSubheading>8.1 Chọn chất liệu theo nhu cầu</SectionSubheading>
          <Prose>Không có một loại vải phù hợp cho mọi vị trí. Doanh nghiệp nên đánh giá theo cảm giác, độ thoáng, quản lý ẩm, độ co giãn và bối cảnh dùng:</Prose>
          <TableSimple
            headers={["Nhu cầu", "Ưu tiên khi chọn", "Bối cảnh phù hợp"]}
            rows={[
              ["Văn phòng", "Đứng form, dễ chăm sóc, dễ phối", "Sơ mi, vest, polo công sở"],
              ["Ngoài trời", "Nhẹ, thoáng, hỗ trợ cản gió hoặc nắng theo cấu hình", "Áo gió, sự kiện, di chuyển"],
              ["Vận động", "Co giãn, thoát ẩm, nhẹ và không cản trở chuyển động", "Thể thao, teambuilding"],
              ["Sự kiện", "Dễ mặc, nhận diện rõ, phù hợp chụp ảnh", "Company trip, triển lãm"],
              ["Bảo hộ", "Độ bền và yêu cầu môi trường", "Nhà máy, kỹ thuật, công trường"],
            ]}
          />
          <Prose>Với các dòng thể thao, <InternalLink href="/cong-nghe-uni-dry">công nghệ UNI DRY</InternalLink> được mô tả là hỗ trợ đưa hơi ẩm từ mặt trong ra mặt ngoài để bay hơi. UNI QUICK DRY hướng tới cảm giác nhẹ, nhanh khô; UNI SUPER COOL thiên về cảm giác mềm, mát, mịn và co giãn. Không nên gán các dòng này mặc định cho sơ mi, vest hoặc bảo hộ nếu chưa có xác nhận cấu hình.</Prose>
          <SectionSubheading>8.2 Form nam và form nữ</SectionSubheading>
          <Prose>Form nam cần kiểm tra vai, ngực, bụng và chiều dài tay. Form nữ cần chú ý vòng ngực, eo, hông và độ thoải mái khi ngồi hoặc nâng tay. Cùng một size không có nghĩa là cùng một thông số cho hai form. Doanh nghiệp nên duyệt mẫu trên nhiều vóc dáng, không chỉ trên một người mẫu.</Prose>
          <SectionSubheading>8.3 Size và vóc dáng đặc biệt</SectionSubheading>
          <Prose>HR nên phát bảng size có số đo rõ ràng, thời hạn chốt và hướng dẫn đo. Với người có vóc dáng đặc biệt, cần ghi chú riêng thay vì ép chọn một size gần đúng. Nếu sản phẩm có thể may chỉnh hoặc cấu hình size mở rộng, nhà cung cấp cần xác nhận trước trong hồ sơ đơn hàng.</Prose>
          <SectionSubheading>8.4 Quản lý size cho đơn lớn</SectionSubheading>
          <Prose>Tạo một bảng duy nhất gồm họ tên, bộ phận, form, size, số lượng, ghi chú và tình trạng duyệt. Procurement nên khóa dữ liệu trước khi sản xuất, lưu phiên bản cuối cùng và dành một lượng dự phòng theo chính sách nội bộ. Khi tuyển mới, dữ liệu cũ giúp bổ sung đúng mẫu hơn.</Prose>
        </ArticleSection>

        {/* Section 9 */}
        <ArticleSection id="chi-phi-quy-trinh">

          <SectionHeading number="9">Chi phí, quy trình và đơn hàng số lượng lớn</SectionHeading>
          {/* Process */}
          <ProcessSteps />
          <SectionSubheading>9.1 Chi phí đồng phục phụ thuộc vào đâu?</SectionSubheading>
          <Prose>Không nên quyết định từ một con số tách rời cấu hình. Chi phí thường phụ thuộc vào loại áo, chất liệu, số lượng, thiết kế, kỹ thuật in/thêu, số vị trí logo, phụ kiện, đóng gói, yêu cầu đặc biệt và thời gian triển khai. Hãy yêu cầu báo giá thể hiện rõ: mẫu nào, vải nào, số lượng theo size, kỹ thuật logo, phụ kiện, đóng gói, mẫu duyệt, điều kiện thay đổi và các phần chưa bao gồm.</Prose>
          <SectionSubheading>9.2 Quy trình đặt đồng phục</SectionSubheading>
          <NumberedList items={[
            ["Tư vấn và xác định nhu cầu", "Khách hàng cung cấp ngành nghề, nhóm người mặc, mục đích, số lượng dự kiến, nhận diện và deadline. Univi tư vấn hướng cấu hình phù hợp."],
            ["Thiết kế", "Univi lên mockup dựa trên ý tưởng, màu và logo đã thống nhất. Khách hàng kiểm tra bố cục, form và cách thể hiện thương hiệu."],
            ["Chọn vải và duyệt mẫu", "Hai bên xác nhận chất liệu theo bối cảnh sử dụng, sau đó khách hàng nhận mẫu để kiểm tra form, màu, đường may và logo trước khi sản xuất toàn bộ."],
            ["Sản xuất và kiểm tra", "Đơn hàng được triển khai theo mẫu đã duyệt; chất lượng được kiểm tra theo form dáng, đường may, màu sắc và logo."],
            ["Giao hàng và hỗ trợ sau bán", "Doanh nghiệp nhận hàng, đối chiếu số lượng và lưu hồ sơ để thuận tiện khi cần bổ sung."],
          ]} />
          <SectionSubheading>9.3 Kinh nghiệm đặt số lượng lớn</SectionSubheading>
          <BulletList items={[
            "Chốt bộ nhận diện trước khi chọn form.",
            "Tách danh sách theo nhóm nhân sự và bối cảnh sử dụng.",
            "Khóa bảng size trước khi duyệt số lượng.",
            "Duyệt mẫu thực tế, không chỉ duyệt ảnh mockup.",
            "Xác định deadline lùi từ ngày cần mặc.",
            "Hỏi rõ phương án bổ sung cho nhân sự mới.",
            "Lưu file thiết kế, mã màu, thông số logo và mẫu duyệt.",
          ]} />
        </ArticleSection>

        {/* Section 10 */}
        <ArticleSection id="sai-lam-va-quy-mo">
          <SectionHeading number="10">Sai lầm thường gặp và cách chọn theo quy mô</SectionHeading>
          <ArticleImage
            src="/polo-doanh-nghiep/dong-phuc-polo-doanh-nghiep.png"
            alt="Sai lầm thường gặp khi đặt đồng phục doanh nghiệp số lượng lớn"
            caption="Sai lầm phổ biến nhất: đặt đồng phục không có bảng size chuẩn, không duyệt mẫu thực tế và không lưu hồ sơ để tái đặt."
            fullHeight
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {[
              { title: "10.1 Chọn áo chỉ vì giá", text: "Giá ban đầu thấp nhưng áo không được mặc thường xuyên, nhanh xuống form hoặc phải đặt lại sớm sẽ làm tăng chi phí sử dụng." },
              { title: "10.2 Không thống nhất màu thương hiệu", text: "Mỗi phòng ban tự chọn một màu khiến hình ảnh bị chia nhỏ. Cách tránh là khóa bảng màu chủ đạo, màu phụ và trường hợp được phép dùng trước khi thiết kế." },
              { title: "10.3 Không duyệt mẫu thực tế", text: "Mockup không cho thấy hết cảm giác vải, độ vừa, màu trên bề mặt hay vị trí logo khi mặc. Doanh nghiệp nên cho đại diện nam nữ thử mẫu và vận động theo công việc." },
              { title: "10.4 Không chuẩn hóa size", text: "Một bảng size không có số đo hoặc thu thập qua nhiều file riêng dễ tạo sai lệch. HR nên có một biểu mẫu duy nhất và người kiểm tra cuối." },
              { title: "10.5 Đặt sát deadline", text: "Đặt sát ngày sự kiện làm giảm thời gian chỉnh mẫu, kiểm tra và xử lý phát sinh. Nên chốt ngày cần mặc, trừ thời gian duyệt, sản xuất, kiểm đếm và vận chuyển." },
              { title: "10.6 Không tính nhân sự mới", text: "Nếu không lưu mã màu, vải, size và file logo, đơn bổ sung có thể khác đợt đầu. Hồ sơ tái đặt là một phần của hệ thống, không phải việc phát sinh sau cùng." },
              { title: "10.7 Mỗi bộ phận thiết kế một kiểu", text: "Phân vai không đồng nghĩa với tách rời thương hiệu. Hãy giữ một ngôn ngữ chung rồi thay đổi có kiểm soát ở form, màu phụ hoặc chi tiết nhận biết." },
            ].map(({ title, text }) => (
              <div key={title} className="rounded-lg border border-amber-100 bg-amber-50 p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{title}</h3>
                <p className="text-sm text-gray-700 leading-6">{text}</p>
              </div>
            ))}
          </div>
          <SectionSubheading>10.8 Chọn theo quy mô</SectionSubheading>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { range: "Dưới 20 nhân sự", desc: "Ưu tiên một mẫu nền tảng, bảng size gọn và thiết kế có thể dùng trong nhiều bối cảnh." },
              { range: "20–50 nhân sự", desc: "Có thể tách nhóm quản lý, văn phòng và sự kiện; cần người chốt duy nhất." },
              { range: "50–100 nhân sự", desc: "Nên có mã mẫu, dữ liệu size và quy trình duyệt rõ ràng." },
              { range: "100–500 nhân sự", desc: "Cần phân tầng theo vị trí, cơ sở và mục đích; hồ sơ tái đặt trở thành bắt buộc." },
              { range: "Trên 500 nhân sự", desc: "Cần quản lý mã màu, mẫu chuẩn, phân phối, bổ sung và kiểm soát chênh lệch giữa các đợt hoặc địa điểm." },
            ].map(({ range, desc }) => (
              <div key={range} className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <div className="font-bold text-[#105d97] text-sm mb-1">{range}</div>
                <p className="text-sm text-gray-700 leading-5">{desc}</p>
              </div>
            ))}
          </div>
        </ArticleSection>

        {/* Section 11 */}
        <ArticleSection id="vi-sao-chon-univi">
          <SectionHeading number="11">Vì sao doanh nghiệp chọn Đồng Phục Univi?</SectionHeading>
          <div className="mt-4 overflow-hidden border border-gray-200">
            <iframe
              className="aspect-video w-full"
              src="https://www.youtube.com/embed/0AABoh2a-Sk"
              title="Năng lực sản xuất đồng phục thể thao UNIVI"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <Prose>
            Đồng Phục Univi là đơn vị <strong>TIÊN PHONG</strong> cung cấp giải pháp đồng phục thể thao chuyên nghiệp cho các chuỗi phòng tập và đội nhóm thể thao tại Việt Nam. Với trang đồng phục doanh nghiệp, Univi có nền tảng từ hoạt động thiết kế và sản xuất đồng phục công ty, đồng thời phát triển chuyên sâu về chất liệu thể thao và bài toán B2B.
          </Prose>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { title: "Xưởng sản xuất", text: "2.000m² tại phường Chương Mỹ, Hà Nội. Công suất công bố 100.000 sản phẩm/tháng." },
              { title: "Kinh nghiệm & khách hàng", text: "Hơn 9 năm kinh nghiệm. Phục vụ toàn quốc, 500+ doanh nghiệp, phòng tập và câu lạc bộ thể thao." },
              { title: "Chất liệu & kiểm định", text: "R&D về chất liệu và hiệu suất vận động" },
            ].map(({ title, text }) => (
              <InfoCard key={title} title={title}>{text}</InfoCard>
            ))}
          </div>
          <SectionSubheading>11.1 Năng lực B2B cần được nhìn qua quy trình</SectionSubheading>
          <Prose>Với đơn hàng doanh nghiệp, một nhà cung cấp không chỉ cần có mẫu. Họ cần hiểu ai mặc, mặc ở đâu, logo xuất hiện thế nào, size được quản lý ra sao và đợt sau có thể tái đặt thế nào. Đây là lý do doanh nghiệp nên yêu cầu hồ sơ mẫu, thông tin chất liệu, tiêu chuẩn kiểm tra và phương án lưu dữ liệu trước khi quyết định.</Prose>
          <SectionSubheading>11.2 Khi nào nên liên hệ Univi?</SectionSubheading>
          <Prose>
            Bạn nên liên hệ khi đã có brief sơ bộ hoặc ngay cả khi mới xác định vấn đề. Các đầu vào hữu ích gồm: ngành nghề, nhóm người mặc, số lượng dự kiến, mục đích, màu thương hiệu, deadline, yêu cầu chất liệu và cách đặt bổ sung. Xem thêm <InternalLink href="/gioi-thieu">giới thiệu Đồng Phục Univi</InternalLink>, <InternalLink href="/san-pham">danh mục sản phẩm</InternalLink> và trao đổi trực tiếp qua <InternalLink href="/lien-he">liên hệ Univi</InternalLink>.
          </Prose>
        </ArticleSection>
      </div>

      {/* ─── Khách hàng thực tế của Đồng Phục Univi ─── */}
      <section id="khach-hang-univi" className="py-6 ">
        <div className="container mx-auto px-4">
          <div className="mx-auto text-center mb-10">

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-3">
              Khách hàng của Đồng Phục Univi
            </h2>
            <p className="text-base md:text-lg text-gray-700 font-medium leading-relaxed mb-3">
              Đồng hành cùng các doanh nghiệp, tập đoàn và thương hiệu lớn trong việc xây dựng hình ảnh đội ngũ chuyên nghiệp.
            </p>
            <p className="text-sm text-gray-500  mx-auto leading-relaxed">
              Các hình ảnh thực tế dưới đây ghi lại đội ngũ nhân sự và sản phẩm đồng phục tại một số doanh nghiệp, thương hiệu mà Univi đã đồng hành.
            </p>
          </div>

          {/* Customer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 x-auto mb-10">
            {univiCustomers.map((customer) => (
              <CustomerCard key={customer.name} customer={customer} />
            ))}
          </div>

          {/* Trust / Social Proof note */}
          <div className=" mx-auto p-5 rounded-2xl bg-white border border-blue-100  text-center mb-10">
            <p className="text-base text-gray-700 leading-relaxed italic">
              &ldquo;Những hình ảnh thực tế từ đội ngũ khách hàng giúp thể hiện cách đồng phục Univi được ứng dụng trong nhiều môi trường B2B khác nhau — từ văn phòng, dịch vụ, kỹ thuật đến khu vui chơi và du lịch.&rdquo;
            </p>
          </div>

          {/* CTA Box */}
          <div className=" mx-auto  text-gray-900 p-6 md:p-8 text-center ">
            <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-900">
              Doanh nghiệp của bạn cần một bộ đồng phục được thiết kế riêng?
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 mx-auto">
              Univi hỗ trợ tư vấn giải pháp nhận diện, lên mockup thiết kế miễn phí và may mẫu thử trước khi sản xuất hàng loạt.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("openContactModal"))}
                className="inline-flex items-center gap-2 bg-[#105d97] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#0d4c7a] transition-colors shadow-sm text-sm"
              >
                Trao đổi giải pháp đồng phục
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/lien-he"
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-full hover:bg-gray-50 transition-colors text-sm"
              >
                Xem thông tin liên hệ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-xl md:text-2xl font-bold tracking-tight text-gray-900 mb-6">
            Doanh nghiệp đã tin tưởng Đồng Phục Univi
          </h2>
          <PartnersSection category="doanh-nghiep" />
        </div>
      </section>



      {/* Conclusion + FAQ + CTA */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 ">
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6 md:p-8 mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Kết luận</h2>
            <Prose>
              Đồng phục doanh nghiệp nên được quản lý như một hệ thống: cùng nhận diện, đúng vai trò, đúng môi trường và có hồ sơ để tái đặt. Khi HR, Marketing, Procurement và đơn vị sản xuất cùng dùng một bộ dữ liệu, doanh nghiệp giảm sai lệch màu, size, logo và cấu hình giữa các đợt.
            </Prose>
            <Prose>
              Người đọc nên bắt đầu bằng việc lập nhóm nhân sự, mục đích sử dụng và yêu cầu chất liệu trước khi chọn mẫu.
            </Prose>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-6">Câu hỏi thường gặp</h2>
          <div className="space-y-3 mb-10">
            {doanhNghiepFaqs.map(([question, answer], index) => (
              <div key={index} className="rounded-xl border border-gray-200 bg-white">
                <button
                  type="button"
                  id={`dn-faq-btn-${index}`}
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left font-semibold text-gray-900 text-sm"
                  aria-expanded={expandedFaq === index}
                  aria-controls={`dn-faq-answer-${index}`}
                >
                  <span>{question}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${expandedFaq === index ? "rotate-180" : ""}`} />
                </button>
                {expandedFaq === index && (
                  <div
                    id={`dn-faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`dn-faq-btn-${index}`}
                    className="border-t border-gray-100 px-4 py-3.5 text-sm leading-6 text-gray-700"
                  >
                    {answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#0d4c7a] to-[#105d97] text-white p-6 md:p-8 text-center">
            <h2 className="text-lg md:text-xl font-bold mb-2">Gửi brief cho Đồng Phục Univi</h2>
            <p className="text-white/85 text-sm leading-6 mb-5 max-w-xl mx-auto">
              Bạn có thể gửi brief về số lượng, nhóm người mặc, màu thương hiệu, mục đích sử dụng và thời gian cần có hàng. Đội ngũ sẽ tư vấn cấu hình phù hợp, từ Polo, sơ mi, vest, áo gió đến đồng phục sự kiện và bảo hộ theo từng nhóm nhân sự.
            </p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("openContactModal"))}
              className="inline-flex items-center gap-2 bg-white text-[#105d97] font-semibold px-7 py-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              Nhận tư vấn &amp; báo giá
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
