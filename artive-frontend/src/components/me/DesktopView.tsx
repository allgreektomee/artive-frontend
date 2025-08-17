import React from "react";
import { ProfileData } from "../../utils/types";

interface DesktopViewProps {
  profileData: ProfileData;
  isPublic?: boolean;
}

const DesktopView: React.FC<DesktopViewProps> = ({
  profileData,
  isPublic = false,
}) => {
  const extractYoutubeId = (url: string) => {
    const match = url?.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center space-x-6">
            {profileData.thumbnail_url ? (
              <img
                src={profileData.thumbnail_url}
                alt={profileData.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-5xl text-white">🎨</span>
              </div>
            )}
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-2">
                {profileData.name || "아티스트"}
              </h1>
              <p className="text-xl opacity-90">
                {profileData.bio || "창작의 세계에 오신 것을 환영합니다"}
              </p>
              {!isPublic && (
                <div className="mt-4 flex space-x-4">
                  <a
                    href="/profile/edit"
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    프로필 편집
                  </a>
                  <a
                    href="/artwork/new"
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    작품 추가
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <a
              href="#artworks"
              className="py-4 px-1 border-b-2 border-blue-600 text-blue-600 font-medium"
            >
              작품
            </a>
            <a
              href="#about"
              className="py-4 px-1 border-b-2 border-transparent text-gray-700 hover:text-gray-900"
            >
              소개
            </a>
            <a
              href="#exhibitions"
              className="py-4 px-1 border-b-2 border-transparent text-gray-700 hover:text-gray-900"
            >
              전시
            </a>
            <a
              href="#awards"
              className="py-4 px-1 border-b-2 border-transparent text-gray-700 hover:text-gray-900"
            >
              수상
            </a>
            <a
              href="#interview"
              className="py-4 px-1 border-b-2 border-transparent text-gray-700 hover:text-gray-900"
            >
              인터뷰
            </a>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Artworks Section */}
            <section id="artworks">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                작품 갤러리
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profileData.artworks?.map((artwork: any) => (
                  <div key={artwork.id} className="group cursor-pointer">
                    <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={artwork.thumbnail_url}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      {artwork.title}
                    </h3>
                    <p className="text-xs text-gray-500">{artwork.year}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* About Section */}
            <section id="about">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                아티스트 소개
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">
                  {profileData.artist_statement ||
                    "아티스트 소개가 준비 중입니다."}
                </p>
              </div>

              {/* YouTube Videos */}
              {(profileData.youtube_url_1 || profileData.youtube_url_2) && (
                <div className="mt-8 space-y-6">
                  {profileData.youtube_url_1 && (
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${extractYoutubeId(
                          profileData.youtube_url_1
                        )}`}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  )}
                  {profileData.youtube_url_2 && (
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${extractYoutubeId(
                          profileData.youtube_url_2
                        )}`}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Interview Section */}
            {profileData.qa_list && profileData.qa_list.length > 0 && (
              <section id="interview">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  아티스트 인터뷰
                </h2>
                <div className="space-y-6">
                  {profileData.qa_list.map((qa: any, index: number) => (
                    <div
                      key={qa.id}
                      className="bg-white rounded-lg p-6 shadow-sm"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                          Q
                        </span>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium mb-3">
                            {qa.question}
                          </p>
                          <div className="flex items-start space-x-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold text-sm">
                              A
                            </span>
                            <p className="flex-1 text-gray-700">{qa.answer}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Exhibitions */}
            {profileData.exhibitions && profileData.exhibitions.length > 0 && (
              <section id="exhibitions">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  전시 이력
                </h3>
                <div className="space-y-4">
                  {profileData.exhibitions.map((exhibition: any) => (
                    <div
                      key={exhibition.id}
                      className="bg-white rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {exhibition.title_ko}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {exhibition.venue_ko}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {exhibition.year}
                          </p>
                        </div>
                        {exhibition.is_featured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            주요
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Awards */}
            {profileData.awards && profileData.awards.length > 0 && (
              <section id="awards">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  수상 이력
                </h3>
                <div className="space-y-4">
                  {profileData.awards.map((award: any) => (
                    <div
                      key={award.id}
                      className="bg-white rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {award.title_ko}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {award.organization_ko}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {award.year}
                          </p>
                        </div>
                        {award.is_featured && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                            🏆
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Social Links */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                소셜 미디어
              </h3>
              <div className="flex space-x-4">
                {profileData.instagram_url && (
                  <a
                    href={profileData.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  >
                    📸
                  </a>
                )}
                {profileData.youtube_url && (
                  <a
                    href={profileData.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  >
                    📺
                  </a>
                )}
                {profileData.facebook_url && (
                  <a
                    href={profileData.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  >
                    f
                  </a>
                )}
              </div>
            </section>

            {/* Stats */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">통계</h3>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {profileData.total_artworks || 0}
                    </p>
                    <p className="text-sm text-gray-500">작품</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {profileData.total_views || 0}
                    </p>
                    <p className="text-sm text-gray-500">조회수</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {profileData.followers_count || 0}
                    </p>
                    <p className="text-sm text-gray-500">팔로워</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {profileData.exhibitions?.length || 0}
                    </p>
                    <p className="text-sm text-gray-500">전시</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopView;
