import React, { useState, useRef, useEffect } from 'react';
import ProductCard from './ProductCard';
import Link from 'next/link';
const ProductSlider = ({ title, products, viewAllLink }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [products]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 320; // Width of one card + gap
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollPosition, 300);
    }
  };

  return (
    <section className="px-4 py-6 md:py-8 bg-white">
      <div className="container mx-auto px-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">{title}</h2>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-[#105d97] px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300"
            >
              Xem tất cả
            </Link>
          )}
        </div>

        <div className="relative group/slider">
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-[-8px] top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover/slider:opacity-100"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-none w-[calc(45%-4px)] sm:w-[calc(33.333%-6px)] md:w-[280px] lg:w-[300px]">
                <ProductCard {...product} slug={product.slug} layout="slider" />
              </div>
            ))}
          </div>

          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-[-8px] top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover/slider:opacity-100"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ProductSlider;

