import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "../../../../utils/db";
import UniformOrder from "../../../../models/UniformOrder";

function calculateTotals(sizes) {
  const SIZES = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
  let totalMen = 0;
  let totalWomen = 0;

  if (sizes?.men) {
    SIZES.forEach((sz) => {
      totalMen += Number(sizes.men[sz] || 0);
    });
  }

  if (sizes?.women) {
    SIZES.forEach((sz) => {
      totalWomen += Number(sizes.women[sz] || 0);
    });
  }

  const totalQuantity = totalMen + totalWomen;
  return { totalMen, totalWomen, totalQuantity };
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Chỉ admin mới có quyền thực hiện thao tác này" });
  }

  await db.connectDb();

  if (req.method === "GET") {
    try {
      const { search, status, page = 1, limit = 50 } = req.query;
      const query = {};

      if (status && status !== "all") {
        query.status = status;
      }

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), "i");
        query.$or = [
          { orderCode: regex },
          { customerName: regex },
          { customerPhone: regex },
          { designCodes: regex },
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);
      const [orders, total] = await Promise.all([
        UniformOrder.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
        UniformOrder.countDocuments(query),
      ]);

      const cleanedOrders = orders.map((o) => ({
        id: o._id.toString(),
        ...o,
      }));

      return res.status(200).json({
        orders: cleanedOrders,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      console.error("Lỗi khi tải danh sách đơn đồng phục:", error);
      return res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body;

      // Tự sinh mã đơn nếu chưa nhập
      let orderCode = body.orderCode?.trim();
      if (!orderCode) {
        const count = await UniformOrder.countDocuments();
        const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
        orderCode = `UBB-${dateStr}-${String(count + 1).padStart(3, "0")}`;
      }

      // Kiểm tra trùng mã
      const existing = await UniformOrder.findOne({ orderCode });
      if (existing) {
        return res.status(400).json({ message: `Mã đơn hàng ${orderCode} đã tồn tại!` });
      }

      // Tính tổng số lượng
      const { totalMen, totalWomen, totalQuantity } = calculateTotals(body.sizes);

      // Tính tài chính
      const unitPrice = Number(body.unitPrice || 0);
      const totalAmount = body.totalAmount ? Number(body.totalAmount) : unitPrice * totalQuantity;
      const deposit = Number(body.deposit || 0);
      const remaining = Math.max(0, totalAmount - deposit);

      const newOrder = await UniformOrder.create({
        ...body,
        orderCode,
        totalMen,
        totalWomen,
        totalQuantity,
        unitPrice,
        totalAmount,
        deposit,
        remaining,
      });

      return res.status(201).json({
        message: "Tạo đơn hàng đồng phục thành công",
        order: {
          id: newOrder._id.toString(),
          ...newOrder.toObject(),
        },
      });
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng đồng phục:", error);
      return res.status(500).json({ message: "Lỗi máy chủ khi tạo đơn", error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: "Method not allowed" });
}
