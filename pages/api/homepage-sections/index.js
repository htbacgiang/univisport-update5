import db from "../../../utils/db";
import HomepageSection from "../../../models/HomepageSection";
import { requireAdmin } from "../../../lib/adminAuth";

const DEFAULT_SECTIONS = [
  { title: "Đồng Phục Gym", category: "dong-phuc-gym", viewAllLink: "/dong-phuc-gym", order: 0, isVisible: true, productLimit: 12 },
  { title: "Đồng Phục Pickleball", category: "dong-phuc-pickleball", viewAllLink: "/dong-phuc-pickleball", order: 1, isVisible: true, productLimit: 12 },
  { title: "Đồng Phục Yoga", category: "dong-phuc-yoga-pilates", viewAllLink: "/dong-phuc-yoga-pilates", order: 2, isVisible: true, productLimit: 12 },
  { title: "Đồng Phục Áo Gió", category: "dong-phuc-ao-gio", viewAllLink: "/dong-phuc-ao-gio", order: 3, isVisible: true, productLimit: 12 },
  { title: "Đồng Phục Golf - Tennis", category: "dong-phuc-golf-tennis", viewAllLink: "/dong-phuc-golf-tennis", order: 4, isVisible: true, productLimit: 12 },
  { title: "Đồng Phục Áo Polo", category: "dong-phuc-ao-polo", viewAllLink: "/dong-phuc-ao-polo", order: 5, isVisible: true, productLimit: 12 },
];

const handler = async (req, res) => {
  try {
    await db.connectDb();
  } catch {
    return res.status(500).json({ err: "Database connection failed" });
  }

  switch (req.method) {
    case "GET":
      return getSections(req, res);
    case "POST":
      if (!(await requireAdmin(req, res))) return;
      if (req.body?.action === "seed") return seedDefaults(req, res);
      return createSection(req, res);
    case "PUT":
      if (!(await requireAdmin(req, res))) return;
      if (req.query.action === "reorder") return reorderSections(req, res);
      return updateSection(req, res);
    case "DELETE":
      if (!(await requireAdmin(req, res))) return;
      return deleteSection(req, res);
    default:
      return res.status(405).json({ err: "Method not allowed" });
  }
};

export default handler;

const getSections = async (req, res) => {
  try {
    const sections = await HomepageSection.find({}).sort({ order: 1 }).lean();
    return res.json({ sections });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const seedDefaults = async (req, res) => {
  try {
    const existing = await HomepageSection.countDocuments();
    if (existing > 0) {
      return res.status(400).json({ err: "Sections đã tồn tại, không thể khởi tạo lại" });
    }
    await HomepageSection.insertMany(DEFAULT_SECTIONS);
    const sections = await HomepageSection.find({}).sort({ order: 1 }).lean();
    return res.json({ sections });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const createSection = async (req, res) => {
  try {
    const { title, category, viewAllLink, productLimit } = req.body;
    if (!title || !category || !viewAllLink) {
      return res.status(400).json({ err: "Thiếu thông tin bắt buộc" });
    }
    const maxOrder = await HomepageSection.findOne({}).sort({ order: -1 }).lean();
    const order = maxOrder ? maxOrder.order + 1 : 0;
    const section = await HomepageSection.create({
      title,
      category,
      viewAllLink,
      productLimit: productLimit || 12,
      order,
      isVisible: true,
    });
    return res.status(201).json({ section });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const updateSection = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ err: "Thiếu id" });
    const updates = {};
    const allowed = ["title", "category", "viewAllLink", "isVisible", "productLimit", "sectionBanner"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const section = await HomepageSection.findByIdAndUpdate(id, updates, { new: true });
    if (!section) return res.status(404).json({ err: "Không tìm thấy section" });
    return res.json({ section });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const reorderSections = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ err: "orderedIds phải là mảng" });
    }
    await Promise.all(
      orderedIds.map((id, index) =>
        HomepageSection.findByIdAndUpdate(id, { order: index })
      )
    );
    const sections = await HomepageSection.find({}).sort({ order: 1 }).lean();
    return res.json({ sections });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const deleteSection = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ err: "Thiếu id" });
    await HomepageSection.findByIdAndDelete(id);
    return res.json({ message: "Đã xóa section" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
