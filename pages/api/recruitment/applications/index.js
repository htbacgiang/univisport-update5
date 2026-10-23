import db from '../../../../utils/db';
import { Application } from '../../../../models/Application';
import { requireAdmin } from '../../../../lib/adminAuth';

export default async function handler(req, res) {
  if (!(await requireAdmin(req, res))) return;

  const { method } = req;
  await db.connectDb();

  try {
    switch (method) {
      case 'GET':
        const applications = await Application.find().sort({ createdAt: -1 }).populate('jobId');
        res.status(200).json({ success: true, data: applications });
        break;

      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error('API Applications Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
}
