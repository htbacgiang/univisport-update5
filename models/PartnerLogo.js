import mongoose from "mongoose";

const partnerLogoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, required: true, trim: true },
    link: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    showOnHome: { type: Boolean, default: true },
    homeOrder: { type: Number, default: 0 },
    category: {
      type: String,
      enum: ["doanh-nghiep", "fitness-gym", "yoga-studio"],
      default: "doanh-nghiep",
    },
  },
  { timestamps: true }
);

const PartnerLogo =
  mongoose.models.PartnerLogo ||
  mongoose.model("PartnerLogo", partnerLogoSchema);

export default PartnerLogo;
