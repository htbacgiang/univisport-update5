import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";
import db from "../../../utils/db";
import Author from "../../../models/Author";
import Post from "../../../models/Post";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") return getAuthor(req, res);
  if (req.method === "PATCH") return updateAuthor(req, res);
  if (req.method === "DELETE") return deleteAuthor(req, res);
  return res.status(405).send("Method not allowed");
};

const getAuthor: NextApiHandler = async (req, res) => {
  try {
    await db.connectDb();

    const author = await Author.findOne({ slug: req.query.slug as string });
    if (!author) return res.status(404).json({ error: "Không tìm thấy tác giả" });

    const posts = await Post.find({
      postAuthor: author._id,
      isDraft: false,
    })
      .sort({ createdAt: -1 })
      .select("title slug thumbnail meta createdAt category isDirectPost");

    res.json({ author, posts });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    await db.disconnectDb();
  }
};

const updateAuthor: NextApiHandler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET });
  if (!token || (token as any).role !== "admin") {
    return res.status(403).json({ error: "Chỉ admin mới có quyền sửa tác giả!" });
  }

  try {
    await db.connectDb();

    const author = await Author.findOne({ slug: req.query.slug as string });
    if (!author) return res.status(404).json({ error: "Không tìm thấy tác giả" });

    const { name, slug, role, bio, avatar, socialLinks } = req.body;

    if (!name?.trim() || !slug?.trim()) {
      return res.status(400).json({ error: "Tên và slug là bắt buộc" });
    }

    // Check slug uniqueness only if slug changed
    if (slug.trim() !== author.slug) {
      const existing = await Author.findOne({ slug: slug.trim() });
      if (existing) {
        return res.status(400).json({ error: "Slug đã tồn tại, vui lòng chọn slug khác" });
      }
    }

    author.name = name.trim();
    author.slug = slug.trim();
    author.role = role?.trim() || "";
    author.bio = bio?.trim() || "";
    author.avatar = avatar?.trim() || "";
    author.socialLinks = {
      facebook: socialLinks?.facebook?.trim() || "",
      zalo: socialLinks?.zalo?.trim() || "",
      linkedin: socialLinks?.linkedin?.trim() || "",
    };

    await author.save();
    res.json({ author, message: "Cập nhật tác giả thành công!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    await db.disconnectDb();
  }
};

const deleteAuthor: NextApiHandler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET });
  if (!token || (token as any).role !== "admin") {
    return res.status(403).json({ error: "Chỉ admin mới có quyền xóa tác giả!" });
  }

  try {
    await db.connectDb();

    const author = await Author.findOne({ slug: req.query.slug as string });
    if (!author) return res.status(404).json({ error: "Không tìm thấy tác giả" });

    // Unlink posts from this author
    await Post.updateMany({ postAuthor: author._id }, { $unset: { postAuthor: 1 } });

    await author.deleteOne();
    res.json({ message: "Đã xóa tác giả thành công!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    await db.disconnectDb();
  }
};

export default handler;
