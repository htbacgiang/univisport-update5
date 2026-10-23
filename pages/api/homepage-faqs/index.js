import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import { DEFAULT_HOMEPAGE_FAQS } from "../../../data/homepageFaqs";
import HomepageFaqSettings from "../../../models/HomepageFaqSettings";
import db from "../../../utils/db";

const requireAdmin = async (req, res) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  });

  if (!token || token.role !== "admin") {
    res.status(401).json({ error: "Bạn cần quyền admin để thực hiện thao tác này." });
    return null;
  }

  return token;
};

const normalizeFaq = (value = {}) => ({
  question: String(value.question || "").trim(),
  answer: String(value.answer || "").trim(),
  image: String(value.image || "/images/thumb-univi.jpg").trim(),
  video: String(value.video || "").trim(),
  isVisible: value.isVisible !== false,
});

const serializeFaq = (faq, index) => ({
  _id: faq._id ? String(faq._id) : `default-${index}`,
  question: faq.question,
  answer: faq.answer,
  image: faq.image || "/images/thumb-univi.jpg",
  video: faq.video || "",
  isVisible: faq.isVisible !== false,
  order: Number.isFinite(faq.order) ? faq.order : index,
});

const sortFaqs = (faqs) =>
  [...faqs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

const getOrCreateSettings = () =>
  HomepageFaqSettings.findOneAndUpdate(
    { key: "homepage" },
    {
      $setOnInsert: {
        key: "homepage",
        faqs: DEFAULT_HOMEPAGE_FAQS,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

export default async function handler(req, res) {
  const adminRequest = req.query.admin === "true";
  const needsAdmin = adminRequest || req.method !== "GET";

  if (needsAdmin) {
    const token = await requireAdmin(req, res);
    if (!token) return;
  }

  try {
    await db.connectDb();
  } catch {
    return res.status(500).json({ error: "Không thể kết nối cơ sở dữ liệu." });
  }

  switch (req.method) {
    case "GET":
      return getFaqs(req, res, adminRequest);
    case "POST":
      return createFaq(req, res);
    case "PUT":
      if (req.query.action === "reorder") return reorderFaqs(req, res);
      return updateFaq(req, res);
    case "DELETE":
      return deleteFaq(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).json({ error: "Phương thức không được hỗ trợ." });
  }
}

async function getFaqs(req, res, adminRequest) {
  try {
    const settings = adminRequest
      ? await getOrCreateSettings()
      : await HomepageFaqSettings.findOne({ key: "homepage" }).lean();

    const source = settings ? settings.faqs : DEFAULT_HOMEPAGE_FAQS;
    const faqs = sortFaqs(source)
      .filter((faq) => adminRequest || faq.isVisible !== false)
      .map(serializeFaq);

    return res.json({ faqs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function createFaq(req, res) {
  try {
    const faq = normalizeFaq(req.body);
    if (!faq.question || !faq.answer) {
      return res.status(400).json({ error: "Câu hỏi và câu trả lời là bắt buộc." });
    }

    const settings = await getOrCreateSettings();
    const maxOrder = settings.faqs.reduce(
      (max, item) => Math.max(max, item.order ?? -1),
      -1
    );
    settings.faqs.push({ ...faq, order: maxOrder + 1 });
    await settings.save();

    const createdFaq = settings.faqs[settings.faqs.length - 1];
    return res.status(201).json({
      faq: serializeFaq(createdFaq, settings.faqs.length - 1),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function updateFaq(req, res) {
  const { id } = req.query;
  if (!id || !mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "ID FAQ không hợp lệ." });
  }

  try {
    const settings = await getOrCreateSettings();
    const faq = settings.faqs.id(id);
    if (!faq) {
      return res.status(404).json({ error: "Không tìm thấy FAQ." });
    }

    const updates = normalizeFaq({ ...faq.toObject(), ...req.body });
    if (!updates.question || !updates.answer) {
      return res.status(400).json({ error: "Câu hỏi và câu trả lời là bắt buộc." });
    }

    faq.question = updates.question;
    faq.answer = updates.answer;
    faq.image = updates.image;
    faq.video = updates.video;
    faq.isVisible = updates.isVisible;
    await settings.save();

    return res.json({ faq: serializeFaq(faq, faq.order) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function reorderFaqs(req, res) {
  const { orderedIds } = req.body;
  if (
    !Array.isArray(orderedIds) ||
    orderedIds.some((id) => !mongoose.isValidObjectId(id))
  ) {
    return res.status(400).json({ error: "Danh sách thứ tự FAQ không hợp lệ." });
  }

  try {
    const settings = await getOrCreateSettings();
    const existingIds = new Set(settings.faqs.map((faq) => String(faq._id)));

    if (
      orderedIds.length !== existingIds.size ||
      orderedIds.some((id) => !existingIds.has(String(id)))
    ) {
      return res.status(400).json({ error: "Danh sách FAQ không đầy đủ." });
    }

    orderedIds.forEach((id, index) => {
      settings.faqs.id(id).order = index;
    });
    await settings.save();

    return res.json({
      faqs: sortFaqs(settings.faqs).map(serializeFaq),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function deleteFaq(req, res) {
  const { id } = req.query;
  if (!id || !mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "ID FAQ không hợp lệ." });
  }

  try {
    const settings = await getOrCreateSettings();
    const faq = settings.faqs.id(id);
    if (!faq) {
      return res.status(404).json({ error: "Không tìm thấy FAQ." });
    }

    settings.faqs.pull(id);
    sortFaqs(settings.faqs).forEach((item, index) => {
      item.order = index;
    });
    await settings.save();

    return res.json({
      message: "Đã xóa FAQ.",
      faqs: sortFaqs(settings.faqs).map(serializeFaq),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
