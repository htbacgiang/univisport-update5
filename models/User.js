import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const addressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["home", "office"],
    default: "home",
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address1: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  cityName: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  districtName: {
    type: String,
    required: true,
  },
  ward: {
    type: String,
    required: true,
  },
  wardName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: "Vietnam",
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Please enter your full name.",
    },
    email: {
      type: String,
      required: "Please enter your email address.",
      trim: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
      match: /^[0-9]{10,11}$/,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dmhcnhtng/image/upload/v1664642478/992490_b0iqzq.png",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    agree: { type: Boolean },
    defaultShippingAddress: { type: String, default: '' },
    defaultPaymentMethod: {
      type: String,
      default: "",
    },
    // Các trường cá nhân độc lập (lưu trực tiếp tại user)
    gender: { type: String, enum: ["Nam", "Nữ", "Khác"] },
    dateOfBirth: { type: Date },
    address: [addressSchema],
    wishlist: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
        },
        style: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
