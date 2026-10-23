import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { getToken } from "next-auth/jwt";
import { authOptions } from "../pages/api/auth/[...nextauth]";

/**
 * Kiểm tra xem request có quyền admin hay không.
 * Hỗ trợ cả getServerSession (session cookie) và getToken (JWT).
 * Nếu không phải admin, hàm sẽ tự động trả về lỗi 403 Forbidden và trả về null.
 */
export async function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any | null> {
  try {
    const session = await getServerSession(req, res, authOptions as any);
    if ((session?.user as any)?.role === "admin") {
      return session;
    }
  } catch (e) {
    // Tiếp tục thử bằng getToken
  }

  try {
    const secureCookie =
      process.env.NODE_ENV === "production" &&
      !req.headers.host?.includes("localhost") &&
      !req.headers.host?.includes("127.0.0.1");

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
      secureCookie,
    });

    if (token?.role === "admin") {
      return { user: token };
    }
  } catch (e) {
    // Bỏ qua
  }

  res.status(403).json({ error: "Forbidden: Bạn không có quyền thực hiện thao tác này." });
  return null;
}

export default requireAdmin;
