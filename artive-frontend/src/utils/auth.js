// utils/auth.js
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const authUtils = {
  // 모든 인증 데이터 초기화
  clearAllAuth: () => {
    if (typeof window !== "undefined") {
      // localStorage 정리
      localStorage.removeItem("access_token");
      localStorage.removeItem("token"); // 레거시 호환
      localStorage.removeItem("user");

      // sessionStorage 정리
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // 쿠키 정리
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      console.log("🧹 모든 인증 데이터 초기화 완료");
    }
  },

  // 토큰 저장 (다중 백업)
  setToken: (token) => {
    if (typeof window !== "undefined") {
      // 기존 데이터 먼저 정리
      authUtils.clearAllAuth();

      try {
        // 1. localStorage (메인)
        localStorage.setItem("access_token", token);
        localStorage.setItem("token", token); // 레거시 호환

        // 2. sessionStorage (백업)
        sessionStorage.setItem("access_token", token);

        // 3. 쿠키 (Safari 대응)
        const maxAge = 7 * 24 * 60 * 60; // 7일
        document.cookie = `access_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;

        // Safari 감지
        const isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        );
        if (isSafari) {
          // Safari는 쿠키를 우선 사용
          document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=None; Secure`;
        }

        console.log("✅ 토큰 저장 완료 (다중 백업)");
      } catch (error) {
        console.error("❌ 토큰 저장 실패:", error);
      }
    }
  },

  // 토큰 가져오기 (우선순위)
  getToken: () => {
    if (typeof window !== "undefined") {
      // 여러 소스에서 토큰 찾기
      const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("token") || // 레거시 호환
        sessionStorage.getItem("access_token") ||
        authUtils.getCookieValue("access_token") ||
        authUtils.getCookieValue("token");

      if (token) {
        console.log("🔍 토큰 찾음:", token.substring(0, 20) + "...");
      } else {
        console.log("❌ 토큰을 찾을 수 없음");
      }

      return token;
    }
    return null;
  },

  // 쿠키에서 값 가져오기
  getCookieValue: (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  },

  // 사용자 정보 저장
  setUser: (user) => {
    if (typeof window !== "undefined") {
      const userStr = JSON.stringify(user);
      localStorage.setItem("user", userStr);
      sessionStorage.setItem("user", userStr);
      console.log("✅ 사용자 정보 저장:", user);
    }
  },

  // 사용자 정보 가져오기
  getUser: () => {
    if (typeof window !== "undefined") {
      const userStr =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (e) {
          console.error("사용자 정보 파싱 실패:", e);
        }
      }
    }
    return null;
  },

  // 로그인 처리
  login: async (email, password) => {
    try {
      // 1. 기존 데이터 정리
      authUtils.clearAllAuth();

      // 2. 로그인 API 호출
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. 토큰과 사용자 정보 저장
        authUtils.setToken(data.access_token);
        authUtils.setUser(data.user);

        console.log("✅ 로그인 성공");
        return { success: true, user: data.user };
      } else {
        console.error("❌ 로그인 실패:", data);
        return { success: false, error: data.detail };
      }
    } catch (error) {
      console.error("❌ 로그인 오류:", error);
      return { success: false, error: error.message };
    }
  },

  // 로그아웃
  logout: () => {
    authUtils.clearAllAuth();
    console.log("✅ 로그아웃 완료");
  },

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
