"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface User {
  artist_interview?: string;
  qa_list?: InterviewQA[];
  about_video?: string;
  [key: string]: any;
}

interface ArtistInterviewProps {
  galleryUser: User | null;
  isOwner: boolean;
}

interface InterviewQA {
  question: string;
  answer: string;
}

export default function ArtistInterview({
  galleryUser,
  isOwner,
}: ArtistInterviewProps) {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [qaList, setQaList] = useState<InterviewQA[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQA, setEditingQA] = useState<InterviewQA | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (!galleryUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      if (galleryUser.qa_list && Array.isArray(galleryUser.qa_list)) {
        setQaList(galleryUser.qa_list);
      } else if (galleryUser.artist_interview) {
        const parsed = parseInterview(galleryUser.artist_interview);
        setQaList(parsed);
      }
    } catch (error) {
      console.error("Q&A 데이터 처리 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [galleryUser]);

  const hasContent = qaList.length > 0 || !!galleryUser?.artist_interview;

  const parseInterview = (interview: string): InterviewQA[] => {
    if (!interview) return [];

    try {
      const parsed = JSON.parse(interview);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [
        {
          question: "",
          answer: interview,
        },
      ];
    } catch {
      const qaPattern = /Q:\s*(.+?)(?:\n|$)A:\s*(.+?)(?=Q:|$)/gs;
      const matches = [...interview.matchAll(qaPattern)];

      if (matches.length > 0) {
        return matches.map((match) => ({
          question: match[1].trim(),
          answer: match[2].trim(),
        }));
      }

      return [
        {
          question: "",
          answer: interview,
        },
      ];
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/profile/qa", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qa_list: qaList }),
      });

      if (response.ok) {
        alert("Q&A가 저장되었습니다.");
        setIsEditing(false);
        setEditingQA(null);
        setEditingIndex(null);
        window.location.reload();
      }
    } catch (error) {
      console.error("Q&A 저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleAddQA = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      const newQA: InterviewQA = {
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
      };
      setQaList([...qaList, newQA]);
      setNewQuestion("");
      setNewAnswer("");
    }
  };

  const handleEditQA = (index: number) => {
    setEditingQA({ ...qaList[index] });
    setEditingIndex(index);
  };

  const handleUpdateQA = () => {
    if (editingQA && editingIndex !== null) {
      const updatedList = [...qaList];
      updatedList[editingIndex] = {
        question: editingQA.question,
        answer: editingQA.answer,
      };
      setQaList(updatedList);
      setEditingQA(null);
      setEditingIndex(null);
    }
  };

  const handleDeleteQA = (index: number) => {
    if (confirm("이 Q&A를 삭제하시겠습니까?")) {
      const updatedList = qaList.filter((_, i) => i !== index);
      setQaList(updatedList);
    }
  };

  const interviews = qaList.length > 0 ? qaList : [];

  if (!hasContent && !isOwner) return null;

  if (loading) {
    return (
      <div className="py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {hasContent ? (
          <>
            {/* 헤더 */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🎤</div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Interview
                </h2>
              </div>
            </div>

            {/* Q&A 목록 */}
            <div className="space-y-6 sm:space-y-8">
              {interviews.map((qa, index) => (
                <div key={index}>
                  {editingIndex === index && isEditing ? (
                    // 편집 모드
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                      <div className="space-y-4">
                        <div>
                          <input
                            type="text"
                            value={editingQA?.question || ""}
                            onChange={(e) =>
                              setEditingQA((prev) =>
                                prev
                                  ? { ...prev, question: e.target.value }
                                  : null
                              )
                            }
                            placeholder="질문을 입력하세요"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-medium"
                          />
                        </div>
                        <div>
                          <textarea
                            value={editingQA?.answer || ""}
                            onChange={(e) =>
                              setEditingQA((prev) =>
                                prev
                                  ? { ...prev, answer: e.target.value }
                                  : null
                              )
                            }
                            placeholder="답변을 입력하세요"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdateQA}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            완료
                          </button>
                          <button
                            onClick={() => {
                              setEditingQA(null);
                              setEditingIndex(null);
                            }}
                            className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // 표시 모드
                    <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {qa.question ? (
                            <>
                              <div
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() =>
                                  setExpandedIndex(
                                    expandedIndex === index ? null : index
                                  )
                                }
                              >
                                <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                                  {qa.question}
                                </h3>
                                <svg
                                  className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-300 ml-4 flex-shrink-0 ${
                                    expandedIndex === index ? "rotate-180" : ""
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </div>

                              <div
                                className={`overflow-hidden transition-all duration-500 ${
                                  expandedIndex === index
                                    ? "max-h-[500px] opacity-100 mt-4"
                                    : "max-h-0 opacity-0"
                                }`}
                              >
                                <div className="border-t pt-4">
                                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {qa.answer}
                                  </p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-wrap">
                              {qa.answer}
                            </p>
                          )}
                        </div>
                        {isEditing && (
                          <div className="flex gap-1 ml-4">
                            <button
                              onClick={() => handleEditQA(index)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteQA(index)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 비디오 섹션 - YouTube 섬네일 */}
            {galleryUser?.about_video && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      const videoUrl = galleryUser?.about_video || "";
                      const youtubeId = extractYoutubeId(videoUrl);

                      if (youtubeId) {
                        window.open(
                          `https://youtube.com/watch?v=${youtubeId}`,
                          "_blank"
                        );
                      } else {
                        window.open(videoUrl, "_blank");
                      }
                    }}
                    className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {/* YouTube 썸네일 */}
                    <div className="relative w-80 h-48 sm:w-96 sm:h-56">
                      <img
                        src={`https://img.youtube.com/vi/${extractYoutubeId(
                          galleryUser.about_video || ""
                        )}/maxresdefault.jpg`}
                        alt="Artist Interview Video"
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          // 고화질 썸네일이 없으면 기본 썸네일로 대체
                          e.currentTarget.src = `https://img.youtube.com/vi/${extractYoutubeId(
                            galleryUser.about_video || ""
                          )}/hqdefault.jpg`;
                        }}
                      />

                      {/* 어두운 오버레이 */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300 rounded-xl" />

                      {/* 재생 버튼 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                          <svg
                            className="w-6 h-6 text-red-600 ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>

                      {/* 하단 정보 카드 */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                          <p className="text-gray-900 font-semibold text-sm sm:text-base">
                            Artist Interview
                          </p>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            YouTube에서 시청하기
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* 새 Q&A 추가 */}
            {isEditing && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  새 Q&A 추가
                </h3>
                <div className="space-y-4 bg-gray-50 rounded-lg p-4 sm:p-6">
                  <div>
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="질문을 입력하세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <textarea
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      placeholder="답변을 입력하세요"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleAddQA}
                    disabled={!newQuestion.trim() || !newAnswer.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Q&A 추가
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          isOwner && (
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => router.push("/profile/manage#interview")}
                className="w-full group relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-400 hover:border-gray-500 transition-all duration-300"
              >
                <div className="py-16 px-6 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-gray-100 group-hover:to-gray-150 transition-all duration-300">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    인터뷰 내용을 등록해주세요
                  </p>
                  <p className="text-sm mt-2 text-gray-500">
                    작품 세계에 대한 Q&A를 공유해보세요
                  </p>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/0 via-gray-600/5 to-gray-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
