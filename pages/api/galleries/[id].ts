import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../utils/db";
import R2Gallery from "../../../models/R2Gallery";
import { requireAdmin } from "../../../lib/adminAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    if (!(await requireAdmin(req, res))) return;
  }

  await db.connectDb();
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID album không hợp lệ" });
  }

  if (req.method === "GET") {
    try {
      const gallery = await R2Gallery.findById(id).lean();
      if (!gallery) return res.status(404).json({ error: "Không tìm thấy album" });
      return res.status(200).json({ gallery });
    } catch (error: any) {
      console.error("Lỗi khi lấy thông tin album:", error);
      return res.status(500).json({ error: error.message || "Lỗi khi lấy thông tin album" });
    }
  }

  if (req.method === "PUT" || req.method === "PATCH") {
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

      const gallery = await R2Gallery.findByIdAndUpdate(
        id,
        {
          title: title.trim(),
          description: typeof description === "string" ? description.trim() : "",
          images: validImages,
        },
        { new: true }
      );

      if (!gallery) return res.status(404).json({ error: "Không tìm thấy album để cập nhật" });
      return res.status(200).json({ gallery });
    } catch (error: any) {
      console.error("Lỗi khi cập nhật album gallery:", error);
      return res.status(500).json({ error: error.message || "Lỗi khi cập nhật album gallery" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const gallery = await R2Gallery.findByIdAndDelete(id);
      if (!gallery) return res.status(404).json({ error: "Không tìm thấy album để xóa" });
      return res.status(200).json({ message: "Đã xóa album thành công", id });
    } catch (error: any) {
      console.error("Lỗi khi xóa album gallery:", error);
      return res.status(500).json({ error: error.message || "Lỗi khi xóa album gallery" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
