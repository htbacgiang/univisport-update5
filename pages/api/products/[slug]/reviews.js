import db from "../../../../utils/db";
import Product from "../../../../models/Product";

export default async function handler(req, res) {
  await db.connectDb();
  const { slug } = req.query;

  if (req.method === "GET") {
    try {
      const product = await Product.findOne({ slug }).select("reviews rating reviewCount baseRating baseReviewCount name");
      if (!product) return res.status(404).json({ error: "Không tìm thấy sản phẩm" });

      return res.status(200).json({
        reviews: product.reviews || [],
        rating: product.rating,
        reviewCount: product.reviewCount,
        baseRating: product.baseRating,
        baseReviewCount: product.baseReviewCount,
        productName: product.name,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, rating, comment } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ error: "Vui lòng nhập tên của bạn" });
      }
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Đánh giá phải từ 1 đến 5 sao" });
      }

      const product = await Product.findOne({ slug });
      if (!product) return res.status(404).json({ error: "Không tìm thấy sản phẩm" });

      // Lần đầu tiên có review: lưu lại rating & reviewCount mặc định làm "base"
      if (product.baseReviewCount === null || product.baseReviewCount === undefined) {
        product.baseRating = product.rating ?? 5;
        product.baseReviewCount = product.reviewCount ?? 0;
      }

      product.reviews.push({
        name: name.trim().slice(0, 100),
        rating: Number(rating),
        comment: (comment || "").trim().slice(0, 1000),
      });

      // Tính rating tổng hợp: (baseRating * baseReviewCount + sum(user ratings)) / totalCount
      const baseCount = product.baseReviewCount || 0;
      const baseRating = product.baseRating ?? 5;
      const userRatingsSum = product.reviews.reduce((a, r) => a + r.rating, 0);
      const totalCount = baseCount + product.reviews.length;

      product.rating = totalCount > 0
        ? Math.round(((baseRating * baseCount + userRatingsSum) / totalCount) * 10) / 10
        : 5;
      product.reviewCount = totalCount;

      await product.save();

      const newReview = product.reviews[product.reviews.length - 1];
      return res.status(201).json({
        review: newReview,
        rating: product.rating,
        reviewCount: product.reviewCount,
        baseRating: product.baseRating,
        baseReviewCount: product.baseReviewCount,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // DELETE /api/products/[slug]/reviews?reviewId=<_id>
  if (req.method === "DELETE") {
    try {
      const { reviewId } = req.query;
      if (!reviewId) return res.status(400).json({ error: "Thiếu reviewId" });

      const product = await Product.findOne({ slug });
      if (!product) return res.status(404).json({ error: "Không tìm thấy sản phẩm" });

      const before = product.reviews.length;
      product.reviews = product.reviews.filter((r) => String(r._id) !== String(reviewId));

      if (product.reviews.length === before) {
        return res.status(404).json({ error: "Không tìm thấy đánh giá" });
      }

      // Tính lại rating tổng hợp sau khi xóa
      const baseCount = product.baseReviewCount || 0;
      const baseRating = product.baseRating ?? 5;
      const userRatingsSum = product.reviews.reduce((a, r) => a + r.rating, 0);
      const totalCount = baseCount + product.reviews.length;

      product.rating = totalCount > 0
        ? Math.round(((baseRating * baseCount + userRatingsSum) / totalCount) * 10) / 10
        : baseRating;
      product.reviewCount = totalCount;

      await product.save();

      return res.status(200).json({
        message: "Đã xóa đánh giá",
        rating: product.rating,
        reviewCount: product.reviewCount,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
