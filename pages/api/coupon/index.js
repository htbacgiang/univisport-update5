import db from "../../../utils/db";
import Coupon from "../../../models/Coupon";
import { requireAdmin } from "../../../lib/adminAuth";

export default async function handler(req, res) {
    await db.connectDb();
    const { method, query } = req;
  
    switch (method) {
      case "GET":
        try {
          const { coupon } = query;
          if (coupon) {
            // Tìm coupon theo code (viết hoa để trùng với DB nếu DB lưu uppercase)
            const foundCoupon = await Coupon.find({
              coupon: String(coupon).toUpperCase(),
            });
            return res.status(200).json(foundCoupon);
          } else {
            // Nếu không có query coupon, chỉ admin mới được xem tất cả
            if (!(await requireAdmin(req, res))) return;
            const allCoupons = await Coupon.find({});
            return res.status(200).json(allCoupons);
          }
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
  
      case "POST":
        if (!(await requireAdmin(req, res))) return;
        try {
          const { coupon, startDate, endDate, discount } = req.body;
          if (!coupon || !startDate || !endDate || discount == null) {
            return res
              .status(400)
              .json({ message: "Vui lòng điền đầy đủ thông tin coupon." });
          }
          // Tạo mới coupon
          const newCoupon = new Coupon({
            coupon: coupon.toUpperCase(),
            startDate,
            endDate,
            discount,
          });
          await newCoupon.save();
          return res.status(201).json(newCoupon);
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
  
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  }