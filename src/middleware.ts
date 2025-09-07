import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);



export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const isLoginPage = req.nextUrl.pathname.startsWith("/login");
  console.log("JWT_SECRET in frontend:", process.env.JWT_SECRET);
  if (!token) {
    if (!isLoginPage) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }
  console.log("Token found:", token);

  try {
    await jwtVerify(token, SECRET);

    if (isLoginPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  } catch (err) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("access_token");
    console.error("JWT verification failed:", err);
    return response;
  }
}

export const config = {
  matcher:
    "/((?!_next/static|_next/image|favicon.ico|login|.*\\.(?:png|jpg|jpeg|svg|gif|ico)).*)",
};
