import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";
import db from "../../../utils/db";
import Image from "../../../models/Image";
import cloudinary from "../../../lib/cloudinary";

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  
  if (method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET });
  const session = token ? { user: token } : null;

  if (!session || !session.user || session.user.role !== 'admin') {
    return res.status(401).json({ error: "Chỉ admin mới có thể thực hiện migration" });
  }

  try {
    await db.connectDb();

    // Import từ folder "tantruonggiang"
    const { resources } = await cloudinary.api.resources({
      resource_type: "image",
      type: "upload",
      prefix: "tantruonggiang",
      max_results: 1000,
    });

    let importedCount = 0;
    let skippedCount = 0;

    for (const resource of resources) {
      const existingImage = await Image.findOne({ src: resource.secure_url });
      
      if (!existingImage) {
        const image = new Image({
          src: resource.secure_url,
          altText: "",
          publicId: resource.public_id,
        });
        await image.save();
        importedCount++;
      } else {
        skippedCount++;
      }
    }

    res.json({ 
      success: true, 
      message: `Migration hoàn thành! Imported: ${importedCount}, Skipped: ${skippedCount}`,
      imported: importedCount,
      skipped: skippedCount,
      total: resources.length
    });
  } catch (error: any) {
    console.error("Lỗi migration:", error);
    res.status(500).json({ error: "Lỗi máy chủ!" });
  }
};

export default handler;
