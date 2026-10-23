import db from '../../../../utils/db';
import { Job } from '../../../../models/Job';
import { requireAdmin } from '../../../../lib/adminAuth';

export default async function handler(req, res) {
  const { method } = req;
  await db.connectDb();

  try {
    switch (method) {
      case 'GET':
        const filter = {};
        if (req.query.isActive !== undefined) {
          filter.isActive = req.query.isActive === 'true';
        }
        const jobs = await Job.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: jobs });
        break;

      case 'POST':
        if (!(await requireAdmin(req, res))) return;
        const newJob = new Job(req.body);
        await newJob.save();
        res.status(201).json({ success: true, data: newJob });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error('API Jobs Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
}
