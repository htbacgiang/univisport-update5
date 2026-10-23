import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ContactForm from '../header/ContactForm';
import { FaTimes, FaTag, FaCheck } from 'react-icons/fa';
import { FiPrinter, FiDroplet, FiPenTool, FiBox, FiSave, FiEdit2 } from 'react-icons/fi';
import { GiSewingMachine } from 'react-icons/gi';
import { ENTERPRISE_FLAT_SLUGS } from '../../lib/enterpriseFlatSlugs';

const SIZE_GUIDE_BY_SHIRT_TYPE = {
  'ao-thun': {
    label: 'Áo thun',
    image: '/images/bang-size-ao-thun.jpg',
  },
  'ao-polo': {
    label: 'Áo polo',
    image: '/images/bang-size-ao-polo.jpg',
  },
};

const normalizeShirtType = (product) => {
  const rawType = product?.shirtType || product?.loaiAo || '';
  const normalized = rawType
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, '-');

  if (['ao-thun', 'thun', 't-shirt', 'tshirt'].includes(normalized)) return 'ao-thun';
  if (['ao-polo', 'polo'].includes(normalized)) return 'ao-polo';
  return '';
};

export default function ProductQuickViewModal({ slug, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [contactOpen, setContactOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const mainSwiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null);
  const overlayRef = useRef(null);

  const router = useRouter();
  const currentPath = router?.asPath || '';

  const hideStandardSize = useMemo(() => {
    const categorySlug = (product?.category || '').toLowerCase().replace(/\s+/g, '-');
    const flatSlug = ENTERPRISE_FLAT_SLUGS[product?.productLine];
    return (
      product?.productLine === 'phu-kien' ||
      categorySlug === 'phu-kien-qua-tang-doanh-nghiep' ||
      flatSlug === 'phu-kien-qua-tang-doanh-nghiep' ||
      product?.category === 'phu-kien-qua-tang-doanh-nghiep' ||
      currentPath.includes('phu-kien-qua-tang-doanh-nghiep')
    );
  }, [product, currentPath]);

  const sizeGuide = useMemo(() => {
    const shirtType = normalizeShirtType(product);
    return SIZE_GUIDE_BY_SHIRT_TYPE[shirtType] || null;
  }, [product]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.product) setProduct(data.product);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [onClose]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder.jpg';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    if (imagePath.startsWith('/')) return imagePath;
    return `/${imagePath}`;
  };

  const updateSwipers = (index) => {
    setActiveIndex(index);
    if (mainSwiperRef.current) mainSwiperRef.current.slideToLoop(index);
    if (thumbsSwiperRef.current) thumbsSwiperRef.current.slideTo(index);
  };

  const handleThumbnailNavigation = (direction) => {
    const len = images.length || 1;
    const newIndex = direction === 'next'
      ? (activeIndex + 1) % len
      : (activeIndex - 1 + len) % len;
    updateSwipers(newIndex);
  };

  const handleColorSelect = (idx) => {
    setSelectedColorIndex(idx);
    updateSwipers(idx);
  };

  const images = product?.colors?.length > 0
    ? product.colors.map(c => c.image)
    : ['/images/placeholder.jpg'];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] flex items-center  mt-0 justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          aria-label="Đóng"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-[#105d97] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !product ? (
          <div className="flex items-center justify-center h-64 text-gray-500">Không tìm thấy sản phẩm</div>
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="w-full md:w-1/2 p-3 md:p-6">
              <Swiper
                modules={[Navigation, Thumbs]}
                spaceBetween={10}
                slidesPerView={1}
                loop={images.length > 1}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                onSlideChange={(s) => setActiveIndex(s.realIndex)}
                onSwiper={(s) => (mainSwiperRef.current = s)}
                className="w-full aspect-[3/4] rounded-xl overflow-hidden border border-gray-200"
              >
                {images.map((src, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full aspect-[3/4] bg-gray-50">
                      <Image
                        src={imageErrors[index] ? '/images/placeholder.jpg' : getImageUrl(src)}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        className="rounded-xl"
                        priority={index === 0}
                        onError={() => setImageErrors(p => ({ ...p, [index]: true }))}
                        unoptimized={getImageUrl(src).startsWith('http://') || getImageUrl(src).startsWith('https://')}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {images.length > 1 && (
                <div className="relative mt-3">
                  <Swiper
                    modules={[Navigation, Thumbs]}
                    spaceBetween={8}
                    slidesPerView={4}
                    watchSlidesProgress
                    onSwiper={(s) => { setThumbsSwiper(s); thumbsSwiperRef.current = s; }}
                    className="w-full"
                  >
                    {images.map((src, index) => (
                      <SwiperSlide key={index}>
                        <div
                          className="relative w-full aspect-square cursor-pointer"
                          onClick={() => updateSwipers(index)}
                        >
                          <Image
                            src={imageErrors[index] ? '/images/placeholder.jpg' : getImageUrl(src)}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                            className={`rounded-lg border-2 transition-all ${activeIndex === index ? 'border-[#105d97]' : 'border-gray-200 hover:border-gray-400'}`}
                            loading="lazy"
                            onError={() => setImageErrors(p => ({ ...p, [index]: true }))}
                            unoptimized={getImageUrl(src).startsWith('http://') || getImageUrl(src).startsWith('https://')}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <button
                    type="button"
                    className="thumb-swiper-button-prev absolute top-1/2 left-1 -translate-y-1/2 z-10 bg-white/90 rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-[#105d97] hover:text-white hover:border-[#105d97] transition-all duration-200"
                    onClick={() => handleThumbnailNavigation('prev')}
                    aria-label="Hình ảnh trước"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="thumb-swiper-button-next absolute top-1/2 right-1 -translate-y-1/2 z-10 bg-white/90 rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-[#105d97] hover:text-white hover:border-[#105d97] transition-all duration-200"
                    onClick={() => handleThumbnailNavigation('next')}
                    aria-label="Hình ảnh tiếp theo"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="w-full md:w-1/2 p-3 md:p-6 flex flex-col">
              {/* Name */}
              <h2 className="text-lg font-bold text-[#105d97] leading-6">{product.name}</h2>
              <p className="text-xs text-gray-400 mt-0.5 hidden md:block">{product.maSanPham || `SP${product.id}`}</p>

              <div className="border-t border-gray-200 my-3"></div>

              {/* Price + quick quote */}
              <div className="flex items-center justify-between gap-1.5 sm:gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-bold tracking-wide text-gray-500 uppercase">Giá tham khảo</span>
                  <div className="flex items-baseline gap-1 sm:gap-1.5 flex-nowrap mt-1">
                    {product.price && product.price > 0 ? (
                      <>
                        <span className="text-sm sm:text-base font-semibold text-red-500">Từ</span>
                        <span className="text-lg sm:text-2xl font-bold text-red-500 whitespace-nowrap">
                          {product.price.toLocaleString('vi-VN')}đ
                        </span>
                        {product.unit && (
                          <span className="text-xs sm:text-sm font-normal text-gray-400">/{product.unit}</span>
                        )}
                      </>
                    ) : (
                      <span className="text-lg sm:text-2xl font-bold text-red-500 whitespace-nowrap">
                        Liên hệ
                      </span>
                    )}
                  </div>
                  {product.price > 0 && product.originalPrice > 0 && product.originalPrice > product.price && (
                    <span className="block text-sm text-gray-400 line-through font-normal mt-0.5">
                      {product.originalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="flex items-center gap-1.5 sm:gap-3 self-stretch pl-2 sm:pl-4 border-l border-gray-200 text-left flex-shrink-0"
                >
                  <span className="flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#eaf2fb] text-[#105d97] flex-shrink-0">
                    <FaTag className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                  <span className="whitespace-nowrap">
                    <span className="sm:block text-[11px] sm:text-sm font-bold text-[#105d97]">Bảo giá nhanh</span>{' '}
                    <span className="sm:block text-[9px] sm:text-xs text-[#105d97]">cho dự án của bạn</span>
                  </span>
                </button>
              </div>

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div className="hidden md:block">
                  <div className="border-t border-gray-200 my-3"></div>
                  <span className="text-xs font-bold tracking-wide text-gray-500 uppercase">Màu sắc tiêu chuẩn</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.colors.map((color, idx) => {
                      const hex1 = color.hex || '#cccccc';
                      const hex2 = color.hex2 || hex1;
                      const isSplit = hex2 !== hex1;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleColorSelect(idx)}
                          aria-label={`Chọn màu ${color.name}`}
                          title={isSplit ? `${hex1} / ${hex2}` : hex1}
                          className={`w-9 h-9 rounded-full border-2 shadow-sm transition-all overflow-hidden ${selectedColorIndex === idx ? 'border-[#105d97] ring-2 ring-[#105d97]/30 scale-105' : 'border-gray-200 hover:border-gray-300'}`}
                          style={{
                            background: isSplit
                              ? `linear-gradient(90deg, ${hex1} 50%, ${hex2} 50%)`
                              : hex1,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {!hideStandardSize && (
                <div className='hidden md:block'>
                  <div className="border-t border-gray-200 my-3"></div>
                  <div className="flex items-center justify-between ">
                    <span className="text-xs font-bold tracking-wide text-gray-500 uppercase">Size tiêu chuẩn</span>
                    {sizeGuide && (
                      <button
                        type="button"
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="text-xs text-[#105d97] hover:underline font-medium"
                      >
                        Hướng dẫn chọn size
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 ">
                    {(product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL', '2XL', '3XL']).map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        aria-label={`Chọn size ${size}`}
                        className={`min-w-[40px] h-9 px-3 rounded-full text-sm font-semibold border-2 transition-all ${selectedSize === size ? 'border-[#105d97] text-[#105d97] bg-[#eaf2fb]' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <FaCheck className="w-3 h-3 text-green-500 flex-shrink-0" /> Có thể may theo size riêng
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <FaCheck className="w-3 h-3 text-green-500 flex-shrink-0" /> Hỗ trợ fitting mẫu
                    </span>
                  </div>
                </div>
              )}
              {/* Custom Branding Section */}
              <div className="mt-4 hidden md:block rounded-2xl border border-[#cfe3f2] bg-[#eef5fb] p-4">
                <h3 className="text-sm font-bold text-[#105d97] uppercase tracking-wide mb-3">Thiết kế theo thương hiệu riêng</h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { icon: <FiPrinter className="w-5 h-5" />, label: 'In logo' },
                    { icon: <GiSewingMachine className="w-5 h-5" />, label: 'Thêu logo' },
                    { icon: <FiDroplet className="w-5 h-5" />, label: 'Phối màu thương hiệu' },
                    { icon: <FiPenTool className="w-5 h-5" />, label: 'Thiết kế miễn phí' },
                    { icon: <FiBox className="w-5 h-5" />, label: 'Mockup 3D trước sản xuất' },
                    { icon: <FiSave className="w-5 h-5" />, label: 'Lưu file mẫu tái đặt hàng' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center gap-1.5">
                      <span className="text-[#105d97]">{item.icon}</span>
                      <span className="text-[11px] text-gray-700 leading-6">{item.label}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-[#105d97] hover:bg-[#0e4a7a] text-white font-semibold py-2.5 rounded-full transition-colors duration-200 text-sm"
                >
                  <FiEdit2 className="w-4 h-4" />
                  LIÊN HỆ THIẾT KẾ RIÊNG
                </button>
                <p className="text-center text-xs text-gray-500 mt-2">Đội ngũ thiết kế chuyên nghiệp hỗ trợ 1-1</p>
              </div>


              {/* View full page link */}
              <Link href={`/san-pham/${slug}`} onClick={onClose}
                className="text-center text-sm text-[#105d97] hover:underline mb-3 md:mb-4 mt-2"
              >
                Xem trang chi tiết sản phẩm →
              </Link>
            </div>
          </div>
        )}
      </div>

      {isSizeGuideOpen && sizeGuide && (
        <div
          className="fixed inset-0 z-[9999999] flex items-center justify-center overflow-y-auto overscroll-contain bg-black/70 p-4"
          onClick={(e) => e.target === e.currentTarget && setIsSizeGuideOpen(false)}
        >
          <div className="relative w-full max-w-4xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h2 className="text-base font-semibold text-gray-900">
                Bảng size {sizeGuide.label}
              </h2>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                aria-label="Đóng bảng size"
              >
                <FaTimes />
              </button>
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-b-xl">
              <Image
                src={sizeGuide.image}
                alt={`Bảng size ${sizeGuide.label}`}
                fill
                className="object-contain pb-4"
                sizes="(max-width: 768px) 94vw, 896px"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {contactOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[999999] flex items-center justify-center px-4"
          onClick={() => setContactOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex justify-center items-center p-4 border-b relative">
              <h3 className="text-[#105d97] font-bold text-base md:text-lg tracking-wide uppercase text-center">
                Đăng ký tư vấn đồng phục Univi
              </h3>
              <button
                onClick={() => setContactOpen(false)}
                className="absolute right-4 text-[#105d97] hover:text-[#0d4c7a] transition-colors rounded-full p-1 hover:rotate-90 duration-300"
                aria-label="Đóng"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <ContactForm source={product ? `Quick View: ${product.name}` : `Quick View (${slug})`} />
          </div>
        </div>
      )}
    </div>
  );
}
