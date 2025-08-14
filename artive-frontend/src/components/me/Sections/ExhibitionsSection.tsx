import React, { useState, useEffect } from "react";
import { SectionProps, Exhibition } from "../../../utils/types";

const ExhibitionsSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isMobile,
}) => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>(data || []);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setExhibitions(data);
    }
  }, [data]);

  const addExhibition = () => {
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

  const updateExhibition = (id: number, field: string, value: any) => {
    const updatedExhibitions = exhibitions.map((exhibition) =>
      exhibition.id === id ? { ...exhibition, [field]: value } : exhibition
    );
    setExhibitions(updatedExhibitions);
    if (onChange) {
      onChange("exhibitions", updatedExhibitions);
    }
  };

  const deleteExhibition = (id: number) => {
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
                      value={exhibition.description_ko || ""}
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

export default ExhibitionsSection;
