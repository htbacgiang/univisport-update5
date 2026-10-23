import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import TrackingSetting from "../../../models/TrackingSetting";
import User from "../../../models/User";
import db from "../../../utils/db";
import {
  getDefaultTrackingConfig,
  normalizeTrackingConfig,
} from "../../../lib/tracking-config";
import type { TrackingConfig } from "../../../types/tracking";

type TrackingConfigResponse = {
  config?: TrackingConfig;
  err?: string;
};

const GLOBAL_TRACKING_KEY = "global";
const AUTH_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TrackingConfigResponse>
) {
  if (req.method === "GET") {
    return getConfig(req, res);
  }

  if (req.method === "PUT") {
    return updateConfig(req, res);
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).json({ err: "Method not allowed" });
}

async function getConfig(
  _req: NextApiRequest,
  res: NextApiResponse<TrackingConfigResponse>
) {
  try {
    await db.connectDb();
    const setting = await TrackingSetting.findOne({ key: GLOBAL_TRACKING_KEY }).lean();

    return res.status(200).json({
      config: normalizeTrackingConfig(setting || getDefaultTrackingConfig()),
    });
  } catch {
    return res.status(200).json({ config: getDefaultTrackingConfig() });
  }
}

async function updateConfig(
  req: NextApiRequest,
  res: NextApiResponse<TrackingConfigResponse>
) {
  const role = await getRequestRole(req);

  if (role !== "admin") {
    return res.status(401).json({ err: "Bạn không có quyền cập nhật tracking" });
  }

  const config = normalizeTrackingConfig(req.body?.config || req.body);

  try {
    await db.connectDb();
    const setting = await TrackingSetting.findOneAndUpdate(
      { key: GLOBAL_TRACKING_KEY },
      { ...config, key: GLOBAL_TRACKING_KEY },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return res.status(200).json({ config: normalizeTrackingConfig(setting) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể lưu cấu hình tracking";
    return res.status(500).json({ err: message });
  }
}

async function getRequestRole(req: NextApiRequest) {
  const token = await getToken({ req, secret: AUTH_SECRET });
  const tokenRole = (token as { role?: unknown } | null)?.role;

  if (typeof tokenRole === "string") {
    return tokenRole;
  }

  const session = await getServerSession(req as any, {} as any, authOptions as NextAuthOptions);
  const sessionRole = (session?.user as { role?: unknown } | undefined)?.role;

  if (typeof sessionRole === "string") {
    return sessionRole;
  }

  const userId =
    typeof (token as { id?: unknown } | null)?.id === "string"
      ? ((token as { id: string }).id)
      : typeof token?.sub === "string"
        ? token.sub
        : undefined;

  if (!userId) {
    return undefined;
  }

  await db.connectDb();
  const user = await User.findById(userId).select("role").lean();
  const role = (user as { role?: unknown } | null)?.role;

  return typeof role === "string" ? role : undefined;
}
