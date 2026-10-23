import multiparty from "multiparty";
import { mongooseConnect } from "../../lib/mongoose";
import { uploadLibraryImage } from "../../lib/cloudinary-upload";
import { getServerSession } from "next-auth/next";
import { getToken } from "next-auth/jwt";
import { authOptions } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const token = !session
    ? await getToken({ req, secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET })
    : null;

  if (!session && !token) {
    return res.status(401).json({ error: "Unauthorized: Vui lòng đăng nhập để tải ảnh" });
  }

  await mongooseConnect();

  const form = new multiparty.Form({
    maxFilesSize: 15 * 1024 * 1024, // 15MB limit
  });

  try {
    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    if (!files?.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadPromises = files.file.map((file) =>
      uploadLibraryImage(file.path).then(({ result }) => result)
    );

    const results = await Promise.all(uploadPromises);

    const links = results.map((r) => r.secure_url);

    return res.json({ links });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
