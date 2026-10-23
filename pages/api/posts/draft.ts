import { NextApiHandler } from "next";
import db from "../../../utils/db";
import { getToken } from "next-auth/jwt";
import Post from "../../../models/Post";
import formidable from "formidable";
import cloudinary from "../../../lib/cloudinary";
import { uploadPostThumbnail } from "../../../lib/cloudinary-upload";
import { IncomingPost } from "../../../utils/types";

export const config = {
  api: { 
    bodyParser: false,
  },
};

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "POST":
      return saveDraft(req, res);
    case "PUT":
      return updateDraftStatus(req, res);
    case "GET":
      return getDrafts(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const saveDraft: NextApiHandler = async (req, res) => {
  const secureCookie = process.env.NODE_ENV === "production" && 
    !req.headers.host?.includes("localhost") && 
    !req.headers.host?.includes("127.0.0.1");
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
    secureCookie,
  });
  const session = token ? { user: token } : null;

  if (!session || !session.user) {
    return res.status(401).json({ error: "Bạn cần đăng nhập để lưu nháp!" });
  }

  try {
    // Xử lý FormData (cho việc upload file)
    const { files, fields } = await readFile<IncomingPost>(req);
    let tags: string[] = [];
    
    try {
      if (fields.tags && typeof fields.tags === 'string') {
        tags = JSON.parse(fields.tags);
      }
    } catch (parseError) {
      console.error("Lỗi parse tags:", parseError);
      tags = [];
    }

    const { title, content, slug, meta, category, focusKeyword, thumbnailUrl, isDirectPost, faqs: faqsRaw, postAuthorId } = fields as any;
    const isDirectPostBool = isDirectPost === "true";
    let faqs = [];
    try {
      if (faqsRaw) faqs = JSON.parse(faqsRaw as string);
    } catch (e) {
      console.error("Lỗi parse faqs:", e);
    }
    const postId = (fields as any).postId;

      await db.connectDb();

      // Xử lý FormData logic...
      // Nếu có postId, cập nhật bài viết hiện có
      if (postId) {
        const existingPost = await Post.findById(postId);
        if (!existingPost) {
          return res.status(404).json({ error: "Không tìm thấy bài viết!" });
        }

        // Kiểm tra quyền sở hữu - Admin có thể chỉnh sửa mọi bài viết
        const isAdmin = session.user.role === 'admin';
        const isOwner = existingPost.author && existingPost.author.toString() === session.user.sub;
        
        if (!isAdmin && !isOwner) {
          return res.status(403).json({ error: "Bạn không có quyền chỉnh sửa bài viết này!" });
        }

        // Cập nhật bài viết
        existingPost.title = title || existingPost.title;
        existingPost.content = content || existingPost.content;
        existingPost.meta = meta || existingPost.meta;
        existingPost.tags = tags;
        if (category !== undefined) existingPost.category = category;
        existingPost.focusKeyword = focusKeyword || existingPost.focusKeyword;
        existingPost.isDraft = true;
        if (isDirectPost !== undefined) existingPost.isDirectPost = isDirectPostBool;
        existingPost.faqs = faqs;
        existingPost.postAuthor = postAuthorId || null;

        // Xử lý thumbnail - có thể là file upload hoặc URL từ thư viện
        if (files.thumbnail) {
          const thumbnail = files.thumbnail as formidable.File;
          const oldPublicId = existingPost.thumbnail?.public_id;
          const { secure_url: url, public_id } = await uploadPostThumbnail(
            thumbnail.filepath,
            existingPost._id.toString()
          );

          if (oldPublicId && oldPublicId !== public_id) {
            await cloudinary.uploader.destroy(oldPublicId);
          }

          existingPost.thumbnail = { url, public_id };
        } else if (thumbnailUrl) {
          // Sử dụng URL từ thư viện (đã có sẵn trên Cloudinary)
          existingPost.thumbnail = { url: thumbnailUrl, public_id: "" };
        }

        await existingPost.save();
        return res.json({ post: existingPost, message: "Đã lưu nháp thành công!" });
      }

      // Tạo bài viết nháp mới
      const newDraft = new Post({
        title: title || "Nháp bài viết",
        content: content || "",
        slug: slug || `draft-${Date.now()}`,
        meta: meta || "",
        tags,
        category: category || "",
        focusKeyword: focusKeyword || "",
        author: session.user.sub,
        isDraft: true,
        isDirectPost: isDirectPostBool,
        faqs,
        postAuthor: postAuthorId || null,
      });

      // Xử lý thumbnail - có thể là file upload hoặc URL từ thư viện
      if (files.thumbnail) {
        const thumbnail = files.thumbnail as formidable.File;
        const { secure_url: url, public_id } = await uploadPostThumbnail(
          thumbnail.filepath,
          newDraft._id.toString()
        );
        newDraft.thumbnail = { url, public_id };
      } else if (thumbnailUrl) {
        // Sử dụng URL từ thư viện (đã có sẵn trên Cloudinary)
        newDraft.thumbnail = { url: thumbnailUrl, public_id: "" };
      }

      await newDraft.save();
      res.json({ post: newDraft, message: "Đã tạo nháp mới!" });
  } catch (error: any) {
    console.error("Lỗi lưu nháp:", error);
    res.status(500).json({ error: "Lỗi máy chủ!" });
  }
};

