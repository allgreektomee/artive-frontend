"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const backEndUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("🔍 Backend URL:", backEndUrl);
    console.log("🔍 환경변수 확인:", process.env.NEXT_PUBLIC_BACKEND_URL);

    try {
      console.log("🔍 로그인 요청:", {
        url: `${backEndUrl}/auth/login`,
        body: { email: form.email.trim(), password: form.password.trim() },
      });

      // FastAPI 로그인 API 호출
      const res = await fetch(`${backEndUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password.trim(),
        }),
      });

      console.log("🔍 응답 상태:", res.status);
      const data = await res.json();
      console.log("🔍 응답 데이터:", data);

      if (res.ok) {
        // FastAPI 응답 형식: { access_token, token_type, user }
        const { access_token, user } = data;

        // JWT 토큰을 localStorage에 저장
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("user", JSON.stringify(user));

        // 사용자 갤러리로 리다이렉트
        router.push(`/${user.slug}`);
      } else {
        // FastAPI 에러 응답 형식: { detail: "에러 메시지" }
        setError(data.detail || "로그인에 실패했습니다.");
      }
    } catch (err: unknown) {
      console.error("로그인 에러:", err);
      if (err instanceof Error) {
        setError("네트워크 오류: " + err.message);
      } else {
        setError("서버와 연결할 수 없습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 임시로 구글 로그인 비활성화 (FastAPI에서 구현 후 활성화)
  const handleGoogleLogin = () => {
    alert("구글 로그인은 곧 지원될 예정입니다.");
    // TODO: FastAPI OAuth2 구현 후 활성화
    // window.location.href = `${backEndUrl}/auth/google`;
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
      <h1 className="text-2xl font-bold">로그인</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={form.email}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="text-sm text-gray-500">또는</div>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full border border-gray-300 py-3 rounded-lg text-sm hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
      >
        구글 로그인 (준비중)
      </button>

      <p className="text-sm text-gray-500">
        아직 계정이 없으신가요?{" "}
        <Link href="/auth/signup">
          <span className="text-blue-600 hover:underline">회원가입</span>
        </Link>
      </p>

      {/* 개발환경 테스트용 */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-gray-100 rounded text-xs text-left">
          <p className="font-semibold mb-2">개발 테스트용:</p>
          <p>이메일: user@example.com</p>
          <p>비밀번호: (가입시 설정한 비밀번호)</p>
          <p className="text-gray-600 mt-1">
            API 서버: {backEndUrl || "환경변수 설정 필요"}
          </p>
        </div>
      )}
    </div>
  );
}
