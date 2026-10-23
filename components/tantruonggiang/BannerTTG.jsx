import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPause,
  FaPlay,
  FaTimes,
} from "react-icons/fa";
import ContactForm from "../header/ContactForm";

// Cấu hình thời gian chạy slider và mốc bắt đầu video nền.
const SLIDE_DURATION = 6000;
const PROGRESS_TICK_MS = 50;
const BACKGROUND_VIDEO_START_SECONDS = 15;

// Các index này bám theo mảng slides để đổi layout riêng mà không đổi data/logic slider.
const SMART_SLIDE_INDEX = 0;
const VIDEO_SLIDE_INDEX = 1;
const LIFESTYLE_SLIDE_INDEX = 2;

// Nội dung cố định cho các layout hero đã custom theo từng slide.
const SMART_DESCRIPTION =
  "Nâng tầm thương hiệu và tạo dấu ấn riêng cho phòng tập của bạn.";
const VIDEO_LABEL = "HÀNH TRÌNH TẠO NÊN";
const VIDEO_DESCRIPTION =
  "Khám phá quy trình thiết kế & sản xuất đồng phục chuyên nghiệp tại Univi";
const LIFESTYLE_LABEL = "Tiên phong Đồng Phục Thể Thao tại Việt Nam.";
const LIFESTYLE_HEADING = "Đồng Phục Thể Thao UNIVI";
const LIFESTYLE_DESCRIPTION =
  "Đồng phục Thể Thao UNIVI tiên phong cho phòng tập và đội nhóm tại Việt Nam.";

// Class Tailwind dùng lại cho các CTA để đồng bộ kích thước, bo góc và hover.
const LIFESTYLE_BUTTON_BASE =
  "inline-flex h-10 min-w-[88px] items-center justify-center rounded-full px-4 text-[13px] font-medium leading-none no-underline transition duration-300 ease-in-out hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:h-11 sm:min-w-[124px] sm:rounded-[6px] sm:px-5 sm:text-sm";
