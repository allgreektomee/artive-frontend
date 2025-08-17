import React, { useState, useEffect } from "react";
import { SectionProps, Award } from "../../../utils/types";

const CompetitionsSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isMobile,
}) => {
  const [awards, setAwards] = useState<Award[]>(data || []);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setAwards(data);
    }
  }, [data]);

  const addAward = () => {
    const newAward: Award = {
      id: Date.now(),
      title_ko: "",
      organization_ko: "",
      year: new Date().getFullYear().toString(),
      award_type: "award",
      description_ko: "",
      is_featured: false,
    };
    const updatedAwards = [...awards, newAward];
    setAwards(updatedAwards);
    setEditingId(newAward.id);
    if (onChange) {
      onChange("awards", updatedAwards);
    }
  };

  const updateAward = (id: number, field: string, value: any) => {
    const updatedAwards = awards.map((award) =>
      award.id === id ? { ...award, [field]: value } : award
    );
    setAwards(updatedAwards);
    if (onChange) {
      onChange("awards", updatedAwards);
    }
  };

  const deleteAward = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const updatedAwards = awards.filter((award) => award.id !== id);
      setAwards(updatedAwards);
      if (onChange) {
        onChange("awards", updatedAwards);
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
          <h3 className="text-lg font-semibold">수상 및 선정 이력</h3>
          <p className="text-sm text-gray-500">
            수상, 공모전, 레지던시, 지원사업 선정 등을 관리하세요
          </p>
        </div>
        <button
          onClick={addAward}
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
          <span>수상 추가</span>
        </button>
      </div>

      {awards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <span className="text-4xl">🏆</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            아직 수상 이력이 없습니다
          </h3>
          <p className="text-gray-500 mb-4">
            첫 번째 수상 이력을 추가해보세요!
          </p>
          <button
            onClick={addAward}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            수상 이력 추가하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {awards.map((award) => (
            <div
              key={award.id}
              className="border border-gray-200 rounded-lg p-4 bg-white"
            >
              {editingId === award.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        수상명/선정명
                      </label>
                      <input
                        type="text"
                        value={award.title_ko}
                        onChange={(e) =>
                          updateAward(award.id, "title_ko", e.target.value)
                        }
                        placeholder="예: 서울문화재단 예술지원사업"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        주관 기관
                      </label>
                      <input
                        type="text"
                        value={award.organization_ko}
                        onChange={(e) =>
                          updateAward(
                            award.id,
                            "organization_ko",
                            e.target.value
                          )
                        }
                        placeholder="예: 서울문화재단"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        수상 년도
                      </label>
                      <input
                        type="text"
                        value={award.year}
                        onChange={(e) =>
                          updateAward(award.id, "year", e.target.value)
                        }
                        placeholder="2024"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        유형
                      </label>
                      <select
                        value={award.award_type}
                        onChange={(e) =>
                          updateAward(award.id, "award_type", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="award">수상</option>
                        <option value="competition">공모전</option>
                        <option value="residency">레지던시</option>
                        <option value="grant">지원사업</option>
                        <option value="selection">선정</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      설명
                    </label>
                    <textarea
                      value={award.description_ko || ""}
                      onChange={(e) =>
                        updateAward(award.id, "description_ko", e.target.value)
                      }
                      placeholder="수상 내용이나 선정 이유 등을 간단히 설명하세요"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`featured-${award.id}`}
                      checked={award.is_featured}
                      onChange={(e) =>
                        updateAward(award.id, "is_featured", e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`featured-${award.id}`}
                      className="text-sm text-gray-700"
                    >
                      주요 수상으로 표시
                    </label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => deleteAward(award.id)}
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
                        {award.title_ko || "제목 없음"}
                      </h4>
                      {award.is_featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          주요 수상
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          award.award_type === "award"
                            ? "bg-amber-100 text-amber-800"
                            : award.award_type === "competition"
                            ? "bg-blue-100 text-blue-800"
                            : award.award_type === "residency"
                            ? "bg-purple-100 text-purple-800"
                            : award.award_type === "grant"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {award.award_type === "award"
                          ? "수상"
                          : award.award_type === "competition"
                          ? "공모전"
                          : award.award_type === "residency"
                          ? "레지던시"
                          : award.award_type === "grant"
                          ? "지원사업"
                          : "선정"}
                      </span>
                    </div>

                    <div className="text-gray-600 space-y-1">
                      {award.organization_ko && (
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
                          <span>{award.organization_ko}</span>
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
                        <span>{award.year}년</span>
                      </p>

                      {award.description_ko && (
                        <p className="text-gray-700 mt-2">
                          {award.description_ko}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingId(award.id)}
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

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex">
          <svg
            className="w-5 h-5 text-amber-600 mr-2 mt-0.5"
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
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">💡 수상 관리 팁</p>
            <ul className="space-y-1 text-amber-700">
              <li>• 최신 수상부터 시간순으로 정리하세요</li>
              <li>• 중요한 수상은 "주요 수상" 옵션을 체크하여 강조하세요</li>
              <li>• 레지던시나 지원사업도 이력에 포함시킬 수 있습니다</li>
              <li>• 수상 내용을 구체적으로 작성하면 신뢰도가 높아집니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionsSection;
