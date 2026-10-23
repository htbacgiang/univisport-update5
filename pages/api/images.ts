import type { NextApiHandler } from "next";
import { IncomingForm } from "formidable";
import cloudinary from "../../lib/cloudinary";
import { uploadLibraryImage } from "../../lib/cloudinary-upload";

// Hàm tiện ích để parse form multipart/form-data
const parseForm = (req: any): Promise<{ files: any }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ files });
    });
  });
};

const getImages: NextApiHandler = async (req, res) => {
  try {
    const response = await cloudinary.api.resources({
      resource_type: "image",
      max_results: 200,
      prefix: "univisport",
    });
    res.json({ images: response.resources });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
const readAllImages: NextApiHandler = async (req, res) => {
    try {
      // Tương tự, không cần kiểm tra admin tại API
      const { resources } = await cloudinary.api.resources({
        resource_type: "image",
        type: "upload",
        prefix: "univisport",
        max_results: 1000,
      });
  
      const images = resources.map(({ secure_url }: any) => ({
        src: secure_url,
      }));
      res.json({ images });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  
const uploadNewImage: NextApiHandler = async (req, res) => {
  try {
    const { files } = await parseForm(req);
    const imageFiles = Array.isArray(files.image) ? files.image : [files.image];
    const uploadedUrls: string[] = [];
    const uploadedPublicIds = new Set<string>();

    for (const imageFile of imageFiles) {
      const { result } = await uploadLibraryImage(imageFile.filepath);
      const { secure_url: url, public_id } = result;
      if (uploadedPublicIds.has(public_id)) continue;
      uploadedPublicIds.add(public_id);
      uploadedUrls.push(url);
    }

    res.json({ src: uploadedUrls });
  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ error: error.message });
  }
};

const handler: NextApiHandler = (req, res) => {
  if (req.method === "GET") return getImages(req, res);
  if (req.method === "POST") return uploadNewImage(req, res);
  res.status(405).json({ error: "Method not allowed" });
};

export const config = {
  api: {
    bodyParser: false, // Tắt bodyParser để formidable xử lý request
  },
};

export default handler;
