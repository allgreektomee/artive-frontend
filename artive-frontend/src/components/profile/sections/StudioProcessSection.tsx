// components/profile/sections/StudioProcessSection.tsx
import React from "react";
import { SectionProps } from "../../../utils/types";
import { useRouter } from "next/navigation";

const StudioProcessSection: React.FC<SectionProps> = ({ data, isMobile }) => {
  const router = useRouter();
  const currentSlug = data?.slug || "";

  const handleNavigateToBlog = () => {
    router.push(`/${currentSlug}/blog/write`);
  };

  return (
    <div className="space-y-6">
      {/* PC에서만 보이는 타이틀 */}
      {!isMobile && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">작업 공간</h2>
          <p className="text-sm text-gray-500 mt-1">
            작업 공간과 작업 과정을 공유하세요
          </p>
        </div>
      )}

      {/* 안내 메시지 박스 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <div className="flex items-start space-x-3">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              스튜디오 포스트 작성 안내
            </h3>
            <p className="text-sm text-blue-700 leading-relaxed">
              작업 공간 소개는 블로그에서{" "}
              <span className="font-semibold">'스튜디오'</span> 카테고리로
              포스트를 작성하시면 자동으로 노출됩니다.
            </p>
            <div className="mt-3 bg-white bg-opacity-50 rounded px-3 py-2">
              <p className="text-xs text-blue-600 font-medium">
                📝 블로그 → 글쓰기 → 카테고리 '스튜디오' 선택
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 작성 가이드 */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h4 className="text-sm font-medium text-gray-700">
          스튜디오 포스트에 포함할 수 있는 내용:
        </h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            <span>작업실 환경과 분위기 소개</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            <span>사용하는 도구와 재료들</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            <span>작업 과정과 제작 방법</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            <span>작업 중 에피소드나 영감의 원천</span>
          </li>
        </ul>
      </div>

      {/* 블로그로 이동 버튼 */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleNavigateToBlog}
          className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          스튜디오 포스트 작성하기
        </button>
      </div>

      {/* 추가 안내 */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          스튜디오 카테고리는 단 하나의 포스트만 작성 가능합니다
        </p>
      </div>
    </div>
  );
};

export default React.memo(StudioProcessSection);
