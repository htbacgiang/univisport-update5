import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Link2, Search } from "lucide-react";
import AdminLayout from "../../../components/layout/AdminLayout";
import { SeoPageHeader } from "../../../components/seo/SeoPageHeader";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { buildSeoAuditPayload, SeoAuditPayload, SeoInternalLinkMetric } from "../../../lib/seo-audit";

interface InternalLinksPageProps {
  payload: SeoAuditPayload;
}

const typeVariant: Record<SeoInternalLinkMetric["type"], "success" | "warning" | "danger" | "secondary"> = {
  Strong: "success",
  "Weak Link": "warning",
  Orphan: "danger",
  "Too Many Links": "warning",
};

export default function InternalLinksPage({ payload }: InternalLinksPageProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");

  const rows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return payload.internalLinks.filter((row) => {
      const matchesQuery =
        !normalizedQuery ||
        row.sourcePath.toLowerCase().includes(normalizedQuery) ||
        row.targetPath.toLowerCase().includes(normalizedQuery) ||
        row.anchor.toLowerCase().includes(normalizedQuery);
      const matchesType = type === "all" || row.type === type;
      const matchesStatus = status === "all" || row.status === status;
      return matchesQuery && matchesType && matchesStatus;
    });
  }, [payload.internalLinks, query, status, type]);

  return (
    <AdminLayout title="Internal Links SEO">
      <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
        <div className="mx-auto max-w-7xl space-y-5">
          <SeoPageHeader
            icon={Link2}
            title="Internal Links"
            description="Phân tích internal link từ HTML content thật. Broken link cần crawler riêng nên hiện không bị suy đoán bằng dữ liệu giả."
            generatedAt={payload.generatedAt}
          />

          <Card>
            <CardContent className="grid grid-cols-1 gap-3 p-4 md:grid-cols-[1fr_180px_180px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm source, target, anchor..." className="pl-9" />
              </div>
              <Select value={type} onChange={(event) => setType(event.target.value)}>
                <option value="all">Tất cả Type</option>
                <option value="Strong">Strong</option>
                <option value="Weak Link">Weak Link</option>
                <option value="Orphan">Orphan</option>
                <option value="Too Many Links">Too Many Links</option>
              </Select>
              <Select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="all">Tất cả Status</option>
                <option value="Detected">Detected</option>
                <option value="Review">Review</option>
                <option value="Orphan">Orphan</option>
              </Select>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>{rows.length} internal link signal</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-left text-sm">
                  <thead className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.04em] text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                    <tr>
                      <th className="px-4 py-3">Source URL</th>
                      <th className="px-4 py-3">Target URL</th>
                      <th className="px-4 py-3">Anchor</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {rows.map((row, index) => (
                      <tr key={`${row.sourcePath}-${row.targetPath}-${index}`}>
                        <td className="px-4 py-3">
                          {row.sourcePath ? (
                            <Link href={row.sourcePath} className="text-[#105d97] hover:underline">
                              {row.sourcePath}
                            </Link>
                          ) : (
                            <span className="text-slate-400">Không có source</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Link href={row.targetPath} className="text-[#105d97] hover:underline">
                            {row.targetPath}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.anchor || "Chưa có anchor"}</td>
                        <td className="px-4 py-3">
                          <Badge variant={typeVariant[row.type]}>{row.type}</Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.status}</td>
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
