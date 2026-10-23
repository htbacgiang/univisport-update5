import { createHash } from "crypto";
import { createReadStream } from "fs";
import cloudinary from "./cloudinary";

const hashFile = (filePath: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);

    stream.on("error", reject);
    hash.on("error", reject);
    hash.on("finish", () => resolve(hash.digest("hex")));
    stream.pipe(hash);
  });

export const uploadPostThumbnail = async (
  filePath: string,
  postId: string,
  folder = process.env.CLOUDINARY_FOLDER || "tantruonggiang"
) =>
  cloudinary.uploader.upload(filePath, {
    folder,
    public_id: `post-${postId}-thumbnail`,
    overwrite: true,
    invalidate: true,
    unique_filename: false,
  });

export const uploadLibraryImage = async (
  filePath: string,
  folder = "univisport"
) => {
  const digest = await hashFile(filePath);
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    public_id: `image-${digest}`,
    overwrite: true,
    invalidate: true,
    unique_filename: false,
  });

  return { result, digest };
};
