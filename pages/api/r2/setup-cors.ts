import type { NextApiRequest, NextApiResponse } from "next";
import { PutBucketCorsCommand, GetBucketCorsCommand } from "@aws-sdk/client-s3";
import r2Client, { R2_BUCKET_NAME, isR2Configured } from "../../../lib/r2";
import { requireAdmin } from "../../../lib/adminAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await requireAdmin(req, res))) return;

  if (!isR2Configured()) {
    return res.status(500).json({
      error: "Cấu hình Cloudflare R2 chưa đầy đủ trong .env",
    });
  }

  try {
    if (req.method === "GET") {
      try {
        const cors = await r2Client.send(
          new GetBucketCorsCommand({ Bucket: R2_BUCKET_NAME })
        );
        return res.status(200).json({
          status: "configured",
          rules: cors.CORSRules,
        });
      } catch (err: any) {
        return res.status(200).json({
          status: "not_configured",
          message: err.message,
        });
      }
    }

    if (req.method === "POST") {
      await r2Client.send(
        new PutBucketCorsCommand({
          Bucket: R2_BUCKET_NAME,
          CORSConfiguration: {
            CORSRules: [
              {
                AllowedOrigins: ["*"],
                AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
                AllowedHeaders: ["*"],
                ExposeHeaders: ["ETag"],
                MaxAgeSeconds: 3600,
              },
            ],
          },
        })
      );

      return res.status(200).json({
        message: "Cấu hình CORS cho R2 bucket thành công!",
      });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error: any) {
    console.error("Lỗi cấu hình CORS R2:", error);
    return res.status(500).json({
      error: error?.message || "Không thể cấu hình CORS",
    });
  }
}
