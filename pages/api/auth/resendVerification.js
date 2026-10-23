import db from "../../../utils/db";
import User from "../../../models/User";
import { createActivationToken } from "../../../utils/tokens";
import { sendEmail } from "../../../utils/sendEmails";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await db.connectDb();

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại." });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email đã được xác nhận." });
    }

    const now = new Date();
    const lastSent = user.emailVerificationSentAt || new Date(0);
    const nextAvailableTime = new Date(lastSent.getTime() + 15 * 60 * 1000);

    if (now < nextAvailableTime) {
      const secondsLeft = Math.ceil((nextAvailableTime.getTime() - now.getTime()) / 1000);
      return res.status(400).json({
        message: `Bạn chỉ có thể gửi lại email sau ${Math.ceil(secondsLeft / 60)} phút.`,
        cooldown: secondsLeft, // Gửi số giây còn lại về client
      });
    }

    // Tạo token mới
    const activation_token = createActivationToken({ id: user._id.toString() });
    const url = `${process.env.BASE_URL}/activate?token=${activation_token}`;

    // Gửi email xác nhận lại
    await sendEmail(user.email, url, "", "Gửi lại email xác nhận tài khoản");

    user.emailVerificationSentAt = now;
    await user.save();

    await db.disconnectDb();

    return res.status(200).json({ message: "Email xác nhận đã được gửi lại." });
  } catch (error) {
    console.error("Lỗi gửi lại email:", error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
}
