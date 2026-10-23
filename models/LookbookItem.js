import mongoose from "mongoose";

const lookbookItemSchema = new mongoose.Schema(
  {
    image: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true },
    filterIds: [{ type: String, trim: true }],
    size: {
      type: String,
      enum: ["md", "tall", "lg"],
      default: "md",
    },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    aspectRatio: { type: Number, default: 1 },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const LookbookItem =
  mongoose.models.LookbookItem ||
  mongoose.model("LookbookItem", lookbookItemSchema);

export default LookbookItem;
