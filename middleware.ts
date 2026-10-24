import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;

  let token = await getToken({ req, secret });

  // Fallback check cho secureCookie nếu môi trường dev/prod có sự khác biệt
  if (!token) {
    token = await getToken({ req, secret, secureCookie: false });
  }
  if (!token) {
    token = await getToken({ req, secret, secureCookie: true });
  }

  // Nếu chưa đăng nhập hoặc role không phải admin thì điều hướng về trang chủ "/"
  if (!token || (token as { role?: string }).role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
