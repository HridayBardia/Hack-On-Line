import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestId = crypto.randomUUID();

  // Extract client IP address securely, prioritizing trusted proxy headers
  const cfIp = request.headers.get("cf-connecting-ip");
  const realIp = request.headers.get("x-real-ip");
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = cfIp || realIp || (forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1");

  // Rate Limiting strictly applied to API endpoints
  if (pathname.startsWith("/api/")) {
    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(request.method);

    // CSRF Defense: Reject untrusted external origins on mutations
    if (isMutation) {
      const origin = request.headers.get("origin");
      const host = request.headers.get("host");
      if (origin && host) {
        try {
          const originHost = new URL(origin).host;
          // Allow same-origin or localhost in development
          if (originHost !== host && !originHost.startsWith("localhost:") && originHost !== "localhost") {
            return new NextResponse(
              JSON.stringify({
                error: "Forbidden",
                message: "Cross-origin request blocked by security policy.",
              }),
              {
                status: 403,
                headers: { "Content-Type": "application/json" },
              }
            );
          }
        } catch {
          return new NextResponse(
            JSON.stringify({ error: "Bad Request", message: "Malformed Origin header." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }

    // Stricter limit for mutations (15 req/min) to prevent brute-force and DB saturation
    // More permissive for read endpoints (60 req/min)
    const rateLimitConfig = isMutation
      ? { interval: 60 * 1000, maxRequests: 15 }
      : { interval: 60 * 1000, maxRequests: 60 };

    const rateResult = rateLimit(`${ip}:${pathname}:${request.method}`, rateLimitConfig);

    if (!rateResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please wait before retrying.",
          retryAfter: rateResult.retryAfter,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": rateResult.retryAfter.toString(),
            "X-RateLimit-Limit": rateResult.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateResult.reset.toString(),
            "X-Request-Id": requestId,
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", rateResult.limit.toString());
    response.headers.set("X-RateLimit-Remaining", rateResult.remaining.toString());
    response.headers.set("X-RateLimit-Reset", rateResult.reset.toString());
    response.headers.set("X-Request-Id", requestId);
    return response;
  }

  // Next.js response with standard tracing header
  const response = NextResponse.next();
  response.headers.set("X-Request-Id", requestId);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
