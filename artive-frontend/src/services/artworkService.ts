// services/artworkService.ts
import { API_BASE_URL } from "../utils/constants";
import {
  Artwork,
  ArtworkHistory,
  PaginatedResponse,
  ApiResponse,
} from "../utils/types";
import { tokenManager } from "./authService";

// API 요청 헤더
const getHeaders = (isFormData = false) => {
  const headers: any = {
    Authorization: `Bearer ${tokenManager.getToken()}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
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

// 작품 서비스
export const artworkService = {
  // 작품 목록 조회
  async getArtworks(params?: {
    status?: string;
    year?: string;
    medium?: string;
    privacy?: string;
    search?: string;
    sort_by?: string;
    sort_order?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Artwork>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/artworks/my?${queryParams}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // 작품 상세 조회
  async getArtwork(artworkId: number): Promise<Artwork> {
    const response = await fetch(`${API_BASE_URL}/artworks/${artworkId}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // 작품 생성
  async createArtwork(data: Partial<Artwork>): Promise<Artwork> {
    const response = await fetch(`${API_BASE_URL}/artworks`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // 작품 수정
  async updateArtwork(
    artworkId: number,
    data: Partial<Artwork>
  ): Promise<Artwork> {
    const response = await fetch(`${API_BASE_URL}/artworks/${artworkId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // 작품 삭제
  async deleteArtwork(artworkId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/artworks/${artworkId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: "Unknown error" }));
      throw new Error(error.detail || error.message || "Request failed");
    }
  },

  // 작품 좋아요 토글
  async toggleLike(artworkId: number): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE_URL}/artworks/${artworkId}/like`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // 작품 통계 조회
  async getArtworkStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/artworks/stats`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // === 히스토리 관련 ===

  // 히스토리 목록 조회
  async getHistories(artworkId: number): Promise<ArtworkHistory[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/artworks/${artworkId}/histories`,
      {
        headers: getHeaders(),
      }
    );
    return handleResponse(response);
  },

  // 히스토리 추가
  async addHistory(
    artworkId: number,
    data: Partial<ArtworkHistory>
  ): Promise<ArtworkHistory> {
    const response = await fetch(
      `${API_BASE_URL}/api/artworks/${artworkId}/histories`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }
    );
    return handleResponse(response);
  },

  // 히스토리 수정
  async updateHistory(
    artworkId: number,
    historyId: number,
    data: Partial<ArtworkHistory>
  ): Promise<ArtworkHistory> {
    const response = await fetch(
      `${API_BASE_URL}/api/artworks/${artworkId}/histories/${historyId}`,
      {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }
    );
    return handleResponse(response);
  },

  // 히스토리 삭제
  async deleteHistory(artworkId: number, historyId: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/artworks/${artworkId}/histories/${historyId}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: "Unknown error" }));
      throw new Error(error.detail || error.message || "Request failed");
    }
  },

  // === 공개 갤러리 조회 ===

  // 사용자 갤러리 작품 목록
  async getUserGalleryArtworks(
    userSlug: string,
    params?: {
      status?: string;
      year?: string;
      medium?: string;
      search?: string;
      sort_by?: string;
      sort_order?: string;
      page?: number;
      size?: number;
    }
  ): Promise<PaginatedResponse<Artwork>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/artworks/user/${userSlug}?${queryParams}`
    );
    return handleResponse(response);
  },

  // 사용자 갤러리 통계
  async getUserGalleryStats(userSlug: string): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/artworks/user/${userSlug}/stats`
    );
    return handleResponse(response);
  },

  // === 이미지 업로드 ===

  // 작품 이미지 업로드
  async uploadArtworkImage(
    file: File
  ): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
      method: "POST",
      headers: getHeaders(true),
      body: formData,
    });
    return handleResponse(response);
  },

  // 이미지 삭제
  async deleteImage(imageUrl: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
      method: "DELETE",
      headers: getHeaders(),
      body: JSON.stringify({ image_url: imageUrl }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: "Unknown error" }));
      throw new Error(error.detail || error.message || "Request failed");
    }
  },
};
