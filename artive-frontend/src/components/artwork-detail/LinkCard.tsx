"use client";

interface LinkCardProps {
  title: string;
  url: string;
  description?: string;
  favicon?: string;
}

export default function LinkCard({ title, url, description }: LinkCardProps) {
  const getDomain = (urlString: string): string => {
    try {
      return new URL(urlString).hostname.replace("www.", "");
    } catch {
      return urlString;
    }
  };

  const handleClick = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={handleClick}
      className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center gap-3 h-full">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center h-auto lg:h-21 ">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {title || "관련 링크"}
          </h4>
          <p className="text-xs text-blue-600 mt-0.5">{getDomain(url)}</p>
        </div>
        <svg
          className="w-4 h-4 text-gray-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </div>
    </div>
  );
}
