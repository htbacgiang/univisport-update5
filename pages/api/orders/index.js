import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import db from "../../../utils/db";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await db.connectDb();

    let orders;
    if (session.user.role === "admin") {
      orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    } else {
      orders = await Order.find({ user: session.user.id })
        .sort({ createdAt: -1 })
        .lean();
    }

    // Chuyển _id thành id và chuyển createdAt thành ISO string
    const ordersCleaned = orders.map((order) => {
      return {
        id: order._id.toString(),
        ...order,
        createdAt:
          order.createdAt instanceof Date
            ? order.createdAt.toISOString()
            : order.createdAt,
      };
    });

    return res.status(200).json({ orders: ordersCleaned });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
