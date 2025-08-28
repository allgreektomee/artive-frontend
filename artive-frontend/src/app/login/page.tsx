"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    const res = await fetch(`${backEndUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(form),
    }).catch((error) => {
      console.error("Network error:", error);
      setError("서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.");
      setLoading(false);
      return null;
    });

    if (!res) return;

    const responseData = await res.json().catch(() => null);

    // 로그인 성공
    if (res.ok && responseData) {
      localStorage.setItem("token", responseData.access_token);
      localStorage.setItem("user", JSON.stringify(responseData.user));
      router.push(`/${responseData.user.slug}`);
      return;
    }

    // 로그인 실패
    setError(responseData?.detail || "로그인에 실패했습니다.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Artive 로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            작가 포트폴리오 플랫폼에 오신 것을 환영합니다
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                placeholder="이메일 주소"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              가입 문의는{" "}
              <a
                href="https://instagram.com/artiveforme"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-pink-600 hover:text-pink-500"
              >
                @artiveforme
              </a>{" "}
              DM으로
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
