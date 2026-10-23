import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CalendarDays,
  Database,
  FileSearch,
  FileText,
  GitBranch,
  Link2,
  Network,
  Package,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdminLayout from "../../../components/layout/AdminLayout";
import { SeoMetricCard } from "../../../components/seo/SeoMetricCard";
import { SeoPageHeader } from "../../../components/seo/SeoPageHeader";
import { SeoScoreBadge } from "../../../components/seo/SeoScoreBadge";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { buildSeoAuditPayload, SeoAuditPayload, SeoAuditResult } from "../../../lib/seo-audit";

interface SeoDashboardPageProps {
  payload: SeoAuditPayload;
}

type DateRange = "all" | "today" | "yesterday" | "7d" | "30d" | "90d" | "this_week" | "last_week" | "this_month" | "last_month" | "this_quarter" | "last_quarter" | "this_year" | "last_year";
type StatusFilter = "all" | "published" | "draft" | "review" | "need_update";

const COLORS = ["#ef4444", "#f59e0b", "#105d97", "#10b981", "#7c3aed", "#0f766e"];

const dateRangeOptions: { value: DateRange; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "today", label: "Hôm nay" },
  { value: "yesterday", label: "Hôm qua" },
  { value: "7d", label: "7 ngày" },
  { value: "30d", label: "30 ngày" },
  { value: "90d", label: "90 ngày" },
  { value: "this_week", label: "Tuần này" },
  { value: "last_week", label: "Tuần trước" },
  { value: "this_month", label: "Tháng này" },
  { value: "last_month", label: "Tháng trước" },
  { value: "this_quarter", label: "Quý này" },
  { value: "last_quarter", label: "Quý trước" },
  { value: "this_year", label: "Năm nay" },
  { value: "last_year", label: "Năm trước" },
];

const moduleMenu = [
  { label: "Overview", href: "/dashboard/seo", active: true },
  { label: "Content", href: "/dashboard/seo/content" },
  { label: "Keyword Hub", href: "/dashboard/seo/keyword-hub" },
  { label: "Topic Cluster", href: "/dashboard/seo/topical-map" },
  { label: "Topical Map", href: "/dashboard/seo/topical-map" },
  { label: "Entity", href: "/dashboard/seo/entities" },
  { label: "Internal Links", href: "/dashboard/seo/internal-links" },
  { label: "SEO Audit", href: "/dashboard/seo/content" },
];

const plannedModules = ["Technical SEO", "Ranking", "Traffic", "Reports", "Settings"];

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const daysAgo = (days: number) => {
  const date = startOfDay(new Date());
  date.setDate(date.getDate() - days);
  return date;
};

const getQuarter = (date: Date) => Math.floor(date.getMonth() / 3);

const isInDateRange = (value: string, range: DateRange): boolean => {
  if (range === "all") return true;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const today = startOfDay(new Date());
  const checked = startOfDay(date);

  if (range === "today") return checked.getTime() === today.getTime();
  if (range === "yesterday") return checked.getTime() === daysAgo(1).getTime();
  if (range === "7d") return checked >= daysAgo(7);
  if (range === "30d") return checked >= daysAgo(30);
  if (range === "90d") return checked >= daysAgo(90);

  const day = today.getDay() || 7;
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - day + 1);
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(thisWeekStart);
  lastWeekEnd.setDate(thisWeekStart.getDate() - 1);

  if (range === "this_week") return checked >= thisWeekStart;
  if (range === "last_week") return checked >= lastWeekStart && checked <= lastWeekEnd;
  if (range === "this_month") return checked.getFullYear() === today.getFullYear() && checked.getMonth() === today.getMonth();
  if (range === "last_month") {
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return checked.getFullYear() === lastMonth.getFullYear() && checked.getMonth() === lastMonth.getMonth();
  }
  if (range === "this_quarter") return checked.getFullYear() === today.getFullYear() && getQuarter(checked) === getQuarter(today);
  if (range === "last_quarter") {
    const currentQuarter = getQuarter(today);
    const targetQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
    const targetYear = currentQuarter === 0 ? today.getFullYear() - 1 : today.getFullYear();
    return checked.getFullYear() === targetYear && getQuarter(checked) === targetQuarter;
  }
  if (range === "this_year") return checked.getFullYear() === today.getFullYear();
  if (range === "last_year") return checked.getFullYear() === today.getFullYear() - 1;
  return true;
};

