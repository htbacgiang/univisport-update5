import React, { useState, useRef } from 'react';
import Image from 'next/image';
import ContactForm from '../header/ContactForm';

const POLO_PRODUCTS = [
  {
    id: 'mag30-gag30',
    code: 'MAG30-GAG30',
    subTitle: 'THIẾT KẾ ÁO GYM POLO CÓ KHÓA KÉO',
    isRedCode: true,
    image: '/mockup/polo-mag30.jpg',
    name: 'Áo Gym Polo Xanh Lá Phối Khóa Kéo Powerzip',
    description: 'Thiết kế cổ Polo kết hợp dây kéo ẩn Powerzip tiện lợi, sắc xanh lá tươi sáng nhận diện độc đáo.',
  },
  {
    id: 'mapl10-gapl10',
    code: 'MAPL10-GAPL10',
    subTitle: 'THIẾT KẾ ÁO POLO CÓ CÚC',
    isRedCode: false,
    image: '/mockup/polo-mpl10.jpg',
    name: 'Áo Polo Gym Xanh Dương Cổ Cúc Cổ Điển',
    description: 'Form áo Polo truyền thống với bo cổ dệt tinh tế, 3 cúc gài lịch sự, phù hợp nhân sự quầy lễ tân.',
  },
  {
    id: 'mapl07-gapl07',
    code: 'MAPL07-GAPL07',
    subTitle: 'THIẾT KẾ ÁO POLO CÓ CÚC',
    isRedCode: true,
    image: '/mockup/polo-mpl7.jpg',
    name: 'Áo Polo Lễ Tân & PT Phòng Tập Đen Phối Cổ Xanh',
    description: 'Hình ảnh mẫu thực tế quầy Check-in Fitness - Phối màu cổ xanh sang trọng và lịch thiệp.',
  },
  {
    id: 'mapl06-gaplpl06',
    code: 'MAPL06-GAPLPL06',
    subTitle: 'THIẾT KẾ ÁO GYM POLO CÓ CÚC',
    isRedCode: true,
    image: '/mockup/polo-mpl6.jpg',
    name: 'Áo Polo PT Nam Nữ Đen Phối Viền Vàng Nổi Bật',
    description: 'Viền phối màu vàng kim ở nẹp cổ và tay áo tạo điểm nhấn cao cấp cho thương hiệu Gym.',
  },
  {
    id: 'mapl09-gapl09',
    code: 'MAPL09-GAPL09',
    subTitle: 'THIẾT KẾ ÁO GYM POLO CÓ KHÓA KÉO',
    isRedCode: true,
    image: '/mockup/polo-mpl9.jpg',
    name: 'Áo Polo Nữ Đỏ Phối Khóa Kéo & Vai Trắng',
    description: 'Kiểu dáng Croptop / Slim Fit nữ tính, phối vai trắng thể thao năng động.',
  },
  {
    id: 'mapl12-gapl12',
    code: 'MAPL12-GAPL12',
    subTitle: 'THIẾT KẾ ÁO POLO CÓ CÚC',
    isRedCode: true,
    image: '/mockup/polo-mpl12.jpg',
    name: 'Áo Polo Gym Xanh Navy Phối Sọc Ngực Trắng',
    description: 'Dải sọc ngang ngực trắng cá tính, chất liệu UNI DRY co giãn 4 chiều mềm mát.',
  },
];

