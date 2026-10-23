import db from "../../../utils/db";
import PageView from "../../../models/PageView";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { viewId, duration } = req.body || {};
  if (!viewId) return res.status(400).json({ error: "viewId required" });

  await db.connectDb();

  await PageView.updateOne(
    { viewId },
    { $set: { duration: Math.max(0, parseInt(duration) || 0) } }
  );

  return res.status(200).json({ ok: true });
}