const getAuditStatus = (audit: SeoAuditResult): StatusFilter => {
  const updatedAt = new Date(audit.updatedAt);
  const stale = !Number.isNaN(updatedAt.getTime()) && updatedAt < daysAgo(180);
  return audit.seoScore < 70 || stale || audit.issues.some((issue) => issue.severity === "critical") ? "need_update" : "published";
};

const criterionPercent = (audit: SeoAuditResult, keys: string[]) => {
  const criteria = audit.criteria.filter((criterion) => keys.includes(criterion.key));
  const maxScore = criteria.reduce((total, criterion) => total + criterion.maxScore, 0);
  if (maxScore === 0) return 0;
  return Math.round((criteria.reduce((total, criterion) => total + criterion.score, 0) / maxScore) * 100);
};

const average = (values: number[]) => (values.length > 0 ? Math.round(values.reduce((total, value) => total + value, 0) / values.length) : 0);
const formatNumber = (value: number | null, suffix = "") => (value === null ? "Chưa tích hợp" : `${value.toLocaleString("vi-VN")}${suffix}`);

const buildScoreDistribution = (audits: SeoAuditResult[]) => {
  const buckets = [
    { range: "0-49", min: 0, max: 49, count: 0 },
    { range: "50-69", min: 50, max: 69, count: 0 },
    { range: "70-84", min: 70, max: 84, count: 0 },
    { range: "85-100", min: 85, max: 100, count: 0 },
  ];
  audits.forEach((audit) => {
    const bucket = buckets.find((item) => audit.seoScore >= item.min && audit.seoScore <= item.max);
    if (bucket) bucket.count += 1;
  });
  return buckets.map(({ range, count }) => ({ range, count }));
};

const buildContentGrowth = (audits: SeoAuditResult[]) => {
  const map = new Map<string, { month: string; posts: number; products: number; total: number }>();
  audits.forEach((audit) => {
    const date = new Date(audit.createdAt);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const current = map.get(month) || { month, posts: 0, products: 0, total: 0 };
    if (audit.type === "post") current.posts += 1;
    if (audit.type === "product") current.products += 1;
    current.total += 1;
    map.set(month, current);
  });
  return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month)).slice(-12);
};

