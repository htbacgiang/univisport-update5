import db from '../../../utils/db';
import Feedback from '../../../models/Feedback';
import { requireAdmin } from '../../../lib/adminAuth';

export default async function handler(req, res) {
  const { method } = req;

  if (method !== 'GET') {
    if (!(await requireAdmin(req, res))) return;
  }

  await db.connectDb();

  try {
    switch (method) {
      case 'GET':
        // Lấy danh sách Feedback (có thể lọc theo giới hạn và danh mục)
        const limit = req.query.limit ? parseInt(req.query.limit) : 1000;
        const filter = {};
        if (req.query.category) {
          filter.category = req.query.category;
        }
        const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 }).limit(limit);
        res.status(200).json({ success: true, data: { projects: feedbacks } }); // Để match cấu trúc mảng "projects" tại Dashboard
        break;

      case 'POST':
        // Thêm Feedback mới
        {
          const newFeedback = new Feedback(req.body);
          await newFeedback.save();
          res.status(201).json({ success: true, data: newFeedback });
        }
        break;

      case 'PUT':
        // Cập nhật Feedback
        {
          const { id, ...updateData } = req.body;
          if (!id) {
            return res.status(400).json({ success: false, message: 'Thiếu ID Feedback để cập nhật' });
          }
          const updatedFeedback = await Feedback.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
          });
          if (!updatedFeedback) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy Feedback' });
          }
          res.status(200).json({ success: true, data: updatedFeedback });
        }
        break;

      case 'DELETE':
        // Xoá Feedback (ID được truyền qua query params `?id=...`)
        {
          const { id } = req.query;
          if (!id) {
            return res.status(400).json({ success: false, message: 'Thiếu ID Feedback để xóa' });
          }
          const deleted = await Feedback.findByIdAndDelete(id);
          if (!deleted) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy Feedback' });
          }
          res.status(200).json({ success: true, message: 'Xóa Feedback thành công' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Phương thức ${method} không được hỗ trợ`);
        break;
    }
  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({ success: false, message: 'Slug đã tồn tại. Vui lòng chọn tiêu đề khác.' });
    }
    console.error('API Feedback Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Lỗi Server' });
  }
}
