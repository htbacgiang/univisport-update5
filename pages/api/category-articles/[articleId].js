import { getToken } from "next-auth/jwt";
import db from "../../../utils/db";
import CategoryArticle from "../../../models/CategoryArticle";
import CategoryArticleSetting from "../../../models/CategoryArticleSetting";
import Author from "../../../models/Author";
import {
  getCategoryArticleLabel,
  isValidCategoryArticleSlug,
  serializeCategoryArticle,
} from "../../../lib/categoryArticleSettings";

const requireAdmin = async (req, res) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  });

  if (!token || token.role !== "admin") {
    res.status(401).json({ error: "Bạn cần quyền admin để thực hiện thao tác này." });
    return null;
  }

  return token;
};

const normalizeFaqs = (faqs) => {
  if (!Array.isArray(faqs)) return [];
  return faqs
    .map((faq) => ({
      question: String(faq.question || "").trim(),
      answer: String(faq.answer || "").trim(),
    }))
    .filter((faq) => faq.question || faq.answer);
};

const handler = async (req, res) => {
  const token = await requireAdmin(req, res);
  if (!token) return;

  try {
    await db.connectDb();
  } catch {
    return res.status(500).json({ error: "Database connection failed" });
  }
  const _author = Author;

  switch (req.method) {
    case "PATCH":
      return updateArticle(req, res);
    case "DELETE":
      return deleteArticle(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;

const updateArticle = async (req, res) => {
  try {
    const { articleId } = req.query;
    const { categorySlug, content, faqs, postAuthorId } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: "Vui lòng nhập nội dung bài viết." });
    }

    if (!isValidCategoryArticleSlug(categorySlug)) {
      return res.status(400).json({ error: "Danh mục không hợp lệ." });
    }

    const article = await CategoryArticle.findByIdAndUpdate(
      articleId,
      {
        title: getCategoryArticleLabel(categorySlug),
        categorySlug,
        content,
        faqs: normalizeFaqs(faqs),
        postAuthor: postAuthorId || null,
      },
      { new: true }
    )
      .populate("postAuthor", "name slug role bio avatar")
      .lean();

    if (!article) return res.status(404).json({ error: "Không tìm thấy bài viết danh mục." });

    await CategoryArticleSetting.updateMany(
      { article: article._id, categorySlug: { $ne: categorySlug } },
      { articleType: "default", article: null, isVisible: false }
    );

    return res.json({ article: serializeCategoryArticle(article) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { articleId } = req.query;
    const article = await CategoryArticle.findByIdAndDelete(articleId);
    if (!article) return res.status(404).json({ error: "Không tìm thấy bài viết danh mục." });

    await CategoryArticleSetting.updateMany(
      { article: article._id },
      { articleType: "default", article: null, isVisible: false }
    );

    return res.json({ removed: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
