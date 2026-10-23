import { getToken } from "next-auth/jwt";
import db from "../../../utils/db";
import CategoryArticle from "../../../models/CategoryArticle";
import CategoryArticleSetting from "../../../models/CategoryArticleSetting";
import Author from "../../../models/Author";
import {
  CATEGORY_ARTICLE_OPTIONS,
  getCategoryArticleLabel,
  isValidCategoryArticleSlug,
  serializeCategoryArticle,
  serializeCategoryArticleSetting,
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

  switch (req.method) {
    case "GET":
      return getDashboardData(req, res);
    case "POST":
      return createArticle(req, res);
    case "PUT":
      return updateSetting(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;

const getDashboardData = async (req, res) => {
  try {
    const _author = Author;
    const [settings, articles] = await Promise.all([
      CategoryArticleSetting.find({})
        .populate("article", "title categorySlug content faqs postAuthor createdAt updatedAt")
        .lean(),
      CategoryArticle.find({})
        .populate("postAuthor", "name slug role bio avatar")
        .sort({ createdAt: "desc" })
        .lean(),
    ]);

    const settingsBySlug = new Map(settings.map((setting) => [setting.categorySlug, setting]));
    const normalizedSettings = CATEGORY_ARTICLE_OPTIONS.map((category) => ({
      ...serializeCategoryArticleSetting(settingsBySlug.get(category.slug), category.slug),
      label: category.label,
    }));

    return res.json({
      categories: CATEGORY_ARTICLE_OPTIONS,
      settings: normalizedSettings,
      articles: articles.map(serializeCategoryArticle),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const createArticle = async (req, res) => {
  try {
    const { categorySlug, content, faqs, postAuthorId } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: "Vui lòng nhập nội dung bài viết." });
    }

    if (!isValidCategoryArticleSlug(categorySlug)) {
      return res.status(400).json({ error: "Danh mục không hợp lệ." });
    }

    const article = await CategoryArticle.create({
      title: getCategoryArticleLabel(categorySlug),
      categorySlug,
      content,
      faqs: normalizeFaqs(faqs),
      postAuthor: postAuthorId || null,
    });

    const populated = await CategoryArticle.findById(article._id)
      .populate("postAuthor", "name slug role bio avatar")
      .lean();

    return res.status(201).json({ article: serializeCategoryArticle(populated) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updateSetting = async (req, res) => {
  try {
    const { categorySlug, articleType, articleId, isVisible } = req.body;

    if (!isValidCategoryArticleSlug(categorySlug)) {
      return res.status(400).json({ error: "Danh mục không hợp lệ." });
    }

    if (!["default", "custom"].includes(articleType)) {
      return res.status(400).json({ error: "Loại bài viết không hợp lệ." });
    }

    let nextArticle = null;
    if (articleType === "custom") {
      if (!articleId) {
        return res.status(400).json({ error: "Vui lòng chọn bài viết danh mục." });
      }

      const article = await CategoryArticle.findById(articleId).select("_id categorySlug");
      if (!article) {
        return res.status(400).json({ error: "Bài viết danh mục không tồn tại." });
      }

      if (article.categorySlug !== categorySlug) {
        return res.status(400).json({ error: "Bài viết không thuộc danh mục đang cấu hình." });
      }

      nextArticle = article._id;
    }

    const setting = await CategoryArticleSetting.findOneAndUpdate(
      { categorySlug },
      {
        categorySlug,
        articleType,
        article: nextArticle,
        isVisible: Boolean(isVisible),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .populate("article", "title categorySlug content faqs postAuthor createdAt updatedAt")
      .lean();

    return res.json({
      setting: serializeCategoryArticleSetting(setting, categorySlug),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
