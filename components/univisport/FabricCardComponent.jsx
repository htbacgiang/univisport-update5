import React, { useState, useRef } from 'react';
import Image from 'next/image';
import ContactForm from '../header/ContactForm';

const FABRICS = [
  {
    id: 'supercool',
    name: 'UNI – SUPER COOL | UNIA02',
    category: 'sport',
    bgImage: '/mockup/fabric-supercool-bg.jpg',
    image: '/images/fabric-supercool-polo.png',
    cardTitle: 'ĐẶC TÍNH UNI – SUPER COOL | UNIA02',
    composition: [
      { percentage: '89%', name: 'Polyamide' },
      { percentage: '11%', name: 'Elastane' },
    ],
    bullets: [
      'Co giãn cao, linh hoạt theo chuyển động cơ thể.',
      'Bề mặt mịn, mang lại cảm giác dễ chịu khi mặc trong thời gian dài.',
      'Thoát ẩm và nhanh khô, phù hợp với môi trường vận động thường xuyên.',
      'Form trang phục có độ rủ kết hợp độ mướt của vải cảm giác cao cấp hơn các dòng Polyester thể thao cơ bản.',
    ],
    features: ['Co giãn 4 chiều', 'Mát lạnh tức thì', 'Chống nhăn tự nhiên', 'Chuẩn form PT'],
  },
  {
    id: 'quickdry',
    name: 'UNI - QUICK DRY | UNIA01',
    category: 'sport',
    bgImage: '/mockup/uni-quickdry.jpg',
    image: '/images/fabric-quickdry-polo.png',
    cardTitle: 'ĐẶC TÍNH UNI - QUICK DRY | UNIA01',
    composition: [
      { percentage: '88%', name: 'Polyester' },
      { percentage: '12%', name: 'Elastane' },
    ],
    bullets: [
      'Nhanh khô, thoát ẩm tốt, hạn chế cảm giác bí và nặng áo khi vận động.',
      'Bề mặt mỏng, mịn và nhẹ, giảm cảm giác ma sát với da.',
      'Co giãn tốt, hỗ trợ các chuyển động liên tục và biên độ vận động lớn.',
      'Ít giữ nước hơn Cotton, phù hợp với các hoạt động ra nhiều mồ hôi.',
    ],
    features: ['Thoát ẩm 1 chiều', 'Khô siêu tốc', 'Chống tia UV', 'Bền màu vượt trội'],
  },
  {
    id: 'uniair',
    name: 'UNI – AIR | UNIA12',
    category: 'sport',
    bgImage: '/mockup/uni-air.jpg',
    image: '/images/fabric-uniair-polo.png',
    cardTitle: 'ĐẶC TÍNH UNI – AIR | UNIA12',
    composition: [
      { percentage: '90%', name: 'Polyamide' },
      { percentage: '10%', name: 'Elastane' },
    ],
    bullets: [
      'Mỏng và nhẹ, giảm cảm giác nặng áo khi vận động.',
      'Cấu trúc lỗ thoáng khí giúp tăng khả năng lưu thông không khí.',
      'Thoát hơi ẩm và nhanh khô.',
      'Có độ co giãn, hỗ trợ chuyển động linh hoạt.',
      'Phù hợp với điều kiện thời tiết nóng hoặc các hoạt động ra nhiều mồ hôi.',
    ],
    features: ['Cấu trúc Air-Mesh', 'Siêu nhẹ & thoáng', 'Tản nhiệt siêu tốc', 'Kháng khuẩn bám mùi'],
  },
  {
    id: 'polo-casau',
    name: 'UNI – COOL PIQUÉ | UNIA14',
    category: 'office',
    bgImage: '/mockup/uni-pique.jpg',
    image: '/images/fabric-casau-polo.png',
    cardTitle: 'ĐẶC TÍNH UNI – COOL PIQUÉ | UNIA14',
    composition: [
      { percentage: '86%', name: 'Polyamide' },
      { percentage: '14%', name: 'Elastane' },
    ],
    bullets: [
      'Bề mặt Piqué tạo vẻ chỉn chu, hiện đại và cao cấp.',
      'Mềm, mịn, nhẹ và mát khi tiếp xúc với da.',
      'Hàm lượng Elastane 14% mang lại độ co giãn cao, thoải mái khi vận động.',
      'Thoát ẩm tốt, phù hợp sử dụng trong thời gian dài.',
      'Cân bằng giữa tính thể thao và tính lịch sự, dễ ứng dụng trong môi trường công việc.',
    ],
    features: ['Đứng form lịch sự', 'Dệt mắt Pique', 'Thoáng khí tối ưu', 'Chuẩn lễ tân & quản lý'],
  },
  {
    id: 'polo-hoatiet',
    name: 'UNI – ELITE | UNIA11',
    category: 'office',
    bgImage: '/mockup/fabric-hoatiet-polo.jpg',
    image: '/images/fabric-hoatiet-polo.png',
    cardTitle: 'ĐẶC TÍNH UNI – ELITE | UNIA11',
    composition: [
      { percentage: '93%', name: 'Polyester' },
      { percentage: '7%', name: 'Elastane' },
    ],
    bullets: [
      'Nhẹ, thoáng và nhanh khô, phù hợp với hoạt động thể thao.',
      'Cấu trúc bề mặt hỗ trợ lưu thông không khí.',
      'Có độ co giãn giúp vận động thoải mái.',
      'Họa tiết bề mặt sang trọng, tăng tính thời trang cho sản phẩm Polo.',
      'Phù hợp cả môi trường thể thao và đồng phục có yêu cầu cao về hình ảnh.',
    ],
    features: ['Họa tiết in chìm', 'Không phai màu', 'Siêu nhẹ & mát', 'Độc quyền thương hiệu'],
  },
];

