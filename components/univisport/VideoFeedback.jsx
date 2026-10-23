import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { DEFAULT_VIDEO_FEEDBACK_ITEMS } from "../../data/videoFeedbackItems";

// ─────────────────────────────────────────────────────────────
// Video items
// ─────────────────────────────────────────────────────────────
const normalizeVideoItems = (items = []) =>
  items
    .filter((item) => item && item.isVisible !== false)
    .map((item, index) => ({
      ...item,
      id: item.id || item._id || `video-${index}`,
      type: item.type === "facebook" ? "facebook" : "local",
      poster: item.poster || "",
      title: item.title || "Video feedback khách hàng Univi",
    }));

function buildFbEmbedUrl(fbUrl, autoplay = true) {
  const encoded = encodeURIComponent(fbUrl);
  return `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&width=400&autoplay=${autoplay ? 1 : 0}&appId`;
}

function fmt(s) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const getPoster = (item) => item.poster || "";

const mediaStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const posterStyle = (item) => ({
  ...mediaStyle,
  backgroundColor: "#0a0a0a",
  backgroundImage: getPoster(item) ? `url(${getPoster(item)})` : "none",
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
});

const bottomShadeStyle = {
  height: "45%",
  background: "linear-gradient(to top, rgba(0,0,0,0.78), rgba(0,0,0,0))",
};

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────
const PlayIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>;
const PauseIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><rect x="5" y="3" width="4" height="18" rx="1" /><rect x="15" y="3" width="4" height="18" rx="1" /></svg>;
const MutedIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>;
const SoundIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>;
const FbIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>;
const ExpandIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

// Shared button class
const btnCls = "flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-0 cursor-pointer flex-shrink-0 w-8 h-8 md:w-8 md:h-8 w-6 h-6";

