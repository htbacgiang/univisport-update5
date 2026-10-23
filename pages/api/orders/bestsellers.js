
import db from "../../../utils/db";
import Order from "../../../models/Order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await db.connectDb();

    const orders = await Order.find({ status: { $ne: "cancelled" } }).lean();

    const products = {};

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        products[item.title] = (products[item.title] || 0) + item.quantity;
      });
    });

    const sortedProducts = Object.entries(products)
      .map(([title, quantity]) => ({ title, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return res.status(200).json(sortedProducts);
  } catch (error) {
    console.error("Error fetching bestsellers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}