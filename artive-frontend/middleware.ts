import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * `/dev` 문서는 메인 프로덕션 호스트에 노출하지 않는다.
 * - `next dev`(NODE_ENV=development): 허용
 * - 호스트가 `dev.` 로 시작 (예: dev.artivefor.me): 허용
 * - localhost / 127.0.0.1: 허용
 * - `DEV_DOCS_PUBLIC=true` 일 때만 프로덕션에서도 허용 (비상용)
 */
function hostAllowsDevDocs(host: string): boolean {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  if (h === "localhost" || h.startsWith("127.0.0.1")) return true;
  if (h.startsWith("dev.")) return true;
  return false;
}

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  if (process.env.DEV_DOCS_PUBLIC === "true") {
    return NextResponse.next();
  }

  const host = request.headers.get("host") ?? "";
  if (hostAllowsDevDocs(host)) {
    return NextResponse.next();
  }

  return new NextResponse("Not Found", { status: 404, statusText: "Not Found" });
}

export const config = {
  matcher: ["/dev", "/dev/:path*"],
};
