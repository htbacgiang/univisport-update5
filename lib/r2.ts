import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import slugify from "slugify";

export const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "";
export const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
export const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";
export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "";
export const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").replace(/\/+$/, "");

export const isR2Configured = (): boolean => {
  return Boolean(
    R2_ACCOUNT_ID &&
    R2_ACCESS_KEY_ID &&
    R2_SECRET_ACCESS_KEY &&
    R2_BUCKET_NAME
  );
};

export const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ACCOUNT_ID ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : undefined,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export const getPublicUrl = (key: string): string => {
  const cleanKey = key.replace(/^\/+/, "");
  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL}/${cleanKey}`;
  }
  if (R2_BUCKET_NAME && R2_ACCOUNT_ID) {
    return `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${cleanKey}`;
  }
  return `/${cleanKey}`;
};

/**
 * Chuẩn hóa tên file: giữ nguyên tên gốc, chuyển tiếng Việt có dấu thành không dấu,
 * xóa ký tự đặc biệt nguy hiểm và khoảng trắng -> gạch ngang, giữ nguyên đuôi mở rộng.
 */
export const cleanFilename = (filename: string): { base: string; ext: string; fullName: string } => {
  const extMatch = filename.match(/\.([0-9a-zA-Z]+)$/);
  const ext = extMatch ? `.${extMatch[1].toLowerCase()}` : "";
  const rawBaseName = ext ? filename.slice(0, -ext.length) : filename;

  const slugBase = slugify(rawBaseName, {
    lower: true,
    locale: "vi",
    remove: /[*+~.()'"!:@?#%&]/g,
  })
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "image";

  return {
    base: slugBase,
    ext,
    fullName: `${slugBase}${ext}`,
  };
};

/**
 * Tạo key lưu trữ trên R2 theo tên file gốc (không có mã UUID phía trước).
 * Nếu file cùng tên đã tồn tại trong thư mục, tự động thêm số đếm -1, -2 để tránh ghi đè.
 */
export const getUniqueR2Key = async (filename: string, folder = ""): Promise<string> => {
  const { base, ext, fullName } = cleanFilename(filename);
  const cleanFolder = folder.trim().replace(/^\/+|\/+$/g, "");

  const initialKey = cleanFolder ? `${cleanFolder}/${fullName}` : fullName;

  try {
    await r2Client.send(
      new HeadObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: initialKey,
      })
    );

    // Nếu không có lỗi -> file đã tồn tại, tìm tên dạng ten-1.png, ten-2.png
    let counter = 1;
    while (true) {
      const candidateName = `${base}-${counter}${ext}`;
      const candidateKey = cleanFolder ? `${cleanFolder}/${candidateName}` : candidateName;
      try {
        await r2Client.send(
          new HeadObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: candidateKey,
          })
        );
        counter++;
      } catch (err: any) {
        if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
          return candidateKey;
        }
        return candidateKey;
      }
    }
  } catch (err: any) {
    // Chưa tồn tại -> dùng initialKey
    return initialKey;
  }
};

export default r2Client;
