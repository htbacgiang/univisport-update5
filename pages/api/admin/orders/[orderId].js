import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "../../../../utils/db";
import Order from "../../../../models/Order";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: chỉ admin mới có quyền thực hiện thao tác này" });
  }

  await db.connectDb();
  const { orderId } = req.query;

  if (req.method === "PUT") {
    const { status } = req.body;
    const validStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }
    try {
      const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
      if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      return res.status(200).json({ order });
    } catch (error) {
      console.error("Lỗi cập nhật đơn hàng:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await Order.findByIdAndDelete(orderId);
      return res.status(200).json({ message: "Đã xóa đơn hàng" });
    } catch (error) {
      console.error("Lỗi xóa đơn hàng:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).json({ message: "Method not allowed" });
}
