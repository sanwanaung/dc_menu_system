import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const roles = ["admin", "subadmin"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isAuthApi = pathname.startsWith("/api/auth");
  const isPublicPage =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname === "/menu" ||
    pathname === "/room-service";
  const isApi = pathname.startsWith("/api");

  if (isPublicPage || isAuthApi) {
    return NextResponse.next();
  }

  if (!session) {
    if (isApi) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (
    pathname.startsWith("/admin") &&
    !roles.includes(session.user?.role ?? "")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
