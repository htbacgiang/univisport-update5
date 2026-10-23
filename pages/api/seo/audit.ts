import type { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";
import { buildSeoAuditPayload, findSeoAuditByUrl } from "../../../lib/seo-audit";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET });
  if (!token || token.role !== "admin") {
    return res.status(401).json({ error: "Bạn cần quyền admin để xem SEO Audit." });
  }

  try {
    const payload = await buildSeoAuditPayload();
    const requestedUrl = typeof req.query.url === "string" ? req.query.url : "";

    if (requestedUrl) {
      const audit = findSeoAuditByUrl(payload, requestedUrl);
      if (!audit) {
        return res.status(404).json({ error: "Không tìm thấy URL trong inventory SEO." });
      }
      return res.json({ generatedAt: payload.generatedAt, audit });
    }

    return res.json(payload);
  } catch (error: any) {
    console.error("SEO audit API error:", error);
    return res.status(500).json({ error: error.message || "Không thể chạy SEO Audit." });
  }
};

export default handler;
