import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '../header/ContactForm';
import { FaTimes, FaStar, FaPhoneAlt, FaFire, FaCheckCircle, FaChevronLeft, FaChevronRight, FaExpand, } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

function Card1VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatVideoTime = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const rest = Math.floor(seconds % 60);
    return `${minutes}:${rest.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      if (!video.duration) return;
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
    };
    const updateDuration = () => {
      setDuration(video.duration || 0);
      updateTime();
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    if (video.readyState >= 1) updateDuration();

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [src]);

  const togglePlay = (e) => {
    e?.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => { });
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e?.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const handleSeek = (event) => {
    event.stopPropagation();
    const video = videoRef.current;
    const value = Number(event.target.value);
    setProgress(value);

    if (!video || !video.duration) return;
    video.currentTime = (value / 100) * video.duration;
    setCurrentTime(video.currentTime);
  };

  return (
    <div className="relative w-full h-full rounded-xl lg:rounded-2xl overflow-hidden group/video bg-[#0a0a0a]" onClick={(e) => e.stopPropagation()}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted={muted}
        playsInline
        onClick={togglePlay}
        className="w-full h-full object-cover rounded-xl lg:rounded-2xl cursor-pointer block"
      />

      {/* Center Play Button when paused */}
      {!playing && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Phát video"
          className="absolute inset-0 z-10 flex items-center justify-center border-0 bg-transparent p-0 cursor-pointer"
        >
          <span className="flex h-8 w-12 sm:h-11 sm:w-16 items-center justify-center rounded-lg sm:rounded-xl bg-[#FF0000]/70 shadow-lg transition-transform duration-300 group-hover/video:scale-110">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="white">
              <polygon points="6,4 20,12 6,20" />
            </svg>
          </span>
        </button>
      )}

      {/* Controls overlay */}
      <div
        onClick={(event) => event.stopPropagation()}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 opacity-0 transition-opacity duration-200 group-hover/video:opacity-100 group-hover:opacity-100 group-focus-within/video:opacity-100"
      >
        <div className="pointer-events-auto absolute inset-x-0 bottom-0 h-4">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/40">
            <div
              className="h-full bg-red-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div
            className="absolute bottom-0 h-2.5 w-2.5 sm:h-3 sm:w-3 translate-y-1/2 rounded-full bg-red-500 shadow"
            style={{ left: `calc(${progress}% - 5px)` }}
          />
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onInput={handleSeek}
            onChange={handleSeek}
            aria-label="Tua video"
            className="absolute inset-x-0 bottom-[-6px] m-0 h-6 w-full cursor-pointer opacity-0"
          />
        </div>

        <div
          className="pointer-events-auto flex items-center gap-2 sm:gap-3 px-2 sm:px-3 pb-2 sm:pb-3 pt-6 sm:pt-8"
          style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.72))" }}
        >
          {/* Play / Pause */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Tạm dừng" : "Phát"}
            className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border-0 flex items-center justify-center cursor-pointer backdrop-blur-sm bg-white/20 hover:bg-white/35 transition-colors"
          >
            {playing ? (
              // Pause icon
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="white">
                <rect x="5" y="3" width="4" height="18" rx="1" />
                <rect x="15" y="3" width="4" height="18" rx="1" />
              </svg>
            ) : (
              // Play icon
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="white">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>

          {/* Mute / Unmute */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Bật tiếng" : "Tắt tiếng"}
            className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border-0 flex items-center justify-center cursor-pointer backdrop-blur-sm bg-white/20 hover:bg-white/35 transition-colors"
          >
            {muted ? (
              // Muted icon
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              // Sound icon
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>

          <span className="ml-auto whitespace-nowrap text-[10px] sm:text-xs tabular-nums text-white/80">
            {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CategoryFeaturedProduct({ product, sectionTitle }) {
  if (!product) return null;

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [card1MediaIdx, setCard1MediaIdx] = useState(0);
  const [card2ImgIdx, setCard2ImgIdx] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [fullscreenMedia, setFullscreenMedia] = useState(null);
  const [imageError, setImageError] = useState({});

  const cfg = product.featuredConfig || {};
  const colors = Array.isArray(product.colors) ? product.colors : [];
  const selectedColor = colors[selectedColorIdx] || null;

  // Card 2 (Center Card) Image List from Product Colors & Gallery
  let card2ImagesList = [];
  if (colors.length > 0) {
    colors.forEach((c, idx) => {
      if (c.image && !card2ImagesList.some(i => i.url === c.image)) {
        card2ImagesList.push({ url: c.image, colorIdx: idx });
      }
    });
  }
  if (Array.isArray(product.gallery) && product.gallery.length > 0) {
    product.gallery.forEach(img => {
      const url = typeof img === 'string' ? img : img?.src;
      if (url && !card2ImagesList.some(i => i.url === url)) {
        card2ImagesList.push({ url, colorIdx: -1 });
      }
    });
  }
  if (card2ImagesList.length === 0 && product.image) {
    card2ImagesList.push({ url: product.image, colorIdx: -1 });
  }

  // Auto-slide Card 2 every 5 seconds
  useEffect(() => {
    if (card2ImagesList.length <= 1) return;
    const timer = setInterval(() => {
      setCard2ImgIdx((prev) => {
        const nextIdx = (prev + 1) % card2ImagesList.length;
        const item = card2ImagesList[nextIdx];
        if (item && item.colorIdx >= 0) {
          setSelectedColorIdx(item.colorIdx);
        }
        return nextIdx;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [card2ImagesList.length]);

  const currentCard2Image = card2ImagesList[card2ImgIdx % card2ImagesList.length] || card2ImagesList[0];
  const displayMainImage = currentCard2Image?.url || selectedColor?.image || product.image || '/images/placeholder.jpg';

  const handlePrevCard2 = (e) => {
    e.stopPropagation();
    const newIdx = (card2ImgIdx - 1 + card2ImagesList.length) % card2ImagesList.length;
    setCard2ImgIdx(newIdx);
    const item = card2ImagesList[newIdx];
    if (item && item.colorIdx >= 0) {
      setSelectedColorIdx(item.colorIdx);
    }
  };

  const handleNextCard2 = (e) => {
    e.stopPropagation();
    const newIdx = (card2ImgIdx + 1) % card2ImagesList.length;
    setCard2ImgIdx(newIdx);
    const item = card2ImagesList[newIdx];
    if (item && item.colorIdx >= 0) {
      setSelectedColorIdx(item.colorIdx);
    }
  };

  const handleSelectColor = (idx) => {
    setSelectedColorIdx(idx);
    const targetImg = colors[idx]?.image;
    if (targetImg) {
      const foundIdx = card2ImagesList.findIndex(i => i.url === targetImg);
      if (foundIdx !== -1) {
        setCard2ImgIdx(foundIdx);
      }
    }
  };

  const displayTitle = cfg.customTitle || product.name;
  const displaySubtitle = cfg.customSubtitle || product.categoryNameVN || 'Stylish Polo';
  const displayDescription = cfg.customDescription || product.description;
  const customBadgeText = cfg.badgeText || '';

  // Card 1 (Left Card): Independent Media List (Video / Fixed Images)
  let card1MediaList = [];

  if (cfg.videoUrl) {
    card1MediaList.push({ type: 'video', url: cfg.videoUrl });
  }

  if (cfg.customSecondaryImage) {
    const customImgs = cfg.customSecondaryImage.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    customImgs.forEach(img => {
      if (!card1MediaList.some(m => m.url === img)) {
        card1MediaList.push({ type: 'image', url: img });
      }
    });
  }

  // Fallback to gallery, product colors, or main image ONLY if card1MediaList is empty
  if (card1MediaList.length === 0) {
    if (Array.isArray(product.gallery) && product.gallery.length > 0) {
      product.gallery.forEach(img => {
        const url = typeof img === 'string' ? img : img?.src;
        if (url && !card1MediaList.some(m => m.url === url)) {
          card1MediaList.push({ type: 'image', url });
        }
      });
    } else if (colors.length > 0) {
      colors.forEach(c => {
        if (c.image && !card1MediaList.some(m => m.url === c.image)) {
          card1MediaList.push({ type: 'image', url: c.image });
        }
      });
    } else if (product.image) {
      card1MediaList.push({ type: 'image', url: product.image });
    } else {
      card1MediaList.push({ type: 'image', url: '/images/placeholder.jpg' });
    }
  }

  const currentCard1Media = card1MediaList[card1MediaIdx % card1MediaList.length] || card1MediaList[0];

  const handlePrevCard1 = (e) => {
    e.stopPropagation();
    setCard1MediaIdx(prev => (prev - 1 + card1MediaList.length) % card1MediaList.length);
  };

  const handleNextCard1 = (e) => {
    e.stopPropagation();
    setCard1MediaIdx(prev => (prev + 1) % card1MediaList.length);
  };

  const openFullscreenCard1 = (e) => {
    e?.stopPropagation();
    if (currentCard1Media) {
      setFullscreenMedia({ type: currentCard1Media.type, url: currentCard1Media.url, source: 'card1' });
    }
  };

  const openFullscreenCard2 = (e) => {
    e?.stopPropagation();
    if (displayMainImage) {
      setFullscreenMedia({ type: 'image', url: displayMainImage, source: 'card2' });
    }
  };

  const soldCount = cfg.soldCount || '1.500+ sản phẩm';
  const recentCustomersRaw = cfg.recentCustomers || 'California Fitness | /feedback/california-fitness, VNPay | https://vnpay.vn, Techcombank';

  // Parse recent customers list (Format: Name | Link)
  const recentCustomersList = recentCustomersRaw
    ? recentCustomersRaw
      .split(/[\n,]+/)
      .map((item) => {
        const parts = item.split('|');
        const name = parts[0]?.trim() || '';
        const link = parts[1]?.trim() || '';
        return { name, link };
      })
      .filter((c) => c.name)
    : [];

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder.jpg';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    if (imagePath.startsWith('/')) return imagePath;
    return `/${imagePath}`;
  };

  const discount = product.discount || (
    product.maxPrice && product.maxPrice > product.price
      ? Math.round(((product.maxPrice - product.price) / product.maxPrice) * 100)
      : 0
  );

  return (
    <section className="px-4 py-4 md:py-6 bg-white">
      <div className="container mx-auto">

        {/* 3-Column Layout: 2 Image Cards side-by-side on mobile, 3 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-3 sm:gap-4 md:gap-5 lg:gap-6 items-stretch">
          {/* Column 1: Left Card - Independent Video / Multi-Image Slider with Fullscreen Popup */}
          <div
            onClick={openFullscreenCard1}
            className="col-span-1 md:col-span-4 rounded-xl lg:rounded-2xl relative flex items-center justify-center aspect-[4/5] min-h-[200px] sm:min-h-[280px] md:min-h-[440px] group overflow-hidden cursor-pointer bg-[#f3f3f5] border border-gray-200 shadow-sm"
          >
            {/* Card 1 Media (Video or Image) */}
            {currentCard1Media?.type === 'video' ? (
              <Card1VideoPlayer key={currentCard1Media.url} src={currentCard1Media.url} />
            ) : (
              <Image
                src={imageError[`sec_${card1MediaIdx}`] ? '/images/placeholder.jpg' : getImageUrl(currentCard1Media?.url)}
                alt={`${displayTitle} preview`}
                fill
                className="object-cover rounded-xl lg:rounded-2xl transition-transform duration-500 group-hover:scale-105"
                onError={() => setImageError(prev => ({ ...prev, [`sec_${card1MediaIdx}`]: true }))}
                unoptimized={getImageUrl(currentCard1Media?.url).startsWith('http')}
              />
            )}

            {/* Left Navigation Arrow */}
            {card1MediaList.length > 1 && (
              <button
                type="button"
                onClick={handlePrevCard1}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md"
                aria-label="Hình/Video trước"
              >
                <FaChevronLeft size={12} />
              </button>
            )}

            {/* Right Navigation Arrow */}
            {card1MediaList.length > 1 && (
              <button
                type="button"
                onClick={handleNextCard1}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md"
                aria-label="Hình/Video tiếp theo"
              >
                <FaChevronRight size={12} />
              </button>
            )}

            {/* Expand / Fullscreen Button on bottom right (Opens Lightbox Popup) */}
            <button
              type="button"
              onClick={openFullscreenCard1}
              className="absolute bottom-4 right-4 z-30 w-9 h-9 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-md"
              title="Xem phóng to dạng Lightbox"
            >
              <FaExpand size={13} />
            </button>

            {/* Card 1 Dots Indicator (Max 3 dots) */}
            {card1MediaList.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {card1MediaList.slice(0, 3).map((_, idx) => {
                  const activeDotIdx = card1MediaList.length <= 3
                    ? card1MediaIdx
                    : card1MediaIdx % 3;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setCard1MediaIdx(idx); }}
                      className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${activeDotIdx === idx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                      aria-label={`Chuyển sang slide ${idx + 1}`}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Column 2: Center Card - Main Product Image (Responds to Color Selection & Slider Arrows) */}
          <div
            onClick={openFullscreenCard2}
            className="col-span-1 md:col-span-4 rounded-xl lg:rounded-2xl relative flex items-center justify-center aspect-[4/5] min-h-[200px] sm:min-h-[280px] md:min-h-[440px] group overflow-hidden cursor-pointer bg-[#f3f3f5] border border-gray-200 shadow-sm"
          >
            {/* Expand / Fullscreen Button on bottom right (Visible on Hover) */}
            <button
              type="button"
              onClick={openFullscreenCard2}
              className="absolute bottom-4 right-4 z-20 w-9 h-9 bg-black/60 hover:bg-black/90 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-md"
              title="Mở xem ảnh phóng to"
            >
              <FaExpand size={13} />
            </button>

            {/* Left Navigation Arrow */}
            {card2ImagesList.length > 1 && (
              <button
                type="button"
                onClick={handlePrevCard2}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md"
                aria-label="Ảnh sản phẩm trước"
              >
                <FaChevronLeft size={12} />
              </button>
            )}

            <Image
              src={imageError['main'] ? '/images/placeholder.jpg' : getImageUrl(displayMainImage)}
              alt={displayTitle}
              fill
              className="object-cover rounded-xl lg:rounded-2xl transition-transform duration-500 group-hover:scale-105"
              priority
              onError={() => setImageError(prev => ({ ...prev, main: true }))}
              unoptimized={getImageUrl(displayMainImage).startsWith('http')}
            />

            {/* Right Navigation Arrow */}
            {card2ImagesList.length > 1 && (
              <button
                type="button"
                onClick={handleNextCard2}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md"
                aria-label="Ảnh sản phẩm tiếp theo"
              >
                <FaChevronRight size={12} />
              </button>
            )}

            {/* Card 2 Dots Indicator */}
            {card2ImagesList.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {card2ImagesList.slice(0, 3).map((_, idx) => {
                  const activeDotIdx = card2ImagesList.length <= 3
                    ? card2ImgIdx
                    : card2ImgIdx % 3;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCard2ImgIdx(idx);
                        if (card2ImagesList[idx]?.colorIdx >= 0) setSelectedColorIdx(card2ImagesList[idx].colorIdx);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${activeDotIdx === idx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                      aria-label={`Chuyển sang ảnh ${idx + 1}`}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Column 3: Right Section - Product Details */}
          <div className="col-span-2 md:col-span-4 flex flex-col justify-start py-1 lg:py-2 px-1">
            <div className="flex flex-col gap-2.5">
              {/* Title */}
              <Link href={`/san-pham/${product.slug}`} legacyBehavior>
                <a className="hover:text-[#2563eb] transition-colors">
                  <h3 className="text-lg md:text-xl font-black text-gray-900 tracking-tight leading-snug">
                    {displayTitle}
                  </h3>
                </a>
              </Link>

              {/* Description */}
              {displayDescription && (
                <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed ">
                  {displayDescription}
                </p>
              )}

              {/* Rating, SKU & Sold Count */}
              <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap mt-0.5">
                {product.maSanPham && (
                  <span className="text-xs text-gray-500 font-medium border-l border-gray-300 pl-2">
                    SKU: {product.maSanPham}
                  </span>
                )}
                {soldCount && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full ml-auto shadow-sm">
                    <FaFire size={11} className="text-red-500" />
                    Đã bán: {soldCount}
                  </span>
                )}
              </div>


              {/* Color Selector */}
              {colors.length > 0 && (
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm font-semibold text-gray-700 w-12 flex-shrink-0 whitespace-nowrap ">
                    Màu sắc:
                  </span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {colors.map((color, idx) => {
                      const hex1 = color.hex || '#000000';
                      const hex2 = color.hex2 || hex1;
                      const isSplit = hex2 !== hex1;
                      const isWhite = !isSplit && (hex1.toLowerCase() === '#ffffff' || hex1.toLowerCase() === '#fff');
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectColor(idx)}
                          aria-label={`Chọn màu ${color.name}`}
                          title={color.name}
                          className={`w-6 h-6 rounded-full p-[2px] border transition-all ${selectedColorIdx === idx
                            ? 'border-[#2563eb] ring-2 ring-[#2563eb]/30 scale-105'
                            : 'border-gray-200 hover:border-gray-400'
                            }`}
                        >
                          <div
                            className="w-full h-full rounded-full"
                            style={{
                              background: isSplit
                                ? `linear-gradient(90deg, ${hex1} 50%, ${hex2} 50%)`
                                : hex1,
                              border: isWhite ? '1px solid #d1d5db' : 'none',
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recent Customers List */}
              {recentCustomersList.length > 0 && (
                <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                    Khách hàng đã đặt sản phẩm này:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {recentCustomersList.map((customer, idx) => {
                      if (customer.link) {
                        const isExternal = customer.link.startsWith('http://') || customer.link.startsWith('https://');
                        return (
                          <a
                            key={idx}
                            href={customer.link}
                            target={isExternal ? '_blank' : '_self'}
                            rel={isExternal ? 'noopener noreferrer' : ''}
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#2563eb] bg-blue-50/90 hover:bg-blue-100 hover:text-blue-800 px-3 py-1 rounded-full border border-blue-200 shadow-sm transition-all cursor-pointer group"
                            title={`Xem thông tin / bài viết về ${customer.name}`}
                          >
                            <FaCheckCircle size={10} className="text-[#2563eb]" />
                            <span>{customer.name}</span>
                            <FiExternalLink size={10} className="text-blue-400 group-hover:text-blue-600 ml-0.5" />
                          </a>
                        );
                      }
                      return (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-gray-200"
                        >
                          <FaCheckCircle size={10} className="text-gray-400" />
                          <span>{customer.name}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Action Row: Full-width Contact Order Button */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="w-full bg-[#105d97] hover:bg-[#105d97]/90 text-white font-bold px-6 py-3 rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 text-sm md:text-base whitespace-nowrap"
                >
                  <FaPhoneAlt size={14} />
                  <span>Liên hệ đặt hàng</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Media Lightbox Popup */}
      {fullscreenMedia && (
        <div
          className="fixed inset-0 bg-black/95 sm:bg-black/90 backdrop-blur-md z-[9999999] flex items-center justify-center p-0 sm:p-4 select-none"
          onClick={() => setFullscreenMedia(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setFullscreenMedia(null)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 w-10 h-10 sm:w-11 sm:h-11 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
            aria-label="Đóng xem phóng to"
          >
            <FaTimes size={20} />
          </button>

          {/* Media Content */}
          {fullscreenMedia?.source === 'card2' ? (
            <div className="relative w-full h-full sm:h-[85vh] sm:max-w-5xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              {/* Lightbox Left Nav Arrow for Card 2 */}
              {card2ImagesList.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handlePrevCard2(e); }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 text-white w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xl"
                  aria-label="Ảnh trước"
                >
                  <FaChevronLeft size={18} />
                </button>
              )}

              <Image
                key={displayMainImage}
                src={getImageUrl(displayMainImage)}
                alt={displayTitle}
                fill
                style={{ objectFit: 'contain' }}
                className="sm:rounded-xl shadow-2xl transition-all duration-300"
                unoptimized={getImageUrl(displayMainImage).startsWith('http')}
              />

              {/* Lightbox Right Nav Arrow for Card 2 */}
              {card2ImagesList.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleNextCard2(e); }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 text-white w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xl"
                  aria-label="Ảnh tiếp theo"
                >
                  <FaChevronRight size={18} />
                </button>
              )}

              {/* Lightbox Dots Indicator for Card 2 (Max 3 dots) */}
              {card2ImagesList.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md">
                  {card2ImagesList.slice(0, 3).map((_, idx) => {
                    const activeDotIdx = card2ImagesList.length <= 3
                      ? card2ImgIdx
                      : card2ImgIdx % 3;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCard2ImgIdx(idx);
                          if (card2ImagesList[idx]?.colorIdx >= 0) setSelectedColorIdx(card2ImagesList[idx].colorIdx);
                        }}
                        className={`w-1 h-1 md:w-2 md:h-2 rounded-full transition-all ${activeDotIdx === idx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                        aria-label={`Chuyển sang ảnh ${idx + 1}`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Lightbox Left Nav Arrow */}
              {card1MediaList.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handlePrevCard1(e); }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 text-white w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xl"
                  aria-label="Hình/Video trước"
                >
                  <FaChevronLeft size={18} />
                </button>
              )}

              {currentCard1Media?.type === 'video' ? (
                <div className="relative w-full h-[82vh] sm:h-[85vh] max-w-[360px] sm:max-w-md aspect-[9/16] flex items-center justify-center bg-black overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <Card1VideoPlayer key={currentCard1Media.url} src={currentCard1Media.url} />
                </div>
              ) : (
                <div className="relative w-full h-full sm:h-[85vh] sm:max-w-5xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                  <Image
                    key={currentCard1Media?.url}
                    src={getImageUrl(currentCard1Media?.url)}
                    alt={displayTitle}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="sm:rounded-xl shadow-2xl transition-all duration-300"
                    unoptimized={getImageUrl(currentCard1Media?.url).startsWith('http')}
                  />
                </div>
              )}

              {/* Lightbox Right Nav Arrow */}
              {card1MediaList.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleNextCard1(e); }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 text-white w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xl"
                  aria-label="Hình/Video tiếp theo"
                >
                  <FaChevronRight size={18} />
                </button>
              )}

              {/* Lightbox Dots Indicator */}
              {card1MediaList.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full">
                  {card1MediaList.slice(0, 3).map((_, idx) => {
                    const activeDotIdx = card1MediaList.length <= 3
                      ? card1MediaIdx
                      : card1MediaIdx % 3;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setCard1MediaIdx(idx); }}
                        className={`w-2 h-2 rounded-full transition-all ${activeDotIdx === idx ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/80'}`}
                        aria-label={`Chuyển sang slide ${idx + 1}`}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Contact / Order Modal */}
      {contactOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4"
          onClick={() => setContactOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-[#2563eb] font-bold text-base md:text-lg tracking-wide uppercase text-center flex-1">
                Liên hệ đặt hàng & Nhận báo giá
              </h3>
              <button
                onClick={() => setContactOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Đóng"
              >
                <FaTimes size={18} />
              </button>
            </div>
            <ContactForm
              source={`Item of the Week: ${displayTitle} (Màu: ${selectedColor?.name || 'Mặc định'})`}
            />
          </div>
        </div>
      )}
    </section>
  );
}
