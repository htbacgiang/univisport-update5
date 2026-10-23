import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: ObjectId, ref: "Product", required: true },
      title: String,
      image: String,
      quantity: { type: Number, default: 1 },
      price: Number,
      color: { type: String, default: "" },
      colorHex: { type: String, default: "" },
      size: { type: String, default: "" },
    },
  ],
  cartTotal: { type: Number, default: 0 },
  totalAfterDiscount: { type: Number, default: 0 },
  coupon: { type: String, default: "" },
  // Lưu discount nếu muốn
  discount: { type: Number, default: 0 },
  user: { type: ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;
