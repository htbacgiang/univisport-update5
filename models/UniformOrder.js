import mongoose from "mongoose";

const CraftPositionSchema = new mongoose.Schema(
  {
    technique: { type: String, default: "" }, // Chế tác (In pet, In decal, Thêu vi tính...)
    size: { type: String, default: "" },      // Kích thước (vd: 8x5cm, Logo ngực...)
    image: { type: String, default: "" },     // Ảnh vị trí/chi tiết
    note: { type: String, default: "" },
  },
  { _id: false }
);

const SizeRowSchema = new mongoose.Schema(
  {
    S: { type: Number, default: 0 },
    M: { type: Number, default: 0 },
    L: { type: Number, default: 0 },
    XL: { type: Number, default: 0 },
    "2XL": { type: Number, default: 0 },
    "3XL": { type: Number, default: 0 },
    "4XL": { type: Number, default: 0 },
    "5XL": { type: Number, default: 0 },
  },
  { _id: false }
);

const UniformOrderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true }, // Mã đơn (vd: UBB-241010-01)
    reportDate: { type: String, default: "" },                 // Ngày lên biên bản (vd: 10/10)
    orderDate: { type: String, default: "" },                  // Ngày lên đơn (vd: 10/10/2026)
    
    // Khách hàng & Kênh
    customerName: { type: String, required: true },
    customerPhone: { type: String, default: "" },
    customerAddress: { type: String, default: "" },
    customerFacebook: { type: String, default: "" }, // Link Facebook / Fanpage của khách
    customerWebsite: { type: String, default: "" },  // Link Website của khách
    channel: { type: String, default: "Zalo" }, // Zalo, Facebook, Hotline, Showroom, Khách quen...
    salesRep: { type: String, default: "" },    // Nhân viên phụ trách
    
    // Hình ảnh Mockup áo
    mockupFront: { type: String, default: "" },  // Ảnh mặt trước
    mockupBack: { type: String, default: "" },   // Ảnh mặt sau
    mockupFull: { type: String, default: "" },   // Ảnh thiết kế tổng thể nếu có
    
    // Thiết kế & Quy cách may
    designCodes: [{ type: String }],             // vd: ["MAG18_UA01DE08_UNIA12_VC02", "GAG18_UA01DE08_UNIA12_VC02"]
    sewingDetails: [{ type: String }],           // vd: ["Chỉ trần Vàng chanh", "Phối vải lỗ vàng chanh", "Cổ trụ, khoá kéo"]
    fabric: { type: String, default: "" },       // Chất liệu vải
    colors: { type: String, default: "" },       // Màu sắc vải / phối màu
    
    // 4 vị trí chế tác in/thêu
    craftPositions: {
      front: { type: CraftPositionSchema, default: () => ({}) },       // MẶT TRƯỚC
      leftSleeve: { type: CraftPositionSchema, default: () => ({}) },  // TAY TRÁI
      back: { type: CraftPositionSchema, default: () => ({}) },        // MẶT SAU
      rightSleeve: { type: CraftPositionSchema, default: () => ({}) }, // TAY PHẢI
    },
    
    // Bảng số lượng size
    sizes: {
      men: { type: SizeRowSchema, default: () => ({}) },
      women: { type: SizeRowSchema, default: () => ({}) },
    },
    totalMen: { type: Number, default: 0 },
    totalWomen: { type: Number, default: 0 },
    totalQuantity: { type: Number, default: 0 }, // Tổng số lượng áo (số màu đỏ)
    
    // Hạn sản xuất & Giao hàng
    completionDate: { type: String, default: "" }, // NGÀY XONG
    deliveryDate: { type: String, default: "" },   // NGÀY TRẢ
    
    // Lưu ý sản xuất (ô Lưu ý trong ảnh mẫu)
    note: { type: String, default: "" },
    
    // Tài chính
    unitPrice: { type: Number, default: 0 },      // Đơn giá / cái
    totalAmount: { type: Number, default: 0 },    // Tổng tiền
    deposit: { type: Number, default: 0 },        // Đã cọc
    remaining: { type: Number, default: 0 },      // Còn lại
    
    // Trạng thái đơn hàng
    status: {
      type: String,
      enum: ["pending", "in_production", "completed", "delivering", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.UniformOrder || mongoose.model("UniformOrder", UniformOrderSchema);
