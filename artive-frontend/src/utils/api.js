const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  // endpoint가 /로 시작하지 않으면 추가
  const url = endpoint.startsWith("/")
    ? `${API_BASE_URL}${endpoint}`
    : `${API_BASE_URL}/${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // 401 에러 처리
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
    return;
  }

  return response;
};
