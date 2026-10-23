import db from "../../../utils/db";
import Products from "../../../models/Product";
import { requireAdmin } from "../../../lib/adminAuth";

const generateRandomReviewCount = () => Math.floor(Math.random() * 21) + 10;

const handler = async (req, res) => {
  try {
    await db.connectDb();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ err: 'Database connection failed' });
  }

  switch (req.method) {
    case "GET":
      if (req.query.id) {
        await getProductById(req, res);
      } else if (req.query.maxId) {
        await getMaxId(req, res);
      } else {
        await getProducts(req, res);
      }
      break;
    case "POST":
      if (!(await requireAdmin(req, res))) return;
      if (req.body.action === 'checkSlug') {
        await checkSlug(req, res);
      } else {
        await createProduct(req, res);
      }
      break;
    case "PUT":
      if (!(await requireAdmin(req, res))) return;
      await updateProduct(req, res);
      break;
    case "DELETE":
      if (!(await requireAdmin(req, res))) return;
      await deleteProduct(req, res);
      break;
    default:
      res.status(405).json({ err: "Method not allowed" });
      break;
  }
};

export default handler;

const normalizeFaqs = (faqs) => {
  if (!Array.isArray(faqs)) return [];
  return faqs
    .map((faq) => ({
      question: typeof faq?.question === "string" ? faq.question.trim() : "",
      answer: typeof faq?.answer === "string" ? faq.answer.trim() : "",
    }))
    .filter((faq) => faq.question && faq.answer);
};

const normalizeSlug = (value = "") =>
  value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeShirtType = (value = "", category = "") => {
  const normalized = value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, "-");

  if (["ao-thun", "thun", "t-shirt", "tshirt"].includes(normalized)) return "ao-thun";
  if (["ao-polo", "polo"].includes(normalized)) return "ao-polo";
  if (category === "dong-phuc-ao-thun") return "ao-thun";
  if (category === "dong-phuc-ao-polo") return "ao-polo";
  return "";
};

const normalizeProductPayload = (payload) => {
  const productData = { ...payload };
  productData.slug = normalizeSlug(productData.slug || productData.name);
  productData.rating = productData.rating ?? 5;
  productData.reviewCount = productData.reviewCount ?? generateRandomReviewCount();
  const hasExplicitShirtType =
    Object.prototype.hasOwnProperty.call(productData, "shirtType") ||
    Object.prototype.hasOwnProperty.call(productData, "loaiAo") ||
    Object.prototype.hasOwnProperty.call(productData, "loai_ao");
  productData.shirtType = normalizeShirtType(
    productData.shirtType ?? productData.loaiAo ?? productData.loai_ao,
    hasExplicitShirtType ? "" : productData.category
  );
  return productData;
};

