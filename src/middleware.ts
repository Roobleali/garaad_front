import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define paths that require premium access
const premiumPaths = [
  "/courses",
  "/lessons",
  "/", // Adding home page to premium paths
];

// Define paths that are always public
const publicPaths = [
  "/login",
  "/register",
  "/subscribe",
  "/api/payment",
  "/api/payment/success",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  "/logo.png",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if the path requires premium access
  const isPremiumPath = premiumPaths.some((path) => pathname.startsWith(path));

  if (isPremiumPath) {
    try {
      // Get user from cookie
      const userCookie = request.cookies.get("user");
      if (!userCookie) {
        // Redirect to login if no user cookie
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const user = JSON.parse(userCookie.value);
      if (!user.is_premium) {
        // Redirect to subscribe page if user is not premium
        return NextResponse.redirect(new URL("/subscribe", request.url));
      }
    } catch (error) {
      // If there's any error parsing the cookie, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
