import { FC, ReactNode, useState, useMemo } from "react";
import {
  FiFolder,
  FiFolderPlus,
  FiCheck,
  FiX,
  FiLayers,
  FiChevronRight,
  FiArrowLeft,
  FiHome,
} from "react-icons/fi";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import axios from "axios";
import { toast } from "react-toastify";

interface Props {
  selectedFolder: string;
  folders: string[];
  onChange(folder: string): void;
  onFolderCreated?(newFolder: string): void;
  onDropOnFolder?(draggedKey: string, targetFolder: string): void;
  allowAllOption?: boolean;
  className?: string;
  label?: string;
  hideHeader?: boolean;
  rightAction?: ReactNode;
}

export const getParentFolder = (folderPath: string): string => {
  if (!folderPath) return "";
  const parts = folderPath.split("/").filter(Boolean);
  if (parts.length <= 1) return "";
  return parts.slice(0, -1).join("/");
};

export const getFolderName = (folderPath: string): string => {
  if (!folderPath) return "";
  return folderPath.split("/").filter(Boolean).pop() || folderPath;
};

const R2FolderSelect: FC<Props> = ({
  selectedFolder,
  folders,
  onChange,
  onFolderCreated,
  onDropOnFolder,
  allowAllOption = false,
  className = "",
  label = "Thư mục lưu trữ:",
  hideHeader = false,
  rightAction,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropTargetFolder, setDropTargetFolder] = useState<string | null>(null);

  // Xác định thư mục đang điều hướng (dùng selectedFolder hoặc thư mục cha nếu đang chọn)
  const currentNav = selectedFolder || "";

  // Breadcrumbs: các cấp thư mục từ gốc đến currentNav
  const breadcrumbs = useMemo(() => {
    if (!currentNav) return [];
    const parts = currentNav.split("/").filter(Boolean);
    const crumbs: { label: string; path: string }[] = [];
    let acc = "";
    parts.forEach((p) => {
      acc = acc ? `${acc}/${p}` : p;
      crumbs.push({ label: p, path: acc });
    });
    return crumbs;
  }, [currentNav]);

  // Danh sách các thư mục hiển thị ở cấp hiện tại
  const visibleFolderCards = useMemo(() => {
    if (!currentNav) {
      // Đang ở cấp gốc: hiển thị tất cả các thư mục cấp 1 (top-level)
      const topSet = new Set<string>();
      folders.forEach((f) => {
        const top = f.split("/")[0];
        if (top) topSet.add(top);
      });
      return Array.from(topSet).sort().map((f) => {
        // Đếm số thư mục con trực tiếp
        const subCount = folders.filter((sub) => sub.startsWith(`${f}/`)).length;
        return {
          fullPath: f,
          displayName: f,
          subCount,
          isSubfolder: false,
        };
      });
    }

    // Đang ở trong 1 thư mục (ví dụ: "mockup" hoặc "mockup/ao-polo")
    // Lấy tất cả các thư mục con trực tiếp của currentNav
    const prefix = `${currentNav}/`;
    const childSet = new Set<string>();

    folders.forEach((f) => {
      if (f.startsWith(prefix) && f !== currentNav) {
        const remaining = f.slice(prefix.length);
        const directChild = remaining.split("/")[0];
        if (directChild) childSet.add(directChild);
      }
    });

    return Array.from(childSet).sort().map((child) => {
      const fullPath = `${currentNav}/${child}`;
      const subCount = folders.filter((sub) => sub.startsWith(`${fullPath}/`)).length;
      return {
        fullPath,
        displayName: child,
        subCount,
        isSubfolder: true,
      };
    });
  }, [currentNav, folders]);

  const handleCreateFolder = async () => {
    const trimmed = newFolderName.trim().toLowerCase();
    if (!trimmed) {
      toast.error("Vui lòng nhập tên thư mục");
      return;
    }

    setLoading(true);
    try {
      const payload: { folder: string; parentFolder?: string } = {
        folder: trimmed,
      };
      if (currentNav) {
        payload.parentFolder = currentNav;
      }

      const { data } = await axios.post("/api/r2/folders", payload);
      const created = data.folder || (currentNav ? `${currentNav}/${trimmed}` : trimmed);
      toast.success(`Đã tạo thư mục "${created}" thành công!`);
      setIsCreating(false);
      setNewFolderName("");
      if (onFolderCreated) {
        onFolderCreated(created);
      }
      onChange(created);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Không thể tạo thư mục";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent, folder: string) => {
    if (!onDropOnFolder) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dropTargetFolder !== folder) {
      setDropTargetFolder(folder);
    }
  };

  const handleDragLeave = (folder: string) => {
    if (!onDropOnFolder) return;
    if (dropTargetFolder === folder) {
      setDropTargetFolder(null);
    }
  };

  const handleDrop = (e: React.DragEvent, folder: string) => {
    if (!onDropOnFolder) return;
    e.preventDefault();
    setDropTargetFolder(null);
    const draggedKey = e.dataTransfer.getData("text/plain");
    if (draggedKey) {
      onDropOnFolder(draggedKey, folder);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Tiêu đề & thanh công cụ */}
      {!hideHeader && (
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 uppercase tracking-wider">
              <FiFolder className="text-[#105d97]" size={15} />
              {label}
            </span>
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-200/80 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              {folders.length} thư mục
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Các nút hành động phụ từ component cha (Đổi tên, Làm mới...) */}
            {rightAction}

            {/* Nút Tạo thư mục mới / thư mục con */}
            {!isCreating && (
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#105d97] hover:text-white bg-blue-50 dark:bg-gray-700 hover:bg-[#105d97] dark:hover:bg-[#105d97] border border-[#105d97]/30 rounded-lg transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                title={currentNav ? `Tạo thư mục con trong "${currentNav}"` : "Tạo thư mục mới"}
              >
                <FiFolderPlus size={14} />
                <span>
                  {currentNav ? `+ Tạo thư mục con trong "${getFolderName(currentNav)}"` : "+ Tạo thư mục mới"}
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation Bar (Khi đang ở trong thư mục con) */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs shadow-2xs">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          {/* Nút Quay lại 1 cấp nếu đang ở trong thư mục con */}
          {currentNav && (
            <button
              type="button"
              onClick={() => onChange(getParentFolder(currentNav))}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors mr-1 cursor-pointer"
              title="Quay lại thư mục cha"
            >
              <FiArrowLeft size={14} />
            </button>
          )}

          {/* Cấp gốc */}
          <button
            type="button"
            onClick={() => onChange("")}
            className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              !currentNav
                ? "bg-blue-50 dark:bg-blue-950/40 text-[#105d97] dark:text-blue-300 font-bold"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FiHome size={13} />
            <span>Tất cả thư mục</span>
          </button>

          {/* Các cấp con */}
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <div key={crumb.path} className="flex items-center gap-1.5">
                <FiChevronRight size={12} className="text-gray-400" />
                <button
                  type="button"
                  onClick={() => onChange(crumb.path)}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    isLast
                      ? "bg-blue-50 dark:bg-blue-950/40 text-[#105d97] dark:text-blue-300 font-bold"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                  }`}
                  title={crumb.path}
                >
                  {crumb.label}
                </button>
              </div>
            );
          })}
        </div>

        {currentNav && (
          <span className="text-[11px] text-gray-400 dark:text-gray-500 hidden sm:inline-block font-mono">
            {currentNav}
          </span>
        )}
      </div>

      {/* Form tạo thư mục mới inline */}
      {isCreating && (
        <div className="flex items-center gap-2 p-2.5 bg-blue-50/80 dark:bg-gray-750 border border-blue-200 dark:border-gray-600 rounded-xl shadow-xs animate-in fade-in duration-150">
          <FiFolder className="text-[#105d97] flex-shrink-0 ml-1" size={16} />
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder={
              currentNav
                ? `Tên thư mục con trong "${getFolderName(currentNav)}" (ví dụ: ao-polo, ao-gio)...`
                : "Nhập tên thư mục mới (ví dụ: mockup, banners)..."
            }
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreateFolder();
              } else if (e.key === "Escape") {
                setIsCreating(false);
              }
            }}
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#105d97]"
            autoFocus
          />

          <button
            type="button"
            onClick={handleCreateFolder}
            disabled={loading}
            className="px-3 py-1.5 bg-[#105d97] text-white rounded-lg hover:bg-[#0c4672] text-xs font-semibold inline-flex items-center gap-1 disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <FiCheck size={14} />
            <span>{loading ? "Đang tạo..." : "Lưu"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsCreating(false);
              setNewFolderName("");
            }}
            disabled={loading}
            className="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
            title="Hủy"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* Grid danh sách thư mục hiển thị theo dạng folder, 5 thư mục 1 hàng trên desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Mục Tất cả ảnh:
            - Nếu đang ở cấp gốc: Tất cả ảnh của bucket
            - Nếu đang ở trong thư mục (vd: mockup): Tất cả ảnh thuộc mockup (bao gồm các folder con) */}
        {allowAllOption && (
          <button
            type="button"
            onClick={() => onChange(currentNav)}
            onDragOver={(e) => handleDragOver(e, currentNav)}
            onDragLeave={() => handleDragLeave(currentNav)}
            onDrop={(e) => handleDrop(e, currentNav)}
            className={`group relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
              selectedFolder === currentNav
                ? "bg-blue-50/90 dark:bg-[#105d97]/25 border-[#105d97] text-[#105d97] dark:text-blue-300 font-semibold shadow-xs ring-2 ring-[#105d97]"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#105d97]/50 hover:bg-blue-50/20 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 hover:shadow-xs hover:-translate-y-0.5"
            }`}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-[#105d97] dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs">
              <FiLayers size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate leading-snug">
                {currentNav ? `Tất cả ảnh trong ${getFolderName(currentNav)}` : "Tất cả ảnh"}
              </p>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal block">
                {currentNav ? "Bao gồm folder con" : "Toàn bộ thư viện"}
              </span>
            </div>
            {selectedFolder === currentNav && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#105d97] text-white flex items-center justify-center text-[9px] shadow-xs">
                <FiCheck strokeWidth={3} />
              </span>
            )}
          </button>
        )}

        {/* Nếu không có allowAllOption và đang ở trong thư mục (ở tab Upload):
            Cho phép chọn upload trực tiếp vào thư mục hiện tại */}
        {!allowAllOption && currentNav && (
          <button
            type="button"
            onClick={() => onChange(currentNav)}
            className={`group relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
              selectedFolder === currentNav
                ? "bg-blue-50/90 dark:bg-[#105d97]/25 border-[#105d97] text-[#105d97] dark:text-blue-300 font-semibold shadow-xs ring-2 ring-[#105d97]"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#105d97]/50 hover:bg-blue-50/20 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 hover:shadow-xs hover:-translate-y-0.5"
            }`}
          >
            <div className="flex-shrink-0 transition-transform group-hover:scale-105">
              {selectedFolder === currentNav ? <FcOpenedFolder size={32} /> : <FcFolder size={32} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate leading-snug">
                Lưu vào &ldquo;{getFolderName(currentNav)}&rdquo;
              </p>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal block">
                (Thư mục này)
              </span>
            </div>
            {selectedFolder === currentNav && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#105d97] text-white flex items-center justify-center text-[9px] shadow-xs">
                <FiCheck strokeWidth={3} />
              </span>
            )}
          </button>
        )}

        {/* Trường hợp thư mục hiện tại chưa có thư mục con nào */}
        {visibleFolderCards.length === 0 && (
          <div className="col-span-full py-5 text-center text-xs text-gray-500 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-800/40">
            {currentNav
              ? `Thư mục "${getFolderName(currentNav)}" chưa có thư mục con nào.`
              : "Chưa có thư mục nào trên Cloudflare R2."}
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="ml-2 font-semibold text-[#105d97] hover:underline cursor-pointer"
            >
              + Tạo ngay
            </button>
          </div>
        )}

        {/* Danh sách các thư mục / thư mục con ở cấp hiện tại */}
        {visibleFolderCards.map((card) => {
          const isSelected = selectedFolder === card.fullPath;
          const isDropHover = dropTargetFolder === card.fullPath;

          return (
            <button
              key={card.fullPath}
              type="button"
              onClick={() => onChange(card.fullPath)}
              onDragOver={(e) => handleDragOver(e, card.fullPath)}
              onDragLeave={() => handleDragLeave(card.fullPath)}
              onDrop={(e) => handleDrop(e, card.fullPath)}
              className={`group relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                isDropHover
                  ? "ring-4 ring-blue-500 scale-105 bg-blue-100 dark:bg-blue-900/60 border-blue-500 shadow-lg"
                  : isSelected
                  ? "bg-blue-50/90 dark:bg-[#105d97]/25 border-[#105d97] text-[#105d97] dark:text-blue-300 font-semibold shadow-xs ring-2 ring-[#105d97]"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#105d97]/50 hover:bg-blue-50/20 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 hover:shadow-xs hover:-translate-y-0.5"
              }`}
              title={card.fullPath}
            >
              <div className="flex-shrink-0 transition-transform group-hover:scale-105">
                {isSelected || isDropHover ? <FcOpenedFolder size={32} /> : <FcFolder size={32} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate leading-snug">{card.displayName}</p>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal block">
                  {isDropHover
                    ? "Thả để chuyển vào đây"
                    : card.subCount > 0
                    ? `${card.subCount} thư mục con`
                    : card.isSubfolder
                    ? "Thư mục con"
                    : "Thư mục"}
                </span>
              </div>
              {isSelected && !isDropHover && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#105d97] text-white flex items-center justify-center text-[9px] shadow-xs">
                  <FiCheck strokeWidth={3} />
                </span>
              )}
              {isDropHover && (
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold shadow-xs animate-pulse">
                  Thả vào đây
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default R2FolderSelect;
