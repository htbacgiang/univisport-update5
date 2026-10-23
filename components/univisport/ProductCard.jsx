import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductQuickViewModal from './ProductQuickViewModal';

const ProductCard = ({ id, name, description, price, maxPrice, discount, isNew, isFeatured, colors = [], image, slug, layout = 'grid' }) => {
  const [imageError, setImageError] = useState(false);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const mainImage = colors.length > 0 ? (colors[0]?.image || image) : image;
  const selectedColor = colors[selectedColorIdx] || null;
  const selectedColorImage = selectedColor?.image || mainImage;
  const allImages = colors;

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder.jpg';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    if (imagePath.startsWith('/')) return imagePath;
    return `/${imagePath}`;
  };

  const handleColorChange = (idx) => {
    setSelectedColorIdx(idx);
    setImageError(false);
  };

  const formatPrice = (price) => {
    if (!price || price <= 0) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const currentImageUrl = getImageUrl(selectedColorImage || mainImage);

  return (
    <>
      <div
        className="group flex flex-col gap-3 md:gap-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <Link href={`/san-pham/${slug}`} legacyBehavior>
          <a className="relative w-full aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl block">
            <Image
              src={imageError ? '/images/placeholder.jpg' : currentImageUrl}
              alt={name}
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              className="transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 260px, (max-width: 1024px) 300px, 320px"
              onError={handleImageError}
              unoptimized={currentImageUrl.startsWith('http://') || currentImageUrl.startsWith('https://')}
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Discount Badge - top left */}
            {discount > 0 && price > 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold rounded-full w-10 h-10 flex items-center justify-center z-10">
                - {discount}%
              </div>
            )}

            {/* Action Icons - top right */}
            <div className="absolute top-2 right-2 md:top-3 md:right-3 opacity-80 group-hover:opacity-100 flex flex-col gap-2 z-10">
              <button
                className="md:w-8 md:h-8 h-6 w-6 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Xem trước"
                onClick={(e) => { e.preventDefault(); setShowQuickView(true); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="#374151" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

          </a>
        </Link>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Price */}
          <span className="text-sm text-gray-400 font-normal mb-0.5">Giá tham khảo</span>
          <div className="flex items-baseline gap-1.5 flex-wrap mb-1 md:mb-1.5">
            <span className="text-base font-bold text-red-500 tracking-tight">
              {formatPrice(price)}
            </span>
            {price > 0 && maxPrice > 0 && maxPrice > price && (
              <span className="text-sm text-gray-400 line-through font-normal">
                {formatPrice(maxPrice)}
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link href={`/san-pham/${slug}`} legacyBehavior>
            <a>
              <h3 className="text-[15px] md:text-base font-bold text-gray-900 line-clamp-2 mb-2 md:mb-2 hover:text-[#105d97] transition-colors cursor-pointer leading-6">
                {name}
              </h3>
            </a>
          </Link>

          {/* Color Options */}
          <div className="flex md:gap-2 gap-1 flex-wrap">
            {allImages.length > 0 && allImages.slice(0, 6).map((color, index) => {
              const hex1 = color.hex || '#cccccc';
              const hex2 = color.hex2 || hex1;
              const isSplit = hex2 !== hex1;
              const isWhite = !isSplit && (hex1.toLowerCase() === '#ffffff' || hex1.toLowerCase() === '#fff');
              return (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    handleColorChange(index);
                  }}
                  className={`w-[22px] h-[22px] md:w-[26px] md:h-[26px] rounded-full p-[1px] md:p-[2px] transition-all duration-300 border overflow-hidden ${selectedColorIdx === index
                    ? 'border-[#f2b94c]'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                  title={color.name}
                  aria-label={`Chọn màu ${color.name}`}
                >
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      background: isSplit
                        ? `linear-gradient(90deg, ${hex1} 50%, ${hex2} 50%)`
                        : hex1,
                      border: isWhite ? '1px solid #e5e7eb' : 'none',
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {showQuickView && (
        <ProductQuickViewModal slug={slug} onClose={() => setShowQuickView(false)} />
      )}

    </>
  );
};

export default ProductCard;