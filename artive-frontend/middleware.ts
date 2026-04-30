import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * `/dev` 학습·목차 구역 접근 허용 호스트
 * - `artivefor.me` 및 `*.artivefor.me` (예: www.artivefor.me): 공식 사이트에서 제공
 * - `next dev`, localhost, `dev.*` 서브도메인: 개발용
 * - 그 외 배포 호스트(Vercel 미리보기 등): `DEV_DOCS_PUBLIC=true` 일 때만 허용
 */
function hostAllowsDevDocs(host: string): boolean {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  if (h === "localhost" || h.startsWith("127.0.0.1")) return true;
  if (h.startsWith("dev.")) return true;
  if (h === "artivefor.me" || h.endsWith(".artivefor.me")) return true;
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
