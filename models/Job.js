import { model, models, Schema } from "mongoose";

const JobSchema = new Schema(
  {
    title: { type: String, required: true },
    department: { type: String },
    location: { type: String },
    type: { type: String },
    salary: { type: String },
    experience: { type: String },
    description: { type: String },
    requirements: [{ type: String }],
    benefits: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Job = models.Job || model("Job", JobSchema);
