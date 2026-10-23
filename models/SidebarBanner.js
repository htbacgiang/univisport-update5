import mongoose from "mongoose";

const sidebarBannerSchema = new mongoose.Schema(
  {
    image: { type: String, required: true, trim: true },
    alt: { type: String, default: "", trim: true },
    link: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SidebarBanner =
  mongoose.models.SidebarBanner ||
  mongoose.model("SidebarBanner", sidebarBannerSchema);

export default SidebarBanner;
