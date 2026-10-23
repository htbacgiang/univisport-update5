import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import type { GetServerSidePropsContext } from "next";
import {
  BarChart2,
  Clock,
  Eye,
  Users,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import AdminLayout from "../../../components/layout/AdminLayout";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface TopPage {
  _id: string;
  views: number;
  avgDuration: number;
  title: string;
}

interface DailyView {
  _id: string; // YYYY-MM-DD
  views: number;
}

interface RecentView {
  _id: string;
  path: string;
  title: string;
  duration: number;
  createdAt: string;
  sessionId: string;
}

interface Stats {
  totalToday: number;
  total7d: number;
  total30d: number;
  uniqueSessions30d: number;
  avgDuration30d: number;
  topPages: TopPage[];
  dailyViews: DailyView[];
  recentViews: RecentView[];
}

function formatDuration(seconds: number) {
  if (!seconds || seconds <= 0) return "—";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}p ${s}s` : `${m}p`;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Điền đủ 7 ngày gần nhất kể cả ngày chưa có dữ liệu
function buildDailyData(dailyViews: DailyView[]) {
  const labels: string[] = [];
  const data: number[] = [];
  const today = new Date();
  const map = Object.fromEntries(dailyViews.map((d) => [d._id, d.views]));

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    labels.push(label);
    data.push(map[key] ?? 0);
  }
  return { labels, data };
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = () => {
    setLoading(true);
    setError("");
    fetch("/api/analytics/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setStats(data);
      })
      .catch(() => setError("Không thể tải dữ liệu"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const chartData = stats ? buildDailyData(stats.dailyViews) : null;

  return (
    <AdminLayout title="Phân tích người dùng">
      <div className="min-h-screen space-y-5 bg-[#f8fafc] p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BarChart2 className="h-5 w-5 shrink-0 text-[#105d97]" />
            <h1 className="m-0 text-[1.375rem] font-bold text-[#0f172a]">
              Phân tích người dùng
            </h1>
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-sm font-medium text-[#64748b] hover:border-[#105d97] hover:text-[#105d97] disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: "Hôm nay",
              value: stats?.totalToday ?? "—",
              icon: Eye,
              color: "#105d97",
              bg: "#f0f7ff",
            },
            {
              label: "7 ngày qua",
              value: stats?.total7d ?? "—",
              icon: TrendingUp,
              color: "#16a34a",
              bg: "#f0fdf4",
            },
            {
              label: "Sessions (30 ngày)",
              value: stats?.uniqueSessions30d ?? "—",
              icon: Users,
              color: "#7c3aed",
              bg: "#faf5ff",
            },
            {
              label: "TG trung bình/trang",
              value: stats ? formatDuration(stats.avgDuration30d) : "—",
              icon: Clock,
              color: "#d97706",
              bg: "#fffbeb",
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="rounded-[10px] border border-[#e2e8f0] bg-white p-5"
            >
              <div
                className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ background: bg }}
              >
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
              <p className="text-2xl font-bold text-[#0f172a]">
                {loading ? (
                  <span className="inline-block h-7 w-12 animate-pulse rounded bg-gray-100" />
                ) : (
                  value.toLocaleString()
                )}
              </p>
              <p className="mt-0.5 text-xs text-[#64748b]">{label}</p>
            </div>
          ))}
        </div>

        {/* Chart + Top pages */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Chart: lượt xem 7 ngày */}
          <div className="rounded-[10px] border border-[#e2e8f0] bg-white p-5">
            <p className="mb-4 text-sm font-semibold text-[#0f172a]">
              Lượt xem theo ngày (7 ngày qua)
            </p>
            {loading || !chartData ? (
              <div className="flex h-48 items-center justify-center">
                <RefreshCw className="h-5 w-5 animate-spin text-gray-300" />
              </div>
            ) : (
              <Bar
                data={{
                  labels: chartData.labels,
                  datasets: [
                    {
                      label: "Lượt xem",
                      data: chartData.data,
                      backgroundColor: "#105d97cc",
                      borderRadius: 4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 1, precision: 0 },
                      grid: { color: "#f1f5f9" },
                    },
                    x: { grid: { display: false } },
                  },
                }}
              />
            )}
          </div>

          {/* Top pages */}
          <div className="rounded-[10px] border border-[#e2e8f0] bg-white p-5">
            <p className="mb-4 text-sm font-semibold text-[#0f172a]">
              Top trang được xem nhiều (30 ngày)
            </p>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 animate-pulse rounded bg-gray-100" />
                ))}
              </div>
            ) : !stats?.topPages?.length ? (
              <p className="text-sm text-gray-400">Chưa có dữ liệu</p>
            ) : (
              <div className="space-y-2">
                {stats.topPages.map((p, idx) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-[#f8fafc] px-3 py-2 text-sm"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="shrink-0 font-bold text-[#94a3b8]">
                        {idx + 1}
                      </span>
                      <span
                        className="truncate text-[#0f172a]"
                        title={p._id}
                      >
                        {p._id}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 text-xs text-[#64748b]">
                      <span>{p.views} lượt</span>
                      <span>{formatDuration(Math.round(p.avgDuration))} TB</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent visits */}
        <div className="rounded-[10px] border border-[#e2e8f0] bg-white p-5">
          <p className="mb-4 text-sm font-semibold text-[#0f172a]">
            Lượt xem gần đây
          </p>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-gray-100" />
              ))}
            </div>
          ) : !stats?.recentViews?.length ? (
            <p className="text-sm text-gray-400">Chưa có dữ liệu</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9] text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">
                    <th className="pb-2 text-left">Trang</th>
                    <th className="pb-2 text-left">Thời gian</th>
                    <th className="pb-2 text-right">Ở lại</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentViews.map((v) => (
                    <tr
                      key={v._id}
                      className="border-b border-[#f8fafc] last:border-0"
                    >
                      <td className="py-2 pr-4">
                        <span
                          className="block max-w-xs truncate text-[#0f172a]"
                          title={v.path}
                        >
                          {v.path}
                        </span>
                        {v.title && (
                          <span className="text-xs text-[#94a3b8]">{v.title}</span>
                        )}
                      </td>
                      <td className="py-2 pr-4 text-[#64748b]">
                        {formatTime(v.createdAt)}
                      </td>
                      <td className="py-2 text-right font-medium text-[#0f172a]">
                        {formatDuration(v.duration)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (
    !session ||
    !session.user ||
    (session.user as { role?: string }).role !== "admin"
  ) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return { props: {} };
}
