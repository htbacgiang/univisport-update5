import { FC, useState, useRef, useEffect, DragEvent, ChangeEvent } from "react";
import axios from "axios";
import { AiOutlineCloudUpload } from "react-icons/ai";
import {
  FiImage,
  FiX,
  FiFolder,
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
  FiChevronRight,
  FiPlus,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";
import R2FolderSelect from "./R2FolderSelect";

export interface UploadSuccessPayload {
  url: string;
  key: string;
  altText?: string;
  caption?: string;
  width?: string;
  aspectRatio?: string;
  alignment?: "left" | "center" | "right";
  objectFit?: "cover" | "contain";
}

export interface UploaderFileItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  errorMessage?: string;
}

interface Props {
  folders: string[];
  selectedFolder: string;
  initialFile?: File | null;
  onFolderChange(folder: string): void;
  onFolderCreated(folder: string): void;
  onSuccess(payload: UploadSuccessPayload): void;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const R2ImageUploader: FC<Props> = ({
  folders,
  selectedFolder,
  initialFile = null,
  onFolderChange,
  onFolderCreated,
  onSuccess,
}) => {
  // Logic 2 bước: Nếu đã có selectedFolder hoặc có initialFile thì vào thẳng Bước 2 (Upload)
  const [step, setStep] = useState<1 | 2>(selectedFolder || initialFile ? 2 : 1);
  const userManuallyNavigatedStep1 = useRef(false);

  // Danh sách các file tải lên (hỗ trợ 1 hoặc nhiều ảnh)
  const [fileList, setFileList] = useState<UploaderFileItem[]>([]);
  const [targetFolder, setTargetFolder] = useState<string>(selectedFolder || "");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTargetFolder(selectedFolder || "");
  }, [selectedFolder]);

  useEffect(() => {
    if (initialFile) {
      addFiles([initialFile]);
      userManuallyNavigatedStep1.current = false;
      setStep(2);
    }
  }, [initialFile]);

  useEffect(() => {
    if (!userManuallyNavigatedStep1.current && (selectedFolder || initialFile)) {
      setStep(2);
    }
  }, [selectedFolder, initialFile]);

  const addFiles = (filesToAdd: File[]) => {
    const validFiles: UploaderFileItem[] = [];
    filesToAdd.forEach((f) => {
      if (!f.type.startsWith("image/")) {
        toast.error(`File "${f.name}" không phải hình ảnh hợp lệ!`);
        return;
      }
      validFiles.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
        name: f.name,
        size: f.size,
        status: "pending",
        progress: 0,
      });
    });

    if (validFiles.length > 0) {
      setFileList((prev) => {
        const next = [...prev, ...validFiles];
        if (next.length === 1 && !altText) {
          const nameWithoutExt = next[0].file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          setAltText(nameWithoutExt);
        }
        return next;
      });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
      e.target.value = "";
    }
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeFile = (id: string) => {
    setFileList((prev) => {
      const item = prev.find((it) => it.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((it) => it.id !== id);
    });
  };

  const clearSelection = () => {
    fileList.forEach((it) => {
      if (it.previewUrl) URL.revokeObjectURL(it.previewUrl);
    });
    setFileList([]);
    setAltText("");
    setCaption("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    const pendingItems = fileList.filter((it) => it.status === "pending" || it.status === "error");
    if (pendingItems.length === 0) {
      toast.error("Vui lòng chọn ảnh trước khi upload!");
      return;
    }

    setUploading(true);
    const dest = targetFolder || selectedFolder || "";
    let firstUploaded: { url: string; key: string } | null = null;
    let successCount = 0;

    for (let i = 0; i < pendingItems.length; i++) {
      const current = pendingItems[i];

      setFileList((prev) =>
        prev.map((it) => (it.id === current.id ? { ...it, status: "uploading", progress: 15 } : it))
      );

      try {
        // 1. Presigned URL
        const { data: presignedData } = await axios.post("/api/r2/upload", {
          filename: current.file.name,
          contentType: current.file.type || "application/octet-stream",
          folder: dest,
        });

        let finalUrl = presignedData.publicUrl;
        let finalKey = presignedData.key;

        // 2. Direct PUT lên R2
        let directSuccess = false;
        try {
          await axios.put(presignedData.uploadUrl, current.file, {
            headers: {
              "Content-Type": current.file.type || "application/octet-stream",
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setFileList((prev) =>
                  prev.map((it) => (it.id === current.id ? { ...it, progress: percent } : it))
                );
              }
            },
          });
          directSuccess = true;
        } catch (directErr) {
          console.warn("Direct upload gặp lỗi, chuyển sang proxy upload:", directErr);
          const formData = new FormData();
          formData.append("file", current.file);
          formData.append("folder", dest);

          const { data: proxyData } = await axios.post("/api/r2/upload-proxy", formData, {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setFileList((prev) =>
                  prev.map((it) => (it.id === current.id ? { ...it, progress: percent } : it))
                );
              }
            },
          });

          if (proxyData?.publicUrl) {
            finalUrl = proxyData.publicUrl;
            finalKey = proxyData.key;
            directSuccess = true;
          }
        }

        if (directSuccess) {
          successCount++;
          if (!firstUploaded) {
            firstUploaded = { url: finalUrl, key: finalKey };
          }
          setFileList((prev) =>
            prev.map((it) => (it.id === current.id ? { ...it, status: "success", progress: 100 } : it))
          );
        }
      } catch (err: any) {
        console.error("Lỗi khi upload ảnh:", err);
        setFileList((prev) =>
          prev.map((it) =>
            it.id === current.id
              ? { ...it, status: "error", errorMessage: err.response?.data?.error || err.message || "Lỗi tải ảnh" }
              : it
          )
        );
      }
    }

    setUploading(false);

    if (successCount > 0 && firstUploaded) {
      toast.success(`Upload thành công ${successCount}/${pendingItems.length} ảnh lên Cloudflare R2!`);
      // Callback cho parent component
      onSuccess({
        url: firstUploaded.url,
        key: firstUploaded.key,
        altText: altText.trim(),
        caption: caption.trim(),
      });
      clearSelection();
    }
  };

  return (
    <div className="space-y-4">
      {/* Thanh tiến trình 2 bước trực quan */}
      <div className="flex items-center gap-2 p-2 bg-slate-100/90 dark:bg-gray-750 rounded-xl border border-slate-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => {
            userManuallyNavigatedStep1.current = true;
            setStep(1);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            step === 1
              ? "bg-[#105d97] text-white shadow-sm"
              : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700"
          }`}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 2 ? "bg-white/20 text-white" : "bg-emerald-500 text-white"
            }`}
          >
            {step === 2 ? <FiCheck size={12} /> : "1"}
          </span>
          <span>1. Chọn thư mục lưu</span>
        </button>

        <FiChevronRight className="text-gray-400 shrink-0" size={14} />

        <button
          type="button"
          onClick={() => {
            userManuallyNavigatedStep1.current = false;
            setStep(2);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            step === 2
              ? "bg-[#105d97] text-white shadow-sm"
              : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700"
          }`}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 2 ? "bg-white/20 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            }`}
          >
            2
          </span>
          <span>2. Tải ảnh lên R2 (Hỗ trợ nhiều ảnh)</span>
        </button>
      </div>

      {/* ── BƯỚC 1: CHỌN THƯ MỤC LƯU TRỮ ── */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-xl flex items-start gap-2.5">
            <FiFolder className="w-4 h-4 text-[#105d97] dark:text-sky-400 mt-0.5 shrink-0" />
            <div className="text-xs text-sky-900 dark:text-sky-200 space-y-0.5">
              <p className="font-bold">Bước 1: Chọn thư mục lưu trữ ảnh trên Cloudflare R2</p>
              <p className="text-[11px] text-sky-700 dark:text-sky-300">
                Mặc định hiển thị tất cả thư mục. Bạn có thể chọn thư mục mong muốn hoặc tạo thư mục mới, sau đó bấm{" "}
                <strong>&quot;Xác nhận thư mục này &amp; Tiếp tục tải ảnh&quot;</strong>.
              </p>
            </div>
          </div>

          {/* Component duyệt folder R2 */}
          <div className="bg-gray-50 dark:bg-gray-750/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <R2FolderSelect
              selectedFolder={targetFolder}
              folders={folders}
              onChange={(f) => {
                setTargetFolder(f);
                onFolderChange(f);
              }}
              onFolderCreated={onFolderCreated}
              label="Chọn thư mục lưu trữ:"
              allowAllOption={true}
            />
          </div>

          {/* Thanh xác nhận thư mục */}
          <div className="p-3.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Thư mục đang chọn:</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#105d97] dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-3 py-1 rounded-lg">
                <FiFolder className="w-3.5 h-3.5 text-[#105d97]" />
                {targetFolder || "Thư mục gốc (/)"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                userManuallyNavigatedStep1.current = false;
                setStep(2);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#105d97] hover:bg-[#0c4a7c] text-white font-bold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <FiCheck className="w-4 h-4" />
              <span>Xác nhận thư mục này &amp; Tiếp tục tải ảnh</span>
              <FiArrowRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── BƯỚC 2: TẢI ẢNH LÊN THƯ MỤC ĐÃ CHỌN ── */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Thông tin thư mục với khả năng đổi nhanh thư mục */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs font-medium text-emerald-900 dark:text-emerald-300">
                Lưu vào thư mục:
              </span>
              <select
                value={targetFolder}
                onChange={(e) => {
                  setTargetFolder(e.target.value);
                  onFolderChange(e.target.value);
                }}
                disabled={uploading}
                className="text-xs font-bold px-2.5 py-1 bg-white dark:bg-gray-800 border border-emerald-300 dark:border-emerald-700 rounded-lg text-emerald-900 dark:text-emerald-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">📁 Thư mục gốc (/)</option>
                {folders.map((f) => (
                  <option key={f} value={f}>
                    📁 {f}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              disabled={uploading}
              onClick={() => {
                userManuallyNavigatedStep1.current = true;
                setStep(1);
              }}
              className="text-xs font-semibold text-[#105d97] dark:text-sky-400 hover:underline flex items-center gap-1 disabled:opacity-50 cursor-pointer"
            >
              <FiArrowLeft size={13} />
              <span>Duyệt thư mục đầy đủ</span>
            </button>
          </div>

          {/* Vùng Drag & Drop */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />

          {fileList.length === 0 ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-[#105d97] bg-blue-50/50 dark:bg-gray-700/60 scale-[1.01]"
                  : "border-gray-300 dark:border-gray-600 hover:border-[#105d97] bg-gray-50/50 dark:bg-gray-800/50 hover:bg-blue-50/20"
              }`}
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center text-[#105d97]">
                <AiOutlineCloudUpload size={36} />
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Kéo và thả nhiều ảnh vào đây, hoặc <span className="text-[#105d97] underline">chọn file từ máy tính</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Hỗ trợ chọn nhiều ảnh cùng lúc: JPG, PNG, WEBP, GIF, SVG (Tải lên Cloudflare R2 / {targetFolder || "gốc"})
              </p>
            </div>
          ) : fileList.length === 1 ? (
            /* Trường hợp chọn 1 ảnh: Giao diện chi tiết kèm Alt text & Caption */
            <div className="space-y-4 bg-gray-50 dark:bg-gray-750 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative w-36 h-36 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fileList[0].previewUrl}
                    alt="Xem trước"
                    className="w-full h-full object-contain"
                  />
                  {!uploading && (
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                      title="Hủy chọn ảnh"
                    >
                      <FiX size={14} />
                    </button>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                    <span className="font-semibold truncate max-w-[200px]" title={fileList[0].name}>
                      {fileList[0].name}
                    </span>
                    <span>{formatBytes(fileList[0].size)}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mô tả ảnh (Alt text):
                    </label>
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Mô tả cho ảnh..."
                      disabled={uploading}
                      className="w-full text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#105d97]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Chú thích hiển thị (Caption - tùy chọn):
                    </label>
                    <input
                      type="text"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Chú thích ảnh..."
                      disabled={uploading}
                      className="w-full text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#105d97]"
                    />
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              {uploading && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-300">
                    <span>Đang upload trực tiếp lên R2...</span>
                    <span>{fileList[0].progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#105d97] h-2 rounded-full transition-all duration-200 ease-out"
                      style={{ width: `${fileList[0].progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Nút hành động */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-3 py-1.5 text-xs font-medium text-[#105d97] dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <FiPlus size={14} />
                  <span>Chọn thêm nhiều ảnh nữa</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={clearSelection}
                    disabled={uploading}
                    className="px-4 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer disabled:opacity-50"
                  >
                    Chọn file khác
                  </button>
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#105d97] hover:bg-[#0c4672] rounded-lg transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <AiOutlineCloudUpload size={16} />
                    <span>{uploading ? `Đang tải lên (${fileList[0].progress}%)` : "Tải lên Cloudflare R2"}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Trường hợp chọn nhiều ảnh: Danh sách danh mục ảnh kèm thanh tiến trình từng file */
            <div className="space-y-4 bg-gray-50 dark:bg-gray-750 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  Danh sách {fileList.length} ảnh đã chọn ({formatBytes(fileList.reduce((acc, it) => acc + it.size, 0))})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="text-xs font-semibold text-[#105d97] dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <FiPlus size={13} />
                    <span>Thêm ảnh khác</span>
                  </button>
                  <button
                    type="button"
                    onClick={clearSelection}
                    disabled={uploading}
                    className="text-xs text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                  >
                    Xóa tất cả
                  </button>
                </div>
              </div>

              {/* Grid các file được chọn */}
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {fileList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-100 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <p className="font-semibold text-gray-800 dark:text-gray-200 truncate pr-2" title={item.name}>
                          {item.name}
                        </p>
                        <span className="text-[10px] text-gray-400 shrink-0">{formatBytes(item.size)}</span>
                      </div>

                      <div className="mt-1 flex items-center justify-between">
                        {item.status === "pending" && (
                          <span className="text-[10px] text-gray-500 font-medium">Sẵn sàng tải lên</span>
                        )}
                        {item.status === "uploading" && (
                          <div className="w-full flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#105d97] h-full transition-all duration-150"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-[#105d97]">{item.progress}%</span>
                          </div>
                        )}
                        {item.status === "success" && (
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                            <FiCheckCircle size={12} /> Đã tải lên R2
                          </span>
                        )}
                        {item.status === "error" && (
                          <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 inline-flex items-center gap-1">
                            <FiAlertCircle size={12} /> {item.errorMessage || "Lỗi tải ảnh"}
                          </span>
                        )}
                      </div>
                    </div>

                    {!uploading && item.status !== "success" && (
                      <button
                        type="button"
                        onClick={() => removeFile(item.id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                        title="Xóa ảnh này"
                      >
                        <FiX size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Nút hành động */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  onClick={clearSelection}
                  disabled={uploading}
                  className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading || fileList.filter((it) => it.status === "pending" || it.status === "error").length === 0}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#105d97] hover:bg-[#0c4672] rounded-lg transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <AiOutlineCloudUpload size={16} />
                  <span>
                    {uploading
                      ? "Đang tải ảnh lên..."
                      : `Bắt đầu tải lên (${fileList.filter((it) => it.status === "pending" || it.status === "error").length} ảnh)`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default R2ImageUploader;

