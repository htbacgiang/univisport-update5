import mongoose from "mongoose";

const trackingSettingSchema = new mongoose.Schema(
  {
    key: { type: String, default: "global", unique: true, index: true },
    trackingMode: {
      type: String,
      enum: ["consent", "notice", "always"],
      default: "consent",
    },
    metaPixel: {
      enabled: { type: Boolean, default: false },
      pixelId: { type: String, default: "YOUR_PIXEL_ID", trim: true },
    },
    ga4: {
      enabled: { type: Boolean, default: false },
      measurementId: { type: String, default: "", trim: true },
    },
    tiktokPixel: {
      enabled: { type: Boolean, default: false },
      pixelId: { type: String, default: "", trim: true },
    },
    googleTagManager: {
      enabled: { type: Boolean, default: false },
      containerId: { type: String, default: "", trim: true },
    },
    cookieConsent: {
      enabled: { type: Boolean, default: true },
      message: { type: String, default: "", trim: true },
      primaryColor: { type: String, default: "#105d97", trim: true },
      defaultConsent: {
        type: String,
        enum: ["revoked", "granted"],
        default: "revoked",
      },
    },
    supportedEvents: [{ type: String }],
  },
  { timestamps: true }
);

const TrackingSetting =
  mongoose.models.TrackingSetting ||
  mongoose.model("TrackingSetting", trackingSettingSchema);

export default TrackingSetting;
