import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FiX,
  FiUploadCloud,
  FiImage,
  FiPlus,
  FiTrash2,
  FiCalendar,
  FiDollarSign,
  FiLayers,
  FiCheck,
  FiCpu,
  FiZap,
  FiClipboard,
  FiSettings,
  FiCamera,
  FiRefreshCw,
} from "react-icons/fi";
import R2ImageModal from "../../editor/R2ImageModal";

const SIZES = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];

const SALES_REPS = [
  "Lê Vân",
  "Nguyễn Linh",
  "Thu Trang",
  "Bảo Yến",
  "Anh Tuấn",
  "Trường Giang",
  "UniVi Sport",
];

const getTodayDateInput = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateForInput = (dateStr) => {
  if (!dateStr) return getTodayDateInput();
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
    const [d, m, y] = dateStr.split("/");
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return getTodayDateInput();
};

const INITIAL_FORM = {
  orderCode: "",
  reportDate: "",
  orderDate: getTodayDateInput(),
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  customerFacebook: "",
  customerWebsite: "",
  channel: "Fanpage Facebook",
  salesRep: "Lê Vân",

  mockupFull: "",
  mockupFront: "",
  mockupBack: "",

  designCodes: [""],
  sewingDetails: [""],
  fabric: "",
  colors: "",

  craftPositions: {
    front: { technique: "", size: "", note: "" },
    leftSleeve: { technique: "", size: "", note: "" },
    back: { technique: "", size: "", note: "" },
    rightSleeve: { technique: "", size: "", note: "" },
  },

  sizes: {
    men: { S: 0, M: 0, L: 0, XL: 0, "2XL": 0, "3XL": 0, "4XL": 0, "5XL": 0 },
    women: { S: 0, M: 0, L: 0, XL: 0, "2XL": 0, "3XL": 0, "4XL": 0, "5XL": 0 },
  },

  completionDate: "",
  deliveryDate: "",
  note: "",

  unitPrice: 0,
  totalAmount: 0,
  deposit: 0,
  status: "pending",
};

