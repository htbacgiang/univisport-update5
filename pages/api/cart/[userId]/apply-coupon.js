import db from "../../../../utils/db";
import Cart from "../../../../models/Cart";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: "Vui lòng đăng nhập" });
  }

  const { method } = req;
  const { userId } = req.query;

  const currentUserId = session.user.id || session.user._id;
  const isAdmin = session.user.role === "admin";
  if (!isAdmin && currentUserId?.toString() !== userId?.toString()) {
    return res.status(403).json({ message: "Bạn không có quyền thao tác trên giỏ hàng này" });
  }

  await db.connectDb();

  if (method !== "PUT") {
    return res.status(405).json({ message: `Method ${method} not allowed.` });
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ message: "Cart not found." });

  try {
    const { coupon, discount, totalAfterDiscount } = req.body;
    cart.coupon = coupon || "";
    cart.discount = discount || 0;
    cart.totalAfterDiscount = totalAfterDiscount || cart.cartTotal;
    // Nếu cart rỗng thì reset coupon
    if (cart.products.length === 0) {
      cart.coupon = "";
      cart.discount = 0;
      cart.totalAfterDiscount = 0;
    }
    await cart.save();
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
