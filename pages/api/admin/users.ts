import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import db from "../../../utils/db";
import User from "../../../models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions as NextAuthOptions);
  if (!session || (session.user as any).role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  await db.connectDb();

  const { page = "1", limit = "10", search = "" } = req.query as {
    page: string;
    limit: string;
    search: string;
  };

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select("name email phone role image emailVerified createdAt"),
    User.countDocuments(query),
  ]);

  const cleaned = users.map((u) => ({
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    phone: u.phone || "",
    role: u.role,
    image: u.image,
    emailVerified: u.emailVerified,
    createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : u.createdAt,
  }));

  return res.status(200).json({ users: cleaned, total, page: pageNum, limit: limitNum });
}
