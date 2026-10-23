import axios from "axios";
import { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import {
  Eye,
  EyeOff,
  FileText,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";

type CategorySetting = {
  categorySlug: string;
  label: string;
  articleType: "default" | "custom";
  articleId: string;
  isVisible: boolean;
  article?: CategoryArticle | null;
};

type CategoryArticle = {
  id: string;
  title: string;
  categorySlug: string;
  createdAt?: string;
  postAuthor?: {
    name: string;
  } | null;
};

const CategoryArticlesDashboard: NextPage = () => {
  const [settings, setSettings] = useState<CategorySetting[]>([]);
  const [articles, setArticles] = useState<CategoryArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const articlesByCategory = useMemo(() => {
    const map = new Map<string, CategoryArticle[]>();
    articles.forEach((article) => {
      const current = map.get(article.categorySlug) || [];
      map.set(article.categorySlug, [...current, article]);
    });
    return map;
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return articles;

    return articles.filter((article) =>
      [article.title, article.categorySlug, article.postAuthor?.name]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    );
  }, [articles, searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/category-articles");
      setSettings(data.settings || []);
      setArticles(data.articles || []);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Không thể tải dữ liệu bài viết danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateLocalSetting = (categorySlug: string, updates: Partial<CategorySetting>) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.categorySlug === categorySlug ? { ...setting, ...updates } : setting
      )
    );
  };

  const saveSetting = async (setting: CategorySetting) => {
    if (setting.articleType === "custom" && !setting.articleId) {
      toast.error("Vui lòng chọn bài viết danh mục trước khi lưu");
      return;
    }

    setSavingSlug(setting.categorySlug);
    try {
      const { data } = await axios.put("/api/category-articles", {
        categorySlug: setting.categorySlug,
        articleType: setting.articleType,
        articleId: setting.articleType === "custom" ? setting.articleId : "",
        isVisible: setting.isVisible,
      });

      setSettings((prev) =>
        prev.map((item) =>
          item.categorySlug === setting.categorySlug
            ? {
                ...item,
                ...data.setting,
                label: item.label,
                articleId: data.setting.articleId || "",
              }
            : item
        )
      );
      toast.success("Đã lưu cấu hình bài viết danh mục");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Lưu cấu hình thất bại");
    } finally {
      setSavingSlug(null);
    }
  };

  const saveVisibility = async (setting: CategorySetting, isVisible: boolean) => {
    const nextSetting = { ...setting, isVisible };
    updateLocalSetting(setting.categorySlug, { isVisible });
    await saveSetting(nextSetting);
  };

  const deleteArticle = async (article: CategoryArticle) => {
    const confirmed = window.confirm(`Xóa bài viết danh mục "${article.title}"?`);
    if (!confirmed) return;

    setDeletingId(article.id);
    try {
      await axios.delete(`/api/category-articles/${article.id}`);
      setArticles((prev) => prev.filter((item) => item.id !== article.id));
      setSettings((prev) =>
        prev.map((setting) =>
          setting.articleId === article.id
            ? { ...setting, articleType: "default", articleId: "", article: null, isVisible: false }
            : setting
        )
      );
      toast.success("Đã xóa bài viết danh mục");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Xóa bài viết thất bại");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout title="Bài viết danh mục">
      <div className="min-h-screen bg-[#f8fafc] p-6 space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="m-0 flex items-center gap-2 text-[1.375rem] font-bold text-[#0f172a]">
              <FileText className="h-5 w-5 text-[#105d97]" />
              Bài viết danh mục sản phẩm
            </h1>
            <p className="mt-1 text-sm text-[#64748b]">
              Bài viết danh mục là nội dung riêng, không liên quan tới module /dashboard/bai-viet.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard/danh-muc/them-bai-viet"
              className="inline-flex items-center gap-2 rounded-lg bg-[#16a34a] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#15803d]"
            >
              <Plus className="h-4 w-4" />
              Thêm bài danh mục
            </Link>
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#f1f5f9] disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Tải lại
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Khi tắt hiển thị, nội dung vẫn render ẩn bằng <span className="font-mono">sr-only</span>. Khi bật, nội dung sẽ xuất hiện dưới danh sách sản phẩm.
        </div>

        <div className="rounded-[10px] border border-[#e2e8f0] bg-white">
          <div className="grid grid-cols-1 gap-3 border-b border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 lg:grid-cols-[1.1fr_180px_1.6fr_110px_110px] lg:items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
              Danh mục
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
              Nguồn bài viết
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
              Bài viết danh mục
            </span>
            <span className="text-center text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
              Hiển thị
            </span>
            <span className="text-center text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
              Lưu
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="h-6 w-6 animate-spin text-[#105d97]" />
            </div>
          ) : (
            <div>
              {settings.map((setting) => {
                const isSaving = savingSlug === setting.categorySlug;
                const categoryArticles = articlesByCategory.get(setting.categorySlug) || [];
                const selectedArticle =
                  articles.find((article) => article.id === setting.articleId) || setting.article;
                const articleOptions =
                  selectedArticle && !categoryArticles.some((article) => article.id === selectedArticle.id)
                    ? [selectedArticle, ...categoryArticles]
                    : categoryArticles;

                return (
                  <div
                    key={setting.categorySlug}
                    className="grid grid-cols-1 gap-3 border-b border-[#f1f5f9] px-4 py-4 last:border-0 lg:grid-cols-[1.1fr_180px_1.6fr_110px_110px] lg:items-center"
                  >
                    <div>
                      <p className="font-semibold text-[#0f172a]">{setting.label}</p>
                      <Link
                        href={`/${setting.categorySlug}`}
                        target="_blank"
                        className="text-xs text-[#105d97] hover:underline"
                      >
                        /{setting.categorySlug}
                      </Link>
                    </div>

                    <select
                      value={setting.articleType}
                      onChange={(event) =>
                        updateLocalSetting(setting.categorySlug, {
                          articleType: event.target.value as "default" | "custom",
                        })
                      }
                      className="w-full rounded-md border border-[#cbd5e1] bg-white px-3 py-2 text-sm outline-none focus:border-[#105d97]"
                    >
                      <option value="default">Bài hardcode</option>
                      <option value="custom">Bài danh mục riêng</option>
                    </select>

                    <div>
                      <select
                        value={setting.articleId || ""}
                        disabled={setting.articleType !== "custom"}
                        onChange={(event) =>
                          updateLocalSetting(setting.categorySlug, {
                            articleId: event.target.value,
                          })
                        }
                        className="w-full rounded-md border border-[#cbd5e1] bg-white px-3 py-2 text-sm outline-none focus:border-[#105d97] disabled:cursor-not-allowed disabled:bg-[#f8fafc] disabled:text-[#94a3b8]"
                      >
                        <option value="">
                          {articleOptions.length ? "Chọn bài viết" : "Chưa có bài cho danh mục này"}
                        </option>
                        {articleOptions.map((article) => (
                          <option key={article.id} value={article.id}>
                            {article.title}
                          </option>
                        ))}
                      </select>
                      {setting.articleType === "custom" && selectedArticle && (
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#64748b]">
                          <span>Đang chọn: {selectedArticle.title}</span>
                          <Link
                            href={`/dashboard/danh-muc/update/${selectedArticle.id}`}
                            className="font-semibold text-[#105d97] hover:underline"
                          >
                            Sửa bài
                          </Link>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => saveVisibility(setting, !setting.isVisible)}
                      disabled={isSaving}
                      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
                        setting.isVisible
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {setting.isVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                      {setting.isVisible ? "Hiện" : "Ẩn"}
                    </button>

                    <button
                      onClick={() => saveSetting(setting)}
                      disabled={isSaving}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#105d97] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0d4a7a] disabled:opacity-60"
                    >
                      {isSaving ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Lưu
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-[10px] border border-[#e2e8f0] bg-white">
          <div className="flex flex-col gap-3 border-b border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 md:flex-row md:items-center md:justify-between">
            <h2 className="m-0 text-base font-bold text-[#0f172a]">Danh sách bài viết danh mục</h2>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm bài danh mục..."
              className="w-full rounded-md border border-[#cbd5e1] px-3 py-2 text-sm outline-none focus:border-[#105d97] md:w-80"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-[#105d97]" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#64748b]">
              Chưa có bài viết danh mục nào.
            </div>
          ) : (
            <div className="divide-y divide-[#f1f5f9]">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-[1fr_220px_130px] md:items-center"
                >
                  <div>
                    <p className="font-semibold text-[#0f172a]">{article.title}</p>
                    <p className="mt-1 text-xs text-[#64748b]">
                      {article.categorySlug}
                      {article.postAuthor?.name ? ` · ${article.postAuthor.name}` : ""}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/danh-muc/update/${article.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#cbd5e1] bg-white px-3 py-2 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#f1f5f9]"
                  >
                    <Pencil className="h-4 w-4" />
                    Sửa
                  </Link>
                  <button
                    onClick={() => deleteArticle(article)}
                    disabled={deletingId === article.id}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deletingId === article.id ? "Đang xóa..." : "Xóa"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoryArticlesDashboard;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session || !session.user || (session.user as { role?: string }).role !== "admin") {
    return {
      redirect: { destination: "/dang-nhap", permanent: false },
    };
  }

  return { props: {} };
}
