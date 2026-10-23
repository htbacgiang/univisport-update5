import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminLayout from "../../../components/layout/AdminLayout";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Pencil,
  RefreshCw,
  Upload,
  X,
  Sparkles,
  Check,
  Search,
  SlidersHorizontal,
  Maximize2,
  Tag,
} from "lucide-react";

const CATEGORIES = [
  { id: "gym", label: "Gym", color: "bg-orange-500/10 text-orange-600 border-orange-200" },
  { id: "pickleball", label: "Pickleball", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  { id: "yoga-pilates", label: "Yoga & Pilates", color: "bg-purple-500/10 text-purple-600 border-purple-200" },
  { id: "chay-bo", label: "Chạy bộ", color: "bg-green-500/10 text-green-600 border-green-200" },
  { id: "mma", label: "MMA", color: "bg-red-500/10 text-red-600 border-red-200" },
  { id: "golf-tennis", label: "Golf & Tennis", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200" },
];

const SIZE_OPTIONS = [
  {
    value: "md",
    label: "Ảnh Vuông (md)",
    desc: "1 cột x 1 hàng (Ghép cặp 2 ô xếp chồng)",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    value: "tall",
    label: "Ảnh Dọc (tall)",
    desc: "1 cột x 2 hàng (Phù hợp ảnh mẫu đứng/dọc)",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    value: "lg",
    label: "Ảnh Banner Ngang (lg)",
    desc: "2 cột x 2 hàng (Ảnh nhóm/Hero nổi bật)",
    badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  },
];

const emptyForm = {
  id: null,
  image: "",
  alt: "",
  filterIds: ["gym"],
  size: "md",
  width: 0,
  height: 0,
  aspectRatio: 1,
};

export default function DashboardLookbookPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [autoDetectedInfo, setAutoDetectedInfo] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/lookbook");
      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách ảnh Lookbook");
    } finally {
      setLoading(false);
    }
  };

  // Tự động đo đạc tỷ lệ ảnh khi chọn file hoặc nhập link ảnh
  const detectImageDimensions = (url) => {
    if (!url) {
      setAutoDetectedInfo(null);
      return;
    }
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const w = img.naturalWidth || 0;
      const h = img.naturalHeight || 0;
      const ratio = h > 0 ? parseFloat((w / h).toFixed(2)) : 1;

      // Đề xuất kích thước tự động theo tỷ lệ:
      // ratio > 1.25: Ngang => lg (2x2)
      // ratio < 0.85: Dọc => tall (1x2)
      // 0.85 <= ratio <= 1.25: Vuông => md (1x1)
      let recommendedSize = "md";
      let recommendLabel = "Vuông (1x1)";
      if (ratio >= 1.25) {
        recommendedSize = "lg";
        recommendLabel = "Ngang / Banner (2x2)";
      } else if (ratio <= 0.85) {
        recommendedSize = "tall";
        recommendLabel = "Dọc / Portrait (1x2)";
      }

      setAutoDetectedInfo({
        width: w,
        height: h,
        aspectRatio: ratio,
        recommendedSize,
        recommendLabel,
      });

      setForm((prev) => ({
        ...prev,
        width: w,
        height: h,
        aspectRatio: ratio,
        size: recommendedSize,
      }));
    };
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Đọc ngay tỷ lệ ảnh trước khi upload
    const objectUrl = URL.createObjectURL(file);
    detectImageDimensions(objectUrl);

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data?.links?.[0]) {
        const uploadedUrl = data.links[0];
        setForm((prev) => ({
          ...prev,
          image: uploadedUrl,
          alt: prev.alt || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        }));
        detectImageDimensions(uploadedUrl);
        toast.success("Upload ảnh lên Cloudinary thành công!");
      }
    } catch (err) {
      toast.error("Upload ảnh thất bại!");
    } finally {
      setUploading(false);
    }
  };

  const openCreateModal = () => {
    setForm(emptyForm);
    setAutoDetectedInfo(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setForm({
      id: item.id || item._id,
      image: item.image,
      alt: item.alt,
      filterIds: item.filterIds || ["gym"],
      size: item.size || "md",
      width: item.width || 0,
      height: item.height || 0,
      aspectRatio: item.aspectRatio || 1,
    });
    detectImageDimensions(item.image);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.image || !form.alt) {
      toast.error("Vui lòng điền đủ link ảnh và mô tả/tên ảnh!");
      return;
    }
    if (form.filterIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 danh mục cho ảnh!");
      return;
    }

    setSaving(true);
    try {
      if (form.id) {
        const { data } = await axios.put("/api/lookbook", form);
        if (data.success) {
          toast.success("Đã cập nhật thông tin ảnh thành công!");
          fetchItems();
          setShowModal(false);
        }
      } else {
        const { data } = await axios.post("/api/lookbook", form);
        if (data.success) {
          toast.success("Đã thêm ảnh mới vào Lookbook!");
          fetchItems();
          setShowModal(false);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Lỗi lưu thông tin ảnh");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const { data } = await axios.delete(`/api/lookbook?id=${deleteConfirm.id}`);
      if (data.success) {
        toast.success("Đã xóa ảnh khỏi Lookbook");
        fetchItems();
        setDeleteConfirm(null);
      }
    } catch (err) {
      toast.error("Lỗi khi xóa ảnh!");
    }
  };

  const handleSeedDefaults = async () => {
    if (!confirm("Bạn có chắc chắn muốn khôi phục danh sách 28 ảnh Lookbook mặc định?")) return;
    setLoading(true);
    try {
      const { data } = await axios.post("/api/lookbook", { action: "seed" });
      if (data.success) {
        toast.success(data.message);
        fetchItems();
      }
    } catch (err) {
      toast.error("Khôi phục thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryInForm = (catId) => {
    setForm((prev) => {
      const exists = prev.filterIds.includes(catId);
      if (exists) {
        if (prev.filterIds.length === 1) return prev; // giữ lại ít nhất 1
        return { ...prev, filterIds: prev.filterIds.filter((id) => id !== catId) };
      } else {
        return { ...prev, filterIds: [...prev.filterIds, catId] };
      }
    });
  };

  // Lọc items hiển thị
  const filteredItems = items.filter((item) => {
    const matchTab = activeTab === "all" || item.filterIds.includes(activeTab);
    const matchSearch =
      !searchQuery || item.alt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <AdminLayout title="Quản lý Lookbook | Dashboard">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-[#105d97]/10 text-[#105d97] flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Quản Lý Lookbook / Bộ Sưu Tập
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quản lý danh sách ảnh thực tế, tự động phát hiện tỷ lệ ảnh và phân loại theo bộ môn.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={fetchItems}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Tải lại
            </button>

            <button
              onClick={handleSeedDefaults}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
            >
              Khôi phục mặc định
            </button>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#105d97] hover:bg-[#0c4d7d] text-white text-sm font-semibold shadow-md shadow-[#105d97]/20 transition-all hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              Thêm ảnh mới
            </button>
          </div>
        </div>

        {/* Toolbar: Category tabs + Search */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === "all"
                    ? "bg-[#105d97] text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 border border-gray-200 dark:border-gray-700"
                }`}
              >
                Tất cả ({items.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = items.filter((item) => item.filterIds.includes(cat.id)).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                      activeTab === cat.id
                        ? "bg-[#105d97] text-white shadow-sm"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {cat.label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tên/mô tả ảnh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#105d97]"
              />
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <RefreshCw className="w-8 h-8 text-[#105d97] animate-spin mb-2" />
            <span className="ml-3 text-sm text-gray-500">Đang tải danh sách ảnh...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Không tìm thấy ảnh nào trong danh mục này</p>
            <button
              onClick={openCreateModal}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#105d97] hover:underline"
            >
              + Thêm ảnh mới vào danh mục
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredItems.map((item) => {
              const sizeMeta = SIZE_OPTIONS.find((s) => s.value === item.size) || SIZE_OPTIONS[0];

              return (
                <div
                  key={item.id || item._id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Image Preview Thumbnail */}
                    <div className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-gray-900 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Size Badge on top right */}
                      <span
                        className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${sizeMeta.badge}`}
                      >
                        {item.size}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 leading-snug">
                        {item.alt}
                      </h3>

                      {/* Dimensions & ratio */}
                      {(item.width > 0 || item.aspectRatio) && (
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                          <Maximize2 className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                          <span>
                            {item.width && item.height ? `${item.width} x ${item.height}px` : ""}
                            {item.aspectRatio ? ` (Tỷ lệ ${item.aspectRatio})` : ""}
                          </span>
                        </div>
                      )}

                      {/* Categories badges */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.filterIds.map((fId) => {
                          const cat = CATEGORIES.find((c) => c.id === fId);
                          if (!cat) return null;
                          return (
                            <span
                              key={fId}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${cat.color}`}
                            >
                              {cat.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700/80 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">ID: {item.id?.slice(-6)}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(item)}
                        title="Chỉnh sửa thông tin"
                        className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:text-[#105d97] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item)}
                        title="Xóa ảnh"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Create / Edit Image */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal header */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#105d97]" />
                  {form.id ? "Chỉnh Sửa Ảnh Lookbook" : "Thêm Ảnh Mới Vào Lookbook"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal body */}
              <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1">
                {/* Image Upload / URL Section */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Hình ảnh <span className="text-red-500">*</span>
                  </label>

                  <div className="flex flex-col gap-3">
                    {/* Preview box */}
                    {form.image && (
                      <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={form.image}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    {/* Auto-detected ratio alert */}
                    {autoDetectedInfo && (
                      <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold">
                          <Sparkles className="w-4 h-4 text-blue-500" />
                          <span>Tự động nhận diện tỷ lệ ảnh thành công:</span>
                        </div>
                        <p className="text-blue-600 dark:text-blue-400">
                          • Kích thước thực: <strong className="font-semibold">{autoDetectedInfo.width} x {autoDetectedInfo.height} px</strong>
                          {" | "}
                          Tỷ lệ W/H: <strong className="font-semibold">{autoDetectedInfo.aspectRatio}</strong>
                        </p>
                        <p className="text-blue-600 dark:text-blue-400">
                          • Đề xuất kích thước hiển thị: <strong className="font-bold underline">{autoDetectedInfo.recommendLabel}</strong>
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Dán link ảnh (URL) hoặc chọn tải file từ máy..."
                        value={form.image}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm((prev) => ({ ...prev, image: val }));
                          detectImageDimensions(val);
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#105d97] outline-none"
                      />

                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      <button
                        type="button"
                        disabled={uploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-semibold transition-colors shrink-0"
                      >
                        <Upload className={`w-4 h-4 ${uploading ? "animate-spin" : ""}`} />
                        {uploading ? "Đang tải..." : "Tải ảnh lên"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Alt / Title Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Tên/Mô tả ảnh (Alt Text) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Đồng phục Pickleball UniPick thi đấu chuyên nghiệp"
                    value={form.alt}
                    onChange={(e) => setForm((prev) => ({ ...prev, alt: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#105d97] outline-none"
                  />
                </div>

                {/* Categories Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Danh mục bộ môn <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                      const selected = form.filterIds.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategoryInForm(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                            selected
                              ? "bg-[#105d97] text-white border-[#105d97] shadow-sm"
                              : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {selected && <Check className="w-3.5 h-3.5" />}
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Size Selection (Optionally auto-selected) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Kích thước ô vuông (Grid Size)
                    </label>
                    <span className="text-[11px] text-gray-400">
                      (Tự động nhận diện từ tỷ lệ ảnh, có thể đổi tùy ý)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {SIZE_OPTIONS.map((opt) => {
                      const isSelected = form.size === opt.value;
                      return (
                        <div
                          key={opt.value}
                          onClick={() => setForm((prev) => ({ ...prev, size: opt.value }))}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? "border-[#105d97] bg-[#105d97]/5 dark:bg-[#105d97]/20 ring-2 ring-[#105d97]"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-400 bg-white dark:bg-gray-900"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-gray-900 dark:text-white">
                                {opt.label}
                              </span>
                              {isSelected && <Check className="w-4 h-4 text-[#105d97]" />}
                            </div>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                              {opt.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit buttons */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-[#105d97] hover:bg-[#0c4d7d] text-white text-sm font-semibold shadow-md shadow-[#105d97]/20 transition-all flex items-center gap-2"
                  >
                    {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
                    {form.id ? "Lưu thay đổi" : "Thêm vào Lookbook"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-500" />
                Xác nhận xóa ảnh Lookbook
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Bạn có chắc chắn muốn xóa ảnh <strong>"{deleteConfirm.alt}"</strong> khỏi bộ sưu tập? Hành động này không thể hoàn tác.
              </p>

              <div className="w-full h-32 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={deleteConfirm.image}
                  alt={deleteConfirm.alt}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-md shadow-red-600/20 transition-all"
                >
                  Xóa vĩnh viễn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
