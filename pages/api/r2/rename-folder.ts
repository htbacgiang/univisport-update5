import type { NextApiRequest, NextApiResponse } from "next";
import {
  ListObjectsV2Command,
  CopyObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import r2Client, { R2_BUCKET_NAME, isR2Configured } from "../../../lib/r2";
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
    const { oldFolder, newFolder } = req.body || {};

    if (!oldFolder || typeof oldFolder !== "string" || !newFolder || typeof newFolder !== "string") {
      return res.status(400).json({ error: "Vui lòng cung cấp cả oldFolder và newFolder" });
    }

    const cleanOld = oldFolder.trim().replace(/^\/+|\/+$/g, "");
    
    // Chuẩn hóa tên mới, giữ nguyên cấu trúc thư mục cha nếu người dùng chỉ nhập tên con
    const newSegments = newFolder
      .split("/")
      .map((s) =>
        s
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
      )
      .filter(Boolean);

    let cleanNew = newSegments.join("/");

    if (cleanOld.includes("/") && !newFolder.includes("/")) {
      const parent = cleanOld.split("/").slice(0, -1).join("/");
      cleanNew = `${parent}/${cleanNew}`;
    }

    if (!cleanOld || !cleanNew) {
      return res.status(400).json({ error: "Tên thư mục không hợp lệ" });
    }

    if (cleanOld === cleanNew) {
      return res.status(200).json({ message: "Tên thư mục không thay đổi", folder: cleanNew });
    }

    const oldPrefix = `${cleanOld}/`;
    const newPrefix = `${cleanNew}/`;

    // 1. Quét tất cả các object có prefix là oldPrefix
    let continuationToken: string | undefined = undefined;
    const objectsToMove: string[] = [];

    do {
      const listCommand: ListObjectsV2Command = new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
        Prefix: oldPrefix,
        ContinuationToken: continuationToken,
      });

      const listRes = await r2Client.send(listCommand);
      if (listRes.Contents) {
        for (const item of listRes.Contents) {
          if (item.Key) objectsToMove.push(item.Key);
        }
      }
      continuationToken = listRes.NextContinuationToken;
    } while (continuationToken);

    // 2. Copy từng object sang prefix mới rồi xóa object cũ
    let copiedCount = 0;
    for (const oldKey of objectsToMove) {
      const remainingPath = oldKey.slice(oldPrefix.length);
      const newKey = `${newPrefix}${remainingPath}`;

      // encodeURI giữ nguyên dấu gạch chéo '/' cho S3 CopySource
      const copySource = `${R2_BUCKET_NAME}/${encodeURI(oldKey)}`;

      await r2Client.send(
        new CopyObjectCommand({
          Bucket: R2_BUCKET_NAME,
          CopySource: copySource,
          Key: newKey,
        })
      );

      await r2Client.send(
        new DeleteObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: oldKey,
        })
      );
      copiedCount++;
    }

    // 3. Nếu folder cũ rỗng (không có object nào bên trong), tạo marker cho folder mới
    if (objectsToMove.length === 0) {
      await r2Client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: newPrefix,
          Body: "",
        })
      );
      // Xóa marker cũ nếu có
      try {
        await r2Client.send(
          new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: oldPrefix,
          })
        );
      } catch {
        // bỏ qua nếu không tồn tại
      }
    }

    return res.status(200).json({
      message: `Đổi tên thư mục thành công (${copiedCount} đối tượng đã di chuyển)`,
      oldFolder: cleanOld,
      newFolder: cleanNew,
      movedCount: copiedCount,
    });
  } catch (error: any) {
    console.error("Lỗi đổi tên folder R2:", error);
    return res.status(500).json({
      error: error?.message || "Lỗi máy chủ khi đổi tên thư mục",
    });
  }
}
