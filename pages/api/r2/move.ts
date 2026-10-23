import type { NextApiRequest, NextApiResponse } from "next";
import { CopyObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import r2Client, { R2_BUCKET_NAME, isR2Configured, getPublicUrl, getUniqueR2Key } from "../../../lib/r2";
import { requireAdmin } from "../../../lib/adminAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  if (!(await requireAdmin(req, res))) return;

  if (!isR2Configured()) {
    return res.status(500).json({
      error: "Cấu hình Cloudflare R2 chưa đầy đủ. Vui lòng kiểm tra các biến môi trường R2.",
    });
  }

  try {
    const { key, targetFolder } = req.body || {};

    if (!key || typeof key !== "string") {
      return res.status(400).json({ error: "Thiếu thông tin key của ảnh cần di chuyển" });
    }

    const cleanSourceKey = key.trim().replace(/^\/+/, "");
    // targetFolder có thể là "" (thư mục gốc) hoặc tên thư mục
    const cleanTargetFolder = typeof targetFolder === "string"
      ? targetFolder.trim().replace(/^\/+|\/+$/g, "").toLowerCase()
      : "";

    // 1. Kiểm tra file nguồn có tồn tại trên R2 không
    try {
      await r2Client.send(
        new HeadObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: cleanSourceKey,
        })
      );
    } catch (err: any) {
      if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
        return res.status(404).json({ error: "Không tìm thấy file nguồn cần di chuyển trên R2" });
      }
      throw err;
    }

    // 2. Lấy tên file gốc
    const filename = cleanSourceKey.split("/").pop() || "";
    if (!filename) {
      return res.status(400).json({ error: "Tên file không hợp lệ" });
    }

    // 3. Tính destination key (dùng getUniqueR2Key để tránh ghi đè nếu thư mục đích đã có file trùng tên)
    const newKey = await getUniqueR2Key(filename, cleanTargetFolder);

    if (newKey === cleanSourceKey) {
      return res.status(200).json({
        message: "Ảnh đã ở trong thư mục này rồi",
        key: cleanSourceKey,
        url: getPublicUrl(cleanSourceKey),
      });
    }

    // 4. Copy sang vị trí mới
    const copySource = `${R2_BUCKET_NAME}/${encodeURI(cleanSourceKey)}`;
    await r2Client.send(
      new CopyObjectCommand({
        Bucket: R2_BUCKET_NAME,
        CopySource: copySource,
        Key: newKey,
      })
    );

    // 5. Xóa file ở vị trí cũ
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: cleanSourceKey,
      })
    );

    return res.status(200).json({
      success: true,
      oldKey: cleanSourceKey,
      newKey,
      url: getPublicUrl(newKey),
      message: `Đã di chuyển ảnh sang "${cleanTargetFolder}" thành công!`,
    });
  } catch (err: any) {
    console.error("Lỗi khi di chuyển ảnh R2:", err);
    return res.status(500).json({
      error: err.message || "Không thể di chuyển ảnh giữa các thư mục",
    });
  }
}
