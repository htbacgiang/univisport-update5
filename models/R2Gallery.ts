import mongoose, { Schema, Document, Model } from "mongoose";

export interface IR2GalleryImage {
  src: string;
  altText?: string;
  width?: number;
  height?: number;
  ratioMode?: string;
}

export interface IR2Gallery extends Document {
  title: string;
  description?: string;
  images: IR2GalleryImage[];
  createdAt: Date;
  updatedAt: Date;
}

const R2GalleryImageSchema = new Schema(
  {
    src: { type: String, required: true, trim: true },
    altText: { type: String, default: "", trim: true },
    width: { type: Number, default: 4 },
    height: { type: Number, default: 3 },
    ratioMode: { type: String, default: "auto" },
  },
  { _id: false }
);

const R2GallerySchema = new Schema<IR2Gallery>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    images: { type: [R2GalleryImageSchema], default: [] },
  },
  { timestamps: true }
);

const R2Gallery: Model<IR2Gallery> =
  (mongoose.models.R2Gallery as Model<IR2Gallery>) ||
  mongoose.model<IR2Gallery>("R2Gallery", R2GallerySchema);

export default R2Gallery;
