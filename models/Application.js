import { model, models, Schema, Types } from "mongoose";

const ApplicationSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    jobId: { type: Types.ObjectId, ref: "Job" },
    position: { type: String },
    message: { type: String },
    cvUrl: { type: String },
    status: {
      type: String,
      enum: ["pending", "reviewed", "rejected", "accepted"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Application = models.Application || model("Application", ApplicationSchema);
