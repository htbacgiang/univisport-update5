import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";
import db from "../../../utils/db";
import Author from "../../../models/Author";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") return listAuthors(req, res);
  if (req.method === "POST") return createAuthor(req, res);
  return res.status(405).send("Method not allowed");
};

const listAuthors: NextApiHandler = async (req, res) => {
  try {
    await db.connectDb();
    const authors = await Author.find().sort({ name: 1 });
    res.json({ authors });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    await db.disconnectDb();
  }
};

const createAuthor: NextApiHandler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET });
  if (!token || (token as any).role !== "admin") {
    return res.status(403).json({ error: "Chỉ admin mới có quyền tạo tác giả!" });
  }

  try {
    await db.connectDb();
    const { name, slug, role, bio, avatar, socialLinks } = req.body;

    if (!name?.trim() || !slug?.trim()) {
      return res.status(400).json({ error: "Tên và slug là bắt buộc" });
    }

    const existing = await Author.findOne({ slug: slug.trim() });
    if (existing) {
      return res.status(400).json({ error: "Slug đã tồn tại, vui lòng chọn slug khác" });
    }

    const author = await Author.create({
      name: name.trim(),
      slug: slug.trim(),
      role: role?.trim() || "",
      bio: bio?.trim() || "",
      avatar: avatar?.trim() || "",
      socialLinks: {
        facebook: socialLinks?.facebook?.trim() || "",
        zalo: socialLinks?.zalo?.trim() || "",
        linkedin: socialLinks?.linkedin?.trim() || "",
      },
    });

    res.status(201).json({ author, message: "Tạo tác giả thành công!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    await db.disconnectDb();
  }
};

export default handler;
