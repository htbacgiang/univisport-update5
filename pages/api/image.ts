import type { NextApiHandler } from "next";
import { IncomingForm } from "formidable";
import cloudinary from "../../lib/cloudinary";
import { uploadLibraryImage } from "../../lib/cloudinary-upload";
import db from "../../utils/db";
import Image from "../../models/Image";
import { requireAdmin } from "../../lib/adminAuth";

// Tắt bodyParser để formidable xử lý request
export const config = {
  api: { bodyParser: false },
};

// Hàm tiện ích để parse form multipart/form-data, hỗ trợ multiples
const parseForm = (req: any): Promise<{ files: any; fields: any }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ 
      multiples: true,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });
    
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      resolve({ files, fields });
    });
  });
};

const handler: NextApiHandler = async (req, res) => {
  if (!(await requireAdmin(req, res))) return;

  const { method } = req;
  switch (method) {
    case "POST": {
      const { multiple } = req.query;
      if (multiple === "true") {
        return uploadMultipleImages(req, res);
      }
      return uploadNewImage(req, res);
    }
    case "GET":
      return readAllImages(req, res);
    default:
      return res.status(404).send("Not found!");
  }
};

// Upload một ảnh lên Cloudinary
const uploadNewImage: NextApiHandler = async (req, res) => {
  try {
    // Kiểm tra cấu hình Cloudinary
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY || process.env.CLOUD_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.CLOUD_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({ 
        error: 'Cấu hình Cloudinary chưa được thiết lập. Vui lòng kiểm tra biến môi trường CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET' 
      });
    }

    const { files, fields } = await parseForm(req);
    
    if (!files || !files.image) {
      return res.status(400).json({ error: 'Không tìm thấy file ảnh' });
    }

    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
    
    if (!imageFile || !imageFile.filepath) {
      return res.status(400).json({ error: 'File ảnh không hợp lệ' });
    }

    // Parse altText từ fields (có thể là string hoặc array)
    let altText = "";
    if (fields.altText) {
      altText = Array.isArray(fields.altText) ? fields.altText[0] : fields.altText;
    }

    // Validate loại file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.mimetype)) {
      return res.status(400).json({ error: 'Chỉ hỗ trợ file JPEG, JPG, PNG, WEBP' });
    }

    const { result } = await uploadLibraryImage(imageFile.filepath);
    const { secure_url: url, public_id } = result;

    await db.connectDb();
    let image = await Image.findOne({ publicId: public_id });

    if (image) {
      image.src = url;
      if (altText.trim()) image.altText = altText.trim();
    } else {
      image = new Image({
        src: url,
        altText: altText.trim(),
        publicId: public_id,
      });
    }

    await image.save();

    const response = { 
      src: url, 
      id: image._id,
      altText: image.altText 
    };
    
    res.json(response);
  } catch (error: any) {
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      error: error.message || 'Lỗi khi upload ảnh lên Cloudinary',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Upload nhiều ảnh lên Cloudinary cùng lúc
const uploadMultipleImages: NextApiHandler = async (req, res) => {
  try {
    // Kiểm tra cấu hình Cloudinary
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY || process.env.CLOUD_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.CLOUD_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({ 
        error: 'Cấu hình Cloudinary chưa được thiết lập. Vui lòng kiểm tra biến môi trường CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET' 
      });
    }

    const { files, fields } = await parseForm(req);
    
    if (!files || !files.image) {
      return res.status(400).json({ error: 'Không tìm thấy file ảnh' });
    }

    const imageFiles = Array.isArray(files.image) ? files.image : [files.image];
    const uploadedImages: any[] = [];
    const uploadedPublicIds = new Set<string>();

    // Validate và upload từng file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    await db.connectDb();
    
    for (const file of imageFiles) {
      if (!file || !file.filepath) {
        continue;
      }

      if (!allowedTypes.includes(file.mimetype)) {
        continue;
      }

      try {
        const { result } = await uploadLibraryImage(file.filepath);
        const { secure_url: url, public_id } = result;

        if (uploadedPublicIds.has(public_id)) continue;
        uploadedPublicIds.add(public_id);

        let image = await Image.findOne({ publicId: public_id });
        if (image) {
          image.src = url;
        } else {
          image = new Image({
            src: url,
            altText: "",
            publicId: public_id,
          });
        }

        await image.save();
        
        uploadedImages.push({
          src: url,
          id: image._id,
          altText: image.altText
        });
      } catch (fileError: any) {
        // Tiếp tục với file tiếp theo thay vì dừng toàn bộ
      }
    }

    if (uploadedImages.length === 0) {
      return res.status(400).json({ error: 'Không có file nào được upload thành công' });
    }

    res.json({ src: uploadedImages });
  } catch (error: any) {
    console.error('Error uploading multiple images:', error);
    res.status(500).json({ 
      error: error.message || 'Lỗi khi upload ảnh lên Cloudinary',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Đọc danh sách ảnh từ Cloudinary (tạm thời cho đến khi migration hoàn thành)
const readAllImages: NextApiHandler = async (req, res) => {
  try {
    // Kiểm tra cấu hình Cloudinary
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY || process.env.CLOUD_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.CLOUD_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({ 
        error: 'Cấu hình Cloudinary chưa được thiết lập. Vui lòng kiểm tra biến môi trường CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET',
        images: [] // Trả về mảng rỗng thay vì lỗi để không break UI
      });
    }

    // Lấy ảnh từ Cloudinary
    const { resources } = await cloudinary.api.resources({
      resource_type: "image",
      type: "upload",
      prefix: "univisport",
      max_results: 1000,
    });

    // Lấy ảnh từ database để có Alt Text
    await db.connectDb();
    const dbImages = await Image.find();
    const dbImageMap = new Map(dbImages.map(img => [img.src, img]));

    // Kết hợp ảnh từ Cloudinary với Alt Text từ database
    const formattedImages = resources.map((resource: any) => {
      const dbImage = dbImageMap.get(resource.secure_url);
      return {
        id: dbImage?._id || resource.public_id, // Dùng public_id làm ID tạm thời nếu chưa có trong DB
        src: resource.secure_url,
        altText: dbImage?.altText || ""
      };
    });

    res.json({ images: formattedImages });
  } catch (error: any) {
    console.error('Error fetching images:', error);
    res.status(500).json({ 
      error: error.message || 'Lỗi khi lấy danh sách ảnh',
      images: [], // Trả về mảng rỗng để không break UI
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export default handler;
