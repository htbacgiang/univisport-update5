import type { NextApiRequest, NextApiResponse } from "next";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import r2Client, { R2_BUCKET_NAME, getPublicUrl, isR2Configured, getUniqueR2Key } from "../../../lib/r2";
import { requireAdmin } from "../../../lib/adminAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  if (!(await requireAdmin(req, res))) return;

  if (!isR2Configured()) {
    return res.status(500).json({
      error: "Cấu hình Cloudflare R2 chưa đầy đủ. Vui lòng kiểm tra các biến môi trường R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME.",
    });
  }

  try {
    const { filename, contentType, folder } = req.body || {};

    if (!filename || typeof filename !== "string") {
      return res.status(400).json({ error: "Thiếu tên file (filename) hoặc không hợp lệ" });
    }

    const cleanFolder = (folder && typeof folder === "string" ? folder : "")
      .trim()
      .replace(/^\/+|\/+$/g, "");

    const key = await getUniqueR2Key(filename, cleanFolder);

    const safeContentType = contentType && typeof contentType === "string" ? contentType : "application/octet-stream";

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: safeContentType,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    const publicUrl = getPublicUrl(key);

    return res.status(200).json({
      uploadUrl,
      publicUrl,
      key,
    });
  } catch (error: any) {
    console.error("Lỗi tạo presigned URL upload R2:", error);
    return res.status(500).json({
      error: error?.message || "Lỗi máy chủ khi tạo presigned URL",
    });
  }
}
