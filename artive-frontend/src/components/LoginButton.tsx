// components/LoginButton.tsx
"use client";
import { FcGoogle } from "react-icons/fc";

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/google`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100"
    >
      <FcGoogle className="text-xl" />
      <span>구글 계정으로 로그인</span>
    </button>
  );
}
