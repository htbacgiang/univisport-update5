import mongoose from "mongoose";

const PageViewSchema = new mongoose.Schema(
  {
    viewId: { type: String, default: "", index: true }, // client-generated, dùng để update duration
    path: { type: String, required: true, index: true },
    title: { type: String, default: "" },
    duration: { type: Number, default: 0 }, // giây, 0 = chưa rời trang
    referrer: { type: String, default: "" },
    sessionId: { type: String, default: "", index: true },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true }
);

const PageView =
  mongoose.models.PageView || mongoose.model("PageView", PageViewSchema);

export default PageView;
