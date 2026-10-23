import { getSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { ReactSortable } from "react-sortablejs";
import axios from "axios";
import AdminLayout from "../../../components/layout/AdminLayout";
import toast from "react-hot-toast";
import {
  Users, GripVertical, Eye, EyeOff, Trash2, Plus, Save,
  RefreshCw, X, Pencil, Upload, Link as LinkIcon, Image as ImageIcon,
  Building2, Dumbbell, Flower2, Home, LayoutGrid, List,
} from "lucide-react";

const emptyForm = { name: "", logo: "", link: "", category: "doanh-nghiep", isVisible: true, showOnHome: true };

const TABS = [
  { key: "all", label: "Tất cả", icon: Users, color: "#6366f1" },
  { key: "trang-chu", label: "Trang chủ", icon: Home, color: "#16a34a" },
  { key: "doanh-nghiep", label: "Doanh nghiệp", icon: Building2, color: "#105d97" },
  { key: "fitness-gym", label: "Fitness / Gym", icon: Dumbbell, color: "#ea580c" },
  { key: "yoga-studio", label: "Studio Yoga", icon: Flower2, color: "#9333ea" },
];

const CATEGORY_OPTS = [
  { value: "doanh-nghiep", label: "Doanh nghiệp" },
  { value: "fitness-gym", label: "Fitness / Gym" },
  { value: "yoga-studio", label: "Studio Yoga" },
];

export default function PartnerLogosPage() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const modalFileInputRef = useRef(null);

  useEffect(() => { fetchLogos(); }, []);

  const fetchLogos = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/partner-logos");
      setLogos(data.logos.map((l) => ({ ...l, id: l._id })));
    } catch { toast.error("Không thể tải danh sách logo"); }
    finally { setLoading(false); }
  };

  const tabLogos = activeTab === "all"
    ? logos
    : activeTab === "trang-chu"
      ? [...logos].filter(l => l.showOnHome !== false).sort((a, b) => (a.homeOrder ?? 0) - (b.homeOrder ?? 0) || (a.order ?? 0) - (b.order ?? 0))
      : logos.filter(l => l.category === activeTab);

  const visibleCount = (cat) => {
    if (cat === "all" || cat === "trang-chu") {
      return logos.filter(l => l.showOnHome !== false).length;
    }
    return logos.filter(l => l.category === cat && l.isVisible !== false).length;
  };

  const handleSortEnd = (newList) => {
    if (activeTab === "all") {
      setLogos(newList);
    } else if (activeTab === "trang-chu") {
      const updatedList = newList.map((item, index) => ({
        ...item,
        homeOrder: index
      }));
      setLogos(s => s.map(l => {
        const match = updatedList.find(u => u._id === l._id);
        return match ? match : l;
      }));
    } else {
      const others = logos.filter(l => l.category !== activeTab);
      setLogos([...others, ...newList]);
    }
    setOrderChanged(true);
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      const payload = {
        orderedIds: tabLogos.map(l => l._id || l.id)
      };
      if (activeTab === "trang-chu") {
        payload.type = "homepage";
      }
      await axios.put("/api/partner-logos?action=reorder", payload);
      setOrderChanged(false);
      toast.success("Đã lưu thứ tự hiển thị");
    } catch { toast.error("Lưu thứ tự thất bại"); }
    finally { setSaving(false); }
  };

  const toggleVisible = async (item) => {
    const isCurrentlyVisible = item.isVisible !== false;
    const nextVal = !isCurrentlyVisible;
    if (nextVal) {
      const cat = item.category || "doanh-nghiep";
      const catVisible = logos.filter(l => l.category === cat && l.isVisible !== false).length;
      if (catVisible >= 24) {
        toast.error(`Mỗi nhóm chỉ hiển thị tối đa 24 logo. Hãy ẩn logo khác trước.`);
        return;
      }
    }
    const prev = logos;
    setLogos(s => s.map(l => l._id === item._id ? { ...l, isVisible: nextVal } : l));
    try {
      await axios.put(`/api/partner-logos?id=${item._id}`, { isVisible: nextVal });
      toast.success(isCurrentlyVisible ? "Đã ẩn logo" : "Đã hiện logo");
    } catch { setLogos(prev); toast.error("Cập nhật thất bại"); }
  };

  const toggleShowOnHome = async (item) => {
    const isCurrentlyHomeVisible = item.showOnHome !== false;
    const nextVal = !isCurrentlyHomeVisible;
    if (nextVal) {
      const homeVisible = logos.filter(l => l.showOnHome !== false).length;
      if (homeVisible >= 24) {
        toast.error(`Trang chủ chỉ hiển thị tối đa 24 logo. Hãy ẩn logo khác trước.`);
        return;
      }
    }
    const prev = logos;
    setLogos(s => s.map(l => l._id === item._id ? { ...l, showOnHome: nextVal } : l));
    try {
      await axios.put(`/api/partner-logos?id=${item._id}`, { showOnHome: nextVal });
      toast.success(isCurrentlyHomeVisible ? "Đã ẩn khỏi trang chủ" : "Đã hiện ở trang chủ");
    } catch { setLogos(prev); toast.error("Cập nhật thất bại"); }
  };

  const openAdd = () => {
    const homeCount = logos.filter(l => l.showOnHome !== false).length;
    if (activeTab === "trang-chu" && homeCount >= 24) {
      toast.error("Trang chủ đã hiển thị đủ 24/24 logo. Bạn không thể thêm logo mới vào trang chủ.");
      return;
    }
    if (activeTab !== "all" && activeTab !== "trang-chu") {
      const catCount = logos.filter(l => l.category === activeTab && l.isVisible !== false).length;
      if (catCount >= 24) {
        const tabInfo = TABS.find(t => t.key === activeTab);
        toast.error(`Nhóm "${tabInfo?.label || activeTab}" đã hiển thị đủ 24/24 logo. Bạn không thể thêm logo mới vào nhóm này.`);
        return;
      }
    }
    const initialCategory = (activeTab === "all" || activeTab === "trang-chu") ? "doanh-nghiep" : activeTab;
    const catCount = logos.filter(l => l.category === initialCategory && l.isVisible !== false).length;
    setEditTarget(null);
    setForm({
      ...emptyForm,
      category: initialCategory,
      showOnHome: homeCount < 24,
      isVisible: catCount < 24
    });
    setShowModal(true);
  };
  const openEdit = (item) => {
    setEditTarget(item);
    setForm({
      name: item.name,
      logo: item.logo,
      link: item.link || "",
      category: item.category || "doanh-nghiep",
      isVisible: item.isVisible !== false,
      showOnHome: item.showOnHome !== false
    });
    setShowModal(true);
  };
  const handleCategoryChange = (cat) => {
    const catCount = logos.filter(l => l.category === cat && l.isVisible !== false && l._id !== editTarget?._id).length;
    const isCatLimit = catCount >= 24;
    setForm(f => ({
      ...f,
      category: cat,
      isVisible: isCatLimit ? false : f.isVisible
    }));
  };
  const closeModal = () => { setShowModal(false); setEditTarget(null); setForm(emptyForm); if (modalFileInputRef.current) modalFileInputRef.current.value = ""; };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const { data } = await axios.post("/api/upload", fd);
      if (data.links?.[0]) { setForm(f => ({ ...f, logo: data.links[0] })); toast.success("Đã tải logo lên"); }
    } catch { toast.error("Tải ảnh thất bại"); }
    finally { setUploading(false); if (modalFileInputRef.current) modalFileInputRef.current.value = ""; }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.logo.trim()) { toast.error("Vui lòng điền tên và logo"); return; }
    
    // Check validation limits
    if (form.isVisible) {
      const catVisible = logos.filter(l => l.category === form.category && l.isVisible !== false && l._id !== editTarget?._id).length;
      if (catVisible >= 24) {
        toast.error(`Mỗi nhóm chỉ hiển thị tối đa 24 logo. Nhóm này đã đủ 24 logo.`);
        return;
      }
    }
    if (form.showOnHome) {
      const homeVisible = logos.filter(l => l.showOnHome !== false && l._id !== editTarget?._id).length;
      if (homeVisible >= 24) {
        toast.error(`Trang chủ chỉ hiển thị tối đa 24 logo. Đã đủ 24 logo.`);
        return;
      }
    }

    setSaving(true);
    try {
      if (editTarget) {
        const { data } = await axios.put(`/api/partner-logos?id=${editTarget._id}`, form);
        setLogos(s => s.map(l => l._id === editTarget._id ? { ...data.logo, id: data.logo._id } : l));
        toast.success("Đã cập nhật logo");
      } else {
        const { data } = await axios.post("/api/partner-logos", form);
        setLogos(s => [...s, { ...data.logo, id: data.logo._id }]);
        toast.success("Đã thêm logo mới");
      }
      closeModal();
    } catch (err) { toast.error(err.response?.data?.err || "Lỗi xử lý"); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await axios.delete(`/api/partner-logos?id=${deleteConfirm._id}`);
      setLogos(s => s.filter(l => l._id !== deleteConfirm._id));
      toast.success("Đã xóa logo");
    } catch { toast.error("Xóa thất bại"); }
    finally { setDeleteConfirm(null); }
  };

  const seedDefaults = async () => {
    setSaving(true);
    try {
      const { data } = await axios.post("/api/partner-logos", { action: "seed" });
      setLogos(data.logos.map(l => ({ ...l, id: l._id })));
      toast.success("Đã khởi tạo logos mặc định");
    } catch (err) { toast.error(err.response?.data?.err || "Khởi tạo thất bại"); }
    finally { setSaving(false); }
  };

  const homeCountForLimit = logos.filter(l => l.showOnHome !== false && l._id !== editTarget?._id).length;
  const isHomeLimitReached = homeCountForLimit >= 24;

  const catCountForLimit = logos.filter(l => l.category === form.category && l.isVisible !== false && l._id !== editTarget?._id).length;
  const isCatLimitReached = catCountForLimit >= 24;

  const activeTabInfo = TABS.find(t => t.key === activeTab);

  return (
    <AdminLayout title="Quản lý Logo Đối Tác">
      <div className="p-6 bg-[#f8fafc] min-h-screen space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#105d97] shrink-0" />
            <h1 className="text-[1.375rem] font-bold text-[#0f172a] m-0">Logo Đối Tác</h1>
          </div>
          <div className="flex items-center gap-2">
            {orderChanged && (
              <button onClick={saveOrder} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-[#105d97] text-white text-sm font-medium rounded-lg hover:bg-[#0d4a7a] disabled:opacity-60 transition-colors">
                <Save className="w-4 h-4" />{saving ? "Đang lưu..." : "Lưu thứ tự"}
              </button>
            )}
            <button onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-[#16a34a] text-white text-sm font-medium rounded-lg hover:bg-[#15803d] transition-colors">
              <Plus className="w-4 h-4" />Thêm Logo
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const total = (tab.key === "all" || tab.key === "trang-chu") ? logos.length : logos.filter(l => l.category === tab.key).length;
            const vis = visibleCount(tab.key);
            return (
              <div key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`rounded-xl border p-4 cursor-pointer transition-all ${activeTab === tab.key ? "border-current shadow-md" : "border-[#e2e8f0] hover:border-current hover:shadow-sm"}`}
                style={{ borderColor: activeTab === tab.key ? tab.color : undefined, background: activeTab === tab.key ? tab.color + "0d" : "white" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" style={{ color: tab.color }} />
                  <span className="text-xs font-semibold" style={{ color: tab.color }}>{tab.label}</span>
                </div>
                <p className="text-xl font-bold text-[#0f172a]">{vis}<span className="text-sm font-normal text-[#94a3b8]">{tab.key === "all" ? `/${total}` : "/24"}</span></p>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">
                  {(tab.key === "all" || tab.key === "trang-chu") ? "đang hiện trang chủ (tối đa 24)" : "đang hiển thị ở nhóm (tối đa 24)"}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tabs & View Modes */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-1 bg-white border border-[#e2e8f0] rounded-xl p-1 w-fit">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? "text-white shadow-sm" : "text-[#64748b] hover:text-[#0f172a]"}`}
                  style={{ background: activeTab === tab.key ? tab.color : "transparent" }}>
                  <Icon className="w-3.5 h-3.5" />{tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex gap-1 bg-white border border-[#e2e8f0] rounded-xl p-1 w-fit">
            <button onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === "grid" ? "bg-[#105d97] text-white shadow-sm" : "text-[#64748b] hover:text-[#0f172a]"}`}>
              <LayoutGrid className="w-3.5 h-3.5" />Dạng Lưới
            </button>
            <button onClick={() => setViewMode("list")}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === "list" ? "bg-[#105d97] text-white shadow-sm" : "text-[#64748b] hover:text-[#0f172a]"}`}>
              <List className="w-3.5 h-3.5" />Dạng Danh sách
            </button>
          </div>
        </div>

        {/* Guide note */}
        <div className="flex items-start gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <GripVertical className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            Kéo thả để sắp xếp thứ tự hiển thị. Bấm <strong>Lưu thứ tự</strong> sau khi sắp xếp xong.
            Mỗi nhóm đối tác và nhóm trang chủ được hiển thị <strong>tối đa 24 logo</strong> trên website.
          </span>
        </div>

        {/* Logo table / grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16"><RefreshCw className="w-6 h-6 text-[#105d97] animate-spin" /></div>
        ) : tabLogos.length === 0 ? (
          <div className="bg-white border border-[#e2e8f0] rounded-[10px] p-16 flex flex-col items-center justify-center gap-4 text-[#64748b]">
            <Users className="w-12 h-12 text-[#cbd5e1]" />
            <p className="text-sm">Chưa có logo nào trong nhóm này.</p>
            {logos.length === 0 && (
              <button onClick={seedDefaults} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-[#105d97] text-white text-sm font-medium rounded-lg hover:bg-[#0d4a7a] disabled:opacity-60 transition-colors">
                <RefreshCw className="w-4 h-4" />Khởi tạo Logos Mặc Định
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <ReactSortable list={tabLogos} setList={handleSortEnd} animation={150}
            className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {tabLogos.map(item => {
              const catInfo = TABS.find(t => t.key === item.category) || TABS[2];
              const CatIcon = catInfo.icon;
              const isHomeVisible = item.showOnHome !== false;
              return (
                <div key={item._id || item.id}
                  className={`relative group bg-white border border-[#e2e8f0] rounded-xl p-3 flex flex-col items-center justify-center aspect-[4/3] shadow-sm hover:shadow-md hover:border-[#105d97] transition-all cursor-grab active:cursor-grabbing ${!item.isVisible && !item.showOnHome ? "opacity-50 bg-gray-50" : ""}`}>
                  
                  {/* Logo Image */}
                  <div className="w-full h-12 flex items-center justify-center overflow-hidden mb-1">
                    {item.logo
                      ? <img src={item.logo} alt={item.name} className="h-full w-full object-contain mix-blend-multiply" />
                      : <ImageIcon className="w-6 h-6 text-[#cbd5e1]" />}
                  </div>

                  {/* Name */}
                  <p className="text-[11px] font-semibold text-[#0f172a] text-center truncate w-full px-1">{item.name}</p>

                  {/* Category Label at top */}
                  <div className="absolute top-1.5 left-1.5">
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold"
                      style={{ background: catInfo.color + "18", color: catInfo.color }}>
                      <CatIcon className="w-2 h-2" />
                    </span>
                  </div>

                  {/* Quick Visibility Indicators */}
                  <div className="absolute top-1.5 right-1.5 flex gap-1">
                    {item.isVisible && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Hiện ở nhóm" />
                    )}
                    {isHomeVisible && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" title="Hiện ở trang chủ" />
                    )}
                  </div>

                  {/* Hover Controls Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 rounded-xl">
                    <button type="button" onClick={(e) => { e.stopPropagation(); openEdit(item); }} title="Chỉnh sửa"
                      className="p-1.5 rounded-lg bg-white text-[#105d97] hover:bg-blue-50 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); toggleVisible(item); }} title={item.isVisible ? "Ẩn khỏi nhóm" : "Hiện ở nhóm"}
                      className={`p-1.5 rounded-lg bg-white transition-colors ${item.isVisible ? "text-[#16a34a] hover:bg-green-50" : "text-[#94a3b8] hover:bg-gray-100"}`}>
                      {item.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); toggleShowOnHome(item); }} title={isHomeVisible ? "Ẩn khỏi trang chủ" : "Hiện ở trang chủ"}
                      className={`p-1.5 rounded-lg bg-white transition-colors ${isHomeVisible ? "text-[#9333ea] hover:bg-purple-50" : "text-[#94a3b8] hover:bg-gray-100"}`}>
                      {isHomeVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(item); }} title="Xóa"
                      className="p-1.5 rounded-lg bg-white text-[#ef4444] hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </ReactSortable>
        ) : (
          <div className="bg-white border border-[#e2e8f0] rounded-[10px] overflow-hidden">
            <div className="grid grid-cols-[32px_80px_1fr_110px_110px_70px_70px_90px] gap-3 items-center px-4 py-3 bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
              <span /><span>Logo</span><span>Tên đối tác</span><span>Nhóm</span><span>Link</span>
              <span className="text-center">Nhóm</span><span className="text-center">T.Chủ</span><span className="text-center">Thao tác</span>
            </div>
            <ReactSortable list={tabLogos} setList={handleSortEnd} handle=".drag-handle" animation={150}>
              {tabLogos.map(item => {
                const catInfo = TABS.find(t => t.key === item.category) || TABS[2];
                const CatIcon = catInfo.icon;
                const isHomeVisible = item.showOnHome !== false;
                return (
                  <div key={item._id || item.id}
                    className={`grid grid-cols-[32px_80px_1fr_110px_110px_70px_70px_90px] gap-3 items-center px-4 py-3 border-b border-[#f1f5f9] last:border-0 transition-colors ${!item.isVisible && !item.showOnHome ? "opacity-50 bg-gray-50" : "hover:bg-[#f8fafc]"}`}>
                    <div className="drag-handle cursor-grab active:cursor-grabbing text-[#94a3b8] hover:text-[#64748b] flex justify-center">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-16 h-10 relative rounded-md overflow-hidden border border-[#e2e8f0] bg-gray-50 flex items-center justify-center">
                        {item.logo
                          ? <img src={item.logo} alt={item.name} className="h-full w-full object-contain mix-blend-multiply" />
                          : <ImageIcon className="w-4 h-4 text-[#cbd5e1]" />}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-[#0f172a] truncate">{item.name}</p>
                    <div className="flex items-center gap-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: catInfo.color + "18", color: catInfo.color }}>
                        <CatIcon className="w-2.5 h-2.5" />{catInfo.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748b] truncate">{item.link || <span className="text-[#cbd5e1]">—</span>}</p>
                    <div className="flex justify-center">
                      <button type="button" onClick={() => toggleVisible(item)} title={item.isVisible ? "Ẩn khỏi nhóm" : "Hiện ở nhóm"}
                        className={`p-2 rounded-lg transition-colors ${item.isVisible ? "text-[#16a34a] hover:bg-green-50" : "text-[#94a3b8] hover:bg-gray-100"}`}>
                        {item.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <button type="button" onClick={() => toggleShowOnHome(item)} title={isHomeVisible ? "Ẩn khỏi trang chủ" : "Hiện ở trang chủ"}
                        className={`p-2 rounded-lg transition-colors ${isHomeVisible ? "text-[#9333ea] hover:bg-purple-50" : "text-[#94a3b8] hover:bg-gray-100"}`}>
                        {isHomeVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <button type="button" onClick={() => openEdit(item)} title="Chỉnh sửa" className="p-2 rounded-lg text-[#105d97] hover:bg-blue-50 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => setDeleteConfirm(item)} title="Xóa logo" className="p-2 rounded-lg text-[#ef4444] hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </ReactSortable>
          </div>
        )}

        {tabLogos.length > 0 && (
          <p className="text-xs text-[#94a3b8] text-right">
            {(activeTab === "all" || activeTab === "trang-chu")
              ? `${logos.filter(l => l.showOnHome !== false).length}/24 logo đang hiển thị ở trang chủ (tổng số: ${logos.length} logo)`
              : `${tabLogos.filter(l => l.isVisible !== false).length}/24 logo đang hiển thị ở nhóm này (tổng số: ${tabLogos.length} logo)`}
          </p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
              <h2 className="text-base font-bold text-[#0f172a]">{editTarget ? "Chỉnh sửa Logo" : "Thêm Logo Mới"}</h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#64748b]"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={submitForm} className="px-6 py-5 space-y-4">
              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#374151]">Nhóm đối tác *</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORY_OPTS.map(opt => (
                    <button key={opt.value} type="button" onClick={() => handleCategoryChange(opt.value)}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${form.category === opt.value ? "border-[#105d97] bg-[#105d97] text-white" : "border-[#e2e8f0] text-[#64748b] hover:border-[#105d97]"}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Logo upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#374151]">Logo *</label>
                <input ref={modalFileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" className="hidden" onChange={handleLogoUpload} />
                {form.logo ? (
                  <div className="relative rounded-xl overflow-hidden border border-[#e2e8f0] bg-gray-50 group">
                     <img src={form.logo} alt="Logo preview" className="w-full h-28 object-contain mix-blend-multiply" />
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                       <button type="button" onClick={() => modalFileInputRef.current?.click()} className="px-3 py-1.5 bg-white text-xs font-medium rounded-lg shadow text-[#374151] hover:bg-gray-50 flex items-center gap-1"><Upload className="w-3 h-3" />Đổi ảnh</button>
                       <button type="button" onClick={() => setForm(f => ({ ...f, logo: "" }))} className="px-3 py-1.5 bg-white text-xs font-medium rounded-lg shadow text-red-500 hover:bg-red-50 flex items-center gap-1"><X className="w-3 h-3" />Xóa</button>
                     </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => modalFileInputRef.current?.click()} disabled={uploading}
                    className="w-full h-24 border-2 border-dashed border-[#cbd5e1] rounded-xl flex flex-col items-center justify-center gap-1.5 text-[#94a3b8] hover:border-[#105d97] hover:text-[#105d97] transition-colors disabled:opacity-60">
                    {uploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Upload className="w-5 h-5" /><span className="text-xs font-medium">Bấm để tải ảnh lên</span><span className="text-[10px]">JPG, PNG, WebP, SVG</span></>}
                  </button>
                )}
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] text-[#94a3b8] shrink-0">hoặc URL:</span>
                  <input value={form.logo} onChange={e => setForm(f => ({ ...f, logo: e.target.value }))} placeholder="https://... hoặc /khach-hang/1.png"
                    className="flex-1 text-xs border border-[#e2e8f0] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#105d97]/30 focus:border-[#105d97]" />
                  {form.logo && <button type="button" onClick={() => setForm(f => ({ ...f, logo: "" }))} className="p-1.5 text-[#94a3b8] hover:text-red-400 transition-colors"><X className="w-3.5 h-3.5" /></button>}
                </div>
              </div>
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#374151]">Tên đối tác *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Công ty ABC"
                  className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#105d97]/30 focus:border-[#105d97]" />
              </div>
              {/* Link */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#374151] flex items-center gap-1"><LinkIcon className="w-3 h-3" />Link khi click (tùy chọn)</label>
                <input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://... hoặc để trống"
                  className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#105d97]/30 focus:border-[#105d97]" />
              </div>
              {/* Checkboxes for isVisible and showOnHome */}
              <div className="flex gap-6 py-1">
                <label className={`flex items-center gap-2 select-none ${isCatLimitReached && (!editTarget || editTarget.category !== form.category || editTarget.isVisible === false) ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
                  <input
                    type="checkbox"
                    checked={form.isVisible}
                    disabled={isCatLimitReached && (!editTarget || editTarget.category !== form.category || editTarget.isVisible === false)}
                    onChange={(e) => setForm(f => ({ ...f, isVisible: e.target.checked }))}
                    className="w-4 h-4 text-[#105d97] border-gray-300 rounded focus:ring-[#105d97] disabled:opacity-50"
                  />
                  <span className="text-xs font-semibold text-[#374151]">
                    Hiện ở nhóm {isCatLimitReached && (!editTarget || editTarget.category !== form.category || editTarget.isVisible === false) && <span className="text-red-500 font-normal">(Đã đủ 24)</span>}
                  </span>
                </label>
                <label className={`flex items-center gap-2 select-none ${isHomeLimitReached && (!editTarget || editTarget.showOnHome === false) ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
                  <input
                    type="checkbox"
                    checked={form.showOnHome}
                    disabled={isHomeLimitReached && (!editTarget || editTarget.showOnHome === false)}
                    onChange={(e) => setForm(f => ({ ...f, showOnHome: e.target.checked }))}
                    className="w-4 h-4 text-[#105d97] border-gray-300 rounded focus:ring-[#105d97] disabled:opacity-50"
                  />
                  <span className="text-xs font-semibold text-[#374151]">
                    Hiện ở trang chủ {isHomeLimitReached && (!editTarget || editTarget.showOnHome === false) && <span className="text-red-500 font-normal">(Đã đủ 24)</span>}
                  </span>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-[#64748b] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Hủy</button>
                <button type="submit" disabled={saving || uploading} className="px-4 py-2 text-sm font-medium text-white bg-[#105d97] rounded-lg hover:bg-[#0d4a7a] disabled:opacity-60 transition-colors">
                  {saving ? "Đang lưu..." : editTarget ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0"><Trash2 className="w-5 h-5 text-red-500" /></div>
              <div>
                <h3 className="text-sm font-bold text-[#0f172a]">Xác nhận xóa</h3>
                <p className="text-xs text-[#64748b] mt-0.5">Logo <strong>{deleteConfirm.name}</strong> sẽ bị xóa vĩnh viễn.</p>
              </div>
            </div>
            {deleteConfirm.logo && (
              <div className="flex justify-center py-2">
                <img src={deleteConfirm.logo} alt={deleteConfirm.name} className="h-16 object-contain mix-blend-multiply" />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm font-medium text-[#64748b] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Hủy</button>
              <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session || session.user?.role !== "admin") {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: {} };
}
