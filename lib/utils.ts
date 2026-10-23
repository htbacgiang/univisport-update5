import formidable from "formidable";
import { NextApiRequest } from "next";
import Post, { PostModelSchema } from "../models/Post";
import { CommentResponse, PostDetail, UserProfile } from "../utils/types";
import db from "../utils/db";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface FormidablePromise<T> {
  files: formidable.Files;
  body: T;
}

export const readFile = <T extends object>(
  req: NextApiRequest
): Promise<FormidablePromise<T>> => {
  const form = formidable();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ files, body: fields as T });
    });
  });
};

/**
 * Lấy tất cả bài viết mà không giới hạn.
 */
export const readAllPostsFromDb = async (
  includeDrafts: boolean = false,
  includeDirectPosts: boolean = false
): Promise<PostModelSchema[]> => {
  await db.connectDb();
  // Tạo filter để loại trừ nháp nếu không includeDrafts
  const filter: any = includeDrafts ? {} : { isDraft: { $ne: true } };

  // Mặc định loại bỏ bài viết 2 cấp (isDirectPost) khỏi danh sách chung (trang chủ, blog),
  // trừ khi bài viết đó là bài viết nổi bật (isFeatured === true)
  if (!includeDirectPosts) {
    filter.$or = [
      { isDirectPost: { $ne: true } },
      { isFeatured: true }
    ];
  }
  
  return await Post.find(filter)
    .sort({ createdAt: "desc" })
    .select("-content");
};

/**
 * Lấy bài viết phân trang với giới hạn tối đa 100 bản ghi.
 */
