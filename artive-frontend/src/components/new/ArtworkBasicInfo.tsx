// components/artworks/new/ArtworkBasicInfo.tsx
import React from "react";

interface ArtworkBasicInfoProps {
  form: {
    title: string;
    description: string;
    medium: string;
    size: string;
    year: string;
    privacy: "public" | "private" | "unlisted";
  };
  onChange: (name: string, value: string) => void;
  loading?: boolean;
}

const ArtworkBasicInfo: React.FC<ArtworkBasicInfoProps> = ({
  form,
  onChange,
  loading = false,
}) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">기본 정보</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 작품 제목 */}
        <div className="md:col-span-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            작품 제목 *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            placeholder="작품의 제목을 입력하세요"
          />
        </div>

        {/* 매체 */}
        <div>
          <label
            htmlFor="medium"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            매체
          </label>
          <input
            type="text"
            id="medium"
            name="medium"
            value={form.medium}
            onChange={handleChange}
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            placeholder="예: 유화, 수채화, 디지털"
          />
        </div>

        {/* 크기 */}
        <div>
          <label
            htmlFor="size"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            크기
          </label>
          <input
            type="text"
            id="size"
            name="size"
            value={form.size}
            onChange={handleChange}
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            placeholder="예: 100x80cm, 24x36in"
          />
        </div>

        {/* 제작연도 */}
        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            제작연도
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={form.year}
            onChange={handleChange}
            disabled={loading}
            min="1900"
            max={new Date().getFullYear() + 10}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>

        {/* 공개 설정 */}
        <div>
          <label
            htmlFor="privacy"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            공개 설정
          </label>
          <select
            id="privacy"
            name="privacy"
            value={form.privacy}
            onChange={handleChange}
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="public">공개</option>
            <option value="unlisted">링크를 아는 사람만</option>
            <option value="private">비공개</option>
          </select>
        </div>

        {/* 작품 설명 */}
        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            작품 설명
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={loading}
            rows={4}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100 resize-none"
            placeholder="작품에 대한 설명을 입력하세요..."
            maxLength={1000}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {form.description.length}/1000자
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkBasicInfo;
