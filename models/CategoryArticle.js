import mongoose from "mongoose";

const categoryArticleSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    categorySlug: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    faqs: {
      type: [{ question: String, answer: String }],
      default: [],
    },
    postAuthor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      default: null,
    },
  },
  { timestamps: true }
);

const CategoryArticle =
  mongoose.models.CategoryArticle ||
  mongoose.model("CategoryArticle", categoryArticleSchema);

export default CategoryArticle;
