import { FC, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FiX, FiUploadCloud, FiFolder, FiGrid } from "react-icons/fi";
import ModalContainer, { ModalProps } from "../common/ModalContainer";
import R2ImageUploader, { UploadSuccessPayload } from "./R2ImageUploader";
import R2ImagePicker, { ImageSelectPayload } from "./R2ImagePicker";

export interface R2ImageSelectionResult {
  src: string;
  altText?: string;
  caption?: string;
  width?: string;
  aspectRatio?: string;
  alignment?: "left" | "center" | "right";
  objectFit?: "cover" | "contain";
  objectPosition?: string;
}

interface Props extends ModalProps {
  initialFolder?: string;
  initialTab?: "upload" | "manage";
  initialFile?: File | null;
  onSelect(result: R2ImageSelectionResult): void;
}

const R2ImageModal: FC<Props> = ({
  visible,
  onClose,
  onSelect,
  initialFolder = "",
  initialTab = "manage",
  initialFile = null,
}) => {
  const defaultFolder = initialFolder || "";
  // Tab hiện tại: upload hoặc manage
  const [activeTab, setActiveTab] = useState<"upload" | "manage">(initialTab || "manage");
  const [folders, setFolders] = useState<string[]>([]);
  
  // Mặc định thư mục lọc (rỗng = tất cả thư mục)
  const [manageFolder, setManageFolder] = useState<string>(defaultFolder);
  const [uploadFolder, setUploadFolder] = useState<string>(defaultFolder);

  // Fetch danh sách thư mục khi mở modal
  const fetchFolders = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/r2/folders");
      if (data?.folders && Array.isArray(data.folders)) {
        const fetchedFolders: string[] = [...data.folders];
        if (initialFolder && !fetchedFolders.includes(initialFolder)) {
          fetchedFolders.push(initialFolder);
          fetchedFolders.sort((a, b) => a.localeCompare(b));
        }
        setFolders(fetchedFolders);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách folders R2:", err);
    }
  }, [initialFolder]);

  useEffect(() => {
    if (visible) {
      const targetFolder = initialFolder || "";
      setActiveTab(initialTab || "manage");
      setManageFolder(targetFolder);
      setUploadFolder(targetFolder);
      fetchFolders();
    }
  }, [visible, fetchFolders, initialFolder, initialTab]);

  const handleFolderCreated = (newFolder: string) => {
    setFolders((prev) => {
      const next = new Set(prev);
      const parts = newFolder.split("/").filter(Boolean);
      let acc = "";
      parts.forEach((p) => {
        acc = acc ? `${acc}/${p}` : p;
        next.add(acc);
      });
      return Array.from(next).sort();
    });
    setManageFolder(newFolder);
    setUploadFolder(newFolder);
  };

  const handleFolderRenamed = (oldFolder: string, newFolder: string) => {
    setFolders((prev) =>
      prev
        .map((f) => {
          if (f === oldFolder) return newFolder;
          if (f.startsWith(`${oldFolder}/`)) {
            return `${newFolder}/${f.slice(oldFolder.length + 1)}`;
          }
          return f;
        })
        .sort()
    );
    if (manageFolder === oldFolder) {
      setManageFolder(newFolder);
    } else if (manageFolder.startsWith(`${oldFolder}/`)) {
      setManageFolder(`${newFolder}/${manageFolder.slice(oldFolder.length + 1)}`);
    }

    if (uploadFolder === oldFolder) {
      setUploadFolder(newFolder);
    } else if (uploadFolder.startsWith(`${oldFolder}/`)) {
      setUploadFolder(`${newFolder}/${uploadFolder.slice(oldFolder.length + 1)}`);
    }
  };

  const handleUploadSuccess = (payload: UploadSuccessPayload) => {
    onSelect({
      src: payload.url,
      altText: payload.altText,
      caption: payload.caption,
      width: payload.width,
      aspectRatio: payload.aspectRatio,
      alignment: payload.alignment,
      objectFit: payload.objectFit,
      objectPosition: (payload as any).objectPosition || "50% 50%",
    });
    onClose?.();
  };

  const handleImagePick = (payload: ImageSelectPayload) => {
    onSelect({
      src: payload.url,
      altText: payload.altText,
      caption: payload.caption,
      width: payload.width,
      aspectRatio: payload.aspectRatio,
      alignment: payload.alignment,
      objectFit: payload.objectFit,
      objectPosition: payload.objectPosition || "50% 50%",
    });
    onClose?.();
  };

  return (
    <ModalContainer visible={visible} onClose={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden transition-all duration-200 m-2"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xs tracking-wider">
              R2
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  Cloudflare R2 Media Manager
                </h3>
                <span className="text-[10px] font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 px-2 py-0.5 rounded-full">
                  Lưu trữ trực tiếp
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Upload và quản lý kho hình ảnh bài viết qua Cloudflare R2
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Đóng modal"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${activeTab === "upload"
                ? "border-[#105d97] text-[#105d97] dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
          >
            <FiUploadCloud size={16} />
            <span>Upload ảnh mới</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("manage")}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${activeTab === "manage"
                ? "border-[#105d97] text-[#105d97] dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
          >
            <FiGrid size={16} />
            <span>Quản lý thư viện ảnh</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {activeTab === "upload" ? (
            <R2ImageUploader
              folders={folders}
              selectedFolder={uploadFolder}
              initialFile={initialFile}
              onFolderChange={setUploadFolder}
              onFolderCreated={handleFolderCreated}
              onSuccess={handleUploadSuccess}
            />
          ) : (
            <R2ImagePicker
              folders={folders}
              selectedFolder={manageFolder}
              onFolderChange={setManageFolder}
              onFolderCreated={handleFolderCreated}
              onFolderRenamed={handleFolderRenamed}
              onSelect={handleImagePick}
            />
          )}
        </div>
      </div>
    </ModalContainer>
  );
};

export default R2ImageModal;
