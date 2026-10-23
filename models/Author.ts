import { Schema, models, model, ObjectId, Model } from "mongoose";

export interface AuthorModelSchema {
  _id: ObjectId;
  name: string;
  slug: string;
  role?: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    facebook?: string;
    zalo?: string;
    linkedin?: string;
  };
  createdAt: Date;
}

const AuthorSchema = new Schema<AuthorModelSchema>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    socialLinks: {
      facebook: { type: String },
      zalo: { type: String },
      linkedin: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const Author = models?.Author || model("Author", AuthorSchema);

export default Author as Model<AuthorModelSchema>;
