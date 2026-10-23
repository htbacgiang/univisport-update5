import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';



const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await axios.get('/api/sidebar-banners?visible=true');
        if (data.banners && data.banners.length > 0) {
          setBanners(data.banners);
        }
      } catch (err) {
        console.error('Failed to load sidebar banners:', err);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [banners]);

  if (banners.length === 0) return null;

  return (
    <div className="mt-4 hidden md:block">
      <div className="relative w-full min-h-[450px] overflow-hidden rounded-lg">
        {banners.map((banner, index) => {
          const imgUrl = banner.image || banner.src;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100' : 'opacity-0'
                }`}
            >
              {banner.link ? (
                <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block relative w-full h-full min-h-[400px]">
                  <Image
                    src={imgUrl}
                    alt={banner.alt || ''}
                    fill
                    className="w-full h-full object-fill"
                    priority={index === 0}
                  />
                </a>
              ) : (
                <Image
                  src={imgUrl}
                  alt={banner.alt || ''}
                  fill
                  className="w-full h-full object-fill"
                  priority={index === 0}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BannerCarousel;