export default function UniformOrderFormModal({
  isOpen,
  onClose,
  initialData,
  onSaved,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // R2 Image Modal state
  const [r2TargetField, setR2TargetField] = useState(null); // "mockupFull" | "mockupFront" | "mockupBack"
  const [r2InitialFolder, setR2InitialFolder] = useState("mockup");
  const [r2InitialTab, setR2InitialTab] = useState("manage"); // "manage" | "upload"
  const [r2InitialFile, setR2InitialFile] = useState(null);
  const [r2ModalVisible, setR2ModalVisible] = useState(false);
  const [activeDragField, setActiveDragField] = useState(null); // "mockupFull" | "mockupFront" | "mockupBack"

  // AI Image Scanning state (Google Gemini AI qua .env)
  const [aiImagePreview, setAiImagePreview] = useState("");
  const [aiScanning, setAiScanning] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState("");
  const [aiError, setAiError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Kéo thả và dán ảnh cho các ô Mockup (Tổng quan, Mặt trước, Mặt sau)
  const handleCardDrop = (e, field) => {
    e.preventDefault();
    setActiveDragField(null);
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
      openR2Picker(field, "mockup", "upload", file);
    }
  };

  const handleCardPaste = (e, field) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          e.stopPropagation();
          openR2Picker(field, "mockup", "upload", file);
          break;
        }
      }
    }
  };

  // Lắng nghe sự kiện dán ảnh (Ctrl + V) trên toàn Modal cho AI Scanner
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e) => {
      // Nếu đang trong input hoặc element có handler riêng thì bỏ qua
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (
        document.activeElement?.dataset?.zone === "mockup-zone" ||
        document.activeElement?.id === "mockup-full-input" ||
        document.activeElement?.id === "mockup-front-input" ||
        document.activeElement?.id === "mockup-back-input"
      ) {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = (event) => {
              setAiImagePreview(event.target.result);
              setAiSuccessMessage("");
              setAiError("");
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAiImagePreview(event.target.result);
        setAiSuccessMessage("");
        setAiError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAiImagePreview(event.target.result);
        setAiSuccessMessage("");
        setAiError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScanWithAI = async () => {
    if (!aiImagePreview) {
      setAiError("Vui lòng tải lên hoặc nhấn Ctrl + V để dán ảnh trước khi quét!");
      return;
    }

    setAiScanning(true);
    setAiError("");
    setAiSuccessMessage("");

    try {
      const res = await axios.post("/api/admin/uniform-orders/scan-ai", {
        imageBase64: aiImagePreview,
      });

      const extracted = res.data?.data;
      if (!extracted) {
        throw new Error("Không nhận được dữ liệu trích xuất từ Gemini AI");
      }

      // Merge dữ liệu đã quét vào form (KHÔNG tự động chèn ảnh vào mockupFull)
      setFormData((prev) => {
        const next = { ...prev };

        if (extracted.orderDate) next.orderDate = extracted.orderDate;
        if (extracted.reportDate) next.reportDate = extracted.reportDate;
        if (extracted.customerName && !prev.customerName) {
          next.customerName = extracted.customerName;
        }
        if (extracted.customerPhone && !prev.customerPhone) {
          next.customerPhone = extracted.customerPhone;
        }
        if (extracted.customerFacebook && !prev.customerFacebook) {
          next.customerFacebook = extracted.customerFacebook;
        }
        if (extracted.customerWebsite && !prev.customerWebsite) {
          next.customerWebsite = extracted.customerWebsite;
        }

        if (Array.isArray(extracted.designCodes) && extracted.designCodes.length > 0) {
          next.designCodes = extracted.designCodes;
        }
        if (Array.isArray(extracted.sewingDetails) && extracted.sewingDetails.length > 0) {
          next.sewingDetails = extracted.sewingDetails;
        }
        if (extracted.fabric) next.fabric = extracted.fabric;
        if (extracted.colors) next.colors = extracted.colors;

        if (extracted.craftPositions) {
          next.craftPositions = {
            front: { ...prev.craftPositions.front, ...(extracted.craftPositions.front || {}) },
            leftSleeve: { ...prev.craftPositions.leftSleeve, ...(extracted.craftPositions.leftSleeve || {}) },
            back: { ...prev.craftPositions.back, ...(extracted.craftPositions.back || {}) },
            rightSleeve: { ...prev.craftPositions.rightSleeve, ...(extracted.craftPositions.rightSleeve || {}) },
          };
        }

        if (extracted.sizes) {
          next.sizes = {
            men: { ...prev.sizes.men, ...(extracted.sizes.men || {}) },
            women: { ...prev.sizes.women, ...(extracted.sizes.women || {}) },
          };
        }

        if (extracted.completionDate) next.completionDate = extracted.completionDate;
        if (extracted.deliveryDate) next.deliveryDate = extracted.deliveryDate;
        if (extracted.note) next.note = extracted.note;

        return next;
      });

      setAiSuccessMessage(
        "🎉 Quét thành công! AI đã tự động điền các mã thiết kế, chi tiết may, 4 vị trí in/thêu và số lượng size vào form."
      );
    } catch (err) {
      console.error(err);
      setAiError(
        err.response?.data?.message || err.message || "Lỗi khi quét ảnh với Gemini AI"
      );
    } finally {
      setAiScanning(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...INITIAL_FORM,
        ...initialData,
        designCodes:
          Array.isArray(initialData.designCodes) && initialData.designCodes.length > 0
            ? initialData.designCodes
            : [""],
        sewingDetails:
          Array.isArray(initialData.sewingDetails) && initialData.sewingDetails.length > 0
            ? initialData.sewingDetails
            : [""],
        craftPositions: {
          front: { ...INITIAL_FORM.craftPositions.front, ...(initialData.craftPositions?.front || {}) },
          leftSleeve: { ...INITIAL_FORM.craftPositions.leftSleeve, ...(initialData.craftPositions?.leftSleeve || {}) },
          back: { ...INITIAL_FORM.craftPositions.back, ...(initialData.craftPositions?.back || {}) },
          rightSleeve: { ...INITIAL_FORM.craftPositions.rightSleeve, ...(initialData.craftPositions?.rightSleeve || {}) },
        },
        sizes: {
          men: { ...INITIAL_FORM.sizes.men, ...(initialData.sizes?.men || {}) },
          women: { ...INITIAL_FORM.sizes.women, ...(initialData.sizes?.women || {}) },
        },
      });
    } else {
      // Form mới: Tạo mã đơn gợi ý
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const dateStr = `${day}/${month}`;
      setFormData({
        ...INITIAL_FORM,
        orderDate: getTodayDateInput(),
        reportDate: dateStr,
        salesRep: "Lê Vân",
      });
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Tính tổng số lượng
  const totalMen = SIZES.reduce((sum, sz) => sum + Number(formData.sizes.men[sz] || 0), 0);
  const totalWomen = SIZES.reduce((sum, sz) => sum + Number(formData.sizes.women[sz] || 0), 0);
  const totalQuantity = totalMen + totalWomen;

  // Tính tổng tiền & còn lại
  const calculatedTotal =
    formData.totalAmount && Number(formData.totalAmount) > 0
      ? Number(formData.totalAmount)
      : Number(formData.unitPrice || 0) * totalQuantity;
  const remaining = Math.max(0, calculatedTotal - Number(formData.deposit || 0));

  const handleSizeChange = (gender, sizeKey, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setFormData((prev) => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [gender]: {
          ...prev.sizes[gender],
          [sizeKey]: num,
        },
      },
    }));
  };

  const handleCraftChange = (pos, field, val) => {
    setFormData((prev) => ({
      ...prev,
      craftPositions: {
        ...prev.craftPositions,
        [pos]: {
          ...prev.craftPositions[pos],
          [field]: val,
        },
      },
    }));
  };

  const addDesignCode = () => {
    setFormData((prev) => ({
      ...prev,
      designCodes: [...prev.designCodes, ""],
    }));
  };

  const removeDesignCode = (index) => {
    setFormData((prev) => ({
      ...prev,
      designCodes: prev.designCodes.filter((_, i) => i !== index),
    }));
  };

  const updateDesignCode = (index, val) => {
    setFormData((prev) => {
      const arr = [...prev.designCodes];
      arr[index] = val;
      return { ...prev, designCodes: arr };
    });
  };

  const addSewingDetail = () => {
    setFormData((prev) => ({
      ...prev,
      sewingDetails: [...prev.sewingDetails, ""],
    }));
  };

  const removeSewingDetail = (index) => {
    setFormData((prev) => ({
      ...prev,
      sewingDetails: prev.sewingDetails.filter((_, i) => i !== index),
    }));
  };

  const updateSewingDetail = (index, val) => {
    setFormData((prev) => {
      const arr = [...prev.sewingDetails];
      arr[index] = val;
      return { ...prev, sewingDetails: arr };
    });
  };

  const openR2Picker = (field, folder = "mockup", tab = "manage", file = null) => {
    setR2TargetField(field);
    setR2InitialFolder(folder || "mockup");
    setR2InitialTab(tab || "manage");
    setR2InitialFile(file || null);
    setR2ModalVisible(true);
  };

  const handleR2Select = (result) => {
    if (r2TargetField && result?.src) {
      setFormData((prev) => ({
        ...prev,
        [r2TargetField]: result.src,
      }));
    }
    setR2ModalVisible(false);
    setR2InitialFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName.trim()) {
      setError("Vui lòng nhập tên khách hàng / đơn vị!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        designCodes: formData.designCodes.filter((c) => c && c.trim()),
        sewingDetails: formData.sewingDetails.filter((d) => d && d.trim()),
        totalMen,
        totalWomen,
        totalQuantity,
        totalAmount: calculatedTotal,
        remaining,
      };

      if (initialData?.id || initialData?._id) {
        const id = initialData.id || initialData._id;
        const res = await axios.put(`/api/admin/uniform-orders/${id}`, payload);
        onSaved?.(res.data.order);
      } else {
        const res = await axios.post("/api/admin/uniform-orders", payload);
        onSaved?.(res.data.order);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Có lỗi xảy ra khi lưu đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl my-auto max-h-[92vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-[#0e568f] text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <FiLayers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  {initialData ? "Chỉnh sửa đơn may đồng phục" : "Tạo đơn may đồng phục mới"}
                </h2>
                <p className="text-xs text-white/80">
                  Biên bản sản xuất & Theo dõi tiến độ đơn hàng Univi
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* ── AI IMAGE SCANNER BANNER (GOOGLE GEMINI) ── */}
            <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 border-2 border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0e568f] to-indigo-600 text-white flex items-center justify-center shadow-md">
                    <FiCpu className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                      <span>Quét ảnh biên bản bằng AI</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 uppercase tracking-wide">
                        Tự động điền Form
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Chụp màn hình và bấm <span className="font-bold text-indigo-600 dark:text-indigo-400 underline decoration-indigo-400">Ctrl + V</span> để dán ảnh trực tiếp, hoặc kéo thả file ảnh biên bản vào đây.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dropzone & Preview Container */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative rounded-xl border-2 border-dashed transition-all p-3.5 sm:p-4 text-center ${isDragging
                  ? "border-indigo-600 bg-indigo-100/60 dark:bg-indigo-950/40"
                  : "border-indigo-300 dark:border-indigo-800 bg-white/70 dark:bg-gray-900/60 hover:bg-white"
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {aiImagePreview ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Thumbnail preview */}
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 shadow-inner flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={aiImagePreview}
                          alt="Ảnh biên bản xem trước"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
                          Đã chọn ảnh biên bản
                        </span>
                        <span className="text-[11px] text-gray-500 block mt-0.5">
                          Sẵn sàng quét thông số (mã áo, size, in thêu...)
                        </span>
                        <div className="flex gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                          >
                            Đổi ảnh khác
                          </button>
                          <span className="text-gray-300">•</span>
                          <button
                            type="button"
                            onClick={() => {
                              setAiImagePreview("");
                              setAiSuccessMessage("");
                              setAiError("");
                            }}
                            className="text-xs font-semibold text-red-500 hover:text-red-600"
                          >
                            Xóa ảnh
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Scan Button */}
                    <button
                      type="button"
                      disabled={aiScanning}
                      onClick={handleScanWithAI}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#0e568f] to-indigo-600 hover:from-[#0c4a7c] hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                    >
                      {aiScanning ? (
                        <>
                          <FiRefreshCw className="w-4 h-4 animate-spin" />
                          <span>AI đang đọc biên bản...</span>
                        </>
                      ) : (
                        <>
                          <FiZap className="w-4 h-4 fill-amber-300 text-amber-300 stroke-[2.5]" />
                          <span>Quét & Trích xuất vào Form</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-2 sm:py-3 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-2 shadow-inner">
                      <FiUploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      Bấm vào đây để chọn ảnh biên bản, hoặc nhấn <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border text-[11px] font-mono text-indigo-600 font-bold">Ctrl + V</kbd> để dán ảnh
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Hỗ trợ ảnh PNG, JPG, JPEG từ màn hình, Zalo hoặc tài liệu xưởng
                    </p>
                  </div>
                )}
              </div>

              {/* Status messages */}
              {aiSuccessMessage && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <FiCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{aiSuccessMessage}</span>
                </div>
              )}

              {aiError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in">
                  <span>{aiError}</span>
                  <button
                    type="button"
                    onClick={() => setAiError("")}
                    className="text-rose-500 hover:text-rose-700"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* 1. THÔNG TIN KHÁCH HÀNG & NGÀY BIÊN BẢN */}
            <div className="bg-slate-50 dark:bg-gray-800/50 p-4 rounded-xl border border-slate-200 dark:border-gray-700 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0e568f] dark:text-sky-400">
                1. Thông tin khách hàng & Biên bản
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Mã đơn hàng
                  </label>
                  <input
                    type="text"
                    value={formData.orderCode}
                    onChange={(e) => setFormData({ ...formData, orderCode: e.target.value })}
                    placeholder="Tự động sinh nếu để trống"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-mono font-bold focus:ring-2 focus:ring-[#0e568f] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Tên khách hàng / Đơn vị <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="VD: Phòng Gym Fitness A"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold focus:ring-2 focus:ring-[#0e568f] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="VD: 0987654321"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs focus:ring-2 focus:ring-[#0e568f] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Kênh đặt hàng
                  </label>
                  <select
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium focus:ring-2 focus:ring-[#0e568f] outline-none"
                  >
                    <option value="Facebook">Facebook Fanpage</option>
                    <option value="Zalo">Zalo</option>
                    <option value="Hotline">Hotline</option>
                    <option value="Showroom">Showroom / Trực tiếp</option>
                    <option value="Khách quen">Khách quen / Giới thiệu</option>
                    <option value="Website">Website Univi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                    <FiCalendar className="w-3.5 h-3.5 text-[#0e568f]" />
                    <span>Ngày lên đơn</span>
                  </label>
                  <input
                    type="date"
                    value={formatDateForInput(formData.orderDate)}
                    onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold focus:ring-2 focus:ring-[#0e568f] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 text-red-600">
                    Ngày lên biên bản (hiển thị góc phải)
                  </label>
                  <input
                    type="text"
                    value={formData.reportDate}
                    onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
                    placeholder="VD: 10/10"
                    className="w-full px-3 py-2 rounded-lg border border-red-300 dark:border-red-900 bg-white dark:bg-gray-800 text-xs font-bold text-red-600 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Nhân viên phụ trách
                  </label>
                  <select
                    value={formData.salesRep || "Lê Vân"}
                    onChange={(e) => setFormData({ ...formData, salesRep: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#0e568f] outline-none"
                  >
                    {SALES_REPS.map((rep) => (
                      <option key={rep} value={rep}>
                        {rep}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Địa chỉ giao hàng
                  </label>
                  <input
                    type="text"
                    value={formData.customerAddress}
                    onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                    placeholder="Địa chỉ nhận hàng"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs focus:ring-2 focus:ring-[#0e568f] outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Link Facebook / Fanpage
                    </label>
                    {formData.customerFacebook && (
                      <a
                        href={formData.customerFacebook.startsWith("http") ? formData.customerFacebook : `https://${formData.customerFacebook}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 font-semibold"
                      >
                        Mở link ↗
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    value={formData.customerFacebook}
                    onChange={(e) => setFormData({ ...formData, customerFacebook: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs focus:ring-2 focus:ring-[#0e568f] outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Website khách hàng
                    </label>
                    {formData.customerWebsite && (
                      <a
                        href={formData.customerWebsite.startsWith("http") ? formData.customerWebsite : `https://${formData.customerWebsite}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 font-semibold"
                      >
                        Mở web ↗
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    value={formData.customerWebsite}
                    onChange={(e) => setFormData({ ...formData, customerWebsite: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs focus:ring-2 focus:ring-[#0e568f] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. MOCKUP ÁO & QUY CÁCH THIẾT KẾ */}
            <div className="bg-slate-50 dark:bg-gray-800/50 p-4 rounded-xl border border-slate-200 dark:border-gray-700 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0e568f] dark:text-sky-400">
                  2. Hình ảnh Mockup & Quy cách may
                </h3>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  Ảnh tổng quan là bắt buộc cho biên bản • Mockup mặt trước & sau là tùy chọn
                </span>
              </div>

              {/* Mockup Image Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Ảnh thiết kế tổng thể (Có chọn từ R2, Tải ảnh lên R2, kéo thả & dán) */}
                <div className="border border-indigo-200 dark:border-indigo-900/60 rounded-xl p-3 bg-white dark:bg-gray-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold text-[#0e568f] dark:text-sky-400 flex items-center gap-1.5">
                        <FiImage className="w-3.5 h-3.5" />
                        Ảnh tổng quan (2 mặt) <span className="text-red-500">*</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openR2Picker("mockupFull", "mockup", "manage")}
                          className="text-[11px] px-2.5 py-1 bg-sky-100 hover:bg-sky-200 text-[#0e568f] dark:bg-sky-950/60 dark:text-sky-300 rounded-lg font-bold flex items-center gap-1 transition-colors"
                          title="Chọn ảnh có sẵn từ thư viện Cloudflare R2"
                        >
                          <FiImage className="w-3 h-3" />
                          Chọn từ R2
                        </button>
                        <button
                          type="button"
                          onClick={() => openR2Picker("mockupFull", "mockup", "upload")}
                          className="text-[11px] px-2.5 py-1 bg-[#0e568f] hover:bg-[#0c4a7c] text-white rounded-lg font-bold flex items-center gap-1 transition-colors shadow-xs"
                          title="Chọn thư mục lưu trước rồi tải ảnh lên R2"
                        >
                          <FiUploadCloud className="w-3 h-3" />
                          Tải ảnh
                        </button>
                      </div>
                    </div>

                    {/* Dropzone & Paste container */}
                    <div
                      data-zone="mockup-zone"
                      tabIndex={0}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setActiveDragField("mockupFull");
                      }}
                      onDragLeave={() => setActiveDragField(null)}
                      onDrop={(e) => handleCardDrop(e, "mockupFull")}
                      onPaste={(e) => handleCardPaste(e, "mockupFull")}
                      className={`relative rounded-xl border-2 border-dashed transition-all p-2 text-center mb-2 outline-none focus:ring-2 focus:ring-[#0e568f] ${
                        activeDragField === "mockupFull"
                          ? "border-[#0e568f] bg-sky-50 dark:bg-sky-950/50"
                          : formData.mockupFull
                            ? "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40"
                            : "border-sky-300 dark:border-sky-800 bg-sky-50/40 dark:bg-sky-950/20 hover:bg-sky-50 cursor-pointer"
                      }`}
                    >
                      {formData.mockupFull ? (
                        <div>
                          <div className="h-32 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={formData.mockupFull}
                              alt="Mockup full"
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => openR2Picker("mockupFull", "mockup", "manage")}
                              className="text-[11px] font-semibold text-[#0e568f] hover:underline"
                            >
                              Chọn từ R2
                            </button>
                            <span className="text-gray-300">•</span>
                            <button
                              type="button"
                              onClick={() => openR2Picker("mockupFull", "mockup", "upload")}
                              className="text-[11px] font-semibold text-blue-600 hover:underline"
                            >
                              Tải ảnh khác
                            </button>
                            <span className="text-gray-300">•</span>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, mockupFull: "" }))
                              }
                              className="text-[11px] font-semibold text-red-500 hover:underline"
                            >
                              Xóa ảnh
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="py-5 px-2 flex flex-col items-center justify-center"
                          onClick={() => openR2Picker("mockupFull", "mockup", "upload")}
                        >
                          <FiUploadCloud className="w-8 h-8 text-[#0e568f] mb-1.5" />
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                            Bấm để chọn thư mục &amp; tải ảnh lên
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                            Kéo thả hoặc dán ảnh (Ctrl + V) vào đây
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <input
                    id="mockup-full-input"
                    type="text"
                    value={formData.mockupFull}
                    onChange={(e) =>
                      setFormData({ ...formData, mockupFull: e.target.value })
                    }
                    placeholder="URL ảnh hoặc link Cloudflare R2"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono"
                  />
                </div>

                {/* 2. Ảnh Mặt Trước (Tùy chọn - Cho phép tải ảnh lên với chọn thư mục trước) */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                        <FiImage className="w-3.5 h-3.5 text-[#0e568f]" />
                        Mockup Mặt trước <span className="text-gray-400 font-normal text-[11px]">(Tùy chọn)</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openR2Picker("mockupFront", "mockup", "manage")}
                          className="text-[11px] px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                          title="Chọn ảnh có sẵn từ R2"
                        >
                          <FiImage className="w-3 h-3 text-[#0e568f]" />
                          Chọn R2
                        </button>
                        <button
                          type="button"
                          onClick={() => openR2Picker("mockupFront", "mockup", "upload")}
                          className="text-[11px] px-2.5 py-1 bg-[#0e568f] hover:bg-[#0c4a7c] text-white rounded-lg font-bold flex items-center gap-1 transition-colors shadow-xs"
                          title="Chọn thư mục lưu trước rồi tải ảnh mặt trước lên"
                        >
                          <FiUploadCloud className="w-3 h-3" />
                          Tải ảnh
                        </button>
                      </div>
                    </div>

                    {/* Dropzone & Paste container cho Mockup Mặt Trước */}
                    <div
                      data-zone="mockup-zone"
                      tabIndex={0}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setActiveDragField("mockupFront");
                      }}
                      onDragLeave={() => setActiveDragField(null)}
                      onDrop={(e) => handleCardDrop(e, "mockupFront")}
                      onPaste={(e) => handleCardPaste(e, "mockupFront")}
                      className={`relative rounded-xl border-2 border-dashed transition-all p-2 text-center mb-2 outline-none focus:ring-2 focus:ring-[#0e568f] ${
                        activeDragField === "mockupFront"
                          ? "border-[#0e568f] bg-sky-50 dark:bg-sky-950/50"
                          : formData.mockupFront
                            ? "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40"
                            : "border-gray-300 dark:border-gray-700 hover:border-[#0e568f] bg-gray-50/40 dark:bg-gray-900/20 hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      {formData.mockupFront ? (
                        <div>
                          <div className="h-32 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={formData.mockupFront}
                              alt="Mockup Front"
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => openR2Picker("mockupFront", "mockup", "manage")}
                              className="text-[11px] font-semibold text-[#0e568f] hover:underline"
                            >
                              Chọn từ R2
                            </button>
                            <span className="text-gray-300">•</span>
                            <button
                              type="button"
                              onClick={() => openR2Picker("mockupFront", "mockup", "upload")}
                              className="text-[11px] font-semibold text-blue-600 hover:underline"
                            >
                              Tải ảnh khác
                            </button>
                            <span className="text-gray-300">•</span>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, mockupFront: "" }))
                              }
                              className="text-[11px] font-semibold text-red-500 hover:underline"
                            >
                              Xóa ảnh
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="py-5 px-2 flex flex-col items-center justify-center"
                          onClick={() => openR2Picker("mockupFront", "mockup", "upload")}
                        >
                          <FiUploadCloud className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-1.5" />
                          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                            Bấm để chọn thư mục &amp; tải ảnh mặt trước
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Kéo thả hoặc dán ảnh (Ctrl + V) vào đây
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <input
                    id="mockup-front-input"
                    type="text"
                    value={formData.mockupFront}
                    onChange={(e) =>
                      setFormData({ ...formData, mockupFront: e.target.value })
                    }
                    placeholder="URL ảnh mặt trước (tùy chọn)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono"
                  />
                </div>

                {/* 3. Ảnh Mặt Sau (Tùy chọn - Cho phép tải ảnh lên với chọn thư mục trước) */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                        <FiImage className="w-3.5 h-3.5 text-[#0e568f]" />
                        Mockup Mặt sau <span className="text-gray-400 font-normal text-[11px]">(Tùy chọn)</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openR2Picker("mockupBack", "mockup", "manage")}
                          className="text-[11px] px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                          title="Chọn ảnh có sẵn từ R2"
                        >
                          <FiImage className="w-3 h-3 text-[#0e568f]" />
                          Chọn R2
                        </button>
                        <button
                          type="button"
                          onClick={() => openR2Picker("mockupBack", "mockup", "upload")}
                          className="text-[11px] px-2.5 py-1 bg-[#0e568f] hover:bg-[#0c4a7c] text-white rounded-lg font-bold flex items-center gap-1 transition-colors shadow-xs"
                          title="Chọn thư mục lưu trước rồi tải ảnh mặt sau lên"
                        >
                          <FiUploadCloud className="w-3 h-3" />
                          Tải ảnh
                        </button>
                      </div>
                    </div>

                    {/* Dropzone & Paste container cho Mockup Mặt Sau */}
                    <div
                      data-zone="mockup-zone"
                      tabIndex={0}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setActiveDragField("mockupBack");
                      }}
                      onDragLeave={() => setActiveDragField(null)}
                      onDrop={(e) => handleCardDrop(e, "mockupBack")}
                      onPaste={(e) => handleCardPaste(e, "mockupBack")}
                      className={`relative rounded-xl border-2 border-dashed transition-all p-2 text-center mb-2 outline-none focus:ring-2 focus:ring-[#0e568f] ${
                        activeDragField === "mockupBack"
                          ? "border-[#0e568f] bg-sky-50 dark:bg-sky-950/50"
                          : formData.mockupBack
                            ? "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40"
                            : "border-gray-300 dark:border-gray-700 hover:border-[#0e568f] bg-gray-50/40 dark:bg-gray-900/20 hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      {formData.mockupBack ? (
                        <div>
                          <div className="h-32 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={formData.mockupBack}
                              alt="Mockup Back"
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => openR2Picker("mockupBack", "mockup", "manage")}
                              className="text-[11px] font-semibold text-[#0e568f] hover:underline"
                            >
                              Chọn từ R2
                            </button>
                            <span className="text-gray-300">•</span>
                            <button
                              type="button"
                              onClick={() => openR2Picker("mockupBack", "mockup", "upload")}
                              className="text-[11px] font-semibold text-blue-600 hover:underline"
                            >
                              Tải ảnh khác
                            </button>
                            <span className="text-gray-300">•</span>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, mockupBack: "" }))
                              }
                              className="text-[11px] font-semibold text-red-500 hover:underline"
                            >
                              Xóa ảnh
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="py-5 px-2 flex flex-col items-center justify-center"
                          onClick={() => openR2Picker("mockupBack", "mockup", "upload")}
                        >
                          <FiUploadCloud className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-1.5" />
                          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                            Bấm để chọn thư mục &amp; tải ảnh mặt sau
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Kéo thả hoặc dán ảnh (Ctrl + V) vào đây
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <input
                    id="mockup-back-input"
                    type="text"
                    value={formData.mockupBack}
                    onChange={(e) =>
                      setFormData({ ...formData, mockupBack: e.target.value })
                    }
                    placeholder="URL ảnh mặt sau (tùy chọn)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Codes & Sewing Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mã thiết kế */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      Mã thiết kế / Mã sản phẩm
                    </span>
                    <button
                      type="button"
                      onClick={addDesignCode}
                      className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
                    >
                      <FiPlus className="w-3.5 h-3.5" /> Thêm mã
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.designCodes.map((code, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={code}
                          onChange={(e) => updateDesignCode(idx, e.target.value)}
                          placeholder="VD: MAG18_UA01DE08_UNIA12_VC02"
                          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-mono font-bold"
                        />
                        {formData.designCodes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDesignCode(idx)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chi tiết may & Quy cách */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      Quy cách may (Gạch đầu dòng màu đỏ)
                    </span>
                    <button
                      type="button"
                      onClick={addSewingDetail}
                      className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
                    >
                      <FiPlus className="w-3.5 h-3.5" /> Thêm dòng
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.sewingDetails.map((detail, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={detail}
                          onChange={(e) => updateSewingDetail(idx, e.target.value)}
                          placeholder="VD: Chỉ trần Vàng chanh, Cổ trụ, khoá kéo..."
                          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold text-rose-600"
                        />
                        {formData.sewingDetails.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSewingDetail(idx)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vải & Màu sắc */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Chất liệu vải
                  </label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="VD: Thun mè caro, Thun lạnh co giãn 4 chiều..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Phối màu
                  </label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="VD: Đen phối vàng chanh"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 3. 4 VỊ TRÍ CHẾ TÁC IN/THÊU */}
            <div className="bg-slate-50 dark:bg-gray-800/50 p-4 rounded-xl border border-slate-200 dark:border-gray-700 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0e568f] dark:text-sky-400">
                3. Chế tác in / thêu các vị trí (Mặt trước, Tay trái, Mặt sau, Tay phải)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* MẶT TRƯỚC */}
                <div className="border-2 border-slate-300 rounded-xl p-3 bg-white dark:bg-gray-800 space-y-2">
                  <div className="bg-[#0e568f] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded text-center">
                    MẶT TRƯỚC
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-500">Chế tác</label>
                    <input
                      type="text"
                      value={formData.craftPositions.front.technique}
                      onChange={(e) => handleCraftChange("front", "technique", e.target.value)}
                      placeholder="VD: In pet chuyển nhiệt"
                      className="w-full px-2 py-1 rounded border text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-500">Kích thước</label>
                    <input
                      type="text"
                      value={formData.craftPositions.front.size}
                      onChange={(e) => handleCraftChange("front", "size", e.target.value)}
                      placeholder="VD: 8 x 6 cm"
                      className="w-full px-2 py-1 rounded border text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-500">Ghi chú</label>
                    <input
                      type="text"
                      value={formData.craftPositions.front.note}
                      onChange={(e) => handleCraftChange("front", "note", e.target.value)}
                      placeholder="VD: Logo ngực trái"
                      className="w-full px-2 py-1 rounded border text-xs"
                    />
                  </div>
                </div>

                {/* TAY TRÁI */}
                <div className="border-2 border-slate-300 rounded-xl p-3 bg-white dark:bg-gray-800 space-y-2">
                  <div className="bg-[#0e568f] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded text-center">
                    TAY TRÁI
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-500">Chế tác</label>
                    <input
                      type="text"
                      value={formData.craftPositions.leftSleeve.technique}
                      onChange={(e) => handleCraftChange("leftSleeve", "technique", e.target.value)}
                      placeholder="VD: In lụa / Không"
                      className="w-full px-2 py-1 rounded border text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-500">Kích thước</label>
                    <input
                      type="text"
                      value={formData.craftPositions.leftSleeve.size}
                      onChange={(e) => handleCraftChange("leftSleeve", "size", e.target.value)}
                      placeholder="VD: 6 x 4 cm"
                      className="w-full px-2 py-1 rounded border text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-500">Ghi chú</label>
                    <input
                      type="text"
                      value={formData.craftPositions.leftSleeve.note}
                      onChange={(e) => handleCraftChange("leftSleeve", "note", e.target.value)}
                      placeholder="VD: Cờ VN tay trái"
                      className="w-full px-2 py-1 rounded border text-xs"
                    />
                  </div>
                </div>

                {/* MẶT SAU */}
                <div className="border-2 border-slate-300 rounded-xl p-3 bg-white dark:bg-gray-800 space-y-2">
                  <div className="bg-[#0e568f] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded text-center">
                    MẶT SAU
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-500">Chế tác</label>
                    <input
                      type="text"
                      value={formData.craftPositions.back.technique}
                      onChange={(e) => handleCraftChange("back", "technique", e.target.value)}
                      placeholder="VD: In decal phản quang"
                      className="w-full px-2 py-1 rounded border text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-500">Kích thước</label>
                    <input
                      type="text"
                      value={formData.craftPositions.back.size}
                      onChange={(e) => handleCraftChange("back", "size", e.target.value)}
                      placeholder="VD: 28 x 16 cm"
                      className="w-full px-2 py-1 rounded border text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-500">Ghi chú</label>
                    <input
                      type="text"
                      value={formData.craftPositions.back.note}
                      onChange={(e) => handleCraftChange("back", "note", e.target.value)}
                      placeholder="VD: PERSONAL TRAINER"
                      className="w-full px-2 py-1 rounded border text-xs"
                    />
                  </div>
                </div>

                {/* TAY PHẢI */}
                <div className="border-2 border-slate-300 rounded-xl p-3 bg-white dark:bg-gray-800 space-y-2">
                  <div className="bg-[#0e568f] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded text-center">
                    TAY PHẢI
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-500">Chế tác</label>
                    <input
                      type="text"
                      value={formData.craftPositions.rightSleeve.technique}
                      onChange={(e) => handleCraftChange("rightSleeve", "technique", e.target.value)}
                      placeholder="VD: In pet"
                      className="w-full px-2 py-1 rounded border text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-500">Kích thước</label>
                    <input
                      type="text"
                      value={formData.craftPositions.rightSleeve.size}
                      onChange={(e) => handleCraftChange("rightSleeve", "size", e.target.value)}
                      placeholder="VD: 6 x 3 cm"
                      className="w-full px-2 py-1 rounded border text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-500">Ghi chú</label>
                    <input
                      type="text"
                      value={formData.craftPositions.rightSleeve.note}
                      onChange={(e) => handleCraftChange("rightSleeve", "note", e.target.value)}
                      placeholder="Ghi chú tay phải"
                      className="w-full px-2 py-1 rounded border text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. BẢNG SỐ LƯỢNG SIZE (NAM / NỮ) */}
            <div className="bg-slate-50 dark:bg-gray-800/50 p-4 rounded-xl border border-slate-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0e568f] dark:text-sky-400">
                  4. Bảng số lượng Size Nam & Nữ
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Tổng cộng:</span>
                  <span className="text-xl font-black text-red-600 bg-red-50 dark:bg-red-950/50 px-3 py-0.5 rounded-lg border border-red-200">
                    {totalQuantity} áo
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto border border-gray-300 rounded-xl bg-white dark:bg-gray-800">
                <table className="w-full text-center text-xs divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-slate-100 dark:bg-gray-700 font-bold">
                    <tr className="divide-x divide-gray-200 dark:divide-gray-600">
                      <th className="py-2 px-3 w-16">Dòng</th>
                      {SIZES.map((sz) => (
                        <th key={sz} className="py-2 px-2">
                          {sz}
                        </th>
                      ))}
                      <th className="py-2 px-3 bg-slate-200 dark:bg-gray-600 text-[#0e568f] font-black">
                        Tổng
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 font-medium">
                    {/* Nam */}
                    <tr className="divide-x divide-gray-200 dark:divide-gray-700">
                      <td className="py-2 px-3 font-bold bg-slate-50 dark:bg-gray-800">Nam</td>
                      {SIZES.map((sz) => (
                        <td key={sz} className="p-1">
                          <input
                            type="number"
                            min="0"
                            value={formData.sizes.men[sz] || ""}
                            onChange={(e) => handleSizeChange("men", sz, e.target.value)}
                            placeholder="0"
                            className="w-12 text-center py-1 rounded border border-gray-200 dark:border-gray-700 font-bold focus:ring-1 focus:ring-sky-500"
                          />
                        </td>
                      ))}
                      <td className="py-2 px-3 font-extrabold bg-slate-100 dark:bg-gray-800 text-[#0e568f]">
                        {totalMen}
                      </td>
                    </tr>

                    {/* Nữ */}
                    <tr className="divide-x divide-gray-200 dark:divide-gray-700">
                      <td className="py-2 px-3 font-bold bg-slate-50 dark:bg-gray-800">Nữ</td>
                      {SIZES.map((sz) => (
                        <td key={sz} className="p-1">
                          <input
                            type="number"
                            min="0"
                            value={formData.sizes.women[sz] || ""}
                            onChange={(e) => handleSizeChange("women", sz, e.target.value)}
                            placeholder="0"
                            className="w-12 text-center py-1 rounded border border-gray-200 dark:border-gray-700 font-bold focus:ring-1 focus:ring-sky-500"
                          />
                        </td>
                      ))}
                      <td className="py-2 px-3 font-extrabold bg-slate-100 dark:bg-gray-800 text-[#0e568f]">
                        {totalWomen}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. TIẾN ĐỘ, GHI CHÚ & TÀI CHÍNH */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tiến độ & Ghi chú xưởng */}
              <div className="bg-slate-50 dark:bg-gray-800/50 p-4 rounded-xl border border-slate-200 dark:border-gray-700 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0e568f] dark:text-sky-400">
                  5. Hạn sản xuất & Ghi chú xưởng
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      NGÀY XONG (Xưởng hoàn thành)
                    </label>
                    <input
                      type="text"
                      value={formData.completionDate}
                      onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                      placeholder="VD: 15/10/2026"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      NGÀY TRẢ (Hạn giao khách)
                    </label>
                    <input
                      type="text"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                      placeholder="VD: 18/10/2026"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold text-blue-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Trạng thái đơn hàng
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-bold"
                  >
                    <option value="pending">Chờ xác nhận / Mới tạo</option>
                    <option value="in_production">Đang sản xuất (Cắt/May/In)</option>
                    <option value="completed">Xưởng đã hoàn thành</option>
                    <option value="delivering">Đang giao hàng</option>
                    <option value="delivered">Đã giao thành công</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Lưu ý sản xuất (In trên phiếu biên bản)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Ghi chú đặc biệt cho thợ may, xưởng in, cách đóng gói..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs"
                  />
                </div>
              </div>

              {/* Tài chính & Thanh toán */}
              <div className="bg-slate-50 dark:bg-gray-800/50 p-4 rounded-xl border border-slate-200 dark:border-gray-700 space-y-3 flex flex-col justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0e568f] dark:text-sky-400">
                  6. Tài chính & Đặt cọc
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Đơn giá / áo (VNĐ)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={formData.unitPrice || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, unitPrice: Number(e.target.value) })
                      }
                      placeholder="VD: 150000"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Tổng tiền đơn hàng (VNĐ)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={formData.totalAmount || calculatedTotal || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, totalAmount: Number(e.target.value) })
                      }
                      placeholder={calculatedTotal ? String(calculatedTotal) : "Tự động tính"}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-bold text-blue-700"
                    />
                    <span className="text-[10px] text-gray-400">
                      Tự động tính: {calculatedTotal.toLocaleString("vi-VN")} đ ({totalQuantity} áo)
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Tiền đặt cọc (VNĐ)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={formData.deposit || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, deposit: Number(e.target.value) })
                      }
                      placeholder="VD: 1000000"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-bold text-emerald-600"
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between mt-2">
                  <span className="text-xs font-bold text-gray-600">Còn lại cần thu:</span>
                  <span className="text-base font-black text-red-600">
                    {remaining.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium text-xs hover:bg-gray-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-[#0e568f] hover:bg-[#0c4a7c] text-white font-bold text-xs flex items-center gap-2 shadow-lg disabled:opacity-60 transition-colors"
              >
                <FiCheck className="w-4 h-4" />
                {loading ? "Đang lưu..." : initialData ? "Lưu thay đổi" : "Tạo đơn hàng"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Cloudflare R2 Image Modal Integration */}
      <R2ImageModal
        visible={r2ModalVisible}
        onClose={() => {
          setR2ModalVisible(false);
          setR2InitialFile(null);
        }}
        onSelect={handleR2Select}
        initialFolder={r2InitialFolder || "mockup"}
        initialTab={r2InitialTab}
        initialFile={r2InitialFile}
      />
    </>
  );
}
