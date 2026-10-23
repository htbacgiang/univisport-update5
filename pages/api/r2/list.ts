import type { NextApiRequest, NextApiResponse } from "next";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import r2Client, { R2_BUCKET_NAME, getPublicUrl, isR2Configured } from "../../../lib/r2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  if (!isR2Configured()) {
    return res.status(500).json({
      error: "Cấu hình Cloudflare R2 chưa đầy đủ. Vui lòng kiểm tra các biến môi trường R2.",
    });
  }

  try {
    const folder = typeof req.query.folder === "string" ? req.query.folder.trim() : "";
    let prefix = "";

    if (folder && folder !== "all" && folder !== "/") {
      prefix = folder.replace(/^\/+/, "");
      if (!prefix.endsWith("/")) {
        prefix += "/";
      }
    }

    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: prefix || undefined,
      MaxKeys: 1000,
    });

    const response = await r2Client.send(command);

    const items = (response.Contents || [])
      .filter((item) => {
        if (!item.Key) return false;
        // Loại bỏ placeholder folder object (kết thúc bằng /)
        if (item.Key.endsWith("/")) return false;
        return true;
      })
      .map((item) => ({
        key: item.Key!,
        url: getPublicUrl(item.Key!),
        size: item.Size || 0,
        lastModified: item.LastModified ? item.LastModified.toISOString() : null,
      }))
      .sort((a, b) => {
        const timeA = a.lastModified ? new Date(a.lastModified).getTime() : 0;
        const timeB = b.lastModified ? new Date(b.lastModified).getTime() : 0;
        return timeB - timeA;
      });

    return res.status(200).json({ items });
  } catch (error: any) {
    console.error("Lỗi khi lấy danh sách ảnh R2:", error);
    return res.status(500).json({
      error: error?.message || "Lỗi máy chủ khi lấy danh sách ảnh",
    });
  }
}
