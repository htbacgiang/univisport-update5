import mongoose from "mongoose";

const homepageVideoFeedbackSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["local", "facebook"],
      default: "local",
    },
    title: { type: String, required: true, trim: true },
    src: { type: String, default: "", trim: true },
    fbUrl: { type: String, default: "", trim: true },
    poster: { type: String, default: "", trim: true },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const homepageVideoFeedbackSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "homepage",
      unique: true,
      immutable: true,
    },
    videos: {
      type: [homepageVideoFeedbackSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const HomepageVideoFeedbackSettings =
  mongoose.models.HomepageVideoFeedbackSettings ||
  mongoose.model(
    "HomepageVideoFeedbackSettings",
    homepageVideoFeedbackSettingsSchema
  );

export default HomepageVideoFeedbackSettings;
