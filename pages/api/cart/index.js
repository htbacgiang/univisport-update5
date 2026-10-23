import db from "../../../utils/db";
import Cart from "../../../models/Cart";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: "Vui lòng đăng nhập" });
  }

  const currentUserId = session.user.id || session.user._id;
  const isAdmin = session.user.role === "admin";
  const targetUserId = req.method === "GET" ? req.query.userId : req.body.user;

  if (!isAdmin && currentUserId?.toString() !== targetUserId?.toString()) {
    return res.status(403).json({ message: "Bạn không có quyền truy cập giỏ hàng này" });
  }

  await db.connectDb();

  switch (req.method) {
    case "GET": {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ message: "userId is required" });
      try {
        const cart = await Cart.findOne({ user: userId });
        return res.status(200).json(cart ?? { products: [], cartTotal: 0 });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    }

    case "POST": {
      const { user, product, quantity = 1, price, title, image, color = "", colorHex = "", size = "" } = req.body;
      if (!user || !product) return res.status(400).json({ message: "user và product là bắt buộc" });

      try {
        let cart = await Cart.findOne({ user });
        if (!cart) cart = new Cart({ user, products: [], cartTotal: 0 });

        // Tìm item cùng product + color + size
        const idx = cart.products.findIndex(
          (p) =>
            p.product.toString() === product &&
            p.color === color &&
            p.size === size
        );

        if (idx >= 0) {
          cart.products[idx].quantity += quantity;
        } else {
          cart.products.push({ product, title, image, quantity, price, color, colorHex, size });
        }

        cart.cartTotal = cart.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
        await cart.save();
        return res.status(200).json(cart);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
