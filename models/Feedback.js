import mongoose from "mongoose";

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

const feedbackSchema = new mongoose.Schema(
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
    customer: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ["Đồng phục thể thao", "Đồng phục CLB", "Đồng phục doanh nghiệp"],
      default: "Đồng phục thể thao",
    },
    industry: {
      type: String,
      trim: true,
      enum: ["Gym", "Yoga", "Pickleball", "Fitness", "MMA", "Running", "Golf", "Tennis", ""],
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
      default: "",
    },
    gallery: [gallerySchema],
    overview: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 5,
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    employeeCount: {
      type: String,
      trim: true,
      default: "",
    },
    serviceTags: {
      type: String,
      trim: true,
      default: "",
    },
    productLines: {
      type: Number,
      min: 0,
      default: 0,
    },
    year: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
feedbackSchema.index({ slug: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });
feedbackSchema.index({ createdAt: -1 });

// Error handling middleware
feedbackSchema.post("save", function (error, doc, next) {
  if (error.name === "ValidationError") {
    next(new Error(`Validation failed: ${error.message}`));
  } else {
    next(error);
  }
});

let Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
export default Feedback;
