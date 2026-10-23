import db from '../../../../utils/db';
import { Application } from '../../../../models/Application';
import { requireAdmin } from '../../../../lib/adminAuth';

export default async function handler(req, res) {
  if (!(await requireAdmin(req, res))) return;

  const { method } = req;
  const { id } = req.query;

  await db.connectDb();

  try {
    switch (method) {
      case 'GET':
        const application = await Application.findById(id).populate('jobId');
        if (!application) {
          return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ ứng viên' });
        }
        res.status(200).json({ success: true, data: application });
        break;

      case 'PUT':
        const updatedApplication = await Application.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updatedApplication) {
          return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ ứng viên' });
        }
        res.status(200).json({ success: true, data: updatedApplication });
        break;

      case 'DELETE':
        const deletedApplication = await Application.findByIdAndDelete(id);
        if (!deletedApplication) {
          return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ ứng viên' });
        }
        res.status(200).json({ success: true, message: 'Xóa hồ sơ ứng viên thành công' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error('API Applications [id] Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
}
