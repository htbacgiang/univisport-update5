import db from "../utils/db";
import CategoryArticleSetting from "../models/CategoryArticleSetting";
import CategoryArticle from "../models/CategoryArticle";
import Author from "../models/Author";
import {
  CATEGORY_ARTICLE_OPTIONS,
  getCategoryArticleLabel,
  isValidCategoryArticleSlug,
} from "./categoryArticleConstants";

export {
  CATEGORY_ARTICLE_OPTIONS,
  getCategoryArticleLabel,
  isValidCategoryArticleSlug,
} from "./categoryArticleConstants";

export const serializeCategoryArticle = (article) => {
  if (!article) return null;

  return {
    id: article._id?.toString() || article.id || "",
    title: article.title || getCategoryArticleLabel(article.categorySlug),
    categorySlug: article.categorySlug || "",
    content: article.content || "",
    faqs: Array.isArray(article.faqs)
      ? article.faqs.map((faq) => ({
          question: faq.question || "",
          answer: faq.answer || "",
        }))
      : [],
    postAuthorId: article.postAuthor?._id?.toString() || article.postAuthor?.toString() || "",
    postAuthor:
      article.postAuthor && article.postAuthor.name
        ? {
            name: article.postAuthor.name || "",
            slug: article.postAuthor.slug || "",
            role: article.postAuthor.role || "",
            bio: article.postAuthor.bio || "",
            avatar: article.postAuthor.avatar || "",
          }
        : null,
    createdAt: article.createdAt ? article.createdAt.toString() : "",
    updatedAt: article.updatedAt ? article.updatedAt.toString() : "",
  };
};

export const serializeCategoryArticleSetting = (setting, categorySlug) => ({
  categorySlug,
  articleType: setting?.articleType === "custom" ? "custom" : "default",
  articleId: setting?.article?._id?.toString() || setting?.article?.toString() || "",
  isVisible: setting ? Boolean(setting.isVisible) : true,
  article: serializeCategoryArticle(setting?.article),
});

export async function getCategoryArticleSetting(categorySlug) {
  await db.connectDb();
  const _categoryArticle = CategoryArticle;
  const _author = Author;

  const setting = await CategoryArticleSetting.findOne({ categorySlug })
    .populate({
      path: "article",
      select: "title categorySlug content faqs postAuthor createdAt updatedAt",
      populate: {
        path: "postAuthor",
        select: "name slug role bio avatar",
      },
    })
    .lean();

  return serializeCategoryArticleSetting(setting, categorySlug);
}
