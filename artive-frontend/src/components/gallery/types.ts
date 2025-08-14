// components/gallery/types.ts

// 사용자 타입 정의
export interface User {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  thumbnail_url?: string;
  gallery_title?: string;
  gallery_description?: string;
  total_artworks: number;
  total_views: number;
  instagram_username?: string;
  youtube_channel_id?: string;
  is_public_gallery: boolean;
}

// 작품 상태 타입
export type ArtworkStatus = "work_in_progress" | "completed" | "archived";

// 작품 타입 정의
export interface Artwork {
  id: number;
  title: string;
  description?: string;
  thumbnail_url?: string;
  work_in_progress_url?: string;
  status: ArtworkStatus;
  medium?: string;
  size?: string;
  year?: string;
  view_count: number;
  like_count: number;
  history_count: number;
  created_at: string;
  updated_at?: string;
  user_id?: number;
}

// 히스토리 타입 정의
export interface ArtworkHistory {
  id: number;
  title?: string;
  content?: string;
  media_url?: string;
  thumbnail_url?: string;
  media_type?: string;
  work_date?: string;
  created_at: string;
  artwork_id: number;
}

// 갤러리 페이지 Props 타입들
export interface GalleryHeaderProps {
  showGalleryHeader: boolean;
  galleryUser: User | null;
  currentSlug?: string;
  artworks: Artwork[];
  isOwner: boolean;
  onProfileClick: () => void;
}

export interface GalleryInfoProps {
  galleryUser: User | null;
  currentSlug?: string;
  artworks: Artwork[];
  isOwner: boolean;
  onProfileClick: () => void;
}

export interface ArtworkCardProps {
  artwork: Artwork;
}

export interface ArtworkGridProps {
  artworks: Artwork[];
  isOwner: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  totalArtworks: number;
  onAddArtwork: () => void;
  onLoadMore: () => void;
}

export interface AddArtworkButtonProps {
  isOwner: boolean;
  onClick: () => void;
}

export interface AboutSectionProps {
  galleryUser: User | null;
}

// API 응답 타입들
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ArtworksResponse extends PaginatedResponse<Artwork> {
  artworks: Artwork[];
}

// 로딩 상태 타입
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// 페이지네이션 상태 타입
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  loadingMore: boolean;
}