const UniformStylesPoloComponent = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [contactPopupOpen, setContactPopupOpen] = useState(false);
  const [contactSource, setContactSource] = useState('Tư vấn mẫu áo Gym cổ Polo');
  const modalRef = useRef(null);

  const handleOpenConsult = (productName) => {
    setContactSource(productName || 'Tư vấn mẫu áo Gym cổ Polo Univi');
    setContactPopupOpen(true);
  };

  return (
    <div className="relative w-full mx-auto bg-white font-sans text-slate-800">
      {/* 1. Hero Models Group Photo Banner with Integrated Tag */}
      <div className="relative w-full rounded-b-3xl md:rounded-b-[36px] rounded-t-none overflow-hidden shadow-xs mb-6 sm:mb-8 bg-slate-50 border border-slate-100">
        {/* Top-Left Banner Tag */}
        <div className="absolute hidden md:block top-0 left-0 z-20 inline-flex items-center px-5 sm:px-8 md:px-10 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#0e3a68] via-[#105d97] to-[#3898ce] text-white rounded-br-[32px] md:rounded-br-[42px] shadow-sm">
          <h1 className="text-base sm:text-2xl md:text-[28px] font-black uppercase tracking-wider text-white">
            KIỂU DÁNG ÁO UNIVI
          </h1>
        </div>

        {/* Center Hero Image */}
        <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] md:aspect-[16/7] min-h-[220px]">
          <Image
            src="/mockup/mau-ao-gym-co-polo.png"
            alt="Kiểu dáng áo Gym UNIVI - Các mẫu áo gym cổ polo"
            fill
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="object-cover object-center hover:scale-105 transition-transform duration-700"
            priority
          />
        </div>
      </div>

      {/* Content Container (Centered & Balanced) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. Main Section Title & Subtitle */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-lg md:text-3xl font-bold uppercase tracking-wide text-[#105d97] mb-1">
            CÁC MẪU ÁO GYM CỔ POLO
          </h2>
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-slate-400 uppercase">
            UNICORE TRAINING COLLECTION
          </p>
        </div>

        {/* 3. Product Grid (6 Items in 3 columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
          {POLO_PRODUCTS.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedProduct(item)}
              className="group flex flex-col items-center cursor-pointer bg-white rounded-xl p-2.5 sm:p-3 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Product Image Box */}
              <div className="relative w-full aspect-[4/3] overflow-hidden mb-2.5 flex items-center justify-center">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Code & Subtitle Label */}
              <div className="text-center">
                <span className={`text-xs sm:text-sm font-extrabold uppercase tracking-wider ${item.isRedCode ? 'text-red-600' : 'text-slate-700 group-hover:text-[#105d97]'
                  }`}>
                  {item.code}
                </span>
                {item.subTitle && (
                  <p className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-tight mt-0.5">
                    {item.subTitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 4. Customization Footer Notes (Giống hệt ảnh mẫu) */}
        <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div>
            <span className="font-extrabold text-[#105d97] uppercase tracking-wide mr-1.5">
              *TUỲ CHỌN PHỐI MÀU CỔ & TAY
            </span>
            <br className="sm:hidden" />
            <span>
              Dễ dàng tuỳ chỉnh theo màu sắc trong bộ nhận diện, giúp đồng phục trở thành một phần thống nhất của hình ảnh thương hiệu.
            </span>
          </div>
          <div>
            <span className="font-extrabold text-[#105d97] uppercase tracking-wide mr-1.5">
              *LOGO IN/THÊU SẮC NÉT
            </span>
            <br className="sm:hidden" />
            <span>
              Linh hoạt lựa chọn nhiều vị trí thể hiện, giúp tăng khả năng nhận diện và tạo dấu ấn riêng cho từng thương hiệu.
            </span>
          </div>
        </div>

        {/* 5. Bottom Contact Gradient Bar (Giống hệt ảnh mẫu) */}
        <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#105d97] via-[#1a70af] to-[#3898ce] p-3.5 sm:p-4 mb-8 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2">
            <span>📞</span>
            <span className="tracking-wide font-bold">0834.204.999 - 0961.567.997</span>
          </div>
          <div className="flex items-center gap-2 text-center sm:text-right">
            <span>📍</span>
            <span>Nhà D14, ngõ 180 đường Thanh Bình, phường Hà Đông, thành phố Hà Nội</span>
          </div>
        </div>
      </div>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-black/60 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => e.target === e.currentTarget && setSelectedProduct(null)}
        >
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 animate-scaleUp">
            <div className="bg-gradient-to-r from-[#105d97] to-[#0e4a7a] p-4 text-white flex justify-between items-center">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-white/80 font-bold">Mã sản phẩm</span>
                <h3 className="text-xl font-black uppercase text-white">{selectedProduct.code}</h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-white/80 hover:text-white bg-white/10 rounded-full p-1.5 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  sizes="500px"
                  className="object-contain p-2"
                />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1">{selectedProduct.name}</h4>
                <p className="text-xs font-semibold text-[#105d97] uppercase mb-1">{selectedProduct.subTitle}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedProduct.description}</p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    const name = selectedProduct.code;
                    setSelectedProduct(null);
                    handleOpenConsult(`Yêu cầu thiết kế mã mẫu ${name}`);
                  }}
                  className="flex-1 bg-[#105d97] hover:bg-[#0d4a7a] text-white py-3 rounded-xl font-bold text-sm shadow transition"
                >
                  Yêu cầu thiết kế mã {selectedProduct.code}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form Popup */}
      {contactPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-black/60 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setContactPopupOpen(false)}
        >
          <div ref={modalRef} className="my-4 mx-4 container max-w-6xl" role="dialog" aria-labelledby="style-contact-form-title">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-[#105d97] to-[#0e4a7a] text-white px-5 py-3.5 flex justify-between items-center">
                <h2 id="style-contact-form-title" className="text-base sm:text-lg font-bold uppercase">
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

export default React.memo(UniformStylesPoloComponent);
