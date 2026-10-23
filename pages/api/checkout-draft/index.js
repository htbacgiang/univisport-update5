import db from "../../../utils/db";
import CheckoutDraft from "../../../models/CheckoutDraft";

export default async function handler(req, res) {
  await db.connectDb();

  if (req.method === "GET") {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "Thiếu userId" });
    const doc = await CheckoutDraft.findOne({ user: userId });
    return res.json({ draft: doc?.draft || null });
  }

  if (req.method === "POST") {
    const { userId, draft } = req.body;
    if (!userId) return res.status(400).json({ message: "Thiếu userId" });
    await CheckoutDraft.findOneAndUpdate(
      { user: userId },
      { draft, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    return res.json({ ok: true });
  }

  if (req.method === "DELETE") {
    const { userId } = req.query;
    if (userId) await CheckoutDraft.deleteOne({ user: userId });
    return res.json({ ok: true });
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  res.status(405).end();
}
