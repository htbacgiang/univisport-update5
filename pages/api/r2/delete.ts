import type { NextApiRequest, NextApiResponse } from "next";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import r2Client, { R2_BUCKET_NAME, isR2Configured } from "../../../lib/r2";
import { requireAdmin } from "../../../lib/adminAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE" && req.method !== "POST") {
    res.setHeader("Allow", ["DELETE", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  if (!(await requireAdmin(req, res))) return;

  if (!isR2Configured()) {
    return res.status(500).json({
      error: "Cấu hình Cloudflare R2 chưa đầy đủ. Vui lòng kiểm tra các biến môi trường R2.",
    });
  }

  try {
    const key = (req.body?.key || req.query.key) as string | undefined;

    if (!key || typeof key !== "string") {
      return res.status(400).json({ error: "Thiếu thông tin key của object cần xóa" });
    }

    const cleanKey = key.trim();

    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: cleanKey,
      })
    );

    return res.status(200).json({
      message: "Xóa ảnh thành công",
      key: cleanKey,
    });
  } catch (error: any) {
    console.error("Lỗi khi xóa object R2:", error);
    return res.status(500).json({
      error: error?.message || "Lỗi máy chủ khi xóa ảnh",
    });
  }
}
