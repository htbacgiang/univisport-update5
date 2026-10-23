import db from '../../../utils/db';
import User from '../../../models/User';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: "Vui lòng đăng nhập" });
  }

  const currentUserId = session.user.id || session.user._id;
  const isAdmin = session.user.role === "admin";
  const targetUserId = req.method === 'GET' ? req.query.userId : req.body.userId;

  if (!isAdmin && currentUserId?.toString() !== targetUserId?.toString()) {
    return res.status(403).json({ message: "Bạn không có quyền truy cập hoặc chỉnh sửa hồ sơ này" });
  }

  await db.connectDb();

  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    try {
      const user = await User.findById(userId)
        .select('name phone defaultShippingAddress')
        .lean();
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  if (req.method === 'PUT') {
    const { userId, phone, defaultShippingAddress } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    // Save address — always, independently
    if (defaultShippingAddress !== undefined) {
      try {
        await User.findByIdAndUpdate(
          userId,
          { $set: { defaultShippingAddress } },
          { strict: false, runValidators: false }
        );
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    }

    // Save phone — only if valid format and not taken by another user
    if (phone && /^[0-9]{10,11}$/.test(phone)) {
      try {
        // Check if THIS user already has this phone (no-op) or another user has it (skip)
        const existing = await User.findOne({ phone }).lean();
        if (!existing || existing._id.toString() === userId) {
          await User.findByIdAndUpdate(
            userId,
            { $set: { phone } },
            { strict: false, runValidators: false }
          );
        }
      } catch (_) {}
    }

    return res.status(200).json({ message: 'Cập nhật thành công' });
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).end();
}
