import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import db from "../../../utils/db";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
  
  await db.connectDb();
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const { orderId } = req.query;
  if (!orderId) {
    return res.status(400).json({ message: "Missing orderId" });
  }
  
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    // Kiểm tra đơn hàng thuộc về người dùng hiện tại
    if (order.user && order.user.toString() !== session.user.id) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }
    // Cho phép hủy nếu đơn hàng đang ở trạng thái pending
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Order cannot be cancelled at this stage" });
    }
    
    order.status = "cancelled";
    await order.save();
    return res.status(200).json({ order });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
