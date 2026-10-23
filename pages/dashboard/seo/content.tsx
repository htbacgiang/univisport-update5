import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpDown, FileSearch, Search } from "lucide-react";
import AdminLayout from "../../../components/layout/AdminLayout";
import { SeoPageHeader } from "../../../components/seo/SeoPageHeader";
import { SeoScoreBadge } from "../../../components/seo/SeoScoreBadge";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { buildSeoAuditPayload, SeoAuditPayload, SeoAuditResult, SeoContentInventoryItem } from "../../../lib/seo-audit";

interface SeoContentPageProps {
  payload: SeoAuditPayload;
}

type SortKey = "seoScore" | "title" | "updatedAt" | "type";
type SortDirection = "asc" | "desc";

const typeLabel: Record<SeoContentInventoryItem["type"], string> = {
  post: "Blog",
  product: "Product",
};

const getContentStatus = (item: SeoContentInventoryItem) => (item.seoScore < 70 ? "Need Update" : "Published");

export default function SeoContentPage({ payload }: SeoContentPageProps) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("seoScore");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedId, setSelectedId] = useState(payload.inventory[0]?.id || "");

  const categories = useMemo(
    () => Array.from(new Set(payload.inventory.map((item) => item.category).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [payload.inventory]
  );

  const auditById = useMemo(() => {
    const map = new Map<string, SeoAuditResult>();
    payload.audits.forEach((audit) => map.set(audit.id, audit));
    return map;
  }, [payload.audits]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const items = payload.inventory.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.url.toLowerCase().includes(normalizedQuery) ||
        item.primaryKeyword.toLowerCase().includes(normalizedQuery) ||
        item.author.toLowerCase().includes(normalizedQuery);
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesScore =
        scoreFilter === "all" ||
        (scoreFilter === "good" && item.seoScore >= 85) ||
        (scoreFilter === "medium" && item.seoScore >= 70 && item.seoScore < 85) ||
        (scoreFilter === "low" && item.seoScore < 70);

      return matchesQuery && matchesType && matchesCategory && matchesScore;
    });

    return [...items].sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortKey === "seoScore") return (a.seoScore - b.seoScore) * direction;
      if (sortKey === "updatedAt") return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * direction;
      return String(a[sortKey]).localeCompare(String(b[sortKey])) * direction;
    });
  }, [categoryFilter, payload.inventory, query, scoreFilter, sortDirection, sortKey, typeFilter]);

  const selectedAudit = auditById.get(selectedId) || (filteredItems[0] ? auditById.get(filteredItems[0].id) : undefined);

  const updateSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection(key === "seoScore" ? "asc" : "desc");
  };

  return (
    <AdminLayout title="Content Inventory SEO">
      <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
        <div className="mx-auto max-w-7xl space-y-5">
          <SeoPageHeader
            icon={FileSearch}
            title="Content Inventory"
            description="Danh sách URL bài viết và sản phẩm đang được lấy trực tiếp từ MongoDB models của website, kèm điểm SEO Onpage và khuyến nghị tối ưu."
            generatedAt={payload.generatedAt}
          />

          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_150px_180px_160px_150px]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Tìm theo tiêu đề, URL, keyword, tác giả..."
                    className="pl-9"
                  />
                </div>
                <Select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                  <option value="all">Tất cả loại</option>
                  <option value="post">Blog</option>
                  <option value="product">Product</option>
                </Select>
                <Select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                  <option value="all">Tất cả category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
                <Select value={scoreFilter} onChange={(event) => setScoreFilter(event.target.value)}>
                  <option value="all">Tất cả điểm</option>
                  <option value="good">85-100</option>
                  <option value="medium">70-84</option>
                  <option value="low">Dưới 70</option>
                </Select>
                <Select value={`${sortKey}:${sortDirection}`} onChange={(event) => {
                  const [key, direction] = event.target.value.split(":") as [SortKey, SortDirection];
                  setSortKey(key);
                  setSortDirection(direction);
                }}>
                  <option value="seoScore:asc">Điểm thấp trước</option>
                  <option value="seoScore:desc">Điểm cao trước</option>
                  <option value="updatedAt:desc">Mới cập nhật</option>
                  <option value="title:asc">A-Z</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>{filteredItems.length} URL</CardTitle>
                <Badge variant="secondary">{payload.inventory.length} tổng</Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1180px] text-left text-sm">
                    <thead className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.04em] text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                      <tr>
                        <th className="px-4 py-3">
                          <button className="inline-flex items-center gap-1" onClick={() => updateSort("title")}>
                            Tiêu đề <ArrowUpDown className="h-3.5 w-3.5" />
                          </button>
                        </th>
                        <th className="px-4 py-3">Slug</th>
                        <th className="px-4 py-3">
                          <button className="inline-flex items-center gap-1" onClick={() => updateSort("type")}>
                            Loại <ArrowUpDown className="h-3.5 w-3.5" />
                          </button>
                        </th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">
                          <button className="inline-flex items-center gap-1" onClick={() => updateSort("seoScore")}>
                            SEO Score <ArrowUpDown className="h-3.5 w-3.5" />
                          </button>
                        </th>
                        <th className="px-4 py-3">Traffic</th>
                        <th className="px-4 py-3">Ranking</th>
                        <th className="px-4 py-3">
                          <button className="inline-flex items-center gap-1" onClick={() => updateSort("updatedAt")}>
                            Ngày cập nhật <ArrowUpDown className="h-3.5 w-3.5" />
                          </button>
                        </th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Tác giả</th>
                        <th className="px-4 py-3">Keyword</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredItems.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedId(item.id)}
                          className={`cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-900 ${selectedAudit?.id === item.id ? "bg-blue-50/70 dark:bg-blue-950/20" : ""}`}
                        >
                          <td className="px-4 py-3">
                            <p className="line-clamp-2 font-semibold text-slate-950 dark:text-slate-100">{item.title}</p>
                            <p className="mt-1 text-xs text-slate-500">{item.category}</p>
                          </td>
                          <td className="px-4 py-3">
                            <Link href={item.path} className="text-xs text-[#105d97] hover:underline">
                              {item.path}
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="secondary">{typeLabel[item.type]}</Badge>
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.category}</td>
                          <td className="px-4 py-3">
                            <SeoScoreBadge score={item.seoScore} />
                          </td>
                          <td className="px-4 py-3 text-slate-500">Chưa tích hợp</td>
                          <td className="px-4 py-3 text-slate-500">Chưa tích hợp</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                            {new Date(item.updatedAt).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={getContentStatus(item) === "Need Update" ? "warning" : "success"}>{getContentStatus(item)}</Badge>
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.author}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.primaryKeyword || "Chưa có"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Actionable Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedAudit ? (
                  <div className="space-y-4">
                    <div>
                      <p className="line-clamp-2 text-sm font-semibold text-slate-950 dark:text-slate-100">{selectedAudit.title}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <SeoScoreBadge score={selectedAudit.seoScore} />
                        <Badge variant="secondary">{typeLabel[selectedAudit.type]}</Badge>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.04em] text-slate-500">Issues</p>
                      <div className="space-y-2">
                        {selectedAudit.issues.slice(0, 8).map((issue) => (
                          <div key={issue.message} className="rounded-md border border-slate-100 p-3 text-sm dark:border-slate-800">
                            <span className={issue.severity === "critical" ? "text-rose-600" : issue.severity === "warning" ? "text-amber-600" : "text-slate-500"}>
                              {issue.message}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.04em] text-slate-500">Suggestions</p>
                      <div className="space-y-2">
                        {selectedAudit.suggestions.slice(0, 8).map((suggestion) => (
                          <div key={suggestion} className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200">
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div className="rounded-md bg-slate-50 p-2 dark:bg-slate-900">Words: {selectedAudit.metrics.wordCount}</div>
                      <div className="rounded-md bg-slate-50 p-2 dark:bg-slate-900">Links: {selectedAudit.metrics.internalLinkCount}</div>
                      <div className="rounded-md bg-slate-50 p-2 dark:bg-slate-900">Images: {selectedAudit.metrics.imageCount}</div>
                      <div className="rounded-md bg-slate-50 p-2 dark:bg-slate-900">Entities: {selectedAudit.metrics.entityCount}</div>
                    </div>

                    <Link href={selectedAudit.path}>
                      <Button className="w-full">Mở URL</Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Không có URL phù hợp bộ lọc hiện tại.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session || !session.user || (session.user as { role?: string }).role !== "admin") {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  const payload = await buildSeoAuditPayload();

  return {
    props: {
      payload,
    },
  };
}
