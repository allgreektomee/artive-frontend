"use client";

import React, { useState, useEffect } from "react";

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
const AboutArtistSection = ({ data, onChange, isMobile }) => {
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
          유튜브 영상 1
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
          유튜브 영상 2
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
const StudioProcessSection = ({ data, onChange, isMobile }) => {
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

// Interview 컴포넌트
const InterviewSection = ({ data, onChange, isMobile }) => {
  const defaultQuestions = [
    "작가님의 예술적 영감은 무엇에서 오나요?",
    "작가님의 작업 스타일을 어떻게 설명하시겠어요?",
    "작품을 통해 전달하고자 하는 메시지가 있다면?",
    "작가님의 작품은 어디서 만날 수 있나요?",
  ];

  const [qaList, setQaList] = useState(() => {
    if (data && data.qa_list && data.qa_list.length > 0) {
      return data.qa_list;
    }
    return defaultQuestions.map((q, index) => ({
      id: index + 1,
      question: q,
      answer: "",
    }));
  });

  const updateQA = (id, field, value) => {
    const updatedList = qaList.map((qa) =>
      qa.id === id ? { ...qa, [field]: value } : qa
    );
    setQaList(updatedList);
    if (onChange) {
      onChange("qa_list", updatedList);
    }
  };

  const addQA = () => {
    if (qaList.length >= 10) {
      alert("Q&A는 최대 10개까지 추가할 수 있습니다.");
      return;
    }
    const newQA = {
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

  const removeQA = (id) => {
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
                  onChange={(e) => updateQA(qa.id, "question", e.target.value)}
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
                  onChange={(e) => updateQA(qa.id, "answer", e.target.value)}
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

// 전시회 관리 컴포넌트
const ExhibitionsSection = ({ data, onChange, isMobile }) => {
  const [exhibitions, setExhibitions] = useState(data || []);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setExhibitions(data);
    }
  }, [data]);

  const addExhibition = () => {
    const newExhibition = {
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

  const updateExhibition = (id, field, value) => {
    const updatedExhibitions = exhibitions.map((exhibition) =>
      exhibition.id === id ? { ...exhibition, [field]: value } : exhibition
    );
    setExhibitions(updatedExhibitions);
    if (onChange) {
      onChange("exhibitions", updatedExhibitions);
    }
  };

  const deleteExhibition = (id) => {
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

  const finishEditing = () => {
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
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
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        전시회명
                      </label>
                      <input
                        type="text"
                        value={exhibition.title_ko}
                        onChange={(e) =>
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
                        onChange={(e) =>
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
                        onChange={(e) =>
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
                        onChange={(e) =>
                          updateExhibition(
                            exhibition.id,
                            "exhibition_type",
                            e.target.value
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
                      onChange={(e) =>
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
                      onChange={(e) =>
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
    </div>
  );
};

// 공모전 관리 컴포넌트
const CompetitionsSection = ({ data, onChange, isMobile }) => {
  const [competitions, setCompetitions] = useState(data || []);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setCompetitions(data);
    }
  }, [data]);

  const addCompetition = () => {
    const newCompetition = {
      id: Date.now(),
      title_ko: "",
      organizer: "",
      year: new Date().getFullYear().toString(),
      award_name: "",
      description_ko: "",
      is_featured: false,
    };
    const updatedCompetitions = [...competitions, newCompetition];
    setCompetitions(updatedCompetitions);
    setEditingId(newCompetition.id);
    if (onChange) {
      onChange("competitions", updatedCompetitions);
    }
  };

  const updateCompetition = (id, field, value) => {
    const updatedCompetitions = competitions.map((competition) =>
      competition.id === id ? { ...competition, [field]: value } : competition
    );
    setCompetitions(updatedCompetitions);
    if (onChange) {
      onChange("competitions", updatedCompetitions);
    }
  };

  const deleteCompetition = (id) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const updatedCompetitions = competitions.filter(
        (competition) => competition.id !== id
      );
      setCompetitions(updatedCompetitions);
      if (onChange) {
        onChange("competitions", updatedCompetitions);
      }
    }
  };

  const finishEditing = () => {
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">공모전 이력</h3>
          <p className="text-sm text-gray-500">
            공모전 참가 및 수상 이력을 관리하세요
          </p>
        </div>
        <button
          onClick={addCompetition}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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
          <span>공모전 추가</span>
        </button>
      </div>

      {competitions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <span className="text-4xl">🏆</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            아직 공모전 이력이 없습니다
          </h3>
          <p className="text-gray-500 mb-4">첫 번째 공모전을 추가해보세요!</p>
          <button
            onClick={addCompetition}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            공모전 추가하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {competitions.map((competition) => (
            <div
              key={competition.id}
              className="border border-gray-200 rounded-lg p-4 bg-white"
            >
              {editingId === competition.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        공모전명
                      </label>
                      <input
                        type="text"
                        value={competition.title_ko}
                        onChange={(e) =>
                          updateCompetition(
                            competition.id,
                            "title_ko",
                            e.target.value
                          )
                        }
                        placeholder="공모전 이름을 입력하세요"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        주최기관
                      </label>
                      <input
                        type="text"
                        value={competition.organizer}
                        onChange={(e) =>
                          updateCompetition(
                            competition.id,
                            "organizer",
                            e.target.value
                          )
                        }
                        placeholder="주최기관명"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        참가 년도
                      </label>
                      <input
                        type="text"
                        value={competition.year}
                        onChange={(e) =>
                          updateCompetition(
                            competition.id,
                            "year",
                            e.target.value
                          )
                        }
                        placeholder="2024"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        수상명
                      </label>
                      <input
                        type="text"
                        value={competition.award_name}
                        onChange={(e) =>
                          updateCompetition(
                            competition.id,
                            "award_name",
                            e.target.value
                          )
                        }
                        placeholder="예: 대상, 금상, 우수상, 입선, 참가상, 결선진출 등"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        수상하지 않았다면 "참가"라고 입력하세요
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      공모전 설명
                    </label>
                    <textarea
                      value={competition.description_ko}
                      onChange={(e) =>
                        updateCompetition(
                          competition.id,
                          "description_ko",
                          e.target.value
                        )
                      }
                      placeholder="작품명, 주제, 특이사항 등을 입력하세요"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`featured-comp-${competition.id}`}
                      checked={competition.is_featured}
                      onChange={(e) =>
                        updateCompetition(
                          competition.id,
                          "is_featured",
                          e.target.checked
                        )
                      }
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label
                      htmlFor={`featured-comp-${competition.id}`}
                      className="text-sm text-gray-700"
                    >
                      주요 공모전으로 표시
                    </label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => deleteCompetition(competition.id)}
                      className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      삭제
                    </button>
                    <button
                      onClick={finishEditing}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      완료
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {competition.title_ko || "제목 없음"}
                      </h4>
                      {competition.is_featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          주요 공모전
                        </span>
                      )}
                      {competition.award_name && (
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            competition.award_name.includes("대상") ||
                            competition.award_name.includes("금상") ||
                            competition.award_name.includes("1등")
                              ? "bg-yellow-100 text-yellow-800"
                              : competition.award_name.includes("우수") ||
                                competition.award_name.includes("은상") ||
                                competition.award_name.includes("2등")
                              ? "bg-orange-100 text-orange-800"
                              : competition.award_name.includes("특별") ||
                                competition.award_name.includes("동상") ||
                                competition.award_name.includes("3등")
                              ? "bg-purple-100 text-purple-800"
                              : competition.award_name.includes("입선") ||
                                competition.award_name.includes("결선") ||
                                competition.award_name.includes("진출")
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {competition.award_name}
                        </span>
                      )}
                    </div>

                    <div className="text-gray-600 space-y-1">
                      {competition.organizer && (
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
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <span>{competition.organizer}</span>
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
                        <span>{competition.year}년</span>
                      </p>

                      {competition.description_ko && (
                        <p className="text-gray-700 mt-2">
                          {competition.description_ko}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingId(competition.id)}
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
    </div>
  );
};

// 메인 프로필 관리 컴포넌트
const ProfileManagement = () => {
  const isMobile = useIsMobile();
  const [currentView, setCurrentView] = useState("main");
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    basic: {},
    about: {},
    process: {},
    interview: {},
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

  // 프로필 데이터 로딩
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setProfileData({
          basic: {
            name: data.name || "",
            email: data.email || "",
            slug: data.slug || "",
            bio: data.bio || "",
            instagram_id: data.instagram_id || "",
            youtube_id: data.youtube_id || "",
          },
          about: {
            bio: data.artist_statement || "",
            youtube_url_1: data.youtube_url_1 || "",
            youtube_url_2: data.youtube_url_2 || "",
          },
          process: {
            studio_description: data.studio_description || "",
            process_video_1: data.process_video_1 || "",
            process_video_2: data.process_video_2 || "",
          },
          interview: {
            qa_list: data.qa_list || [],
          },
          exhibitions: data.exhibitions || [],
          competitions: data.competitions || [],
        });
      }
    } catch (error) {
      console.error("프로필 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionDataChange = (section, field, value) => {
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

  const handleSave = async () => {
    setSaving(true);
    try {
      // Instagram, YouTube ID를 전체 URL로 변환
      const saveData = {
        ...profileData,
        basic: {
          ...profileData.basic,
          instagram_url: profileData.basic.instagram_id
            ? `https://instagram.com/${profileData.basic.instagram_id}`
            : "",
          youtube_url: profileData.basic.youtube_id
            ? `https://youtube.com/@${profileData.basic.youtube_id}`
            : "",
        },
      };

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saveData),
      });

      if (response.ok) {
        alert("프로필이 저장되었습니다!");
      } else {
        throw new Error("저장 실패");
      }
    } catch (error) {
      console.error("프로필 저장 실패:", error);
      alert("프로필 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const getSubtitle = (sectionId) => {
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

  const MobileMainView = () => {
    return (
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
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {saving ? "저장중..." : "저장"}
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
  };

  const MobileSectionView = ({ section }) => {
    return (
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
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {saving ? "저장중..." : "저장"}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">{renderSectionContent(section.id, true)}</div>
      </div>
    );
  };

  const DesktopView = () => {
    return (
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
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>저장중...</span>
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
                    {
                      sections.find((section) => section.id === activeTab)
                        ?.label
                    }
                  </h2>
                </div>

                {renderSectionContent(activeTab, false)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSectionContent = (sectionId, isMobileView) => {
    const commonProps = {
      data: profileData[sectionId],
      onChange: (field, value) =>
        handleSectionDataChange(sectionId, field, value),
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
                  <div className="flex">
                    <span className="bg-gray-100 border border-r-0 border-gray-300 px-3 py-3 rounded-l-lg text-gray-600 text-sm">
                      instagram.com/
                    </span>
                    <input
                      type="text"
                      value={profileData.basic.instagram_id || ""}
                      onChange={(e) =>
                        handleSectionDataChange(
                          "basic",
                          "instagram_id",
                          e.target.value
                        )
                      }
                      placeholder="username"
                      className="flex-1 border border-gray-300 px-4 py-3 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    📺 YouTube
                  </label>
                  <div className="flex">
                    <span className="bg-gray-100 border border-r-0 border-gray-300 px-3 py-3 rounded-l-lg text-gray-600 text-sm">
                      youtube.com/@
                    </span>
                    <input
                      type="text"
                      value={profileData.basic.youtube_id || ""}
                      onChange={(e) =>
                        handleSectionDataChange(
                          "basic",
                          "youtube_id",
                          e.target.value
                        )
                      }
                      placeholder="channelname"
                      className="flex-1 border border-gray-300 px-4 py-3 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
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
        return <ExhibitionsSection {...commonProps} />;
      case "competitions":
        return <CompetitionsSection {...commonProps} />;
      default:
        return <div>섹션을 찾을 수 없습니다.</div>;
    }
  };

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">프로필 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

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