const DEFAULT_BANNER_BUTTON =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-pink-200/70 bg-[#105d97]/80 px-4 py-2 text-[13px] font-medium leading-6 text-white no-underline transition hover:-translate-y-0.5 hover:border-pink-100 hover:bg-[#105d97]/60 sm:min-h-11 sm:rounded-md sm:px-5 sm:py-2.5 sm:text-sm sm:leading-none md:px-6 md:py-3";
const HERO_TEXT_SHADOW =
  "[text-shadow:0_4px_18px_rgba(0,0,0,0.5),0_1px_3px_rgba(0,0,0,0.45)]";

// Chỉ đổi màu chữ UNIVI, giữ heading là text thường để dễ chỉnh nội dung.
const renderLifestyleHeading = (heading = "") => {
  const match = heading.match(/^(.*?)(UNIVI)(.*)$/i);

  if (!match) return heading;

  const [, beforeBrand, brand, afterBrand] = match;

  return (
    <>
      <span>{beforeBrand}</span>
      <span className="text-[#1976d2]">{brand}</span>
      {afterBrand && <span>{afterBrand}</span>}
    </>
  );
};

// Slide 1 cần nhấn "PHÒNG TẬP" bằng màu brand nhưng vẫn nằm trên cùng một dòng.
const renderSmartHeading = () => (
  <>
    <span>CHO CHUỖI </span>
    <span className="text-[#1976d2]">PHÒNG TẬP</span>
  </>
);

// Slide 2 dùng cùng nhịp typography với slide 1/3, chỉ highlight phần "CHẤT LƯỢNG".
const renderVideoHeading = () => (
  <>
    <span>ĐỒNG PHỤC THỂ THAO </span>
    <span className="text-[#1976d2]">CHẤT LƯỢNG</span>
  </>
);

const seekVideoSafely = (video, seconds) => {
  try {
    video.currentTime = seconds;
  } catch {
    // Trình duyệt có thể chưa load metadata; lần play tiếp theo vẫn fallback bình thường.
  }
};

// Data gốc của slider; phần render bên dưới đọc data này để giữ nguyên routing/action.
const slides = [
  {
    type: "image",
    image: "/images/1.webp",
    mobileImage: "/images/2.webp",
    smallHeading: "GIẢI PHÁP SMART SPORT UNIFORM",
    heading: "Cho Chuỗi Phòng Tập",
    primaryLabel: "Khám phá",
    primaryLink: "/giai-phap-2s",
    secondaryLabel: "Liên Hệ Ngay",
    secondaryAction: "form",
    duration: SLIDE_DURATION,
  },

  {
    type: "video",
    image: "/images/slide-03.webp",
    mobileImage: "/images/slide-03.jpg",
    videoSrc: "/video-univi.mp4",
    videoLabel: "Video giới thiệu đồng phục thể thao Univi",
    secondaryLabel: "Xem video",
    secondaryAction: "video",
    duration: SLIDE_DURATION,
  },
  {
    type: "image",
    image: "/images/3.webp",
    mobileImage: "/images/4.webp",
    smallHeading: "ĐỒNG PHỤC THỂ THAO UNIVI",
    heading: "Tiên Phong Đồng Phục Thể Thao",
    primaryLabel: "Khám Phá",
    primaryLink: "/san-pham",
    secondaryLabel: "Liên Hệ Ngay",
    secondaryAction: "form",
    duration: SLIDE_DURATION,
  },
];

export default function Banner() {
  // State hiển thị của carousel, modal form và chế độ xem video.
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  // Pause chỉ có nút điều khiển trên desktop; mobile vẫn tự chạy để giao diện gọn.
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const [isVideoFocused, setIsVideoFocused] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  // Ref giữ DOM/timer để điều khiển video và tránh spam chuyển slide khi animation chưa xong.
  const modalRef = useRef(null);
  const backgroundVideoRefs = useRef([]);
  const activeVideoIndexRef = useRef(null);
  const animatingRef = useRef(false);
  const animationTimerRef = useRef(null);
  const slideElapsedRef = useRef(0);

  // Các cờ layout giúp JSX bên dưới chọn đúng bố cục theo slide hiện tại.
  const activeSlide = slides[currentSlide] || slides[0];
  const isVideoSlide = activeSlide.secondaryAction === "video";
  const isSmartSlide = currentSlide === SMART_SLIDE_INDEX;
  const isVideoFeatureSlide = currentSlide === VIDEO_SLIDE_INDEX;
  const isLifestyleSlide = currentSlide === LIFESTYLE_SLIDE_INDEX;
  const shouldPauseCarousel = isAutoPaused || isFormOpen || isVideoFocused;
  // Overlay video luôn hiện khi carousel chạy bình thường; chỉ ẩn sau khi bấm "Xem video".
  const videoOverlayVisibility = isVideoFocused ? "opacity-0" : "opacity-100";
  // Vòng xanh trên nút pause desktop cho biết còn bao lâu thì tự chuyển slide.
  const countdownStrokeOffset =
    100 - Math.min(Math.max(slideProgress, 0), 1) * 100;

  const changeSlide = useCallback(
    (newIndex) => {
      // Chuẩn hóa index để bấm next/prev luôn xoay vòng trong mảng slides.
      const nextIndex = (newIndex + slides.length) % slides.length;
      if (animatingRef.current || nextIndex === currentSlide) return;

      // Tắt chế độ xem video trước khi đổi slide để carousel quay lại trạng thái banner.
      animatingRef.current = true;
      setIsVideoFocused(false);
      setCurrentSlide(nextIndex);

      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }

      animationTimerRef.current = setTimeout(() => {
        animatingRef.current = false;
      }, 700);
    },
    [currentSlide]
  );

  const goToPreviousSlide = useCallback(() => {
    changeSlide(currentSlide - 1);
  }, [changeSlide, currentSlide]);

  const goToNextSlide = useCallback(() => {
    changeSlide(currentSlide + 1);
  }, [changeSlide, currentSlide]);

  const toggleForm = useCallback(() => {
    setIsFormOpen((prev) => !prev);
  }, []);

  const focusBackgroundVideo = useCallback(() => {
    // Khi bấm "Xem video", video phát lại từ đầu, bật âm thanh và ẩn overlay/text.
    const video = backgroundVideoRefs.current[currentSlide];
    setIsVideoFocused(true);

    if (video) {
      seekVideoSafely(video, 0);
      video.muted = false;
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => { });
      });
    }
  }, [currentSlide]);

  const closeBackgroundVideo = useCallback(() => {
    // Khi đóng video, đưa nền về mốc 5s và bật lại overlay/text banner.
    const video = backgroundVideoRefs.current[currentSlide];

    if (video) {
      video.muted = true;
      seekVideoSafely(video, BACKGROUND_VIDEO_START_SECONDS);
    }

    setIsVideoFocused(false);
  }, [currentSlide]);

  const handleBackgroundVideoEnded = useCallback(
    (index) => {
      // Chỉ tự thoát khi người dùng đang xem video full ở slide 2.
      if (
        index !== VIDEO_SLIDE_INDEX ||
        index !== currentSlide ||
        !isVideoFocused
      ) {
        return;
      }

      closeBackgroundVideo();
    },
    [closeBackgroundVideo, currentSlide, isVideoFocused]
  );

  useEffect(() => {
    // Reset bộ đếm mỗi khi chuyển slide hoặc đổi duration.
    slideElapsedRef.current = 0;
    setSlideProgress(0);
  }, [currentSlide, activeSlide.duration]);

  // Timer auto-slide lưu elapsed để khi mở form/video xong carousel chạy tiếp đúng nhịp.
  useEffect(() => {
    const duration = activeSlide.duration || SLIDE_DURATION;

    if (shouldPauseCarousel) return undefined;

    const startedAt = performance.now();
    const baseElapsed = Math.min(slideElapsedRef.current, duration);

    const syncProgress = () => {
      const elapsed = Math.min(
        baseElapsed + performance.now() - startedAt,
        duration
      );
      setSlideProgress(elapsed / duration);
    };

    syncProgress();

    const progressInterval = window.setInterval(syncProgress, PROGRESS_TICK_MS);
    const timer = window.setTimeout(() => {
      slideElapsedRef.current = 0;
      setSlideProgress(1);
      goToNextSlide();
    }, Math.max(duration - baseElapsed, 0));

    return () => {
      window.clearInterval(progressInterval);
      window.clearTimeout(timer);

      const elapsed = Math.min(
        baseElapsed + performance.now() - startedAt,
        duration
      );
      slideElapsedRef.current = elapsed;
      setSlideProgress(elapsed / duration);
    };
  }, [activeSlide.duration, currentSlide, goToNextSlide, shouldPauseCarousel]);

  useEffect(() => {
    // Đồng bộ video nền theo slide active, tránh video ẩn vẫn tiếp tục chạy.
    backgroundVideoRefs.current.forEach((video, index) => {
      if (!video) return;

      const isActiveVideo =
        currentSlide === index && slides[index]?.type === "video";

      if (!isActiveVideo) {
        video.pause();
        video.currentTime = 0;
        if (activeVideoIndexRef.current === index) {
          activeVideoIndexRef.current = null;
        }
        return;
      }

      if (shouldPauseCarousel && !isVideoFocused) {
        video.pause();
        return;
      }

      if (activeVideoIndexRef.current !== index) {
        seekVideoSafely(
          video,
          isVideoFocused ? 0 : BACKGROUND_VIDEO_START_SECONDS
        );
        activeVideoIndexRef.current = index;
      }

      video.play().catch(() => { });
    });
  }, [currentSlide, isVideoFocused, shouldPauseCarousel]);

  useEffect(() => {
    // Dọn timer animation khi component unmount.
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Cho phép điều hướng slide bằng phím mũi tên khi không mở form/video.
    const handleKeyDown = (event) => {
      if (isFormOpen || isVideoFocused) return;
      if (event.key === "ArrowLeft") goToPreviousSlide();
      if (event.key === "ArrowRight") goToNextSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPreviousSlide, goToNextSlide, isFormOpen, isVideoFocused]);

  useEffect(() => {
    // Nhấn Escape để thoát chế độ xem video.
    if (!isVideoFocused) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeBackgroundVideo();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeBackgroundVideo, isVideoFocused]);

  useEffect(() => {
    // Khi mở form, khóa focus trong modal để thao tác bàn phím không bị trôi ra ngoài.
    if (!isFormOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") toggleForm();
    };
    const modal = modalRef.current;
    if (!modal) return undefined;

    const elems = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = elems[0];
    const last = elems[elems.length - 1];
    const trapTab = (event) => {
      if (event.key !== "Tab") return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    first?.focus();
    modal.addEventListener("keydown", trapTab);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      modal.removeEventListener("keydown", trapTab);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFormOpen, toggleForm]);

  return (
    <>
      {/* Heading ẩn phục vụ SEO/accessibility, không ảnh hưởng giao diện hero. */}
      <section aria-labelledby="homepage-heading">
        <h1 id="homepage-heading" className="sr-only">
          Đồng Phục Thể Thao Chuyên Nghiệp Cho Phòng Tập & Doanh Nghiệp
        </h1>
      </section>

      {/* Khung hero chính: mobile-first, desktop override bằng sm/lg để Tailwind 3.1 build ổn định. */}
      <section className="relative aspect-[32/36] min-h-[420px] max-h-none w-full overflow-hidden bg-[#050505] font-[var(--font-univi-site)] sm:aspect-[16/8] sm:min-h-[590px] sm:max-h-screen lg:aspect-[16/7.5]">
        {slides.map((slide, index) => {
          const isActive = currentSlide === index;
          return (
            /* Mỗi slide nằm chồng absolute; chỉ slide active nhận opacity 100. */
            <div
              key={`${slide.type}-${index}`}
              className={`absolute inset-0 transition-opacity duration-[800ms] ease-in-out ${isActive ? "z-[1] opacity-100" : "z-0 opacity-0"
                }`}
              aria-hidden={!isActive}
            >
              {slide.type === "video" && (
                <>
                  {/* Video nền chạy trong carousel, mặc định muted để trình duyệt cho autoplay. */}
                  <video
                    ref={(node) => {
                      backgroundVideoRefs.current[index] = node;
                    }}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    src={slide.videoSrc}
                    poster={slide.image}
                    muted
                    playsInline
                    preload="auto"
                    aria-label={slide.videoLabel}
                    onLoadedMetadata={(event) => {
                      if (index === VIDEO_SLIDE_INDEX && !isVideoFocused) {
                        seekVideoSafely(
                          event.currentTarget,
                          BACKGROUND_VIDEO_START_SECONDS
                        );
                      }
                    }}
                    onEnded={() => handleBackgroundVideoEnded(index)}
                  />
                  {index === VIDEO_SLIDE_INDEX && (
                    <>
                      {/* Overlay giúp text slide video rõ hơn; ẩn khi người dùng bấm xem video. */}
                      <div
                        className={`pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,18,30,0.82)_0%,rgba(8,32,58,0.64)_55%,rgba(8,18,30,0.76)_100%)] transition-opacity duration-300 sm:bg-[linear-gradient(90deg,rgba(8,18,30,0.8)_0%,rgba(8,32,58,0.6)_50%,rgba(8,18,30,0.8)_100%)] ${videoOverlayVisibility}`}
                      />
                      {/* Vignette nhẹ quanh tâm ảnh, tăng chiều sâu mà không làm video tối quá. */}
                      <div
                        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.56)_0%,rgba(0,0,0,0.38)_50%,rgba(0,0,0,0)_78%)] transition-opacity duration-300 sm:bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.36)_42%,rgba(0,0,0,0)_72%)] ${videoOverlayVisibility}`}
                      />
                    </>
                  )}
                </>
              )}

              {slide.type === "image" && (
                <>
                  {/* Ảnh desktop/tablet: ưu tiên bố cục rộng, giữ mẫu sáng và không che mặt. */}
                  <Image
                    src={slide.image}
                    alt={slide.smallHeading}
                    fill
                    className={`absolute inset-0 hidden h-full w-full object-cover sm:block ${index === LIFESTYLE_SLIDE_INDEX
                      ? `object-[62%_center] ${isActive ? "motion-safe:animate-hero-image-scale" : ""}`
                      : index === SMART_SLIDE_INDEX
                        ? `object-center ${isActive ? "motion-safe:animate-hero-image-scale" : ""}`
                        : "object-center"
                      }`}
                    quality={75}
                    priority={index === 0}
                    sizes="100vw"
                  />
                  {/* Ảnh mobile riêng để crop phù hợp màn dọc. */}
                  <Image
                    src={slide.mobileImage || slide.image}
                    alt={slide.smallHeading}
                    fill
                    className={`absolute inset-0 block h-full w-full object-cover sm:hidden ${index === LIFESTYLE_SLIDE_INDEX
                      ? `object-center ${isActive ? "motion-safe:animate-hero-image-scale" : ""}`
                      : index === SMART_SLIDE_INDEX
                        ? `object-center ${isActive ? "motion-safe:animate-hero-image-scale" : ""}`
                        : "object-center"
                      }`}
                    quality={75}
                    priority={index === 0}
                    sizes="100vw"
                  />
                  {index === LIFESTYLE_SLIDE_INDEX && (
                    // Slide 3: gradient trái sang phải để text bên trái rõ mà mặt mẫu vẫn sáng.
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,18,30,0.78)_0%,rgba(8,18,30,0.64)_48%,rgba(8,18,30,0.08)_100%)] sm:bg-[linear-gradient(90deg,rgba(8,18,30,0.76)_0%,rgba(8,18,30,0.58)_35%,rgba(8,18,30,0.2)_58%,rgba(8,18,30,0)_78%)]" />
                  )}
                  {index === SMART_SLIDE_INDEX && (
                    // Slide 1: phủ tối đều hai bên để cụm text chính giữa đạt contrast tốt.
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,18,30,0.74)_0%,rgba(8,18,30,0.56)_52%,rgba(8,18,30,0.36)_100%)] sm:bg-[linear-gradient(90deg,rgba(8,18,30,0.64)_0%,rgba(8,18,30,0.54)_24%,rgba(8,18,30,0.4)_50%,rgba(8,18,30,0.56)_76%,rgba(8,18,30,0.68)_100%)]" />
                  )}
                </>
              )}
            </div>
          );
        })}

        {/* Layer nội dung nằm trên ảnh/video; khi xem video full thì ẩn toàn bộ text/CTA. */}
        <div
          className={`pointer-events-none absolute inset-0 z-10 flex transition-opacity duration-300 ${isLifestyleSlide
            ? "items-end justify-start px-5 pb-[45px] pt-0 text-left sm:items-center sm:px-8 sm:pb-0 sm:pt-[126px] lg:px-14 xl:px-20"
            : isVideoFeatureSlide
              ? "items-end justify-start px-5 pb-[45px] pt-0 text-left sm:items-center sm:justify-center sm:px-8 sm:pb-0 sm:pt-[126px] sm:text-center"
              : isSmartSlide
                ? "items-end justify-start px-5 pb-[45px] pt-0 text-left sm:items-center sm:justify-center sm:px-8 sm:pb-0 sm:pt-[126px] sm:text-center"
                : "items-end justify-start px-0 text-left sm:items-center sm:justify-center sm:px-4 sm:text-center"
            } ${isVideoFocused ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          aria-hidden={isVideoFocused}
          inert={isVideoFocused}
        >
          {isVideoFeatureSlide ? (
            <div
              key={currentSlide}
              className="mx-0 w-[88%] max-w-none font-medium text-white sm:mx-auto sm:w-full sm:max-w-[1100px]"
            >
              {/* Slide 2: text căn giữa trên desktop, về góc trái dưới trên mobile. */}
              <p className={`motion-safe:animate-hero-fade-up-100 mx-0 mb-3 flex max-w-[700px] items-center justify-start gap-2 whitespace-nowrap text-[10px] font-semibold uppercase leading-none tracking-[0.08em] text-white/90 sm:mx-auto sm:mb-4 sm:justify-center sm:gap-4 sm:text-base sm:tracking-[0.1em] ${HERO_TEXT_SHADOW}`}>
                <span className="h-[2px] w-8 bg-[#1976d2] sm:w-12 hidden md:block" aria-hidden="true" />
                {VIDEO_LABEL}
                <span className="hidden h-[2px] w-12 bg-[#1976d2] sm:block" aria-hidden="true" />
              </p>
              <p className={`font-bold motion-safe:animate-hero-fade-up-100 mx-0 mb-4 max-w-6xl whitespace-nowrap text-[clamp(15px,4.3vw,18px)] uppercase leading-[1.05] text-white sm:mx-auto sm:text-[38px] sm:leading-[0.98] lg:text-[48px] ${HERO_TEXT_SHADOW}`} style={{ fontFamily: "'Univi Anton', 'Anton', sans-serif" }}>
                {renderVideoHeading()}
              </p>
              <p className={`motion-safe:animate-hero-fade-up-200 mx-auto mb-8 hidden max-w-6xl whitespace-nowrap text-base leading-[1.55] text-white/90 sm:block lg:text-lg ${HERO_TEXT_SHADOW}`}>
                {VIDEO_DESCRIPTION}
              </p>

              {/* CTA xem video dùng nền glass để không nặng thị giác trên video nền. */}
              <div className="pointer-events-auto motion-safe:animate-hero-fade-up-300 flex items-center justify-start sm:justify-center">
                <button
                  type="button"
                  onClick={focusBackgroundVideo}
                  className={`${LIFESTYLE_BUTTON_BASE} gap-2 border border-white/60 bg-white/10 text-white shadow-[0_14px_28px_rgba(0,0,0,0.18)] backdrop-blur-[2px] hover:border-white hover:bg-white/20`}
                  aria-label="Xem video nền"
                >
                  <FaPlay size={13} aria-hidden="true" />
                  {activeSlide.secondaryLabel}
                </button>
              </div>
            </div>
          ) : isSmartSlide ? (
            <div
              key={currentSlide}
              className="mx-0 w-[88%] max-w-none font-medium text-white sm:mx-auto sm:w-full sm:max-w-[980px]"
            >
              {/* Slide 1: heading một dòng, highlight "PHÒNG TẬP" bằng màu brand. */}
              {activeSlide.smallHeading && (
                <p className={`motion-safe:animate-hero-fade-up-100 mx-0 mb-3 flex max-w-[760px] items-center justify-start gap-2 whitespace-nowrap text-[10px] font-semibold uppercase leading-none tracking-[0.08em] text-white/90 sm:mx-auto sm:mb-5 sm:justify-center sm:gap-4 sm:text-lg sm:tracking-[0.1em] ${HERO_TEXT_SHADOW}`}>
                  <span className="h-[2px] w-8 bg-[#1976d2] sm:w-12 hidden sm:block" aria-hidden="true" />
                  {activeSlide.smallHeading}
                  <span className="hidden h-[2px] w-12 bg-[#1976d2] sm:block" aria-hidden="true" />
                </p>
              )}
              <p className={`font-bold motion-safe:animate-hero-fade-up-100 mx-0 mb-4 max-w-6xl whitespace-nowrap text-[clamp(18px,5.4vw,22px)] uppercase leading-[1.05] text-white sm:mx-auto sm:text-[44px] sm:leading-[0.98] lg:text-[54px] ${HERO_TEXT_SHADOW}`} style={{ fontFamily: "'Univi Anton', 'Anton', sans-serif" }}>
                {renderSmartHeading()}
              </p>
              <p className={`motion-safe:animate-hero-fade-up-200 mx-auto mb-4 hidden max-w-6xl text-lg leading-[1.55] text-white/90 sm:block ${HERO_TEXT_SHADOW}`}>
                {SMART_DESCRIPTION}
              </p>

              {/* CTA slide 1 giữ cùng button base với các slide còn lại. */}
              <div className="pointer-events-auto motion-safe:animate-hero-fade-up-300 mx-0 flex w-auto flex-wrap items-center justify-start gap-2 sm:mx-auto sm:justify-center sm:gap-4">
                {activeSlide.primaryLabel && activeSlide.primaryLink && (
                  <Link
                    href={activeSlide.primaryLink}
                    className={`${LIFESTYLE_BUTTON_BASE} border border-[#1976d2] bg-[#1976d2] text-white shadow-[0_14px_28px_rgba(16,93,151,0.28)] hover:border-[#105d97] hover:bg-[#105d97]`}
                  >
                    {activeSlide.primaryLabel}
                  </Link>
                )}
                {activeSlide.secondaryLabel && (
                  <button
                    type="button"
                    onClick={toggleForm}
                    className={`${LIFESTYLE_BUTTON_BASE} border border-white/60 bg-black/10 text-white shadow-[0_14px_28px_rgba(0,0,0,0.16)] hover:border-white hover:bg-white/10`}
                  >
                    {activeSlide.secondaryLabel}
                  </button>
                )}
              </div>
            </div>
          ) : isLifestyleSlide ? (
            <div
              key={currentSlide}
              className="relative w-[88%] max-w-none pl-0 font-medium text-white sm:w-[52%] sm:max-w-[620px] sm:pl-9 lg:w-[45%]"
            >

              {/* Slide 3: text nằm bên trái để chừa vùng sáng cho model bên phải. */}
              {LIFESTYLE_LABEL && (
                <p className={`motion-safe:animate-hero-fade-up-100 mb-3 flex items-center gap-2 whitespace-nowrap text-[10px] font-semibold uppercase leading-none tracking-[0.08em] text-white/90 sm:mb-4 sm:gap-3 sm:text-sm sm:tracking-[0.18em] ${HERO_TEXT_SHADOW}`}>
                  <span className="h-[2px] w-5 bg-[#1976d2] sm:w-7 hidden sm:block" aria-hidden="true" />
                  {LIFESTYLE_LABEL}
                </p>
              )}
              {LIFESTYLE_HEADING && (
                <p className={`font-bold motion-safe:animate-hero-fade-up-100 mb-4 max-w-6xl whitespace-nowrap text-[clamp(18px,5.4vw,22px)] uppercase leading-[1.05] text-white sm:mb-2 sm:text-[44px] sm:leading-[1.02] lg:text-[56px] ${HERO_TEXT_SHADOW}`} style={{ fontFamily: "'Univi Anton', 'Anton', sans-serif" }}>
                  {renderLifestyleHeading(LIFESTYLE_HEADING)}
                </p>
              )}
              <p className={`motion-safe:animate-hero-fade-up-200 mb-8 hidden max-w-[560px] whitespace-nowrap text-lg leading-[1.55] text-white/90 sm:block lg:text-xl ${HERO_TEXT_SHADOW}`}>
                {LIFESTYLE_DESCRIPTION}
              </p>

              {/* CTA slide 3: nút chính màu brand, nút phụ glass outline. */}
              <div className="pointer-events-auto motion-safe:animate-hero-fade-up-300 flex flex-row flex-wrap items-center gap-2 sm:gap-3">
                {activeSlide.primaryLabel && activeSlide.primaryLink && (
                  <Link
                    href={activeSlide.primaryLink}
                    className={`${LIFESTYLE_BUTTON_BASE} gap-3 border border-[#1976d2] bg-[#1976d2] text-white shadow-[0_14px_28px_rgba(16,93,151,0.28)] hover:border-[#105d97] hover:bg-[#105d97]`}
                  >
                    {activeSlide.primaryLabel}
                    <FaChevronRight size={13} aria-hidden="true" />
                  </Link>
                )}
                {activeSlide.secondaryLabel && (
                  <button
                    type="button"
                    onClick={toggleForm}
                    className={`${LIFESTYLE_BUTTON_BASE} border border-white/60 bg-black/10 text-white shadow-[0_14px_28px_rgba(0,0,0,0.16)] hover:border-white hover:bg-white/10`}
                  >
                    {activeSlide.secondaryLabel}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div
              key={currentSlide}
              className="w-full max-w-none translate-y-0 px-2 pb-[2rem] text-left font-medium sm:w-[min(90vw,760px)] sm:max-w-[760px] sm:translate-y-11 sm:px-0 sm:pb-0 sm:text-center lg:translate-y-[54px]"
            >
              {/* Fallback cho các slide chưa có layout custom riêng. */}
              {activeSlide.smallHeading && (
                <p className="mb-[0.2rem] text-[1.1rem] font-medium leading-[1.35] tracking-[0.08em] text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.38)] md:text-[2rem] md:font-semibold">
                  {activeSlide.smallHeading}
                </p>
              )}
              {activeSlide.heading && (
                <p className="font-bold mb-1 max-w-[88%] text-left text-2xl leading-[0.92] text-white [text-shadow:0_3px_20px_rgba(0,0,0,0.36)] sm:mx-auto sm:mb-[1rem] sm:max-w-[760px] sm:text-center sm:text-[1.2rem] sm:leading-[1.06] md:text-[2.2rem]" style={{ fontFamily: "'Univi Anton', 'Anton', sans-serif" }}>
                  {activeSlide.heading}
                </p>
              )}

              <div className="pointer-events-auto flex flex-wrap items-center justify-start gap-[0.45rem] sm:justify-center sm:gap-4 md:gap-6">
                {isVideoSlide ? (
                  <button
                    type="button"
                    onClick={focusBackgroundVideo}
                    className={`${DEFAULT_BANNER_BUTTON} md:py-4`}
                    aria-label="Xem video nền"
                  >
                    {activeSlide.secondaryLabel}
                    <FaPlay size={12} aria-hidden="true" />
                  </button>
                ) : (
                  <>
                    {activeSlide.primaryLabel && activeSlide.primaryLink && (
                      <Link
                        href={activeSlide.primaryLink}
                        className={DEFAULT_BANNER_BUTTON}
                      >
                        {activeSlide.primaryLabel}
                      </Link>
                    )}
                    {activeSlide.secondaryLabel && (
                      <button
                        type="button"
                        onClick={toggleForm}
                        className={DEFAULT_BANNER_BUTTON}
                      >
                        {activeSlide.secondaryLabel}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Controls: desktop có mũi tên + pause, mobile chỉ giữ dots để giao diện gọn. */}
        <div
          className={`absolute bottom-5 left-5 right-5 z-20 flex items-center justify-center gap-0 transition-opacity duration-300 sm:bottom-6 sm:left-8 sm:right-auto sm:justify-start sm:gap-4 lg:left-14 xl:left-20 ${isVideoFocused ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          aria-hidden={isVideoFocused}
          inert={isVideoFocused}
        >
          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={goToPreviousSlide}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-black/10 text-white shadow-[0_8px_22px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/20"
              aria-label="Slide trước"
            >
              <FaChevronLeft size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goToNextSlide}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-black/10 text-white shadow-[0_8px_22px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/20"
              aria-label="Slide tiếp theo"
            >
              <FaChevronRight size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setIsAutoPaused((prev) => !prev)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/10 text-white shadow-[0_8px_22px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-white/20"
              aria-label={
                isAutoPaused ? "Tiếp tục tự động chạy banner" : "Tạm dừng banner"
              }
              aria-pressed={isAutoPaused}
            >
              <svg
                className="pointer-events-none absolute inset-[-3px] h-[46px] w-[46px] -rotate-90 overflow-visible"
                viewBox="0 0 44 44"
                aria-hidden="true"
              >
                <circle
                  cx="22"
                  cy="22"
                  r="19"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1.5"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="19"
                  fill="none"
                  pathLength="100"
                  stroke="#1976d2"
                  strokeDasharray="100"
                  strokeDashoffset={countdownStrokeOffset}
                  strokeLinecap="round"
                  strokeWidth="2.6"
                  className="transition-all duration-75 ease-linear"
                />
              </svg>
              {isAutoPaused ? (
                <FaPlay size={12} aria-hidden="true" />
              ) : (
                <FaPause size={12} aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Dots chuyển slide thủ công, luôn đồng bộ với currentSlide. */}
          <div className="flex items-center gap-2 sm:gap-3" aria-label="Chọn slide">
            {slides.map((_, idx) => (
              <button
                key={idx}
                className={`h-1.5 w-1.5 rounded-full border-0 transition duration-300 ${currentSlide === idx
                  ? "scale-[1.35] bg-[#1976d2] opacity-100 shadow-[0_0_0_3px_rgba(25,118,210,0.16)]"
                  : "bg-white opacity-75 hover:opacity-100"
                  }`}
                onClick={() => changeSlide(idx)}
                aria-label={`Chuyển đến slide ${idx + 1}`}
                type="button"
              />
            ))}
          </div>
        </div>

        {/* Modal form liên hệ mở từ CTA, click nền đen để đóng. */}
        {isFormOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-black/60 p-4 backdrop-blur-sm"
            onClick={(event) => event.target === event.currentTarget && toggleForm()}
          >
            <div
              ref={modalRef}
              className="my-4 w-full max-w-[1100px]"
              role="dialog"
              aria-labelledby="banner-contact-form-title"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-[#105d97] to-[#0e4a7a] text-white px-5 py-3.5 flex justify-between items-center">
                  <h2
                    id="banner-contact-form-title"
                    className="text-lg font-medium uppercase"
                  >
                    Liên hệ nhận báo giá
                  </h2>
                  <button
                    onClick={toggleForm}
                    aria-label="Đóng form liên hệ"
                    className="text-white/90 hover:text-white hover:bg-white/10 rounded-lg p-1.5 focus:outline-none transition-all duration-200"
                    type="button"
                  >
                    <FaTimes className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
                <div className="bg-white">
                  <ContactForm source="Banner TTG" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nút đóng chỉ xuất hiện khi video đang được xem ở chế độ focus. */}
        {isVideoFocused && (
          <button
            type="button"
            onClick={closeBackgroundVideo}
            className="fixed right-3.5 top-[78px] z-[100000] inline-flex h-8 w-8 items-center justify-center rounded-full border-0 bg-white/90 text-[#111] opacity-90 shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white hover:opacity-100 sm:right-[22px] sm:top-[88px] sm:h-9 sm:w-9"
            aria-label="Đóng video và quay lại banner"
          >
            <FaTimes size={13} aria-hidden="true" />
          </button>
        )}
      </section>
    </>
  );
}
