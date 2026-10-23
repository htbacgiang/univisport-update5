import { FC, useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { BsPencilSquare, BsTrash, BsCrop } from "react-icons/bs";
import {
  FiAlertTriangle,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiUploadCloud,
  FiZoomIn,
  FiEye,
  FiShield,
  FiSliders,
  FiImage,
} from "react-icons/fi";
import {
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdAspectRatio,
} from "react-icons/md";
import { BubbleMenu, Editor } from "@tiptap/react";
import { ImageAlignment, ImageAspectRatio } from "./CustomImage";
import axios from "axios";
import { toast } from "react-toastify";

interface Props {
  editor: Editor;
}

const SIZE_PRESETS = [
  { label: "25%", value: "25%" },
  { label: "50%", value: "50%" },
  { label: "75%", value: "75%" },
  { label: "100%", value: "100%" },
];

const RATIO_PRESETS: { label: string; value: ImageAspectRatio; desc: string; ratioValue: number | null }[] = [
  { label: "Gốc", value: "auto", desc: "Tự nhiên", ratioValue: null },
  { label: "16:9", value: "16/9", desc: "Ngang rộng", ratioValue: 16 / 9 },
  { label: "4:3", value: "4/3", desc: "Ngang chuẩn", ratioValue: 4 / 3 },
  { label: "1:1", value: "1/1", desc: "Vuông", ratioValue: 1 },
  { label: "3:2", value: "3/2", desc: "Nhiếp ảnh", ratioValue: 3 / 2 },
  { label: "9:16", value: "9/16", desc: "Dọc Story", ratioValue: 9 / 16 },
];

// 9 điểm neo định vị tâm cắt ảnh (3x3 grid)
const ANCHOR_POINTS: { label: string; x: number; y: number; title: string }[] = [
  { label: "↖", x: 0, y: 0, title: "Góc trên bên trái" },
  { label: "⬆", x: 50, y: 0, title: "Phía trên chính giữa" },
  { label: "↗", x: 100, y: 0, title: "Góc trên bên phải" },
  { label: "⬅", x: 0, y: 50, title: "Chính giữa bên trái" },
  { label: "⏺", x: 50, y: 50, title: "Chính giữa tâm ảnh" },
  { label: "➡", x: 100, y: 50, title: "Chính giữa bên phải" },
  { label: "↙", x: 0, y: 100, title: "Góc dưới bên trái" },
  { label: "⬇", x: 50, y: 100, title: "Phía dưới chính giữa" },
  { label: "↘", x: 100, y: 100, title: "Góc dưới bên phải" },
];

/**
 * Trích xuất tên file và thư mục từ URL
 */
const parseFileInfoFromUrl = (url: string): { fileName: string; folder: string } => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    const fileName = pathParts.pop() || `image-${Date.now()}.webp`;
    const folder = pathParts.join("/");
    return { fileName, folder };
  } catch {
    const clean = url.split("?")[0];
    const parts = clean.split("/").filter(Boolean);
    const fileName = parts.pop() || `image-${Date.now()}.webp`;
    const folder = parts.join("/");
    return { fileName, folder };
  }
};

/**
 * Tải ảnh vào đối tượng HTMLImageElement an toàn (với cơ chế proxy chống CORS tainted canvas)
 */
const loadSafeImage = (srcUrl: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Fallback qua proxy nội bộ nếu bị lỗi CORS
      const proxyImg = new Image();
      proxyImg.crossOrigin = "anonymous";
      proxyImg.onload = () => resolve(proxyImg);
      proxyImg.onerror = (err) => reject(err);
      proxyImg.src = `/api/image/proxy?url=${encodeURIComponent(srcUrl)}`;
    };
    img.src = srcUrl;
  });
};

