import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  // 1. Nếu chưa có token mà vào các trang bảo vệ -> Đẩy về /login
  if (!token) {
    if (pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  try {
    const payload = decodeJwt(token);
    const role = payload.role as string;

    if (pathname === "/" || pathname === "/login") {
      if (role === "Quan_tri" || role === "Thu_ky") {
        return NextResponse.redirect(new URL("/department/classes", request.url));
      }
      if (role === "Giang_vien" || role === "Thinh_giang") {
        return NextResponse.redirect(new URL("/lecturer/classes", request.url));
      }
      if (role === "Sinh_vien") {
        return NextResponse.redirect(new URL("/student/classes", request.url));
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/department")) {
      if (role !== "Quan_tri" && role !== "Thu_ky") {
        return NextResponse.redirect(new URL("/403", request.url));
      }
    }

    // Bảo vệ vùng /lecturer
    if (pathname.startsWith("/lecturer")) {
      if (role !== "Giang_vien" && role !== "Thinh_giang") {
        return NextResponse.redirect(new URL("/403", request.url));
      }
    }

    if (pathname.startsWith("/student")) {
      if (role !== "Sinh_vien") {
        return NextResponse.redirect(new URL("/403", request.url));
      }
    }

    return NextResponse.next();
  } catch (e) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("refreshToken");
    return response;
  }
}

// 4. Cấu hình Matcher để Middleware không quét qua file tĩnh (ảnh, css, js)
export const config = {
  matcher: [
    "/",
    "/login",
    "/department/:path*",
    "/lecturer/:path*",
    "/student/:path*",
  ],
};