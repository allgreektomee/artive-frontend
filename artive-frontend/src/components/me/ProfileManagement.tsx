import React, { useState, useEffect } from "react";
import BasicInfoSection from "./sections/BasicInfoSection";
import AboutArtistSection from "./sections/AboutArtistSection";
import StudioProcessSection from "./sections/StudioProcessSection";
import InterviewSection from "./sections/InterviewSection";
import ExhibitionsSection from "./sections/ExhibitionsSection";
import CompetitionsSection from "./sections/CompetitionsSection";
import { ProfileData } from "../../utils/types";
import { getProfile, updateProfile } from "../../services/profileService";
import { toast } from "react-toastify";

const ProfileManagement: React.FC = () => {
  const [activeSection, setActiveSection] = useState("basic");
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const sections = [
    { id: "basic", title: "기본 정보", icon: "👤" },
    { id: "about", title: "아티스트 소개", icon: "🎨" },
    { id: "studio", title: "작업 공간", icon: "🏠" },
    { id: "interview", title: "인터뷰 Q&A", icon: "💬" },
    { id: "exhibitions", title: "전시회", icon: "🖼️" },
    { id: "competitions", title: "수상/선정", icon: "🏆" },
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await getProfile();
      setProfileData(data);
    } catch (error) {
      console.error("프로필 로드 실패:", error);
      toast.error("프로필을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(profileData);
      toast.success("프로필이 저장되었습니다!");
      setHasChanges(false);
    } catch (error) {
      console.error("프로필 저장 실패:", error);
      toast.error("프로필 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const renderSection = () => {
    const commonProps = {
      data: profileData,
      onChange: handleSectionChange,
      isMobile: window.innerWidth < 768,
    };

    switch (activeSection) {
      case "basic":
        return <BasicInfoSection {...commonProps} />;
      case "about":
        return <AboutArtistSection {...commonProps} />;
      case "studio":
        return <StudioProcessSection {...commonProps} />;
      case "interview":
        return <InterviewSection {...commonProps} />;
      case "exhibitions":
        return <ExhibitionsSection {...commonProps} />;
      case "competitions":
        return <CompetitionsSection {...commonProps} />;
      default:
        return <BasicInfoSection {...commonProps} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">프로필 관리</h1>
            <div className="flex items-center space-x-3">
              {hasChanges && (
                <span className="text-sm text-amber-600">
                  • 저장하지 않은 변경사항이 있습니다
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  hasChanges && !saving
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {saving ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    저장 중...
                  </span>
                ) : (
                  "저장하기"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-xl">{section.icon}</span>
                  <span>{section.title}</span>
                  {activeSection === section.id && (
                    <svg
                      className="ml-auto h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </nav>

            {/* Progress Indicator */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                프로필 완성도
              </h3>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <p className="text-xs text-blue-700 mt-2">65% 완성</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {sections.find((s) => s.id === activeSection)?.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {activeSection === "basic" &&
                    "아티스트 기본 정보와 갤러리 주소를 설정하세요"}
                  {activeSection === "about" &&
                    "작가로서의 이야기와 작업 철학을 소개하세요"}
                  {activeSection === "studio" &&
                    "작업 공간과 작업 과정을 공유하세요"}
                  {activeSection === "interview" &&
                    "Q&A 형식으로 작가 인터뷰를 구성하세요"}
                  {activeSection === "exhibitions" &&
                    "참여한 전시회 이력을 관리하세요"}
                  {activeSection === "competitions" &&
                    "수상 및 선정 이력을 관리하세요"}
                </p>
              </div>

              {renderSection()}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Save Button */}
      {hasChanges && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {saving ? "저장 중..." : "변경사항 저장"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileManagement;
