// components/artworks/new/ArtworkSchedule.tsx
import React from "react";

interface ArtworkScheduleProps {
  form: {
    started_at: string;
    estimated_completion: string;
  };
  onChange: (name: string, value: string) => void;
  loading?: boolean;
}

const ArtworkSchedule: React.FC<ArtworkScheduleProps> = ({
  form,
  onChange,
  loading = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  // 오늘 날짜를 YYYY-MM-DD 형식으로 반환
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // 시작일이 완성일보다 늦은지 검증
  const isDateValid = () => {
    if (!form.started_at || !form.estimated_completion) return true;
    return new Date(form.started_at) <= new Date(form.estimated_completion);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">일정 정보 (선택사항)</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 작업 시작일 */}
        <div>
          <label
            htmlFor="started_at"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            작업 시작일
          </label>
          <input
            type="date"
            id="started_at"
            name="started_at"
            value={form.started_at}
            onChange={handleChange}
            disabled={loading}
            max={getTodayDate()} // 미래 날짜 선택 방지
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            작품 작업을 시작한 날짜를 선택하세요
          </p>
        </div>

        {/* 예상 완성일 */}
        <div>
          <label
            htmlFor="estimated_completion"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            예상 완성일
          </label>
          <input
            type="date"
            id="estimated_completion"
            name="estimated_completion"
            value={form.estimated_completion}
            onChange={handleChange}
            disabled={loading}
            min={form.started_at || getTodayDate()} // 시작일 이후 날짜만 선택 가능
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            작품 완성 예정일을 선택하세요
          </p>
        </div>
      </div>

      {/* 날짜 검증 오류 메시지 */}
      {!isDateValid() && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            ⚠️ 시작일이 완성 예정일보다 늦을 수 없습니다.
          </p>
        </div>
      )}

      {/* 도움말 */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 <strong>팁:</strong> 일정 정보는 나중에 수정할 수 있습니다. 작업
          진행 상황은 히스토리 기능으로 더 자세히 기록할 수 있어요!
        </p>
      </div>
    </div>
  );
};

export default ArtworkSchedule;
