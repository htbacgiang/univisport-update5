import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderCode: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false, default: null },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      title: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String },
      unit: { type: String },
    },
  ],
  shippingAddress: {
    address: { type: String, required: true },
  },
  phone: { type: String, required: true },
  name: { type: String, required: true },
  note: { type: String },
  coupon: { type: String },
  discount: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  totalAfterDiscount: { type: Number },
  shippingFee: { type: Number, default: 30000 }, // Thêm trường này
  finalTotal: { type: Number, required: true }, // <-- Thêm trường này
  paymentMethod: {
    type: String,
    enum: ["COD", "BankTransfer", "MoMo"],
    required: true,
  },
  paymentCode: { type: String, default: null },
  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
