import bcrypt from "bcryptjs";
import validator from "validator";
import db from "../../../utils/db";
import User from "../../../models/User";
import { createActivationToken } from "../../../utils/tokens";
import { sendEmail, sendEmailToMultiple } from "../../../utils/sendEmails";
import { newUserNotificationTemplate } from "../../../emails/newUserNotificationTemplate";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    console.log("Starting registration process...");
    console.log("Environment variables check:");
    console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
    console.log("ADMIN_EMAIL_2:", process.env.ADMIN_EMAIL_2);
    console.log("SENDER_EMAIL_ADDRESS:", process.env.SENDER_EMAIL_ADDRESS);

    // Parse request body
    const { name, email, password, conf_password, phone, agree } = req.body;

    // Kiểm tra đầu vào
    if (!name || !email || !phone || !password || !conf_password) {
      return res.status(400).json({ message: "Vui lòng điền hết các trường." });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Địa chỉ email không hợp lệ." });
    }
    if (password !== conf_password) {
      return res.status(400).json({ message: "Mật khẩu không khớp." });
    }
    if (agree !== true) { // Sửa ở đây: kiểm tra agree là true
      return res
        .status(400)
        .json({
          message: "Bạn phải đồng ý với Điều khoản & Chính sách bảo mật.",
        });
    }
    if (!/^\d{10,11}$/.test(phone)) {
      return res
        .status(400)
        .json({ message: "Số điện thoại không hợp lệ (10-11 chữ số)." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu phải có ít nhất 6 ký tự." });
    }

    // Kết nối database
    await db.connectDb();
    console.log("DB connected");

    // Kiểm tra email và phone
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Địa chỉ email đã tồn tại." });
    }
    if (await User.findOne({ phone })) {
      return res
        .status(400)
        .json({ message: "Số điện thoại đã được đăng ký." });
    }

    // Mã hóa mật khẩu
    const cryptedPassword = await bcrypt.hash(password, 12);

    // Tạo người dùng mới
    const newUser = new User({
      name,
      email,
      phone,
      password: cryptedPassword,
      agree, // Lưu giá trị boolean
    });
    const addedUser = await newUser.save();
    console.log("User added to the database");

    // Tạo token kích hoạt tài khoản
    const activation_token = createActivationToken({ id: addedUser._id.toString() });
    const url = `${process.env.BASE_URL}/activate?token=${activation_token}`;

    // Gửi email kích hoạt cho người dùng
    console.log("Sending activation email to user:", email);
    await sendEmail(email, url, "", "Kích hoạt tài khoản.");
    // Cập nhật thời gian gửi email xác nhận
    addedUser.emailVerificationSentAt = new Date();
    await addedUser.save();
    console.log("User activation email sent successfully");

    // Gửi email thông báo cho admin về người dùng mới
    console.log("Starting admin notification process...");
    try {
      const adminEmails = [
        process.env.ADMIN_EMAIL || process.env.SENDER_EMAIL_ADDRESS,
        process.env.ADMIN_EMAIL_2, // Admin 2
        process.env.ADMIN_EMAIL_3, // Admin 3
        // Có thể thêm nhiều email admin khác ở đây
      ].filter(email => email); // Lọc bỏ email null/undefined

      console.log("Admin emails to notify:", adminEmails);
      console.log("ADMIN_EMAIL_2 value:", process.env.ADMIN_EMAIL_2);

      if (adminEmails.length > 0) {
        const userData = {
          name: addedUser.name,
          email: addedUser.email,
          phone: addedUser.phone,
          createdAt: addedUser.createdAt
        };

        const adminEmailContent = newUserNotificationTemplate(userData);
        
        // Gửi email cho từng admin riêng biệt để debug
        for (const adminEmail of adminEmails) {
          try {
            await sendEmailToMultiple(
              [adminEmail], // Gửi cho từng email riêng biệt
              "🎉 Thông báo: Người dùng mới đăng ký - " + addedUser.name,
              adminEmailContent
            );
            console.log(`Admin notification email sent successfully to: ${adminEmail}`);
          } catch (individualError) {
            console.error(`Error sending email to ${adminEmail}:`, individualError);
          }
        }
      } else {
        console.log("No admin emails configured");
      }
    } catch (adminEmailError) {
      console.error("Error sending admin notification email:", adminEmailError);
      // Không throw error để không ảnh hưởng đến quá trình đăng ký chính
    }

    // Ngắt kết nối database
    await db.disconnectDb();

    return res.status(200).json({
      message: "Đăng ký thành công! Hãy kiểm tra email để kích hoạt tài khoản.",
    });
  } catch (error) {
    console.error("Error:", error.stack || error.message);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi trong quá trình đăng ký." });
  }
}