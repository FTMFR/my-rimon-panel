import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/"];
const protectedRoutesPattern = /^\/dashboard(\/.*)?$/;

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // اجازه دسترسی به مسیرهای عمومی
  if (publicRoutes.includes(pathname)) {
    // حذف پارامترهای اضافی مثل callbackUrl
    if (searchParams.size > 0) {
      const cleanUrl = new URL("/", request.url);
      return NextResponse.redirect(cleanUrl);
    }
    return NextResponse.next();
  }

  // بررسی مسیرهای شروع‌شده با /dashboard
  if (protectedRoutesPattern.test(pathname)) {
    const token = request.cookies.get("access_token")?.value;

    if (!token) {
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};