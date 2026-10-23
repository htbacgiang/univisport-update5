import mongoose from "mongoose";

const categoryArticleSettingSchema = new mongoose.Schema(
  {
    categorySlug: { type: String, required: true, unique: true, trim: true },
    articleType: {
      type: String,
      enum: ["default", "custom"],
      default: "default",
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryArticle",
      default: null,
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const CategoryArticleSetting =
  mongoose.models.CategoryArticleSetting ||
  mongoose.model("CategoryArticleSetting", categoryArticleSettingSchema);

export default CategoryArticleSetting;
