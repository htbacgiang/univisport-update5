import db from "../../../utils/db";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { newOrderNotificationTemplate } from "../../../emails/newOrderNotificationTemplate";

async function sendAdminOrderEmail(order) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) return;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Đồng Phục Univi" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `[Đơn hàng mới] #${order.orderCode} – ${order.name} – ${Number(order.finalTotal).toLocaleString("vi-VN")}đ`,
      html: newOrderNotificationTemplate(order),
    });

    console.log(`[ORDER EMAIL] Đã gửi thông báo đơn hàng ${order.orderCode} tới ${adminEmail}`);
  } catch (err) {
    console.error("[ORDER EMAIL] Lỗi gửi email thông báo đơn hàng:", err.message);
  }
}

export default async function handler(req, res) {
  await db.connectDb();
  if (req.method === "POST") {
    try {
      const {
        user,
        orderItems,
        shippingAddress,
        phone,
        name,
        note,
        coupon,
        discount,
        totalPrice,
        totalAfterDiscount,
        shippingFee,
        finalTotal,
        paymentMethod,
        paymentCode,
      } = req.body;

      if (
        !orderItems ||
        orderItems.length === 0 ||
        !shippingAddress ||
        !phone ||
        !name ||
        !totalPrice ||
        !paymentMethod
      ) {
        return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
      }

      // Ensure all products are ObjectIds
      const isRealObjectId = (val) =>
        val instanceof mongoose.Types.ObjectId ||
        (typeof val === 'string' && /^[a-f\d]{24}$/i.test(val));

      for (let i = 0; i < orderItems.length; i++) {
        const item = orderItems[i];
        if (!isRealObjectId(item.product)) {
          const numericId = Number(item.product);
          if (!isNaN(numericId)) {
            const productDoc = await Product.findOne({ id: numericId });
            if (productDoc) {
              item.product = productDoc._id;
            } else {
              return res.status(400).json({ message: `Sản phẩm với ID ${item.product} không tồn tại` });
            }
          } else {
            return res.status(400).json({ message: `ID Sản phẩm không hợp lệ: ${item.product}` });
          }
        }
      }

      // Generate unique order code: UNIVI_XXXXXX
      let orderCode;
      let codeExists = true;
      while (codeExists) {
        const digits = Math.floor(100000 + Math.random() * 900000).toString();
        orderCode = `UNIVI_${digits}`;
        codeExists = await Order.exists({ orderCode });
      }

      const order = new Order({
        orderCode,
        user: user || null,
        orderItems,
        shippingAddress,
        phone,
        name,
        note,
        coupon,
        discount,
        totalPrice,
        totalAfterDiscount: totalAfterDiscount || totalPrice,
        shippingFee,
        finalTotal,
        paymentMethod: paymentMethod || "COD",
        status: "pending",
      });

      await order.save();

      // Gửi email thông báo cho admin (không block response)
      sendAdminOrderEmail(order.toObject());

      res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} không được hỗ trợ`);
  }
}
