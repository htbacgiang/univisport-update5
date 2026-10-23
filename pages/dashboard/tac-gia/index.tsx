import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import db from "../../../utils/db";
import Author from "../../../models/Author";

interface AuthorItem {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio: string;
  avatar: string;
  socialLinks: { facebook: string; zalo: string; linkedin: string };
}

interface FormState {
  name: string;
  slug: string;
  role: string;
  bio: string;
  avatar: string;
  socialLinks: { facebook: string; zalo: string; linkedin: string };
}

const emptyForm: FormState = {
  name: "",
  slug: "",
  role: "",
  bio: "",
  avatar: "",
  socialLinks: { facebook: "", zalo: "", linkedin: "" },
};

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

interface Props {
  initialAuthors: AuthorItem[];
}

const AuthorsDashboard: NextPage<Props> = ({ initialAuthors }) => {
  const [authors, setAuthors] = useState<AuthorItem[]>(initialAuthors);
  const [showModal, setShowModal] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AuthorItem | null>(null);

  // Auto-generate slug from name when creating
  useEffect(() => {
    if (!editingSlug && form.name) {
      setForm((prev) => ({ ...prev, slug: slugify(form.name) }));
    }
  }, [form.name, editingSlug]);

  const openCreate = () => {
    setEditingSlug(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (author: AuthorItem) => {
    setEditingSlug(author.slug);
    setForm({
      name: author.name,
      slug: author.slug,
      role: author.role,
      bio: author.bio,
      avatar: author.avatar,
      socialLinks: { ...author.socialLinks },
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSlug(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("Tên và slug là bắt buộc");
      return;
    }
    setSubmitting(true);
    try {
      if (editingSlug) {
        const { data } = await axios.patch(`/api/authors/${editingSlug}`, form);
        setAuthors((prev) =>
          prev.map((a) =>
            a.slug === editingSlug
              ? {
                id: data.author._id,
                name: data.author.name,
                slug: data.author.slug,
                role: data.author.role || "",
                bio: data.author.bio || "",
                avatar: data.author.avatar || "",
                socialLinks: {
                  facebook: data.author.socialLinks?.facebook || "",
                  zalo: data.author.socialLinks?.zalo || "",
                  linkedin: data.author.socialLinks?.linkedin || "",
                },
              }
              : a
          )
        );
        toast.success("Cập nhật tác giả thành công!");
      } else {
        const { data } = await axios.post("/api/authors", form);
        setAuthors((prev) => [
          ...prev,
          {
            id: data.author._id,
            name: data.author.name,
            slug: data.author.slug,
            role: data.author.role || "",
            bio: data.author.bio || "",
            avatar: data.author.avatar || "",
            socialLinks: {
              facebook: data.author.socialLinks?.facebook || "",
              zalo: data.author.socialLinks?.zalo || "",
              linkedin: data.author.socialLinks?.linkedin || "",
            },
          },
        ]);
        toast.success("Tạo tác giả thành công!");
      }
      closeModal();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/authors/${deleteTarget.slug}`);
      setAuthors((prev) => prev.filter((a) => a.slug !== deleteTarget.slug));
      toast.success("Đã xóa tác giả!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Có lỗi xảy ra khi xóa");
    } finally {
      setDeleteTarget(null);
    }
  };

  const setSocial = (key: keyof FormState["socialLinks"], value: string) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value },
    }));
  };

  return (
    <AdminLayout title="Quản lý tác giả">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tác giả</h1>
            <p className="text-sm text-gray-400 mt-1">
              {authors.length} tác giả
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#105d97] text-white rounded-xl text-sm font-semibold hover:bg-[#0d4d7f] transition-colors"
          >
            <span className="text-lg leading-none">+</span>
            Thêm tác giả
          </button>
        </div>

        {/* List */}
        {authors.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">👤</p>
            <p className="font-medium">Chưa có tác giả nào</p>
            <p className="text-sm mt-1">Nhấn &quot;Thêm tác giả&quot; để bắt đầu</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {authors.map((author) => (
              <div
                key={author.slug}
                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Avatar */}
                {author.avatar ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#105d97] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl font-bold">
                      {author.name.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{author.name}</p>
                  {author.role && (
                    <p className="text-sm text-[#105d97]">{author.role}</p>
                  )}
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    /tac-gia/{author.slug}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`/tac-gia/${author.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Xem trang
                  </a>
                  <button
                    onClick={() => openEdit(author)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => setDeleteTarget(author)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingSlug ? "Chỉnh sửa tác giả" : "Thêm tác giả mới"}
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên tác giả <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#105d97]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="nguyen-van-a"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#105d97]"
                />
                <p className="text-xs text-gray-400 mt-1">
                  URL: /tac-gia/{form.slug || "..."}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chức danh
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="VD: Biên tập viên, Chuyên gia"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#105d97]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiểu sử
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Mô tả ngắn về tác giả..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#105d97] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL ảnh đại diện
                </label>
                <input
                  type="text"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#105d97]"
                />
                {form.avatar && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={form.avatar}
                    alt="Preview"
                    className="mt-2 w-12 h-12 rounded-full object-cover border"
                  />
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Mạng xã hội</p>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Facebook</label>
                  <input
                    type="text"
                    value={form.socialLinks.facebook}
                    onChange={(e) => setSocial("facebook", e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#105d97]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Zalo</label>
                  <input
                    type="text"
                    value={form.socialLinks.zalo}
                    onChange={(e) => setSocial("zalo", e.target.value)}
                    placeholder="https://zalo.me/..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#105d97]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">LinkedIn</label>
                  <input
                    type="text"
                    value={form.socialLinks.linkedin}
                    onChange={(e) => setSocial("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#105d97]"
                  />
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-xl bg-[#105d97] text-white text-sm font-semibold hover:bg-[#0d4d7f] transition-colors disabled:opacity-50"
                >
                  {submitting ? "Đang lưu..." : editingSlug ? "Lưu thay đổi" : "Tạo tác giả"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-xl">!</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Xóa tác giả?</h3>
            <p className="text-sm text-gray-500 mb-1">
              Bạn có chắc muốn xóa{" "}
              <span className="font-semibold text-gray-700">{deleteTarget.name}</span>?
            </p>
            <p className="text-xs text-gray-400 mb-6">
              Các bài viết của tác giả này sẽ không còn gắn với tác giả nữa.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const session = await getSession(context);

  if (!session || !session.user || (session.user as { role?: string }).role !== "admin") {
    return {
      redirect: { destination: "/dang-nhap", permanent: false },
    };
  }

  try {
    await db.connectDb();
    const authors = await Author.find().sort({ name: 1 }).lean();
    const initialAuthors: AuthorItem[] = authors.map((a: any) => ({
      id: a._id.toString(),
      name: a.name,
      slug: a.slug,
      role: a.role || "",
      bio: a.bio || "",
      avatar: a.avatar || "",
      socialLinks: {
        facebook: a.socialLinks?.facebook || "",
        zalo: a.socialLinks?.zalo || "",
        linkedin: a.socialLinks?.linkedin || "",
      },
    }));
    return { props: { initialAuthors } };
  } catch (err) {
    console.error("Error in getServerSideProps:", err);
    return { props: { initialAuthors: [] } };
  } finally {
    await db.disconnectDb();
  }
};

export default AuthorsDashboard;
