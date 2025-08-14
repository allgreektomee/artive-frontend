"use client";

import React, { useState, useEffect } from "react";

// 타입 정의
interface QAItem {
  id: number;
  question: string;
  answer: string;
}

interface InterviewData {
  qa_list: QAItem[];
}

interface Exhibition {
  id: number;
  title_ko: string;
  venue_ko: string;
  year: string;
  exhibition_type: "solo" | "group" | "fair";
  description_ko: string;
  is_featured: boolean;
}

interface ProfileData {
  basic: {
    name?: string;
    email?: string;
    slug?: string;
    bio?: string;
    instagram_url?: string;
    youtube_url?: string;
  };
  about: {
    bio?: string;
    youtube_url_1?: string;
    youtube_url_2?: string;
  };
  process: {
    studio_description?: string;
    process_video_1?: string;
    process_video_2?: string;
  };
  interview: InterviewData;
  exhibitions: Exhibition[];
  competitions: any[];
}

interface SectionProps {
  data: any;
  onChange: (field: string, value: any) => void;
  isMobile: boolean;
}

interface ExhibitionsSectionProps {
  data: Exhibition[];
  onChange: (field: string, value: Exhibition[]) => void;
  isMobile: boolean;
}

// 모바일 체크 훅
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

// About Artist 컴포넌트
const AboutArtistSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isMobile,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          아티스트 소개글
        </label>
        <textarea
          value={data?.bio || ""}
          onChange={(e) => onChange("bio", e.target.value)}
          placeholder="작가로서의 배경, 작업 철학, 예술적 여정에 대해 자세히 소개해주세요."
          rows={isMobile ? 6 : 8}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          유튜브 링크 1
        </label>
        <input
          type="url"
          value={data?.youtube_url_1 || ""}
          onChange={(e) => onChange("youtube_url_1", e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          작업 과정이나 작가 인터뷰 영상
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          유튜브 링크 2
        </label>
        <input
          type="url"
          value={data?.youtube_url_2 || ""}
          onChange={(e) => onChange("youtube_url_2", e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">추가 영상 (선택사항)</p>
      </div>
    </div>
  );
};

// Studio Process 컴포넌트
const StudioProcessSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isMobile,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          작업공간 소개
        </label>
        <textarea
          value={data?.studio_description || ""}
          onChange={(e) => onChange("studio_description", e.target.value)}
          placeholder="작업실 환경, 주로 사용하는 도구와 재료, 작업 과정에 대해 소개해주세요."
          rows={isMobile ? 6 : 8}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          작업 과정 영상 1
        </label>
        <input
          type="url"
          value={data?.process_video_1 || ""}
          onChange={(e) => onChange("process_video_1", e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">작업 과정을 보여주는 영상</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          작업 과정 영상 2
        </label>
        <input
          type="url"
          value={data?.process_video_2 || ""}
          onChange={(e) => onChange("process_video_2", e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">추가 작업 영상 (선택사항)</p>
      </div>
    </div>
  );
};

// 메인 프로필 관리 컴포넌트
const ProfileManagement: React.FC = () => {
  const isMobile = useIsMobile();
  const [currentView, setCurrentView] = useState("main");
  const [activeTab, setActiveTab] = useState("basic");
  const [profileData, setProfileData] = useState<ProfileData>({
    basic: {},
    about: {},
    process: {},
    interview: { qa_list: [] },
    exhibitions: [],
    competitions: [],
  });

  const sections = [
    { id: "basic", label: "기본 정보", icon: "👤" },
    { id: "about", label: "About Artist", icon: "🎨" },
    { id: "process", label: "Studio Process", icon: "🛠️" },
    { id: "interview", label: "Interview", icon: "🎤" },
    { id: "exhibitions", label: "전시회", icon: "🖼️" },
    { id: "competitions", label: "공모전", icon: "🏆" },
  ];

  const handleSectionDataChange = (
    section: keyof ProfileData,
    field: string,
    value: any
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [section]:
        field === "exhibitions" || field === "competitions"
          ? value
          : {
              ...prev[section],
              [field]: value,
            },
    }));
  };

  // Interview 컴포넌트 (ProfileManagement 내부에 정의)
  const InterviewSection: React.FC<SectionProps> = ({
    data,
    onChange,
    isMobile,
  }) => {
    const defaultQuestions = [
      "작가님의 예술적 영감은 무엇에서 오나요?",
      "작가님의 작업 스타일을 어떻게 설명하시겠어요?",
      "작품을 통해 전달하고자 하는 메시지가 있다면?",
      "작가님의 작품은 어디서 만날 수 있나요?",
    ];

    const [qaList, setQaList] = useState<QAItem[]>(() => {
      if (data && data.qa_list && data.qa_list.length > 0) {
        return data.qa_list;
      }
      return defaultQuestions.map((q, index) => ({
        id: index + 1,
        question: q,
        answer: "",
      }));
    });

    const updateQA = (id: number, field: keyof QAItem, value: string): void => {
      const updatedList = qaList.map((qa) =>
        qa.id === id ? { ...qa, [field]: value } : qa
      );
      setQaList(updatedList);
      if (onChange) {
        onChange("qa_list", updatedList);
      }
    };

    const addQA = (): void => {
      if (qaList.length >= 10) {
        alert("Q&A는 최대 10개까지 추가할 수 있습니다.");
        return;
      }
      const newQA: QAItem = {
        id: Math.max(0, ...qaList.map((qa) => qa.id)) + 1,
        question: "",
        answer: "",
      };
      const updatedList = [...qaList, newQA];
      setQaList(updatedList);
      if (onChange) {
        onChange("qa_list", updatedList);
      }
    };

    const removeQA = (id: number): void => {
      if (qaList.length <= 4) {
        alert("기본 질문 4개는 삭제할 수 없습니다.");
        return;
      }
      const updatedList = qaList.filter((qa) => qa.id !== id);
      setQaList(updatedList);
      if (onChange) {
        onChange("qa_list", updatedList);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">인터뷰 Q&A</h3>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">{qaList.length}/10</span>
            {qaList.length < 10 && (
              <button
                onClick={addQA}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>추가</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {qaList.map((qa, index) => (
            <div key={qa.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-medium text-blue-600">
                  Q{index + 1}
                </span>
                {qaList.length > 4 && (
                  <button
                    onClick={() => removeQA(qa.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    질문
                  </label>
                  <input
                    type="text"
                    value={qa.question || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateQA(qa.id, "question", e.target.value)
                    }
                    placeholder="질문을 입력하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    답변
                  </label>
                  <textarea
                    value={qa.answer || ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      updateQA(qa.id, "answer", e.target.value)
                    }
                    placeholder="답변을 입력하세요"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 전시회 관리 컴포넌트 (ProfileManagement 내부에 정의)
  const ExhibitionsSection: React.FC<ExhibitionsSectionProps> = ({
    data,
    onChange,
    isMobile,
  }) => {
    const [exhibitions, setExhibitions] = useState<Exhibition[]>(data || []);
    const [editingId, setEditingId] = useState<number | null>(null);

    // 데이터 변경 시 로컬 상태 동기화
    useEffect(() => {
      setExhibitions(data || []);
    }, [data]);

    // 새 전시회 추가
    const addExhibition = (): void => {
      const newExhibition: Exhibition = {
        id: Date.now(),
        title_ko: "",
        venue_ko: "",
        year: new Date().getFullYear().toString(),
        exhibition_type: "group",
        description_ko: "",
        is_featured: false,
      };
      const updatedExhibitions = [...exhibitions, newExhibition];
      setExhibitions(updatedExhibitions);
      setEditingId(newExhibition.id);
      if (onChange) {
        onChange("exhibitions", updatedExhibitions);
      }
    };

    // 전시회 수정
    const updateExhibition = (
      id: number,
      field: keyof Exhibition,
      value: string | boolean
    ): void => {
      const updatedExhibitions = exhibitions.map((exhibition) =>
        exhibition.id === id ? { ...exhibition, [field]: value } : exhibition
      );
      setExhibitions(updatedExhibitions);
      if (onChange) {
        onChange("exhibitions", updatedExhibitions);
      }
    };

    // 전시회 삭제
    const deleteExhibition = (id: number): void => {
      if (confirm("정말 삭제하시겠습니까?")) {
        const updatedExhibitions = exhibitions.filter(
          (exhibition) => exhibition.id !== id
        );
        setExhibitions(updatedExhibitions);
        if (onChange) {
          onChange("exhibitions", updatedExhibitions);
        }
      }
    };

    // 수정 완료
    const finishEditing = (): void => {
      setEditingId(null);
    };

    return (
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">전시회 이력</h3>
            <p className="text-sm text-gray-500">
              개인전, 그룹전, 아트페어 참가 이력을 관리하세요
            </p>
          </div>
          <button
            onClick={addExhibition}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>전시회 추가</span>
          </button>
        </div>

        {/* 전시회 목록 */}
        {exhibitions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 mb-4">
              <span className="text-4xl">🖼️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              아직 전시회가 없습니다
            </h3>
            <p className="text-gray-500 mb-4">첫 번째 전시회를 추가해보세요!</p>
            <button
              onClick={addExhibition}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              전시회 추가하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {exhibitions.map((exhibition) => (
              <div
                key={exhibition.id}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                {editingId === exhibition.id ? (
                  // 편집 모드
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          전시회명
                        </label>
                        <input
                          type="text"
                          value={exhibition.title_ko}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateExhibition(
                              exhibition.id,
                              "title_ko",
                              e.target.value
                            )
                          }
                          placeholder="전시회 이름을 입력하세요"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          전시 장소
                        </label>
                        <input
                          type="text"
                          value={exhibition.venue_ko}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateExhibition(
                              exhibition.id,
                              "venue_ko",
                              e.target.value
                            )
                          }
                          placeholder="갤러리명, 미술관명 등"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          전시 년도
                        </label>
                        <input
                          type="text"
                          value={exhibition.year}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateExhibition(
                              exhibition.id,
                              "year",
                              e.target.value
                            )
                          }
                          placeholder="2024"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          전시 유형
                        </label>
                        <select
                          value={exhibition.exhibition_type}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            updateExhibition(
                              exhibition.id,
                              "exhibition_type",
                              e.target.value as Exhibition["exhibition_type"]
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="solo">개인전</option>
                          <option value="group">그룹전</option>
                          <option value="fair">아트페어</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        전시 설명
                      </label>
                      <textarea
                        value={exhibition.description_ko}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          updateExhibition(
                            exhibition.id,
                            "description_ko",
                            e.target.value
                          )
                        }
                        placeholder="전시에 대한 간단한 설명을 입력하세요"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`featured-${exhibition.id}`}
                        checked={exhibition.is_featured}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateExhibition(
                            exhibition.id,
                            "is_featured",
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`featured-${exhibition.id}`}
                        className="text-sm text-gray-700"
                      >
                        주요 전시로 표시
                      </label>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => deleteExhibition(exhibition.id)}
                        className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        삭제
                      </button>
                      <button
                        onClick={finishEditing}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        완료
                      </button>
                    </div>
                  </div>
                ) : (
                  // 보기 모드
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {exhibition.title_ko || "제목 없음"}
                        </h4>
                        {exhibition.is_featured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            주요 전시
                          </span>
                        )}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            exhibition.exhibition_type === "solo"
                              ? "bg-purple-100 text-purple-800"
                              : exhibition.exhibition_type === "group"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {exhibition.exhibition_type === "solo"
                            ? "개인전"
                            : exhibition.exhibition_type === "group"
                            ? "그룹전"
                            : "아트페어"}
                        </span>
                      </div>

                      <div className="text-gray-600 space-y-1">
                        {exhibition.venue_ko && (
                          <p className="flex items-center space-x-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span>{exhibition.venue_ko}</span>
                          </p>
                        )}

                        <p className="flex items-center space-x-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{exhibition.year}년</span>
                        </p>

                        {exhibition.description_ko && (
                          <p className="text-gray-700 mt-2">
                            {exhibition.description_ko}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setEditingId(exhibition.id)}
                      className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 도움말 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg
              className="w-5 h-5 text-blue-600 mr-2 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">💡 전시회 관리 팁</p>
              <ul className="space-y-1 text-blue-700">
                <li>• 최신 전시회부터 시간순으로 정리하세요</li>
                <li>
                  • 주요 전시는 "주요 전시" 옵션을 체크하여 강조할 수 있습니다
                </li>
                <li>
                  • 전시 유형을 정확히 선택하면 포트폴리오가 더 전문적으로
                  보입니다
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 서브타이틀 헬퍼 함수
  const getSubtitle = (sectionId: string): string => {
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

  // 모바일 메인 리스트
  const MobileMainView = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-semibold">프로필 관리</h1>
            </div>
            <button className="text-blue-600 text-sm font-medium">
              미리보기
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setCurrentView(section.id)}
            className="w-full p-4 rounded-2xl text-left transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] bg-white text-gray-900 shadow-sm hover:shadow-md border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gray-50">
                  {section.icon}
                </div>
                <div>
                  <div className="font-semibold text-lg text-gray-900">
                    {section.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getSubtitle(section.id)}
                  </div>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // 모바일 섹션 상세 뷰
  const MobileSectionView = ({ section }: { section: any }) => (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentView("main")}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-xl">{section.icon}</span>
                <h1 className="text-lg font-semibold">{section.label}</h1>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              저장
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">{renderSectionContent(section.id, true)}</div>
    </div>
  );

  // 데스크톱 뷰
  const DesktopView = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-black transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-bold">프로필 관리</h1>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>갤러리 미리보기</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="w-64">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === section.id
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {sections.find((section) => section.id === activeTab)?.label}
                </h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  <span>저장</span>
                </button>
              </div>

              {renderSectionContent(activeTab, false)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 섹션 콘텐츠 렌더링
  const renderSectionContent = (sectionId: string, isMobileView: boolean) => {
    const commonProps = {
      data: profileData[sectionId as keyof ProfileData],
      onChange: (field: string, value: any) =>
        handleSectionDataChange(sectionId as keyof ProfileData, field, value),
      isMobile: isMobileView,
    };

    switch (sectionId) {
      case "basic":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">이름</label>
                <input
                  type="text"
                  value={profileData.basic.name || ""}
                  onChange={(e) =>
                    handleSectionDataChange("basic", "name", e.target.value)
                  }
                  placeholder="아티스트 이름"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">이메일</label>
                <input
                  type="email"
                  value={profileData.basic.email || ""}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                갤러리 주소
              </label>
              <div className="flex">
                <span className="bg-gray-100 border border-r-0 border-gray-300 px-3 py-3 rounded-l-lg text-gray-600 text-sm">
                  artivefor.me/
                </span>
                <input
                  type="text"
                  value={profileData.basic.slug || ""}
                  onChange={(e) =>
                    handleSectionDataChange("basic", "slug", e.target.value)
                  }
                  placeholder="gallery-name"
                  className="flex-1 border border-gray-300 px-4 py-3 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">자기소개</label>
              <textarea
                value={profileData.basic.bio || ""}
                onChange={(e) =>
                  handleSectionDataChange("basic", "bio", e.target.value)
                }
                placeholder="아티스트로서의 간단한 소개를 적어주세요"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-medium mb-4">SNS 링크</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    📸 Instagram
                  </label>
                  <input
                    type="url"
                    value={profileData.basic.instagram_url || ""}
                    onChange={(e) =>
                      handleSectionDataChange(
                        "basic",
                        "instagram_url",
                        e.target.value
                      )
                    }
                    placeholder="https://instagram.com/username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    📺 YouTube
                  </label>
                  <input
                    type="url"
                    value={profileData.basic.youtube_url || ""}
                    onChange={(e) =>
                      handleSectionDataChange(
                        "basic",
                        "youtube_url",
                        e.target.value
                      )
                    }
                    placeholder="https://youtube.com/@username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case "about":
        return <AboutArtistSection {...commonProps} />;
      case "process":
        return <StudioProcessSection {...commonProps} />;
      case "interview":
        return <InterviewSection {...commonProps} />;
      case "exhibitions":
        return (
          <ExhibitionsSection
            data={profileData.exhibitions}
            onChange={(field: string, value: Exhibition[]) =>
              handleSectionDataChange("exhibitions", field, value)
            }
            isMobile={isMobileView}
          />
        );
      case "competitions":
        return (
          <div className="text-center py-20 text-gray-500">
            <span className="text-4xl">🏆</span>
            <p className="text-lg mt-4">공모전 섹션</p>
            <p className="text-sm mt-2">공모전 관리 기능이 여기에 들어갑니다</p>
          </div>
        );
      default:
        return <div>섹션을 찾을 수 없습니다.</div>;
    }
  };

  // 메인 렌더링
  if (isMobile) {
    if (currentView === "main") {
      return <MobileMainView />;
    } else {
      const section = sections.find((s) => s.id === currentView);
      return <MobileSectionView section={section} />;
    }
  } else {
    return <DesktopView />;
  }
};

export default ProfileManagement;
