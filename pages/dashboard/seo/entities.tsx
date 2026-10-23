import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { Sparkles, Search } from "lucide-react";
import AdminLayout from "../../../components/layout/AdminLayout";
import { SeoPageHeader } from "../../../components/seo/SeoPageHeader";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { buildSeoAuditPayload, SeoAuditPayload } from "../../../lib/seo-audit";

interface EntityPageProps {
  payload: SeoAuditPayload;
}

export default function EntityPage({ payload }: EntityPageProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const totalUrls = payload.audits.length;
  const types = useMemo(() => Array.from(new Set(payload.entities.map((entity) => entity.type))).sort(), [payload.entities]);

  const entities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return payload.entities.filter((entity) => {
      const matchesQuery = !normalizedQuery || entity.entity.toLowerCase().includes(normalizedQuery);
      const matchesType = type === "all" || entity.type === type;
      return matchesQuery && matchesType;
    });
  }, [payload.entities, query, type]);

  return (
    <AdminLayout title="Entity SEO">
      <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
        <div className="mx-auto max-w-7xl space-y-5">
          <SeoPageHeader
            icon={Sparkles}
            title="Entity"
            description="Entity được nhận diện bằng dictionary SEO riêng của Univi, không dùng split text hay keyword frequency tự do."
            generatedAt={payload.generatedAt}
          />

          <Card>
            <CardContent className="grid grid-cols-1 gap-3 p-4 md:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm entity..." className="pl-9" />
              </div>
              <Select value={type} onChange={(event) => setType(event.target.value)}>
                <option value="all">Tất cả Type</option>
                {types.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>{entities.length} entity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.04em] text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                    <tr>
                      <th className="px-4 py-3">Entity</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3 text-right">Frequency</th>
                      <th className="px-4 py-3 text-right">Coverage</th>
                      <th className="px-4 py-3 text-right">Missing URL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {entities.map((entity) => {
                      const coverage = totalUrls > 0 ? Math.round((entity.urlCount / totalUrls) * 100) : 0;
                      return (
                        <tr key={entity.entity}>
                          <td className="px-4 py-3 font-semibold text-slate-950 dark:text-slate-100">{entity.entity}</td>
                          <td className="px-4 py-3">
                            <Badge variant="secondary">{entity.type}</Badge>
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums text-slate-600 dark:text-slate-300">{entity.frequency}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-slate-600 dark:text-slate-300">{coverage}%</td>
                          <td className="px-4 py-3 text-right tabular-nums text-slate-600 dark:text-slate-300">{Math.max(0, totalUrls - entity.urlCount)}</td>
                        </tr>
                      );
                    })}
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