export const readPostsFromDb = async (
  limit: number,
  pageNo: number,
  skip?: number,
  includeDrafts: boolean = false,
  includeDirectPosts: boolean = false,
  search?: string,
  timeframe?: string,
  month?: string,
  year?: string,
  category?: string
): Promise<PostModelSchema[]> => {
  // Áp dụng giới hạn an toàn
  const safeLimit = Math.min(limit, 100);
  const finalSkip = skip !== undefined ? skip : safeLimit * pageNo;
  await db.connectDb();
  
  // Tạo filter để loại trừ nháp nếu không includeDrafts
  const filter: any = includeDrafts ? {} : { isDraft: { $ne: true } };

  // Mặc định loại bỏ bài viết 2 cấp (isDirectPost) khỏi danh sách chung (trang chủ, blog),
  // trừ khi bài viết đó là bài viết nổi bật (isFeatured === true)
  if (!includeDirectPosts) {
    filter.$or = [
      { isDirectPost: { $ne: true } },
      { isFeatured: true }
    ];
  }

  if (category) {
    filter.category = new RegExp(`^${category.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, "i");
  }

  // Lọc theo từ khóa tìm kiếm (search)
  if (search) {
    const searchRegex = new RegExp(search, "i");
    filter.$or = [
      { title: searchRegex },
      { slug: searchRegex },
      { keywords: searchRegex },
    ];
  }

  // Lọc theo mốc thời gian (timeframe) hoặc tháng/năm cụ thể
  if (timeframe === "custom") {
    const parsedYear = year ? parseInt(year) : new Date().getFullYear();
    if (month) {
      const parsedMonth = parseInt(month) - 1; // 0-indexed in JS Date
      const startDate = new Date(parsedYear, parsedMonth, 1);
      const endDate = new Date(parsedYear, parsedMonth + 1, 0, 23, 59, 59, 999);
      filter.createdAt = { $gte: startDate, $lte: endDate };
    } else {
      // Chỉ lọc theo năm
      const startDate = new Date(parsedYear, 0, 1);
      const endDate = new Date(parsedYear, 11, 31, 23, 59, 59, 999);
      filter.createdAt = { $gte: startDate, $lte: endDate };
    }
  } else if (timeframe) {
    const now = new Date();
    if (timeframe === "week") {
      const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filter.createdAt = { $gte: startDate };
    } else if (timeframe === "month") {
      // Tháng hiện tại (tháng này)
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      filter.createdAt = { $gte: startDate, $lte: endDate };
    } else if (timeframe === "last_month") {
      // Tháng trước (toàn bộ tháng trước)
      const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      filter.createdAt = { $gte: startDate, $lte: endDate };
    } else if (timeframe === "year") {
      // Năm hiện tại (năm nay)
      const startDate = new Date(now.getFullYear(), 0, 1);
      const endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      filter.createdAt = { $gte: startDate, $lte: endDate };
    }
  }
  
  return await Post.find(filter)
    .sort({ createdAt: "desc" })
    .select("-content")
    .skip(finalSkip)
    .limit(safeLimit);
};

/**
 * Đếm số lượng bài viết thỏa mãn bộ lọc.
 */
export const countPostsFromDb = async (
  includeDrafts: boolean = false,
  includeDirectPosts: boolean = false,
  search?: string,
  timeframe?: string,
  month?: string,
  year?: string,
  category?: string
): Promise<number> => {
  await db.connectDb();
  const filter: any = includeDrafts ? {} : { isDraft: { $ne: true } };

  if (!includeDirectPosts) {
    filter.$or = [
      { isDirectPost: { $ne: true } },
      { isFeatured: true }
    ];
  }

  if (category) {
    filter.category = new RegExp(`^${category.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, "i");
  }

  if (search) {
    const searchRegex = new RegExp(search, "i");
    filter.$or = [
      { title: searchRegex },
      { slug: searchRegex },
      { keywords: searchRegex },
    ];
  }

  if (timeframe === "custom") {
    const parsedYear = year ? parseInt(year) : new Date().getFullYear();
    if (month) {
      const parsedMonth = parseInt(month) - 1;
      const startDate = new Date(parsedYear, parsedMonth, 1);
      const endDate = new Date(parsedYear, parsedMonth + 1, 0, 23, 59, 59, 999);
      filter.createdAt = { $gte: startDate, $lte: endDate };
    } else {
      const startDate = new Date(parsedYear, 0, 1);
      const endDate = new Date(parsedYear, 11, 31, 23, 59, 59, 999);
      filter.createdAt = { $gte: startDate, $lte: endDate };
    }
  } else if (timeframe) {
    const now = new Date();
    if (timeframe === "week") {
      const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filter.createdAt = { $gte: startDate };
    } else if (timeframe === "month") {
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      filter.createdAt = { $gte: startDate, $lte: endDate };
    } else if (timeframe === "last_month") {
      const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      filter.createdAt = { $gte: startDate, $lte: endDate };
    } else if (timeframe === "year") {
      const startDate = new Date(now.getFullYear(), 0, 1);
      const endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      filter.createdAt = { $gte: startDate, $lte: endDate };
    }
  }

  return await Post.countDocuments(filter);
};

export const formatPosts = (
  posts: PostModelSchema[]
): PostDetail[] => {
  return posts.map((post) => ({
    id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    category: post.category || "",
    createdAt: post.createdAt.toString(),
    thumbnail: post.thumbnail?.url || "",
    meta: post.meta,
    tags: post.tags,
    isDraft: post.isDraft || false,
    isFeatured: post.isFeatured || false,
    featuredOrder: post.featuredOrder,
    isDirectPost: post.isDirectPost || false,
    faqs: post.faqs && Array.isArray(post.faqs) 
      ? post.faqs.map((faq: any) => ({ question: faq.question || "", answer: faq.answer || "" })) 
      : [],
    postAuthorId: post.postAuthor?.toString() || "",
    keywords: post.keywords || "",
  }));
};

export const countPostsStatsFromDb = async (
  includeDirectPosts: boolean = false,
  search?: string,
  timeframe?: string,
  month?: string,
  year?: string
): Promise<{ total: number; published: number; drafts: number }> => {
  await db.connectDb();
  
  // Base filter (without draft restrictions)
  const baseFilter: any = {};

  if (!includeDirectPosts) {
    baseFilter.$or = [
      { isDirectPost: { $ne: true } },
      { isFeatured: true }
    ];
  }

  if (search) {
    const searchRegex = new RegExp(search, "i");
    baseFilter.$or = [
      { title: searchRegex },
      { slug: searchRegex },
      { keywords: searchRegex },
    ];
  }

  if (timeframe === "custom") {
    const parsedYear = year ? parseInt(year) : new Date().getFullYear();
    if (month) {
      const parsedMonth = parseInt(month) - 1; // 0-indexed in JS Date
      const startDate = new Date(parsedYear, parsedMonth, 1);
      const endDate = new Date(parsedYear, parsedMonth + 1, 0, 23, 59, 59, 999);
      baseFilter.createdAt = { $gte: startDate, $lte: endDate };
    } else {
      const startDate = new Date(parsedYear, 0, 1);
      const endDate = new Date(parsedYear, 11, 31, 23, 59, 59, 999);
      baseFilter.createdAt = { $gte: startDate, $lte: endDate };
    }
  } else if (timeframe) {
    const now = new Date();
    if (timeframe === "week") {
      const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      baseFilter.createdAt = { $gte: startDate };
    } else if (timeframe === "month") {
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      baseFilter.createdAt = { $gte: startDate, $lte: endDate };
    } else if (timeframe === "last_month") {
      const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      baseFilter.createdAt = { $gte: startDate, $lte: endDate };
    } else if (timeframe === "year") {
      const startDate = new Date(now.getFullYear(), 0, 1);
      const endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      baseFilter.createdAt = { $gte: startDate, $lte: endDate };
    }
  }

  const [total, drafts] = await Promise.all([
    Post.countDocuments(baseFilter),
    Post.countDocuments({ ...baseFilter, isDraft: true })
  ]);
  const published = total - drafts;

  return { total, published, drafts };
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
