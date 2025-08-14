// 프로필 데이터 타입
export interface Profile {
  basic?: {
    name?: string;
    email?: string;
    slug?: string;
    bio?: string;
    instagram_url?: string;
    youtube_url?: string;
  };
  about?: {
    bio?: string;
    youtube_url_1?: string;
    youtube_url_2?: string;
  };
  process?: {
    studio_description?: string;
    process_video_1?: string;
    process_video_2?: string;
  };
  interview?: {
    qa_list?: Array<QA>;
  };
  exhibitions?: Array<Exhibition>;
  competitions?: Array<Competition>;
}

// QA 타입
export interface QA {
  id: number;
  question: string;
  answer: string;
}

// 전시회 타입
export interface Exhibition {
  id: number;
  title_ko: string;
  venue_ko: string;
  year: string;
  exhibition_type: "solo" | "group" | "fair";
  description_ko?: string;
  is_featured: boolean;
}

// 공모전 타입
export interface Competition {
  id: number;
  title_ko: string;
  organizer: string;
  year: string;
  award_name: string;
  description_ko?: string;
  is_featured: boolean;
}

// 섹션 타입
export interface Section {
  id: string;
  label: string;
  icon: string;
}

// 공통 컴포넌트 Props
export interface SectionProps {
  data: any;
  onChange: (field: string, value: any) => void;
  isMobile: boolean;
}
