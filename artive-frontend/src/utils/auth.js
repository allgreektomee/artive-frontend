// utils/auth.js
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const authUtils = {
  // 토큰 저장
  setToken: (token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
      console.log("✅ 토큰 저장됨:", token.substring(0, 20) + "...");
    }
  },

  // 토큰 가져오기
  getToken: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      console.log(
        "🔍 토큰 조회:",
        token ? token.substring(0, 20) + "..." : "null"
      );
      return token;
    }
    return null;
  },

  // 토큰 삭제
  removeToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      console.log("🗑️ 토큰 삭제됨");
    }
  },

  // 토큰 유효성 검사
  isTokenValid: (token) => {
    if (!token) return false;

    try {
      // JWT 페이로드 디코딩 (간단한 검증)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000; // 밀리초로 변환
      const now = Date.now();

      console.log("🕐 토큰 만료시간:", new Date(exp));
      console.log("🕐 현재시간:", new Date(now));

      return now < exp;
    } catch (error) {
      console.error("❌ 토큰 디코딩 실패:", error);
      return false;
    }
  },

  // 현재 사용자 정보 가져오기
  getCurrentUser: async () => {
    const token = authUtils.getToken();

    if (!token) {
      console.log("❌ 토큰이 없습니다");
      return null;
    }

    if (!authUtils.isTokenValid(token)) {
      console.log("❌ 토큰이 만료되었습니다");
      authUtils.removeToken();
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("🔍 사용자 정보 요청 응답:", response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log("✅ 사용자 정보 가져오기 성공:", userData);
        return userData;
      } else {
        console.log("❌ 사용자 정보 가져오기 실패:", response.status);
        if (response.status === 401) {
          authUtils.removeToken();
        }
        return null;
      }
    } catch (error) {
      console.error("❌ 사용자 정보 요청 오류:", error);
      return null;
    }
  },

  // API 요청 헬퍼 (토큰 자동 첨부)
  apiRequest: async (url, options = {}) => {
    const token = authUtils.getToken();

    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    console.log("🌐 API 요청:", url, config);

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);

      // 401 오류 시 토큰 삭제
      if (response.status === 401) {
        console.log("❌ 인증 실패 - 토큰 삭제");
        authUtils.removeToken();
        window.location.href = "/auth/login";
      }

      return response;
    } catch (error) {
      console.error("❌ API 요청 오류:", error);
      throw error;
    }
  },
};

// 페이지 로드 시 토큰 검증
export const checkAuth = async () => {
  console.log("🔍 인증 상태 확인 시작");

  const token = authUtils.getToken();
  if (!token) {
    console.log("❌ 토큰이 없습니다");
    return null;
  }

  if (!authUtils.isTokenValid(token)) {
    console.log("❌ 토큰이 만료되었습니다");
    authUtils.removeToken();
    return null;
  }

  const user = await authUtils.getCurrentUser();
  if (user) {
    console.log("✅ 인증 성공:", user.name);
  } else {
    console.log("❌ 인증 실패");
  }

  return user;
};
