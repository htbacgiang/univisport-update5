import { FC, useCallback, useRef, useState } from "react";
import Button from "./Button";
import axios from "axios";
import { toast } from "react-toastify";
import useOutsideClick from "./useOutsideClick";

interface AdBannerOptions {
  src: string;
  href: string;
  alt?: string;
}

interface Props {
  onSubmit(options: AdBannerOptions): void;
  onToggle?(isOpen: boolean): void;
}

// Icon banner quảng cáo ngang
const BannerIcon: FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <title>Chèn banner quảng cáo</title>
    {/* Hình chữ nhật ngang đại diện banner */}
    <rect x="2" y="6" width="20" height="12" rx="2" />
    {/* Icon ảnh bên trái */}
    <circle cx="7" cy="12" r="2" />
    {/* Đường link bên phải */}
    <path d="M12 10h6M12 14h4" />
  </svg>
);

const InsertAdBanner: FC<Props> = ({ onSubmit, onToggle }): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [altText, setAltText] = useState("Quảng cáo");
  const [tab, setTab] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const hideForm = useCallback(() => {
    setVisible(false);
    onToggle?.(false);
  }, [onToggle]);

  useOutsideClick(containerRef, visible, hideForm);

  const showForm = () => {
    setVisible(true);
    onToggle?.(true);
  };

  const handleSubmit = () => {
    const src = imageUrl.trim();
    const href = linkUrl.trim();
    if (!src) {
      toast.error("Vui lòng nhập URL ảnh hoặc upload ảnh banner!");
      return;
    }
    if (!href) {
      toast.error("Vui lòng nhập URL trang đích!");
      return;
    }
    onSubmit({ src, href, alt: altText.trim() || "Quảng cáo" });
    // Reset
    setImageUrl("");
    setLinkUrl("");
    setAltText("Quảng cáo");
    setPreview("");
    hideForm();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ hỗ trợ ảnh JPG, PNG, GIF, WebP!");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("altText", altText || "Quảng cáo");

      const { data } = await axios.post("/api/image", formData);
      const uploadedUrl = data.src;
      setImageUrl(uploadedUrl);
      setPreview(uploadedUrl);
      toast.success("Upload ảnh banner thành công!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Lỗi upload ảnh!");
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onKeyDown={({ key }) => {
        if (key === "Escape") hideForm();
      }}
    >
      <Button onClick={visible ? hideForm : showForm}>
        <BannerIcon />
      </Button>

      {visible && (
        <div
          className="absolute top-full mt-2 left-0 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4"
          style={{ minWidth: "360px", maxWidth: "440px" }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-orange-500">
              <BannerIcon />
            </span>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
              Chèn Banner Quảng Cáo
            </h3>
          </div>

          {/* Tab chọn nguồn ảnh */}
          <div className="flex gap-1 mb-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setTab("url")}
              className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
                tab === "url"
                  ? "bg-white dark:bg-gray-600 text-orange-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              🔗 URL ảnh
            </button>
            <button
              type="button"
              onClick={() => setTab("upload")}
              className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
                tab === "upload"
                  ? "bg-white dark:bg-gray-600 text-orange-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              📁 Upload ảnh
            </button>
          </div>

          {/* Nội dung theo tab */}
          {tab === "url" ? (
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                URL ảnh (.jpg / .png / .gif)
              </label>
              <input
                autoFocus
                type="text"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreview(e.target.value);
                }}
                placeholder="https://example.com/banner.jpg"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              />
            </div>
          ) : (
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Tải ảnh lên (.jpg / .png / .gif)
              </label>
              <div
                className="border-2 border-dashed border-orange-300 dark:border-orange-600 rounded-lg p-3 text-center cursor-pointer hover:border-orange-500 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? (
                  <div className="flex items-center justify-center gap-2 text-orange-500">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-xs">Đang upload...</span>
                  </div>
                ) : (
                  <div className="text-gray-400 text-xs">
                    <div className="text-2xl mb-1">🖼️</div>
                    <div>Click để chọn ảnh banner</div>
                    <div className="text-gray-300 mt-0.5">JPG, PNG, GIF · Khuyến nghị 1200×300px</div>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleFileUpload}
              />
              {imageUrl && tab === "upload" && (
                <p className="text-xs text-green-600 mt-1 truncate">✓ {imageUrl}</p>
              )}
            </div>
          )}

          {/* Preview ảnh */}
          {preview && (
            <div className="mb-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview banner"
                className="w-full h-16 object-cover"
                onError={() => setPreview("")}
              />
            </div>
          )}

          {/* URL trang đích */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              URL trang đích (khi click vào banner)
            </label>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://dongphucunivi.com/san-pham"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </div>

          {/* Alt text */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Mô tả ảnh (Alt text)
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Quảng cáo sản phẩm..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Chèn Banner
            </button>
            <button
              type="button"
              onClick={hideForm}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsertAdBanner;
