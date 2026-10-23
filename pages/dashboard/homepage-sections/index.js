import { getSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { ReactSortable } from "react-sortablejs";
import axios from "axios";
import AdminLayout from "../../../components/layout/AdminLayout";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  LayoutTemplate,
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Save,
  RefreshCw,
  X,
  Pencil,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Circle,
} from "lucide-react";

const CATEGORY_SUGGESTION_GROUPS = [
  {
    group: "Đồng phục thể thao",
    items: [
      { label: "Gym", title: "Đồng Phục Gym", category: "dong-phuc-gym", link: "/dong-phuc-gym" },
      { label: "Pickleball", title: "Đồng Phục Pickleball", category: "dong-phuc-pickleball", link: "/dong-phuc-pickleball" },
      { label: "Yoga", title: "Đồng Phục Yoga", category: "dong-phuc-yoga-pilates", link: "/dong-phuc-yoga-pilates" },
      { label: "Pilates", title: "Đồng Phục Pilates", category: "dong-phuc-pilates", link: "/dong-phuc-pilates" },
      { label: "Áo gió thể thao", title: "Đồng Phục Áo Gió", category: "dong-phuc-ao-gio", link: "/dong-phuc-ao-gio" },
      { label: "Golf - Tennis", title: "Đồng Phục Golf - Tennis", category: "dong-phuc-golf-tennis", link: "/dong-phuc-golf-tennis" },
      { label: "Chạy bộ", title: "Đồng Phục Chạy Bộ", category: "dong-phuc-chay-bo", link: "/dong-phuc-chay-bo" },
      { label: "MMA", title: "Đồng Phục MMA", category: "dong-phuc-mma", link: "/dong-phuc-mma" },
    ],
  },
  {
    group: "Đồng phục doanh nghiệp",
    items: [
      { label: "Đồng phục Sơ mi", title: "Đồng Phục Sơ Mi", category: "dong-phuc-so-mi", link: "/dong-phuc-so-mi" },
      { label: "Đồng phục Vest công sở", title: "Đồng Phục Vest Công Sở", category: "dong-phuc-vest-cong-so", link: "/dong-phuc-vest-cong-so" },
      { label: "Polo doanh nghiệp", title: "Polo Doanh Nghiệp", category: "dong-phuc-polo", link: "/dong-phuc-polo" },
      { label: "Đồng phục Teambuilding", title: "Đồng Phục Teambuilding", category: "dong-phuc-teambuilding", link: "/dong-phuc-teambuilding" },
      { label: "Đồng phục Áo gió", title: "Đồng Phục Áo Gió Doanh Nghiệp", category: "dong-phuc-ao-gio", link: "/dong-phuc-ao-gio" },
      { label: "Bảo hộ lao động", title: "Bảo Hộ Lao Động", category: "bao-ho-lao-dong", link: "/bao-ho-lao-dong" },
      { label: "Phụ kiện & Quà tặng", title: "Phụ Kiện & Quà Tặng Doanh Nghiệp", category: "phu-kien-qua-tang-doanh-nghiep", link: "/phu-kien-qua-tang-doanh-nghiep" },
    ],
  },
];

const emptyForm = { title: "", category: "", viewAllLink: "", productLimit: 12 };

const RADIUS_OPTIONS = [0, 4, 8, 12, 16];

const emptyBannerForm = {
  image: "",
  mobileImage: "",
  link: "",
  openInNewTab: false,
  isVisible: true,
  borderRadius: 8,
};

const isGif = (src) =>
  typeof src === "string" && (src.toLowerCase().endsWith(".gif") || src.includes("f_gif"));

