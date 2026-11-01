import { NextRequest, NextResponse } from "next/server";

function sameText(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index++) difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return difference === 0;
}

export function middleware(request: NextRequest) {
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin");
  const isMutation = request.method !== "GET" && request.method !== "HEAD" && request.method !== "OPTIONS";
  if (!isAdminPage && !isMutation) return NextResponse.next();

  const password = process.env.ADMIN_PASSWORD;
  if (!password) return new NextResponse("Configura ADMIN_PASSWORD para usar el panel.", { status: 503 });

  if (isMutation) {
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin) return new NextResponse("Origen no permitido", { status: 403 });
  }

  const authorization = request.headers.get("authorization");
  let credentials = "";
  try {
    if (authorization?.startsWith("Basic ")) credentials = atob(authorization.slice(6));
  } catch {
    // A malformed authorization header is treated as unauthenticated.
  }
  if (sameText(credentials, `admin:${password}`)) return NextResponse.next();

  return new NextResponse("Autenticación requerida", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Copa Atahualpa Admin", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/teams/:path*", "/api/rounds/:path*", "/api/matches/:path*", "/api/playoffs/:path*", "/api/seasons/:path*"],
};
