import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import { DEFAULT_VIDEO_FEEDBACK_ITEMS } from "../../../data/videoFeedbackItems";
import HomepageVideoFeedbackSettings from "../../../models/HomepageVideoFeedbackSettings";
import db from "../../../utils/db";

const requireAdmin = async (req, res) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  });

  if (!token || token.role !== "admin") {
    res
      .status(401)
      .json({ error: "Bạn cần quyền admin để thực hiện thao tác này." });
    return null;
  }

  return token;
};

const normalizeVideo = (value = {}) => {
  const type = value.type === "facebook" ? "facebook" : "local";
  return {
    type,
    title: String(value.title || "").trim(),
    src: String(value.src || "").trim(),
    fbUrl: String(value.fbUrl || "").trim(),
    poster: String(value.poster || "").trim(),
    isVisible: value.isVisible !== false,
  };
};

const serializeVideo = (video, index) => ({
  _id: video._id ? String(video._id) : video.id || `default-${index}`,
  id: video._id ? String(video._id) : video.id || `default-${index}`,
  type: video.type || "local",
  title: video.title || "",
  src: video.src || "",
  fbUrl: video.fbUrl || "",
  poster: video.poster || "",
  isVisible: video.isVisible !== false,
  order: Number.isFinite(video.order) ? video.order : index,
});

const sortVideos = (videos) =>
  [...videos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

const getOrCreateSettings = () =>
  HomepageVideoFeedbackSettings.findOneAndUpdate(
    { key: "homepage" },
    {
      $setOnInsert: {
        key: "homepage",
        videos: DEFAULT_VIDEO_FEEDBACK_ITEMS,
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
      return getVideos(req, res, adminRequest);
    case "POST":
      return createVideo(req, res);
    case "PUT":
      if (req.query.action === "reorder") return reorderVideos(req, res);
      return updateVideo(req, res);
    case "DELETE":
      return deleteVideo(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).json({ error: "Phương thức không được hỗ trợ." });
  }
}

async function getVideos(req, res, adminRequest) {
  try {
    const settings = adminRequest
      ? await getOrCreateSettings()
      : await HomepageVideoFeedbackSettings.findOne({ key: "homepage" }).lean();

    const source = settings ? settings.videos : DEFAULT_VIDEO_FEEDBACK_ITEMS;
    const videos = sortVideos(source)
      .filter((video) => adminRequest || video.isVisible !== false)
      .map(serializeVideo);

    return res.json({ videos });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function createVideo(req, res) {
  try {
    const video = normalizeVideo(req.body);
    if (!video.title) {
      return res.status(400).json({ error: "Tiêu đề video là bắt buộc." });
    }
    if (video.type === "local" && !video.src) {
      return res.status(400).json({ error: "Vui lòng nhập đường dẫn video." });
    }
    if (video.type === "facebook" && !video.fbUrl) {
      return res.status(400).json({ error: "Vui lòng nhập link Facebook." });
    }

    const settings = await getOrCreateSettings();
    const maxOrder = settings.videos.reduce(
      (max, item) => Math.max(max, item.order ?? -1),
      -1
    );
    settings.videos.push({ ...video, order: maxOrder + 1 });
    await settings.save();

    const createdVideo = settings.videos[settings.videos.length - 1];
    return res.status(201).json({
      video: serializeVideo(createdVideo, settings.videos.length - 1),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function updateVideo(req, res) {
  const { id } = req.query;
  if (!id || !mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "ID video không hợp lệ." });
  }

  try {
    const settings = await getOrCreateSettings();
    const video = settings.videos.id(id);
    if (!video) {
      return res.status(404).json({ error: "Không tìm thấy video." });
    }

    const updates = normalizeVideo({ ...video.toObject(), ...req.body });
    if (!updates.title) {
      return res.status(400).json({ error: "Tiêu đề video là bắt buộc." });
    }
    if (updates.type === "local" && !updates.src) {
      return res.status(400).json({ error: "Vui lòng nhập đường dẫn video." });
    }
    if (updates.type === "facebook" && !updates.fbUrl) {
      return res.status(400).json({ error: "Vui lòng nhập link Facebook." });
    }

    video.type = updates.type;
    video.title = updates.title;
    video.src = updates.src;
    video.fbUrl = updates.fbUrl;
    video.poster = updates.poster;
    video.isVisible = updates.isVisible;
    await settings.save();

    return res.json({ video: serializeVideo(video, video.order) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function reorderVideos(req, res) {
  const { orderedIds } = req.body;
  if (
    !Array.isArray(orderedIds) ||
    orderedIds.some((id) => !mongoose.isValidObjectId(id))
  ) {
    return res.status(400).json({ error: "Danh sách thứ tự video không hợp lệ." });
  }

  try {
    const settings = await getOrCreateSettings();
    const existingIds = new Set(settings.videos.map((video) => String(video._id)));
    if (
      orderedIds.length !== existingIds.size ||
      orderedIds.some((id) => !existingIds.has(String(id)))
    ) {
      return res.status(400).json({ error: "Danh sách video không đầy đủ." });
    }

    orderedIds.forEach((id, index) => {
      settings.videos.id(id).order = index;
    });
    await settings.save();

    return res.json({
      videos: sortVideos(settings.videos).map(serializeVideo),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function deleteVideo(req, res) {
  const { id } = req.query;
  if (!id || !mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "ID video không hợp lệ." });
  }

  try {
    const settings = await getOrCreateSettings();
    const video = settings.videos.id(id);
    if (!video) {
      return res.status(404).json({ error: "Không tìm thấy video." });
    }

    settings.videos.pull(id);
    sortVideos(settings.videos).forEach((item, index) => {
      item.order = index;
    });
    await settings.save();

    return res.json({
      message: "Đã xóa video.",
      videos: sortVideos(settings.videos).map(serializeVideo),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