const getProducts = async (req, res) => {
  try {
    const { category, visibleOnHome, visibleOnArticle } = req.query;
    const filter = category ? { category } : {};
    if (visibleOnHome === "true") filter.visibleOnHome = { $ne: false };
    if (visibleOnArticle === "true") filter.visibleOnArticle = { $ne: false };
    const products = await Products.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    res.json({
      status: "success",
      result: products.length,
      products,
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ err: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.query;
    // Try to find by numeric id first, then by MongoDB _id
    let product = await Products.findOne({ id: parseInt(id) });
    if (!product) {
      product = await Products.findById(id);
    }
    if (!product) {
      return res.status(404).json({ err: "Product not found" });
    }
    res.json({
      status: "success",
      product,
    });
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    return res.status(500).json({ err: err.message });
  }
};

const getMaxId = async (req, res) => {
  try {
    const maxIdProduct = await Products.findOne().sort({ id: -1 }).select('id');
    const maxId = maxIdProduct ? maxIdProduct.id : 0;
    res.json({
      status: "success",
      maxId,
    });
  } catch (err) {
    console.error('Error fetching max ID:', err);
    return res.status(500).json({ err: err.message });
  }
};

const checkSlug = async (req, res) => {
  try {
    const { id } = req.body;
    const slug = normalizeSlug(req.body.slug);
    if (!slug) return res.status(400).json({ err: 'Đường dẫn tĩnh là bắt buộc' });

    let query = { slug };
    
    if (id) {
      // Handle both numeric id and MongoDB _id for exclusion
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        query.id = { $ne: numericId };
      } else {
        query._id = { $ne: id };
      }
    }
    
    const existingProduct = await Products.findOne(query);
    if (existingProduct) {
      return res.status(200).json({ status: 'error', message: 'Slug đã tồn tại' });
    }
    res.json({ status: 'success' });
  } catch (err) {
    console.error('Error checking slug:', err);
    return res.status(500).json({ err: err.message });
  }
};

const createProduct = async (req, res) => {
  const session = await Products.startSession();
  try {
    session.startTransaction();
    
    // Generate a new unique id
    const maxIdProduct = await Products.findOne().sort({ id: -1 }).select('id').session(session);
    const newId = (maxIdProduct ? maxIdProduct.id : 0) + 1;
    
    // Check if the id already exists (extra safety)
    const existingProductById = await Products.findOne({ id: newId }).session(session);
    if (existingProductById) {
      await session.abortTransaction();
      return res.status(400).json({ err: 'Mã sản phẩm (ID) đã tồn tại' });
    }
    
    // Check if maSanPham already exists
    const { maSanPham } = req.body;
    const existingProductByMaSanPham = await Products.findOne({ maSanPham }).session(session);
    if (existingProductByMaSanPham) {
      await session.abortTransaction();
      return res.status(400).json({ err: 'Mã sản phẩm (maSanPham) đã tồn tại' });
    }
    
    const productData = normalizeProductPayload({ ...req.body, id: newId });
    if (!productData.slug) {
      await session.abortTransaction();
      return res.status(400).json({ err: 'Đường dẫn tĩnh là bắt buộc' });
    }
    if (typeof productData.displayOrder !== 'number') {
      const lastInCategory = await Products.findOne({ category: productData.category })
        .sort({ displayOrder: -1, createdAt: -1 })
        .select('displayOrder')
        .session(session);
      productData.displayOrder = (lastInCategory?.displayOrder ?? -1) + 1;
    }
    productData.faqs = normalizeFaqs(productData.faqs);
    // Normalize gallery: ensure width/height are numbers, fallback from aspectRatio
    if (productData.gallery && Array.isArray(productData.gallery)) {
      productData.gallery = productData.gallery
        .filter(item => item && item.src && item.src.trim() !== '')
        .map(item => {
          const aspectRatio = item.aspectRatio || 'landscape-3-4';
          const widthMap = { square: 1, portrait: 3, 'landscape-3-4': 4, landscape: 4 };
          const heightMap = { square: 1, portrait: 4, 'landscape-3-4': 3, landscape: 3 };
          const wNum = Number(item.width);
          const hNum = Number(item.height);
          return {
            src: item.src.trim(),
            aspectRatio,
            width: (!isNaN(wNum) && wNum > 0) ? wNum : widthMap[aspectRatio] || 16,
            height: (!isNaN(hNum) && hNum > 0) ? hNum : heightMap[aspectRatio] || 9,
          };
        });
    }
    console.log('Creating product with gallery items:', productData.gallery?.length || 0);
    const product = new Products(productData);
    await product.save({ session });
    
    await session.commitTransaction();
    
    res.json({
      status: "success",
      product,
    });
  } catch (err) {
    await session.abortTransaction();
    console.error('Error creating product:', err);
    if (err.code === 11000) {
      if (err.keyPattern.id) {
        return res.status(400).json({ err: 'Mã sản phẩm (ID) đã tồn tại, vui lòng thử lại' });
      }
      if (err.keyPattern.maSanPham) {
        return res.status(400).json({ err: 'Mã sản phẩm (maSanPham) đã tồn tại, vui lòng thử lại' });
      }
      if (err.keyPattern.slug) {
        return res.status(400).json({ err: 'Slug đã tồn tại, vui lòng thử lại' });
      }
    }
    return res.status(500).json({ err: err.message });
  } finally {
    session.endSession();
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id, maSanPham } = req.body;
    const queryId = req.query.id;
    const updateData = normalizeProductPayload(req.body);
    if (!updateData.slug) {
      return res.status(400).json({ err: 'Đường dẫn tĩnh là bắt buộc' });
    }
    
    // Find the existing product by numeric id or MongoDB _id
    let existingProduct = await Products.findOne({ id: parseInt(queryId) });
    if (!existingProduct) {
      existingProduct = await Products.findById(queryId);
    }
    if (!existingProduct) {
      return res.status(404).json({ err: "Product not found" });
    }
    
    // Check if the id is being changed to an existing one
    if (id && id !== existingProduct.id) {
      const existingProductById = await Products.findOne({ id, _id: { $ne: existingProduct._id } });
      if (existingProductById) {
        return res.status(400).json({ err: 'Mã sản phẩm (ID) đã tồn tại' });
      }
    }
    
    // Check if maSanPham is being changed to an existing one
    if (maSanPham && maSanPham !== existingProduct.maSanPham) {
      const existingProductByMaSanPham = await Products.findOne({ maSanPham, _id: { $ne: existingProduct._id } });
      if (existingProductByMaSanPham) {
        return res.status(400).json({ err: 'Mã sản phẩm (maSanPham) đã tồn tại' });
      }
    }
    
    // Normalize gallery before update
    if (Object.prototype.hasOwnProperty.call(updateData, 'faqs')) {
      updateData.faqs = normalizeFaqs(updateData.faqs);
    }
    if (updateData.gallery && Array.isArray(updateData.gallery)) {
      updateData.gallery = updateData.gallery
        .filter(item => item && item.src && item.src.trim() !== '')
        .map(item => {
          const aspectRatio = item.aspectRatio || 'landscape-3-4';
          const widthMap = { square: 1, portrait: 3, 'landscape-3-4': 4, landscape: 4 };
          const heightMap = { square: 1, portrait: 4, 'landscape-3-4': 3, landscape: 3 };
          const wNum = Number(item.width);
          const hNum = Number(item.height);
          return {
            src: item.src.trim(),
            aspectRatio,
            width: (!isNaN(wNum) && wNum > 0) ? wNum : widthMap[aspectRatio] || 16,
            height: (!isNaN(hNum) && hNum > 0) ? hNum : heightMap[aspectRatio] || 9,
          };
        });
    }
    console.log('Updating product gallery items:', updateData.gallery?.length || 0);
    const product = await Products.findByIdAndUpdate(existingProduct._id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ err: "Product not found" });
    }
    
    res.json({
      status: "success",
      product,
    });
  } catch (err) {
    console.error('Error updating product:', err);
    if (err.code === 11000) {
      if (err.keyPattern.id) {
        return res.status(400).json({ err: 'Mã sản phẩm (ID) đã tồn tại, vui lòng thử lại' });
      }
      if (err.keyPattern.maSanPham) {
        return res.status(400).json({ err: 'Mã sản phẩm (maSanPham) đã tồn tại, vui lòng thử lại' });
      }
      if (err.keyPattern.slug) {
        return res.status(400).json({ err: 'Slug đã tồn tại, vui lòng thử lại' });
      }
    }
    return res.status(500).json({ err: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.query;
    
    // Try to find by numeric id first, then by MongoDB _id
    let product = await Products.findOne({ id: parseInt(id) });
    if (!product) {
      product = await Products.findById(id);
    }
    
    if (!product) {
      return res.status(404).json({ err: "Product not found" });
    }
    
    // Delete the product using its MongoDB _id
    await Products.findByIdAndDelete(product._id);
    
    res.json({
      status: "success",
      message: "Product deleted",
    });
  } catch (err) {
    console.error('Error deleting product:', err);
    return res.status(500).json({ err: err.message });
  }
};
