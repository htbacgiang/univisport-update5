import db from "../../../utils/db";
import PartnerLogo from "../../../models/PartnerLogo";
import { requireAdmin } from "../../../lib/adminAuth";

const handler = async (req, res) => {
  try {
    await db.connectDb();
  } catch {
    return res.status(500).json({ err: "Database connection failed" });
  }

  switch (req.method) {
    case "GET":
      return getLogos(req, res);
    case "POST":
      if (!(await requireAdmin(req, res))) return;
      if (req.body?.action === "seed") return seedDefaults(req, res);
      return createLogo(req, res);
    case "PUT":
      if (!(await requireAdmin(req, res))) return;
      if (req.query.action === "reorder") return reorderLogos(req, res);
      return updateLogo(req, res);
    case "DELETE":
      if (!(await requireAdmin(req, res))) return;
      return deleteLogo(req, res);
    default:
      return res.status(405).json({ err: "Method not allowed" });
  }
};

export default handler;

const DEFAULT_PARTNERS = [
  { name: "Partner 18", logo: "/khach-hang/18.png", order: 0, isVisible: true, category: "doanh-nghiep" },
  { name: "Partner 16", logo: "/khach-hang/16.jpg", order: 1, isVisible: true, category: "doanh-nghiep" },
  { name: "Partner 17", logo: "/khach-hang/17.png", order: 2, isVisible: true, category: "doanh-nghiep" },
  { name: "Partner 19", logo: "/khach-hang/19.png", order: 3, isVisible: true, category: "doanh-nghiep" },
  { name: "Partner 1", logo: "/khach-hang/1.jpg", order: 4, isVisible: true, category: "doanh-nghiep" },
  { name: "Partner 2", logo: "/khach-hang/2.jpg", order: 5, isVisible: true, category: "doanh-nghiep" },
  { name: "Partner 3", logo: "/khach-hang/3.jpg", order: 6, isVisible: true, category: "doanh-nghiep" },
  { name: "Partner 4", logo: "/khach-hang/4.jpg", order: 7, isVisible: true, category: "fitness-gym" },
  { name: "Partner 5", logo: "/khach-hang/5.jpg", order: 8, isVisible: true, category: "fitness-gym" },
  { name: "Partner 6", logo: "/khach-hang/6.jpg", order: 9, isVisible: true, category: "fitness-gym" },
  { name: "Partner 7", logo: "/khach-hang/7.jpg", order: 10, isVisible: true, category: "fitness-gym" },
  { name: "Partner 8", logo: "/khach-hang/8.jpg", order: 11, isVisible: true, category: "fitness-gym" },
  { name: "Partner 9", logo: "/khach-hang/9.jpg", order: 12, isVisible: true, category: "fitness-gym" },
  { name: "Partner 10", logo: "/khach-hang/10.jpg", order: 13, isVisible: true, category: "fitness-gym" },
  { name: "Partner 11", logo: "/khach-hang/11.jpg", order: 14, isVisible: true, category: "yoga-studio" },
  { name: "Partner 12", logo: "/khach-hang/12.jpg", order: 15, isVisible: true, category: "yoga-studio" },
  { name: "Partner 13", logo: "/khach-hang/13.jpg", order: 16, isVisible: true, category: "yoga-studio" },
  { name: "Partner 15", logo: "/khach-hang/15.jpg", order: 17, isVisible: true, category: "yoga-studio" },
];

