import { Schema, models, model, ObjectId, Model } from "mongoose";

// title, content, slug, tags, thumbnail, meta, author, date
export interface PostModelSchema {
  _id: ObjectId;
  title: string;
  slug: string;
  meta: string;
  content: string;
  category: string;
  tags: string[];
  thumbnail?: { url: string; public_id: string };
  author: ObjectId;
  createdAt: Date;
  focusKeyword?: string;
  isDraft?: boolean;
  isFeatured?: boolean;
  featuredOrder?: number;
  isDirectPost?: boolean;
  faqs?: { question: string; answer: string }[];
  postAuthor?: ObjectId;
  keywords?: string;
}

const PostSchema = new Schema<PostModelSchema>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
  },
    meta: {
      type: String,
      required: true,
      trim: true,
    },
    keywords: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
    },
    thumbnail: {
      type: Object,
      url: String,
      public_id: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    focusKeyword: {
      type: String,
      trim: true,
    },
    isDraft: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredOrder: {
      type: Number,
      default: null,
    },
    isDirectPost: {
      type: Boolean,
      default: false,
    },
    faqs: {
      type: [{ question: String, answer: String }],
      default: [],
    },
    postAuthor: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Post = models?.Post || model("Post", PostSchema);

export default Post as Model<PostModelSchema>;
