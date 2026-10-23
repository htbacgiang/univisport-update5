import db from "../../../utils/db";
import LookbookItem from "../../../models/LookbookItem";
import { lookbookItems as defaultItems } from "../../../data/collection/lookbookItems";

export default async function handler(req, res) {
  try {
    await db.connectDb();
  } catch (error) {
    return res.status(500).json({ error: "Không thể kết nối cơ sở dữ liệu" });
  }

  switch (req.method) {
    case "GET":
      return getItems(req, res);
    case "POST":
      if (req.body?.action === "seed") return seedDefaults(req, res);
      return createItem(req, res);
    case "PUT":
      return updateItem(req, res);
    case "DELETE":
      return deleteItem(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

async function getItems(req, res) {
  try {
    let items = await LookbookItem.find().sort({ order: 1, createdAt: -1 }).lean();
    
    // Nếu MongoDB chưa có dữ liệu, tự động nạp từ lookbookItems ban đầu
    if (!items || items.length === 0) {
      const seedDocs = defaultItems.map((item, idx) => ({
        image: item.image,
        alt: item.alt,
        filterIds: item.filterIds,
        size: item.size,
        order: idx,
        isVisible: true,
      }));
      items = await LookbookItem.insertMany(seedDocs);
    }

    const formatted = items.map((item) => ({
      id: item._id ? item._id.toString() : item.id,
      _id: item._id ? item._id.toString() : item.id,
      image: item.image,
      alt: item.alt,
      filterIds: item.filterIds || [],
      size: item.size || "md",
      width: item.width || 0,
      height: item.height || 0,
      aspectRatio: item.aspectRatio || 1,
      order: item.order || 0,
      isVisible: item.isVisible !== false,
      createdAt: item.createdAt,
    }));

    return res.status(200).json({ success: true, items: formatted });
  } catch (error) {
    return res.status(500).json({ error: "Lỗi lấy danh sách Lookbook: " + error.message });
  }
}

async function createItem(req, res) {
  try {
    const { image, alt, filterIds, size, width, height, aspectRatio } = req.body;

    if (!image || !alt) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ hình ảnh và tên/mô tả ảnh" });
    }

    const count = await LookbookItem.countDocuments();
    const newItem = await LookbookItem.create({
      image,
      alt,
      filterIds: Array.isArray(filterIds) && filterIds.length > 0 ? filterIds : ["gym"],
      size: size || "md",
      width: width || 0,
      height: height || 0,
      aspectRatio: aspectRatio || 1,
      order: count,
      isVisible: true,
    });

    return res.status(201).json({
      success: true,
      message: "Đã thêm ảnh vào Lookbook thành công",
      item: {
        id: newItem._id.toString(),
        _id: newItem._id.toString(),
        image: newItem.image,
        alt: newItem.alt,
        filterIds: newItem.filterIds,
        size: newItem.size,
        width: newItem.width,
        height: newItem.height,
        aspectRatio: newItem.aspectRatio,
        order: newItem.order,
        isVisible: newItem.isVisible,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Lỗi thêm ảnh: " + error.message });
  }
}

async function updateItem(req, res) {
  try {
    const { id, image, alt, filterIds, size, width, height, aspectRatio, isVisible } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Thiếu ID ảnh cần cập nhật" });
    }

    const updated = await LookbookItem.findByIdAndUpdate(
      id,
      {
        ...(image && { image }),
        ...(alt && { alt }),
        ...(filterIds && { filterIds }),
        ...(size && { size }),
        ...(width !== undefined && { width }),
        ...(height !== undefined && { height }),
        ...(aspectRatio !== undefined && { aspectRatio }),
        ...(isVisible !== undefined && { isVisible }),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Không tìm thấy ảnh cần sửa" });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật ảnh thành công",
      item: {
        id: updated._id.toString(),
        _id: updated._id.toString(),
        image: updated.image,
        alt: updated.alt,
        filterIds: updated.filterIds,
        size: updated.size,
        width: updated.width,
        height: updated.height,
        aspectRatio: updated.aspectRatio,
        order: updated.order,
        isVisible: updated.isVisible,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Lỗi cập nhật ảnh: " + error.message });
  }
}

async function deleteItem(req, res) {
  try {
    const id = req.query.id || req.body?.id;

    if (!id) {
      return res.status(400).json({ error: "Thiếu ID ảnh cần xóa" });
    }

    const deleted = await LookbookItem.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Không tìm thấy ảnh để xóa" });
    }

    return res.status(200).json({ success: true, message: "Đã xóa ảnh khỏi Lookbook thành công" });
  } catch (error) {
    return res.status(500).json({ error: "Lỗi xóa ảnh: " + error.message });
  }
}

async function seedDefaults(req, res) {
  try {
    await LookbookItem.deleteMany({});
    const seedDocs = defaultItems.map((item, idx) => ({
      image: item.image,
      alt: item.alt,
      filterIds: item.filterIds,
      size: item.size,
      order: idx,
      isVisible: true,
    }));
    const created = await LookbookItem.insertMany(seedDocs);

    return res.status(200).json({
      success: true,
      message: `Khôi phục thành công ${created.length} ảnh mặc định.`,
    });
  } catch (error) {
    return res.status(500).json({ error: "Lỗi khôi phục mặc định: " + error.message });
  }
}
