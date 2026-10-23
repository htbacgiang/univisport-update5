import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import toast from "react-hot-toast";
import {
  LayoutTemplate,
  Eye,
  EyeOff,
  GripVertical,
  Image as ImageIcon,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  X,
  Link as LinkIcon,
} from "lucide-react";
import AdminLayout from "../../../components/layout/AdminLayout";

const EMPTY_FORM = {
  image: "",
  alt: "",
  link: "",
  isVisible: true,
};

const QUICK_LINKS = [
  { label: "Đồng Phục Gym", value: "/dong-phuc-gym" },
  { label: "Đồng Phục Pickleball", value: "/dong-phuc-pickleball" },
  { label: "Đồng Phục Yoga", value: "/dong-phuc-yoga-pilates" },
  { label: "Đồng Phục Pilates", value: "/dong-phuc-pilates" },
  { label: "Đồng Phục Áo Gió", value: "/dong-phuc-ao-gio" },
  { label: "Đồng Phục Golf - Tennis", value: "/dong-phuc-golf-tennis" },
  { label: "Đồng Phục Áo Polo", value: "/dong-phuc-ao-polo" },
  { label: "Đồng Phục MMA", value: "/dong-phuc-mma" },
  { label: "Đồng Phục Chạy Bộ", value: "/dong-phuc-chay-bo" },
  { label: "Đồng Phục Áo Thun", value: "/dong-phuc-ao-thun" },
];

