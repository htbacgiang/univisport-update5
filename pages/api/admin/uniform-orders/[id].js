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
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const order = await UniformOrder.findById(id).lean();
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }
      return res.status(200).json({
        order: {
          id: order._id.toString(),
          ...order,
        },
      });
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn:", error);
      return res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  if (req.method === "PUT") {
    try {
      const body = req.body;

      // Cập nhật trạng thái nhanh nếu chỉ truyền status
      if (Object.keys(body).length === 1 && body.status) {
        const updated = await UniformOrder.findByIdAndUpdate(
          id,
          { status: body.status },
          { new: true }
        ).lean();
        if (!updated) {
          return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
        return res.status(200).json({
          message: "Cập nhật trạng thái thành công",
          order: { id: updated._id.toString(), ...updated },
        });
      }

      // Cập nhật toàn bộ thông tin
      const updateData = { ...body };
      delete updateData._id;
      delete updateData.id;

      if (body.sizes) {
        const { totalMen, totalWomen, totalQuantity } = calculateTotals(body.sizes);
        updateData.totalMen = totalMen;
        updateData.totalWomen = totalWomen;
        updateData.totalQuantity = totalQuantity;

        const unitPrice = Number(body.unitPrice || 0);
        const totalAmount = body.totalAmount ? Number(body.totalAmount) : unitPrice * totalQuantity;
        const deposit = Number(body.deposit || 0);
        updateData.unitPrice = unitPrice;
        updateData.totalAmount = totalAmount;
        updateData.deposit = deposit;
        updateData.remaining = Math.max(0, totalAmount - deposit);
      }

      const updated = await UniformOrder.findByIdAndUpdate(id, updateData, { new: true }).lean();
      if (!updated) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }

      return res.status(200).json({
        message: "Cập nhật đơn hàng thành công",
        order: { id: updated._id.toString(), ...updated },
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
      return res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const deleted = await UniformOrder.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng để xóa" });
      }
      return res.status(200).json({ message: "Đã xóa đơn hàng thành công" });
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
      return res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ message: "Method not allowed" });
}
