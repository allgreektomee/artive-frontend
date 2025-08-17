// utils/constants.ts

// API 엔드포인트
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000";

// 기본 Q&A 질문
export const DEFAULT_QUESTIONS = [
  "어떤 계기로 작업을 시작하게 되었나요?",
  "작업의 주요 주제나 관심사는 무엇인가요?",
  "작업 과정에서 가장 중요하게 생각하는 것은 무엇인가요?",
  "앞으로의 작업 계획이나 목표가 있다면 무엇인가요?",
];

// 작품 상태
export const ARTWORK_STATUS = {
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  SOLD: "sold",
} as const;

// 작품 공개 설정
export const ARTWORK_PRIVACY = {
  PUBLIC: "public",
  PRIVATE: "private",
  FOLLOWERS: "followers",
} as const;

// 전시 유형
export const EXHIBITION_TYPES = {
  SOLO: "solo",
  GROUP: "group",
  FAIR: "fair",
} as const;

// 수상 유형
export const AWARD_TYPES = {
  AWARD: "award",
  COMPETITION: "competition",
  RESIDENCY: "residency",
  GRANT: "grant",
  SELECTION: "selection",
} as const;

// 미디어 타입
export const MEDIA_TYPES = {
  IMAGE: "image",
  VIDEO: "video",
  YOUTUBE: "youtube",
  INSTAGRAM: "instagram",
} as const;

// 히스토리 타입
export const HISTORY_TYPES = {
  PROGRESS: "progress",
  EXHIBITION: "exhibition",
  PUBLICATION: "publication",
  AWARD: "award",
  MEDIA: "media",
  NOTE: "note",
} as const;

// 파일 업로드 제한
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/webm", "video/ogg"],
};

// 페이지네이션
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// 정렬 옵션
export const SORT_OPTIONS = {
  CREATED_AT_DESC: { value: "created_at_desc", label: "최신순" },
  CREATED_AT_ASC: { value: "created_at_asc", label: "오래된순" },
  TITLE_ASC: { value: "title_asc", label: "제목순" },
  YEAR_DESC: { value: "year_desc", label: "제작년도 최신순" },
  VIEW_COUNT_DESC: { value: "view_count_desc", label: "조회수 많은순" },
  LIKE_COUNT_DESC: { value: "like_count_desc", label: "좋아요 많은순" },
};

// 필터 옵션
export const FILTER_OPTIONS = {
  STATUS: [
    { value: "all", label: "전체" },
    { value: "in_progress", label: "작업중" },
    { value: "completed", label: "완성" },
    { value: "sold", label: "판매완료" },
  ],
  PRIVACY: [
    { value: "all", label: "전체" },
    { value: "public", label: "공개" },
    { value: "private", label: "비공개" },
    { value: "followers", label: "팔로워만" },
  ],
  MEDIUM: [
    { value: "all", label: "전체" },
    { value: "painting", label: "회화" },
    { value: "sculpture", label: "조각" },
    { value: "photography", label: "사진" },
    { value: "digital", label: "디지털" },
    { value: "installation", label: "설치" },
    { value: "video", label: "영상" },
    { value: "performance", label: "퍼포먼스" },
    { value: "mixed", label: "혼합매체" },
  ],
};

// 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
  AUTH_REQUIRED: "로그인이 필요합니다.",
  PERMISSION_DENIED: "권한이 없습니다.",
  NOT_FOUND: "요청한 정보를 찾을 수 없습니다.",
  VALIDATION_ERROR: "입력한 정보를 다시 확인해주세요.",
  SERVER_ERROR: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  FILE_TOO_LARGE: "파일 크기는 10MB 이하여야 합니다.",
  INVALID_FILE_TYPE: "지원하지 않는 파일 형식입니다.",
};

// 성공 메시지
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: "저장되었습니다.",
  DELETE_SUCCESS: "삭제되었습니다.",
  UPDATE_SUCCESS: "수정되었습니다.",
  UPLOAD_SUCCESS: "업로드되었습니다.",
  LOGIN_SUCCESS: "로그인되었습니다.",
  LOGOUT_SUCCESS: "로그아웃되었습니다.",
  REGISTER_SUCCESS: "회원가입이 완료되었습니다.",
};

// 언어 설정
export const LANGUAGES = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
];

// 타임존 설정
export const TIMEZONES = [
  { value: "Asia/Seoul", label: "서울 (GMT+9)" },
  { value: "America/New_York", label: "뉴욕 (GMT-5)" },
  { value: "America/Los_Angeles", label: "로스앤젤레스 (GMT-8)" },
  { value: "Europe/London", label: "런던 (GMT+0)" },
  { value: "Europe/Paris", label: "파리 (GMT+1)" },
  { value: "Asia/Tokyo", label: "도쿄 (GMT+9)" },
];
