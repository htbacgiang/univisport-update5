import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { KeyRound, Search } from "lucide-react";
import AdminLayout from "../../../components/layout/AdminLayout";
import { SeoPageHeader } from "../../../components/seo/SeoPageHeader";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { buildSeoAuditPayload, SeoAuditPayload, SeoKeywordHubItem } from "../../../lib/seo-audit";

interface KeywordHubPageProps {
  payload: SeoAuditPayload;
}

const priorityVariant: Record<SeoKeywordHubItem["priority"], "danger" | "warning" | "success"> = {
  High: "danger",
  Medium: "warning",
  Low: "success",
};

const formatNullable = (value: number | null, suffix = "") => (value === null ? "Chưa tích hợp" : `${value.toLocaleString("vi-VN")}${suffix}`);

export default function KeywordHubPage({ payload }: KeywordHubPageProps) {
  const [query, setQuery] = useState("");
  const [intent, setIntent] = useState("all");
  const [priority, setPriority] = useState("all");

  const items = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return payload.keywordHub.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        item.keyword.toLowerCase().includes(normalizedQuery) ||
        item.landingUrl.toLowerCase().includes(normalizedQuery) ||
        item.pillar.toLowerCase().includes(normalizedQuery) ||
        item.cluster.toLowerCase().includes(normalizedQuery);
      const matchesIntent = intent === "all" || item.intent === intent;
      const matchesPriority = priority === "all" || item.priority === priority;
      return matchesQuery && matchesIntent && matchesPriority;
    });
  }, [intent, payload.keywordHub, priority, query]);

  return (
    <AdminLayout title="Keyword Hub SEO">
      <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
        <div className="mx-auto max-w-7xl space-y-5">
          <SeoPageHeader
            icon={KeyRound}
            title="Keyword Hub"
            description="Keyword được rút từ primary keyword thật của bài viết/sản phẩm. Volume, KD và ranking chỉ hiển thị khi có dữ liệu GSC/Ahrefs/Semrush/CSV thật."
            generatedAt={payload.generatedAt}
          />

          <Card>
            <CardContent className="grid grid-cols-1 gap-3 p-4 md:grid-cols-[1fr_180px_180px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm keyword, URL, pillar..." className="pl-9" />
              </div>
              <Select value={intent} onChange={(event) => setIntent(event.target.value)}>
                <option value="all">Tất cả Intent</option>
                <option value="Informational">Informational</option>
                <option value="Commercial">Commercial</option>
                <option value="Transactional">Transactional</option>
                <option value="Navigational">Navigational</option>
              </Select>
              <Select value={priority} onChange={(event) => setPriority(event.target.value)}>
                <option value="all">Tất cả Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>{items.length} keyword</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left text-sm">
                  <thead className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.04em] text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                    <tr>
                      <th className="px-4 py-3">Keyword</th>
                      <th className="px-4 py-3">Intent</th>
                      <th className="px-4 py-3 text-right">Volume</th>
                      <th className="px-4 py-3 text-right">KD</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3 text-right">Current Rank</th>
                      <th className="px-4 py-3 text-right">Target Rank</th>
                      <th className="px-4 py-3">Landing URL</th>
                      <th className="px-4 py-3">Pillar</th>
                      <th className="px-4 py-3">Cluster</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {items.map((item) => (
                      <tr key={`${item.keyword}-${item.landingUrl}`}>
                        <td className="px-4 py-3 font-semibold text-slate-950 dark:text-slate-100">{item.keyword}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary">{item.intent}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-500">{formatNullable(item.volume)}</td>
                        <td className="px-4 py-3 text-right text-slate-500">{formatNullable(item.keywordDifficulty)}</td>
                        <td className="px-4 py-3">
                          <Badge variant={priorityVariant[item.priority]}>{item.priority}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-500">{formatNullable(item.currentRank)}</td>
                        <td className="px-4 py-3 text-right text-slate-500">{formatNullable(item.targetRank)}</td>
                        <td className="px-4 py-3">
                          <Link href={item.landingUrl} className="text-[#105d97] hover:underline">
                            {item.landingUrl}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.pillar}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.cluster}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
    return { redirect: { destination: "/", permanent: false } };
  }

  return { props: { payload: await buildSeoAuditPayload() } };
}
