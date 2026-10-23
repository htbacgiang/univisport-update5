import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";
import db from "../../../utils/db";
import Image from "../../../models/Image";
import cloudinary from "../../../lib/cloudinary";

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  
  switch (method) {
    case "PUT":
      return updateAltText(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const updateAltText: NextApiHandler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET });
  const session = token ? { user: token } : null;

  if (!session || !session.user) {
    return res.status(401).json({ error: "Bạn cần đăng nhập!" });
  }

  try {
    const { imageId, altText } = req.body;
    
    if (!imageId) {
      return res.status(400).json({ error: "Image ID là bắt buộc" });
    }

    await db.connectDb();

    // Tìm ảnh theo ID hoặc src
    let image = null;
    
    // Kiểm tra xem imageId có phải là ObjectId hợp lệ không
    if (imageId.match(/^[0-9a-fA-F]{24}$/)) {
      // Nếu là ObjectId hợp lệ, tìm theo ID
      image = await Image.findById(imageId);
    }
    
    if (!image) {
      // Nếu không tìm thấy theo ID, thử tìm theo src
      image = await Image.findOne({ src: imageId });
    }
    
    if (!image) {
      // Nếu imageId là public_id, thử tìm theo publicId
      image = await Image.findOne({ publicId: imageId });
    }

    if (!image) {
      // Nếu không tìm thấy trong database, tạo mới
      let imageUrl = imageId;
      let publicId = "";
      
      if (!imageId.startsWith('http')) {
        // imageId có thể là public_id, thử lấy URL từ Cloudinary
        try {
          const resource = await cloudinary.api.resource(imageId);
          imageUrl = resource.secure_url;
          publicId = imageId;
        } catch (error) {
          // Nếu không tìm thấy trong Cloudinary, coi như imageId là URL
          imageUrl = imageId;
          publicId = "";
        }
      }
      
      image = new Image({
        src: imageUrl,
        altText: altText || "",
        publicId: publicId
      });
      await image.save();
    }

    // Cập nhật alt text
    image.altText = altText || "";
    await image.save();

    res.json({ 
      success: true, 
      message: "Đã cập nhật Alt Text thành công",
      image: {
        id: image._id,
        src: image.src,
        altText: image.altText
      }
    });
  } catch (error: any) {
    console.error("Lỗi cập nhật Alt Text:", error);
    res.status(500).json({ error: "Lỗi máy chủ!" });
  }
};

export default handler;