const EditImage: FC<Props> = ({ editor }) => {
  const [mounted, setMounted] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePos, setDeletePos] = useState<number | null>(null);

  // Thuộc tính ảnh trong editor
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [width, setWidth] = useState("100%");
  const [alignment, setAlignment] = useState<ImageAlignment>("center");

  // Thuộc tính studio cắt ảnh
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>("16/9");
  const [posX, setPosX] = useState(50); // Tâm cắt X: 0% -> 100%
  const [posY, setPosY] = useState(50); // Tâm cắt Y: 0% -> 100%
  const [zoom, setZoom] = useState(1.0); // Thu phóng: 1.0x -> 3.0x
  const [newFileName, setNewFileName] = useState("");
  const [targetFolder, setTargetFolder] = useState("");

  // Kích thước thật của ảnh nguồn
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [naturalHeight, setNaturalHeight] = useState(0);
  const [loadedSourceImg, setLoadedSourceImg] = useState<HTMLImageElement | null>(null);

  // Tab xem trước: "interactive" (vùng cắt trên ảnh gốc) | "result" (ảnh kết quả thực tế)
  const [previewTab, setPreviewTab] = useState<"interactive" | "result">("interactive");
  const [resultPreviewUrl, setResultPreviewUrl] = useState<string>("");

  // Trạng thái đang cắt và tải ảnh lên R2
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState("");

  // Kéo thả chuột trên khung cắt
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const interactiveFrameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActiveImage = editor.isActive("image");

  // Đồng bộ thông tin ảnh khi editor chọn ảnh
  useEffect(() => {
    if (isActiveImage && !showEditModal && !showDeleteConfirm) {
      const attrs = editor.getAttributes("image");
      setSrc(attrs.src || "");
      setAlt(attrs.alt || "");
      setCaption(attrs.caption || "");
      setWidth(attrs.width || "100%");
      setAlignment((attrs.alignment as ImageAlignment) || "center");
    }
  }, [editor, isActiveImage, showEditModal, showDeleteConfirm]);

  // Mở Studio Cắt & Chỉnh sửa ảnh
  const handleOpenStudio = async () => {
    const attrs = editor.getAttributes("image");
    const currentSrc = attrs.src || "";
    setSrc(currentSrc);
    setAlt(attrs.alt || "");
    setCaption(attrs.caption || "");
    setWidth(attrs.width || "100%");
    setAlignment((attrs.alignment as ImageAlignment) || "center");
    setAspectRatio("16/9");
    setPosX(50);
    setPosY(50);
    setZoom(1.0);
    setPreviewTab("interactive");

    if (currentSrc) {
      const { fileName, folder } = parseFileInfoFromUrl(currentSrc);
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
      const generatedName = `${nameWithoutExt}-crop-${Date.now().toString().slice(-6)}.webp`;
      setNewFileName(generatedName);
      setTargetFolder(folder);

      // Tải trước ảnh để lấy kích thước thật
      try {
        const img = await loadSafeImage(currentSrc);
        setLoadedSourceImg(img);
        setNaturalWidth(img.naturalWidth);
        setNaturalHeight(img.naturalHeight);
      } catch (err) {
        console.warn("Không thể tải kích thước ảnh tự nhiên:", err);
      }
    }

    setShowEditModal(true);
  };

  // Tính toán vùng cắt (Bounding box) trong tọa độ pixel của ảnh gốc
  const computeCropGeometry = useCallback(() => {
    const W0 = naturalWidth || 1200;
    const H0 = naturalHeight || 800;

    const preset = RATIO_PRESETS.find((r) => r.value === aspectRatio);
    const targetRatio = preset?.ratioValue ? preset.ratioValue : W0 / H0;

    let cropW: number;
    let cropH: number;

    if (W0 / H0 > targetRatio) {
      // Ảnh gốc rộng hơn tỷ lệ mong muốn => chiều cao bị giới hạn
      cropH = H0 / zoom;
      cropW = cropH * targetRatio;
    } else {
      // Ảnh gốc cao hơn tỷ lệ mong muốn => chiều rộng bị giới hạn
      cropW = W0 / zoom;
      cropH = cropW / targetRatio;
    }

    // Đảm bảo không vượt quá kích thước gốc
    if (cropW > W0) {
      cropW = W0;
      cropH = cropW / targetRatio;
    }
    if (cropH > H0) {
      cropH = H0;
      cropW = cropH * targetRatio;
    }

    // Tâm ngắm cắt ảnh theo tọa độ pixel
    const focalPxX = (posX / 100) * W0;
    const focalPxY = (posY / 100) * H0;

    let cropX = focalPxX - cropW / 2;
    let cropY = focalPxY - cropH / 2;

    // Giữ khung cắt nằm gọn trong ảnh gốc
    cropX = Math.max(0, Math.min(W0 - cropW, cropX));
    cropY = Math.max(0, Math.min(H0 - cropH, cropY));

    return {
      W0,
      H0,
      cropX: Math.round(cropX),
      cropY: Math.round(cropY),
      cropW: Math.round(cropW),
      cropH: Math.round(cropH),
      // Tỷ lệ % trên khung ảnh để vẽ overlay
      boxLeftPercent: (cropX / W0) * 100,
      boxTopPercent: (cropY / H0) * 100,
      boxWidthPercent: (cropW / W0) * 100,
      boxHeightPercent: (cropH / H0) * 100,
    };
  }, [naturalWidth, naturalHeight, aspectRatio, zoom, posX, posY]);

  // Cập nhật bản xem trước ảnh kết quả (Live Canvas Preview)
  useEffect(() => {
    if (!showEditModal || !loadedSourceImg || naturalWidth === 0) return;

    try {
      const geo = computeCropGeometry();
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(10, geo.cropW);
      canvas.height = Math.max(10, geo.cropH);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(
          loadedSourceImg,
          geo.cropX,
          geo.cropY,
          geo.cropW,
          geo.cropH,
          0,
          0,
          canvas.width,
          canvas.height
        );
        const url = canvas.toDataURL("image/webp", 0.9);
        setResultPreviewUrl(url);
      }
    } catch (e) {
      // Tainted canvas fallback nếu có
      console.warn("Lỗi sinh bản xem trước kết quả:", e);
    }
  }, [showEditModal, loadedSourceImg, naturalWidth, naturalHeight, computeCropGeometry]);

  // Tương tác kéo thả chuột trên khung cắt trực quan
  const handleFramePointer = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactiveFrameRef.current) return;
      const rect = interactiveFrameRef.current.getBoundingClientRect();
      const xPercent = Math.round(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
      const yPercent = Math.round(Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)));
      setPosX(xPercent);
      setPosY(yPercent);
    },
    []
  );

  const handleMouseDownFrame = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingCrop(true);
    handleFramePointer(e);
  };

  const handleMouseMoveFrame = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingCrop) return;
    handleFramePointer(e);
  };

  const handleMouseUpFrame = () => {
    setIsDraggingCrop(false);
  };

  // Đặt lại vị trí tâm cắt
  const handleResetFocal = () => {
    setPosX(50);
    setPosY(50);
    setZoom(1.0);
  };

  // Lưu nhanh kích thước / căn lề trên Bubble Toolbar
  const handleQuickSize = (newWidth: string) => {
    setWidth(newWidth);
    editor.chain().focus().updateAttributes("image", { width: newWidth }).run();
  };

  const handleQuickAlign = (newAlign: ImageAlignment) => {
    setAlignment(newAlign);
    editor.chain().focus().updateAttributes("image", { alignment: newAlign }).run();
  };

  // Xóa ảnh khỏi bài viết
  const handleDeleteClick = () => {
    const attrs = editor.getAttributes("image");
    setSrc(attrs.src || "");
    setAlt(attrs.alt || "");
    setCaption(attrs.caption || "");
    const { selection } = editor.state;
    setDeletePos(selection.from);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    if (deletePos !== null) {
      try {
        editor.chain().focus().setNodeSelection(deletePos).deleteSelection().run();
      } catch {
        editor.chain().focus().deleteSelection().run();
      }
    } else {
      editor.chain().focus().deleteSelection().run();
    }
    setDeletePos(null);
  };

  /**
   * HÀNH ĐỘNG CHÍNH: CẮT ẢNH THÀNH FILE MỚI & LƯU LÊN R2 (VẪN BẢO LƯU ẢNH GỐC)
   */
  const handleCropAndSaveNewImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!src) return;

    setIsProcessing(true);
    setProcessStatus("Đang tải dữ liệu ảnh chất lượng gốc...");

    try {
      // 1. Tải ảnh nguồn an toàn
      const sourceImg = await loadSafeImage(src);
      const geo = computeCropGeometry();

      setProcessStatus("Đang thực hiện cắt ảnh theo vùng đã chọn...");

      // 2. Tạo Canvas để cắt ảnh thực sự
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(10, geo.cropW);
      canvas.height = Math.max(10, geo.cropH);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Không thể khởi tạo môi trường vẽ Canvas 2D");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        sourceImg,
        geo.cropX,
        geo.cropY,
        geo.cropW,
        geo.cropH,
        0,
        0,
        canvas.width,
        canvas.height
      );

      setProcessStatus("Đang xuất định dạng ảnh nén WebP...");

      // 3. Xuất Canvas thành Blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error("Lỗi khi xuất dữ liệu ảnh từ Canvas"));
          },
          "image/webp",
          0.92
        );
      });

      // 4. Chuẩn bị file tải lên R2
      let cleanFileName = (newFileName || "").trim();
      if (!cleanFileName) {
        cleanFileName = `cropped-image-${Date.now()}.webp`;
      }
      if (!cleanFileName.endsWith(".webp") && !cleanFileName.endsWith(".png") && !cleanFileName.endsWith(".jpg")) {
        cleanFileName += ".webp";
      }

      setProcessStatus("Đang lưu ảnh mới lên Cloudflare R2...");

      const newFile = new File([blob], cleanFileName, { type: "image/webp" });
      const destFolder = targetFolder || "uploads";

      let finalUrl = "";

      // Thử tải qua Presigned URL trước
      try {
        const { data: presignedData } = await axios.post("/api/r2/upload", {
          filename: cleanFileName,
          contentType: "image/webp",
          folder: destFolder,
        });

        if (presignedData?.uploadUrl) {
          await axios.put(presignedData.uploadUrl, newFile, {
            headers: { "Content-Type": "image/webp" },
          });
          finalUrl = presignedData.publicUrl;
        }
      } catch (directErr) {
        console.warn("Direct upload gặp lỗi, chuyển sang Proxy upload:", directErr);
      }

      // Nếu Direct Upload không thành công thì fallback qua Proxy
      if (!finalUrl) {
        const formData = new FormData();
        formData.append("file", newFile);
        formData.append("folder", destFolder);

        const { data: proxyData } = await axios.post("/api/r2/upload-proxy", formData);
        if (proxyData?.publicUrl) {
          finalUrl = proxyData.publicUrl;
        } else {
          throw new Error("Không nhận được URL từ máy chủ sau khi tải lên");
        }
      }

      // 5. Cập nhật thẻ ảnh trong Editor thành URL ảnh mới
      setProcessStatus("Hoàn tất! Đang cập nhật bài viết...");

      editor
        .chain()
        .focus()
        .updateAttributes("image", {
          src: finalUrl,
          alt: alt.trim(),
          caption: caption.trim(),
          width: width.trim() || "100%",
          aspectRatio: "auto", // Ảnh mới đã thực sự được cắt theo tỷ lệ chuẩn
          alignment: alignment,
          objectFit: "cover",
          objectPosition: "50% 50%",
        })
        .run();

      toast.success(`Đã cắt và lưu ảnh mới "${cleanFileName}" thành công! Ảnh gốc vẫn được giữ nguyên.`);
      setShowEditModal(false);
    } catch (err: any) {
      console.error("Lỗi khi cắt và lưu ảnh mới:", err);
      toast.error(err?.message || "Có lỗi xảy ra khi xử lý và lưu ảnh mới");
    } finally {
      setIsProcessing(false);
      setProcessStatus("");
    }
  };

  const cropGeo = computeCropGeometry();

  return (
    <>
      {/* ── 1. Floating Bubble Menu khi click chọn ảnh trong Editor ── */}
      <BubbleMenu
        shouldShow={({ editor: currEditor }) => currEditor.isActive("image")}
        editor={editor}
        tippyOptions={{
          placement: "top",
          maxWidth: "none",
          offset: [0, 8],
          getReferenceClientRect: () => {
            const { selection } = editor.state;
            const dom = editor.view.nodeDOM(selection.from) as HTMLElement;
            if (dom) {
              const rect = dom.getBoundingClientRect();
              const x = rect.left + rect.width / 2;
              const y = rect.top;
              return {
                width: 0,
                height: 0,
                top: y,
                bottom: y,
                left: x,
                right: x,
                x: x,
                y: y,
                toJSON: () => {},
              } as DOMRect;
            }
            return new DOMRect();
          },
        }}
      >
        <div
          data-bubble-menu="true"
          className="bubble-menu-card w-max max-w-[calc(100vw-32px)] rounded-xl bg-gray-900/95 backdrop-blur-md text-white shadow-2xl px-2.5 py-1.5 flex items-center gap-1.5 z-50 border border-gray-700/80 select-none text-xs flex-nowrap whitespace-nowrap animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Thumbnail ảnh */}
          <div className="flex items-center gap-1.5 pr-2 border-r border-gray-700/80 max-w-[120px] shrink-0">
            {src && (
              <div className="w-5 h-5 rounded overflow-hidden bg-gray-800 shrink-0 border border-gray-600">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <span className="truncate text-[11px] font-medium text-gray-200" title={caption || alt || src}>
              {caption || alt || "Hình ảnh"}
            </span>
          </div>

          {/* NÚT CHÍNH: CHỈNH SỬA & CẮT ẢNH */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleOpenStudio}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-[#105d97] hover:bg-[#0c4672] text-white font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95"
            title="Mở studio để chỉnh sửa, cắt ảnh và lưu thành ảnh mới (giữ nguyên ảnh gốc)"
          >
            <BsCrop size={13} />
            <span className="text-[11px] font-semibold whitespace-nowrap">Chỉnh sửa ảnh</span>
          </button>

          <div className="h-4 w-[1px] bg-gray-700 shrink-0" />

          {/* Quick Resize (25% | 50% | 75% | 100%) */}
          <div className="flex items-center gap-0.5 bg-gray-800/90 p-0.5 rounded-lg border border-gray-700/60 shrink-0">
            {SIZE_PRESETS.map((sz) => (
              <button
                key={sz.value}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleQuickSize(sz.value)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer shrink-0 ${
                  width === sz.value
                    ? "bg-[#105d97] text-white shadow-xs"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
                title={`Kích thước hiển thị ${sz.label}`}
              >
                {sz.label}
              </button>
            ))}
          </div>

          {/* Quick Alignment (Trái | Giữa | Phải) */}
          <div className="flex items-center gap-0.5 bg-gray-800/90 p-0.5 rounded-lg border border-gray-700/60 shrink-0">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleQuickAlign("left")}
              className={`p-1 rounded transition-colors cursor-pointer shrink-0 ${
                alignment === "left"
                  ? "bg-[#105d97] text-white shadow-xs"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
              title="Căn trái"
            >
              <MdFormatAlignLeft size={13} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleQuickAlign("center")}
              className={`p-1 rounded transition-colors cursor-pointer shrink-0 ${
                alignment === "center"
                  ? "bg-[#105d97] text-white shadow-xs"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
              title="Căn giữa"
            >
              <MdFormatAlignCenter size={13} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleQuickAlign("right")}
              className={`p-1 rounded transition-colors cursor-pointer shrink-0 ${
                alignment === "right"
                  ? "bg-[#105d97] text-white shadow-xs"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
              title="Căn phải"
            >
              <MdFormatAlignRight size={13} />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-gray-700 shrink-0" />

          {/* Nút Xóa ảnh */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleDeleteClick}
            className="shrink-0 p-1.5 hover:text-red-400 text-gray-400 transition-colors cursor-pointer"
            title="Xóa ảnh khỏi bài viết"
          >
            <BsTrash size={14} />
          </button>
        </div>
      </BubbleMenu>

      {/* ── 2. Modal Studio Chỉnh sửa & Cắt ảnh (Tạo ảnh mới, giữ nguyên ảnh gốc) ── */}
      {mounted &&
        showEditModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[10000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn"
            onClick={() => !isProcessing && setShowEditModal(false)}
          >
            <div
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-5xl w-full flex flex-col max-h-[94vh] overflow-hidden transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/90 dark:bg-gray-850/90">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#105d97] dark:text-sky-300 flex items-center justify-center font-bold">
                    <BsCrop size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                        Chỉnh sửa & Cắt hình ảnh
                      </h3>
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <FiShield size={11} />
                        Bảo lưu ảnh gốc
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Tùy chỉnh vùng cắt ảnh, xem trước trực tiếp và lưu thành file ảnh mới trên Cloudflare R2
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setShowEditModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  title="Đóng cửa sổ"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Body Modal (2 Columns: Cột điều khiển & Cột xem trước) */}
              <form onSubmit={handleCropAndSaveNewImage} className="flex flex-col flex-1 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto custom-scrollbar">
                  {/* ── CỘT TRÁI (5 Cols): Các công cụ & Cài đặt xuất file ── */}
                  <div className="lg:col-span-5 p-5 space-y-4 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
                    {/* 1. Chọn Tỷ lệ cắt ảnh */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                          <MdAspectRatio className="text-[#105d97]" size={15} />
                          <span>Tỷ lệ khung hình (Aspect Ratio):</span>
                        </label>
                        <span className="text-[11px] font-mono font-bold text-[#105d97] dark:text-sky-400">
                          {aspectRatio}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {RATIO_PRESETS.map((r) => (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => setAspectRatio(r.value)}
                            className={`p-2 text-left rounded-xl border text-xs transition-all cursor-pointer ${
                              aspectRatio === r.value
                                ? "bg-blue-50 dark:bg-sky-950/60 border-[#105d97] text-[#105d97] dark:text-sky-300 font-bold ring-2 ring-[#105d97]/40 shadow-xs"
                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">{r.label}</span>
                              {aspectRatio === r.value && <FiCheck size={13} className="text-[#105d97]" />}
                            </div>
                            <span className="text-[10px] text-gray-400 block font-normal leading-tight mt-0.5">
                              {r.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Điều khiển Vị trí cắt & Thu phóng */}
                    <div className="bg-white dark:bg-gray-800 p-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                            <FiSliders size={13} className="text-[#105d97]" />
                            <span>Vị trí tâm cắt &amp; Thu phóng:</span>
                          </label>
                          <span className="text-[10px] text-gray-400 block">
                            Dùng lưới neo, thanh trượt hoặc kéo thả chuột trên ảnh
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleResetFocal}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                          title="Đặt lại về tâm chính giữa và thu phóng 1x"
                        >
                          <FiRefreshCw size={11} />
                          <span>Đặt lại</span>
                        </button>
                      </div>

                      {/* Ma trận 9 điểm neo + Sliders */}
                      <div className="flex items-center gap-3">
                        {/* Lưới 9 điểm neo */}
                        <div className="grid grid-cols-3 gap-1 bg-gray-100 dark:bg-gray-750 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 w-28 shrink-0">
                          {ANCHOR_POINTS.map((pt) => {
                            const isSelected = posX === pt.x && posY === pt.y;
                            return (
                              <button
                                key={pt.label}
                                type="button"
                                onClick={() => {
                                  setPosX(pt.x);
                                  setPosY(pt.y);
                                }}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-[#105d97] text-white shadow-xs scale-105 ring-2 ring-[#105d97]/40"
                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
                                }`}
                                title={pt.title}
                              >
                                {pt.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Sliders X, Y */}
                        <div className="flex-1 space-y-2">
                          <div>
                            <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 mb-0.5">
                              <span>Trục ngang (X):</span>
                              <span className="font-mono font-bold text-[#105d97]">{posX}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={posX}
                              onChange={(e) => setPosX(Number(e.target.value))}
                              className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#105d97]"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 mb-0.5">
                              <span>Trục dọc (Y):</span>
                              <span className="font-mono font-bold text-[#105d97]">{posY}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={posY}
                              onChange={(e) => setPosY(Number(e.target.value))}
                              className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#105d97]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Thu phóng (Zoom) */}
                      <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 mb-1">
                          <span className="flex items-center gap-1">
                            <FiZoomIn size={12} className="text-[#105d97]" />
                            <span>Thu phóng vùng cắt (Zoom):</span>
                          </span>
                          <span className="font-mono font-bold text-[#105d97]">{zoom.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="1.0"
                          max="3.0"
                          step="0.1"
                          value={zoom}
                          onChange={(e) => setZoom(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#105d97]"
                        />
                      </div>
                    </div>

                    {/* 3. Tên file mới & Thông tin lưu trữ */}
                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">
                          Tên file ảnh mới sẽ tạo:
                        </label>
                        <input
                          type="text"
                          value={newFileName}
                          onChange={(e) => setNewFileName(e.target.value)}
                          placeholder="ten-anh-moi.webp"
                          className="w-full text-xs bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-600 px-3 py-2 font-mono text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#105d97]"
                        />
                        <span className="text-[10px] text-gray-400 mt-0.5 block">
                          Lưu vào thư mục: <strong className="text-gray-600 dark:text-gray-300">{targetFolder || "uploads"}</strong> trên Cloudflare R2
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Alt text (SEO)
                          </label>
                          <input
                            type="text"
                            value={alt}
                            onChange={(e) => setAlt(e.target.value)}
                            placeholder="Mô tả hình ảnh..."
                            className="w-full text-xs bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-600 px-2.5 py-1.5 focus:ring-1 focus:ring-[#105d97]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Chú thích (Caption)
                          </label>
                          <input
                            type="text"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Hiện dưới bài viết..."
                            className="w-full text-xs bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-600 px-2.5 py-1.5 focus:ring-1 focus:ring-[#105d97]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hộp bảo vệ ảnh gốc an toàn */}
                    <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-200">
                      <FiShield size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong className="font-semibold block text-emerald-800 dark:text-emerald-300">
                          Bảo toàn ảnh gốc 100%
                        </strong>
                        Ảnh gốc vẫn được lưu nguyên vẹn trong thư viện. Một file ảnh mới sẽ được tạo ra với kích thước cắt thực tế và thay thế vào bài viết này.
                      </div>
                    </div>
                  </div>

                  {/* ── CỘT PHẢI (7 Cols): KHUNG XEM TRƯỚC TRỰC TIẾP (LIVE PREVIEW STUDIO) ── */}
                  <div className="lg:col-span-7 p-6 flex flex-col justify-between bg-gray-100/70 dark:bg-gray-950/60 select-none">
                    <div>
                      {/* Tiêu đề & Tab chuyển đổi chế độ xem trước */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        {/* Tabs xem trước */}
                        <div className="inline-flex p-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => setPreviewTab("interactive")}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                              previewTab === "interactive"
                                ? "bg-[#105d97] text-white shadow-xs"
                                : "text-gray-600 dark:text-gray-300 hover:text-gray-900"
                            }`}
                          >
                            <BsCrop size={13} />
                            <span>Khung cắt trực quan</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewTab("result")}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                              previewTab === "result"
                                ? "bg-[#105d97] text-white shadow-xs"
                                : "text-gray-600 dark:text-gray-300 hover:text-gray-900"
                            }`}
                          >
                            <FiEye size={13} />
                            <span>Ảnh kết quả mới</span>
                          </button>
                        </div>

                        {/* Thông số pixel */}
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono bg-white dark:bg-gray-800 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-2xs">
                          <span>Kích thước cắt: <strong className="text-gray-900 dark:text-gray-100">{cropGeo.cropW} × {cropGeo.cropH} px</strong></span>
                        </div>
                      </div>

                      {/* Hướng dẫn thao tác */}
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
                        <span className="text-amber-500 font-bold">💡 Hướng dẫn:</span>
                        <span>
                          {previewTab === "interactive"
                            ? "Click hoặc kéo thả trực tiếp trên ảnh bên dưới để di chuyển khung chữ nhật cắt."
                            : "Đây là hình ảnh thực tế sẽ được xuất ra thành file mới sau khi nhấn Lưu."}
                        </span>
                      </p>

                      {/* KHUNG XEM TRƯỚC CHÍNH */}
                      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center min-h-[340px] justify-center">
                        {previewTab === "interactive" ? (
                          /* TAB 1: KHUNG CẮT TRỰC QUAN TRÊN ẢNH GỐC */
                          <div
                            ref={interactiveFrameRef}
                            onMouseDown={handleMouseDownFrame}
                            onMouseMove={handleMouseMoveFrame}
                            onMouseUp={handleMouseUpFrame}
                            className="relative max-w-full rounded-xl overflow-hidden shadow-md cursor-crosshair border border-gray-300 dark:border-gray-700 select-none"
                            style={{
                              aspectRatio:
                                naturalWidth && naturalHeight ? `${naturalWidth} / ${naturalHeight}` : "auto",
                              maxHeight: "380px",
                            }}
                            title="Click hoặc kéo rê chuột để chọn vị trí khung cắt ảnh"
                          >
                            {/* Ảnh gốc đầy đủ */}
                            {src ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={src}
                                alt="Source"
                                draggable={false}
                                className="w-full h-full object-contain pointer-events-none select-none block"
                              />
                            ) : (
                              <div className="w-64 h-48 flex items-center justify-center text-gray-400 text-xs">
                                Chưa có hình ảnh
                              </div>
                            )}

                            {/* Lớp phủ mờ (Dark overlay) bên ngoài khung cắt */}
                            <div className="absolute inset-0 bg-black/45 pointer-events-none" />

                            {/* Khung chữ nhật cắt sáng rõ (Crop Bounding Box) */}
                            <div
                              className="absolute border-2 border-white shadow-2xl transition-all duration-75 overflow-hidden"
                              style={{
                                left: `${cropGeo.boxLeftPercent}%`,
                                top: `${cropGeo.boxTopPercent}%`,
                                width: `${cropGeo.boxWidthPercent}%`,
                                height: `${cropGeo.boxHeightPercent}%`,
                                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.45)",
                              }}
                            >
                              {/* Lưới chia ba (Rule of thirds grid lines) */}
                              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                                <div className="border-r border-b border-white" />
                                <div className="border-r border-b border-white" />
                                <div className="border-b border-white" />
                                <div className="border-r border-b border-white" />
                                <div className="border-r border-b border-white" />
                                <div className="border-b border-white" />
                                <div className="border-r border-white" />
                                <div className="border-r border-white" />
                                <div />
                              </div>

                              {/* Tâm ngắm Focal Reticle chính giữa khung cắt */}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-6 h-6 rounded-full bg-[#105d97] text-white flex items-center justify-center ring-2 ring-white shadow-md">
                                  <span className="w-2 h-2 rounded-full bg-white" />
                                </div>
                              </div>

                              {/* 4 Góc khung cắt (Corner handles) */}
                              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white" />
                              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white" />
                              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white" />
                              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white" />
                            </div>

                            {/* Badge tọa độ và tỷ lệ góc trên */}
                            <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-md pointer-events-none font-mono flex items-center gap-2">
                              <span>Tâm: X:{posX}% Y:{posY}%</span>
                              <span>•</span>
                              <span>Tỷ lệ: {aspectRatio}</span>
                            </div>
                          </div>
                        ) : (
                          /* TAB 2: XEM TRƯỚC ẢNH KẾT QUẢ MỚI ĐƯỢC XUẤT RA */
                          <div className="w-full flex flex-col items-center justify-center">
                            {resultPreviewUrl ? (
                              <div className="rounded-xl overflow-hidden border-2 border-dashed border-[#105d97] shadow-lg max-h-[380px]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={resultPreviewUrl}
                                  alt="Result Preview"
                                  className="max-w-full max-h-[360px] object-contain block"
                                />
                              </div>
                            ) : (
                              <div className="py-12 text-center text-gray-400 text-xs">
                                Đang dựng ảnh kết quả xem trước...
                              </div>
                            )}
                            <p className="mt-3 text-xs text-gray-500 font-medium">
                              File mới: <strong className="text-gray-800 dark:text-gray-200 font-mono">{newFileName || "cropped-image.webp"}</strong> ({cropGeo.cropW} × {cropGeo.cropH} px)
                            </p>
                          </div>
                        )}

                        {/* Chú thích hiển thị (nếu có) */}
                        {caption && (
                          <p className="mt-2.5 text-xs text-gray-500 italic text-center">
                            {caption}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer thanh thông số */}
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
                      <span>Ảnh gốc: <strong className="text-gray-800 dark:text-gray-200 font-mono">{naturalWidth} × {naturalHeight} px</strong></span>
                      <span>Chiều rộng trong bài: <strong className="text-gray-800 dark:text-gray-200">{width}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Footer Modal: Các nút hành động */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850">
                  {/* Trạng thái tiến trình */}
                  <div className="flex items-center gap-2 text-xs">
                    {isProcessing ? (
                      <div className="flex items-center gap-2 text-[#105d97] dark:text-sky-400 font-semibold animate-pulse">
                        <span className="w-3.5 h-3.5 border-2 border-[#105d97] border-t-transparent rounded-full animate-spin" />
                        <span>{processStatus || "Đang xử lý và tải ảnh lên..."}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Ảnh mới sẽ được tạo và cập nhật ngay vào bài viết</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Hủy bỏ
                    </button>

                    {/* NÚT OK: CẮT & LƯU ẢNH MỚI */}
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-5 py-2 text-xs font-bold text-white bg-[#105d97] hover:bg-[#0c4672] rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-98"
                    >
                      {isProcessing ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang lưu ảnh...</span>
                        </>
                      ) : (
                        <>
                          <FiUploadCloud size={16} />
                          <span>OK - Cắt &amp; Lưu ảnh mới</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ── 3. Modal Popup Xác nhận Xóa ảnh ── */}
      {mounted &&
        showDeleteConfirm &&
        createPortal(
          <div
            className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-sm w-full p-6 text-center transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 mx-auto mb-3.5 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center">
                <FiAlertTriangle size={28} />
              </div>

              <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
                Xóa ảnh khỏi bài viết?
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                Bạn có chắc chắn muốn xóa hình ảnh này khỏi nội dung bài viết không?
              </p>

              {src && (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-3 mb-5 text-left">
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-white flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate"
                      title={caption || alt || src}
                    >
                      {caption || alt || "Hình ảnh"}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate" title={src}>
                      {src}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BsTrash size={14} />
                  <span>Xóa ảnh</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default EditImage;
