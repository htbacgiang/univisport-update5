import db from "../../../utils/db";
import Product from "../../../models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  // Chỉ admin mới được truy cập
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user?.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await db.connectDb();

  if (req.method === "GET") {
    try {
      const { rating, search, page = 1, limit = 20 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // Lấy tất cả sản phẩm có ít nhất 1 review
      const products = await Product.find(
        { "reviews.0": { $exists: true } },
        { name: 1, slug: 1, maSanPham: 1, image: 1, reviews: 1, rating: 1, reviewCount: 1 }
      );

      // Flatten reviews + kèm thông tin sản phẩm
      let allReviews = [];
      products.forEach((product) => {
        product.reviews.forEach((review) => {
          allReviews.push({
            _id: review._id,
            reviewId: review._id,
            productSlug: product.slug,
            productName: product.name,
            productMa: product.maSanPham,
            productImage: product.image,
            name: review.name,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
          });
        });
      });

      // Filter
      if (rating) {
        allReviews = allReviews.filter((r) => r.rating === Number(rating));
      }
      if (search) {
        const s = search.toLowerCase();
        allReviews = allReviews.filter(
          (r) =>
            r.name?.toLowerCase().includes(s) ||
            r.comment?.toLowerCase().includes(s) ||
            r.productName?.toLowerCase().includes(s)
        );
      }

      // Sort: mới nhất trước
      allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const total = allReviews.length;
      const paginated = allReviews.slice(skip, skip + Number(limit));

      return res.status(200).json({
        reviews: paginated,
        total,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
