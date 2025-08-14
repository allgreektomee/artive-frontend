import { Section } from "./types";

// 섹션 정의
export const SECTIONS: Section[] = [
  { id: "basic", label: "기본 정보", icon: "👤" },
  { id: "about", label: "About Artist", icon: "🎨" },
  { id: "process", label: "Studio Process", icon: "🛠️" },
  { id: "interview", label: "Interview", icon: "🎤" },
  { id: "exhibitions", label: "전시회", icon: "🖼️" },
  { id: "competitions", label: "공모전", icon: "🏆" },
];

// 섹션 설명 가져오기
export const getSubtitle = (sectionId: string): string => {
  switch (sectionId) {
    case "basic":
      return "이름, 갤러리 주소, SNS 링크";
    case "about":
      return "작가 소개, 유튜브 영상";
    case "process":
      return "작업공간 소개, 과정 영상";
    case "interview":
      return "Q&A 질문과 답변";
    case "exhibitions":
      return "개인전, 그룹전 이력 관리";
    case "competitions":
      return "공모전 참가 및 수상 이력";
    default:
      return "";
  }
};

// 기본 QA 질문
export const DEFAULT_QUESTIONS = [
  "작가님의 예술적 영감은 무엇에서 오나요?",
  "작가님의 작업 스타일을 어떻게 설명하시겠어요?",
  "작품을 통해 전달하고자 하는 메시지가 있다면?",
  "작가님의 작품은 어디서 만날 수 있나요?",
];
