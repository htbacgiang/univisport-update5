import db from "../../../utils/db";
import SidebarBanner from "../../../models/SidebarBanner";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const DEFAULT_BANNERS = [
  {
    image: '/images/banner-promotion-1.jpg',
    alt: 'Công nghệ mát lạnh cảm biến – UNI IC',
    order: 0,
    isVisible: true,
  },
  {
    image: '/images/banner-promotion-2.jpg',
    alt: 'Công nghệ mát lạnh cảm biến – UNI IC',
    order: 1,
    isVisible: true,
  },
  {
    image: '/images/banner-promotion-3.jpg',
    alt: 'Công nghệ mát lạnh cảm biến – UNI IC',
    order: 2,
    isVisible: true,
  },
];

const checkAdmin = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user?.role !== "admin") {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
};

export default async function handler(req, res) {
  try {
    await db.connectDb();
  } catch {
    return res.status(500).json({ error: "Database connection failed" });
  }

  switch (req.method) {
    case "GET":
      return getBanners(req, res);
    case "POST":
      if (!(await checkAdmin(req, res))) return;
      return createBanner(req, res);
    case "PUT":
      if (!(await checkAdmin(req, res))) return;
      if (req.query.action === "reorder") return reorderBanners(req, res);
      return updateBanner(req, res);
    case "DELETE":
      if (!(await checkAdmin(req, res))) return;
      return deleteBanner(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

async function getBanners(req, res) {
  try {
    const onlyVisible = req.query.visible === "true";
    const filter = {};
    if (onlyVisible) {
      filter.isVisible = { $ne: false };
    }
    
    let banners = await SidebarBanner.find(filter).sort({ order: 1 }).lean();
    
    // Auto-seed if empty
    if (banners.length === 0 && !onlyVisible) {
      await SidebarBanner.insertMany(DEFAULT_BANNERS);
      banners = await SidebarBanner.find(filter).sort({ order: 1 }).lean();
    }
    
    return res.status(200).json({ banners });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function createBanner(req, res) {
  try {
    const { image, alt, link, isVisible } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Thiếu hình ảnh" });
    }
    const maxOrder = await SidebarBanner.findOne({}).sort({ order: -1 }).lean();
    const order = maxOrder ? maxOrder.order + 1 : 0;
    
    const banner = await SidebarBanner.create({
      image,
      alt: alt || "",
      link: link || "",
      order,
      isVisible: isVisible !== false,
    });
    
    return res.status(201).json({ banner });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function updateBanner(req, res) {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Thiếu id" });
    
    const { image, alt, link, isVisible } = req.body;
    const updates = {};
    if (image !== undefined) updates.image = image;
    if (alt !== undefined) updates.alt = alt;
    if (link !== undefined) updates.link = link;
    if (isVisible !== undefined) updates.isVisible = isVisible;
    
    const banner = await SidebarBanner.findByIdAndUpdate(id, updates, { new: true });
    if (!banner) {
      return res.status(404).json({ error: "Không tìm thấy banner" });
    }
    
    return res.status(200).json({ banner });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function reorderBanners(req, res) {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds phải là mảng" });
    }
    
    await Promise.all(
      orderedIds.map((id, index) =>
        SidebarBanner.findByIdAndUpdate(id, { order: index })
      )
    );
    
    const banners = await SidebarBanner.find({}).sort({ order: 1 }).lean();
    return res.status(200).json({ banners });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deleteBanner(req, res) {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Thiếu id" });
    
    const banner = await SidebarBanner.findByIdAndDelete(id);
    if (!banner) {
      return res.status(404).json({ error: "Không tìm thấy banner" });
    }
    
    const banners = await SidebarBanner.find({}).sort({ order: 1 }).lean();
    return res.status(200).json({ banners });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
