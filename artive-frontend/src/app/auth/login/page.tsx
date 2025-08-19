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

    try {
      const response = await fetch(`${backEndUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      console.log("🔍 로그인 응답 상태:", response.status);
      console.log("🔍 로그인 응답 데이터:", data);

      if (response.ok) {
        // 로그인 성공
        // 1. 토큰 저장
        localStorage.setItem("token", data.access_token);

        // 2. ⭐ user 정보도 저장해야 함! (이게 빠져있었음)
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("✅ user 정보 저장됨:", data.user);
        }

        // 3. 리다이렉트
        if (data.user && data.user.slug) {
          console.log("🚀 리다이렉트:", `/${data.user.slug}`);
          router.push(`/${data.user.slug}`); // jaeyoungpark로 이동
        } else {
          // user 정보가 없으면 /auth/me 호출해서 정보 가져오기
          try {
            const meResponse = await fetch(`${backEndUrl}/api/auth/me`, {
              headers: {
                Authorization: `Bearer ${data.access_token}`,
              },
            });

            if (meResponse.ok) {
              const userData = await meResponse.json();
              // /auth/me로 가져온 user 정보도 저장
              localStorage.setItem("user", JSON.stringify(userData));
              console.log("✅ /auth/me로 user 정보 가져옴:", userData);
              router.push(`/${userData.slug}`);
            } else {
              router.push("/"); // 실패시 홈으로
            }
          } catch {
            router.push("/"); // 에러시 홈으로
          }
        }
      } else {
        // 로그인 실패
        setError(data.detail || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      setError("서버 연결에 실패했습니다.");
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
