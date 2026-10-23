import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import db from "../../../utils/db";
import User from "../../../models/User";
import Product from "../../../models/Product";
import mongoose from "mongoose";

/**
 * Chuyển productId (có thể là numeric id hoặc MongoDB ObjectId string)
 * thành MongoDB ObjectId (_id) của Product.
 */
async function resolveProductObjectId(productId) {
  // Nếu là ObjectId hợp lệ → dùng luôn
  if (mongoose.Types.ObjectId.isValid(productId) && String(productId).length === 24) {
    return productId;
  }
  // Nếu là số (numeric id từ ProductCard) → tìm theo trường id
  const numericId = Number(productId);
  if (!isNaN(numericId)) {
    const product = await Product.findOne({ id: numericId }).select("_id").lean();
    if (product) return product._id.toString();
  }
  return null;
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await db.connectDb();
  const userId = session.user.id;

  // GET — lấy toàn bộ wishlist (có populate product)
  if (req.method === "GET") {
    try {
      const user = await User.findById(userId)
        .populate("wishlist.product", "name price image slug maSanPham category rating")
        .lean();
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json({ wishlist: user.wishlist || [] });
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // POST — toggle sản phẩm vào/ra wishlist
  if (req.method === "POST") {
    try {
      const { productId, style } = req.body;
      if (!productId) return res.status(400).json({ message: "Missing productId" });

      // Giải quyết ObjectId thực sự
      const objectId = await resolveProductObjectId(productId);
      if (!objectId) {
        return res.status(404).json({ message: "Product not found" });
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const existIdx = user.wishlist.findIndex(
        (w) => w.product.toString() === objectId.toString()
      );

      if (existIdx >= 0) {
        // Đã có → xóa
        user.wishlist.splice(existIdx, 1);
        await user.save();
        return res.status(200).json({ added: false, message: "Đã xóa khỏi yêu thích" });
      } else {
        // Chưa có → thêm
        user.wishlist.push({ product: objectId, style: style || "" });
        await user.save();
        return res.status(200).json({ added: true, message: "Đã thêm vào yêu thích" });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // DELETE — xóa 1 sản phẩm hoặc toàn bộ
  if (req.method === "DELETE") {
    try {
      const { productId } = req.body;
      if (productId) {
        // Giải quyết ObjectId
        const objectId = await resolveProductObjectId(productId);
        if (objectId) {
          await User.findByIdAndUpdate(userId, {
            $pull: { wishlist: { product: objectId } },
          });
        }
        return res.status(200).json({ message: "Đã xóa khỏi yêu thích" });
      } else {
        // Xóa toàn bộ (clear)
        await User.findByIdAndUpdate(userId, { $set: { wishlist: [] } });
        return res.status(200).json({ message: "Đã xóa toàn bộ yêu thích" });
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}

