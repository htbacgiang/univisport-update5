import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";
import { uploadToR2 } from "../../../lib/r2-upload";
import { isR2Configured } from "../../../lib/r2";
import { requireAdmin } from "../../../lib/adminAuth";

export const config = {
  api: { bodyParser: false },
};

const parseForm = (req: NextApiRequest): Promise<{ files: any; fields: any }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      keepExtensions: true,
      maxFileSize: 25 * 1024 * 1024, // 25MB
    });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ files, fields });
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  if (!(await requireAdmin(req, res))) return;

  if (!isR2Configured()) {
    return res.status(500).json({
      error: "Cấu hình Cloudflare R2 chưa đầy đủ trong .env",
    });
  }

  try {
    const { files, fields } = await parseForm(req);
    const fileObj = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!fileObj || !fileObj.filepath) {
      return res.status(400).json({ error: "Không tìm thấy file tải lên" });
    }

    const folder = Array.isArray(fields.folder) ? fields.folder[0] : fields.folder || "uploads";
    const originalFilename = fileObj.originalFilename || fileObj.newFilename || "image.png";
    const result = await uploadToR2(fileObj.filepath, folder, originalFilename);

    return res.status(200).json({
      publicUrl: result.url,
      key: result.key,
    });
  } catch (error: any) {
    console.error("Lỗi khi upload proxy lên R2:", error);
    return res.status(500).json({
      error: error?.message || "Lỗi máy chủ khi upload ảnh lên R2",
    });
  }
}
