import type { NextApiRequest, NextApiResponse } from "next";
import { ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import r2Client, { R2_BUCKET_NAME, isR2Configured } from "../../../lib/r2";

const sanitizeSegment = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isR2Configured()) {
    return res.status(500).json({
      error: "Cấu hình Cloudflare R2 chưa đầy đủ. Vui lòng kiểm tra các biến môi trường R2.",
    });
  }

  if (req.method === "GET") {
    try {
      // Quét toàn bộ object trong bucket để tìm các thư mục và thư mục con
      let continuationToken: string | undefined = undefined;
      const folderSet = new Set<string>();

      do {
        const command: ListObjectsV2Command = new ListObjectsV2Command({
          Bucket: R2_BUCKET_NAME,
          ContinuationToken: continuationToken,
          MaxKeys: 1000,
        });

        const response = await r2Client.send(command);

        if (response.Contents) {
          response.Contents.forEach((c) => {
            if (c.Key && c.Key.includes("/")) {
              const isFolderMarker = c.Key.endsWith("/");
              const parts = c.Key.split("/").filter(Boolean);
              // Nếu là marker folder, toàn bộ parts là folder path.
              // Nếu là file, bỏ phần tử cuối cùng (filename).
              const folderParts = isFolderMarker ? parts : parts.slice(0, -1);

              let currentPath = "";
              for (const part of folderParts) {
                currentPath = currentPath ? `${currentPath}/${part}` : part;
                folderSet.add(currentPath);
              }
            }
          });
        }

        continuationToken = response.NextContinuationToken;
      } while (continuationToken);

      const folders = Array.from(folderSet).sort((a, b) => a.localeCompare(b));
      return res.status(200).json({ folders });
    } catch (error: any) {
      console.error("Lỗi khi lấy danh sách folder R2:", error);
      return res.status(500).json({
        error: error?.message || "Lỗi máy chủ khi lấy danh sách thư mục",
      });
    }
  }

  if (req.method === "POST") {
    try {
      const { folder, parentFolder } = req.body || {};

      if (!folder || typeof folder !== "string") {
        return res.status(400).json({ error: "Tên thư mục không được để trống" });
      }

      // Chuẩn hóa từng segment của folder (cho phép dấu / để phân tách thư mục con)
      const folderSegments = folder.split("/").map(sanitizeSegment).filter(Boolean);
      let cleanFolder = folderSegments.join("/");

      // Nếu có parentFolder, ghép vào phía trước nếu chưa có
      if (parentFolder && typeof parentFolder === "string") {
        const parentSegments = parentFolder.split("/").map(sanitizeSegment).filter(Boolean);
        const cleanParent = parentSegments.join("/");
        if (cleanParent && !cleanFolder.startsWith(`${cleanParent}/`)) {
          cleanFolder = `${cleanParent}/${cleanFolder}`;
        }
      }

      if (!cleanFolder) {
        return res.status(400).json({ error: "Tên thư mục không hợp lệ" });
      }

      const folderKey = `${cleanFolder}/`;

      // Upload object rỗng để đánh dấu folder trên Cloudflare R2
      await r2Client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: folderKey,
          Body: "",
        })
      );

      return res.status(201).json({
        message: "Tạo thư mục thành công",
        folder: cleanFolder,
      });
    } catch (error: any) {
      console.error("Lỗi khi tạo folder R2:", error);
      return res.status(500).json({
        error: error?.message || "Lỗi máy chủ khi tạo thư mục",
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
