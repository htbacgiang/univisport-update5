import db from "../../../utils/db";
import Products from "../../../models/Product";

const handler = async (req, res) => {
  if (req.method !== "POST" && req.method !== "PUT") {
    return res.status(405).json({ err: "Method not allowed" });
  }

  try {
    await db.connectDb();

    const { id, featuredConfig } = req.body;
    if (!id || typeof featuredConfig !== "object") {
      return res.status(400).json({ err: "Invalid payload" });
    }

    const numericId = Number(id);
    const query = Number.isFinite(numericId) ? { id: numericId } : { _id: id };

    const product = await Products.findOneAndUpdate(
      query,
      {
        $set: {
          featuredConfig: {
            customTitle: (featuredConfig.customTitle || "").trim(),
            customSubtitle: (featuredConfig.customSubtitle || "").trim(),
            customDescription: (featuredConfig.customDescription || "").trim(),
            customImage: (featuredConfig.customImage || "").trim(),
            customSecondaryImage: (featuredConfig.customSecondaryImage || "").trim(),
            videoUrl: (featuredConfig.videoUrl || "").trim(),
            badgeText: (featuredConfig.badgeText || "").trim(),
            soldCount: (featuredConfig.soldCount || "").trim(),
            recentCustomers: (featuredConfig.recentCustomers || "").trim(),
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ err: "Product not found" });
    }

    res.status(200).json({ status: "success", product });
  } catch (error) {
    console.error("Error updating featuredConfig:", error);
    res.status(500).json({ err: "Lỗi server khi cập nhật cấu hình sản phẩm nổi bật." });
  }
};

export default handler;
