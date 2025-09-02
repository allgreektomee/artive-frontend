// services/profileService.ts
import { API_BASE_URL } from "../utils/constants";
import {
  ProfileData,
  ApiResponse,
  Award,
  Exhibition,
  QA,
  ArtistVideo,
  ArtistStatement,
} from "../utils/types";
import { authUtils } from "@/utils/auth";
// 토큰 가져오기
const getAuthToken = () => {
  return authUtils.getToken();
};

// API 요청 헤더
const getHeaders = (isFormData = false) => {
  const headers: any = {
    Authorization: `Bearer ${getAuthToken()}`,
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

// 프로필 서비스
export const profileService = {
  // 전체 프로필 조회
  async getProfile(): Promise<ProfileData> {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // 기본 정보 업데이트
  async updateBasicInfo(
    data: Partial<ProfileData>
  ): Promise<ApiResponse<ProfileData>> {
    const response = await fetch(`${API_BASE_URL}/api/profile/basic`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // 아티스트 소개문 업데이트
  async updateArtistStatement(data: {
    statement_ko: string;
    statement_en?: string;
  }): Promise<ApiResponse<ArtistStatement>> {
    const response = await fetch(
      `${API_BASE_URL}/api/profile/artist-statement`,
      {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }
    );
    return handleResponse(response);
  },

  // 아티스트 비디오 추가
  async addArtistVideo(
    data: Partial<ArtistVideo>
  ): Promise<ApiResponse<ArtistVideo>> {
    const response = await fetch(`${API_BASE_URL}/api/profile/videos`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // 아티스트 비디오 삭제
  async deleteArtistVideo(videoId: number): Promise<ApiResponse<void>> {
    const response = await fetch(
      `${API_BASE_URL}/api/profile/videos/${videoId}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Q&A 목록 업데이트
  async updateQAList(qaList: QA[]): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE_URL}/api/profile/qa`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(qaList),
    });
    return handleResponse(response);
  },

  // 전시회 추가
  async addExhibition(
    data: Partial<Exhibition>
  ): Promise<ApiResponse<Exhibition>> {
    const response = await fetch(`${API_BASE_URL}/api/profile/exhibitions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // 전시회 수정
  async updateExhibition(
    exhibitionId: number,
    data: Partial<Exhibition>
  ): Promise<ApiResponse<Exhibition>> {
    const response = await fetch(
      `${API_BASE_URL}/api/profile/exhibitions/${exhibitionId}`,
      {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }
    );
    return handleResponse(response);
  },

  // 전시회 삭제
  async deleteExhibition(exhibitionId: number): Promise<ApiResponse<void>> {
    const response = await fetch(
      `${API_BASE_URL}/api/profile/exhibitions/${exhibitionId}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );
    return handleResponse(response);
  },

  // 수상 추가
  async addAward(data: Partial<Award>): Promise<ApiResponse<Award>> {
    const response = await fetch(`${API_BASE_URL}/api/profile/awards`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // 수상 수정
  async updateAward(
    awardId: number,
    data: Partial<Award>
  ): Promise<ApiResponse<Award>> {
    const response = await fetch(
      `${API_BASE_URL}/api/profile/awards/${awardId}`,
      {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }
    );
    return handleResponse(response);
  },

  // 수상 삭제
  async deleteAward(awardId: number): Promise<ApiResponse<void>> {
    const response = await fetch(
      `${API_BASE_URL}/api/profile/awards/${awardId}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );
    return handleResponse(response);
  },

  // 공개 프로필 조회 (slug로)
  async getPublicProfile(slug: string): Promise<ProfileData> {
    const response = await fetch(`${API_BASE_URL}/api/profile/${slug}`);
    return handleResponse(response);
  },

  // 프로필 이미지 업로드
  async uploadProfileImage(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
      method: "POST",
      headers: getHeaders(true),
      body: formData,
    });
    return handleResponse(response);
  },
};

// 간단한 export 함수들
export const getProfile = profileService.getProfile;
export const updateProfile = async (data: ProfileData) => {
  const responses = [];

  // 기본 정보 업데이트
  if (data.name || data.slug || data.bio) {
    responses.push(await profileService.updateBasicInfo(data));
  }

  // 아티스트 소개문 업데이트
  if (data.artist_statement) {
    responses.push(
      await profileService.updateArtistStatement({
        statement_ko: data.artist_statement,
      })
    );
  }

  // Q&A 업데이트
  if (data.qa_list) {
    responses.push(await profileService.updateQAList(data.qa_list));
  }

  // 전시회와 수상은 개별 API로 처리
  // (ProfileManagement 컴포넌트에서 직접 호출)

  return responses;
};
