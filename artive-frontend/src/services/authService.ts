// services/authService.ts
import { API_BASE_URL } from "../utils/constants";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  ApiResponse,
} from "../utils/types";

// 토큰 관리
export const tokenManager = {
  getToken: () => localStorage.getItem("access_token"),
  setToken: (token: string) => localStorage.setItem("access_token", token),
  removeToken: () => localStorage.removeItem("access_token"),

  getUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
  setUser: (user: User) => localStorage.setItem("user", JSON.stringify(user)),
  removeUser: () => localStorage.removeItem("user"),

  clear: () => {
    tokenManager.removeToken();
    tokenManager.removeUser();
  },
};

// API 요청 헤더
const getHeaders = (includeAuth = false) => {
  const headers: any = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = tokenManager.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// 에러 처리
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || error.message || "Request failed");
  }
  return response.json();
};

// 인증 서비스
export const authService = {
  // 로그인
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse(response);

    // 토큰과 사용자 정보 저장
    tokenManager.setToken(data.access_token);
    tokenManager.setUser(data.user);

    return data;
  },

  // 회원가입
  async register(userData: RegisterRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });

    return handleResponse(response);
  },

  // 로그아웃
  logout(): void {
    tokenManager.clear();
    window.location.href = "/login";
  },

  // 현재 사용자 정보 조회
  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(true),
    });

    const user = await handleResponse(response);
    tokenManager.setUser(user);

    return user;
  },

  // 이메일 인증
  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    const response = await fetch(
      `${API_BASE_URL}/auth/verify-email?token=${token}`
    );
    return handleResponse(response);
  },

  // 이메일 인증 재발송
  async resendVerification(email: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  // 슬러그 중복 확인
  async checkSlugAvailability(
    slug: string
  ): Promise<{ available: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/check-slug`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ slug }),
    });
    return handleResponse(response);
  },

  // 비밀번호 재설정 요청
  async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    const response = await fetch(
      `${API_BASE_URL}/auth/password-reset/request`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email }),
      }
    );
    return handleResponse(response);
  },

  // 비밀번호 재설정
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ApiResponse<void>> {
    const response = await fetch(
      `${API_BASE_URL}/auth/password-reset/confirm`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ token, new_password: newPassword }),
      }
    );
    return handleResponse(response);
  },

  // 로그인 상태 확인
  isAuthenticated(): boolean {
    return !!tokenManager.getToken();
  },

  // 현재 사용자 가져오기 (캐시된 데이터)
  getCachedUser(): User | null {
    return tokenManager.getUser();
  },
};

// 인증 체크 HOC
export const withAuth = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    if (!authService.isAuthenticated()) {
      window.location.href = "/login";
      return null;
    }
    return <Component {...props} />;
  };
};

// 인증 Hook
export const useAuth = () => {
  const [user, setUser] = React.useState<User | null>(
    authService.getCachedUser()
  );
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (authService.isAuthenticated()) {
      authService
        .getCurrentUser()
        .then(setUser)
        .catch(() => authService.logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated: authService.isAuthenticated(),
    login: authService.login,
    logout: authService.logout,
    register: authService.register,
  };
};
