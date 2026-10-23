import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import db from "../../../utils/db";
import PageView from "../../../models/PageView";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user?.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await db.connectDb();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start7d = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const start30d = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const [totalToday, total7d, total30d, topPages, dailyViews, recentViews, avgDuration] =
    await Promise.all([
      // Tổng lượt xem hôm nay
      PageView.countDocuments({ createdAt: { $gte: startOfToday } }),

      // 7 ngày
      PageView.countDocuments({ createdAt: { $gte: start7d } }),

      // 30 ngày
      PageView.countDocuments({ createdAt: { $gte: start30d } }),

      // Top 10 trang được xem nhiều nhất (30 ngày)
      PageView.aggregate([
        { $match: { createdAt: { $gte: start30d } } },
        {
          $group: {
            _id: "$path",
            views: { $sum: 1 },
            avgDuration: { $avg: "$duration" },
            title: { $last: "$title" },
          },
        },
        { $sort: { views: -1 } },
        { $limit: 10 },
      ]),

      // Lượt xem theo ngày trong 7 ngày gần nhất
      PageView.aggregate([
        { $match: { createdAt: { $gte: start7d } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "+07:00" },
            },
            views: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // 20 lượt xem gần nhất
      PageView.find({})
        .sort({ createdAt: -1 })
        .limit(20)
        .select("path title duration createdAt sessionId")
        .lean(),

      // Thời gian trung bình trên trang (30 ngày, chỉ tính > 0)
      PageView.aggregate([
        { $match: { createdAt: { $gte: start30d }, duration: { $gt: 0 } } },
        { $group: { _id: null, avg: { $avg: "$duration" } } },
      ]),
    ]);

  // Unique sessions (30 ngày)
  const uniqueSessions = await PageView.distinct("sessionId", {
    createdAt: { $gte: start30d },
    sessionId: { $ne: "" },
  });

  return res.status(200).json({
    totalToday,
    total7d,
    total30d,
    uniqueSessions30d: uniqueSessions.length,
    avgDuration30d: avgDuration[0]?.avg ? Math.round(avgDuration[0].avg) : 0,
    topPages,
    dailyViews,
    recentViews,
  });
}
