// utils/auth.js
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const authUtils = {
  // 토큰 저장
  setTokens: (accessToken, refreshToken) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      console.log("✅ 토큰 저장 완료");
    }
  },

  // 토큰 가져오기
  getAccessToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  },

  getRefreshToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refresh_token");
    }
    return null;
  },

  // 모든 인증 데이터 삭제
  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      console.log("🧹 인증 데이터 삭제 완료");
    }
  },

  // 사용자 정보 저장/가져오기
  setUser: (user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },

  getUser: () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
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

  // 토큰 갱신
  refreshAccessToken: async () => {
    const refreshToken = authUtils.getRefreshToken();

    if (!refreshToken) {
      console.log("❌ Refresh token이 없습니다");
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        authUtils.setTokens(data.access_token, data.refresh_token);
        console.log("✅ 토큰 갱신 성공");
        return true;
      } else {
        console.log("❌ 토큰 갱신 실패");
        authUtils.clearAuth();
        return false;
      }
    } catch (error) {
      console.error("토큰 갱신 오류:", error);
      authUtils.clearAuth();
      return false;
    }
  },

  // API 요청 (자동 토큰 갱신 포함)
  apiRequest: async (url, options = {}) => {
    let accessToken = authUtils.getAccessToken();

    const makeRequest = async (token) => {
      const headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      return fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
      });
    };

    // 첫 번째 요청
    let response = await makeRequest(accessToken);

    // 401 오류이고 refresh token이 있다면 갱신 시도
    if (response.status === 401 && authUtils.getRefreshToken()) {
      console.log("🔄 토큰 만료, 갱신 시도");

      const refreshed = await authUtils.refreshAccessToken();
      if (refreshed) {
        // 갱신된 토큰으로 재요청
        accessToken = authUtils.getAccessToken();
        response = await makeRequest(accessToken);
      } else {
        // 갱신 실패시 로그인 페이지로
        window.location.href = "/auth/login";
        throw new Error("인증이 만료되었습니다");
      }
    }

    return response;
  },

  // 로그인
  login: async (email, password) => {
    try {
      authUtils.clearAuth();

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        authUtils.setTokens(data.access_token, data.refresh_token);
        authUtils.setUser(data.user);
        console.log("✅ 로그인 성공");
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.detail, status: response.status };
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      return { success: false, error: error.message };
    }
  },

  // 로그아웃
  logout: () => {
    authUtils.clearAuth();
    window.location.href = "/login";
  },

  // 현재 사용자 정보 가져오기
  getCurrentUser: async () => {
    try {
      const response = await authUtils.apiRequest("/api/auth/me");

      if (response.ok) {
        const userData = await response.json();
        authUtils.setUser(userData);
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      console.error("사용자 정보 조회 오류:", error);
      return null;
    }
  },
  getToken: () => {
    return authUtils.getAccessToken();
  },
};
