import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../utils/db";
import R2Gallery from "../../../models/R2Gallery";
import { requireAdmin } from "../../../lib/adminAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await db.connectDb();

  if (req.method === "GET") {
    try {
      const galleries = await R2Gallery.find({}).sort({ updatedAt: -1 }).lean();
      return res.status(200).json({ galleries });
    } catch (error: any) {
      console.error("Lỗi khi lấy danh sách album gallery:", error);
      return res.status(500).json({ error: error.message || "Lỗi khi lấy danh sách album" });
    }
  }

  if (req.method === "POST") {
    if (!(await requireAdmin(req, res))) return;
    try {
      const { title, description, images } = req.body || {};

      if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ error: "Tiêu đề Album không được để trống" });
      }

      if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ error: "Album phải có ít nhất 1 hình ảnh" });
      }

      const validImages = images
        .filter((img) => img && typeof img.src === "string" && img.src.trim())
        .map((img) => ({
          src: img.src.trim(),
          altText: typeof img.altText === "string" ? img.altText.trim() : "",
          width: Number(img.width) > 0 ? Number(img.width) : 4,
          height: Number(img.height) > 0 ? Number(img.height) : 3,
          ratioMode: img.ratioMode || "auto",
        }));

      if (validImages.length === 0) {
        return res.status(400).json({ error: "Không tìm thấy ảnh hợp lệ trong album" });
      }

      const gallery = await R2Gallery.create({
        title: title.trim(),
        description: typeof description === "string" ? description.trim() : "",
        images: validImages,
      });

      return res.status(201).json({ gallery });
    } catch (error: any) {
      console.error("Lỗi khi tạo album gallery mới:", error);
      return res.status(500).json({ error: error.message || "Lỗi khi tạo album gallery" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