const updateDraftStatus: NextApiHandler = async (req, res) => {
  const secureCookie = process.env.NODE_ENV === "production" && 
    !req.headers.host?.includes("localhost") && 
    !req.headers.host?.includes("127.0.0.1");
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
    secureCookie,
  });
  const session = token ? { user: token } : null;

  if (!session || !session.user) {
    return res.status(401).json({ error: "Bạn cần đăng nhập!" });
  }

  try {
    const body = await parseJsonBody(req);
    const { postId, isDraft } = body;
    
    await db.connectDb();

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài viết!" });
    }

    // Kiểm tra quyền sở hữu - Admin có thể chỉnh sửa mọi bài viết
    const isAdmin = session.user.role === 'admin';
    const isOwner = post.author && post.author.toString() === session.user.sub;
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Bạn không có quyền chỉnh sửa bài viết này!" });
    }

    post.isDraft = isDraft;
    await post.save();

    res.json({ post, message: isDraft ? "Đã chuyển về nháp!" : "Đã xuất bản!" });
  } catch (error: any) {
    console.error("Lỗi cập nhật trạng thái:", error);
    res.status(500).json({ error: "Lỗi máy chủ!" });
  }
};



const getDrafts: NextApiHandler = async (req, res) => {
  const secureCookie = process.env.NODE_ENV === "production" && 
    !req.headers.host?.includes("localhost") && 
    !req.headers.host?.includes("127.0.0.1");
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
    secureCookie,
  });
  const session = token ? { user: token } : null;

  if (!session || !session.user) {
    return res.status(401).json({ error: "Bạn cần đăng nhập!" });
  }

  try {
    await db.connectDb();

    const drafts = await Post.find({ 
      author: session.user.sub, 
      isDraft: true 
    }).sort({ updatedAt: -1 });

    res.json({ drafts });
  } catch (error: any) {
    console.error("Lỗi lấy danh sách nháp:", error);
    res.status(500).json({ error: "Lỗi máy chủ!" });
  }
};

// Helper function để đọc file từ formidable
const readFile = async <T>(req: any): Promise<{ fields: T; files: any }> => {
  return new Promise((resolve, reject) => {
    const form = formidable();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields: fields as T, files });
    });
  });
};

// Helper function để parse JSON body
const parseJsonBody = async (req: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: any) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        resolve(parsed);
      } catch (error) {
        reject(error);
      }
    });
  });
};

export default handler;
