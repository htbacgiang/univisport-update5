import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { FiVideo, FiRefreshCw, FiX, FiSearch, FiCheck } from "react-icons/fi";
import { BsPlayFill } from "react-icons/bs";
import Button from "./Button";
import useOutsideClick from "./useOutsideClick";

export interface CloudinaryVideoItem {
  id: string;
  name: string;
  src: string;
  thumbnail: string;
  duration?: number;
  aspectRatio?: "square" | "vertical" | "horizontal";
  format?: string;
  bytes?: number;
}

interface Props {
  onSubmit(video: CloudinaryVideoItem): void;
  onToggle?(isOpen: boolean): void;
  selectedVideo?: { src?: string } | null;
  open?: boolean;
  hideTrigger?: boolean;
  centered?: boolean;
}

const formatDuration = (duration?: number): string => {
  if (!duration) return "";
  const seconds = Math.round(duration);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

const formatBytes = (bytes?: number): string => {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

const getRatioLabel = (ratio?: CloudinaryVideoItem["aspectRatio"]): string => {
  if (ratio === "vertical") return "Dọc 9:16";
  if (ratio === "square") return "Vuông 1:1";
  return "Ngang 16:9";
};

const EmbedCloudinaryVideo: FC<Props> = ({
  onSubmit,
  onToggle,
  selectedVideo,
  open,
  hideTrigger = false,
  centered = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(open ?? false);
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<CloudinaryVideoItem[]>([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [ratioFilter, setRatioFilter] = useState<"all" | "horizontal" | "vertical" | "square">("all");

  const hideForm = useCallback(() => {
    setVisible(false);
    onToggle?.(false);
  }, [onToggle]);

  useOutsideClick(containerRef, visible, hideForm, centered ? popupRef : undefined);

  const loadVideos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/api/cloudinary-videos");
      setVideos(data.videos || []);
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || "Không thể tải danh sách video từ Cloudinary.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open === undefined) return;
    setVisible(open);
    if (open && videos.length === 0) loadVideos();
  }, [open, videos.length, loadVideos]);

  useEffect(() => {
    if (!visible) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") hideForm();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [visible, hideForm]);



  // Bộ lọc video theo tìm kiếm & tỷ lệ khung hình
  const filteredVideos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return videos.filter((video) => {
      const matchSearch = !q || video.name.toLowerCase().includes(q);
      const matchRatio = ratioFilter === "all" || video.aspectRatio === ratioFilter;
      return matchSearch && matchRatio;
    });
  }, [videos, searchQuery, ratioFilter]);

  const countHorizontal = useMemo(
    () => videos.filter((v) => v.aspectRatio === "horizontal").length,
    [videos]
  );
  const countVertical = useMemo(
    () => videos.filter((v) => v.aspectRatio === "vertical").length,
    [videos]
  );
  const countSquare = useMemo(
    () => videos.filter((v) => v.aspectRatio === "square").length,
    [videos]
  );

  const modalContent = (
    <div
      ref={popupRef}
      onClick={(e) => e.stopPropagation()}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-200 ${
        centered
          ? "w-full max-w-4xl max-h-[88vh] my-auto"
          : "absolute right-0 top-full z-50 mt-2.5 w-[min(94vw,860px)] max-h-[82vh]"
      }`}
    >
      {/* Header modal */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#105d97] dark:text-blue-400 flex items-center justify-center shadow-2xs">
            <FiVideo size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Chọn video Cloudinary
              </h3>
              <span className="text-[10px] font-semibold bg-blue-100 text-[#105d97] dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded-full">
                videounivi
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Chọn video sẵn có trong thư viện Cloudinary để chèn vào nội dung bài viết
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={loadVideos}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-650 border border-gray-300 dark:border-gray-600 rounded-lg transition-all cursor-pointer shadow-2xs"
            title="Tải lại danh sách video"
          >
            <FiRefreshCw size={13} className={loading ? "animate-spin text-[#105d97]" : ""} />
            <span>Làm mới</span>
          </button>

          <button
            type="button"
            onClick={hideForm}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
            aria-label="Đóng popup"
            title="Đóng (Esc)"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>

      {/* Toolbar: Tìm kiếm & Lọc tỷ lệ khung hình */}
      <div className="px-5 py-2.5 border-b border-gray-100 dark:border-gray-700/80 bg-white dark:bg-gray-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Input tìm kiếm */}
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm video theo tên..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#105d97] focus:bg-white dark:focus:bg-gray-700"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        {/* Tabs tỷ lệ */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0">
          <button
            type="button"
            onClick={() => setRatioFilter("all")}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              ratioFilter === "all"
                ? "bg-[#105d97] text-white shadow-2xs font-semibold"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Tất cả ({videos.length})
          </button>

          <button
            type="button"
            onClick={() => setRatioFilter("horizontal")}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              ratioFilter === "horizontal"
                ? "bg-[#105d97] text-white shadow-2xs font-semibold"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Ngang 16:9 ({countHorizontal})
          </button>

          <button
            type="button"
            onClick={() => setRatioFilter("vertical")}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              ratioFilter === "vertical"
                ? "bg-[#105d97] text-white shadow-2xs font-semibold"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Dọc 9:16 ({countVertical})
          </button>

          <button
            type="button"
            onClick={() => setRatioFilter("square")}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              ratioFilter === "square"
                ? "bg-[#105d97] text-white shadow-2xs font-semibold"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Vuông 1:1 ({countSquare})
          </button>
        </div>
      </div>

      {/* Body: Danh sách Video */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar min-h-[260px] max-h-[60vh] bg-gray-50/50 dark:bg-gray-850/50">
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 space-y-2 animate-pulse"
              >
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="py-14 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center">
              <FiX size={24} />
            </div>
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>
            <button
              type="button"
              onClick={loadVideos}
              className="mt-3 px-3.5 py-1.5 text-xs bg-[#105d97] text-white rounded-lg hover:bg-[#0c4672] font-semibold cursor-pointer shadow-2xs"
            >
              Thử lại
            </button>
          </div>
        )}

        {!loading && !error && filteredVideos.length === 0 && (
          <div className="py-14 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800/60">
            <div className="w-14 h-14 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-full flex items-center justify-center">
              <FiVideo size={26} />
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {searchQuery
                ? `Không tìm thấy video nào phù hợp với "${searchQuery}"`
                : "Chưa có video trong thư mục videounivi."}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {searchQuery ? "Vui lòng thử từ khóa tìm kiếm khác" : "Hãy tải video lên Cloudinary thư mục videounivi"}
            </p>
          </div>
        )}

        {!loading && !error && filteredVideos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredVideos.map((video) => {
              const isSelected = selectedVideo?.src === video.src;

              return (
                <button
                  type="button"
                  key={video.id}
                  onClick={() => {
                    onSubmit(video);
                    hideForm();
                  }}
                  className={`group relative flex flex-col rounded-xl border text-left transition-all duration-200 cursor-pointer overflow-hidden bg-white dark:bg-gray-800 hover:shadow-md hover:-translate-y-0.5 ${
                    isSelected
                      ? "border-[#105d97] ring-2 ring-[#105d97] shadow-sm bg-blue-50/30 dark:bg-blue-950/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-[#105d97]/60"
                  }`}
                  title={`Chọn ${video.name}`}
                >
                  {/* Thumbnail container tỷ lệ 16:9 chuẩn */}
                  <div className="relative aspect-video w-full bg-black/90 overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={video.thumbnail}
                      alt={video.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Badge tỷ lệ khung hình góc trên bên trái */}
                    <span className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-xs text-white text-[9px] font-semibold px-1.5 py-0.5 rounded shadow-xs">
                      {getRatioLabel(video.aspectRatio)}
                    </span>

                    {/* Huy hiệu tích chọn nếu là video đang được chọn */}
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#105d97] text-white flex items-center justify-center text-[11px] shadow-sm">
                        <FiCheck strokeWidth={3} />
                      </span>
                    )}

                    {/* Badge thời lượng góc dưới bên phải */}
                    {video.duration && (
                      <span className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow-xs">
                        {formatDuration(video.duration)}
                      </span>
                    )}

                    {/* Nút Play tròn ở giữa khi hover */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-[#105d97] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-200">
                        <BsPlayFill size={24} className="ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Thông tin video bên dưới */}
                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <p
                      className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-[#105d97] transition-colors leading-tight"
                      title={video.name}
                    >
                      {video.name}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">
                      <span>{video.format ? video.format.toUpperCase() : "VIDEO"}</span>
                      {video.bytes && <span>{formatBytes(video.bytes)}</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer modal */}
      <div className="px-5 py-2.5 border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div>
          Đang hiển thị{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {filteredVideos.length}
          </span>{" "}
          / {videos.length} video
        </div>
        <div className="text-[11px]">
          Nhấp vào video để chèn trực tiếp vào bài viết
        </div>
      </div>
    </div>
  );

  const popup = visible ? (
    centered ? (
      <div
        className="fixed inset-0 z-[100000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
        onClick={hideForm}
      >
        {modalContent}
      </div>
    ) : (
      modalContent
    )
  ) : null;

  return (
    <div ref={containerRef} className="relative">
      {!hideTrigger && (
        <Button
          onClick={
            visible
              ? hideForm
              : () => {
                  setVisible(true);
                  onToggle?.(true);
                  if (videos.length === 0) loadVideos();
                }
          }
        >
          <FiVideo title="Chọn video Cloudinary" />
        </Button>
      )}
      {centered && typeof document !== "undefined"
        ? createPortal(popup, document.body)
        : popup}
    </div>
  );
};

export default EmbedCloudinaryVideo;
