import { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  FiPlus,
  FiTrash2,
  FiX,
  FiMenu,
  FiFolder,
  FiImage,
  FiEdit2,
  FiCheck,
  FiSearch,
  FiArrowLeft,
  FiLayers,
  FiGrid,
  FiCheckSquare,
  FiSquare,
  FiEye,
  FiExternalLink,
} from "react-icons/fi";
import { ReactSortable } from "react-sortablejs";
import { toast } from "react-toastify";
import ModalContainer, { ModalProps } from "../../common/ModalContainer";
import type { GalleryImage } from "../ImageGallery";
import ArticleImageGallery from "../../common/ArticleImageGallery";
import R2FolderSelect from "../R2FolderSelect";

export interface AlbumItem {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  images: GalleryImage[];
  updatedAt?: string;
  createdAt?: string;
}

type RatioPreset = "auto" | "1:1" | "4:3" | "3:4" | "16:9" | "custom";

interface FormImageItem extends GalleryImage {
  id: string;
  ratio: RatioPreset;
  naturalWidth?: number;
  naturalHeight?: number;
}

const RATIO_DIMENSIONS: Record<
  Exclude<RatioPreset, "auto" | "custom">,
  { width: number; height: number }
> = {
  "1:1": { width: 1, height: 1 },
  "4:3": { width: 4, height: 3 },
  "3:4": { width: 3, height: 4 },
  "16:9": { width: 16, height: 9 },
};

interface R2FileItem {
  key: string;
  url: string;
  size: number;
  lastModified?: string;
}

interface Props extends ModalProps {
  onSelect(images: GalleryImage[], title?: string): void;
  defaultFolder?: string;
  initialImages?: GalleryImage[];
  initialTitle?: string;
  initialMode?: "albums" | "editor";
}

