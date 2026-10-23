import React, { useState, useRef } from 'react';
import Image from 'next/image';
import ContactForm from '../header/ContactForm';

const PRODUCTS = [
  {
    id: 'mag2-gag2',
    code: 'MAG2-GAG2',
    image: '/mockup/tshirt-mag2-gag2.png',
    name: 'Áo Gym Cổ Tròn Phối Tay Raglan Trắng & Thân Xanh',
    description: 'Thiết kế phối màu vai Raglan tăng biên độ chuyển động cho tay và vai, phù hợp HLV & hội viên.',
  },
  {
    id: 'mag4-gag4',
    code: 'MAG4-GAG4',
    image: '/mockup/tshirt-mag4-gag4.jpg',
    name: 'Áo Gym Cổ Tròn Đen Phối Sườn Trắng Athletic Fit',
    description: 'Dải phối trắng bên sườn tạo hiệu ứng thon gọn vóc dáng, tôn đường cơ bắp khỏe khoắn.',
  },
  {
    id: 'mag11-uniaos',
    code: 'MAG11-UNIAO05',
    subCode: '(Áo đường trần ko rõ)',
    image: '/mockup/tshirt-mag11-gag11.jpg',
    name: 'Áo Gym Xanh Navy Đường Trần Chỉ Nổi Flatlock',
    description: 'Kỹ thuật may đường trần chỉ đè flatlock chống ma sát, co giãn 4 chiều cực kỳ dễ chịu.',
  },
  {
    id: 'mag7-gag7',
    code: 'MAG7-GAG7',
    image: '/mockup/tshirt-mag7-gag7.jpg',
    name: 'Áo Gym Thân Trắng Phối Tay Raglan Đen',
    description: 'Phối màu đối lập tương phản nổi bật, hiện đại và vô cùng thể thao.',
  },
  {
    id: 'mag5-gag5',
    code: 'MAG5-GAG5',
    image: '/mockup/tshirt-mag5-gag5.jpg',
    name: 'Áo Gym Thân Đỏ Phối Tay Raglan Trắng',
    description: 'Tông đỏ thương hiệu năng động, nhiệt huyết, thúc đẩy tinh thần tập luyện bứt phá.',
  },
  {
    id: 'mag14-gag14',
    code: 'MAG14-GAG14',
    isRedCode: true,
    image: '/mockup/tshirt-mag14-gag14.jpg',
    name: 'Đồng Phục PT Đôi Nam Nữ Đen Phối Viền Trắng',
    description: 'Hình ảnh mẫu thực tế phòng tập - Form dáng ôm vừa vặn, chuyên nghiệp và chỉn chu.',
  },
  {
    id: 'mag15-gag15',
    code: 'MAG15-GAG15',
    isRedCode: true,
    image: '/mockup/tshirt-mag15-gag15.jpg',
    name: 'Đồng Phục HLV Đen Phối Dải Sườn Đỏ Nổi Bật',
    description: 'Điểm nhấn phối màu đỏ thương hiệu mạnh mẽ, thu hút ánh nhìn ngay trên sàn tập.',
  },
  {
    id: 'mag28-gag28',
    code: 'MAG28-GAG28',
    isRedCode: true,
    image: '/mockup/tshirt-mag28-gag28.jpg',
    name: 'Bộ Đồng Phục Đỏ & Đen Cho Fitness Center & Kickfit',
    description: 'Chất liệu vải UNI DRY thoát ẩm nhanh chóng, thoáng nhẹ tối đa cho cường độ vận động cao.',
  },
  {
    id: 'mag19-gag19',
    code: 'MAG19-GAG19',
    image: '/mockup/tshirt-mag19-gag19.jpg',
    name: 'Đồng Phục Đen Toàn Bộ Goldmark Fitness',
    description: 'Màu đen quyền lực, lịch sự, giấu mồ hôi tốt và tôn dáng chuẩn Athletic Fit.',
  },
  {
    id: 'mag20-gag20',
    code: 'MAG26-GAG26',
    isRedCode: true,
    image: '/mockup/tshirt-mag26-gag26.png',
    name: 'Áo Gym Đen Phối Vai Cam Năng Động (Mẫu Mới)',
    description: 'Mẫu thiết kế thử nghiệm mới nhất - Phối màu cam tươi sáng mang phong cách trẻ trung.',
  },
];

const UniformStylesComponent = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [contactPopupOpen, setContactPopupOpen] = useState(false);
  const [contactSource, setContactSource] = useState('Tư vấn kiểu dáng áo UNIVI');
  const modalRef = useRef(null);

  const handleOpenConsult = (productName) => {
    setContactSource(productName || 'Tư vấn mẫu áo Gym cổ tròn Univi');
    setContactPopupOpen(true);
  };

  return (
    <div className="relative w-full mx-auto bg-white  font-sans text-slate-800">
      {/* Hero Models Group Photo Banner with Integrated Tag */}
      <div className="relative w-full rounded-b-3xl md:rounded-b-[36px] rounded-t-none overflow-hidden shadow-xs mb-6 sm:mb-8 bg-slate-50 border border-slate-100">
        {/* Top-Left Banner Tag */}
        <div className="absolute hidden md:block top-0 left-0 z-20 inline-flex items-center px-5 sm:px-8 md:px-10 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#0e3a68] via-[#105d97] to-[#3898ce] text-white rounded-br-[32px] md:rounded-br-[42px] shadow-sm">
          <h1 className="text-base  sm:text-2xl md:text-[28px] font-black uppercase tracking-wider text-white">
            KIỂU DÁNG ÁO UNIVI
          </h1>
        </div>


        {/* Center Hero Image */}
        <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] md:aspect-[16/7] min-h-[220px]">
          <Image
            src="/mockup/mau-ao-gym-co-tron-ko-khoa.png"
            alt="Kiểu dáng áo Gym UNIVI - Các mẫu áo gym cổ tròn không khoá"
            fill
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="object-cover object-center transition-transform duration-700"
            priority
          />
        </div>
      </div>

      {/* Content Container (Centered & Balanced) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3. Section Title & Subtitle */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg  md:text-3xl font-bold uppercase tracking-wide text-[#105d97] mb-1">
            CÁC MẪU ÁO GYM CỔ TRÒN KHÔNG KHOÁ
          </h2>
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-slate-400 uppercase">
            UNICORE TRAINING COLLECTION
          </p>
        </div>

        {/* 4. Product Grid (10 Items) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-10">
          {PRODUCTS.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedProduct(item)}
              className="group flex flex-col items-center cursor-pointer bg-white rounded-xl p-2 sm:p-3  transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Product Image Box */}
              <div className="relative w-full aspect-[4/3]  overflow-hidden mb-2 flex items-center justify-center">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Code Label */}
              <div className="text-center">
                <span className={`text-xs sm:text-sm font-extrabold uppercase tracking-wider ${item.isRedCode || item.code === 'CHƯA CÓ TÊN' ? 'text-red-600' : 'text-slate-700 group-hover:text-[#105d97]'
                  }`}>
                  {item.code}
                </span>
                {item.subCode && (
                  <p className="text-[10px] sm:text-xs font-semibold text-red-600 leading-tight">
                    {item.subCode}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 5. Customization Footer Notes (Giống hệt ảnh mẫu) */}
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

        {/* 6. Bottom Contact Gradient Bar (Giống hệt ảnh mẫu) */}
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
              <div className="relative w-full aspect-[4/3]  overflow-hidden">
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
      )
      }

      {/* Contact Form Popup */}
      {
        contactPopupOpen && (
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
        )
      }
    </div >
  );
};

export default React.memo(UniformStylesComponent);
