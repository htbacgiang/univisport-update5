import { NextApiHandler } from "next";
import db from "../../../utils/db";
import { getToken } from "next-auth/jwt"; // Lấy token từ NextAuth.js
import { postValidationSchema, validateSchema } from "../../../lib/validator";
import { formatPosts, readFile, readPostsFromDb, countPostsFromDb, countPostsStatsFromDb } from "../../../lib/utils";
import Post from "../../../models/Post";
import formidable from "formidable";
import { uploadPostThumbnail } from "../../../lib/cloudinary-upload";
import { IncomingPost } from "../../../utils/types";

export const config = {
  api: { bodyParser: false },
};

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return readPosts(req, res);
    case "POST":
      return createNewPost(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const createNewPost: NextApiHandler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET });
  const session = token ? { user: token } : null;

  if (!session || !session.user || (session.user as any).role !== "admin") {
    return res.status(403).json({ error: "Chỉ admin mới có quyền đăng bài viết!" });
  }

  try {
    const { files, body } = await readFile<IncomingPost>(req);
    let tags = body.tags ? JSON.parse(body.tags as string) : [];

    // Kiểm tra dữ liệu đầu vào
    const error = validateSchema(postValidationSchema, { ...body, tags });
    if (error) return res.status(400).json({ error });

    const { title, content, slug, meta, category, thumbnailUrl, isFeatured: isFeaturedRaw, isDirectPost: isDirectPostRaw, faqs: faqsRaw, postAuthorId, keywords } = body;
    const isFeatured = isFeaturedRaw === "true";
    const isDirectPost = isDirectPostRaw === "true";
    let faqs = [];
    try {
      if (faqsRaw) faqs = JSON.parse(faqsRaw as string);
    } catch (e) {
      console.error("Lỗi parse faqs:", e);
    }

    await db.connectDb();

    const alreadyExists = await Post.findOne({ slug });
    if (alreadyExists) {
      return res.status(400).json({ error: "Slug phải là duy nhất!" });
    }

    if (isFeatured) {
      const featuredCount = await Post.countDocuments({ isFeatured: true });
      if (featuredCount >= 4) {
        return res.status(400).json({ error: "Chỉ được tối đa 4 bài viết nổi bật. Vui lòng bỏ chọn nổi bật cho bài khác trước!" });
      }
    }

    // Tạo bài viết mới
    const newPost = new Post({
      title,
      content,
      slug,
      meta,
      category: category || "",
      tags,
      isFeatured: isFeatured || false,
      isDirectPost: isDirectPost || false,
      faqs,
      postAuthor: (postAuthorId && postAuthorId !== "undefined" && postAuthorId !== "null" && postAuthorId !== "") ? postAuthorId : null,
      keywords: keywords || "",
    });

    // Xử lý thumbnail - có thể là file upload hoặc URL từ thư viện
    if (files.thumbnail) {
      const thumbnail = files.thumbnail as formidable.File;
      const { secure_url: url, public_id } = await uploadPostThumbnail(
        thumbnail.filepath,
        newPost._id.toString()
      );
      newPost.thumbnail = { url, public_id };
    } else if (thumbnailUrl) {
      // Sử dụng URL từ thư viện (đã có sẵn trên Cloudinary)
      newPost.thumbnail = { url: thumbnailUrl, public_id: "" };
    }

    await newPost.save();
    
    res.json({ post: newPost });
  } catch (error: any) {
    console.error("Lỗi tạo bài viết:", error);
    res.status(500).json({ error: "Lỗi máy chủ!" });
  }
};

const readPosts: NextApiHandler = async (req, res) => {
  try {
    const { limit, pageNo, skip, includeDrafts, search, timeframe, month, year, category } = req.query as {
      limit: string;
      pageNo: string;
      skip: string;
      includeDrafts?: string;
      search?: string;
      timeframe?: string;
      month?: string;
      year?: string;
      category?: string;
    };
    
    // Mặc định không hiển thị nháp, chỉ admin mới có thể xem nháp khi có tham số includeDrafts=true
    const secureCookie = process.env.NODE_ENV === "production" && 
      !req.headers.host?.includes("localhost") && 
      !req.headers.host?.includes("127.0.0.1");
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
      secureCookie,
    });
    const session = token ? { user: token } : null;
    const isAdmin = session?.user?.role === 'admin';
    const shouldIncludeDrafts = includeDrafts === 'true' && isAdmin;
    
    const parsedLimit = parseInt(limit) || 12;
    const parsedPageNo = parseInt(pageNo) || 0;
    const parsedSkip = skip !== undefined ? parseInt(skip) : undefined;

    const posts = await readPostsFromDb(
      parsedLimit,
      parsedPageNo,
      parsedSkip,
      shouldIncludeDrafts,
      isAdmin, // Nếu là admin thì hiện cả bài viết 2 cấp
      search,
      timeframe,
      month,
      year,
      category
    );

    const totalPosts = await countPostsFromDb(
      shouldIncludeDrafts,
      isAdmin,
      search,
      timeframe,
      month,
      year,
      category
    );

    const totalPages = Math.ceil(totalPosts / parsedLimit);

    // Lấy thông tin thống kê bài viết theo bộ lọc
    let stats = { total: totalPosts, published: totalPosts, drafts: 0 };
    if (isAdmin) {
      stats = await countPostsStatsFromDb(
        isAdmin, // includeDirectPosts nếu là admin
        search,
        timeframe,
        month,
        year
      );
    }

    res.json({
      posts: formatPosts(posts),
      totalPosts,
      totalPages,
      stats,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default handler;
