import { PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";
import { randomUUID } from "crypto";
import * as path from "path";
import r2Client, { R2_BUCKET_NAME, getPublicUrl, getUniqueR2Key } from "./r2";

export const uploadToR2 = async (filePath: string, folder = "uploads", originalName?: string) => {
  const fileBuffer = readFileSync(filePath);
  const filename = originalName || path.basename(filePath);
  const cleanFolder = folder.trim().replace(/^\/+|\/+$/g, "");
  const key = await getUniqueR2Key(filename, cleanFolder);

  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
    })
  );

  return {
    url: getPublicUrl(key),
    key,
  };
};

export default uploadToR2;
