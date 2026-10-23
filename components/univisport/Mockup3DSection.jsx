import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

const MOCKUP_SLIDES = [
  {
    id: "co-khoa",
    tag: "Powerzip 3D",
    title: "Mẫu Áo Gym Cổ Có Khóa",
    description:
      "Thiết kế chuẩn Athletic Fit thể thao, tích hợp cổ kéo khóa Powerzip linh hoạt. Chất liệu UNI DRY thoát ẩm siêu tốc, co giãn 4 chiều tối ưu cho mọi động tác tập luyện cường độ cao.",
    link: "/mau-ao-gym-co-co-khoa",
    image: "/mockup/tshirt-mag1-gag1.jpg",
    alt: "Mẫu áo gym cổ có khóa 3D Univi",
  },
  {
    id: "co-polo",
    tag: "Polo Sport 3D",
    title: "Mẫu Áo Gym Cổ Polo",
    description:
      "Dòng áo Polo thể thao lịch sự, chuyên nghiệp dành cho Huấn luyện viên PT và nhân viên phòng tập. Phối màu độc quyền theo nhận diện thương hiệu với chất vải thoáng khí, giữ form dáng xuất sắc.",
    link: "/mau-ao-gym-co-polo",
    image: "/mockup/polo-mag30.jpg",
    alt: "Mẫu áo gym cổ polo 3D Univi",
  },
  {
    id: "co-tron",
    tag: "Classic Fit 3D",
    title: "Áo Gym Cổ Tròn Không Khóa",
    description:
      "Mẫu áo thun gym cổ tròn truyền thống, thiết kế tinh tế với đường may Raglan chống ma sát. Khả năng tản nhiệt nhanh chóng, giữ cơ thể luôn khô thoáng và tự tin trong suốt buổi tập.",
    link: "/mau-ao-gym-co-tron-khong-khoa",
    image: "/mockup/tshirt-mag11-gag11.jpg",
    alt: "Mẫu áo gym cổ tròn không khóa 3D Univi",
  },
];

export default function Mockup3DSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto slide inside section
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % MOCKUP_SLIDES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const activeItem = MOCKUP_SLIDES[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + MOCKUP_SLIDES.length) % MOCKUP_SLIDES.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % MOCKUP_SLIDES.length);
  };

  return (
    <section className="py-6 md:py-12 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* LEFT COLUMN: 3D Mockup Image Slider */}
          <div
            className="lg:col-span-6 relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >

            {/* Main Slider Card */}
            <div className="relative  p-4 sm:p-6 md:p-8 aspect-[4/3] sm:aspect-[16/11] flex items-center justify-center overflow-hidden group">

              {/* Image Transition Render */}
              <div className="relative w-full h-full">
                {MOCKUP_SLIDES.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${idx === activeIndex
                      ? "opacity-100 scale-100 pointer-events-auto z-10"
                      : "opacity-0 scale-95 pointer-events-none z-0"
                      }`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain object-center w-full h-full "
                      priority={idx === 0}
                    />
                  </div>
                ))}
              </div>

              {/* Slider Arrow Controls */}
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-[#105d97] text-gray-800 hover:text-white border border-gray-200 hover:border-[#105d97] flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110"
                aria-label="Previous mockup"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-[#105d97] text-gray-800 hover:text-white border border-gray-200 hover:border-[#105d97] flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110"
                aria-label="Next mockup"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Bottom Dot Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {MOCKUP_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${idx === activeIndex
                      ? "w-7 bg-[#105d97]"
                      : "w-2.5 bg-gray-300 hover:bg-gray-400"
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Content & Action */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Pill Tag */}
            <div className="mb-4">
              <span className="inline-block px-4 py-1.5 rounded-full border border-[#105d97]/40 text-[#105d97] text-xs md:text-sm font-bold uppercase tracking-wider bg-[#105d97]/5">
                Mẫu Mockup Đồng phục Thể Thao Univi
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 tracking-tight leading-snug mb-5">
              Giải Pháp Đồng Phục Thể Thao Chuyên Nghiệp
            </h2>

            {/* Dynamic Active Slide Info */}
            <div className="bg-gray-50/80 rounded-2xl p-5 md:p-6 border border-gray-100 mb-6 transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-[#105d97] bg-[#105d97]/10 px-2.5 py-0.5 rounded">
                  {activeItem.tag}
                </span>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  {activeItem.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {activeItem.description}
              </p>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              {/* Direct Link to Active 3D Item Page */}
              <Link
                href={activeItem.link}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border-2 border-[#105d97] text-[#105d97] hover:bg-[#105d97] hover:text-white font-bold text-sm transition-all duration-300 shadow-sm"
              >
                <span>Xem chi tiết</span>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
