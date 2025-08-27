"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  exhibitions?: any[];
  awards?: any[];
  slug?: string;
  [key: string]: any;
}

interface ExhibitionsRecognitionProps {
  galleryUser: User | null;
  isOwner: boolean;
}

interface Exhibition {
  id: number;
  title_ko: string;
  venue_ko: string;
  start_date: string;
  end_date: string;
  exhibition_type: "solo" | "group" | "fair";
  blog_post_url?: string;
  is_featured: boolean;
}

interface Award {
  id: number;
  title_ko: string;
  organization_ko: string;
  year: string;
  award_type: string;
  blog_post_url?: string;
  is_featured: boolean;
}

export default function ExhibitionsRecognition({
  galleryUser,
  isOwner,
}: ExhibitionsRecognitionProps) {
  const router = useRouter();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      if (!galleryUser?.slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers: HeadersInit = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        // 전시 데이터 가져오기
        try {
          const exhibitionsResponse = await fetch(
            `${backendUrl}/api/profile/${galleryUser.slug}/exhibitions`,
            { headers }
          );
          if (exhibitionsResponse.ok) {
            const data = await exhibitionsResponse.json();
            setExhibitions(data);
          }
        } catch (error) {
          console.log("전시 데이터 가져오기 실패:", error);
        }

        // 수상 데이터 가져오기
        try {
          const awardsResponse = await fetch(
            `${backendUrl}/api/profile/${galleryUser.slug}/awards`,
            { headers }
          );
          if (awardsResponse.ok) {
            const data = await awardsResponse.json();
            setAwards(data);
          }
        } catch (error) {
          console.log("수상 데이터 가져오기 실패:", error);
        }
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [galleryUser?.slug, backendUrl]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getExhibitionTypeLabel = (type: string) => {
    const labels = {
      solo: "개인전",
      group: "그룹전",
      fair: "아트페어",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getAwardTypeBadgeColor = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("대상") || lowerType.includes("최우수")) {
      return "bg-amber-100 text-amber-800";
    } else if (lowerType.includes("우수") || lowerType.includes("금상")) {
      return "bg-blue-100 text-blue-800";
    } else if (lowerType.includes("입상") || lowerType.includes("은상")) {
      return "bg-purple-100 text-purple-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const hasContent = exhibitions.length > 0 || awards.length > 0;

  if (!hasContent && !isOwner) return null;

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {hasContent ? (
          <div className="space-y-12">
            {/* Exhibition 섹션 */}

            {exhibitions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>🖼️</span>
                  <span>Exhibitions</span>
                </h2>
                <div className="space-y-3">
                  {exhibitions
                    .sort(
                      (a, b) =>
                        new Date(b.start_date).getTime() -
                        new Date(a.start_date).getTime()
                    )
                    .map((exhibition) => (
                      <div
                        key={exhibition.id}
                        className={`bg-white rounded-lg border border-gray-200 p-4 transition-shadow ${
                          exhibition.blog_post_url
                            ? "hover:shadow-md cursor-pointer"
                            : ""
                        }`}
                        onClick={() => {
                          if (exhibition.blog_post_url) {
                            router.push(exhibition.blog_post_url);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <span className="text-sm text-gray-500 font-medium min-w-[50px]">
                                {new Date(exhibition.start_date).getFullYear()}
                              </span>
                              <div className="flex-1">
                                <h3 className="text-base font-medium text-gray-900">
                                  {exhibition.title_ko}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {exhibition.venue_ko}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(exhibition.start_date)} -{" "}
                                  {formatDate(exhibition.end_date)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* 우측에 뱃지와 더보기 아이콘 세로 정렬 */}
                          <div className="flex flex-col items-end gap-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                exhibition.exhibition_type === "solo"
                                  ? "bg-purple-100 text-purple-800"
                                  : exhibition.exhibition_type === "group"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {getExhibitionTypeLabel(
                                exhibition.exhibition_type
                              )}
                            </span>
                            {exhibition.blog_post_url && (
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                                more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Award 섹션 */}
            {awards.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>🏆</span>
                  <span>Awards & Recognition</span>
                </h2>
                <div className="space-y-3">
                  {awards
                    .sort((a, b) => parseInt(b.year) - parseInt(a.year))
                    .map((award) => (
                      <div
                        key={award.id}
                        className={`bg-white rounded-lg border border-gray-200 p-4 transition-shadow ${
                          award.blog_post_url
                            ? "hover:shadow-md cursor-pointer"
                            : ""
                        }`}
                        onClick={() => {
                          if (award.blog_post_url) {
                            router.push(award.blog_post_url);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <span className="text-sm text-gray-500 font-medium min-w-[50px]">
                                {award.year}
                              </span>
                              <div className="flex-1">
                                <h3 className="text-base font-medium text-gray-900">
                                  {award.title_ko}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {award.organization_ko}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* 우측에 뱃지와 more 세로 정렬 */}
                          <div className="flex flex-col items-end gap-2">
                            {award.award_type && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${getAwardTypeBadgeColor(
                                  award.award_type
                                )}`}
                              >
                                {award.award_type}
                              </span>
                            )}
                            {award.blog_post_url && (
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          isOwner && (
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() =>
                  router.push("/profile/manage?section=exhibitions")
                }
                className="w-full group relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-400 hover:border-gray-500 transition-all duration-300"
              >
                <div className="py-20 px-6 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-gray-100 group-hover:to-gray-150 transition-all duration-300">
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    전시 및 수상 경력을 등록해주세요
                  </p>
                  <p className="text-sm mt-2 text-gray-500">
                    전시, 수상 이력을 공유해보세요
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
