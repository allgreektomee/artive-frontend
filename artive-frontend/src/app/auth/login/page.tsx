"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const handleGoogleLogin = () => {
    window.location.href = `${backEndUrl}/oauth2/authorization/google`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${backEndUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 쿠키 인증 시 필요
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);

        router.push(`/${data.slug}`); // 로그인 성공 시 작가 페이지로 이동
      } else {
        const msg = await res.text();
        setError(msg || "로그인에 실패했습니다.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("서버 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
      <h1 className="text-2xl font-bold">로그인</h1>

      {error && (
        <p className="text-red-600 text-sm">{"이메일 및 패스워드 확인"}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          로그인
        </button>
      </form>

      <div className="text-sm text-gray-500">또는</div>

      <button
        onClick={handleGoogleLogin}
        className="w-full border py-2 rounded text-sm hover:bg-gray-100"
      >
        구글 로그인
      </button>

      <p className="text-sm text-gray-500">
        아직 계정이 없으신가요?{" "}
        <Link href="/auth/signup">
          <span className="text-blue-600 hover:underline">회원가입</span>
        </Link>
      </p>
    </div>
  );
}
