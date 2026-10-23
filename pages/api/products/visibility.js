import db from "../../../utils/db";
import Products from "../../../models/Product";
import { requireAdmin } from "../../../lib/adminAuth";

const VISIBLE_FIELDS = new Set(["visibleOnHome", "visibleOnArticle", "isFeatured"]);

const handler = async (req, res) => {
  if (req.method !== "PATCH") {
    return res.status(405).json({ err: "Method not allowed" });
  }

  if (!(await requireAdmin(req, res))) return;

  try {
    await db.connectDb();

    const { id, field, value } = req.body;
    if (!id || !VISIBLE_FIELDS.has(field) || typeof value !== "boolean") {
      return res.status(400).json({ err: "Invalid visibility payload" });
    }

    const numericId = Number(id);
    const query = Number.isFinite(numericId) ? { id: numericId } : { _id: id };

    // If setting isFeatured = true, unset isFeatured for other products in the same category first
    if (field === "isFeatured" && value === true) {
      const currentProduct = await Products.findOne(query);
      if (currentProduct && currentProduct.category) {
        await Products.updateMany(
          { category: currentProduct.category, _id: { $ne: currentProduct._id } },
          { $set: { isFeatured: false } }
        );
      }
    }

    const product = await Products.findOneAndUpdate(
      query,
      { $set: { [field]: value } },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ err: "Product not found" });
    }

    res.status(200).json({ status: "success", product });
  } catch (error) {
    console.error("Error updating product visibility:", error);
    res.status(500).json({ err: "Lỗi server khi cập nhật hiển thị." });
  }
};

export default handler;
