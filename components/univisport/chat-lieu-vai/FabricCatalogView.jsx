import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ContactForm from '../../header/ContactForm';
import { FABRIC_MATERIALS } from '../../../data/fabricMaterials';

// 4 Characteristic circular SVG icons matching the exact design in the image
const AirflowIcon = ({ className = "w-4 h-4 text-white/90" }) => (
  <svg className={className} viewBox="0 0 36 36" fill="none" stroke="currentColor">
    <circle cx="18" cy="18" r="16" strokeWidth="1.2" strokeOpacity="0.85" />
    <path d="M13 13V8M13 8L11 10M13 8L15 10" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 14V6.5M18 6.5L16 8.5M18 6.5L20 8.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23 13V8M23 8L21 10M23 8L25 10" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 18C10 19 12 17 14 18C16 19 18 17 20 18C22 19 24 17 26 18C28 19 30 17" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M13 23V28M13 28L11 26M13 28L15 26" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 22V29.5M18 29.5L16 27.5M18 29.5L20 27.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23 23V28M23 28L21 26M23 28L25 26" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const QuickDryIcon = ({ className = "w-4 h-4 text-white/90" }) => (
  <svg className={className} viewBox="0 0 36 36" fill="none" stroke="currentColor">
    <circle cx="18" cy="18" r="16" strokeWidth="1.2" strokeOpacity="0.85" />
    <path d="M18 7.5C18 7.5 15.5 11 15.5 12.8C15.5 14.1 16.6 15 18 15C19.4 15 20.5 14.1 20.5 12.8C20.5 11 18 7.5 18 7.5Z" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M12.5 10C12.5 10 10.8 12.5 10.8 13.8C10.8 14.7 11.6 15.5 12.5 15.5C13.4 15.5 14.2 14.7 14.2 13.8C14.2 12.5 12.5 10 12.5 10Z" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M23.5 10C23.5 10 21.8 12.5 21.8 13.8C21.8 14.7 22.6 15.5 23.5 15.5C24.4 15.5 25.2 14.7 25.2 13.8C25.2 12.5 23.5 10 23.5 10Z" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M9 19.5H27" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M13.5 28V22.5M13.5 22.5L11.5 24.5M13.5 22.5L15.5 24.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 29V21.5M18 21.5L16 23.5M18 21.5L20 23.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22.5 28V22.5M22.5 22.5L20.5 24.5M22.5 22.5L24.5 24.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SuperStretchIcon = ({ className = "w-4 h-4 text-white/90" }) => (
  <svg className={className} viewBox="0 0 36 36" fill="none" stroke="currentColor">
    <circle cx="18" cy="18" r="16" strokeWidth="1.2" strokeOpacity="0.85" />
    <path d="M18 18L10 10M10 10H14.5M10 10V14.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 18L26 10M26 10H21.5M26 10V14.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 18L10 26M10 26H14.5M10 26V21.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 18L26 26M26 26H21.5M26 26V21.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SoftLightIcon = ({ className = "w-4 h-4 text-white/90" }) => (
  <svg className={className} viewBox="0 0 36 36" fill="none" stroke="currentColor">
    <circle cx="18" cy="18" r="16" strokeWidth="1.2" strokeOpacity="0.85" />
    <path d="M26 9.5C22.5 10.5 19 13 17.5 17C16 21 13 23 9 26C11.5 26 14.5 25.5 17.5 23C21.5 20.5 24.5 16.5 26 9.5Z" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M26 9.5C23.5 11 20.5 14 17.5 18C14.5 22 12 24.5 9 26" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M17.5 18C19 16.5 21.5 14.5 23.5 13" strokeWidth="1" strokeLinecap="round" />
    <path d="M14.5 22C16 20.5 18.5 18.5 20 17" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export default function FabricCatalogView({ syncHash = false }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('uniair');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');

  // Sync tab with URL hash if present (only when syncHash is enabled)
  useEffect(() => {
    if (syncHash && typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      const matched = FABRIC_MATERIALS.find(f => f.id === hash || f.slug === hash);
      if (matched) {
        setActiveTab(matched.id);
      }
    }
  }, [router.asPath, syncHash]);

  const currentFabric = FABRIC_MATERIALS.find(f => f.id === activeTab) || FABRIC_MATERIALS[0];

  const handleSelectTab = (fabricId) => {
    setActiveTab(fabricId);
    if (syncHash && typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${fabricId}`);
    }
  };

  const handleOpenConsult = (actionTitle) => {
    setContactSubject(`${actionTitle} - ${currentFabric.name}`);
    setContactModalOpen(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-3 sm:py-2 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. TABS CHO TỪNG LOẠI VẢI (MOBILE: 3 TRÊN - 2 DƯỚI, DESKTOP: 1 HÀNG)
      ───────────────────────────────────────────────────────────── */}
      <div className="mb-3 sm:mb-4 flex justify-center">
        <div className="w-full sm:w-auto bg-white/95 p-1.5 sm:p-1.5 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-6 sm:flex sm:items-center gap-1.5 sm:gap-2">
          {FABRIC_MATERIALS.map((fabric, idx) => {
            const isActive = activeTab === fabric.id;
            const mobileColSpan = idx < 3 ? 'col-span-2' : 'col-span-3';
            return (
              <button
                key={fabric.id}
                id={`tab-${fabric.id}`}
                onClick={() => handleSelectTab(fabric.id)}
                className={`${mobileColSpan} sm:w-auto group px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[10px] min-[360px]:text-[11px] sm:text-xs md:text-sm tracking-tight transition-all duration-200 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center ${isActive
                  ? 'bg-[#105d97] text-white shadow-sm scale-[1.01]'
                  : 'text-slate-600 hover:text-[#105d97] hover:bg-slate-100'
                  }`}
                aria-selected={isActive}
                role="tab"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${isActive ? 'bg-amber-300' : 'bg-slate-400 group-hover:bg-[#105d97]'
                    }`}
                />
                <span className="truncate">{fabric.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. GIAO DIỆN CATALOG CHUẨN 100% NHƯ ẢNH MẪU (THU GỌN VỪA KHUNG)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white container p-2 sm:p-5 md:p-6  transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">

          {/* ═════════════════════════════════════════════════════════
              CỘT TRÁI (LEFT HALF)
          ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-3 sm:space-y-3.5">

            {/* Ribbon Header Tiêu Đề */}
            <div className="inline-block bg-gradient-to-r from-[#0d3b66] to-[#105d97] text-white px-3.5 sm:px-5 py-1.5 rounded-lg sm:rounded-xl shadow-sm self-start">
              <h2 className="text-xs sm:text-sm md:text-base lg:text-[18px] font-black uppercase tracking-wider font-sans leading-tight text-white ">
                {currentFabric.leftTitle}
              </h2>
            </div>

            {/* Khung Vân Vải (Fabric Texture Box) */}
            <div className="relative w-full aspect-[16/8.5] sm:aspect-[16/8] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-slate-200/90 group">
              {/* Vân vải nền thực tế (Next.js Image tối ưu, siêu nhẹ, load tức thì) */}
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                <Image
                  key={currentFabric.bgImage}
                  src={currentFabric.bgImage}
                  alt={`Thớ vải ${currentFabric.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 650px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Lớp phủ tối nhẹ để nổi bật chữ */}
              {/* Chữ đặc tính giữa vân vải */}
              <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-3 pointer-events-none">
                <p className="text-white text-[11px] sm:text-xs md:text-sm font-black tracking-wider uppercase text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] whitespace-pre-line leading-tight font-sans">
                  {currentFabric.badge}
                </p>
              </div>

              {/* Thanh thông số đáy */}
              <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 border-t border-white/10 text-white flex items-center justify-between gap-1.5 sm:gap-2">
                {/* Tỷ lệ sợi */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-sm sm:text-base md:text-lg font-black text-white leading-none">
                      {currentFabric.composition[0]?.percentage}
                    </span>
                    <span className="text-[8px] sm:text-[9.5px] font-bold text-white/90 uppercase tracking-tight">
                      {currentFabric.composition[0]?.name}
                    </span>
                  </div>

                  <div className="h-3.5 w-[1px] bg-white/30" />

                  <div className="flex items-baseline gap-0.5">
                    <span className="text-sm sm:text-base md:text-lg font-black text-white leading-none">
                      {currentFabric.composition[1]?.percentage}
                    </span>
                    <span className="text-[8px] sm:text-[9.5px] font-bold text-white/90 uppercase tracking-tight">
                      {currentFabric.composition[1]?.name}
                    </span>
                  </div>
                </div>

                {/* 4 Icon đặc tính & Định lượng */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="hidden min-[450px]:block text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-amber-300">
                    {currentFabric.weight}
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex flex-col items-center" title="Thoáng khí">
                      <AirflowIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      <span className="text-[6.5px] sm:text-[7.5px] text-white/80 font-medium mt-0.5">Thoáng khí</span>
                    </div>
                    <div className="flex flex-col items-center" title="Khô nhanh">
                      <QuickDryIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      <span className="text-[6.5px] sm:text-[7.5px] text-white/80 font-medium mt-0.5">Khô nhanh</span>
                    </div>
                    <div className="flex flex-col items-center" title="Siêu co giãn">
                      <SuperStretchIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      <span className="text-[6.5px] sm:text-[7.5px] text-white/80 font-medium mt-0.5">Siêu co giãn</span>
                    </div>
                    <div className="flex flex-col items-center" title="Mềm nhẹ">
                      <SoftLightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      <span className="text-[6.5px] sm:text-[7.5px] text-white/80 font-medium mt-0.5">Mềm nhẹ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thẻ Gradient ĐẶC TÍNH CHẤT LIỆU */}
            <div
              className="relative rounded-xl sm:rounded-2xl p-3.5 sm:p-4 md:p-4.5 text-white shadow-lg overflow-hidden border border-white/20 bg-cover bg-center"
              style={{ backgroundImage: 'url(/images/card-gradient-bg.jpg)' }}
            >
              {/* Hiệu ứng ánh sáng góc */}
              <div className="absolute -right-16 -top-16 w-40 h-40 bg-cyan-300/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -left-16 -bottom-16 w-40 h-40 bg-blue-700/30 rounded-full blur-2xl pointer-events-none" />

              {/* Tiêu đề card */}
              <h3 className="relative text-center text-sm sm:text-base md:text-lg font-black uppercase tracking-wider text-white mb-2.5 drop-shadow-sm">
                ĐẶC TÍNH CHẤT LIỆU
              </h3>

              <div className="relative space-y-2 text-white/95 text-[11px] sm:text-xs md:text-[12.5px] leading-relaxed">

                {/* 1. TÍNH NĂNG NỔI BẬT */}
                <div>
                  <h4 className="font-extrabold uppercase text-white tracking-wide mb-0.5 flex items-center gap-1 text-[11px] sm:text-xs md:text-[13px]">
                    <span className="text-cyan-300 font-black">•</span> {currentFabric.featuresTitle}
                  </h4>
                  <ul className="space-y-0.5 pl-2.5 text-white/90">
                    {currentFabric.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="select-none font-bold text-cyan-200">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. ỨNG DỤNG */}
                <div>
                  <h4 className="font-extrabold uppercase text-white tracking-wide mb-0.5 flex items-center gap-1 text-[11px] sm:text-xs md:text-[13px]">
                    <span className="text-cyan-300 font-black">•</span> {currentFabric.applicationTitle}
                  </h4>
                  <p className="pl-2.5 text-white/90">
                    {currentFabric.applicationText}
                  </p>
                </div>

                {/* 3. GỢI Ý LỰA CHỌN */}
                <div>
                  <h4 className="font-extrabold uppercase text-white tracking-wide mb-0.5 flex items-center gap-1 text-[11px] sm:text-xs md:text-[13px]">
                    <span className="text-cyan-300 font-black">•</span> {currentFabric.recommendationTitle}
                  </h4>
                  <p className="pl-2.5 text-white/90">
                    {currentFabric.recommendationText}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ═════════════════════════════════════════════════════════
              CỘT PHẢI (RIGHT HALF) - 6 MẪU ÁO GỌN GÀNG
          ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-2.5">

            <div>
              {/* Tiêu đề cột phải */}
              <h3 className="text-xs sm:text-sm md:text-base lg:text-[17px] font-black uppercase text-[#105d97] tracking-tight leading-snug mb-1 font-sans">
                {currentFabric.rightTitle}
              </h3>

              {/* Đoạn mô tả kỹ thuật */}
              <p className="text-[10.5px] sm:text-[11.5px] md:text-xs text-slate-500 leading-relaxed mb-2.5">
                {currentFabric.rightDescription}
              </p>

              {/* Grid 6 Mẫu Áo Mockup Đôi (2 Cột x 3 Hàng) */}
              <div className="grid grid-cols-2 gap-x-2 sm:gap-x-3 gap-y-1.5 sm:gap-y-2 bg-white p-0.5 rounded-xl">
                {currentFabric.mockups.map((mockupSrc, idx) => (
                  <div
                    key={`${currentFabric.id}-${idx}`}
                    className="relative w-full aspect-[16/11] sm:aspect-[16/10.5] rounded-lg overflow-hidden bg-white flex items-center justify-center p-0.5 transition-transform duration-200 hover:scale-[1.02]"
                  >
                    <Image
                      src={mockupSrc}
                      alt={`${currentFabric.name} - Mẫu thiết kế ${idx + 1}`}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 240px"
                      className="object-contain"
                      priority={idx < 2}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Logo Thương Hiệu Đáy */}
            <div className="pt-1 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black text-[#105d97] tracking-wider font-sans leading-none">
                  UNIVI
                </span>
              </div>
              <p className="text-[8.5px] sm:text-[9.5px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                YOUR UNIFORM, YOUR BRAND!
              </p>
            </div>

          </div>

        </div>

        {/* ═════════════════════════════════════════════════════════
            NÚT HÀNH ĐỘNG TƯ VẤN & BÁO GIÁ (GỌN GÀNG)
        ═════════════════════════════════════════════════════════ */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap justify-center items-center gap-2.5 sm:gap-3">
          <Link
            href="/bang-mau"
            className="inline-flex items-center justify-center bg-[#105d97] hover:bg-[#0d4a7a] text-white px-5 sm:px-7 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md shadow-[#105d97]/20 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer text-center"
          >
            Xem bảng màu Univi
          </Link>
          <button
            onClick={() => handleOpenConsult('Yêu cầu báo giá đồng phục theo chất liệu')}
            className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-[#105d97] px-5 sm:px-7 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
          >
            Nhận báo giá ngay
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. POPUP MODAL TƯ VẤN MẪU VẢI
      ───────────────────────────────────────────────────────────── */}
      {contactModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-black/65 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => e.target === e.currentTarget && setContactModalOpen(false)}
        >
          <div className="my-4 mx-4 container max-w-4xl" role="dialog" aria-modal="true" aria-labelledby="fabric-modal-title">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
              <div className="bg-gradient-to-r from-[#105d97] to-[#0b416b] text-white px-5 py-3.5 flex justify-between items-center">
                <div>
                  <h3 id="fabric-modal-title" className="text-sm sm:text-base font-bold uppercase tracking-wide">
                    {contactSubject}
                  </h3>
                  <p className="text-[11px] text-white/80">
                    Chuyên viên Univi sẽ liên hệ gửi tập mẫu thực tế và tư vấn trong vòng 24h
                  </p>
                </div>
                <button
                  onClick={() => setContactModalOpen(false)}
                  aria-label="Đóng"
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="bg-white p-2 sm:p-4">
                <ContactForm source={contactSubject} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preload ngầm 5 ảnh thớ vải để chuyển tab mượt và ngay lập tức không bị delay */}
      <div className="hidden" aria-hidden="true">
        {FABRIC_MATERIALS.map((fabric) => (
          <Image
            key={`preload-${fabric.id}`}
            src={fabric.bgImage}
            alt=""
            width={10}
            height={10}
            priority
          />
        ))}
      </div>
    </div>
  );
}
