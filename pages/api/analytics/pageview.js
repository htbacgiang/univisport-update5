import db from "../../../utils/db";
import PageView from "../../../models/PageView";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { path, title, duration, referrer, sessionId } = req.body || {};

  if (!path) return res.status(400).json({ error: "path required" });

  // Bỏ qua bot và dashboard
  const ua = req.headers["user-agent"] || "";
  if (/bot|crawl|spider|slurp|facebook|preview/i.test(ua)) {
    return res.status(200).json({ ok: true });
  }

  await db.connectDb();

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "";

  await PageView.create({
    path,
    title: title || "",
    duration: Math.max(0, parseInt(duration) || 0),
    referrer: referrer || "",
    sessionId: sessionId || "",
    ip,
    userAgent: ua,
  });

  return res.status(200).json({ ok: true });
}
