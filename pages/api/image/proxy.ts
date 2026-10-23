import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Tham số 'url' là bắt buộc" });
  }

  // Chặn các URL nội bộ không an toàn (Chống SSRF)
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return res.status(400).json({ error: "Giao thức URL không hợp lệ" });
    }

    const host = parsed.hostname.toLowerCase();
    const isPrivate =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host === "::1" ||
      host === "169.254.169.254" || // Cloud metadata
      host.endsWith(".local") ||
      host.endsWith(".internal") ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host);

    if (isPrivate) {
      return res.status(403).json({ error: "Truy cập tài nguyên nội bộ bị từ chối" });
    }
  } catch {
    return res.status(400).json({ error: "URL không hợp lệ" });
  }

  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) UnivisportImageProxy",
      },
    });

    const contentType = response.headers["content-type"] || "";
    if (!contentType.startsWith("image/")) {
      return res.status(400).json({ error: "Tài nguyên không phải là hình ảnh hợp lệ" });
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");

    return res.status(200).send(Buffer.from(response.data));
  } catch (error: any) {
    console.error("Lỗi proxy hình ảnh:", error?.message || error);
    return res.status(502).json({ error: "Không thể tải hình ảnh từ URL nguồn" });
  }
}
