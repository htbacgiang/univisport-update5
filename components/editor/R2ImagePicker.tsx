import { FC, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import {
  FiTrash2,
  FiEdit3,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiFolder,
  FiAlertTriangle,
  FiCornerUpRight,
  FiPlus,
  FiUploadCloud,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FcFolder } from "react-icons/fc";
import { BsCardImage } from "react-icons/bs";
import { toast } from "react-toastify";
import R2FolderSelect, { getFolderName, getParentFolder } from "./R2FolderSelect";

export interface UploadQueueItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  errorMessage?: string;
}

export interface R2ImageItem {
  key: string;
  url: string;
  size: number;
  lastModified: string | null;
}

export interface ImageSelectPayload {
  url: string;
  key: string;
  altText?: string;
  caption?: string;
  width?: string;
  aspectRatio?: string;
  alignment?: "left" | "center" | "right";
  objectFit?: "cover" | "contain";
  objectPosition?: string;
}

interface Props {
  folders: string[];
  selectedFolder: string;
  onFolderChange(folder: string): void;
  onFolderCreated(folder: string): void;
  onFolderRenamed(oldFolder: string, newFolder: string): void;
  onSelect(payload: ImageSelectPayload): void;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Lấy tên thư mục cha từ key (ví dụ: "banners/h-pilates.png" -> "banners", "h-pilates.png" -> "")
 */
const getFolderFromKey = (key: string): string => {
  const parts = key.split("/");
  if (parts.length > 1) {
    return parts.slice(0, -1).join("/");
  }
  return "";
};

const R2ImagePicker: FC<Props> = ({
  folders,
  selectedFolder,
  onFolderChange,
  onFolderCreated,
  onFolderRenamed,
  onSelect,
}) => {
  const [images, setImages] = useState<R2ImageItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Popup xác nhận xóa ảnh
  const [imageToDelete, setImageToDelete] = useState<R2ImageItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Popup di chuyển ảnh sang thư mục khác
  const [imageToMove, setImageToMove] = useState<R2ImageItem | null>(null);
  const [targetMoveFolder, setTargetMoveFolder] = useState<string>("");
  const [isMoving, setIsMoving] = useState(false);

  // Trạng thái đổi tên thư mục
  const [isRenamingFolder, setIsRenamingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renamingLoading, setRenamingLoading] = useState(false);

  // Trạng thái chọn ảnh để xem chi tiết & chèn
  const [activeImage, setActiveImage] = useState<R2ImageItem | null>(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [insertWidth, setInsertWidth] = useState<string>("100%");
  const [insertRatio, setInsertRatio] = useState<string>("auto");
  const [insertAlign, setInsertAlign] = useState<"left" | "center" | "right">("center");
  const [insertCropPos, setInsertCropPos] = useState<string>("50% 50%");

  // Popup tải ảnh & upload nhiều ảnh cùng lúc
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [popupFolder, setPopupFolder] = useState<string>(selectedFolder || "");
  const [isCreatingPopupFolder, setIsCreatingPopupFolder] = useState(false);
  const [newPopupFolderName, setNewPopupFolderName] = useState("");
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [isUploadingBatch, setIsUploadingBatch] = useState(false);
  const [isDraggingPopup, setIsDraggingPopup] = useState(false);
  const [isDraggingOverUploadCard, setIsDraggingOverUploadCard] = useState(false);
  const popupFileInputRef = useRef<HTMLInputElement>(null);

  // Thêm file vào danh sách chờ upload
  const addFilesToQueue = (fileList: FileList | File[]) => {
    const newItems: UploadQueueItem[] = [];
    Array.from(fileList).forEach((f) => {
      if (!f.type.startsWith("image/")) {
        toast.warning(`File "${f.name}" không phải định dạng ảnh hợp lệ.`);
        return;
      }
      newItems.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
        name: f.name,
        size: f.size,
        status: "pending",
        progress: 0,
      });
    });
    if (newItems.length > 0) {
      setUploadQueue((prev) => [...prev, ...newItems]);
    }
  };

