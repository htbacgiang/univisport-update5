import db from '../../../../utils/db';
import { Job } from '../../../../models/Job';
import { requireAdmin } from '../../../../lib/adminAuth';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  if (method !== 'GET') {
    if (!(await requireAdmin(req, res))) return;
  }

  await db.connectDb();

  try {
    switch (method) {
      case 'GET':
        const job = await Job.findById(id);
        if (!job) {
          return res.status(404).json({ success: false, message: 'Không tìm thấy tin tuyển dụng' });
        }
        res.status(200).json({ success: true, data: job });
        break;

      case 'PUT':
        const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updatedJob) {
          return res.status(404).json({ success: false, message: 'Không tìm thấy tin tuyển dụng' });
        }
        res.status(200).json({ success: true, data: updatedJob });
        break;

      case 'DELETE':
        const deletedJob = await Job.findByIdAndDelete(id);
        if (!deletedJob) {
          return res.status(404).json({ success: false, message: 'Không tìm thấy tin tuyển dụng' });
        }
        res.status(200).json({ success: true, message: 'Xóa tin tuyển dụng thành công' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error('API Jobs [id] Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
}
