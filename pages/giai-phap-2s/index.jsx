import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  ShieldCheck,
  Zap,
  Target,
  TrendingUp,
  Users,
  Briefcase,
  LayoutDashboard,
  Droplets,
  Wind,
  Sun,
  Award,
  ChevronRight,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import DefaultLayout2 from "../../components/layout/DefaultLayout2";
import CTABanner from "../../components/univisport/CTABanner";

const BRAND = "#105d97";

export default function GiaiPhap2S({ meta }) {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Smart Sport Uniform Solution",
    provider: { "@type": "Organization", name: "Đồng Phục Univi", url: "https://dongphucunivi.com" },
    name: "Giải pháp 2S Uniform - Smart Sport Uniform",
    description: "Giải pháp đồng phục thể thao toàn diện cho các chuỗi phòng tập tại Việt Nam.",
    areaServed: "VN",
  };

  return (
    <DefaultLayout2>
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
      </Head>

      {/* ═══════════════════════════════════════
          HERO  —  split: text+stats | image
      ═══════════════════════════════════════ */}
      <section className="bg-white pt-[100px] ">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-12  mx-auto">

            {/* LEFT */}
            <div className="animate-fade-in-up">
              <p className="text-[0.72rem] font-bold tracking-[0.16em] uppercase text-[#105d97] block mb-2.5">
                Giải pháp chuyên biệt
              </p>
              <h1 className="text-[clamp(2.2rem,4.5vw,3.4rem)] font-black text-[#1a2636] leading-[1.1] tracking-[-0.022em] my-3.5 italic">
                Smart Sport -
                <span className="text-[#105d97]"> 2S Uniform </span>
              </h1>
              <p className="text-[0.98rem] text-[#6b7280] leading-[1.75] mb-8">
                Hệ sinh thái đồng phục thể thao thông minh dành riêng cho chuỗi phòng tập tại
                Việt Nam. Chuẩn hóa nhận diện,{" "}
                <span className="text-[#105d97] font-semibold">nâng tầm thương hiệu</span>,
                tối ưu chi phí vận hành dài hạn.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section id="kham-pha" className="py-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "url('/images/dots.svg')", backgroundSize: "400px" }}></div>
        <div className="container mx-auto relative z-10 px-4">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-14 items-start">

            {/* Left Column: Huge Image with Dark Overlay Box */}
            <div className="w-full lg:w-[46%] relative">
              <div className="w-full aspect-[4/3] lg:aspect-[4/3]  overflow-hidden relative border border-[#e2e8f0]">
                <Image src="/images/dong-phuc-gym-univi-nhom-5-nguoi-phong-gym.jpg" alt="Thực trạng đồng phục" fill className="object-cover" />
              </div>
            </div>

            {/* Right Column: Title & Items */}
            <div className="w-full lg:flex-1 pl-0 lg:pl-10 pt-2 lg:pt-0">
              {/* Header part */}
              <div className="mb-8 lg:mb-12">
                {/* Top Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#e2e8f0] bg-white text-[0.65rem] font-extrabold text-[#1a2636] tracking-[0.15em] uppercase mb-5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#105d97]"></span>
                  THỰC TRẠNG PHÒNG TẬP
                </div>

                <h2 className="text-xl lg:text-3xl font-extrabold text-[#1a2636] leading-[1.15] tracking-[-0.03em]">
                  Khắc Phục Những <span className="text-[#105d97]">Lỗ Hổng</span><br />
                  Ngốn Ngân Sách Và
                  Trải Nghiệm Hội Viên
                </h2>

              </div>

              {/* The 4 Rows */}
              <div className="flex flex-col border-t border-[#e2e8f0] pt-2 px-2">
                {[
                  { id: "01", title: "Hình ảnh lộn xộn, thiếu chuyên nghiệp", desc: "Giảm 30% tỷ lệ chốt gói tập mới so với đối thủ" },
                  { id: "02", title: "Chất liệu áo gây bí bách, ngứa ngáy", desc: "Giảm hiệu suất hướng dẫn, HLV nhanh mệt mỏi" },
                  { id: "03", title: "Chi phí may mới liên tục bị đội lên", desc: "Ngân sách đồng phục tăng 50% mỗi năm do hàng kém bền" },
                  { id: "04", title: "Đánh mất kênh tiếp thị tự nhiên", desc: "Lãng phí cơ hội quảng bá với hàng ngàn \"billboard sống\"" },
                ].map((item, idx) => (
                  <div key={idx} className="group flex flex-col sm:flex-row sm:items-center py-2 border-b border-[#e2e8f0] transition-colors hover:bg-white cursor-pointer px-4 -mx-4 rounded-[16px]">
                    {/* Number */}
                    <span className="text-[#105d97] font-black text-[1.05rem] w-12 shrink-0 mb-1 sm:mb-0 opacity-80">{item.id}</span>

                    {/* Text */}
                    <div className="flex-1 pr-4">
                      <h4 className="text-[1.1rem] leading-6 font-extrabold text-[#1a2636] mb-1 transition-colors group-hover:text-[#105d97]">{item.title}</h4>
                      <p className="text-[#6b7280] text-[0.9rem] leading-[1.6] font-medium">{item.desc}</p>
                    </div>

                    {/* Arrow Button */}
                    <div className="w-10 h-10 shrink-0 rounded-full border border-[#e2e8f0] flex items-center justify-center text-[#1a2636] group-hover:bg-[#105d97] group-hover:text-white group-hover:border-[#105d97] transition-all bg-white hidden sm:flex">
                      <ArrowRight size={18} className="rotate-[-45deg] group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2S DEFINITION  —  reference style
      ═══════════════════════════════════════ */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8 max-w-[640px]">
            <div className="flex items-center gap-[10px] text-[0.72rem] font-bold tracking-[0.14em] uppercase text-[#105d97] mb-[14px]">
              Giải pháp toàn diện
            </div>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.6rem)] font-extrabold text-[#1a2636] leading-[1.2] tracking-[-0.018em] my-1.5">
              Hệ sinh thái <span className="text-[#105d97]">2S Uniform</span>
            </h2>
            <p className="text-[0.98rem] text-[#6b7280] leading-[1.78] max-w-[560px]">
              2S = <strong>SMART</strong> + <strong>SPORT</strong>. Mô hình tích hợp từ công nghệ vải,
              thiết kế nhận diện đến chiến lược thương hiệu —{" "}
              <em>làm đơn giản những gì phức tạp</em>.
            </p>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-9">
            {[
              {
                icon: <Target size={34} />, title: "Chuẩn hóa Trang phục",
                desc: "Thiết kế đo ni đóng giày cho từng vị trí. Vải co giãn 4 chiều, siêu nhẹ, thoáng khí tối ưu."
              },
              {
                icon: <Award size={34} />, title: "Nhận diện Thương hiệu",
                desc: "Màu sắc Pantone chuẩn xác, logo in/thêu sắc nét không bong tróc sau 200 lần giặt."
              },
              {
                icon: <TrendingUp size={34} />, title: "Tối ưu Đầu tư",
                desc: "Độ bền x3 vải thường, tiết kiệm 50% chi phí thay mới mỗi năm cho mỗi chuỗi phòng tập."
              },

              {
                icon: <Users size={34} />, title: "Đồng phục Theo Vị trí",
                desc: "HLV, lễ tân, bảo vệ — mỗi bộ phận một thiết kế riêng, nhất quán trong nhận diện."
              },
              {
                icon: <Zap size={34} />, title: "Giao hàng Nhanh chóng",
                desc: "Mẫu 3D trong 2 ngày, sản xuất đúng hạn cam kết. Không delay, không phát sinh chi phí ẩn."
              },
            ].map((f, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className="w-[50px] h-[50px] shrink-0 flex items-center justify-center bg-[#e8f2fb] text-[#105d97] border border-[#105d9726] rounded-[11px] transition-all duration-200 group-hover:-translate-y-[3px] group-hover:bg-[#105d971f]">{f.icon}</div>
                <div>
                  <h3 className="text-[1rem] font-bold text-[#1a2636] mb-[7px]">{f.title}</h3>
                  <p className="text-[0.86rem] text-[#6b7280] leading-[1.68]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FABRIC TECH
      ═══════════════════════════════════════ */}
      <section className="py-6 md:py-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-12 z-10 relative lg:gap-8 gap-10">
            {/* Background Watermark */}
            <div className="absolute top-[45%] lg:top-auto lg:bottom-[-20%] left-[-5%] lg:left-[-2%] text-[10rem] sm:text-[18rem] lg:text-[20rem] font-black text-[#105d97]/[0.025] select-none tracking-tighter whitespace-nowrap z-0 pointer-events-none">
              univi
            </div>

            {/* Left Column */}
            <div className="w-full lg:w-[48%] flex flex-col relative z-20">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#e2e8f0] bg-white text-[0.65rem] font-extrabold text-[#105d97] tracking-[0.15em] uppercase mb-6 w-fit shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#105d97]"></span>
                CÔNG NGHỆ VẢI
              </div>

              {/* Title */}
              <h2 className="text-[clamp(2.2rem,3.5vw,2.8rem)] font-extrabold text-[#1a2636] leading-[1.1] tracking-[-0.03em] mb-5">
                Chuyên Gia Trong Cải Tiến <span className="text-[#105d97]">Công Nghệ</span> Và Thiết Kế.
              </h2>

              {/* Desc */}
              <p className="text-[#6b7280] text-[0.98rem] leading-[1.7] font-medium max-w-[500px] mb-10">
                Trái tim của giải pháp 2S: Đảm bảo khô thoáng tuyệt đối. Giải pháp ưu việt giúp biến ý tưởng thương hiệu thành hiện thực, tối ưu hiệu suất với hệ công nghệ chất liệu chính xác đến từng sợi vải.
              </p>

              {/* Stats Lines */}
              <div className="flex flex-col gap-5 pl-1 max-w-[500px]">
                {[
                  { name: "Khả Năng Nhả Ẩm UNI-DRY", stat: "100%" },
                  { name: "Hiệu Ứng Làm Mát Siêu Tốc", stat: "-2°C" },
                  { name: "Độ Căng Giãn Phục Hồi Khung", stat: "200%" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-extrabold text-[1rem] text-[#1a2636]">{item.name}</span>
                      <span className="font-bold text-[0.95rem] text-[#105d97]">{item.stat}</span>
                    </div>
                    {/* The drawing line exactly like image */}
                    <div className="flex items-center w-full relative">
                      <div className="flex-1 h-[2px] bg-[#1a2636]"></div>
                      <div className="w-[3px] h-[10px] bg-[#1a2636] transform rotate-[35deg] origin-bottom-left -translate-y-[4px]"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Image Platform */}
            <div className="w-full lg:w-[48%] relative mt-16 lg:mt-0 z-20 px-4 sm:px-0">
              {/* 3D Base pad to mimic the platform */}
              <div className="absolute -bottom-4 lg:-bottom-6 -left-6 sm:-left-12 -right-6 sm:-right-8 h-20 bg-[#cfd6df]/40 rounded-[2rem] transform translate-y-2 z-0"></div>

              {/* Inner container */}
              <div className="relative w-full aspect-[4/3] rounded-t-[1.5rem] rounded-b-[1rem] overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.15)] z-10 border-[3px] lg:border-[6px] border-white">
                <Image src="/images/chat-lieu-vai.webp" alt="Công nghệ vải UNI DRY" fill className="object-cover object-center" />
              </div>

              {/* Decorational item bottom left */}
              <div className="absolute -bottom-8 lg:-bottom-10 left-4 lg:left-[-2rem] w-[110px] h-[110px] bg-[#105d97] rounded-full shadow-[0_12px_32px_rgba(16,93,151,0.35)] border-[6px] border-white z-20 flex flex-col items-center justify-center transform hover:scale-[1.03] transition-transform duration-300">
                <span className="font-black text-white text-[1.5rem] leading-none mb-1 tracking-tight">X4</span>
                <span className="text-[0.8rem] font-bold text-[#a8d4f5] uppercase tracking-[0.15em] leading-none">Độ Bền</span>
              </div>
            </div>
          </div>


        </div>
        {/* 3 fabric cards */}
        <div className="mt-5 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-0">
            {[
              {
                title: "QUICK DRY", feats: ["82–100% Poly", "Cản nắng / gió", "Sấy khô 30 phút"],
                apps: "Gym · Kickfit · MMA", icon: <Wind size={30} />, img: "/images/uni-quickdry.webp"
              },
              {
                title: "SUPER COOL", feats: ["76–90% Polyamide", "Lạnh hơn da 2°C", "Mềm như lụa"],
                apps: "Yoga · Dance · Golf", icon: <Droplets size={30} />, img: "/images/uni-supper-cool.webp"
              },
              {
                title: "BLENDED", feats: ["Sợi tổng hợp", "Chống nhăn tuyệt đối", "Bền màu 1000h"],
                apps: "Cycling · Running", icon: <Sun size={30} />, img: "/images/uni-blended.webp"
              },
            ].map((fc, i) => (
              <div key={i} className="bg-white border border-[#e2e8f0] rounded-[14px] p-0 overflow-hidden transition-all duration-200 hover:shadow-[0_10px_32px_rgba(16,93,151,0.09)] hover:-translate-y-[3px]">
                <div className="relative h-[190px] bg-[#dde]">
                  <Image src={fc.img} alt={fc.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 right-3 text-white bg-[#105d97b3] rounded-[9px] p-2">{fc.icon}</div>
                </div>
                <div className="pt-5 px-[22px] pb-6">
                  <h4 className="text-[1.2rem] font-black text-[#1a2636] mb-2.5 tracking-[-0.01em]">{fc.title}</h4>
                  <ul className="list-none p-0 mx-0 mb-3 text-[#6b7280] text-[0.87rem] leading-[1.9]">
                    {fc.feats.map((f, j) => (
                      <li key={j} className="before:content-['—_'] before:text-[#105d97] before:font-bold">{f}</li>
                    ))}
                  </ul>
                  <div className="text-[0.78rem] font-bold text-[#105d97] tracking-[0.06em] uppercase border-t border-[#e2e8f0] pt-3">{fc.apps}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PRODUCTION
      ═══════════════════════════════════════ */}
      <section className="py-14 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">

            {/* Left: Circle Image */}
            <div className="w-full lg:w-[44%] flex justify-center">
              <div className="relative w-[90%] max-w-[440px] aspect-square rounded-full overflow-hidden shadow-[0_20px_56px_rgba(0,0,0,0.12)] border-[8px] border-white ring-1 ring-[#e2e8f0]">
                <Image src="/images/xuong-san-xuat.jpg" alt="Xưởng sản xuất Univi" fill className="object-cover object-center" />
              </div>
            </div>

            {/* Right: Text */}
            <div className="w-full lg:w-[56%]">
              {/* Label */}
              <p className="text-[0.72rem] font-extrabold tracking-[0.18em] uppercase text-[#105d97] mb-4">
                XƯỞNG MÀY CHUẨN CHẤT LƯỢNG
              </p>

              {/* Heading */}
              <h2 className="text-[clamp(2rem,3.5vw,2.9rem)] font-extrabold text-[#1a2636] leading-[1.12] tracking-[-0.025em] mb-5">
                Xưởng may hiện đại,<br />
                Sản xuất đúng tiến độ
              </h2>

              {/* Desc */}
              <p className="text-[0.96rem] text-[#6b7280] leading-[1.75] mb-8 max-w-[520px]">
                Hệ thống xưởng may 2.000m² tại phường Chương Mỹ, Hà Nội với đội ngũ 100+ thợ lành nghề. Cam kết giao hàng đúng hạn và kiểm soát chất lượng 100% đầu ra trước khi bàn giao.
              </p>

              {/* 2×2 Feature Pills */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Công suất 100K sp/tháng",
                  "Giao hàng đúng hẹn",
                  "100+ thợ chuyên nghiệp",
                  "Bảo hành trọn đời",
                ].map((label, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#f4f8fc] border border-[#dce8f4] rounded-[10px] px-4 py-3">
                    <div className="w-5 h-5 rounded-full bg-[#105d97] flex items-center justify-center shrink-0">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-[0.9rem] font-semibold text-[#1a2636]">{label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          PROCESS — 6 steps
      ═══════════════════════════════════════ */}
      <section className="py-6 md:py-10 ">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-[640px] text-center mx-auto">
            <p className="text-[0.72rem] font-bold tracking-[0.16em] uppercase text-[#105d97] block mb-2.5">Quy trình</p>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.6rem)] font-extrabold text-[#1a2636] leading-[1.2] tracking-[-0.018em] my-1.5">6 bước tinh chuẩn</h2>
            <div className="w-10 h-[3px] bg-[#105d97] rounded-[2px] my-3 mx-auto" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-0">
            {[
              { n: "01", t: "Khảo sát", d: "Phân tích đặc thù của từng bộ môn và chuỗi phòng tập." },
              { n: "02", t: "Design", d: "Mẫu 3D thực tế, chỉnh sửa không giới hạn đến khi gật đầu." },
              { n: "03", t: "May mẫu", d: "Kiểm tra chất liệu, form dáng tận tay trước khi ký kết." },
              { n: "04", t: "Sản xuất", d: "Máy may 4 kim chuyên dụng, đường chỉ bền bỉ từng mũi." },
              { n: "05", t: "QC Check", d: "Kiểm soát lỗi 100% sản phẩm đầu ra, không sai sót." },
              { n: "06", t: "Bàn giao", d: "Hỗ trợ hậu mãi, bảo hành đường may trọn đời sản phẩm." },
            ].map((s, i) => (
              <div key={i} className="py-[32px] px-[28px] border-t-2 border-[#e2e8f0] cursor-default transition-colors duration-200 hover:bg-[#e8f2fb] group">
                <div className="text-[2.6rem] font-black text-[#d1dce8] leading-none mb-3.5 transition-colors duration-200 group-hover:text-[#105d97]">{s.n}</div>
                <h3 className="text-[1rem] font-extrabold text-[#1a2636] mb-[9px]">{s.t}</h3>
                <p className="text-[0.86rem] text-[#6b7280] leading-[1.68]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA
      ═══════════════════════════════════════ */}
      <CTABanner />
    </DefaultLayout2>
  );
}

export async function getServerSideProps() {
  const meta = {
    title: "Giải pháp Đồng phục 2S - Smart Sport Uniform cho Chuỗi Phòng Tập",
    description: "Giải pháp 2S Uniform giúp chuỗi phòng tập chuẩn hóa trang phục, nâng tầm thương hiệu và tối ưu chi phí. Đồng phục chuyên dụng cho Gym, Yoga, Kickfit, MMA.",
    keywords: "giải pháp 2S, 2S uniform, đồng phục gym, đồng phục yoga, đồng phục hlv, đồng phục pt, may đồng phục thể thao, đồng phục univi, smart sport uniform",
    robots: "index, follow",
    author: "Đồng Phục Univi",
    canonical: "https://dongphucunivi.com/giai-phap-2s",
    og: {
      title: "Giải pháp Đồng phục 2S - Smart Sport Uniform cho Chuỗi Phòng Tập",
      description: "Hệ sinh thái trang phục thông minh (SMART + SPORT) cho phòng tập. Nâng tầm thương hiệu, tối ưu chi phí dài hạn cùng Đồng Phục Univi.",
      type: "website",
      image: "https://dongphucunivi.com/images/baner-univi.webp",
      imageWidth: "1200",
      imageHeight: "630",
      url: "https://dongphucunivi.com/giai-phap-2s",
    },
    twitter: {
      card: "summary_large_image",
      title: "Giải pháp Đồng phục 2S - Smart Sport Uniform",
      description: "Chuẩn hóa trang phục - Nâng tầm thương hiệu - Tối ưu chi phí. Duy nhất tại Đồng Phục Univi.",
      image: "https://dongphucunivi.com/images/baner-univi.webp",
    },
  };

  return { props: { meta } };
}
