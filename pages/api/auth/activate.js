import db from "../../../utils/db";
import User from "../../../models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await db.connectDb();
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token không hợp lệ." });
    }

    // Giải mã token để lấy ID và thời gian tạo
    const decoded = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }

    // Kiểm tra nếu token đã quá 2 ngày
    const tokenCreatedAt = new Date(decoded.iat * 1000);
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    if (tokenCreatedAt < twoDaysAgo) {
      return res.status(400).json({ message: "Mã xác nhận đã hết hạn. Vui lòng gửi lại email xác nhận." });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại." });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Tài khoản đã được xác nhận trước đó." });
    }

    user.emailVerified = true;
    await user.save();
    await db.disconnectDb();

    return res.status(200).json({ message: "Xác nhận email thành công! Bạn có thể đăng nhập ngay." });
  } catch (error) {
    console.error("Lỗi xác nhận email:", error);
    return res.status(500).json({ message: "Lỗi trong quá trình xác nhận email." });
  }
}
