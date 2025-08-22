// components/profile/sections/InterviewSection.tsx
import React, { useState, useEffect } from "react";
import { SectionProps } from "../../../utils/types";

interface QAItem {
  id?: number;
  question: string;
  answer: string;
  order_index?: number;
}

const InterviewSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isMobile,
  onSave,
  saving,
  hasChanges,
}) => {
  const [qaList, setQaList] = useState<QAItem[]>(data?.qa_list || []);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<QAItem | null>(null);

  // data prop이 변경될 때만 로컬 state 업데이트
  useEffect(() => {
    if (data?.qa_list) {
      setQaList(data.qa_list);
    }
  }, [data?.id]);

  // Q&A 추가
  const handleAddQA = () => {
    const newQA: QAItem = {
      id: Date.now(),
      question: "",
      answer: "",
      order_index: qaList.length,
    };
    const updatedList = [...qaList, newQA];
    setQaList(updatedList);
    setEditingId(newQA.id);
    setEditingItem(newQA);
    onChange("qa_list", updatedList);
  };

  // 편집 시작
  const handleStartEdit = (qa: QAItem) => {
    setEditingId(qa.id!);
    setEditingItem({ ...qa });
  };

  // 편집 완료
  const handleFinishEdit = () => {
    if (editingItem) {
      const updatedList = qaList.map((qa) =>
        qa.id === editingItem.id ? editingItem : qa
      );
      setQaList(updatedList);
      onChange("qa_list", updatedList);
    }
    setEditingId(null);
    setEditingItem(null);
  };

  // Q&A 삭제
  const handleDeleteQA = (id: number) => {
    if (confirm("이 Q&A를 삭제하시겠습니까?")) {
      const updatedList = qaList.filter((qa) => qa.id !== id);
      setQaList(updatedList);
      onChange("qa_list", updatedList);
      setEditingId(null);
      setEditingItem(null);
    }
  };

  // 순서 변경
  const handleMoveQA = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === qaList.length - 1)
    ) {
      return;
    }

    const newList = [...qaList];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newList[index], newList[targetIndex]] = [
      newList[targetIndex],
      newList[index],
    ];

    setQaList(newList);
    onChange("qa_list", newList);
  };

  return (
    <div className="space-y-6">
      {/* PC에서만 보이는 타이틀과 저장 버튼 */}
      {!isMobile && (
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">인터뷰 Q&A</h2>
            <p className="text-sm text-gray-500 mt-1">
              Q&A 형식으로 작가 인터뷰를 구성하세요
            </p>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">인터뷰 Q&A</h3>
          <p className="text-sm text-gray-500">
            자주 받는 질문이나 중요한 정보를 Q&A 형식으로 작성하세요
          </p>
        </div>
        <button
          onClick={handleAddQA}
          className="flex items-center space-x-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
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
      </div>

      {/* Q&A 목록 */}
      {qaList.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <span className="text-4xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            아직 Q&A가 없습니다
          </h3>
          <p className="text-gray-500 mb-4">첫 번째 Q&A를 추가해보세요</p>
          <button
            onClick={handleAddQA}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            첫 Q&A 추가하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {qaList.map((qa, index) => (
            <div
              key={qa.id}
              className="border border-gray-200 rounded-lg p-4 bg-white"
            >
              {editingId === qa.id ? (
                // 편집 모드
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      질문
                    </label>
                    <input
                      type="text"
                      value={editingItem?.question || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem!,
                          question: e.target.value,
                        })
                      }
                      placeholder="예: 작업의 영감은 어디서 얻나요?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      답변
                    </label>
                    <textarea
                      value={editingItem?.answer || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem!,
                          answer: e.target.value,
                        })
                      }
                      placeholder="답변을 입력하세요"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleDeleteQA(qa.id!)}
                      className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      삭제
                    </button>
                    <button
                      onClick={handleFinishEdit}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                // 보기 모드
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start space-x-3 mb-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                          Q
                        </span>
                        <p className="text-gray-900 font-medium pt-1">
                          {qa.question || "질문을 입력하세요"}
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold text-sm">
                          A
                        </span>
                        <p className="text-gray-700 pt-1 whitespace-pre-wrap">
                          {qa.answer || "답변을 입력하세요"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 ml-4">
                      {/* 순서 변경 버튼 */}
                      <button
                        onClick={() => handleMoveQA(index, "up")}
                        disabled={index === 0}
                        className={`p-1 rounded ${
                          index === 0
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
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
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMoveQA(index, "down")}
                        disabled={index === qaList.length - 1}
                        className={`p-1 rounded ${
                          index === qaList.length - 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
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
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* 편집 버튼 */}
                      <button
                        onClick={() => handleStartEdit(qa)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
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
                  </div>
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
            <p className="font-medium mb-1">💡 Q&A 작성 팁</p>
            <ul className="space-y-1 text-blue-700">
              <li>• 방문자들이 궁금해할 만한 질문을 선별하세요</li>
              <li>• 답변은 구체적이고 진솔하게 작성하세요</li>
              <li>• 3-5개 정도의 핵심 Q&A로 구성하는 것을 추천합니다</li>
              <li>• 순서 변경 버튼으로 중요한 질문을 상단에 배치하세요</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 모바일에서만 보이는 하단 저장 버튼 */}
      {isMobile && (
        <div className="pt-6 border-t">
          <button
            onClick={onSave}
            disabled={!hasChanges || saving}
            className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
              hasChanges && !saving
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(InterviewSection);
