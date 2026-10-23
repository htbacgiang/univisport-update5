// Product Model - Updated with Gallery field
import mongoose from "mongoose";

const generateRandomReviewCount = () => Math.floor(Math.random() * 21) + 10;

const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  hex: {
    type: String,
    required: true,
    trim: true,
    match: [/^#([0-9A-F]{3,4}|[0-9A-F]{6}|[0-9A-F]{8})$/i, "Invalid hex color code"],
  },
  hex2: {
    type: String,
    trim: true,
    default: '',
    match: [/^(#([0-9A-F]{3,4}|[0-9A-F]{6}|[0-9A-F]{8}))?$/i, "Invalid hex2 color code"],
  },
  image: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (url) =>
        /^\/((image\/upload\/)?v\d+\/[^\s]+\.[a-zA-Z]{3,4}|images\/[^\s]+)$/.test(url) ||
        /^https?:\/\/[^\s$.?#].[^\s]*$/.test(url),
      message: "Invalid image path or URL",
    },
  },
});

const gallerySchema = new mongoose.Schema({
  src: {
    type: String,
    required: true,
    trim: true,
  },
  aspectRatio: {
    type: String,
    default: "landscape",
  },
  width: {
    type: Number,
    default: 16,
  },
  height: {
    type: Number,
    default: 9,
  },
});

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      trim: true,
      default: "",
    },
    answer: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    maSanPham: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: [/^[A-Za-z0-9_-]+$/, "Product code must contain only letters, numbers, underscores, or hyphens"],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    content: {
      type: String,
      default: "",
      trim: true,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredConfig: {
      customTitle: { type: String, default: "" },
      customSubtitle: { type: String, default: "" },
      customDescription: { type: String, default: "" },
      customImage: { type: String, default: "" },
      customSecondaryImage: { type: String, default: "" },
      videoUrl: { type: String, default: "" },
      badgeText: { type: String, default: "" },
      soldCount: { type: String, default: "" },
      recentCustomers: { type: String, default: "" },
    },
    visibleOnHome: {
      type: Boolean,
      default: true,
    },
    visibleOnArticle: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    categoryNameVN: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    colors: [colorSchema],
    gallery: [gallerySchema],
    faqs: {
      type: [faqSchema],
      default: [],
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
    image: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (url) =>
          /^\/image\/upload\/v\d+\/[^\s]+\.[a-zA-Z]{3,4}$/.test(url) ||
          /^https?:\/\/[^\s$.?#].[^\s]*$/.test(url),
        message: "Invalid image path or URL",
      },
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 5,
    },
    reviewCount: {
      type: Number,
      min: 0,
      default: generateRandomReviewCount,
    },
    // Lưu giá trị mặc định ban đầu để tính tổng hợp khi có review mới
    baseRating: {
      type: Number,
      min: 0,
      max: 5,
      default: null,
    },
    baseReviewCount: {
      type: Number,
      min: 0,
      default: null,
    },
    material: {
      type: String,
      trim: true,
      default: "",
    },
    shirtType: {
      type: String,
      trim: true,
      enum: ["", "ao-thun", "ao-polo"],
      default: "",
    },
    // Phân loại sâu hơn category: dòng sản phẩm (vd: ao-thun-fit-body, polo-the-thao)
    productLine: {
      type: String,
      trim: true,
      default: "",
    },
    // Kiểu cổ áo (vd: co-tron, co-tru, co-polo)
    collarType: {
      type: String,
      trim: true,
      default: "",
    },
    sizes: {
      type: [String],
      default: [],
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes with case-insensitive collation
productSchema.index({ id: 1 }, { unique: true });
productSchema.index({ maSanPham: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });
productSchema.index({ slug: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });
productSchema.index({ category: 1 });
productSchema.index({ isNew: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ visibleOnHome: 1 });
productSchema.index({ visibleOnArticle: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ category: 1, displayOrder: 1 });
productSchema.index({ category: 1, productLine: 1 });
productSchema.index({ category: 1, productLine: 1, collarType: 1 });

// Error handling middleware
productSchema.post("save", function (error, doc, next) {
  if (error.name === "ValidationError") {
    next(new Error(`Validation failed: ${error.message}`));
  } else {
    next(error);
  }
});

let Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
