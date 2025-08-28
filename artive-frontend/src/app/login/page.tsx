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
    <div className="min-h-screen bg-white">
      <div className="px-8 pt-16 pb-8">
        <div className="max-w-sm mx-auto">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Artive Login</h2>
            <p className="text-sm text-gray-600">
              당신의 예술적 순간들을 기다립니다
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="비밀번호"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-4 rounded-2xl font-medium text-base hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors active:scale-95 duration-200"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                About Membership{" "}
                <a
                  href="https://instagram.com/artiveforme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-800 hover:text-gray-600 underline"
                >
                  @artiveforme
                </a>{" "}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