export default function SeoDashboardPage({ payload }: SeoDashboardPageProps) {
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [contentType, setContentType] = useState("all");
  const [pillar, setPillar] = useState("all");
  const [author, setAuthor] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  const pillars = useMemo(() => Array.from(new Set(payload.audits.map((audit) => audit.category).filter(Boolean))).sort(), [payload.audits]);
  const authors = useMemo(() => Array.from(new Set(payload.audits.map((audit) => audit.author).filter(Boolean))).sort(), [payload.audits]);

  const filteredAudits = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return payload.audits.filter((audit) => {
      const matchesDate = isInDateRange(audit.updatedAt, dateRange);
      const matchesType = contentType === "all" || audit.type === contentType;
      const matchesPillar = pillar === "all" || audit.category === pillar;
      const matchesAuthor = author === "all" || audit.author === author;
      const auditStatus = getAuditStatus(audit);
      const matchesStatus = status === "all" || auditStatus === status;
      const matchesQuery =
        !normalizedQuery ||
        audit.title.toLowerCase().includes(normalizedQuery) ||
        audit.primaryKeyword.toLowerCase().includes(normalizedQuery) ||
        audit.path.toLowerCase().includes(normalizedQuery);
      return matchesDate && matchesType && matchesPillar && matchesAuthor && matchesStatus && matchesQuery;
    });
  }, [author, contentType, dateRange, payload.audits, pillar, query, status]);

  const filteredInventory = useMemo(
    () => payload.inventory.filter((item) => filteredAudits.some((audit) => audit.id === item.id)),
    [filteredAudits, payload.inventory]
  );

  const summary = useMemo(() => {
    const seoScore = average(filteredAudits.map((audit) => audit.seoScore));
    const technicalScore = average(filteredAudits.map((audit) => criterionPercent(audit, ["url", "heading", "images", "schema"])));
    const internalLinkScore = average(filteredAudits.map((audit) => criterionPercent(audit, ["internal_links"])));
    const entityCoverage = filteredAudits.length > 0 ? Math.round((filteredAudits.filter((audit) => audit.metrics.entityCount >= 5).length / filteredAudits.length) * 100) : 0;
    const topicalAuthority = average([entityCoverage, payload.dashboard.topicalCoverage, internalLinkScore].filter((value) => value > 0));
    return {
      totalUrls: filteredAudits.length,
      blog: filteredAudits.filter((audit) => audit.type === "post").length,
      products: filteredAudits.filter((audit) => audit.type === "product").length,
      categories: new Set(filteredAudits.map((audit) => audit.category).filter(Boolean)).size,
      seoScore,
      technicalScore,
      entityCoverage,
      internalLinkScore,
      topicalAuthority,
      internalLinks: filteredAudits.reduce((total, audit) => total + audit.metrics.internalLinkCount, 0),
    };
  }, [filteredAudits, payload.dashboard.topicalCoverage]);

  const scoreDistribution = useMemo(() => buildScoreDistribution(filteredAudits), [filteredAudits]);
  const contentGrowth = useMemo(() => buildContentGrowth(filteredAudits), [filteredAudits]);
  const topicCoverage = useMemo(() => {
    const counts = new Map<string, number>();
    filteredAudits.forEach((audit) => counts.set(audit.category, (counts.get(audit.category) || 0) + 1));
    return Array.from(counts.entries()).map(([topic, urls]) => ({ topic, coverage: Math.min(100, Math.round((urls / Math.max(1, filteredAudits.length)) * 100)), urls }));
  }, [filteredAudits]);

  const strongestUrls = [...filteredInventory].sort((a, b) => b.seoScore - a.seoScore).slice(0, 8);
  const urlsNeedOptimization = [...filteredInventory].sort((a, b) => a.seoScore - b.seoScore).slice(0, 10);
  const weakInternalLinks = payload.internalLinks.filter((link) => link.type !== "Strong").length;

  return (
    <AdminLayout title="SEO Intelligence Center">
      <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
        <div className="mx-auto max-w-7xl space-y-5">
          <SeoPageHeader
            icon={BarChart3}
            title="SEO Intelligence Center"
            description="Trung tâm quản lý Content, SEO Audit, Entity, Internal Links và Topical Authority từ dữ liệu thật của website Univi."
            generatedAt={payload.generatedAt}
          />

          <Card>
            <CardContent className="space-y-4 p-4">
              <div className="flex flex-wrap gap-2">
                {moduleMenu.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors ${
                      item.active ? "bg-[#105d97] text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                {plannedModules.map((item) => (
                  <span key={item} className="inline-flex h-9 items-center rounded-md border border-dashed border-slate-200 px-3 text-sm text-slate-400 dark:border-slate-700">
                    {item}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
                <Select value={dateRange} onChange={(event) => setDateRange(event.target.value as DateRange)}>
                  {dateRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <Select value={contentType} onChange={(event) => setContentType(event.target.value)}>
                  <option value="all">Tất cả nội dung</option>
                  <option value="post">Blog</option>
                  <option value="product">Product</option>
                  <option value="category">Category</option>
                  <option value="landing">Landing</option>
                  <option value="tag">Tag</option>
                </Select>
                <Select value={pillar} onChange={(event) => setPillar(event.target.value)}>
                  <option value="all">Tất cả Pillar</option>
                  {pillars.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select value={author} onChange={(event) => setAuthor(event.target.value)}>
                  <option value="all">Tất cả Author</option>
                  {authors.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="need_update">Need Update</option>
                </Select>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm URL, keyword..." className="pl-9" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SeoMetricCard icon={Database} title="Tổng URL" value={summary.totalUrls} hint="Theo bộ lọc hiện tại" />
            <SeoMetricCard icon={FileText} title="Blog" value={summary.blog} hint="Post đang public" />
            <SeoMetricCard icon={Package} title="Sản phẩm" value={summary.products} hint="Product trong MongoDB" />
            <SeoMetricCard icon={GitBranch} title="Danh mục" value={summary.categories} hint="Unique category từ dữ liệu thật" />
            <SeoMetricCard icon={FileSearch} title="Landing Page" value={payload.dashboard.totalLandingPages} hint="Chưa có nguồn landing page riêng" />
            <SeoMetricCard icon={CalendarDays} title="Đã Index" value={formatNumber(payload.dashboard.indexedUrls)} hint="Cần Search Console" />
            <SeoMetricCard icon={AlertTriangle} title="Chưa Index" value={formatNumber(payload.dashboard.notIndexedUrls)} hint="Cần Search Console" />
            <SeoMetricCard icon={Activity} title="SEO Score" value={`${summary.seoScore}/100`} hint="Trung bình URL đã lọc" />
            <SeoMetricCard icon={Sparkles} title="Technical Score" value={`${summary.technicalScore}/100`} hint="URL, heading, image, schema" />
            <SeoMetricCard icon={Sparkles} title="Entity Coverage" value={`${summary.entityCoverage}%`} hint={`${payload.entities.length} entity được nhận diện`} />
            <SeoMetricCard icon={Link2} title="Internal Link Score" value={`${summary.internalLinkScore}/100`} hint={`${weakInternalLinks} link cần review`} />
            <SeoMetricCard icon={Network} title="Topical Authority" value={`${summary.topicalAuthority}%`} hint="Entity + topical + internal link" />
            <SeoMetricCard icon={TrendingUp} title="Average Ranking" value={formatNumber(payload.dashboard.averageRanking)} hint="Cần GSC/Ahrefs/Semrush" />
            <SeoMetricCard icon={BarChart3} title="Organic Traffic" value={formatNumber(payload.dashboard.organicTraffic)} hint="Cần GA4 server-side report" />
            <SeoMetricCard icon={BarChart3} title="Clicks" value={formatNumber(payload.dashboard.clicks)} hint="Cần Search Console" />
            <SeoMetricCard icon={BarChart3} title="CTR / Impressions" value={payload.dashboard.ctr === null ? "Chưa tích hợp" : `${payload.dashboard.ctr}%`} hint={`Impressions: ${formatNumber(payload.dashboard.impressions)}`} />
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>SEO Score Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="range" stroke="#64748b" fontSize={12} />
                    <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
                    <Tooltip cursor={{ fill: "rgba(15,23,42,0.06)" }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {scoreDistribution.map((entry, index) => (
                        <Cell key={entry.range} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Growth</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={contentGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="posts" stroke="#105d97" strokeWidth={2} dot={false} name="Blog" />
                    <Line type="monotone" dataKey="products" stroke="#10b981" strokeWidth={2} dot={false} name="Product" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Topic Coverage</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={topicCoverage.slice(0, 6)} dataKey="coverage" nameKey="topic" innerRadius={56} outerRadius={92} paddingAngle={2}>
                      {topicCoverage.slice(0, 6).map((entry, index) => (
                        <Cell key={entry.topic} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Organic Traffic</CardTitle>
              </CardHeader>
              <CardContent className="flex h-52 items-center justify-center text-center text-sm text-slate-500">
                Chưa có GA4 server-side report. Không hiển thị dữ liệu giả.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ranking Distribution</CardTitle>
              </CardHeader>
              <CardContent className="flex h-52 items-center justify-center text-center text-sm text-slate-500">
                Cần Google Search Console, Ahrefs, Semrush hoặc CSV import.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Index Coverage</CardTitle>
              </CardHeader>
              <CardContent className="flex h-52 items-center justify-center text-center text-sm text-slate-500">
                Cần Search Console hoặc sitemap index report để phân loại Indexed, Submitted, No Index, Error.
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top URL mạnh nhất</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {strongestUrls.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-3 rounded-md border border-slate-100 p-3 dark:border-slate-800">
                      <div className="min-w-0">
                        <Link href={item.path} className="line-clamp-1 text-sm font-semibold text-slate-900 hover:text-[#105d97] dark:text-slate-100">
                          {item.title}
                        </Link>
                        <p className="mt-1 truncate text-xs text-slate-500">{item.primaryKeyword || item.category}</p>
                      </div>
                      <SeoScoreBadge score={item.seoScore} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  URL cần tối ưu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {urlsNeedOptimization.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-3 rounded-md border border-slate-100 p-3 dark:border-slate-800">
                      <div className="min-w-0">
                        <Link href={item.path} className="line-clamp-1 text-sm font-semibold text-slate-900 hover:text-[#105d97] dark:text-slate-100">
                          {item.title}
                        </Link>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <Badge variant="secondary">{item.type === "post" ? "Blog" : "Product"}</Badge>
                          <Badge variant="secondary">{item.category}</Badge>
                        </div>
                      </div>
                      <SeoScoreBadge score={item.seoScore} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Nguồn dữ liệu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                {payload.integrations.map((integration) => (
                  <div key={integration.source} className="rounded-md border border-slate-100 p-3 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{integration.source}</p>
                      <Badge variant={integration.configured ? "success" : "secondary"}>{integration.configured ? "Đã có" : "Chưa tích hợp"}</Badge>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{integration.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