const getLogos = async (req, res) => {
  try {
    // Public endpoint: only visible logos for the frontend
    const onlyVisible = req.query.visible === "true";
    const { category } = req.query;
    const filter = {};
    let sortField = { order: 1 };
    if (onlyVisible) {
      if (category) {
        filter.isVisible = { $ne: false };
      } else {
        // If no category is requested, we filter logos to show on homepage
        filter.showOnHome = { $ne: false };
        sortField = { homeOrder: 1, order: 1 };
      }
    }
    if (category && ["doanh-nghiep", "fitness-gym", "yoga-studio"].includes(category)) {
      filter.category = category;
    }
    const logos = await PartnerLogo.find(filter).sort(sortField).lean();
    return res.json({ logos });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const seedDefaults = async (req, res) => {
  try {
    const existing = await PartnerLogo.countDocuments();
    if (existing > 0) {
      return res.status(400).json({ err: "Logos đã tồn tại, không thể khởi tạo lại" });
    }
    await PartnerLogo.insertMany(DEFAULT_PARTNERS);
    const logos = await PartnerLogo.find({}).sort({ order: 1 }).lean();
    return res.json({ logos });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const createLogo = async (req, res) => {
  try {
    const { name, logo, link, category, isVisible, showOnHome } = req.body;
    if (!name || !logo) {
      return res.status(400).json({ err: "Thiếu tên hoặc logo" });
    }

    // Determine isVisible and showOnHome
    const isVis = isVisible !== false;
    const isHome = showOnHome !== false;

    // Check homepage count limit if showOnHome is not false
    if (isHome) {
      const homeCount = await PartnerLogo.countDocuments({ showOnHome: { $ne: false } });
      if (homeCount >= 24) {
        return res.status(400).json({ err: "Trang chủ đã hiển thị đủ 24 logo đối tác. Vui lòng ẩn bớt logo khác trước khi hiển thị thêm logo mới." });
      }
    }

    // Check category count limit if isVisible is not false
    const cat = category || "doanh-nghiep";
    if (isVis) {
      const catCount = await PartnerLogo.countDocuments({ category: cat, isVisible: { $ne: false } });
      if (catCount >= 24) {
        return res.status(400).json({ err: `Nhóm đối tác này đã hiển thị đủ 24 logo.` });
      }
    }

    const maxOrder = await PartnerLogo.findOne({}).sort({ order: -1 }).lean();
    const order = maxOrder ? maxOrder.order + 1 : 0;
    const item = await PartnerLogo.create({
      name,
      logo,
      link: link || "",
      order,
      isVisible: isVis,
      showOnHome: isHome,
      category: cat,
    });
    return res.status(201).json({ logo: item });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const updateLogo = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ err: "Thiếu id" });
    const allowed = ["name", "logo", "link", "isVisible", "showOnHome", "category"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const currentItem = await PartnerLogo.findById(id);
    if (!currentItem) return res.status(404).json({ err: "Không tìm thấy logo" });

    // Enforce homepage limit on update
    const targetShowOnHome = updates.showOnHome !== undefined ? updates.showOnHome : currentItem.showOnHome;
    if (targetShowOnHome !== false) {
      const homeCount = await PartnerLogo.countDocuments({ _id: { $ne: id }, showOnHome: { $ne: false } });
      if (homeCount >= 24) {
        return res.status(400).json({ err: "Trang chủ đã hiển thị đủ 24 logo đối tác. Vui lòng ẩn bớt logo khác trước." });
      }
    }

    // Enforce category limit on update
    const targetCategory = updates.category !== undefined ? updates.category : currentItem.category;
    const targetIsVisible = updates.isVisible !== undefined ? updates.isVisible : currentItem.isVisible;
    if (targetIsVisible !== false) {
      const catCount = await PartnerLogo.countDocuments({ _id: { $ne: id }, category: targetCategory, isVisible: { $ne: false } });
      if (catCount >= 24) {
        return res.status(400).json({ err: "Nhóm đối tác này đã hiển thị đủ 24 logo." });
      }
    }

    const item = await PartnerLogo.findByIdAndUpdate(id, updates, { new: true });
    return res.json({ logo: item });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const reorderLogos = async (req, res) => {
  try {
    const { orderedIds, type } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ err: "orderedIds phải là mảng" });
    }
    if (type === "homepage") {
      await Promise.all(
        orderedIds.map((id, index) =>
          PartnerLogo.findByIdAndUpdate(id, { homeOrder: index })
        )
      );
    } else {
      await Promise.all(
        orderedIds.map((id, index) =>
          PartnerLogo.findByIdAndUpdate(id, { order: index })
        )
      );
    }
    const logos = await PartnerLogo.find({}).sort({ order: 1 }).lean();
    return res.json({ logos });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const deleteLogo = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ err: "Thiếu id" });
    await PartnerLogo.findByIdAndDelete(id);
    return res.json({ message: "Đã xóa logo" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
