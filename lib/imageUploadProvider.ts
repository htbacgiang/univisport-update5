// úplib/imageUploadProvider.ts

/**
 * Centralized image upload service.
 * Currently delegates to Cloudinary implementation.
 * Future provider (e.g., Cloudflare R2) can be added by setting the
 * IMAGE_UPLOAD_PROVIDER env variable to "r2".
 */
import { uploadLibraryImage as uploadToCloudinary } from "./cloudinary-upload";
// Placeholder import for R2 – will be implemented later.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { uploadToR2 } from "./r2-upload";

/**
 * Options for image upload.
 */
export interface UploadOptions {
  /** Destination folder (for Cloudinary) or prefix (for R2) */
  folder?: string;
  /** Optional album identifier – stored in DB only, not used by providers yet */
  albumId?: string;
}

/**
 * Upload an image file and return its public URL and metadata.
 *
 * The function reads the environment variable `IMAGE_UPLOAD_PROVIDER`
 * (default: "cloudinary"). When set to "r2", it will call the R2 upload
 * implementation (currently a stub).
 */
export const uploadImage = async (
  filePath: string,
  options: UploadOptions = {}
) => {
  const provider = process.env.IMAGE_UPLOAD_PROVIDER?.toLowerCase() ?? "cloudinary";

  if (provider === "cloudinary") {
    // Cloudinary returns a result object with secure_url, public_id, etc.
    const { result, digest } = await uploadToCloudinary(filePath, options.folder);
    return { url: result.secure_url, publicId: result.public_id, digest, provider: "cloudinary" };
  }

  if (provider === "r2") {
    // R2 implementation will eventually return similar shape.
    const { url, key } = await uploadToR2(filePath, options.folder);
    return { url, key, provider: "r2" };
  }

  throw new Error(`Unsupported image upload provider: ${provider}`);
};

export default uploadImage;
