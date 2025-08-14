import React, { useState, useEffect } from "react";
import { SectionProps } from "../../../utils/types";
import { DEFAULT_QUESTIONS } from "../../../utils/constants";
import { QA } from "../../../utils/types";

const InterviewSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isMobile,
}) => {
  const [qaList, setQaList] = useState<QA[]>(() => {
    if (data && data.qa_list && data.qa_list.length > 0) {
      return data.qa_list;
    }
    return DEFAULT_QUESTIONS.map((q, index) => ({
      id: index + 1,
      question: q,
      answer: "",
    }));
  });

  useEffect(() => {
    if (data && data.qa_list && data.qa_list.length > 0) {
      setQaList(data.qa_list);
    }
  }, [data]);

  const updateQA = (id: number, field: string, value: string) => {
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

  const removeQA = (id: number) => {
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

export default InterviewSection;
