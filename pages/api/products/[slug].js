import db from "../../../utils/db";
import Products from "../../../models/Product";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ err: "Method not allowed" });
  }

  try {
    await db.connectDb();
    const { slug } = req.query;
    const product = await Products.findOne({ slug });

    if (!product) {
      return res.status(404).json({ err: "Product not found" });
    }

    res.json({
      status: "success",
      product,
    });
  } catch (err) {
    console.error('Error fetching product by slug:', err);
    return res.status(500).json({ err: err.message });
  }
};

export default handler;