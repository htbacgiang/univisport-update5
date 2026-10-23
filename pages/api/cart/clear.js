// /pages/api/cart/clear.js
import db from "../../../utils/db";
import Cart from "../../../models/Cart";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: "Vui lòng đăng nhập" });
  }

  await db.connectDb();

  if (req.method === "DELETE") {
    try {
      const { userId } = req.body;
      const currentUserId = session.user.id || session.user._id;
      const isAdmin = session.user.role === "admin";

      if (!isAdmin && currentUserId?.toString() !== userId?.toString()) {
        return res.status(403).json({ message: "Bạn không có quyền xóa giỏ hàng này" });
      }

      if (!userId) {
        return res.status(400).json({ message: "Thiếu userId" });
      }
      // Xóa cart của user trong DB
      await Cart.findOneAndDelete({ user: userId });
      return res.status(200).json({ message: "Cart đã được xóa" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} không được hỗ trợ` });
  }
}
