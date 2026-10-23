import { Schema, models, model, Model } from "mongoose";

export interface ImageModelSchema {
  _id: string;
  src: string;
  altText?: string;
  publicId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<ImageModelSchema>(
  {
    src: {
      type: String,
      required: true,
      unique: true,
    },
    altText: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Image = models?.Image || model("Image", ImageSchema);

export default Image as Model<ImageModelSchema>;
