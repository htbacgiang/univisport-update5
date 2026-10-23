import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { X, Heart } from 'lucide-react';
import styles from './October20Popup.module.css';
import {
  CAMPAIGN_2010_CONFIG,
  IMAGES_2010_CONFIG,
  CONTENT_2010_CONFIG,
  isCampaignActive,
  CampaignConfig,
  ImagesConfig,
  ContentConfig,
} from './october20Config';

interface October20PopupProps {
  /** Ghi đè cấu hình chiến dịch nếu muốn (optional) */
  campaignConfig?: Partial<CampaignConfig>;
  /** Ghi đè cấu hình hình ảnh nếu muốn (optional) */
  imagesConfig?: Partial<ImagesConfig>;
  /** Ghi đè cấu hình nội dung nếu muốn (optional) */
  contentConfig?: Partial<ContentConfig>;
  /** Callback khi popup được mở */
  onOpen?: () => void;
  /** Callback khi popup được đóng */
  onClose?: () => void;
  /** Ép hiển thị popup để kiểm thử giao diện */
  forceShow?: boolean;
}

// Biến in-memory ghi nhớ trạng thái trong lần tải trang này:
// - Khi F5, reload hoặc mở tab mới: bộ nhớ JS reset lại => popup mở lại sau 3s
// - Khi người dùng bấm tắt hoặc chạy hết 90s: cờ chuyển thành true => không bao giờ mở lại khi chuyển trang
let hasDismissedThisPageLoad = false;
let hasOpenedThisPageLoad = false;

if (typeof window !== 'undefined') {
  window.addEventListener('pageshow', (event) => {
    // Nếu trang được khôi phục từ bfcache (quay lại từ website khác)
    if (event.persisted) {
      hasDismissedThisPageLoad = false;
      hasOpenedThisPageLoad = false;
    }
  });
}

/**
 * Native HTML5 Canvas Flower Fireworks Engine
 * Hoàn toàn tự thân (Zero-dependency), không phụ thuộc vào thư viện bên ngoài hay dynamic chunks.
 * Đảm bảo 100% luôn bắn pháo hoa hoa bay rực rỡ trên mọi môi trường: VPS, Production, Local, Mobile.
 */
