import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { GitBranch, Network, Search, Sparkles } from "lucide-react";
import AdminLayout from "../../../components/layout/AdminLayout";
import { SeoMetricCard } from "../../../components/seo/SeoMetricCard";
import { SeoPageHeader } from "../../../components/seo/SeoPageHeader";
import { SeoScoreBadge } from "../../../components/seo/SeoScoreBadge";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { buildSeoAuditPayload, SeoAuditPayload } from "../../../lib/seo-audit";

interface TopicalMapPageProps {
  payload: SeoAuditPayload;
}

function CoverageBar({ value }: { value: number }) {
  const color = value >= 85 ? "bg-emerald-500" : value >= 60 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export default function TopicalMapPage({ payload }: TopicalMapPageProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredPillars = useMemo(() => {
    if (!normalizedQuery) return payload.topicalMap;
    return payload.topicalMap
      .map((pillar) => ({
        ...pillar,
        clusters: pillar.clusters.filter((cluster) =>
          `${pillar.name} ${cluster.name} ${cluster.urls.map((url) => url.title).join(" ")}`
            .toLowerCase()
            .includes(normalizedQuery)
        ),
      }))
      .filter((pillar) => pillar.name.toLowerCase().includes(normalizedQuery) || pillar.clusters.length > 0);
  }, [normalizedQuery, payload.topicalMap]);

  const totalCurrent = payload.topicalMap.reduce((total, pillar) => total + pillar.currentUrlCount, 0);
  const totalTarget = payload.topicalMap.reduce((total, pillar) => total + pillar.targetUrlCount, 0);
  const totalCoverage = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

  return (
    <AdminLayout title="Topical Map SEO">
      <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
        <div className="mx-auto max-w-7xl space-y-5">
          <SeoPageHeader
            icon={Network}
            title="Topical Map"
            description="Tự động nhóm URL theo category, product, blog và topic. Coverage được tính từ số URL hiện có chia cho số URL mục tiêu suy ra từ entity/topic signals trong dữ liệu thật."
            generatedAt={payload.generatedAt}
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <SeoMetricCard icon={GitBranch} title="Pillar" value={payload.topicalMap.length} hint="Nhóm chủ đề cấp cao" />
            <SeoMetricCard icon={Network} title="Cluster" value={payload.topicalMap.reduce((total, pillar) => total + pillar.clusters.length, 0)} hint="Cụm nội dung tự động" />
            <SeoMetricCard icon={Sparkles} title="Coverage" value={`${totalCoverage}%`} hint={`${totalCurrent}/${totalTarget} URL mục tiêu`} />
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="relative max-w-xl">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Tìm pillar, cluster hoặc URL..."
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {filteredPillars.map((pillar) => (
                <Card key={pillar.key}>
                  <CardHeader>
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <GitBranch className="h-4 w-4 text-[#105d97]" />
                          {pillar.name}
                        </CardTitle>
                        <p className="mt-2 text-sm text-slate-500">
                          Coverage = {pillar.currentUrlCount}/{pillar.targetUrlCount} URL mục tiêu
                        </p>
                      </div>
                      <div className="min-w-[160px]">
                        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                          <span>Coverage</span>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{pillar.coverageScore}%</span>
                        </div>
                        <CoverageBar value={pillar.coverageScore} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pillar.clusters.map((cluster) => (
                        <div key={`${pillar.key}-${cluster.name}`} className="border-l-2 border-slate-200 pl-4 dark:border-slate-800">
                          <div className="rounded-lg border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                              <div>
                                <p className="font-semibold text-slate-950 dark:text-slate-100">{cluster.name}</p>
                                <p className="mt-1 text-xs text-slate-500">
                                  Coverage = {cluster.currentUrlCount}/{cluster.targetUrlCount}
                                </p>
                              </div>
                              <div className="flex min-w-[220px] items-center gap-3">
                                <CoverageBar value={cluster.coverageScore} />
                                <Badge variant={cluster.coverageScore >= 85 ? "success" : cluster.coverageScore >= 60 ? "warning" : "danger"}>
                                  {cluster.coverageScore}%
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-3 space-y-2">
                              {cluster.urls.map((url) => (
                                <div key={url.url} className="flex items-start justify-between gap-3 rounded-md bg-slate-50 p-2 dark:bg-slate-900">
                                  <div className="min-w-0">
                                    <Link href={new URL(url.url).pathname} className="line-clamp-1 text-sm font-medium text-slate-900 hover:text-[#105d97] dark:text-slate-100">
                                      {url.title}
                                    </Link>
                                    <p className="mt-1 text-xs text-slate-500">{url.type === "post" ? "Blog" : "Product"}</p>
                                  </div>
                                  <SeoScoreBadge score={url.seoScore} />
                                </div>
                              ))}
                            </div>
                            {cluster.opportunities.length > 0 && (
                              <div className="mt-3 rounded-md bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-400/10 dark:text-amber-200">
                                {cluster.opportunities[0]}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {pillar.opportunities.length > 0 && (
                      <div className="mt-4 rounded-lg border border-dashed border-slate-200 p-3 dark:border-slate-700">
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.04em] text-slate-500">Opportunity</p>
                        <div className="flex flex-wrap gap-2">
                          {pillar.opportunities.slice(0, 5).map((opportunity) => (
                            <Badge key={opportunity} variant="warning">
                              {opportunity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Entity Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border border-slate-100 dark:border-slate-800">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-[0.04em] text-slate-500 dark:bg-slate-900">
                      <tr>
                        <th className="px-3 py-2">Entity</th>
                        <th className="px-3 py-2">Type</th>
                        <th className="px-3 py-2 text-right">Frequency</th>
                        <th className="px-3 py-2 text-right">URL Count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {payload.entities.slice(0, 30).map((entity) => (
                        <tr key={entity.entity}>
                          <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{entity.entity}</td>
                          <td className="px-3 py-2">
                            <Badge variant="secondary">{entity.type}</Badge>
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums text-slate-600 dark:text-slate-300">{entity.frequency}</td>
                          <td className="px-3 py-2 text-right tabular-nums text-slate-600 dark:text-slate-300">{entity.urlCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
