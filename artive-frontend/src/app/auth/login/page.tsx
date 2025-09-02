"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { authUtils } from "@/utils/auth";
export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setShowResendButton(false);
  };

  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleGoogleLogin = () => {
    window.location.href = `${backEndUrl}/oauth2/authorization/google`;
  };

  const handleResendVerification = async () => {
    if (resendLoading) return;

    setResendLoading(true);
    setError("");

    try {
      const res = await fetch(`${backEndUrl}/api/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(
          data.message || "인증 메일이 재발송되었습니다. 이메일을 확인해주세요."
        );
        setShowResendButton(false);
      } else {
        setError(data.detail || "재발송에 실패했습니다.");
      }
    } catch (err) {
      setError("재발송 중 오류가 발생했습니다.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);
    setShowResendButton(false);

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

    // 403 상태 코드 체크 (이메일 미인증)
    if (res.status === 403) {
      setError(
        responseData?.detail ||
          "이메일 인증이 필요합니다. 인증 메일을 확인해주세요."
      );
      setShowResendButton(true);
      setLoading(false);
      return;
    }

    // 401 상태 코드 체크 (인증 실패)
    if (res.status === 401) {
      setError(
        responseData?.detail || "이메일 또는 비밀번호가 올바르지 않습니다."
      );
      setShowResendButton(false);
      setLoading(false);
      return;
    }

    // 200 OK 체크
    if (res.ok && responseData) {
      localStorage.setItem("access_token", responseData.access_token);
      localStorage.setItem("user", JSON.stringify(responseData.user));
      router.push(`/${responseData.user.slug}`);
      return;
    }

    // 기타 에러
    setError(responseData?.detail || "로그인에 실패했습니다.");
    setShowResendButton(false);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            아직 계정이 없으시나요?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              회원가입
            </Link>
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </div>

          {showResendButton && (
            <div>
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {resendLoading ? "재발송 중..." : "이메일 인증 재발송"}
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/auth/forgot-password"
                className="font-medium text-gray-600 hover:text-indigo-500"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                구글 계정으로 로그인
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
