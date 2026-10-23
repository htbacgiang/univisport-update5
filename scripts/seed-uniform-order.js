const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());
const mongoose = require("mongoose");

const UniformOrderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true },
    reportDate: { type: String, default: "" },
    orderDate: { type: String, default: "" },
    customerName: { type: String, required: true },
    customerPhone: { type: String, default: "" },
    customerAddress: { type: String, default: "" },
    channel: { type: String, default: "Zalo" },
    salesRep: { type: String, default: "" },

    mockupFront: { type: String, default: "" },
    mockupBack: { type: String, default: "" },
    mockupFull: { type: String, default: "" },

    designCodes: [{ type: String }],
    sewingDetails: [{ type: String }],
    fabric: { type: String, default: "" },
    colors: { type: String, default: "" },

    craftPositions: {
      front: { technique: String, size: String, image: String, note: String },
      leftSleeve: { technique: String, size: String, image: String, note: String },
      back: { technique: String, size: String, image: String, note: String },
      rightSleeve: { technique: String, size: String, image: String, note: String },
    },

    sizes: {
      men: Object,
      women: Object,
    },
    totalMen: { type: Number, default: 0 },
    totalWomen: { type: Number, default: 0 },
    totalQuantity: { type: Number, default: 0 },

    completionDate: { type: String, default: "" },
    deliveryDate: { type: String, default: "" },
    note: { type: String, default: "" },

    unitPrice: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    deposit: { type: Number, default: 0 },
    remaining: { type: Number, default: 0 },

    status: {
      type: String,
      default: "in_production",
    },
  },
  { timestamps: true }
);

const UniformOrder =
  mongoose.models.UniformOrder || mongoose.model("UniformOrder", UniformOrderSchema);

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set!");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");

  const sampleOrderCode = "UBB-261010-01";
  const existing = await UniformOrder.findOne({ orderCode: sampleOrderCode });

  if (!existing) {
    await UniformOrder.create({
      orderCode: sampleOrderCode,
      reportDate: "10/10",
      orderDate: "10/10/2026",
      customerName: "A&M Fitness Center (Personal Trainer)",
      customerPhone: "0988 123 456",
      customerAddress: "Số 12 Mai Dịch, Cầu Giấy, Hà Nội",
      channel: "Zalo",
      salesRep: "UniVi Sport",

      designCodes: [
        "MAG18_UA01DE08_UNIA12_VC02",
        "GAG18_UA01DE08_UNIA12_VC02",
      ],
      sewingDetails: [
        "Chỉ trần Vàng chanh",
        "Phối vải lỗ vàng chanh",
        "Cổ trụ, khoá kéo",
      ],
      fabric: "Thun mè dệt thể thao cao cấp, co giãn 4 chiều",
      colors: "Đen phối Vàng chanh",

      craftPositions: {
        front: {
          technique: "In Pet chuyển nhiệt",
          size: "8 x 6 cm",
          note: "Logo A&M ngực trái",
        },
        leftSleeve: {
          technique: "Chế tác tiêu chuẩn",
          size: "Tiêu chuẩn",
          note: "",
        },
        back: {
          technique: "In Decal vàng chanh",
          size: "28 x 16 cm",
          note: "Chữ PERSONAL TRAINER",
        },
        rightSleeve: {
          technique: "Chế tác tiêu chuẩn",
          size: "Tiêu chuẩn",
          note: "",
        },
      },

      sizes: {
        men: { S: 0, M: 0, L: 2, XL: 4, "2XL": 2, "3XL": 0, "4XL": 0, "5XL": 0 },
        women: { S: 0, M: 2, L: 2, XL: 2, "2XL": 0, "3XL": 0, "4XL": 0, "5XL": 0 },
      },
      totalMen: 8,
      totalWomen: 6,
      totalQuantity: 14,

      completionDate: "15/10/2026",
      deliveryDate: "18/10/2026",
      note: "Đóng gói túi zip từng áo, kèm thẻ bài UniVi. Kiểm tra kỹ đường may chỉ trần vàng chanh.",

      unitPrice: 195000,
      totalAmount: 14 * 195000,
      deposit: 1500000,
      remaining: 14 * 195000 - 1500000,
      status: "in_production",
    });
    console.log("Created sample order successfully!");
  } else {
    console.log("Sample order already exists.");
  }

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
