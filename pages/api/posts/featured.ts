import { NextApiHandler } from "next";
import db from "../../../utils/db";
import { getToken } from "next-auth/jwt";
import Post from "../../../models/Post";
import { formatPosts } from "../../../lib/utils";

const MAX_FEATURED = 5;

export const config = {
  api: { bodyParser: true },
};

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      return getFeaturedPosts(req, res);
    case "PUT":
      return updateFeatured(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

// GET: Lấy danh sách bài viết nổi bật, sort theo featuredOrder
const getFeaturedPosts: NextApiHandler = async (req, res) => {
  try {
    await db.connectDb();
    const posts = await Post.find({ isFeatured: true, isDraft: { $ne: true } })
      .sort({ featuredOrder: 1 })
      .select("-content")
      .lean();

    return res.json({ posts: formatPosts(posts as any), count: posts.length });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// PUT: Cập nhật trạng thái nổi bật
const updateFeatured: NextApiHandler = async (req, res) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  });
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await db.connectDb();
    const { action, postId, items } = req.body;

    if (action === "add") {
      const currentCount = await Post.countDocuments({ isFeatured: true });
      if (currentCount >= MAX_FEATURED) {
        return res.status(400).json({ error: `Đã đủ ${MAX_FEATURED} bài nổi bật. Vui lòng xóa bớt trước khi thêm.` });
      }

      await Post.findByIdAndUpdate(postId, {
        isFeatured: true,
        featuredOrder: currentCount + 1,
      });
      return res.json({ success: true, message: "Đã thêm vào bài nổi bật" });
    }

    if (action === "remove") {
      const post = await Post.findById(postId).select("featuredOrder");
      const removedOrder = post?.featuredOrder ?? 999;

      await Post.findByIdAndUpdate(postId, {
        isFeatured: false,
        featuredOrder: null,
      });

      await Post.updateMany(
        { isFeatured: true, featuredOrder: { $gt: removedOrder } },
        { $inc: { featuredOrder: -1 } }
      );

      return res.json({ success: true, message: "Đã xóa khỏi bài nổi bật" });
    }

    if (action === "reorder" && Array.isArray(items)) {
      const ops = items.map(({ postId: pid, order }: { postId: string; order: number }) =>
        Post.findByIdAndUpdate(pid, { featuredOrder: order })
      );
      await Promise.all(ops);
      return res.json({ success: true, message: "Đã cập nhật thứ tự" });
    }

    return res.status(400).json({ error: "Action không hợp lệ" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export default handler;
