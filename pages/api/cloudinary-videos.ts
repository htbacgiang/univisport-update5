import type { NextApiHandler } from "next";
import cloudinary from "../../lib/cloudinary";

const VIDEO_FOLDER = "videounivi";

const getAspectRatio = (width?: number, height?: number) => {
  if (!width || !height) return "horizontal";
  if (Math.abs(width - height) / Math.max(width, height) < 0.12) return "square";
  return height > width ? "vertical" : "horizontal";
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Media Library có thể dùng Asset Folder (dynamic folder), khi đó
    // `prefix` không lọc được theo tên folder. Search API hỗ trợ cả trường
    // asset_folder và resource_type.
    let resources: any[] = [];
    try {
      const searchResult = await cloudinary.search
        .expression(`resource_type:video AND asset_folder=${VIDEO_FOLDER}`)
        .sort_by("created_at", "desc")
        .max_results(500)
        .execute();
      resources = searchResult.resources || [];
    } catch (searchError) {
      console.warn("Cloudinary Asset Folder search failed, using public_id prefix:", searchError);
    }

    // Tương thích với các video được upload theo public_id dạng videounivi/...
    if (resources.length === 0) {
      const response = await cloudinary.api.resources({
        resource_type: "video",
        type: "upload",
        prefix: `${VIDEO_FOLDER}/`,
        max_results: 500,
        direction: "desc",
      });
      resources = response.resources || [];
    }

    const videos = resources.map((resource: any) => ({
      id: resource.public_id,
      publicId: resource.public_id,
      name: resource.public_id.split("/").pop() || resource.public_id,
      src: resource.secure_url,
      format: resource.format,
      bytes: resource.bytes,
      duration: resource.duration,
      width: resource.width,
      height: resource.height,
      aspectRatio: getAspectRatio(resource.width, resource.height),
      createdAt: resource.created_at,
      thumbnail: cloudinary.url(resource.public_id, {
        resource_type: "video",
        type: "upload",
        secure: true,
        format: "jpg",
        transformation: [{ start_offset: "1" }],
      }),
    }));

    return res.status(200).json({ videos });
  } catch (error: any) {
    console.error("Error fetching Cloudinary videos:", error);
    return res.status(500).json({
      error: error.message || "Không thể tải danh sách video Cloudinary.",
      videos: [],
    });
  }
};

export default handler;
