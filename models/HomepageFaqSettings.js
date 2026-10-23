import mongoose from "mongoose";

const homepageFaqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    image: { type: String, default: "/images/thumb-univi.jpg", trim: true },
    video: { type: String, default: "", trim: true },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const homepageFaqSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "homepage",
      unique: true,
      immutable: true,
    },
    faqs: {
      type: [homepageFaqSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const HomepageFaqSettings =
  mongoose.models.HomepageFaqSettings ||
  mongoose.model("HomepageFaqSettings", homepageFaqSettingsSchema);

export default HomepageFaqSettings;
