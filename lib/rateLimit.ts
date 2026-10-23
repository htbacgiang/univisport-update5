import type { NextApiRequest, NextApiResponse } from "next";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ipMap = new Map<string, RateLimitRecord>();

// Tự động dọn dẹp bộ nhớ mỗi 5 phút
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    ipMap.forEach((value, key) => {
      if (value.resetAt < now) {
        ipMap.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

/**
 * Giới hạn tần suất gửi request theo IP (Rate Limiter)
 */
export function checkRateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  { limit = 5, windowMs = 15 * 60 * 1000 } = {}
): boolean {
  const clientIp =
    (req.headers["x-forwarded-for"] ? String(req.headers["x-forwarded-for"]).split(",")[0].trim() : null) ||
    req.socket?.remoteAddress ||
    "unknown";

  const endpoint = req.url ? req.url.split("?")[0] : "api";
  const key = `${clientIp}:${endpoint}`;
  const now = Date.now();
  const record = ipMap.get(key);

  if (!record || record.resetAt < now) {
    ipMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    const retryAfterSec = Math.ceil((record.resetAt - now) / 1000);
    res.setHeader("Retry-After", retryAfterSec);
    res.status(429).json({
      success: false,
      message: `Bạn đã gửi yêu cầu quá nhiều lần. Vui lòng thử lại sau ${retryAfterSec} giây.`,
    });
    return false;
  }

  record.count += 1;
  return true;
}

export default checkRateLimit;