export default function HomepageSectionsPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = add, object = edit
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [bannerModal, setBannerModal] = useState(null);
  const [bannerForm, setBannerForm] = useState(emptyBannerForm);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [mobileUploading, setMobileUploading] = useState(false);
  const [bannerSaving, setBannerSaving] = useState(false);
  const [deleteBannerConfirm, setDeleteBannerConfirm] = useState(null);
  const fileInputRef = useRef(null);
  const mobileFileInputRef = useRef(null);

  useEffect(() => { fetchSections(); }, []);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/homepage-sections");
      setSections(data.sections.map(s => ({ ...s, id: s._id })));
    } catch {
      toast.error("Không thể tải danh sách sections");
    } finally {
      setLoading(false);
    }
  };

  const handleSortEnd = (newList) => {
    setSections(newList);
    setOrderChanged(true);
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      await axios.put("/api/homepage-sections?action=reorder", {
        orderedIds: sections.map(s => s._id || s.id),
      });
      setOrderChanged(false);
      toast.success("Đã lưu thứ tự hiển thị");
    } catch {
      toast.error("Lưu thứ tự thất bại");
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = async (section) => {
    const prev = sections;
    setSections(s => s.map(x => x._id === section._id ? { ...x, isVisible: !x.isVisible } : x));
    try {
      await axios.put(`/api/homepage-sections?id=${section._id}`, { isVisible: !section.isVisible });
      toast.success(section.isVisible ? "Đã ẩn section" : "Đã hiện section");
    } catch {
      setSections(prev);
      toast.error("Cập nhật thất bại");
    }
  };

  const updateLimit = async (section, value) => {
    const limit = Math.min(50, Math.max(1, Number(value)));
    setSections(s => s.map(x => x._id === section._id ? { ...x, productLimit: limit } : x));
    try {
      await axios.put(`/api/homepage-sections?id=${section._id}`, { productLimit: limit });
    } catch {
      toast.error("Cập nhật số lượng thất bại");
    }
  };

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (section) => {
    setEditTarget(section);
    setForm({
      title: section.title,
      category: section.category,
      viewAllLink: section.viewAllLink,
      productLimit: section.productLimit,
    });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditTarget(null); setForm(emptyForm); };

  const handleCategorySuggestion = (suggestion) => {
    setForm(f => ({
      ...f,
      category: suggestion.category,
      viewAllLink: suggestion.link,
      title: suggestion.title || (f.title || `Đồng Phục ${suggestion.label}`),
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.category.trim() || !form.viewAllLink.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setSaving(true);
    try {
      if (editTarget) {
        const { data } = await axios.put(`/api/homepage-sections?id=${editTarget._id}`, form);
        setSections(s => s.map(x => x._id === editTarget._id ? { ...data.section, id: data.section._id } : x));
        toast.success("Đã cập nhật section");
      } else {
        const { data } = await axios.post("/api/homepage-sections", form);
        setSections(s => [...s, { ...data.section, id: data.section._id }]);
        toast.success("Đã thêm section mới");
      }
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.err || "Lỗi xử lý");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await axios.delete(`/api/homepage-sections?id=${deleteConfirm._id}`);
      setSections(s => s.filter(x => x._id !== deleteConfirm._id));
      toast.success("Đã xóa section");
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const seedDefaults = async () => {
    setSaving(true);
    try {
      const { data } = await axios.post("/api/homepage-sections", { action: "seed" });
      setSections(data.sections.map(s => ({ ...s, id: s._id })));
      toast.success("Đã khởi tạo sections mặc định");
    } catch (err) {
      toast.error(err.response?.data?.err || "Khởi tạo thất bại");
    } finally {
      setSaving(false);
    }
  };

  const openBannerModal = (section) => {
    setBannerModal(section);
    const banner = section.sectionBanner || {};
    setBannerForm({
      image: banner.image || "",
      mobileImage: banner.mobileImage || "",
      link: banner.link || "",
      openInNewTab: banner.openInNewTab ?? false,
      isVisible: banner.isVisible ?? true,
      borderRadius: banner.borderRadius ?? 8,
    });
  };

  const closeBannerModal = () => {
    setBannerModal(null);
    setBannerForm(emptyBannerForm);
  };

  const handleBannerImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axios.post("/api/upload", formData);
      if (data.links?.[0]) {
        setBannerForm((current) => ({ ...current, image: data.links[0] }));
        toast.success("Đã tải ảnh lên");
      }
    } catch {
      toast.error("Tải ảnh thất bại");
    } finally {
      setBannerUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleMobileImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMobileUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axios.post("/api/upload", formData);
      if (data.links?.[0]) {
        setBannerForm((current) => ({ ...current, mobileImage: data.links[0] }));
        toast.success("Đã tải ảnh mobile lên");
      }
    } catch {
      toast.error("Tải ảnh mobile thất bại");
    } finally {
      setMobileUploading(false);
      if (mobileFileInputRef.current) mobileFileInputRef.current.value = "";
    }
  };

  const saveBanner = async () => {
    if (!bannerModal) return;
    if (bannerForm.isVisible && !bannerForm.image) {
      toast.error("Vui lòng tải ảnh banner trước khi bật hiển thị");
      return;
    }
    setBannerSaving(true);
    try {
      const { data } = await axios.put(
        `/api/homepage-sections?id=${bannerModal._id}`,
        { sectionBanner: bannerForm }
      );
      setSections((current) =>
        current.map((section) =>
          section._id === bannerModal._id
            ? { ...data.section, id: data.section._id }
            : section
        )
      );
      toast.success("Đã lưu banner");
      closeBannerModal();
    } catch {
      toast.error("Lưu banner thất bại");
    } finally {
      setBannerSaving(false);
    }
  };

  const confirmDeleteBanner = async () => {
    if (!deleteBannerConfirm) return;
    try {
      const clearedBanner = {
        image: "",
        mobileImage: "",
        link: "",
        openInNewTab: false,
        isVisible: false,
        borderRadius: 8,
      };
      const { data } = await axios.put(
        `/api/homepage-sections?id=${deleteBannerConfirm._id}`,
        { sectionBanner: clearedBanner }
      );
      setSections((current) =>
        current.map((section) =>
          section._id === deleteBannerConfirm._id
            ? { ...data.section, id: data.section._id }
            : section
        )
      );
      toast.success("Đã xóa banner");
      if (bannerModal?._id === deleteBannerConfirm._id) {
        closeBannerModal();
      }
    } catch {
      toast.error("Xóa banner thất bại");
    } finally {
      setDeleteBannerConfirm(null);
    }
  };

  const hasBanner = (section) => Boolean(section.sectionBanner?.image);

  return (
    <AdminLayout title="Quản lý Sections Trang Chủ">
      <div className="p-6 bg-[#f8fafc] min-h-screen space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <LayoutTemplate className="w-5 h-5 text-[#105d97] shrink-0" />
            <h1 className="text-[1.375rem] font-bold text-[#0f172a] m-0">Sections Trang Chủ</h1>
          </div>
          <div className="flex items-center gap-2">
            {orderChanged && (
              <button
                onClick={saveOrder}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-[#105d97] text-white text-sm font-medium rounded-lg hover:bg-[#0d4a7a] disabled:opacity-60 transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? "Đang lưu..." : "Lưu thứ tự"}
              </button>
            )}
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-[#16a34a] text-white text-sm font-medium rounded-lg hover:bg-[#15803d] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm Section
            </button>
          </div>
        </div>

        {/* Guide note */}
        <div className="flex items-start gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <GripVertical className="w-4 h-4 mt-0.5 shrink-0" />
          <span>Kéo thả hàng để sắp xếp thứ tự hiển thị. Bấm <strong>Lưu thứ tự</strong> sau khi sắp xếp xong. Bấm <strong className="inline-flex items-center gap-1"><ImageIcon className="w-3 h-3 inline" /> Banner</strong> để thêm banner ảnh trước mỗi section.</span>
        </div>

        {/* Sections list */}
        <div className="bg-white border border-[#e2e8f0] rounded-[10px] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[32px_1fr_140px_90px_72px_90px_110px] gap-3 items-center px-4 py-3 bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
            <span />
            <span>Tên Section / Danh mục</span>
            <span>Link xem tất cả</span>
            <span className="text-center">Số SP</span>
            <span className="text-center">Hiện</span>
            <span className="text-center">Banner</span>
            <span className="text-center">Thao tác</span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <RefreshCw className="w-6 h-6 text-[#105d97] animate-spin" />
            </div>
          ) : sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-[#64748b]">
              <LayoutTemplate className="w-12 h-12 text-[#cbd5e1]" />
              <p className="text-sm">Chưa có sections nào. Bấm khởi tạo mặc định hoặc thêm mới.</p>
              <button
                onClick={seedDefaults}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-[#105d97] text-white text-sm font-medium rounded-lg hover:bg-[#0d4a7a] disabled:opacity-60 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Khởi tạo Sections Mặc Định
              </button>
            </div>
          ) : (
            <ReactSortable
              list={sections}
              setList={handleSortEnd}
              handle=".drag-handle"
              animation={150}
            >
              {sections.map((section) => (
                <div
                  key={section._id || section.id}
                  className={`grid grid-cols-[32px_1fr_140px_90px_72px_90px_110px] gap-3 items-center px-4 py-3.5 border-b border-[#f1f5f9] last:border-0 transition-colors ${!section.isVisible ? "opacity-50 bg-gray-50" : "hover:bg-[#f8fafc]"}`}
                >
                  {/* Drag handle */}
                  <div className="drag-handle cursor-grab active:cursor-grabbing text-[#94a3b8] hover:text-[#64748b] flex justify-center">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  {/* Title + category */}
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a] leading-6">{section.title}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-medium border border-blue-100">
                      {section.category}
                    </span>
                  </div>

                  {/* View all link */}
                  <p className="text-xs text-[#64748b] truncate">{section.viewAllLink}</p>

                  {/* Product limit */}
                  <div className="flex justify-center">
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={section.productLimit}
                      onChange={e => updateLimit(section, e.target.value)}
                      onBlur={e => updateLimit(section, e.target.value)}
                      className="w-16 text-center text-sm border border-[#e2e8f0] rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#105d97]/30 focus:border-[#105d97]"
                    />
                  </div>

                  {/* Visibility toggle */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => toggleVisible(section)}
                      title={section.isVisible ? "Ẩn section" : "Hiện section"}
                      className={`p-2 rounded-lg transition-colors ${section.isVisible ? "text-[#16a34a] hover:bg-green-50" : "text-[#94a3b8] hover:bg-gray-100"}`}
                    >
                      {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Banner status */}
                  <div className="flex flex-col items-center gap-1">
                    {hasBanner(section) ? (
                      <button
                        onClick={() => openBannerModal(section)}
                        title="Quản lý banner"
                        className="relative w-12 h-8 rounded overflow-hidden border border-[#e2e8f0] hover:border-[#105d97] transition-colors group"
                      >
                        <Image
                          src={section.sectionBanner.image}
                          alt="banner"
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                        {!section.sectionBanner.isVisible && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <EyeOff className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => openBannerModal(section)}
                        title="Thêm banner"
                        className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#105d97] hover:bg-blue-50 transition-colors"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    )}
                    {hasBanner(section) && (
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${section.sectionBanner.isVisible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {section.sectionBanner.isVisible ? "Hiện" : "Ẩn"}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => openBannerModal(section)}
                      title="Quản lý banner"
                      className="p-2 rounded-lg text-[#7c3aed] hover:bg-purple-50 transition-colors"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEdit(section)}
                      title="Chỉnh sửa"
                      className="p-2 rounded-lg text-[#105d97] hover:bg-blue-50 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(section)}
                      title="Xóa section"
                      className="p-2 rounded-lg text-[#ef4444] hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </ReactSortable>
          )}
        </div>

        {/* Summary */}
        {sections.length > 0 && (
          <p className="text-xs text-[#94a3b8] text-right">
            {sections.filter(s => s.isVisible).length}/{sections.length} sections đang hiển thị
            {" · "}
            {sections.filter(s => hasBanner(s) && s.sectionBanner.isVisible).length} banner đang hiển thị
          </p>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
              <h2 className="text-base font-bold text-[#0f172a]">
                {editTarget ? "Chỉnh sửa Section" : "Thêm Section Mới"}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#64748b]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitForm} className="px-6 py-5 space-y-4">
              {/* Category suggestions */}
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-3 space-y-2.5">
                <p className="text-xs font-bold text-[#475569] uppercase tracking-wider">
                  Gợi ý chọn nhanh danh mục:
                </p>
                {CATEGORY_SUGGESTION_GROUPS.map((group) => (
                  <div key={group.group} className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-[#64748b] block">
                      {group.group}:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((s) => {
                        const isSelected = form.category === s.category && form.viewAllLink === s.link;
                        return (
                          <button
                            key={`${group.group}-${s.label}`}
                            type="button"
                            onClick={() => handleCategorySuggestion(s)}
                            className={`px-2.5 py-1 text-xs rounded-full border transition-all duration-150 font-medium ${
                              isSelected
                                ? "border-[#105d97] bg-[#105d97] text-white shadow-sm"
                                : "border-blue-200 bg-blue-50/80 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
                            }`}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#374151]">Tiêu đề *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="VD: Đồng Phục Gym"
                  className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#105d97]/30 focus:border-[#105d97]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#374151]">Danh mục (slug) *</label>
                <input
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  placeholder="VD: dong-phuc-gym"
                  className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#105d97]/30 focus:border-[#105d97]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#374151]">Link &quot;Xem tất cả&quot; *</label>
                <input
                  value={form.viewAllLink}
                  onChange={e => setForm(f => ({ ...f, viewAllLink: e.target.value }))}
                  placeholder="VD: /dong-phuc-gym"
                  className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#105d97]/30 focus:border-[#105d97]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#374151]">Số sản phẩm hiển thị (1-50)</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={form.productLimit}
                  onChange={e => setForm(f => ({ ...f, productLimit: Number(e.target.value) }))}
                  className="w-28 text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#105d97]/30 focus:border-[#105d97]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-[#64748b] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#105d97] rounded-lg hover:bg-[#0d4a7a] disabled:opacity-60 transition-colors"
                >
                  {saving ? "Đang lưu..." : editTarget ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banner Modal */}
      {bannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0] shrink-0">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#7c3aed]" />
                <h2 className="text-base font-bold text-[#0f172a]">
                  Banner — <span className="text-[#105d97]">{bannerModal.title}</span>
                </h2>
              </div>
              <button onClick={closeBannerModal} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#64748b]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                className="hidden"
                onChange={handleBannerImageUpload}
              />
              <input
                ref={mobileFileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                className="hidden"
                onChange={handleMobileImageUpload}
              />

              <BannerImageBlock
                label="Ảnh Desktop"
                hint="Tỷ lệ khuyến nghị 3:1 hoặc rộng hơn — JPG, PNG, WebP, GIF"
                borderRadius={bannerForm.borderRadius}
                image={bannerForm.image}
                uploading={bannerUploading}
                onUploadClick={() => fileInputRef.current?.click()}
                onClear={() => setBannerForm((current) => ({ ...current, image: "" }))}
                onUrlChange={(value) => setBannerForm((current) => ({ ...current, image: value }))}
              />

              <BannerImageBlock
                label="Ảnh Mobile"
                labelBadge="mobile"
                hint="Tỷ lệ khuyến nghị 2:1 (vuông vức hơn) — JPG, PNG, WebP, GIF"
                borderRadius={bannerForm.borderRadius}
                image={bannerForm.mobileImage}
                fallbackImage={bannerForm.image}
                uploading={mobileUploading}
                onUploadClick={() => mobileFileInputRef.current?.click()}
                onClear={() => setBannerForm((current) => ({ ...current, mobileImage: "" }))}
                onUrlChange={(value) => setBannerForm((current) => ({ ...current, mobileImage: value }))}
              />

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#374151] flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" /> Link khi click vào banner
                </label>
                <input
                  value={bannerForm.link}
                  onChange={(e) => setBannerForm((current) => ({ ...current, link: e.target.value }))}
                  placeholder="VD: /dong-phuc-ao-gio hoặc để trống"
                  className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#105d97]/30 focus:border-[#105d97]"
                />
                {bannerForm.link && (
                  <button
                    type="button"
                    onClick={() => setBannerForm((current) => ({ ...current, openInNewTab: !current.openInNewTab }))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium w-full transition-colors ${bannerForm.openInNewTab ? "border-[#105d97] bg-blue-50 text-[#105d97]" : "border-[#e2e8f0] text-[#64748b] hover:border-[#105d97]/50"}`}
                  >
                    {bannerForm.openInNewTab ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                    Mở link trong tab mới
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#374151]">Bo góc (px)</label>
                  <div className="flex flex-col gap-1.5">
                    {RADIUS_OPTIONS.map((radius) => (
                      <button
                        key={radius}
                        type="button"
                        onClick={() => setBannerForm((current) => ({ ...current, borderRadius: radius }))}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${bannerForm.borderRadius === radius ? "border-[#105d97] bg-blue-50 text-[#105d97]" : "border-[#e2e8f0] text-[#374151] hover:border-[#105d97]/50"}`}
                      >
                        <span>{radius === 0 ? "Vuông" : `${radius}px`}</span>
                        {bannerForm.borderRadius === radius && <CheckCircle2 className="w-3.5 h-3.5 text-[#105d97]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#374151]">Hiển thị banner</label>
                  <button
                    type="button"
                    onClick={() => setBannerForm((current) => ({ ...current, isVisible: !current.isVisible }))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium w-full transition-colors ${bannerForm.isVisible ? "border-green-300 bg-green-50 text-green-700" : "border-[#e2e8f0] text-[#94a3b8] hover:border-[#105d97]/50"}`}
                  >
                    {bannerForm.isVisible ? (
                      <><Eye className="w-3.5 h-3.5" /> Đang hiện</>
                    ) : (
                      <><EyeOff className="w-3.5 h-3.5" /> Đang ẩn</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-[#e2e8f0] shrink-0 gap-2">
              {hasBanner(bannerModal) ? (
                <button
                  type="button"
                  onClick={() => setDeleteBannerConfirm(bannerModal)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa banner
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <button type="button" onClick={closeBannerModal} className="px-4 py-2 text-sm font-medium text-[#64748b] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={saveBanner}
                  disabled={bannerSaving || bannerUploading || mobileUploading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#7c3aed] rounded-lg hover:bg-[#6d28d9] disabled:opacity-60 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {bannerSaving ? "Đang lưu..." : "Lưu banner"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0f172a]">Xác nhận xóa</h3>
                <p className="text-xs text-[#64748b] mt-0.5">Section <strong>{deleteConfirm.title}</strong> sẽ bị xóa vĩnh viễn.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-[#64748b] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Banner Confirm Modal */}
      {deleteBannerConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <ImageIcon className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0f172a]">Xóa banner?</h3>
                <p className="text-xs text-[#64748b] mt-0.5">Banner của section <strong>{deleteBannerConfirm.title}</strong> sẽ bị xóa.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteBannerConfirm(null)} className="px-4 py-2 text-sm font-medium text-[#64748b] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Hủy
              </button>
              <button onClick={confirmDeleteBanner} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
                Xóa banner
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function BannerImageBlock({
  label,
  labelBadge,
  hint,
  borderRadius,
  image,
  fallbackImage,
  uploading,
  onUploadClick,
  onClear,
  onUrlChange,
}) {
  const displaySrc = image || fallbackImage || "";
  const usingFallback = !image && Boolean(fallbackImage);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold text-[#374151]">{label}</label>
        {labelBadge && (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-100 text-orange-600 uppercase">
            {labelBadge}
          </span>
        )}
        {usingFallback && (
          <span className="text-[10px] text-[#94a3b8]">(dùng ảnh Desktop làm fallback)</span>
        )}
      </div>

      {displaySrc ? (
        <div
          className="relative rounded-lg overflow-hidden border border-[#e2e8f0] group"
          style={{ borderRadius: `${borderRadius}px` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displaySrc}
            alt="preview"
            className="block h-auto w-full"
            style={{ opacity: usingFallback ? 0.5 : 1 }}
          />
          {isGif(displaySrc) && (
            <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-[9px] font-bold rounded uppercase">
              GIF
            </span>
          )}
          {!usingFallback && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={onUploadClick}
                className="px-3 py-1.5 bg-white text-xs font-medium rounded-lg shadow text-[#374151] hover:bg-gray-50 flex items-center gap-1"
              >
                <Upload className="w-3 h-3" /> Đổi ảnh
              </button>
              <button
                type="button"
                onClick={onClear}
                className="px-3 py-1.5 bg-white text-xs font-medium rounded-lg shadow text-red-500 hover:bg-red-50 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Xóa ảnh
              </button>
            </div>
          )}
          {usingFallback && (
            <div className="absolute inset-0 flex items-end justify-center pb-2">
              <button
                type="button"
                onClick={onUploadClick}
                className="px-3 py-1.5 bg-white/90 text-xs font-medium rounded-lg shadow text-[#105d97] hover:bg-white flex items-center gap-1"
              >
                <Upload className="w-3 h-3" /> Tải ảnh riêng cho mobile
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={onUploadClick}
          disabled={uploading}
          className="w-full h-20 border-2 border-dashed border-[#cbd5e1] rounded-lg flex flex-col items-center justify-center gap-1.5 text-[#94a3b8] hover:border-[#105d97] hover:text-[#105d97] transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span className="text-xs font-medium">Bấm để tải ảnh lên</span>
              <span className="text-[10px]">{hint}</span>
            </>
          )}
        </button>
      )}

      <div className="flex gap-2 items-center">
        <span className="text-[10px] text-[#94a3b8] shrink-0">hoặc URL:</span>
        <input
          value={image}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://..."
          className="flex-1 text-xs border border-[#e2e8f0] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#105d97]/30 focus:border-[#105d97]"
        />
        {image && (
          <button type="button" onClick={onClear} className="p-1.5 text-[#94a3b8] hover:text-red-400 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session || session.user?.role !== "admin") {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: {} };
}
