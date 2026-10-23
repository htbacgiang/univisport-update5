import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import toast from "react-hot-toast";
import {
  CircleHelp,
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
} from "lucide-react";
import AdminLayout from "../../../components/layout/AdminLayout";

const EMPTY_FORM = {
  question: "",
  answer: "",
  image: "/images/thumb-univi.jpg",
  video: "",
  isVisible: true,
};

export default function HomepageFaqAdminPage() {
  const [faqs, setFaqs] = useState([]);
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
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/homepage-faqs?admin=true");
      setFaqs(data.faqs);
      setOrderChanged(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Không thể tải danh sách FAQ.");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (faq) => {
    setEditTarget(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      image: faq.image || "/images/thumb-univi.jpg",
      video: faq.video || "",
      isVisible: faq.isVisible !== false,
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
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Vui lòng nhập câu hỏi và câu trả lời.");
      return;
    }

    setSaving(true);
    try {
      if (editTarget) {
        const { data } = await axios.put(
          `/api/homepage-faqs?id=${editTarget._id}`,
          form
        );
        setFaqs((current) =>
          current.map((faq) => (faq._id === editTarget._id ? data.faq : faq))
        );
        toast.success("Đã cập nhật FAQ.");
      } else {
        const { data } = await axios.post("/api/homepage-faqs", form);
        setFaqs((current) => [...current, data.faq]);
        toast.success("Đã thêm FAQ.");
      }
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.error || "Không thể lưu FAQ.");
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = async (faq) => {
    const nextVisible = !faq.isVisible;
    const previousFaqs = faqs;
    setFaqs((current) =>
      current.map((item) =>
        item._id === faq._id ? { ...item, isVisible: nextVisible } : item
      )
    );

    try {
      await axios.put(`/api/homepage-faqs?id=${faq._id}`, {
        isVisible: nextVisible,
      });
      toast.success(nextVisible ? "Đã hiện FAQ." : "Đã ẩn FAQ.");
    } catch (error) {
      setFaqs(previousFaqs);
      toast.error(error.response?.data?.error || "Không thể cập nhật FAQ.");
    }
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put("/api/homepage-faqs?action=reorder", {
        orderedIds: faqs.map((faq) => faq._id),
      });
      setFaqs(data.faqs);
      setOrderChanged(false);
      toast.success("Đã lưu thứ tự FAQ.");
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
        `/api/homepage-faqs?id=${deleteTarget._id}`
      );
      setFaqs(data.faqs);
      setOrderChanged(false);
      toast.success("Đã xóa FAQ.");
    } catch (error) {
      toast.error(error.response?.data?.error || "Không thể xóa FAQ.");
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
    <AdminLayout title="Quản lý FAQ trang chủ">
      <div className="min-h-screen space-y-5 bg-[#f8fafc] p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CircleHelp className="h-5 w-5 text-[#105d97]" />
            <div>
              <h1 className="m-0 text-[1.375rem] font-bold text-[#0f172a]">
                FAQ Trang Chủ
              </h1>
              <p className="text-xs text-[#64748b]">
                Quản lý câu hỏi, nội dung và video trong FAQComponent.
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
              Thêm FAQ
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <GripVertical className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Kéo thả để đổi thứ tự, sau đó bấm <strong>Lưu thứ tự</strong>.
            FAQ bị ẩn vẫn được giữ trong trang quản trị.
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-6 w-6 animate-spin text-[#105d97]" />
            </div>
          ) : faqs.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-[#64748b]">
              <CircleHelp className="h-12 w-12 text-[#cbd5e1]" />
              <p className="text-sm">Chưa có FAQ nào trên trang chủ.</p>
              <button
                type="button"
                onClick={openAdd}
                className="flex items-center gap-2 rounded-lg bg-[#105d97] px-4 py-2 text-sm font-medium text-white"
              >
                <Plus className="h-4 w-4" />
                Thêm FAQ đầu tiên
              </button>
            </div>
          ) : (
            <ReactSortable
              list={faqs}
              setList={(nextFaqs) => {
                const currentOrder = faqs.map((faq) => faq._id).join(",");
                const nextOrder = nextFaqs.map((faq) => faq._id).join(",");
                setFaqs(nextFaqs);
                if (currentOrder !== nextOrder) setOrderChanged(true);
              }}
              handle=".faq-drag-handle"
              animation={150}
            >
              {faqs.map((faq, index) => (
                <div
                  key={faq._id}
                  className={`grid grid-cols-[32px_64px_1fr_auto] items-center gap-3 border-b border-[#f1f5f9] p-3 last:border-0 md:gap-4 md:p-4 ${
                    faq.isVisible ? "hover:bg-[#f8fafc]" : "bg-gray-50 opacity-60"
                  }`}
                >
                  <button
                    type="button"
                    className="faq-drag-handle cursor-grab text-[#94a3b8] active:cursor-grabbing"
                    aria-label={`Di chuyển FAQ ${index + 1}`}
                  >
                    <GripVertical className="h-5 w-5" />
                  </button>

                  <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-[#e2e8f0] bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={faq.image || "/images/thumb-univi.jpg"}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold text-[#0f172a]">
                      {faq.question}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-[#64748b]">
                      {faq.answer}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
                        FAQ {index + 1}
                      </span>
                      {faq.video && (
                        <span className="rounded-full bg-purple-50 px-2 py-0.5 font-medium text-purple-700">
                          Có video
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleVisible(faq)}
                      title={faq.isVisible ? "Ẩn FAQ" : "Hiện FAQ"}
                      className={`rounded-lg p-2 ${
                        faq.isVisible
                          ? "text-green-600 hover:bg-green-50"
                          : "text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      {faq.isVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(faq)}
                      title="Chỉnh sửa"
                      className="rounded-lg p-2 text-[#105d97] hover:bg-blue-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(faq)}
                      title="Xóa FAQ"
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

        {!loading && faqs.length > 0 && (
          <p className="text-right text-xs text-[#94a3b8]">
            {faqs.filter((faq) => faq.isVisible).length}/{faqs.length} FAQ đang
            hiển thị
          </p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
              <h2 className="text-base font-bold text-[#0f172a]">
                {editTarget ? "Chỉnh sửa FAQ" : "Thêm FAQ mới"}
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
              <Field label="Câu hỏi *">
                <input
                  value={form.question}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      question: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:border-[#105d97] focus:outline-none focus:ring-2 focus:ring-[#105d97]/20"
                  placeholder="Nhập câu hỏi"
                />
              </Field>

              <Field label="Câu trả lời *">
                <textarea
                  rows={7}
                  value={form.answer}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      answer: event.target.value,
                    }))
                  }
                  className="w-full resize-y rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:border-[#105d97] focus:outline-none focus:ring-2 focus:ring-[#105d97]/20"
                  placeholder="Nhập câu trả lời. Có thể xuống dòng để chia đoạn."
                />
              </Field>

              <Field label="Ảnh đại diện">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  onChange={uploadImage}
                  className="hidden"
                />
                <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
                  <div className="relative h-40 overflow-hidden rounded-lg border border-[#e2e8f0] bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.image || "/images/thumb-univi.jpg"}
                      alt="Xem trước ảnh FAQ"
                      className="h-full w-full object-cover"
                    />
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

              <Field label="Link video Facebook">
                <input
                  value={form.video}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      video: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:border-[#105d97] focus:outline-none focus:ring-2 focus:ring-[#105d97]/20"
                  placeholder="https://www.facebook.com/reel/..."
                />
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
                  Hiển thị FAQ này trên trang chủ
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
                  Xác nhận xóa FAQ
                </h3>
                <p className="mt-1 text-xs text-[#64748b]">
                  &quot;{deleteTarget.question}&quot; sẽ bị xóa vĩnh viễn.
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