// ─────────────────────────────────────────────────────────────
// VIDEO MODAL
// ─────────────────────────────────────────────────────────────
function VideoModal({ item, onClose }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [visible, setVisible] = useState(false);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 280);
  }, [onClose]);

  useEffect(() => { const t = setTimeout(() => setVisible(true), 20); return () => clearTimeout(t); }, []);
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || item.type !== "local") return;
    const startAndPlay = () => {
      if (item.startTime > 0) video.currentTime = item.startTime;
      video.muted = false;
      video.play().catch(() => { video.muted = true; video.play().catch(() => { }); });
    };
    if (video.readyState >= 1) startAndPlay();
    else video.addEventListener("loadedmetadata", startAndPlay, { once: true });
    const onTime = () => { if (video.duration) { setProgress((video.currentTime / video.duration) * 100); setCurrentTime(video.currentTime); } };
    const onLoad = () => setDuration(video.duration || 0);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onLoad);
    if (video.readyState >= 1) setDuration(video.duration || 0);
    return () => { video.removeEventListener("timeupdate", onTime); video.removeEventListener("loadedmetadata", onLoad); };
  }, [item.type, item.startTime]);

  const togglePlay = (e) => { e.stopPropagation(); const v = videoRef.current; if (!v) return; if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); } };
  const toggleMute = (e) => { e.stopPropagation(); const v = videoRef.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted); };
  const handleSeek = (e) => { e.stopPropagation(); const v = videoRef.current; if (!v || !v.duration) return; const val = Number(e.target.value); v.currentTime = (val / 100) * v.duration; setProgress(val); setCurrentTime(v.currentTime); };

  const isLocal = item.type === "local";

  return createPortal(
    <div
      onClick={handleClose}
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        zIndex: 9999,
        background: visible ? "rgba(0,0,0,0.82)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(6px)" : "blur(0px)",
        WebkitBackdropFilter: visible ? "blur(6px)" : "blur(0px)",
        transition: "background 0.28s ease, backdrop-filter 0.28s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative overflow-hidden bg-[#0a0a0a] rounded-[20px]"
        style={{
          width: "min(360px, 90vw)",
          aspectRatio: "9 / 16",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          transform: visible ? "scale(1) translateY(0)" : "scale(0.88) translateY(40px)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.28s cubic-bezier(.22,1,.36,1), opacity 0.28s ease",
        }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          aria-label="Đóng"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/55 border border-white/30 text-white text-lg flex items-center justify-center cursor-pointer backdrop-blur-sm"
        >✕</button>

        {isLocal ? (
          <>
            <video ref={videoRef} src={item.src} poster={getPoster(item) || undefined} loop playsInline
              onClick={(e) => { e.stopPropagation(); togglePlay(e); }}
              className="cursor-pointer"
              style={mediaStyle} />
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={bottomShadeStyle} />
            <div className="absolute bottom-0 left-0 right-0 px-3.5 pt-2.5 pb-14">
              <p className="text-white text-[13px] font-bold m-0 leading-6" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>{item.title}</p>
            </div>
            {/* Seekbar */}
            <div className="absolute left-2.5 right-2.5" style={{ bottom: 46 }} onClick={(e) => e.stopPropagation()}>
              <div className="relative h-1 cursor-pointer">
                <div className="absolute inset-0 bg-white/25 rounded-sm" />
                <div className="absolute top-0 left-0 bottom-0 bg-red-500 rounded-sm pointer-events-none" style={{ width: `${progress}%` }} />
                <input type="range" min={0} max={100} step={0.1} value={progress} onChange={handleSeek}
                  aria-label="Tua video"
                  className="absolute left-0 w-full opacity-0 cursor-pointer m-0 p-0"
                  style={{ top: "50%", transform: "translateY(-50%)", height: 20 }} />
              </div>
            </div>
            {/* Controls */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-2">
              <button onClick={togglePlay} aria-label={playing ? "Tạm dừng" : "Phát"} className={btnCls}>{playing ? <PauseIcon /> : <PlayIcon />}</button>
              <button onClick={toggleMute} aria-label={muted ? "Bật tiếng" : "Tắt tiếng"} className={btnCls}>{muted ? <MutedIcon /> : <SoundIcon />}</button>
              <span className="text-white text-[11px] ml-0.5 whitespace-nowrap tabular-nums">{fmt(currentTime)} / {fmt(duration)}</span>
            </div>
          </>
        ) : (
          <>
            <iframe src={buildFbEmbedUrl(item.fbUrl)} title={item.title}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen scrolling="no" className="w-full h-full border-0 block" />
            <div className="absolute top-3 left-3 bg-[#1877f2] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 pointer-events-none"><FbIcon /> Facebook</div>
            <div className="absolute bottom-0 left-0 right-0 px-3.5 pt-7 pb-3.5 bg-gradient-to-t from-black/65 pointer-events-none">
              <p className="text-white text-[13px] font-bold m-0">{item.title}</p>
            </div>
            <a href={item.fbUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
              className="absolute bottom-2.5 right-2.5 bg-[#1877f2] text-white text-[11px] font-semibold px-3 py-1 rounded-full no-underline flex items-center gap-1">
              <FbIcon /> Xem trên Facebook
            </a>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────
// Facebook Video Card
// ─────────────────────────────────────────────────────────────
function FacebookVideoCard({ item, isActive, onActivate, onExpand, componentVisible }) {
  return (
    <div
      onClick={() => onActivate(item.id)}
      className="relative rounded-2xl overflow-hidden cursor-pointer bg-[#0a0a0a] transition-transform duration-300 w-full"
      style={{ aspectRatio: "9 / 16", transform: isActive ? "scale(1.005)" : "scale(1)" }}
    >
      <iframe src={buildFbEmbedUrl(item.fbUrl, isActive && componentVisible)} title={item.title}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen scrolling="no" className="w-full h-full border-0 block" />
      <div className="absolute top-3 left-3 bg-[#1877f2] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 pointer-events-none"><FbIcon /> Facebook</div>
      <div className="absolute bottom-0 left-0 right-0 px-3.5 pt-10 pb-11 bg-gradient-to-t from-black/70 pointer-events-none">
        <p className="text-white text-[13px] font-bold m-0 leading-6" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{item.title}</p>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onExpand(item); }} aria-label="Xem to hơn" title="Mở popup"
        className="absolute bottom-2.5 left-2.5 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm w-8 h-8 border-0 cursor-pointer">
        <ExpandIcon />
      </button>
      <a href={item.fbUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
        className="absolute bottom-2.5 right-2.5 bg-[#1877f2] text-white text-[11px] font-semibold px-3 py-1 rounded-full no-underline flex items-center gap-1">
        <FbIcon /> Facebook
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Local Video Card
// ─────────────────────────────────────────────────────────────
function VideoCard({ item, isActive, onActivate, onExpand, modalOpen, componentVisible }) {
  const videoRef = useRef(null);
  const pendingSeekRef = useRef(null);
  const poster = getPoster(item);
  const hasPoster = Boolean(poster);
  const [hasStarted, setHasStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const showPoster = hasPoster && !hasStarted && !playing;

  const wasPlayingRef = useRef(false);
  const playingRef = useRef(false);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    if (modalOpen) {
      wasPlayingRef.current = playingRef.current;
      setPlaying(false);
    } else if (wasPlayingRef.current) {
      setPlaying(true);
      wasPlayingRef.current = false;
    }
  }, [modalOpen]);

  useEffect(() => {
    if ((!isActive || !componentVisible) && playing) {
      setPlaying(false);
    }
  }, [componentVisible, isActive, playing]);

  useEffect(() => {
    const video = videoRef.current;
    setHasStarted(false);
    setProgress(0);
    setCurrentTime(0);
    pendingSeekRef.current = null;
    if (!video) return;

    const updateTime = () => {
      if (!video.duration) return;
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
    };
    const handleMetadata = () => {
      const nextDuration = video.duration || 0;
      setDuration(nextDuration);
      if (pendingSeekRef.current !== null && nextDuration) {
        video.currentTime = (pendingSeekRef.current / 100) * nextDuration;
        pendingSeekRef.current = null;
        updateTime();
      }
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", handleMetadata);
    if (video.readyState >= 1) handleMetadata();

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", handleMetadata);
    };
  }, [item.src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = muted;
    if (!playing) {
      video.pause();
      return;
    }

    setHasStarted(true);
    video.play().catch(() => {
      video.muted = true;
      setMuted(true);
      video.play().catch(() => { });
    });
  }, [playing, muted]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!playing) onActivate(item.id);
    setPlaying((current) => !current);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    const val = Number(e.target.value);
    setHasStarted(true);
    if (!v || !v.duration) {
      pendingSeekRef.current = val;
      setProgress(val);
      return;
    }
    v.currentTime = (val / 100) * v.duration;
    setProgress(val);
    setCurrentTime(v.currentTime);
  };

  const handleCardClick = () => {
    onActivate(item.id);
    setPlaying((current) => (isActive ? !current : true));
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 w-full group"
      style={{ aspectRatio: "9 / 16", transform: isActive ? "scale(1.005)" : "scale(1)", background: "#0a0a0a" }}
    >
      <video
        ref={videoRef}
        src={item.src}
        muted={muted}
        poster={poster || undefined}
        loop
        playsInline
        preload="metadata"
        style={{ ...mediaStyle, opacity: showPoster ? 0 : 1 }}
      />

      {showPoster && (
        <div
          role="img"
          aria-label={item.title}
          className="absolute inset-0 pointer-events-none"
          style={posterStyle(item)}
        />
      )}

      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-all duration-300">
          <div className="w-11 h-8 md:w-16 md:h-11 rounded-[10px] md:rounded-xl bg-[#FF0000]/50 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <polygon points="6,4 20,12 6,20" />
            </svg>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={bottomShadeStyle} />

      {/* Badge "Đang phát" — ẩn trên mobile */}
      {isActive && (
        <div className="hidden sm:block absolute top-2 left-2 bg-[#105d97]/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase">
          Đang phát
        </div>
      )}

      {/* Title — ẩn trên mobile */}
      <div className="hidden sm:block absolute bottom-0 left-0 right-0 px-3.5 pt-3 pb-16">
        <p className="text-white text-[13px] font-bold m-0 leading-6" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{item.title}</p>
      </div>

      {/* Seekbar */}
      <div
        className="absolute bottom-[35px] left-1 right-1 sm:bottom-[46px] sm:left-2.5 sm:right-2.5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-1 cursor-pointer">
          <div className="absolute inset-0 bg-white/25 rounded-sm" />
          <div className="absolute top-0 left-0 bottom-0 bg-red-500 rounded-sm pointer-events-none" style={{ width: `${progress}%` }} />
          <input type="range" min={0} max={100} step={0.1} value={progress} onInput={handleSeek} onChange={handleSeek}
            aria-label="Tua video"
            className="absolute left-0 w-full opacity-0 cursor-pointer m-0 p-0"
            style={{ top: "50%", transform: "translateY(-50%)", height: 20 }} />
        </div>
      </div>

      {/* Controls */}
      <div className="absolute left-1 right-1 sm:left-2.5 sm:right-2.5 flex items-center gap-1 sm:gap-1.5" style={{ bottom: 6 }}>
        <button onClick={togglePlay} aria-label={playing ? "Tạm dừng" : "Phát"}
          className="flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-0 cursor-pointer flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8">
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button onClick={toggleMute} aria-label={muted ? "Bật tiếng" : "Tắt tiếng"}
          className="flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-0 cursor-pointer flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8">
          {muted ? <MutedIcon /> : <SoundIcon />}
        </button>
        <span className="text-white text-[9px] sm:text-[11px] ml-0.5 whitespace-nowrap tabular-nums  sm:inline">
          {fmt(currentTime)} / {fmt(duration)}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onExpand({ ...item, startTime: videoRef.current?.currentTime || 0 }); }}
          aria-label="Xem to hơn" title="Mở popup"
          className="flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-0 cursor-pointer flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 ml-auto">
          <ExpandIcon />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AnyVideoCard dispatcher
// ─────────────────────────────────────────────────────────────
function AnyVideoCard({ item, isActive, onActivate, onExpand, modalOpen, componentVisible }) {
  if (item.type === "facebook") {
    return (
      <FacebookVideoCard
        item={item}
        isActive={isActive}
        onActivate={onActivate}
        onExpand={onExpand}
        componentVisible={componentVisible}
      />
    );
  }
  return (
    <VideoCard
      item={item}
      isActive={isActive}
      onActivate={onActivate}
      onExpand={onExpand}
      modalOpen={modalOpen}
      componentVisible={componentVisible}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Main VideoFeedback
// ─────────────────────────────────────────────────────────────
export default function VideoFeedback({ initialItems = DEFAULT_VIDEO_FEEDBACK_ITEMS }) {
  const fallbackItems = normalizeVideoItems(initialItems);
  const [videoItems, setVideoItems] = useState(fallbackItems);
  const [activeId, setActiveId] = useState(fallbackItems[0]?.id || null);
  const [modalItem, setModalItem] = useState(null);
  const [componentVisible, setComponentVisible] = useState(true);
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);

  const handleActivate = useCallback((id) => setActiveId(id), []);
  const handleExpand = useCallback((item) => setModalItem(item), []);
  const handleCloseModal = useCallback(() => setModalItem(null), []);

  useEffect(() => {
    let ignore = false;

    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/video-feedback");
        if (!response.ok) return;
        const data = await response.json();
        const nextItems = normalizeVideoItems(data.videos);
        if (ignore || nextItems.length === 0) return;
        setVideoItems(nextItems);
        setActiveId((current) =>
          nextItems.some((item) => item.id === current) ? current : nextItems[0].id
        );
      } catch {
        // Giữ fallback tĩnh nếu API lỗi.
      }
    };

    fetchVideos();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setComponentVisible(entry.isIntersecting && entry.intersectionRatio >= 0.12);
      },
      { threshold: [0, 0.12, 0.35] }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const scrollByDir = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 240, behavior: "smooth" });
  };

  if (videoItems.length === 0) return null;

  const useScroll = videoItems.length > 4;

  return (
    <section ref={sectionRef} className="bg-white py-5">
      <h2 className="text-center text-xl md:text-2xl font-bold tracking-tight leading-6 uppercase text-gray-900 mb-4 sm:mb-6 md:mb-8 pt-2">
        Video Feedback Khách Hàng Univi
      </h2>

      {useScroll ? (
        /* ── SCROLL MODE ── */
        <div className="container mx-auto px-4">
          <div className="relative">
            <button onClick={() => scrollByDir(-1)} aria-label="Cuộn trái"
              className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#105d97]/90 border-0 text-white text-2xl cursor-pointer flex items-center justify-center shadow-md">
              ‹
            </button>
            <div ref={scrollRef}
              className="flex gap-3 overflow-x-auto scroll-snap-x pb-3 px-2"
              style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {videoItems.map((item) => (
                <div key={item.id} className="flex-none w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] md:w-[calc(25%-9px)]"
                  style={{ scrollSnapAlign: "start" }}>
                  <AnyVideoCard
                    item={item}
                    isActive={activeId === item.id}
                    onActivate={handleActivate}
                    onExpand={handleExpand}
                    modalOpen={!!modalItem}
                    componentVisible={componentVisible}
                  />
                </div>
              ))}
            </div>
            <button onClick={() => scrollByDir(1)} aria-label="Cuộn phải"
              className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#105d97]/90 border-0 text-white text-2xl cursor-pointer flex items-center justify-center shadow-md">
              ›
            </button>
          </div>
        </div>
      ) : (
        /* ── GRID MODE ── */
        <div className="container mx-auto px-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-[900px] mx-auto">
            {videoItems.map((item) => (
              <AnyVideoCard
                key={item.id}
                item={item}
                isActive={activeId === item.id}
                onActivate={handleActivate}
                onExpand={handleExpand}
                modalOpen={!!modalItem}
                componentVisible={componentVisible}
              />
            ))}
          </div>
        </div>
      )}

      {modalItem && <VideoModal item={modalItem} onClose={handleCloseModal} />}

      <style jsx>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
