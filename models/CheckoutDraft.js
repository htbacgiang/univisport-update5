import mongoose from "mongoose";

const CheckoutDraftSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  draft: { type: mongoose.Schema.Types.Mixed, default: {} },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.CheckoutDraft ||
  mongoose.model("CheckoutDraft", CheckoutDraftSchema);