export default function SidebarBannersAdminPage() {
  const [banners, setBanners] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchBanners();
    fetchPosts();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/sidebar-banners");
      setBanners(data.banners);
      setOrderChanged(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Không thể tải danh sách banner.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get("/api/posts?limit=100");
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Không thể tải danh sách bài viết:", error);
    }
  };

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (banner) => {
    setEditTarget(banner);
    setForm({
      image: banner.image || "",
      alt: banner.alt || "",
      link: banner.link || "",
      isVisible: banner.isVisible !== false,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    if (!form.image.trim()) {
      toast.error("Vui lòng tải lên hoặc điền đường dẫn ảnh.");
      return;
    }

    setSaving(true);
    try {
      if (editTarget) {
        const { data } = await axios.put(
          `/api/sidebar-banners?id=${editTarget._id}`,
          form
        );
        setBanners((current) =>
          current.map((b) => (b._id === editTarget._id ? data.banner : b))
        );
        toast.success("Đã cập nhật banner.");
      } else {
        const { data } = await axios.post("/api/sidebar-banners", form);
        setBanners((current) => [...current, data.banner]);
        toast.success("Đã thêm banner.");
      }
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.error || "Không thể lưu banner.");
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = async (banner) => {
    const nextVisible = !banner.isVisible;
    const previousBanners = banners;
    setBanners((current) =>
      current.map((item) =>
        item._id === banner._id ? { ...item, isVisible: nextVisible } : item
      )
    );

    try {
      await axios.put(`/api/sidebar-banners?id=${banner._id}`, {
        isVisible: nextVisible,
      });
      toast.success(nextVisible ? "Đã hiện banner." : "Đã ẩn banner.");
    } catch (error) {
      setBanners(previousBanners);
      toast.error(error.response?.data?.error || "Không thể cập nhật banner.");
    }
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put("/api/sidebar-banners?action=reorder", {
        orderedIds: banners.map((b) => b._id),
      });
      setBanners(data.banners);
      setOrderChanged(false);
      toast.success("Đã lưu thứ tự banner.");
    } catch (error) {
      toast.error(error.response?.data?.error || "Không thể lưu thứ tự.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const { data } = await axios.delete(
        `/api/sidebar-banners?id=${deleteTarget._id}`
      );
      setBanners(data.banners);
      setOrderChanged(false);
      toast.success("Đã xóa banner.");
    } catch (error) {
      toast.error(error.response?.data?.error || "Không thể xóa banner.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const { data } = await axios.post("/api/upload", body);
      if (data.links?.[0]) {
        setForm((current) => ({ ...current, image: data.links[0] }));
        toast.success("Đã tải ảnh lên.");
      }
    } catch {
      toast.error("Tải ảnh thất bại.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <AdminLayout title="Quản lý Banner Sidebar danh mục">
      <div className="min-h-screen space-y-5 bg-[#f8fafc] p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <LayoutTemplate className="h-5 w-5 text-[#105d97]" />
            <div>
              <h1 className="m-0 text-[1.375rem] font-bold text-[#0f172a]">
                Banner Sidebar Danh Mục
              </h1>
              <p className="text-xs text-[#64748b]">
                Quản lý các hình ảnh chạy slide ở sidebar trang danh mục sản phẩm (BannerCarousel).
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {orderChanged && (
              <button
                type="button"
                onClick={saveOrder}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[#105d97] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d4a7a] disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? "Đang lưu..." : "Lưu thứ tự"}
              </button>
            )}
            <button
              type="button"
              onClick={openAdd}
              className="flex items-center gap-2 rounded-lg bg-[#16a34a] px-4 py-2 text-sm font-medium text-white hover:bg-[#15803d]"
            >
              <Plus className="h-4 w-4" />
              Thêm Banner
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <GripVertical className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Kéo thả để đổi thứ tự, sau đó bấm <strong>Lưu thứ tự</strong>.
            Banner bị ẩn vẫn được giữ trong trang quản trị.
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-6 w-6 animate-spin text-[#105d97]" />
            </div>
          ) : banners.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-[#64748b]">
              <LayoutTemplate className="h-12 w-12 text-[#cbd5e1]" />
              <p className="text-sm">Chưa có banner nào.</p>
              <button
                type="button"
                onClick={openAdd}
                className="flex items-center gap-2 rounded-lg bg-[#105d97] px-4 py-2 text-sm font-medium text-white"
              >
                <Plus className="h-4 w-4" />
                Thêm Banner đầu tiên
              </button>
            </div>
          ) : (
            <ReactSortable
              list={banners}
              setList={(nextBanners) => {
                const currentOrder = banners.map((b) => b._id).join(",");
                const nextOrder = nextBanners.map((b) => b._id).join(",");
                setBanners(nextBanners);
                if (currentOrder !== nextOrder) setOrderChanged(true);
              }}
              handle=".banner-drag-handle"
              animation={150}
            >
              {banners.map((banner, index) => (
                <div
                  key={banner._id}
                  className={`grid grid-cols-[32px_120px_1fr_auto] items-center gap-3 border-b border-[#f1f5f9] p-3 last:border-0 md:gap-4 md:p-4 ${
                    banner.isVisible ? "hover:bg-[#f8fafc]" : "bg-gray-50 opacity-60"
                  }`}
                >
                  <button
                    type="button"
                    className="banner-drag-handle cursor-grab text-[#94a3b8] active:cursor-grabbing"
                    aria-label={`Di chuyển banner ${index + 1}`}
                  >
                    <GripVertical className="h-5 w-5" />
                  </button>

                  <div className="relative h-20 w-32 overflow-hidden rounded-lg border border-[#e2e8f0] bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={banner.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="line-clamp-1 text-sm font-semibold text-[#0f172a]">
                      {banner.alt || "Chưa có mô tả (alt)"}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-[#64748b]">
                      Liên kết: {banner.link || "Không có"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
                        Thứ tự: {index + 1}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleVisible(banner)}
                      title={banner.isVisible ? "Ẩn Banner" : "Hiện Banner"}
                      className={`rounded-lg p-2 ${
                        banner.isVisible
                          ? "text-green-600 hover:bg-green-50"
                          : "text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      {banner.isVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(banner)}
                      title="Chỉnh sửa"
                      className="rounded-lg p-2 text-[#105d97] hover:bg-blue-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(banner)}
                      title="Xóa Banner"
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </ReactSortable>
          )}
        </div>

        {!loading && banners.length > 0 && (
          <p className="text-right text-xs text-[#94a3b8]">
            {banners.filter((b) => b.isVisible).length}/{banners.length} banner đang
            hiển thị
          </p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
              <h2 className="text-base font-bold text-[#0f172a]">
                {editTarget ? "Chỉnh sửa Banner" : "Thêm Banner mới"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1.5 text-[#64748b] hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={submitForm}
              className="flex-1 space-y-4 overflow-y-auto px-6 py-5"
            >
              <Field label="Ảnh Banner *">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  onChange={uploadImage}
                  className="hidden"
                />
                <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
                  <div className="relative h-28 overflow-hidden rounded-lg border border-[#e2e8f0] bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {form.image ? (
                      <img
                        src={form.image}
                        alt="Xem trước ảnh banner"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        Chưa chọn ảnh
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2 rounded-lg border border-[#105d97] px-3 py-2 text-xs font-medium text-[#105d97] hover:bg-blue-50 disabled:opacity-60"
                    >
                      {uploading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      {uploading ? "Đang tải..." : "Tải ảnh lên"}
                    </button>
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 shrink-0 text-[#94a3b8]" />
                      <input
                        value={form.image}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            image: event.target.value,
                          }))
                        }
                        className="min-w-0 flex-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-xs focus:border-[#105d97] focus:outline-none"
                        placeholder="/images/... hoặc https://..."
                      />
                    </div>
                  </div>
                </div>
              </Field>

              <Field label="Mô tả ảnh (Alt tag / Tiêu đề)">
                <input
                  value={form.alt}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      alt: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:border-[#105d97] focus:outline-none focus:ring-2 focus:ring-[#105d97]/20"
                  placeholder="Nhập mô tả cho banner"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Chọn nhanh liên kết danh mục (Tùy chọn)">
                  <select
                    onChange={(event) => {
                      const val = event.target.value;
                      if (val) {
                        setForm((current) => ({
                          ...current,
                          link: val,
                        }));
                      }
                    }}
                    value=""
                    className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:border-[#105d97] focus:outline-none"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {QUICK_LINKS.map((link) => (
                      <option key={link.value} value={link.value}>
                        {link.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Chọn nhanh liên kết bài viết (Tùy chọn)">
                  <select
                    onChange={(event) => {
                      const slug = event.target.value;
                      if (slug) {
                        setForm((current) => ({
                          ...current,
                          link: `/bai-viet/${slug}`,
                        }));
                      }
                    }}
                    value=""
                    className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:border-[#105d97] focus:outline-none"
                  >
                    <option value="">-- Chọn bài viết --</option>
                    {posts.map((post) => (
                      <option key={post.slug} value={post.slug}>
                        {post.title}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Đường dẫn liên kết khi click (Tự nhập hoặc chọn từ danh sách trên)">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 shrink-0 text-[#94a3b8]" />
                  <input
                    value={form.link}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        link: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:border-[#105d97] focus:outline-none focus:ring-2 focus:ring-[#105d97]/20"
                    placeholder="/dong-phuc-gym hoặc /bai-viet/ten-bai-viet hoặc https://..."
                  />
                </div>
              </Field>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#e2e8f0] p-3">
                <input
                  type="checkbox"
                  checked={form.isVisible}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isVisible: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-[#105d97]"
                />
                <span className="text-sm font-medium text-[#374151]">
                  Hiển thị banner này ở sidebar
                </span>
              </label>

              <div className="flex justify-end gap-2 border-t border-[#e2e8f0] pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-[#64748b] hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="rounded-lg bg-[#105d97] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d4a7a] disabled:opacity-60"
                >
                  {saving ? "Đang lưu..." : editTarget ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0f172a]">
                  Xác nhận xóa Banner
                </h3>
                <p className="mt-1 text-xs text-[#64748b]">
                  Banner này sẽ bị xóa vĩnh viễn khỏi hệ thống.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-[#64748b]"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-[#374151]">{label}</label>
      {children}
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
