import { FC, useEffect, useState, DragEvent } from "react";
import {
  FiImage,
  FiUploadCloud,
  FiTrash2,
  FiExternalLink,
  FiFolder,
  FiRefreshCw,
} from "react-icons/fi";
import R2ImageModal, { R2ImageSelectionResult } from "./R2ImageModal";

interface Props {
  initialValue?: string;
  onChange?(fileOrUrl: File | string): void;
  onImageFromGallery?(imageUrl: string): void;
  // Props tương thích ngược (nếu có component nào truyền vào)
  images?: any[];
  uploading?: boolean;
  onFileSelect?(imageData: any): void;
}

const ThumbnailSelector: FC<Props> = ({
  initialValue,
  onChange,
  onImageFromGallery,
}): JSX.Element => {
  const [selectedThumbnail, setSelectedThumbnail] = useState("");
  const [showR2Modal, setShowR2Modal] = useState(false);
  const [r2InitialTab, setR2InitialTab] = useState<"manage" | "upload">("upload");
  const [r2InitialFile, setR2InitialFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (typeof initialValue === "string") {
      setSelectedThumbnail(initialValue);
    }
  }, [initialValue]);

  const handleOpenR2 = (tab: "manage" | "upload" = "manage", file: File | null = null) => {
    setR2InitialTab(tab);
    setR2InitialFile(file);
    setShowR2Modal(true);
  };

  const handleR2Select = (result: R2ImageSelectionResult) => {
    if (result?.src) {
      setSelectedThumbnail(result.src);
      setShowR2Modal(false);
      setR2InitialFile(null);
      if (onChange) onChange(result.src);
      if (onImageFromGallery) onImageFromGallery(result.src);
    }
  };

  const handleRemove = () => {
    setSelectedThumbnail("");
    if (onChange) onChange("");
    if (onImageFromGallery) onImageFromGallery("");
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleOpenR2("upload", file);
    }
  };

  return (
    <div className="space-y-3">
      {/* Thanh công cụ: Thư mục R2 + Nút Chọn & Tải ảnh */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <FiFolder className="text-[#105d97]" size={14} />
          <span>Thư mục R2:</span>
          <span className="font-mono font-bold text-[#105d97] dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-2 py-0.5 rounded text-[11px]">
            thumbnail
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleOpenR2("manage")}
            className="text-xs px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#105d97] dark:bg-sky-950/60 dark:text-sky-300 rounded-lg font-bold flex items-center gap-1.5 transition-colors border border-sky-200 dark:border-sky-800 shadow-2xs"
            title="Chọn ảnh đại diện có sẵn từ thư mục thumbnail trên Cloudflare R2"
          >
            <FiImage size={13} />
            <span>Chọn từ R2</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenR2("upload")}
            className="text-xs px-2.5 py-1.5 bg-[#105d97] hover:bg-[#0c4a7c] text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Tải ảnh mới lên thư mục thumbnail trên Cloudflare R2"
          >
            <FiUploadCloud size={13} />
            <span>Tải ảnh lên R2</span>
          </button>
        </div>
      </div>

      {/* Khu vực hiển thị hoặc tải ảnh */}
      {selectedThumbnail ? (
        <div className="space-y-2">
          {/* Card Preview ảnh đại diện */}
          <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 group shadow-sm flex items-center justify-center min-h-[160px] max-h-[220px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedThumbnail}
              alt="Ảnh đại diện bài viết"
              className="max-h-[220px] w-full object-contain p-2 transition-transform duration-200 group-hover:scale-[1.02]"
            />

            {/* Badge R2 */}
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>R2 / thumbnail</span>
            </div>

            {/* Action overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
              <button
                type="button"
                onClick={() => handleOpenR2("manage")}
                className="px-3 py-1.5 bg-white text-gray-800 hover:text-[#105d97] rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FiRefreshCw size={13} />
                <span>Đổi ảnh</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenR2("upload")}
                className="px-3 py-1.5 bg-[#105d97] text-white hover:bg-[#0c4a7c] rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FiUploadCloud size={13} />
                <span>Tải ảnh mới</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs font-bold shadow-md transition-colors cursor-pointer"
                title="Xóa ảnh đại diện"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>

          {/* Dòng thao tác & link dưới ảnh */}
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenR2("manage")}
                className="font-semibold text-[#105d97] dark:text-sky-400 hover:underline cursor-pointer"
              >
                Chọn từ R2
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleOpenR2("upload")}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Tải ảnh mới
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleRemove}
                className="font-semibold text-red-500 hover:underline cursor-pointer"
              >
                Xóa ảnh
              </button>
            </div>

            <a
              href={selectedThumbnail}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-mono text-gray-500 hover:text-blue-600 hover:underline flex items-center gap-1 max-w-[200px] truncate"
              title={selectedThumbnail}
            >
              <span className="truncate">{selectedThumbnail}</span>
              <FiExternalLink size={11} className="shrink-0" />
            </a>
          </div>
        </div>
      ) : (
        /* Vùng tải ảnh trống (Dropzone) */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => handleOpenR2("upload")}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-[#105d97] bg-blue-50/60 dark:bg-gray-700/60 scale-[1.01]"
              : "border-gray-300 dark:border-gray-700 hover:border-[#105d97] bg-gray-50/50 dark:bg-gray-800/50 hover:bg-blue-50/20"
          }`}
        >
          <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-[#105d97] dark:text-sky-300 flex items-center justify-center shadow-inner">
            <FiUploadCloud size={24} />
          </div>
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
            Bấm để tải ảnh đại diện lên Cloudflare R2
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Lưu vào thư mục <span className="font-bold font-mono text-[#105d97] dark:text-sky-300">thumbnail</span> (hoặc kéo thả ảnh vào đây)
          </p>
          <div className="mt-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenR2("manage");
              }}
              className="text-xs font-semibold text-[#105d97] dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <FiImage size={13} />
              <span>Hoặc chọn ảnh đã có trong kho thumbnail</span>
            </button>
          </div>
        </div>
      )}

      {/* Cloudflare R2 Modal với thư mục thumbnail */}
      <R2ImageModal
        visible={showR2Modal}
        onClose={() => {
          setShowR2Modal(false);
          setR2InitialFile(null);
        }}
        onSelect={handleR2Select}
        initialFolder="thumbnail"
        initialTab={r2InitialTab}
        initialFile={r2InitialFile}
      />
    </div>
  );
};

export default ThumbnailSelector;
