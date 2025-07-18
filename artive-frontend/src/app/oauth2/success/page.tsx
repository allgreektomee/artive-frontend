"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OAuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const nickname = urlParams.get("nickname");

    if (token && nickname) {
      localStorage.setItem("accessToken", token);
      router.replace(`/${nickname}`); // ✅ 닉네임 기반 경로로 이동
    }
  }, []);

  return <p>로그인 처리 중입니다...</p>;
}
