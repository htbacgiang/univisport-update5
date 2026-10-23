import formidable from "formidable";
import { NextApiHandler } from "next";
import cloudinary from "../../../lib/cloudinary";
import { uploadPostThumbnail } from "../../../lib/cloudinary-upload";
import { readFile } from "../../../lib/utils";
import { postValidationSchema, validateSchema } from "../../../lib/validator";
import Post from "../../../models/Post";
import { IncomingPost } from "../../../utils/types";

import db from "../../../utils/db";
import { requireAdmin } from "../../../lib/adminAuth";

export const config = {
  api: { bodyParser: false },
};

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "PATCH":
      if (!(await requireAdmin(req, res))) return;
      return updatePost(req, res);
    case "DELETE":
      if (!(await requireAdmin(req, res))) return;
      return removePost(req, res);
    default:
      return res.status(404).send("Not found!");
  }
};

const removePost: NextApiHandler = async (req, res) => {
  try {
    await db.connectDb();
    // Lấy postId từ query (vd: /api/posts/1234567890)
    const postId = req.query.postId as string;
    if (!postId) {
      return res.status(400).json({ error: "Invalid post id" });
    }

    const post = await Post.findByIdAndDelete(postId);
    if (!post) return res.status(404).json({ error: "Post not found!" });

    // Nếu bài viết có thumbnail, xoá ảnh trên Cloudinary
    const publicId = post.thumbnail?.public_id;
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
    res.json({ removed: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const updatePost: NextApiHandler = async (req, res) => {
  try {
    await db.connectDb();
    const postId = req.query.postId as string;
    if (!postId) {
      return res.status(400).json({ error: "Invalid post id" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found!" });

    const { files, body } = await readFile<IncomingPost>(req);

    // Tự động tạo fallback cho meta description và slug nếu chưa nhập để không bị lỗi 400
    if (!body.meta || !String(body.meta).trim()) {
      const cleanSnippet = body.content
        ? String(body.content).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().substring(0, 160)
        : "";
      body.meta = cleanSnippet || body.title || post.meta || "Bài viết Univisport";
    }

    if (!body.slug || !String(body.slug).trim()) {
      body.slug = post.slug;
    }

    const error = validateSchema(postValidationSchema, { ...body });
    if (error) {
      console.error("Lỗi validation updatePost:", error, "body:", body);
      return res.status(400).json({ error });
    }

    const {
      title,
      content,
      meta,
      slug,
      category,
      thumbnailUrl,
      isFeatured: isFeaturedRaw,
      isDirectPost: isDirectPostRaw,
      faqs: faqsRaw,
      postAuthorId,
      keywords,
    } = body as any;

    const isFeatured = isFeaturedRaw === "true" || isFeaturedRaw === true;
    const isDirectPost = isDirectPostRaw === "true" || isDirectPostRaw === true;
    let faqs = [];
    try {
      if (faqsRaw) faqs = JSON.parse(faqsRaw as string);
    } catch (e) {
      console.error("Lỗi parse faqs:", e);
    }

    if (isFeatured && !post.isFeatured) {
      const featuredCount = await Post.countDocuments({ isFeatured: true });
      if (featuredCount >= 4) {
        return res.status(400).json({
          error: "Chỉ được tối đa 4 bài viết nổi bật. Vui lòng bỏ chọn nổi bật cho bài khác trước!",
        });
      }
    }

    post.title = title;
    post.content = content;
    post.meta = meta;
    post.slug = slug;
    if (category !== undefined) post.category = category;
    post.isFeatured = isFeatured;
    post.isDirectPost = isDirectPost;
    post.faqs = faqs;
    post.postAuthor =
      postAuthorId && postAuthorId !== "undefined" && postAuthorId !== "null" && postAuthorId !== ""
        ? postAuthorId
        : null;
    if (keywords !== undefined) post.keywords = keywords;

    // Cập nhật tags nếu có
    if ((body as any).tags !== undefined) {
      try {
        const rawTags = (body as any).tags;
        post.tags = typeof rawTags === "string" ? JSON.parse(rawTags) : rawTags;
      } catch {
        const rawTags = (body as any).tags;
        post.tags = typeof rawTags === "string" ? rawTags.split(",").map((t: string) => t.trim()) : [];
      }
    }

    // Xử lý thumbnail - có thể là file upload hoặc URL từ Cloudflare R2 / Cloudinary
    const thumbnail = files.thumbnail as formidable.File;
    if (thumbnail) {
      const { secure_url: url, public_id } = await uploadPostThumbnail(
        thumbnail.filepath,
        post._id.toString()
      );
      const oldPublicId = post.thumbnail?.public_id;
      if (oldPublicId && oldPublicId !== public_id) {
        await cloudinary.uploader.destroy(oldPublicId);
      }
      post.thumbnail = { url, public_id };
    } else if (thumbnailUrl !== undefined) {
      if (thumbnailUrl && typeof thumbnailUrl === "string") {
        if (post.thumbnail?.url !== thumbnailUrl) {
          post.thumbnail = { url: thumbnailUrl, public_id: "" };
        }
      } else {
        post.thumbnail = undefined as any;
      }
    }

    await post.save();
    res.json({ post });
  } catch (error: any) {
    console.error("Lỗi khi updatePost:", error);
    res.status(500).json({ error: error.message });
  }
};

export default handler;