  // Xóa 1 file khỏi hàng đợi
  const removeQueueItem = (id: string) => {
    setUploadQueue((prev) => {
      const item = prev.find((it) => it.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((it) => it.id !== id);
    });
  };

  // Dọn sạch hàng đợi
  const clearUploadQueue = () => {
    uploadQueue.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setUploadQueue([]);
  };

  // Tạo thư mục mới nhanh trong popup upload
  const handleCreatePopupFolder = () => {
    const clean = newPopupFolderName.trim().toLowerCase();
    if (!clean) {
      toast.error("Vui lòng nhập tên thư mục mới");
      return;
    }
    onFolderCreated(clean);
    setPopupFolder(clean);
    setIsCreatingPopupFolder(false);
    setNewPopupFolderName("");
    toast.success(`Đã chọn thư mục mới "${clean}"`);
  };

  // Upload toàn bộ danh sách ảnh đã chọn
  const handleBatchUpload = async () => {
    const pendingItems = uploadQueue.filter((it) => it.status === "pending" || it.status === "error");
    if (pendingItems.length === 0) {
      toast.info("Vui lòng chọn ít nhất một file ảnh để tải lên!");
      return;
    }

    setIsUploadingBatch(true);
    const targetDest = popupFolder || selectedFolder || "";
    let successCount = 0;

    for (let i = 0; i < pendingItems.length; i++) {
      const currentItem = pendingItems[i];

      setUploadQueue((prev) =>
        prev.map((it) => (it.id === currentItem.id ? { ...it, status: "uploading", progress: 15 } : it))
      );

      try {
        // 1. Lấy presigned URL từ server
        const { data: presignedData } = await axios.post("/api/r2/upload", {
          filename: currentItem.file.name,
          contentType: currentItem.file.type || "application/octet-stream",
          folder: targetDest,
        });

        // 2. Upload trực tiếp PUT lên R2
        let directSuccess = false;
        try {
          await axios.put(presignedData.uploadUrl, currentItem.file, {
            headers: {
              "Content-Type": currentItem.file.type || "application/octet-stream",
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadQueue((prev) =>
                  prev.map((it) => (it.id === currentItem.id ? { ...it, progress: percent } : it))
                );
              }
            },
          });
          directSuccess = true;
        } catch (directErr) {
          console.warn("Direct upload gặp lỗi, tự động chuyển sang upload qua proxy:", directErr);
          const formData = new FormData();
          formData.append("file", currentItem.file);
          formData.append("folder", targetDest);

          await axios.post("/api/r2/upload-proxy", formData, {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadQueue((prev) =>
                  prev.map((it) => (it.id === currentItem.id ? { ...it, progress: percent } : it))
                );
              }
            },
          });
          directSuccess = true;
        }

        if (directSuccess) {
          successCount++;
          setUploadQueue((prev) =>
            prev.map((it) => (it.id === currentItem.id ? { ...it, status: "success", progress: 100 } : it))
          );
        }
      } catch (err: any) {
        console.error(`Upload error for file ${currentItem.name}:`, err);
        setUploadQueue((prev) =>
          prev.map((it) =>
            it.id === currentItem.id
              ? { ...it, status: "error", errorMessage: err.response?.data?.error || err.message || "Lỗi tải ảnh" }
              : it
          )
        );
      }
    }

    setIsUploadingBatch(false);
    if (successCount > 0) {
      toast.success(`Đã tải lên thành công ${successCount}/${pendingItems.length} ảnh vào "${targetDest || "Gốc"}"!`);
      // Làm mới danh sách ảnh thư viện
      fetchImages();
      // Nếu tất cả thành công, tự động đóng popup sau 1 giây
      if (successCount === pendingItems.length) {
        setTimeout(() => {
          setShowUploadPopup(false);
          clearUploadQueue();
        }, 1000);
      }
    }
  };

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const folderQuery = selectedFolder ? `?folder=${encodeURIComponent(selectedFolder)}` : "";
      const { data } = await axios.get(`/api/r2/list${folderQuery}`);
      setImages(data.items || []);
    } catch (err: any) {
      console.error("Lỗi lấy danh sách ảnh R2:", err);
      toast.error(err.response?.data?.error || "Không thể tải danh sách ảnh R2");
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [selectedFolder]);

  useEffect(() => {
    fetchImages();
    setActiveImage(null);
  }, [fetchImages]);

  // Thực hiện xóa ảnh sau khi người dùng xác nhận trên Popup
  const handleConfirmDelete = async () => {
    if (!imageToDelete) return;
    setIsDeleting(true);
    try {
      await axios.post("/api/r2/delete", { key: imageToDelete.key });
      toast.success("Đã xóa ảnh thành công!");
      setImages((prev) => prev.filter((item) => item.key !== imageToDelete.key));
      if (activeImage?.key === imageToDelete.key) {
        setActiveImage(null);
      }
      setImageToDelete(null);
    } catch (err: any) {
      console.error("Lỗi khi xóa ảnh R2:", err);
      toast.error(err.response?.data?.error || "Xóa ảnh thất bại");
    } finally {
      setIsDeleting(false);
    }
  };

  // Di chuyển ảnh sang thư mục khác
  const handleMoveImage = async (imageKey: string, destFolder: string) => {
    const curFolder = getFolderFromKey(imageKey);
    if (curFolder === destFolder) {
      toast.info("Ảnh đã ở trong thư mục này rồi!");
      return;
    }

    setIsMoving(true);
    try {
      const { data } = await axios.post("/api/r2/move", {
        key: imageKey,
        targetFolder: destFolder,
      });

      toast.success(data.message || `Đã chuyển ảnh sang "${destFolder || "Thư mục gốc"}"!`);

      // Cập nhật danh sách ảnh tại giao diện
      if (selectedFolder === "") {
        // Đang xem Tất cả ảnh: cập nhật key và url mới
        setImages((prev) =>
          prev.map((item) =>
            item.key === imageKey ? { ...item, key: data.newKey, url: data.url } : item
          )
        );
      } else {
        // Đang xem 1 thư mục cụ thể: xóa ảnh này khỏi danh sách thư mục hiện tại
        setImages((prev) => prev.filter((item) => item.key !== imageKey));
      }

      // Cập nhật activeImage nếu đang chọn ảnh này
      if (activeImage?.key === imageKey) {
        setActiveImage((prev) =>
          prev ? { ...prev, key: data.newKey, url: data.url } : null
        );
      }

      setImageToMove(null);
    } catch (err: any) {
      console.error("Lỗi khi chuyển ảnh sang thư mục khác:", err);
      toast.error(err.response?.data?.error || "Không thể di chuyển ảnh sang thư mục khác");
    } finally {
      setIsMoving(false);
    }
  };

  // Đổi tên thư mục
  const handleRenameFolder = async () => {
    const cleanNew = newFolderName.trim().toLowerCase();
    if (!cleanNew) {
      toast.error("Vui lòng nhập tên thư mục mới");
      return;
    }
    if (cleanNew === selectedFolder) {
      setIsRenamingFolder(false);
      return;
    }

    setRenamingLoading(true);
    try {
      const { data } = await axios.post("/api/r2/rename-folder", {
        oldFolder: selectedFolder,
        newFolder: cleanNew,
      });

      toast.success(data.message || `Đã đổi tên thành "${cleanNew}"`);
      const old = selectedFolder;
      onFolderRenamed(old, cleanNew);
      onFolderChange(cleanNew);
      setIsRenamingFolder(false);
      setNewFolderName("");
    } catch (err: any) {
      console.error("Lỗi đổi tên thư mục:", err);
      toast.error(err.response?.data?.error || "Đổi tên thư mục thất bại");
    } finally {
      setRenamingLoading(false);
    }
  };

  // Chọn ảnh để xem thông tin
  const handlePickImage = (image: R2ImageItem) => {
    setActiveImage(image);
    // Tự sinh altText từ tên file
    const filename = image.key.split("/").pop() || "";
    const cleanName = filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    setAltText(cleanName);
    setCaption("");
  };

  // Xác nhận chèn vào editor
  const handleInsert = (imageToInsert: R2ImageItem) => {
    onSelect({
      url: imageToInsert.url,
      key: imageToInsert.key,
      altText: altText.trim(),
      caption: caption.trim(),
      width: insertWidth,
      aspectRatio: insertRatio,
      alignment: insertAlign,
      objectPosition: insertCropPos,
    });
    toast.success("Đã chèn ảnh vào bài viết!");
  };

  return (
    <div className="space-y-4">
      {/* Bộ lọc thư mục theo dạng folder 5 thư mục 1 hàng & công cụ */}
      <div className="bg-gray-50 dark:bg-gray-750/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <R2FolderSelect
          selectedFolder={selectedFolder}
          folders={folders}
          onChange={onFolderChange}
          onFolderCreated={onFolderCreated}
          onDropOnFolder={(draggedKey, targetFolder) => handleMoveImage(draggedKey, targetFolder)}
          allowAllOption={true}
          label="Lọc theo thư mục:"
          rightAction={
            <>
              {/* Nút Đổi tên thư mục (chỉ hiện khi đang chọn 1 folder cụ thể) */}
              {selectedFolder && selectedFolder !== "" && !isRenamingFolder && (
                <button
                  type="button"
                  onClick={() => {
                    setNewFolderName(selectedFolder);
                    setIsRenamingFolder(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
                  title={`Đổi tên thư mục "${selectedFolder}"`}
                >
                  <FiEdit3 size={13} />
                  <span>Đổi tên thư mục</span>
                </button>
              )}

              {/* Nút Làm mới */}
              <button
                type="button"
                onClick={fetchImages}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                title="Tải lại danh sách ảnh"
              >
                <FiRefreshCw size={13} className={loading ? "animate-spin text-[#105d97]" : ""} />
                <span>Làm mới</span>
              </button>
            </>
          }
        />

        {/* Thanh nhập đổi tên thư mục (nếu kích hoạt) */}
        {isRenamingFolder && (
          <div className="mt-3 flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl shadow-xs animate-in fade-in duration-150">
            <FiFolder className="text-amber-600 flex-shrink-0 ml-1" size={16} />
            <span className="text-xs font-semibold text-amber-900 dark:text-amber-300 whitespace-nowrap">
              Đổi &ldquo;{selectedFolder}&rdquo; thành:
            </span>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              disabled={renamingLoading}
              placeholder="Tên thư mục mới..."
              className="flex-1 text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameFolder();
                if (e.key === "Escape") setIsRenamingFolder(false);
              }}
            />
            <button
              type="button"
              onClick={handleRenameFolder}
              disabled={renamingLoading}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1 disabled:opacity-50 cursor-pointer"
            >
              <FiCheck size={14} />
              <span>{renamingLoading ? "Đang đổi..." : "Lưu"}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsRenamingFolder(false)}
              disabled={renamingLoading}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-lg cursor-pointer"
            >
              <FiX size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Grid danh sách ảnh */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[380px] overflow-y-auto p-1 custom-scrollbar">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse border border-gray-200 dark:border-gray-700"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[380px] overflow-y-auto p-1 custom-scrollbar">
          {/* VỊ TRÍ ẢNH ĐẦU TIÊN: NÚT LOAD ẢNH / TẢI ẢNH MỚI VÀ HIỆN POPUP UPLOAD */}
          <div
            onClick={() => {
              setPopupFolder(selectedFolder || "");
              setShowUploadPopup(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingOverUploadCard(true);
            }}
            onDragLeave={() => setIsDraggingOverUploadCard(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingOverUploadCard(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                addFilesToQueue(e.dataTransfer.files);
                setPopupFolder(selectedFolder || "");
                setShowUploadPopup(true);
              }
            }}
            className={`relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all duration-200 group select-none ${isDraggingOverUploadCard
                ? "border-[#105d97] bg-blue-100/70 dark:bg-sky-950/50 scale-[1.02] shadow-md ring-2 ring-[#105d97]"
                : "border-[#105d97]/40 dark:border-sky-500/40 bg-gradient-to-br from-blue-50/80 via-sky-50/30 to-blue-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-sky-950/30 hover:border-[#105d97] hover:bg-blue-100/50 dark:hover:bg-gray-700/80 hover:shadow-md"
              }`}
            title="Nhấn để mở popup tải ảnh hoặc kéo thả nhiều ảnh trực tiếp vào đây"
          >
            <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[#105d97] dark:text-sky-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-2xs">
              <AiOutlineCloudUpload size={24} />
            </div>
            <span className="text-xs font-bold text-[#105d97] dark:text-sky-300 group-hover:underline">
              Tải ảnh lên
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
              {selectedFolder ? `vào "${getFolderName(selectedFolder)}"` : "Chọn hoặc thả ảnh"}
            </span>
            <span className="mt-1 text-[9px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              + Upload nhiều ảnh
            </span>
          </div>

          {/* Trường hợp thư mục chưa có ảnh nào */}
          {images.length === 0 && (
            <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 flex flex-col items-center justify-center p-6 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/40 dark:bg-gray-800/20 text-center">
              <BsCardImage className="text-gray-400 dark:text-gray-500 mb-2" size={28} />
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {selectedFolder ? `Thư mục "${selectedFolder}" chưa có ảnh nào` : "Chưa có ảnh nào trên Cloudflare R2"}
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                Nhấn vào nút &ldquo;Tải ảnh lên&rdquo; bên cạnh hoặc kéo thả nhiều ảnh vào để bắt đầu
              </p>
            </div>
          )}

          {/* Danh sách ảnh từ vị trí thứ 2 trở đi */}
          {images.map((img) => {
            const isSelected = activeImage?.key === img.key;

            return (
              <div
                key={img.key}
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", img.key);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onClick={() => handlePickImage(img)}
                className={`relative aspect-square rounded-lg overflow-hidden border cursor-grab active:cursor-grabbing group transition-all duration-200 bg-white dark:bg-gray-800 ${isSelected
                  ? "border-[#105d97] ring-2 ring-[#105d97] shadow-md"
                  : "border-gray-200 dark:border-gray-700 hover:border-[#105d97]/60 hover:shadow-sm"
                  }`}
                title="Kéo ảnh thả vào folder phía trên hoặc click để chọn"
              >
                {/* Ảnh hiển thị */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.key}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />

                {/* Badge kích thước file */}
                <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-xs pointer-events-none">
                  {formatBytes(img.size)}
                </div>

                {/* Các nút hành động góc trên bên phải khi hover */}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center gap-1">
                  {/* Nút Chuyển thư mục */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const cur = getFolderFromKey(img.key);
                      const defaultDest = folders.find((f) => f !== cur) || (folders[0] || "");
                      setImageToMove(img);
                      setTargetMoveFolder(defaultDest);
                    }}
                    className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors cursor-pointer"
                    title="Di chuyển sang album khác"
                  >
                    <FiCornerUpRight size={13} />
                  </button>

                  {/* Nút Xóa ảnh */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageToDelete(img);
                    }}
                    className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm transition-colors cursor-pointer"
                    title="Xóa ảnh này khỏi R2"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Panel chi tiết & Chèn ảnh được chọn */}
      {activeImage && (
        <div className="bg-blue-50/70 dark:bg-gray-800/80 p-3.5 rounded-xl border border-blue-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-3 mt-3">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-white flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeImage.url} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate" title={activeImage.key}>
                {activeImage.key}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Thư mục:{" "}
                <span className="font-semibold text-[#105d97] dark:text-blue-400">
                  {getFolderFromKey(activeImage.key) || "Chưa phân loại"}
                </span>{" "}
                • {formatBytes(activeImage.size)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Alt text (SEO)..."
              className="text-xs px-2.5 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg w-full sm:w-32 focus:outline-none focus:ring-1 focus:ring-[#105d97]"
            />
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Chú thích (Caption)..."
              className="text-xs px-2.5 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg w-full sm:w-32 focus:outline-none focus:ring-1 focus:ring-[#105d97]"
            />
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleInsert(activeImage)}
                className="flex-1 sm:flex-none px-3.5 py-1.5 bg-[#105d97] hover:bg-[#0c4672] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FiCheck size={14} />
                <span>Chèn vào bài viết</span>
              </button>

              {/* Nút Chuyển thư mục */}
              <button
                type="button"
                onClick={() => {
                  const cur = getFolderFromKey(activeImage.key);
                  const defaultDest = folders.find((f) => f !== cur) || (folders[0] || "");
                  setImageToMove(activeImage);
                  setTargetMoveFolder(defaultDest);
                }}
                className="px-2.5 py-1.5 bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 text-[#105d97] dark:text-blue-300 border border-[#105d97]/40 dark:border-blue-500/40 text-xs font-medium rounded-lg shadow-2xs transition-colors whitespace-nowrap inline-flex items-center justify-center gap-1 cursor-pointer"
                title="Chuyển sang album khác"
              >
                <FiCornerUpRight size={14} />
                <span>Chuyển album</span>
              </button>

              {/* Nút Xóa ảnh */}
              <button
                type="button"
                onClick={() => setImageToDelete(activeImage)}
                className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg border border-red-200 dark:border-red-900 transition-colors cursor-pointer"
                title="Xóa ảnh này khỏi R2"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Modal Upload Nhiều Ảnh & Lựa Chọn Thư Mục */}
      {showUploadPopup && (
        <div
          className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => !isUploadingBatch && setShowUploadPopup(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-2xl w-full p-6 flex flex-col max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Popup */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#105d97] dark:text-blue-400 flex items-center justify-center">
                  <FiUploadCloud size={20} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                    Tải ảnh lên Cloudflare R2
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Hỗ trợ tải lên nhiều hình ảnh cùng lúc (JPG, PNG, WEBP, GIF, SVG)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isUploadingBatch && setShowUploadPopup(false)}
                disabled={isUploadingBatch}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg cursor-pointer disabled:opacity-40"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="py-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
              {/* Phần chọn thư mục lưu trữ ảnh tải lên */}
              {selectedFolder === "" ? (
                <div className="bg-sky-50 dark:bg-sky-950/40 p-3.5 rounded-xl border border-sky-200 dark:border-sky-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                      <FiFolder className="text-[#105d97]" size={14} />
                      <span>Chọn thư mục lưu trữ ảnh tải lên: *</span>
                    </label>
                    <span className="text-[10px] text-sky-700 dark:text-sky-300 font-medium">
                      (Đang ở xem Tất cả thư mục)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={popupFolder}
                      onChange={(e) => setPopupFolder(e.target.value)}
                      disabled={isUploadingBatch}
                      className="flex-1 text-xs font-medium px-3 py-2 bg-white dark:bg-gray-800 border border-sky-300 dark:border-sky-700 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#105d97]"
                    >
                      <option value="">Thư mục gốc (/)</option>
                      {folders.map((f) => (
                        <option key={f} value={f}>
                          📁 {f}
                        </option>
                      ))}
                    </select>
                    {!isCreatingPopupFolder && (
                      <button
                        type="button"
                        onClick={() => setIsCreatingPopupFolder(true)}
                        disabled={isUploadingBatch}
                        className="px-3 py-2 text-xs font-semibold text-[#105d97] bg-white dark:bg-gray-800 border border-sky-300 dark:border-sky-700 rounded-lg hover:bg-sky-100 transition-colors shrink-0 cursor-pointer"
                      >
                        + Thư mục mới
                      </button>
                    )}
                  </div>
                  {isCreatingPopupFolder && (
                    <div className="flex items-center gap-2 pt-1 animate-in fade-in">
                      <input
                        type="text"
                        value={newPopupFolderName}
                        onChange={(e) => setNewPopupFolderName(e.target.value)}
                        placeholder="Tên thư mục mới (vd: ao-polo, mockup)..."
                        className="flex-1 text-xs px-2.5 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#105d97]"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCreatePopupFolder();
                          if (e.key === "Escape") setIsCreatingPopupFolder(false);
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleCreatePopupFolder}
                        className="px-3 py-1.5 bg-[#105d97] text-white text-xs font-bold rounded-lg hover:bg-[#0c4672] cursor-pointer"
                      >
                        Tạo
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCreatingPopupFolder(false)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 text-xs cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FiCheck className="text-emerald-600 dark:text-emerald-400" size={14} />
                    <span className="text-gray-700 dark:text-gray-300">
                      Lưu vào thư mục:{" "}
                      <strong className="text-emerald-800 dark:text-emerald-200 font-mono font-bold">
                        {popupFolder || selectedFolder}
                      </strong>
                    </span>
                  </div>
                  <select
                    value={popupFolder}
                    onChange={(e) => setPopupFolder(e.target.value)}
                    disabled={isUploadingBatch}
                    className="text-xs px-2.5 py-1 bg-white dark:bg-gray-800 border border-emerald-300 dark:border-emerald-700 rounded-lg text-gray-800 dark:text-gray-200"
                  >
                    <option value="">Thư mục gốc (/)</option>
                    {folders.map((f) => (
                      <option key={f} value={f}>
                        📁 {f}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Input ẩn cho việc chọn nhiều ảnh */}
              <input
                ref={popupFileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    addFilesToQueue(e.target.files);
                    e.target.value = "";
                  }
                }}
              />

              {/* Vùng Dropzone chọn ảnh */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingPopup(true);
                }}
                onDragLeave={() => setIsDraggingPopup(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingPopup(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    addFilesToQueue(e.dataTransfer.files);
                  }
                }}
                onClick={() => !isUploadingBatch && popupFileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${isDraggingPopup
                    ? "border-[#105d97] bg-blue-50/70 dark:bg-sky-950/40 scale-[1.01]"
                    : "border-gray-300 dark:border-gray-600 hover:border-[#105d97] bg-gray-50/50 dark:bg-gray-800/40 hover:bg-blue-50/20"
                  }`}
              >
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-50 dark:bg-blue-900/40 text-[#105d97] dark:text-sky-300 flex items-center justify-center">
                  <AiOutlineCloudUpload size={28} />
                </div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  Kéo thả nhiều ảnh vào đây, hoặc <span className="text-[#105d97] underline">chọn từ máy tính</span>
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                  Có thể chọn nhiều file ảnh cùng lúc (JPG, PNG, WEBP, GIF, SVG)
                </p>
              </div>

              {/* Danh sách ảnh đã chọn */}
              {uploadQueue.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Đã chọn {uploadQueue.length} ảnh (
                      {formatBytes(uploadQueue.reduce((acc, it) => acc + it.size, 0))})
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => popupFileInputRef.current?.click()}
                        disabled={isUploadingBatch}
                        className="text-xs font-semibold text-[#105d97] dark:text-sky-400 hover:underline inline-flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                      >
                        <FiPlus size={13} />
                        <span>Thêm ảnh khác</span>
                      </button>
                      <button
                        type="button"
                        onClick={clearUploadQueue}
                        disabled={isUploadingBatch}
                        className="text-xs text-red-600 dark:text-red-400 hover:underline disabled:opacity-50 cursor-pointer"
                      >
                        Xóa tất cả
                      </button>
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {uploadQueue.map((item) => (
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
                            <span className="text-[10px] text-gray-400 shrink-0">
                              {formatBytes(item.size)}
                            </span>
                          </div>

                          {/* Trạng thái / Thanh tiến trình */}
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
                                <FiCheckCircle size={12} /> Đã tải lên
                              </span>
                            )}
                            {item.status === "error" && (
                              <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 inline-flex items-center gap-1">
                                <FiAlertCircle size={12} /> {item.errorMessage || "Lỗi tải ảnh"}
                              </span>
                            )}
                          </div>
                        </div>

                        {!isUploadingBatch && item.status !== "success" && (
                          <button
                            type="button"
                            onClick={() => removeQueueItem(item.id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                            title="Xóa khỏi danh sách chờ"
                          >
                            <FiX size={15} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer popup */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!isUploadingBatch) {
                    setShowUploadPopup(false);
                    clearUploadQueue();
                  }
                }}
                disabled={isUploadingBatch}
                className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                Đóng
              </button>

              <button
                type="button"
                onClick={handleBatchUpload}
                disabled={isUploadingBatch || uploadQueue.filter(it => it.status === "pending" || it.status === "error").length === 0}
                className="px-5 py-2 text-xs font-bold text-white bg-[#105d97] hover:bg-[#0c4672] rounded-xl transition-all shadow-md inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <AiOutlineCloudUpload size={16} />
                <span>
                  {isUploadingBatch
                    ? "Đang tải ảnh lên..."
                    : `Bắt đầu tải lên (${uploadQueue.filter(it => it.status === "pending" || it.status === "error").length} ảnh)`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Modal Di Chuyển Ảnh Sang Album Khác */}
      {imageToMove && (
        <div
          className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => !isMoving && setImageToMove(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-3xl w-full p-6 text-left transform transition-all flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#105d97] dark:text-blue-400 flex items-center justify-center">
                  <FiCornerUpRight size={20} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                    Di chuyển ảnh sang Album khác
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Chọn thư mục đích bạn muốn chuyển ảnh tới
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => !isMoving && setImageToMove(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Thông tin ảnh cần di chuyển */}
            <div className="my-3.5 bg-gray-50 dark:bg-gray-750 p-3 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-white flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageToMove.url} alt="To move" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate" title={imageToMove.key}>
                  {imageToMove.key.split("/").pop()}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Vị trí hiện tại:{" "}
                  <span className="font-semibold text-[#105d97] dark:text-blue-400">
                    {getFolderFromKey(imageToMove.key) || "Chưa phân loại"}
                  </span>
                </p>
              </div>
            </div>

            {/* Danh sách các thư mục để chọn */}
            <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar my-1 pr-1">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Chọn thư mục đích:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {folders.length === 0 && (
                  <div className="col-span-full py-4 text-center text-xs text-gray-500 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                    Chưa có album nào. Vui lòng tạo album mới trước.
                  </div>
                )}

                {/* Các thư mục có sẵn (bao gồm cả thư mục con) */}
                {folders.map((f) => {
                  const isCur = getFolderFromKey(imageToMove.key) === f;
                  const isTarget = targetMoveFolder === f;
                  const isSub = f.includes("/");
                  const displayName = getFolderName(f);
                  const parentName = getParentFolder(f);

                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setTargetMoveFolder(f)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${isTarget
                        ? "bg-blue-50/90 dark:bg-[#105d97]/25 border-[#105d97] text-[#105d97] dark:text-blue-300 font-semibold ring-2 ring-[#105d97]/50"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-700 dark:text-gray-300"
                        }`}
                      title={f}
                    >
                      <FcFolder size={26} className="shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{displayName}</p>
                        <span className="text-[10px] text-gray-400 block truncate">
                          {isCur
                            ? "(Vị trí hiện tại)"
                            : isSub
                              ? `📁 ${parentName}`
                              : "Thư mục"}
                        </span>
                      </div>
                      {isTarget && <FiCheck className="text-[#105d97] flex-shrink-0" size={16} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-2.5 pt-3.5 border-t border-gray-100 dark:border-gray-700 mt-2">
              <button
                type="button"
                onClick={() => setImageToMove(null)}
                disabled={isMoving}
                className="flex-1 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => handleMoveImage(imageToMove.key, targetMoveFolder)}
                disabled={isMoving || targetMoveFolder === getFolderFromKey(imageToMove.key)}
                className="flex-1 px-4 py-2 text-xs font-semibold text-white bg-[#105d97] hover:bg-[#0c4672] rounded-xl transition-colors shadow-sm inline-flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <FiCheck size={14} />
                <span>{isMoving ? "Đang chuyển..." : "Xác nhận chuyển"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Modal Xác Nhận Xóa Ảnh */}
      {imageToDelete && (
        <div
          className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => !isDeleting && setImageToDelete(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full p-6 text-center transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon cảnh báo */}
            <div className="w-14 h-14 mx-auto mb-3.5 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center">
              <FiAlertTriangle size={28} />
            </div>

            <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
              Xác nhận xóa ảnh này?
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              Ảnh sẽ bị xóa vĩnh viễn khỏi Cloudflare R2. Hành động này không thể hoàn tác.
            </p>

            {/* Xem trước ảnh cần xóa */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-3 mb-5 text-left">
              <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-white flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageToDelete.url} alt="To delete" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate" title={imageToDelete.key}>
                  {imageToDelete.key}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Dung lượng: {formatBytes(imageToDelete.size)}
                </p>
              </div>
            </div>

            {/* Các nút hành động */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setImageToDelete(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm inline-flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <FiTrash2 size={14} />
                <span>{isDeleting ? "Đang xóa..." : "Xóa vĩnh viễn"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default R2ImagePicker;
