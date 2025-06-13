import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that should be accessible without premium
const publicPaths = [
  "/",
  "/login",
  "/signup",
  "/subscribe",
  "/api",
  "/_next",
  "/static",
  "/favicon.ico",
];

// Add paths that require premium access
const premiumPaths = [
  "/courses",
  "/lessons",
  "/profile",
  "/dashboard",
  "/learning",
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow public paths
  if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
    return NextResponse.next();
  }

  // Get user from cookie
  const userStr = request.cookies.get("user")?.value;

  // If no user cookie, redirect to login
  if (!userStr) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const user = JSON.parse(userStr);

    // Check if the path requires premium access
    const requiresPremium = premiumPaths.some((premiumPath) =>
      path.startsWith(premiumPath)
    );

    // If path requires premium and user is not premium, redirect to subscribe
    if (requiresPremium && !user.is_premium) {
      const subscribeUrl = new URL("/subscribe", request.url);
      subscribeUrl.searchParams.set("redirect", path);
      return NextResponse.redirect(subscribeUrl);
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
    // If there's an error parsing user data, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
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