function launchNativeFlowerFireworks() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const canvasId = 'univi-october20-native-fireworks';
  let canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = canvasId;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '100005';
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const onResize = () => {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', onResize);

  interface FlowerParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    gravity: number;
    friction: number;
    rotation: number;
    rotSpeed: number;
    alpha: number;
    decay: number;
    size: number;
    type: 'emoji' | 'circle' | 'ribbon';
    text?: string;
    color?: string;
    width?: number;
    height?: number;
  }

  const particles: FlowerParticle[] = [];
  const emojis = ['🌸', '🌹', '🌺', '💐', '❤️', '✨'];
  const colors = ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#d97706', '#ec4899', '#ffffff'];

  // Hàm sinh hạt nổ tại tọa độ (x, y) với góc và vận tốc
  const spawnBurst = (
    originX: number,
    originY: number,
    count: number,
    baseAngle: number,
    spreadAngle: number,
    speedBase: number,
    speedVar: number
  ) => {
    for (let i = 0; i < count; i++) {
      const angle = (baseAngle - spreadAngle / 2 + Math.random() * spreadAngle) * (Math.PI / 180);
      const speed = speedBase + Math.random() * speedVar;
      const isEmoji = Math.random() < 0.45;

      if (isEmoji) {
        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.18 + Math.random() * 0.08,
          friction: 0.98,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.1,
          alpha: 1,
          decay: 0.007 + Math.random() * 0.008,
          size: 22 + Math.random() * 14,
          type: 'emoji',
          text: emojis[Math.floor(Math.random() * emojis.length)],
        });
      } else {
        const isRibbon = Math.random() < 0.5;
        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.15 + Math.random() * 0.06,
          friction: 0.975,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.15,
          alpha: 1,
          decay: 0.008 + Math.random() * 0.009,
          size: 7 + Math.random() * 6,
          type: isRibbon ? 'ribbon' : 'circle',
          color: colors[Math.floor(Math.random() * colors.length)],
          width: 8 + Math.random() * 6,
          height: 14 + Math.random() * 8,
        });
      }
    }
  };

  // 1. Đợt 1: Bắn cực mạnh từ giữa màn hình lên cao (tâm thiệp)
  spawnBurst(width * 0.5, height * 0.75, 120, -90, 110, 12, 14);

  // 2. Đợt 2: Liên hoàn pháo hai bên góc bắn chéo vào nhau trong 2.5s
  const duration = 2500;
  const startTime = Date.now();
  const interval = window.setInterval(() => {
    const elapsed = Date.now() - startTime;
    if (elapsed > duration) {
      window.clearInterval(interval);
      return;
    }
    // Góc trái bắn sang phải lên cao (-60 độ)
    spawnBurst(width * 0.08, height * 0.85, 25, -60, 45, 13, 9);
    // Góc phải bắn sang trái lên cao (-120 độ)
    spawnBurst(width * 0.92, height * 0.85, 25, -120, 45, 13, 9);
    // Nổ hoa giữa trời
    if (Math.random() < 0.6) {
      spawnBurst(width * (0.25 + Math.random() * 0.5), height * (0.2 + Math.random() * 0.3), 30, 0, 360, 4, 8);
    }
  }, 220);

  // Vòng lặp animation mượt mà
  const render = () => {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.rotation += p.rotSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > height + 60) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.type === 'emoji' && p.text) {
        ctx.font = `${p.size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.text, 0, 0);
      } else if (p.type === 'ribbon' && p.color) {
        ctx.fillStyle = p.color;
        ctx.fillRect(-((p.width || 8) / 2), -((p.height || 14) / 2), p.width || 8, p.height || 14);
      } else if (p.color) {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    if (particles.length > 0 || Date.now() - startTime < duration + 1000) {
      requestAnimationFrame(render);
    } else {
      window.removeEventListener('resize', onResize);
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  };

  requestAnimationFrame(render);
}

export const October20Popup: React.FC<October20PopupProps> = ({
  campaignConfig: customCampaign,
  imagesConfig: customImages,
  contentConfig: customContent,
  onOpen,
  onClose,
  forceShow = false,
}) => {
  const config = { ...CAMPAIGN_2010_CONFIG, ...customCampaign };
  const images = { ...IMAGES_2010_CONFIG, ...customImages };
  const content = { ...CONTENT_2010_CONFIG, ...customContent };

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [countdown, setCountdown] = useState<number>(Math.round(config.autoCloseMs / 1000) || 90);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Hiệu ứng bắn pháo hoa hoa bay tung tóe khi bấm "Gửi ngàn lời chúc" (giống hệt BT Academy)
  const triggerConfetti = useCallback(async () => {
    if (typeof window === 'undefined') return;

    let firedWithConfetti = false;
    try {
      // @ts-ignore
      const confettiModule = await import('canvas-confetti');
      const confetti: any = confettiModule?.default || confettiModule;

      if (typeof confetti === 'function') {
        // Tạo các hình dạng hoa thực tế (hoa anh đào, hoa hồng, hoa dâm bụt, trái tim)
        const scalar = 2.4;
        const flower1 = confetti.shapeFromText ? confetti.shapeFromText({ text: '🌸', scalar }) : 'circle';
        const flower2 = confetti.shapeFromText ? confetti.shapeFromText({ text: '🌹', scalar }) : 'circle';
        const flower3 = confetti.shapeFromText ? confetti.shapeFromText({ text: '🌺', scalar }) : 'circle';
        const flower4 = confetti.shapeFromText ? confetti.shapeFromText({ text: '💐', scalar }) : 'circle';
        const heart = confetti.shapeFromText ? confetti.shapeFromText({ text: '❤️', scalar }) : 'circle';

        const flowerShapes = [flower1, flower2, flower3, flower4, heart];
        const festiveColors = ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#d97706', '#ec4899', '#ffffff'];

        // 1. Loạt đạn đầu tiên: Hoa bay tung tóe cực mạnh từ giữa màn hình lên cao
        confetti({
          particleCount: 70,
          spread: 130,
          startVelocity: 55,
          origin: { x: 0.5, y: 0.75 },
          shapes: flowerShapes,
          scalar,
          zIndex: 100005,
        });

        confetti({
          particleCount: 90,
          spread: 110,
          startVelocity: 60,
          origin: { x: 0.5, y: 0.75 },
          colors: festiveColors,
          zIndex: 100005,
        });

        // 2. Chuỗi pháo hoa liên hoàn hai bên và giữa nổ tung trong 2.5 giây
        const duration = 2500;
        const animationEnd = Date.now() + duration;

        const interval: number = window.setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            window.clearInterval(interval);
            return;
          }

          const count = 35 * (timeLeft / duration);

          // Bắn hoa bên trái góc 60 độ bay lên
          confetti({
            particleCount: Math.floor(count * 0.9),
            angle: 60,
            spread: 80,
            startVelocity: 52,
            origin: { x: 0.1, y: 0.8 },
            shapes: flowerShapes,
            scalar,
            zIndex: 100005,
          });

          // Bắn hoa bên phải góc 120 độ bay lên
          confetti({
            particleCount: Math.floor(count * 0.9),
            angle: 120,
            spread: 80,
            startVelocity: 52,
            origin: { x: 0.9, y: 0.8 },
            shapes: flowerShapes,
            scalar,
            zIndex: 100005,
          });

          // Nổ hoa 360 độ pháo hoa trên cao
          confetti({
            particleCount: 25,
            spread: 360,
            startVelocity: 35,
            origin: { x: Math.random() * 0.6 + 0.2, y: Math.random() * 0.35 + 0.15 },
            colors: festiveColors,
            zIndex: 100005,
          });
        }, 250);

        firedWithConfetti = true;
      }
    } catch (e) {
      console.warn('[October20Popup] canvas-confetti import failed, using native canvas fireworks engine:', e);
    }

    // Nếu canvas-confetti không tải được (trên VPS do chưa build chunk hoặc chưa install npm),
    // kích hoạt ngay bộ máy pháo hoa Native Canvas 100% độc lập, đảm bảo luôn bắn pháo rực rỡ!
    if (!firedWithConfetti) {
      launchNativeFlowerFireworks();
    }
  }, []);

  // Đóng popup: đánh dấu đã đóng cho lần tải trang này
  const handleClose = useCallback(() => {
    hasDismissedThisPageLoad = true;
    setIsOpen(false);
    if (typeof window !== 'undefined' && config.sessionStorageKey) {
      if (config.onlyFirstVisit || config.oncePerSession) {
        try {
          localStorage.setItem(config.sessionStorageKey, 'true');
          sessionStorage.setItem(config.sessionStorageKey, 'true');
        } catch (err) {
          // Bỏ qua lỗi truy cập storage
        }
      }
    }
    // Trả lại focus cho phần tử trước đó
    if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
      previousActiveElementRef.current.focus();
    }
    onClose?.();
  }, [config.onlyFirstVisit, config.oncePerSession, config.sessionStorageKey, onClose]);

  // Đếm ngược và tự động đóng popup sau thời gian autoCloseMs (mặc định 90 giây = 90s)
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;
    const initialSeconds = Math.round(config.autoCloseMs / 1000) || 90;
    setCountdown(initialSeconds);

    if (config.autoCloseMs && config.autoCloseMs > 0) {
      const interval = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            window.clearInterval(interval);
            hasDismissedThisPageLoad = true;
            handleClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => window.clearInterval(interval);
    }
  }, [isOpen, config.autoCloseMs, handleClose]);

  // Kiểm tra điều kiện mở popup sau delay
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Nếu đã đóng popup hoặc đã chạy hết 90s trong lần tải trang này: KHÔNG bật lại nữa
    if (hasDismissedThisPageLoad) {
      return;
    }

    // 2. Nếu popup đang mở hoặc đã từng mở trong lần tải trang này: không hẹn giờ mở lại
    if (isOpen || hasOpenedThisPageLoad) {
      return;
    }

    // 3. Kiểm tra loại trừ trang quản trị
    const currentPath = router?.asPath || router?.pathname || '';
    if (config.excludeRoutes?.some((route) => currentPath.startsWith(route))) {
      return;
    }

    if (forceShow) {
      const timer = window.setTimeout(() => {
        hasOpenedThisPageLoad = true;
        setIsOpen(true);
        onOpen?.();
      }, 500);
      return () => window.clearTimeout(timer);
    }

    // 4. Kiểm tra xem chiến dịch có hợp lệ không (trong vòng 3 ngày: 19/10 đến 21/10)
    if (!isCampaignActive(config)) {
      return;
    }

    // Nếu không giới hạn số lần hiển thị (mỗi lần F5, reload đều hiện), dọn dẹp key cũ trong storage
    if (!config.onlyFirstVisit && !config.oncePerSession) {
      try {
        localStorage.removeItem(config.sessionStorageKey);
        sessionStorage.removeItem(config.sessionStorageKey);
      } catch (err) {
        // Bỏ qua lỗi truy cập storage
      }
    } else {
      // Nếu cấu hình chỉ hiện lần đầu tiên vào web: kiểm tra cả localStorage và sessionStorage
      try {
        const shownInLocal = localStorage.getItem(config.sessionStorageKey);
        const shownInSession = sessionStorage.getItem(config.sessionStorageKey);
        if (shownInLocal === 'true' || shownInSession === 'true') {
          return;
        }
      } catch (err) {
        // Bỏ qua lỗi truy cập storage
      }
    }

    // 5. Hẹn giờ tự động hiển thị sau delayMs (mặc định 3 giây = 3s)
    const timer = window.setTimeout(() => {
      // Nếu trong lúc chờ 3s mà người dùng đã tắt hoặc điều kiện không còn thỏa mãn
      if (hasDismissedThisPageLoad) return;

      // Lưu lại phần tử đang focus trước khi modal mở
      if (document.activeElement instanceof HTMLElement) {
        previousActiveElementRef.current = document.activeElement;
      }
      hasOpenedThisPageLoad = true;
      setIsOpen(true);

      // Đánh dấu đã hiển thị nếu đang bật chế độ giới hạn 1 lần
      if (config.onlyFirstVisit || config.oncePerSession) {
        try {
          localStorage.setItem(config.sessionStorageKey, 'true');
          sessionStorage.setItem(config.sessionStorageKey, 'true');
        } catch (err) {
          // Bỏ qua lỗi storage
        }
      }

      onOpen?.();
    }, config.delayMs);

    return () => window.clearTimeout(timer);
  }, [config, forceShow, onOpen, router, isOpen]);

  // Quản lý phím Escape, click ra ngoài và focus trap
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    // Focus vào nút đóng khi modal vừa mở
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    // Khóa cuộn trang khi mở popup (cả body và html)
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Chặn triệt để hành động cuộn chuột (wheel) hoặc vuốt chạm (touchmove) bên ngoài thiệp popup
    const preventOutsideScroll = (e: WheelEvent | TouchEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', preventOutsideScroll, { passive: false });
    window.addEventListener('touchmove', preventOutsideScroll, { passive: false });

    // Bắt phím Escape và Focus Trap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      // Ngăn các phím cuộn trang (PageUp, PageDown, Space, ArrowUp, ArrowDown) tác động ra ngoài
      if (['PageUp', 'PageDown', 'Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
        if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
          e.preventDefault();
        }
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener('wheel', preventOutsideScroll);
      window.removeEventListener('touchmove', preventOutsideScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  // Tương tác nút "Gửi yêu thương"
  const handleHeartClick = () => {
    setHasCelebrated(true);
    triggerConfetti();
  };

  // Mảng vị trí ngẫu nhiên cho cánh hoa rơi trang trí
  const petals = [
    { left: '8%', delay: '0s', duration: '8.5s', size: 14 },
    { left: '22%', delay: '2.1s', duration: '9.2s', size: 18 },
    { left: '38%', delay: '4.3s', duration: '8s', size: 12 },
    { left: '55%', delay: '1.2s', duration: '10s', size: 16 },
    { left: '72%', delay: '3.4s', duration: '8.8s', size: 15 },
    { left: '88%', delay: '0.8s', duration: '9.5s', size: 13 },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Tải trước font Google Fonts để hiển thị chữ cách điệu mượt mà */}
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm overflow-hidden overscroll-none"
        onClick={handleClose}
        aria-hidden="false"
      >
        {/* Cánh hoa hồng rơi nhẹ nhàng */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {petals.map((petal, index) => (
            <span
              key={index}
              className={styles.petal}
              style={{
                left: petal.left,
                animationDelay: petal.delay,
                animationDuration: petal.duration,
                width: `${petal.size}px`,
                height: `${petal.size}px`,
              }}
            />
          ))}
        </div>

        {/* Hộp thiệp chúc mừng: Bố cục max-w-6xl cách điệu chuẩn xác như BT Academy */}
        <div
          ref={dialogRef}
          className={`relative w-full max-w-4xl lg:max-w-5xl max-h-[94vh] sm:max-h-[90vh] md:max-h-[88vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col ${styles.cardContainer}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="univi-october20-title"
          aria-describedby="univi-october20-wishes"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Nút đóng (×) sang trọng ở góc trên bên phải */}
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 z-30 p-2.5 sm:p-3 rounded-full bg-white/60 hover:bg-white text-stone-600 hover:text-rose-700 shadow-lg ring-1 ring-black/5 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2"
            type="button"
            aria-label="Đóng thiệp chúc mừng ngày 20/10"
          >
            <X size={22} aria-hidden="true" />
          </button>

          {/* Khung nội dung có thể cuộn linh hoạt trên mobile */}
          <div className={`overflow-y-auto overscroll-contain ${styles.customScrollbar} flex-1`}>
            {/* PHẦN TRÊN: 1 ảnh nền banner duy nhất */}
            <div className="relative w-full h-36 sm:h-44 md:h-48 lg:h-52 overflow-hidden bg-stone-100">
              <Image
                src={images.floralBanner}
                alt={images.bannerAlt}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className={`object-cover ${images.bannerPosition || 'object-[center_30%]'}`}
                priority
              />
              {/* Lớp chuyển tiếp sắc thái mềm mại vào thân thiệp - nền trắng ấm */}
              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-white to-transparent" />
            </div>

            {/* PHẦN GIỮA VÀ DƯỚI: Typography cách điệu nghệ thuật chuẩn BT Academy */}
            <div className="px-4 sm:px-8 md:px-10 pb-4 sm:pb-5 pt-1.5 sm:pt-2 text-center max-w-4xl lg:max-w-5xl mx-auto">
              {/* 1. Dòng chữ viết tay "Thân gửi" cách điệu màu hồng rose-700 */}
              <p className={`${styles.dancingScript} text-xl sm:text-2xl font-bold text-rose-700 tracking-wide mb-0.5`}>
                {content.scriptTagline}
              </p>

              {/* 2. Tiêu đề lớn "PHỤ NỮ VIỆT NAM" hiệu ứng đổ màu đỏ ruby lộng lẫy */}
              <h2
                id="univi-october20-title"
                className={`${styles.playfairDisplay} ${styles.textGradientRuby} text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wider uppercase mb-1 drop-shadow-sm`}
              >
                {content.mainTitle}
              </h2>

              {/* 3. Dòng phụ "20 THÁNG 10" với dải kim vàng sang trọng */}
              <div className="flex items-center justify-center gap-2 sm:gap-2.5 mb-1.5 sm:mb-2">
                <span className="h-[1px] w-6 sm:w-14 bg-gradient-to-r from-transparent to-amber-500/80" aria-hidden="true"></span>
                <span className="text-amber-700 font-bold text-xs sm:text-sm tracking-[0.22em] uppercase font-serif">
                  ✦ {content.dateSubtitle} ✦
                </span>
                <span className="h-[1px] w-6 sm:w-14 bg-gradient-to-l from-transparent to-amber-500/80" aria-hidden="true"></span>
              </div>

              {/* 4. Lời tri ân trang trọng gửi đến phái đẹp đồng hành cùng Univi */}
              <p className="text-rose-900 font-bold text-sm sm:text-base md:text-lg mb-1.5 sm:mb-2 max-w-2xl mx-auto leading-snug">
                {content.recipientGreeting}
              </p>

              {/* Đường viền trang trí vàng champagne */}
              <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-rose-200 via-amber-400 to-rose-200 mx-auto mb-2 sm:mb-2.5 rounded-full" aria-hidden="true"></div>

              {/* 5. Nội dung lời chúc chi tiết - cỡ chữ gọn gàng, thoáng mắt */}
              <div id="univi-october20-wishes" className="text-stone-700 text-xs sm:text-sm md:text-base leading-relaxed space-y-1 mx-auto text-justify sm:text-center font-normal">
                {content.wishes.map((paragraph, idx) => (
                  <p key={idx} className="transition-opacity duration-200">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* 6. Phần chữ ký và Logo chính thức của Đồng Phục Univi */}
              <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 hidden md:flex border-t border-rose-200/60 flex-col sm:flex-row items-center justify-between gap-3 max-w-2xl mx-auto">
                <div className="flex items-center gap-2">
                  <Image
                    src={images.logo}
                    alt={images.logoAlt}
                    width={130}
                    height={36}
                    className="h-6 sm:h-7 w-auto object-contain opacity-95"
                  />
                </div>
                {/* Chữ ký viết tay nghệ thuật cách điệu */}
                <p className={`${styles.dancingScript} text-lg sm:text-xl md:text-2xl font-bold text-rose-800 tracking-wide`}>
                  {content.signature}
                </p>
              </div>

              {/* 7. Khu vực nút hành động tương tác */}
              <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={handleHeartClick}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-700 hover:to-red-700 shadow-md shadow-rose-600/30 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                  <Heart size={16} className={`transition-transform ${hasCelebrated ? 'fill-white scale-125' : ''}`} />
                  <span>{hasCelebrated ? 'Bắn thêm pháo hoa chúc mừng 🌸' : 'Gửi ngàn lời chúc yêu thương 🌸'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 ring-1 ring-rose-200/80 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                  <span>Khép lại thiệp ({countdown}s)</span>
                </button>
              </div>

              <p className="mt-2 text-[11px] text-stone-400">
                Nhấn <kbd className="px-1.5 py-0.5 text-[10px] bg-stone-100 border border-stone-200 rounded font-mono">Esc</kbd> hoặc nhấn ra ngoài để đóng thiệp
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default October20Popup;
