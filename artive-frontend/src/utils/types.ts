// utils/types.ts

// 기본 사용자 정보
export interface User {
  id: number;
  email: string;
  name: string;
  slug: string;
  bio?: string;
  thumbnail_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  facebook_url?: string;
  custom_domain?: string;
  is_public_gallery: boolean;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;

  artist_statement?: string;
  about_text?: string;
  about_image?: string;
  educations?: any[];
  solo_exhibitions?: any[];
  group_exhibitions?: any[];
  awards?: any[];
  collections?: any[];
  press?: any[];
  publications?: any[];
}

// Q&A 타입
export interface QA {
  id: number;
  question: string;
  answer: string;
  question_ko?: string;
  question_en?: string;
  answer_ko?: string;
  answer_en?: string;
  order_index?: number;
}

// 전시회 타입
export interface Exhibition {
  id: number;
  title_ko: string;
  title_en?: string;
  venue_ko: string;
  venue_en?: string;
  year: string;
  exhibition_type: "solo" | "group" | "fair";
  description_ko?: string;
  description_en?: string;
  is_featured: boolean;
  order_index?: number;
}

// 수상 타입
export interface Award {
  id: number;
  title_ko: string;
  title_en?: string;
  organization_ko: string;
  organization_en?: string;
  year: string;
  award_type: "award" | "competition" | "residency" | "grant" | "selection";
  description_ko?: string;
  description_en?: string;
  is_featured: boolean;
  order_index?: number;
}

// 아티스트 비디오
export interface ArtistVideo {
  id: number;
  video_url: string;
  video_id: string;
  title_ko: string;
  title_en?: string;
  description_ko?: string;
  description_en?: string;
  is_featured: boolean;
  order_index: number;
}

// 아티스트 소개문
export interface ArtistStatement {
  id: number;
  statement_ko: string;
  statement_en?: string;
  created_at: string;
  updated_at: string;
}

// 작품 타입
export interface Artwork {
  id: number;
  title: string;
  description?: string;
  thumbnail_url: string;
  work_in_progress_url?: string;
  medium?: string;
  size?: string;
  year?: string;
  status: "in_progress" | "completed" | "sold";
  privacy: "public" | "private" | "followers";
  started_at?: string;
  completed_at?: string;
  estimated_completion?: string;
  view_count: number;
  like_count: number;
  history_count: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// 작품 히스토리
export interface ArtworkHistory {
  id: number;
  artwork_id: number;
  title: string;
  content?: string;
  media_url?: string;
  thumbnail_url?: string;
  media_type?: string;
  history_type: string;
  external_url?: string;
  external_id?: string;
  youtube_video_id?: string;
  youtube_title?: string;
  youtube_duration?: number;
  instagram_post_id?: string;
  instagram_caption?: string;
  order_index: number;
  work_date?: string;
  imported_at?: string;
  icon_emoji?: string;
  created_at: string;
  updated_at: string;
}

// 전체 프로필 데이터
export interface ProfileData {
  // 기본 정보
  id?: number;
  email?: string;
  name?: string;
  slug?: string;
  bio?: string;
  thumbnail_url?: string;

  // SNS 링크
  instagram_url?: string;
  instagram_user_id?: string;
  youtube_url?: string;
  youtube_channel_id?: string;
  facebook_url?: string;
  facebook_page_id?: string;

  // 아티스트 소개
  artist_statement?: string;
  youtube_url_1?: string;
  youtube_url_2?: string;

  // 작업 공간
  studio_description?: string;
  process_video_1?: string;
  process_video_2?: string;

  // Q&A
  qa_list?: QA[];

  // 전시회
  exhibitions?: Exhibition[];

  // 수상
  awards?: Award[];

  // 비디오
  artist_videos?: ArtistVideo[];

  // 작품
  artworks?: Artwork[];

  // 통계
  total_artworks?: number;
  total_views?: number;
  followers_count?: number;

  // 설정
  is_public_gallery?: boolean;
  show_work_in_progress?: boolean;
  default_artwork_privacy?: string;
  email_notifications?: boolean;
  marketing_emails?: boolean;
  timezone?: string;
  language?: string;
}

// 섹션 컴포넌트 Props
// utils/types.ts

export interface SectionProps {
  data: any;
  onChange: (field: string, value: any) => void;
  isMobile?: boolean;
  onSave?: () => void;
  saving?: boolean;
  hasChanges?: boolean;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 페이지네이션
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// 로그인/회원가입
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  slug?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// 업로드
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  content_type: string;
}