const R2MultiGalleryModal: FC<Props> = ({
  visible,
  onClose,
  onSelect,
  defaultFolder = "",
  initialImages,
  initialTitle,
  initialMode = "albums",
}) => {
  // Mode: "albums" (danh sách album đã lưu) | "editor" (tạo/sửa album)
  const [mode, setMode] = useState<"albums" | "editor">("albums");

  // Albums state
  const [albums, setAlbums] = useState<AlbumItem[]>([]);
  const [loadingAlbums, setLoadingAlbums] = useState(false);
  const [searchAlbum, setSearchAlbum] = useState("");
  const [albumToDelete, setAlbumToDelete] = useState<AlbumItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Editor state
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [galleryImages, setGalleryImages] = useState<FormImageItem[]>([]);
  const [savingAlbum, setSavingAlbum] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // R2 Image Picker Modal state
  const [showR2Picker, setShowR2Picker] = useState(false);
  const [r2Folders, setR2Folders] = useState<string[]>([]);
  const [currentR2Folder, setCurrentR2Folder] = useState<string>(defaultFolder);
  const [r2Files, setR2Files] = useState<R2FileItem[]>([]);
  const [loadingR2Files, setLoadingR2Files] = useState(false);
  const [selectedR2Urls, setSelectedR2Urls] = useState<string[]>([]);

  // Tải danh sách album từ API
  const fetchAlbums = useCallback(async () => {
    setLoadingAlbums(true);
    try {
      const { data } = await axios.get("/api/galleries");
      setAlbums(data.galleries || []);
    } catch (err: any) {
      console.error("Lỗi khi tải danh sách album gallery:", err);
      toast.error(err.response?.data?.error || "Không thể tải danh sách album");
      setAlbums([]);
    } finally {
      setLoadingAlbums(false);
    }
  }, []);

  // Tải danh sách folder R2
  const fetchR2Folders = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/r2/folders");
      if (data?.folders && Array.isArray(data.folders)) {
        const fetched = [...data.folders];
        if (defaultFolder && !fetched.includes(defaultFolder)) {
          fetched.push(defaultFolder);
          fetched.sort((a, b) => a.localeCompare(b));
        }
        setR2Folders(fetched);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách folders R2:", err);
    }
  }, [defaultFolder]);

  // Tải danh sách file trong folder R2
  const fetchR2Files = useCallback(async (folder: string) => {
    setLoadingR2Files(true);
    try {
      const folderQuery = folder ? `?folder=${encodeURIComponent(folder)}` : "";
      const { data } = await axios.get(`/api/r2/list${folderQuery}`);
      setR2Files(data.items || []);
    } catch (err: any) {
      console.error("Lỗi khi tải ảnh từ R2:", err);
      setR2Files([]);
    } finally {
      setLoadingR2Files(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      if (initialImages && initialImages.length > 0) {
        setMode("editor");
        setEditingAlbumId(null);
        setAlbumTitle(initialTitle || "Thư viện hình ảnh");
        setAlbumDescription("");
        setGalleryImages(
          initialImages.map((img) => ({
            ...img,
            id: Math.random().toString(36).substring(2, 9),
            ratio: (img.ratioMode as RatioPreset) || "auto",
            width: Number(img.width) > 0 ? Number(img.width) : 4,
            height: Number(img.height) > 0 ? Number(img.height) : 3,
          }))
        );
      } else {
        setMode(initialMode || "albums");
        setEditingAlbumId(null);
        setAlbumTitle(initialTitle || "");
        setAlbumDescription("");
        setGalleryImages([]);
      }
      setErrorMessage("");
      setSelectedR2Urls([]);
      fetchAlbums();
      fetchR2Folders();
    }
  }, [visible, initialImages, initialTitle, initialMode, fetchAlbums, fetchR2Folders]);

  useEffect(() => {
    if (showR2Picker) {
      fetchR2Files(currentR2Folder);
    }
  }, [showR2Picker, currentR2Folder, fetchR2Files]);

  const handleStartCreateAlbum = () => {
    setEditingAlbumId(null);
    setAlbumTitle("");
    setAlbumDescription("");
    setGalleryImages([]);
    setErrorMessage("");
    setMode("editor");
  };

  const handleStartEditAlbum = (album: AlbumItem) => {
    setEditingAlbumId(album._id || album.id || null);
    setAlbumTitle(album.title || "");
    setAlbumDescription(album.description || "");
    setGalleryImages(
      (album.images || []).map((img) => ({
        ...img,
        id: Math.random().toString(36).substring(2, 9),
        ratio: (img.ratioMode as RatioPreset) || "auto",
        width: img.width || 4,
        height: img.height || 3,
      }))
    );
    setErrorMessage("");
    setMode("editor");
  };

  const handleDeleteAlbum = async () => {
    if (!albumToDelete) return;
    const albumId = albumToDelete._id || albumToDelete.id;
    if (!albumId) return;

    setDeleting(true);
    try {
      await axios.delete(`/api/galleries/${albumId}`);
      toast.success(`Đã xóa album "${albumToDelete.title}" thành công!`);
      setAlbums((prev) => prev.filter((a) => (a._id || a.id) !== albumId));
      setAlbumToDelete(null);
    } catch (err: any) {
      console.error("Lỗi khi xóa album:", err);
      toast.error(err.response?.data?.error || "Không thể xóa album");
    } finally {
      setDeleting(false);
    }
  };

  const handleInsertAlbumDirectly = (album: AlbumItem) => {
    if (!album.images || album.images.length === 0) {
      toast.error("Album này không có ảnh nào để chèn!");
      return;
    }
    onSelect(album.images, album.title || "Thư viện hình ảnh");
    toast.success(`Đã chèn Album "${album.title}" vào bài viết!`);
    onClose?.();
  };

  // Cập nhật hoặc chèn gallery trực tiếp vào bài viết mà không bắt buộc lưu thành album riêng
  const handleDirectInsertOrUpdate = () => {
    if (!albumTitle.trim()) {
      setErrorMessage("Vui lòng nhập tên / tiêu đề Gallery!");
      return;
    }
    if (galleryImages.length < 2) {
      setErrorMessage("Gallery cần ít nhất 2 hình ảnh.");
      return;
    }
    const emptyImage = galleryImages.findIndex((img) => !img.src.trim());
    if (emptyImage !== -1) {
      setErrorMessage(`Ảnh số ${emptyImage + 1} thiếu URL ảnh.`);
      return;
    }

    const payloadImages: GalleryImage[] = galleryImages.map((img) => ({
      src: img.src.trim(),
      altText: img.altText?.trim() || "",
      width: Number(img.width) > 0 ? Number(img.width) : 4,
      height: Number(img.height) > 0 ? Number(img.height) : 3,
      ratioMode: img.ratio,
    }));

    onSelect(payloadImages, albumTitle.trim());
    toast.success(`Đã cập nhật Gallery "${albumTitle}" vào bài viết!`);
    onClose?.();
  };

  // Mở R2 Picker để chọn thêm ảnh
  const handleOpenR2Picker = () => {
    setSelectedR2Urls([]);
    setCurrentR2Folder(defaultFolder || "");
    setShowR2Picker(true);
  };

  // Toggle chọn ảnh trong R2 Picker
  const handleToggleR2Select = (url: string) => {
    setSelectedR2Urls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const handleSelectAllR2 = () => {
    const allUrls = r2Files.map((f) => f.url);
    setSelectedR2Urls(allUrls);
  };

  const handleDeselectAllR2 = () => {
    setSelectedR2Urls([]);
  };

  // Xác nhận thêm các ảnh đã tick chọn vào Album
  const handleConfirmR2Selection = () => {
    if (selectedR2Urls.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 ảnh từ R2");
      return;
    }

    const newItems: FormImageItem[] = selectedR2Urls.map((url) => {
      const filename = url.split("/").pop() || "";
      const cleanName = filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      return {
        id: Math.random().toString(36).substring(2, 9),
        src: url,
        altText: cleanName,
        width: 4,
        height: 3,
        ratio: "auto",
      };
    });

    setGalleryImages((prev) => [...prev, ...newItems]);
    setShowR2Picker(false);
    setSelectedR2Urls([]);
    toast.success(`Đã thêm ${newItems.length} ảnh vào Album!`);
  };

  const removeImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, changes: Partial<FormImageItem>) => {
    setGalleryImages((prev) => {
      const next = [...prev];
      const current = next[index];
      if (!current) return prev;

      let nextWidth = changes.width ?? current.width;
      let nextHeight = changes.height ?? current.height;
      const nextRatio = changes.ratio ?? current.ratio;

      if (changes.ratio) {
        if (changes.ratio === "auto") {
          nextWidth = current.naturalWidth || 4;
          nextHeight = current.naturalHeight || 3;
        } else if (changes.ratio !== "custom") {
          const dims = RATIO_DIMENSIONS[changes.ratio];
          nextWidth = dims.width;
          nextHeight = dims.height;
        }
      }

      next[index] = {
        ...current,
        ...changes,
        width: nextWidth,
        height: nextHeight,
        ratio: nextRatio,
      };
      return next;
    });
  };

  const handleImageLoad = (index: number, e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (!naturalWidth || !naturalHeight) return;

    setGalleryImages((prev) => {
      const next = [...prev];
      const current = next[index];
      if (!current) return prev;

      const shouldApplyNatural =
        current.ratio === "auto" &&
        (!current.naturalWidth || !current.naturalHeight);

      next[index] = {
        ...current,
        naturalWidth,
        naturalHeight,
        width: shouldApplyNatural ? naturalWidth : current.width,
        height: shouldApplyNatural ? naturalHeight : current.height,
      };
      return next;
    });
  };

  const validateEditor = (): boolean => {
    if (!albumTitle.trim()) {
      setErrorMessage("Vui lòng nhập tên / tiêu đề Album!");
      return false;
    }
    if (galleryImages.length < 2) {
      setErrorMessage("Album Gallery cần ít nhất 2 hình ảnh.");
      return false;
    }
    const emptyImage = galleryImages.findIndex((img) => !img.src.trim());
    if (emptyImage !== -1) {
      setErrorMessage(`Ảnh số ${emptyImage + 1} thiếu URL ảnh.`);
      return false;
    }
    setErrorMessage("");
    return true;
  };

  // Lưu Album vào DB và (tùy chọn) chèn ngay vào bài viết
  const handleSaveAlbum = async (insertIntoPost: boolean = false) => {
    if (!validateEditor()) return;

    setSavingAlbum(true);
    setErrorMessage("");

    const payloadImages: GalleryImage[] = galleryImages.map((img) => ({
      src: img.src.trim(),
      altText: img.altText?.trim() || "",
      width: Number(img.width) > 0 ? Number(img.width) : 4,
      height: Number(img.height) > 0 ? Number(img.height) : 3,
      ratioMode: img.ratio,
    }));

    try {
      let savedAlbum: AlbumItem;
      if (editingAlbumId) {
        const { data } = await axios.put(`/api/galleries/${editingAlbumId}`, {
          title: albumTitle.trim(),
          description: albumDescription.trim(),
          images: payloadImages,
        });
        savedAlbum = data.gallery;
        toast.success(`Đã cập nhật Album "${albumTitle}" thành công!`);
      } else {
        const { data } = await axios.post("/api/galleries", {
          title: albumTitle.trim(),
          description: albumDescription.trim(),
          images: payloadImages,
        });
        savedAlbum = data.gallery;
        toast.success(`Đã tạo Album "${albumTitle}" thành công!`);
      }

      await fetchAlbums();

      if (insertIntoPost) {
        onSelect(payloadImages, albumTitle.trim());
        toast.success(`Đã chèn Album "${albumTitle}" vào bài viết!`);
        onClose?.();
      } else {
        setMode("albums");
      }
    } catch (err: any) {
      console.error("Lỗi lưu album:", err);
      const msg = err.response?.data?.error || "Lưu Album thất bại. Vui lòng thử lại!";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSavingAlbum(false);
    }
  };

  const filteredAlbums = albums.filter((a) => {
    if (!searchAlbum.trim()) return true;
    const q = searchAlbum.toLowerCase();
    return (
      a.title?.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q)
    );
  });

  return (
    <ModalContainer visible={visible} onClose={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden transition-all duration-200 m-2"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/90 dark:bg-gray-800/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#105d97] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <FiGrid size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  {mode === "albums"
                    ? "Kho Album Gallery (Cloudflare R2)"
                    : editingAlbumId
                    ? `Chỉnh sửa Album: ${albumTitle || "Không tên"}`
                    : "Tạo Album Gallery mới từ R2"}
                </h3>
                <span className="text-[10px] font-mono font-bold bg-sky-100 dark:bg-sky-950/80 text-[#105d97] dark:text-sky-300 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                  R2 Gallery Manager
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {mode === "albums"
                  ? "Chọn nhanh album có sẵn để chèn vào bài viết, hoặc tạo mới / chỉnh sửa album"
                  : "Chọn ảnh từ Cloudflare R2, sắp xếp thứ tự hiển thị và lưu thành album"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
            title="Đóng modal"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* ── VIEW 1: DANH SÁCH ALBUM ĐÃ LƯU (LỰA CHỌN NHANH) ── */}
        {mode === "albums" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar trên cùng: Tìm kiếm & Nút Tạo mới */}
            <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  value={searchAlbum}
                  onChange={(e) => setSearchAlbum(e.target.value)}
                  placeholder="Tìm kiếm album theo tên hoặc mô tả..."
                  className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#105d97]/20 focus:border-[#105d97] outline-none bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleStartCreateAlbum}
                  className="px-4 py-2 bg-[#105d97] hover:bg-[#0c4a7c] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <FiPlus size={14} />
                  <span>Tạo Album mới</span>
                </button>
              </div>
            </div>

            {/* Danh sách Album Cards */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/60 dark:bg-gray-900/40 custom-scrollbar">
              {loadingAlbums ? (
                <div className="py-20 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-3 border-[#105d97] border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang tải danh sách album gallery...</span>
                </div>
              ) : filteredAlbums.length === 0 ? (
                <div className="py-16 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-8 max-w-lg mx-auto">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-[#105d97] dark:text-sky-400 flex items-center justify-center">
                    <FiLayers size={30} />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                    {searchAlbum ? "Không tìm thấy album phù hợp" : "Chưa có Album Gallery nào"}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                    {searchAlbum
                      ? "Hãy thử tìm kiếm với từ khóa khác."
                      : "Bạn có thể tạo các album ảnh từ Cloudflare R2 để lưu trữ và chèn nhanh vào bất kỳ bài viết nào."}
                  </p>
                  <button
                    type="button"
                    onClick={handleStartCreateAlbum}
                    className="mt-4 px-5 py-2.5 bg-[#105d97] hover:bg-[#0c4a7c] text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <FiPlus size={14} />
                    <span>Tạo Album đầu tiên ngay</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredAlbums.map((album) => {
                    const imgCount = album.images?.length || 0;
                    const previewImgs = (album.images || []).slice(0, 4);

                    return (
                      <div
                        key={album._id || album.id}
                        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
                      >
                        {/* Khung xem trước collage ảnh */}
                        <div className="relative h-44 bg-gray-100 dark:bg-gray-900 overflow-hidden grid grid-cols-2 gap-0.5">
                          {previewImgs.length === 0 ? (
                            <div className="col-span-2 flex items-center justify-center text-gray-400 text-xs">
                              Không có ảnh
                            </div>
                          ) : previewImgs.length === 1 ? (
                            <div className="col-span-2 h-full">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={previewImgs[0].src}
                                alt={previewImgs[0].altText || album.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : previewImgs.length === 2 ? (
                            previewImgs.map((img, i) => (
                              <div key={i} className="h-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={img.src}
                                  alt={img.altText || ""}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))
                          ) : (
                            previewImgs.map((img, i) => (
                              <div key={i} className="h-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={img.src}
                                  alt={img.altText || ""}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))
                          )}

                          {/* Badge số lượng ảnh */}
                          <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shadow-sm">
                            <FiImage size={12} />
                            <span>{imgCount} ảnh</span>
                          </div>
                        </div>

                        {/* Thông tin Album */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4
                              className="font-bold text-gray-900 dark:text-gray-100 text-sm line-clamp-1 group-hover:text-[#105d97] transition-colors"
                              title={album.title}
                            >
                              {album.title}
                            </h4>
                            {album.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                {album.description}
                              </p>
                            )}
                          </div>

                          {/* Thao tác Card */}
                          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => handleInsertAlbumDirectly(album)}
                              className="flex-1 py-2 px-3 bg-[#105d97] hover:bg-[#0c4a7c] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                              title="Chèn album này vào vị trí con trỏ trong bài viết"
                            >
                              <FiCheck size={14} />
                              <span>Chèn vào bài viết</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStartEditAlbum(album)}
                              className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#105d97] hover:bg-sky-50 dark:hover:bg-sky-950/60 rounded-xl transition-colors cursor-pointer"
                              title="Chỉnh sửa album"
                            >
                              <FiEdit2 size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={() => setAlbumToDelete(album)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-xl transition-colors cursor-pointer"
                              title="Xóa album"
                            >
                              <FiTrash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── VIEW 2: SOẠN THẢO / CHỈNH SỬA ALBUM (ALBUM EDITOR) ── */}
        {mode === "editor" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Sub-header thanh điều hướng */}
            <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setMode("albums")}
                className="text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-[#105d97] flex items-center gap-1.5 cursor-pointer py-1 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiArrowLeft size={14} />
                <span>Quay lại danh sách Album</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-lg">
                  {galleryImages.length} ảnh trong album
                </span>
                <button
                  type="button"
                  onClick={handleOpenR2Picker}
                  className="px-3.5 py-1.5 bg-[#105d97] hover:bg-[#0c4a7c] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <FiPlus size={14} />
                  <span>+ Chọn thêm ảnh từ R2</span>
                </button>
              </div>
            </div>

            {/* Form Fields: Tiêu đề & Mô tả */}
            <div className="px-6 py-4 bg-gray-50/70 dark:bg-gray-750/50 border-b border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">
                  Tên / Tiêu đề Album Gallery <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  placeholder="Ví dụ: Mẫu áo polo doanh nghiệp Univi 2026..."
                  className="w-full px-3.5 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#105d97]/20 focus:border-[#105d97] outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">
                  Mô tả ngắn (tùy chọn)
                </label>
                <input
                  type="text"
                  value={albumDescription}
                  onChange={(e) => setAlbumDescription(e.target.value)}
                  placeholder="Ghi chú về album, kiểu dáng, sự kiện..."
                  className="w-full px-3.5 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#105d97]/20 focus:border-[#105d97] outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Error banner nếu có */}
            {errorMessage && (
              <div className="mx-6 mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Danh sách ảnh trong Album & Demo xem trước */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-gray-900/30 custom-scrollbar">
              {/* ── DEMO GALLERY XEM TRƯỚC Ở FRONTEND ── */}
              <div className="mb-6 rounded-2xl border-2 border-sky-300 dark:border-sky-800 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
                <div className="px-4 py-2.5 bg-gradient-to-r from-sky-100 via-sky-50 to-blue-50 dark:from-sky-950/70 dark:via-gray-800 dark:to-blue-950/40 border-b border-sky-200 dark:border-sky-800 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#105d97] text-white flex items-center justify-center text-xs shadow-xs">
                      <FiEye size={13} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                          Demo Gallery xem trước ở Frontend
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Live Preview
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 italic hidden md:inline">
                      * Bấm vào ảnh để test Lightbox phóng to
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#105d97] dark:text-sky-300 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-lg border border-sky-200 dark:border-sky-800">
                      <FiLayers size={13} />
                      <span>{galleryImages.length} ảnh</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-gray-900">
                  {galleryImages.length > 0 ? (
                    <div className="not-prose max-w-full">
                      <ArticleImageGallery
                        images={galleryImages.map((img) => ({
                          src: img.src.trim(),
                          altText: img.altText?.trim() || "",
                          width: Number(img.width) > 0 ? Number(img.width) : 4,
                          height: Number(img.height) > 0 ? Number(img.height) : 3,
                          ratioMode: img.ratio,
                        }))}
                        title={albumTitle.trim() || "Thư viện hình ảnh"}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
                      <FiImage size={32} className="text-gray-300 dark:text-gray-600 mb-2" />
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Chưa có hình ảnh nào trong demo
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Bấm &quot;+ Chọn thêm ảnh từ R2&quot; bên dưới để chọn ảnh và xem trước thời gian thực
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Header danh sách ảnh & nút thêm ảnh */}
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Danh sách ảnh & Tùy chỉnh chi tiết</span>
                    <span className="text-[10px] text-gray-500 font-normal lowercase hidden sm:inline">
                      (kéo thả ☰ để đổi thứ tự, chỉnh alt text & tỷ lệ)
                    </span>
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={handleOpenR2Picker}
                  className="px-3.5 py-1.5 bg-[#105d97] hover:bg-[#0c4a7c] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <FiPlus size={14} />
                  <span>+ Chọn thêm ảnh từ R2</span>
                </button>
              </div>

              {galleryImages.length === 0 ? (
                <div
                  onClick={handleOpenR2Picker}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#105d97] rounded-2xl p-12 text-center cursor-pointer bg-white dark:bg-gray-800 transition-colors"
                >
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-[#105d97] dark:text-sky-300 flex items-center justify-center">
                    <FiImage size={28} />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    Chưa có ảnh nào trong Album
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Bấm vào đây để mở kho ảnh Cloudflare R2 và chọn các ảnh muốn đưa vào Album.
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenR2Picker();
                    }}
                    className="mt-4 px-4 py-2 bg-[#105d97] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <FiPlus size={14} />
                    <span>Chọn ảnh từ Cloudflare R2</span>
                  </button>
                </div>
              ) : (
                <ReactSortable
                  list={galleryImages}
                  setList={setGalleryImages}
                  handle=".gallery-drag-handle"
                  animation={150}
                  className="space-y-3"
                >
                  {galleryImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-2xs hover:border-gray-300 transition-all grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4"
                    >
                      {/* Cột Preview ảnh xem trước rõ nét */}
                      <div className="relative group/preview rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-750 bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-1">
                        <div
                          className="w-full h-full min-h-[110px] max-h-[140px] flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-950"
                          style={{
                            aspectRatio:
                              Number(image.width) > 0 && Number(image.height) > 0
                                ? `${image.width} / ${image.height}`
                                : "4 / 3",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image.src.trim()}
                            alt={image.altText || `Ảnh ${index + 1}`}
                            className="h-full w-full object-contain"
                            onLoad={(e) => handleImageLoad(index, e)}
                          />
                        </div>

                        {/* Ratio Badge */}
                        <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                          {image.ratio === "auto" ? "Auto" : image.ratio}
                        </div>

                        {/* External link button on hover */}
                        <a
                          href={image.src}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute bottom-2 right-2 p-1 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 rounded-md shadow opacity-0 group-hover/preview:opacity-100 transition-opacity text-xs"
                          title="Mở ảnh gốc trong tab mới"
                        >
                          <FiExternalLink size={12} />
                        </a>
                      </div>

                      {/* Cột thông tin chi tiết */}
                      <div className="min-w-0 space-y-2.5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="gallery-drag-handle cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing p-1"
                              title="Kéo thả để sắp xếp vị trí ảnh"
                            >
                              <FiMenu className="h-4 w-4" />
                            </button>
                            <span className="font-bold text-xs text-gray-800 dark:text-gray-200">
                              Ảnh {index + 1}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400 truncate max-w-[260px]">
                              {image.src}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-lg transition-colors cursor-pointer"
                            title="Xóa ảnh này khỏi album"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Alt text / Chú thích ảnh
                            </label>
                            <input
                              type="text"
                              value={image.altText || ""}
                              onChange={(e) => updateImage(index, { altText: e.target.value })}
                              placeholder="Mô tả nội dung hình ảnh..."
                              className="w-full px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-[#105d97] outline-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Tỷ lệ khung hình (Aspect Ratio)
                            </label>
                            <select
                              value={image.ratio}
                              onChange={(e) =>
                                updateImage(index, { ratio: e.target.value as RatioPreset })
                              }
                              className="w-full px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-[#105d97] outline-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 cursor-pointer"
                            >
                              <option value="auto">Tự động (theo kích thước thật)</option>
                              <option value="1:1">Vuông (1:1)</option>
                              <option value="4:3">Ngang tiêu chuẩn (4:3)</option>
                              <option value="3:4">Dọc (3:4)</option>
                              <option value="16:9">Ngang rộng (16:9)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </ReactSortable>
              )}
            </div>

            {/* Footer hành động của Editor */}
            <div className="px-6 py-3.5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (initialImages && initialImages.length > 0) {
                    onClose?.();
                  } else {
                    setMode("albums");
                  }
                }}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleDirectInsertOrUpdate}
                  className="px-4 py-2 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-[#105d97] dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  title="Chèn / Cập nhật gallery vào bài viết mà không cần lưu vào kho album"
                >
                  Chỉ cập nhật vào bài viết
                </button>

                <button
                  type="button"
                  disabled={savingAlbum}
                  onClick={() => handleSaveAlbum(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {savingAlbum ? "Đang lưu..." : "Lưu vào Kho Album R2"}
                </button>

                <button
                  type="button"
                  disabled={savingAlbum}
                  onClick={() => handleSaveAlbum(true)}
                  className="px-5 py-2 bg-[#105d97] hover:bg-[#0c4a7c] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  <FiCheck size={14} />
                  <span>{savingAlbum ? "Đang lưu..." : "Lưu Album & Chèn vào bài"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SUB-MODAL: BẢNG CHỌN NHIỀU ẢNH TỪ CLOUDFLARE R2 ── */}
        {showR2Picker && (
          <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Header R2 Picker */}
              <div className="px-6 py-3.5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/80 dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <FiFolder className="text-[#105d97]" size={18} />
                  <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                    Chọn ảnh từ kho lưu trữ Cloudflare R2
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowR2Picker(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Bộ lọc Folder R2 */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <R2FolderSelect
                  selectedFolder={currentR2Folder}
                  folders={r2Folders}
                  onChange={(f) => setCurrentR2Folder(f)}
                  label="Thư mục R2 đang duyệt:"
                  allowAllOption={true}
                />

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">
                    Tổng cộng: <strong>{r2Files.length}</strong> ảnh trong thư mục
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllR2}
                      className="text-[#105d97] hover:underline font-semibold cursor-pointer"
                    >
                      Chọn tất cả
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={handleDeselectAllR2}
                      className="text-gray-500 hover:underline cursor-pointer"
                    >
                      Bỏ chọn tất cả
                    </button>
                  </div>
                </div>
              </div>

              {/* Lưới ảnh R2 để tick chọn */}
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-gray-900/50 custom-scrollbar">
                {loadingR2Files ? (
                  <div className="py-20 text-center text-gray-400 text-xs">
                    Đang tải danh sách ảnh từ R2...
                  </div>
                ) : r2Files.length === 0 ? (
                  <div className="py-16 text-center text-gray-400 text-xs">
                    Thư mục này chưa có ảnh nào trên R2.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {r2Files.map((file) => {
                      const isSelected = selectedR2Urls.includes(file.url);
                      return (
                        <div
                          key={file.key}
                          onClick={() => handleToggleR2Select(file.url)}
                          className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-square bg-gray-100 group ${
                            isSelected
                              ? "border-[#105d97] ring-2 ring-[#105d97]/30 scale-[0.98]"
                              : "border-gray-200 dark:border-gray-700 hover:border-sky-400"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={file.url}
                            alt={file.key}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />

                          {/* Checkbox badge */}
                          <div
                            className={`absolute top-1.5 right-1.5 rounded-md p-1 shadow-xs transition-colors ${
                              isSelected
                                ? "bg-[#105d97] text-white"
                                : "bg-black/50 text-white/70 group-hover:bg-black/70"
                            }`}
                          >
                            {isSelected ? <FiCheckSquare size={13} /> : <FiSquare size={13} />}
                          </div>

                          {/* Tên file */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 text-[10px] text-white truncate font-mono">
                            {file.key.split("/").pop()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer R2 Picker */}
              <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Đã chọn: <strong className="text-[#105d97] font-bold">{selectedR2Urls.length}</strong> ảnh
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowR2Picker(false)}
                    className="px-4 py-2 border border-gray-200 text-xs font-semibold rounded-xl hover:bg-gray-50 cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    disabled={selectedR2Urls.length === 0}
                    onClick={handleConfirmR2Selection}
                    className="px-5 py-2 bg-[#105d97] hover:bg-[#0c4a7c] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <FiCheck size={14} />
                    <span>Thêm {selectedR2Urls.length} ảnh vào Album</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL XÁC NHẬN XÓA ALBUM ── */}
        {albumToDelete && (
          <div className="fixed inset-0 z-[10001] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md p-6"
            >
              <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Xác nhận xóa Album này?
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Bạn có chắc chắn muốn xóa album <strong>&quot;{albumToDelete.title}&quot;</strong>? Thao tác này sẽ xóa album khỏi kho lưu trữ nhưng không xóa các file ảnh gốc trên R2.
              </p>
              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setAlbumToDelete(null)}
                  className="px-4 py-2 border border-gray-200 text-xs font-semibold rounded-xl text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDeleteAlbum}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {deleting ? "Đang xóa..." : "Xác nhận xóa"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalContainer>
  );
};

export default R2MultiGalleryModal;
