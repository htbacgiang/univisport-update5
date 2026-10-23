import mongoose from "mongoose";

const homepageSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    viewAllLink: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    productLimit: { type: Number, default: 12, min: 1, max: 50 },
    sectionBanner: {
      image: { type: String, default: "" },
      mobileImage: { type: String, default: "" },
      link: { type: String, default: "" },
      openInNewTab: { type: Boolean, default: false },
      isVisible: { type: Boolean, default: false },
      borderRadius: { type: Number, default: 8 },
    },
  },
  { timestamps: true }
);

const HomepageSection =
  mongoose.models.HomepageSection ||
  mongoose.model("HomepageSection", homepageSectionSchema);

export default HomepageSection;
