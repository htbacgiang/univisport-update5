import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";

interface Category {
  name: string;
  slug: string;
  image: string;
  count: number;
}

const categories: Category[] = [
  {
    name: "Đồng phục Gym",
    slug: "/dong-phuc-gym",
    image: "/product/dong-phuc-pt-gym.jpg",
    count: 7,
  },
  {
    name: "Đồng phục Yoga",
    slug: "/dong-phuc-yoga-pilates",
    image: "/product/dong-phuc-yoga-pillates.jpg",
    count: 5,
  },
  {
    name: "Đồng phục Pilates",
    slug: "/dong-phuc-pilates",
    image: "/product/dong-phuc-pillates.jpg",
    count: 6,
  },
  {
    name: "Đồng phục Áo gió",
    slug: "/dong-phuc-ao-gio",
    image: "/product/ao-gio.jpg",
    count: 4,
  },
  {
    name: "Pickleball",
    slug: "/dong-phuc-pickleball",
    image: "/product/pickleball.jpg",
    count: 4,
  },
  {
    name: "MMA Đồng phục",
    slug: "/dong-phuc-mma",
    image: "/product/mma-dong-phuc.webp",
    count: 3,
  },
  {
    name: "Golf - Tennis",
    slug: "/dong-phuc-golf-tennis",
    image: "/product/goft-tennis.jpg",
    count: 8,
  },
  {
    name: "Polo Doanh nghiệp",
    slug: "/dong-phuc-polo",
    image: "/product/ao-polo.webp",
    count: 6,
  },
  {
    name: "Đồng phục Sơ mi",
    slug: "/dong-phuc-so-mi",
    image: "/product/cong-so.webp",
    count: 5,
  },
  {
    name: "Vest công sở",
    slug: "/dong-phuc-vest-cong-so",
    image: "/product/su-kien.webp",
    count: 4,
  },
  {
    name: "Teambuilding",
    slug: "/dong-phuc-teambuilding",
    image: "/product/team-building.webp",
    count: 6,
  },
  {
    name: "Bảo hộ lao động",
    slug: "/bao-ho-lao-dong",
    image: "/product/bao-ho-lao-dong.webp",
    count: 5,
  },
  {
    name: "Quà tặng - Phụ kiện",
    slug: "/phu-kien-qua-tang-doanh-nghiep",
    image: "/product/qua-tang-doanh-nghiep.png",
    count: 5,
  },
];

// Delay between auto-advances, counted only once a slide has fully settled.
const AUTOPLAY_DELAY_MS = 10000;
// Embla's engine is a damped spring (ramp up, then decelerate), not a CSS
// bezier — at the fixed internal friction (0.68) a duration of 60 settles
// to ~99% of the target in ~2s, giving the same "Apple-like" ease-in-out feel.
const SCROLL_DURATION = 60;

function useAutoplay(emblaApi: EmblaCarouselType | undefined) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback(() => {
    clearTimer();
    if (pausedRef.current || !emblaApi) return;
    timerRef.current = setTimeout(() => {
      emblaApi.scrollNext();
    }, AUTOPLAY_DELAY_MS);
  }, [emblaApi, clearTimer]);

  useEffect(() => {
    if (!emblaApi) return;

    scheduleNext();

    const handlePointerDown = () => clearTimer();
    const handleSettle = () => scheduleNext();

    emblaApi.on("pointerDown", handlePointerDown);
    emblaApi.on("settle", handleSettle);

    return () => {
      clearTimer();
      emblaApi.off("pointerDown", handlePointerDown);
      emblaApi.off("settle", handleSettle);
    };
  }, [emblaApi, scheduleNext, clearTimer]);

  const pause = useCallback(() => {
    pausedRef.current = true;
    clearTimer();
  }, [clearTimer]);

  const resume = useCallback(() => {
    pausedRef.current = false;
    scheduleNext();
  }, [scheduleNext]);

  return { clearTimer, pause, resume };
}

export default function CategoryGrid() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: false,
    slidesToScroll: 1,
    duration: SCROLL_DURATION,
  });

  const autoplay = useAutoplay(emblaApi);

  const handlePrev = useCallback(() => {
    autoplay.clearTimer();
    emblaApi?.scrollPrev();
  }, [emblaApi, autoplay]);

  const handleNext = useCallback(() => {
    autoplay.clearTimer();
    emblaApi?.scrollNext();
  }, [emblaApi, autoplay]);

  return (
    <section className="container mx-auto py-4 md:py-8 px-0 sm:px-4">
      <div
        className="relative group py-2"
        onMouseEnter={autoplay.pause}
        onMouseLeave={autoplay.resume}
      >
        {/* Nút cuộn bên trái nằm ngoài khung (chỉ hiện trên tablet/desktop) */}
        <button
          type="button"
          onClick={handlePrev}
          className="hidden sm:flex absolute -left-5 md:-left-8 lg:-left-10 top-1/2 -translate-y-1/2 z-[10000] bg-black/75 hover:bg-black text-white w-9 h-9 md:w-10 md:h-10 rounded-full items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-xl cursor-pointer"
          aria-label="Previous category"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Embla Carousel - đứng 10s rồi lướt mượt sang card kế trong 2s, loop vô hạn, không duplicate dữ liệu */}
        <div className="w-full py-1 overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-1 sm:-ml-3.5 md:-ml-4">
            {categories.map((c) => (
              <div
                key={c.slug}
                className="min-w-0 flex-[0_0_44%] sm:flex-[0_0_33.3333%] lg:flex-[0_0_16.6667%] pl-3 sm:pl-3.5 md:pl-4"
              >
                <Link
                  href={`${c.slug || "/" + c.name.toLowerCase().replace(/\s+/g, "-")}`}
                  aria-label={`View ${c.name} products`}
                  className="group/item flex flex-col items-center block h-full"
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl sm:rounded-xl mb-4 bg-gray-100">
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      quality={100}
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-700 ease-in-out group-hover/item:scale-105"
                      sizes="(max-width: 640px) 44vw, (max-width: 1024px) 33vw, 16vw"
                    />
                  </div>

                  {/* Category Info */}
                  <div className="text-center">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 transition-colors duration-200">
                      {c.name}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Nút cuộn bên phải nằm ngoài khung (chỉ hiện trên tablet/desktop) */}
        <button
          type="button"
          onClick={handleNext}
          className="hidden sm:flex absolute -right-5 md:-right-8 lg:-right-10 top-1/2 -translate-y-1/2 z-[10000] bg-black/75 hover:bg-black text-white w-9 h-9 md:w-10 md:h-10 rounded-full items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-xl cursor-pointer"
          aria-label="Next category"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