const FabricCardComponent = () => {
  const [selectedId, setSelectedId] = useState('quickdry');
  const [contactPopupOpen, setContactPopupOpen] = useState(false);
  const [contactSource, setContactSource] = useState('Chất liệu vải UNIVI');
  const modalRef = useRef(null);

  const selectedFabric = FABRICS.find((f) => f.id === selectedId) || FABRICS[1];

  const sportList = FABRICS.filter((f) => f.category === 'sport');
  const officeList = FABRICS.filter((f) => f.category === 'office');

  const handleOpenConsult = (sourceName) => {
    setContactSource(sourceName || `Tư vấn chất liệu: ${selectedFabric.name}`);
    setContactPopupOpen(true);
  };

  return (
    <div className="relative container mx-auto my-6 bg-white rounded-3xl p-4   font-sans">
      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Column: Interactive Fabric Cards */}
        <div className="lg:col-span-6 flex flex-col space-y-3.5">
          {/* Group 1: CHẤT LIỆU ÁO POLO THỂ THAO */}
          <div>
            <h3 className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wide text-[#105d97] mb-2 sm:mb-3 md:mb-3.5">
              CHẤT LIỆU ÁO POLO THỂ THAO
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-1 gap-2 sm:gap-3.5">
              {sportList.map((fabric) => {
                const isActive = selectedId === fabric.id;
                return (
                  <button
                    key={fabric.id}
                    type="button"
                    onClick={() => setSelectedId(fabric.id)}
                    className={`group relative w-full h-14 sm:h-24 md:h-[100px] rounded-xl sm:rounded-2xl md:rounded-[20px] overflow-hidden text-center cursor-pointer transition-all duration-300 transform ${isActive
                      ? 'ring-2 sm:ring-4 ring-[#105d97]/60 scale-[1.02] shadow-lg'
                      : 'hover:scale-[1.015] hover:shadow-md opacity-95 hover:opacity-100'
                      }`}
                  >
                    {/* Real Fabric Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${fabric.bgImage})` }}
                    />

                    {/* Dark contrast overlay so text is always clear */}
                    <div className={`absolute inset-0 transition-colors duration-300 ${isActive ? 'bg-black/30' : 'bg-black/40 group-hover:bg-black/30'}`} />

                    {/* Active State Indicator / Glow */}
                    {isActive && (
                      <div className="absolute inset-0 border-2 border-white/60 rounded-xl sm:rounded-2xl md:rounded-[20px] pointer-events-none" />
                    )}

                    {/* Card Title */}
                    <div className="relative h-full flex items-center justify-center px-1 sm:px-4">
                      <span className="text-[10px] min-[380px]:text-xs sm:text-xl md:text-2xl font-black text-white uppercase tracking-tight sm:tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-200 leading-tight">
                        {fabric.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 2: CHẤT LIỆU ÁO POLO VĂN PHÒNG */}
          <div>
            <h3 className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wide text-[#105d97] mb-2 sm:mb-3 md:mb-3.5 mt-2 sm:mt-3">
              CHẤT LIỆU ÁO POLO VĂN PHÒNG
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3.5">
              {officeList.map((fabric) => {
                const isActive = selectedId === fabric.id;
                return (
                  <button
                    key={fabric.id}
                    type="button"
                    onClick={() => setSelectedId(fabric.id)}
                    className={`group relative w-full h-14 sm:h-24 md:h-[100px] rounded-xl sm:rounded-2xl md:rounded-[20px] overflow-hidden text-center cursor-pointer transition-all duration-300 transform ${isActive
                      ? 'ring-2 sm:ring-4 ring-[#105d97]/60 scale-[1.02] shadow-lg'
                      : 'hover:scale-[1.015] hover:shadow-md opacity-95 hover:opacity-100'
                      }`}
                  >
                    {/* Real Fabric Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${fabric.bgImage})` }}
                    />

                    {/* Dark contrast overlay so text is always clear */}
                    <div className={`absolute inset-0 transition-colors duration-300 ${isActive ? 'bg-black/30' : 'bg-black/40 group-hover:bg-black/30'}`} />

                    {/* Active State Indicator / Glow */}
                    {isActive && (
                      <div className="absolute inset-0 border-2 border-white/60 rounded-xl sm:rounded-2xl md:rounded-[20px] pointer-events-none" />
                    )}

                    {/* Card Title */}
                    <div className="relative h-full flex items-center justify-center px-1 sm:px-4">
                      <span className="text-xs sm:text-xl md:text-2xl font-black text-white uppercase tracking-tight sm:tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-200 leading-tight">
                        {fabric.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Shirt Image + Composition + Dynamic Characteristic Card */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-3">
          {/* Top: Dynamic Polo Shirts Image */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/10] bg-white overflow-hidden flex items-center justify-center">
            <Image
              key={selectedFabric.id}
              src={selectedFabric.image}
              alt={`Mẫu áo đồng phục vải ${selectedFabric.name} UNIVI`}
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-contain p-2 transition-all duration-500 animate-fadeIn"
              priority
            />
          </div>

          {/* Middle: Thành phần chất liệu & Icon đặc tính (Nhỏ gọn, không border) */}
          <div className="flex flex-col items-center justify-center pb-1">
            {/* Composition Text: 89% POLYAMIDE / 11% ELASTANE */}
            <div className="text-xs sm:text-sm md:text-base font-bold tracking-wider text-slate-800 uppercase text-center font-sans">
              {selectedFabric.composition
                ? selectedFabric.composition
                  .map((comp) => `${comp.percentage} ${comp.name.toUpperCase()}`)
                  .join(' / ')
                : '89% POLYAMIDE / 11% ELASTANE'}
            </div>

            {/* 3 Circular Feature Icons */}
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              {/* Icon 1: Thoáng khí (Airflow / Breathability) */}
              <div className="flex flex-col items-center">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-slate-800"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="24" cy="24" r="22" strokeWidth="1.6" />
                  {/* Top 3 Upward arrows */}
                  <path d="M18 16V11M18 11L16 13M18 11L20 13" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M24 17V9M24 9L22 11M24 9L26 11" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M30 16V11M30 11L28 13M30 11L32 13" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Fabric middle membrane */}
                  <path d="M13 23.5C14.5 24.5 16 23 17.5 23.5C19 24 20.5 23 22 23.5C23.5 24 25 23 26.5 23.5C28 24 29.5 23 31 23.5C32.5 24 34 23 35.5 23.5" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M13 25.5C14.5 26.5 16 25 17.5 25.5C19 26 20.5 25 22 25.5C23.5 26 25 25 26.5 25.5C28 26 29.5 25 31 25.5C32.5 26 34 25 35.5 25.5" strokeWidth="1.6" strokeLinecap="round" />
                  {/* Bottom 3 Downward arrows */}
                  <path d="M18 32V37M18 37L16 35M18 37L20 35" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M24 31V39M24 39L22 37M24 39L26 37" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M30 32V37M30 37L28 35M30 37L32 35" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Icon 2: Thoát ẩm / Nhanh khô (Moisture Wicking / Quick Dry) */}
              <div className="flex flex-col items-center">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-slate-800"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="24" cy="24" r="22" strokeWidth="1.6" />
                  {/* 3 Droplets */}
                  <path d="M24 10C24 10 21.5 14.5 21.5 16.5C21.5 17.88 22.62 19 24 19C25.38 19 26.5 17.88 26.5 16.5C26.5 14.5 24 10 24 10Z" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M17.5 13C17.5 13 15.7 15.8 15.7 17.2C15.7 18.2 16.5 19 17.5 19C18.5 19 19.3 18.2 19.3 17.2C19.3 15.8 17.5 13 17.5 13Z" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M30.5 13C30.5 13 28.7 15.8 28.7 17.2C28.7 18.2 29.5 19 30.5 19C31.5 19 32.3 18.2 32.3 17.2C32.3 15.8 30.5 13 30.5 13Z" strokeWidth="1.6" strokeLinejoin="round" />
                  {/* Fabric line */}
                  <path d="M12 23.5H36" strokeWidth="1.6" strokeLinecap="round" />
                  {/* Bottom 3 Upward arrows */}
                  <path d="M18 36V28M18 28L16 30M18 28L20 30" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M24 37V27M24 27L22 29M24 27L26 29" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M30 36V28M30 28L28 30M30 28L32 30" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Icon 3: Mềm mại & Nhẹ (Soft & Lightweight Feather) */}
              <div className="flex flex-col items-center">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-slate-800"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="24" cy="24" r="22" strokeWidth="1.6" />
                  {/* Feather body & stem */}
                  <path d="M34 14C30 15 25 18 23 23C21 28 17 31 12 34C15 34 19 33.5 23 30.5C28 27 32 22 34 14Z" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M34 14C31 16 27 20 23 25C19 30 16 33 12 34" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M23 23C25 21 28 18.5 31 16.5" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M19 28C21 26 24 23.5 26 22" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom: Dynamic Đặc Tính Chất Liệu Card */}
          <div
            className="relative rounded-xl sm:rounded-2xl p-4 md:p-6 text-white shadow-xl overflow-hidden border border-white/20 bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/card-gradient-bg.jpg)' }}
          >
            {/* Background Glow Accents */}
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header Title */}
            <h4 className="relative text-center text-lg sm:text-xl md:text-2xl font-extrabold uppercase tracking-wider text-white mb-4 drop-shadow-sm transition-all">
              {selectedFabric.cardTitle}
            </h4>

            {/* Dynamic Bullet Points */}
            <ul className="relative space-y-1 sm:space-y-1.5 text-white/95 text-xs sm:text-sm md:text-[15px] leading-relaxed mb-2">
              {selectedFabric.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold select-none text-white/90">-</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap justify-center items-center gap-3 sm:gap-4">
        <button
          onClick={() => handleOpenConsult(`Yêu cầu mẫu vải: ${selectedFabric.name}`)}
          className="bg-[#105d97] hover:bg-[#0d4a7a] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          aria-label="Request free fabric samples"
        >
          Nhận mẫu vải
        </button>
        <button
          onClick={() => handleOpenConsult(`Tư vấn báo giá đồng phục vải ${selectedFabric.name}`)}
          className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all duration-200"
          aria-label="Get a quote"
        >
          Nhận báo giá
        </button>
      </div>

      {/* Contact Form Popup */}
      {contactPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-black/60 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setContactPopupOpen(false)}
        >
          <div ref={modalRef} className="my-4 mx-4 container max-w-6xl" role="dialog" aria-labelledby="fabric-contact-form-title">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-[#105d97] to-[#0e4a7a] text-white px-5 py-3.5 flex justify-between items-center">
                <h2 id="fabric-contact-form-title" className="text-base sm:text-lg font-bold uppercase">
                  {contactSource}
                </h2>
                <button
                  onClick={() => setContactPopupOpen(false)}
                  aria-label="Đóng"
                  className="text-white/90 hover:text-white hover:bg-white/10 rounded-lg p-1.5 focus:outline-none transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="bg-white">
                <ContactForm source={contactSource} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(FabricCardComponent);
