import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  // 로그인이 안 되어 있으면 로그인 페이지로 리디렉션
  if (!token) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r px-6 py-8">
        <h1 className="text-xl font-bold mb-8">Admin</h1>
        <nav className="space-y-4">
          <Link href="/admin/artworks" className="block hover:underline">
            🎨 아트웍스 관리
          </Link>
          <Link href="/admin/history" className="block hover:underline">
            🕘 히스토리 관리
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
