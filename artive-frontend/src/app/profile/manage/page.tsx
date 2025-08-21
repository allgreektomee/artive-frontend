// components/profile/ProfileManagement.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";

// 섹션 컴포넌트들 import
import BasicInfoSection from "@/components/profile/sections/BasicInfoSection";
import AboutArtistSection from "@/components/profile/sections/AboutArtistSection";
import StudioProcessSection from "@/components/profile/sections/StudioProcessSection";
import InterviewSection from "@/components/profile/sections/InterviewSection";
import ExhibitionsSection from "@/components/profile/sections/ExhibitionsSection";
import CompetitionsSection from "@/components/profile/sections/CompetitionsSection";
import AccountSettingsSection from "@/components/profile/sections/AccountSettingsSection";

// 타입 정의
interface ProfileData {
  // 기본 정보
  id?: number;
  name?: string;
  email?: string;
  slug?: string;
  bio?: string;
  gallery_title?: string;
  gallery_description?: string;
  instagram_username?: string;
  youtube_channel_id?: string;

  // About 섹션
  about_text?: string;
  about_image?: string;
  about_video?: string;

  // Studio 섹션
  studio_description?: string;
  studio_image?: string;
  process_video?: string;

  // Q&A
  qa_list?: any[];

  // 전시회/수상
  exhibitions?: any[];
  awards?: any[];
}

const ProfileManagement: React.FC = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [currentView, setCurrentView] = useState("main");
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [exhibitionsLoading, setExhibitionsLoading] = useState(false);
  const [awardsLoading, setAwardsLoading] = useState(false);

  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const sections = [
    { id: "basic", label: "기본 정보", icon: "👤" },
    { id: "about", label: "아티스트 소개", icon: "🎨" },
    { id: "studio", label: "작업 공간", icon: "🏠" },
    { id: "interview", label: "인터뷰 Q&A", icon: "💬" },
    { id: "exhibitions", label: "전시회", icon: "🖼️" },
    { id: "competitions", label: "수상/선정", icon: "🏆" },
    { id: "account", label: "계정 설정", icon: "⚙️" },
  ];

  // 프로필 데이터 로딩
  useEffect(() => {
    loadMainProfile();
  }, []);

  // 탭 변경시 필요한 데이터 로드
  useEffect(() => {
    if (activeTab === "exhibitions") {
      loadExhibitions();
    } else if (activeTab === "competitions") {
      loadAwards();
    }
  }, [activeTab]);

  // 메인 프로필 데이터 로딩 (텍스트 위주)
  const loadMainProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backEndUrl}/api/profile/main`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // API 응답 구조에 맞게 데이터 매핑
        const mappedData = {
          // 기본 정보
          ...data.basic,

          // 아티스트 소개 (About)
          about_text: data.basic?.about_text || "",
          about_image: data.basic?.about_image || "",
          about_video: data.basic?.about_video || "",

          // 작업 공간 (Studio)
          studio_description: data.basic?.studio_description || "",
          studio_image: data.basic?.studio_image || "",
          process_video: data.basic?.process_video || "",

          // 인터뷰 Q&A
          qa_list: data.qa_list || [],
        };
        setProfileData((prev) => ({ ...prev, ...mappedData }));
      } else if (response.status === 404) {
        setProfileData({});
      }
    } catch (error) {
      console.error("프로필 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 전시회 데이터 로딩
  const loadExhibitions = async () => {
    setExhibitionsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backEndUrl}/api/profile/exhibitions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const exhibitions = await response.json();
        setProfileData((prev) => ({ ...prev, exhibitions }));
      } else {
        console.error("전시회 API 오류:", response.status);
        // 오류 시 빈 배열로 초기화
        setProfileData((prev) => ({ ...prev, exhibitions: [] }));
      }
    } catch (error) {
      console.error("전시회 로딩 실패:", error);
      // 네트워크 오류 시에도 빈 배열로 초기화
      setProfileData((prev) => ({ ...prev, exhibitions: [] }));
    } finally {
      setExhibitionsLoading(false);
    }
  };

  // 수상 데이터 로딩
  const loadAwards = async () => {
    setAwardsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backEndUrl}/api/profile/awards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const awards = await response.json();
        setProfileData((prev) => ({ ...prev, awards }));
      } else {
        console.error("수상 API 오류:", response.status);
        // 오류 시 빈 배열로 초기화
        setProfileData((prev) => ({ ...prev, awards: [] }));
      }
    } catch (error) {
      console.error("수상 로딩 실패:", error);
      // 네트워크 오류 시에도 빈 배열로 초기화
      setProfileData((prev) => ({ ...prev, awards: [] }));
    } finally {
      setAwardsLoading(false);
    }
  };

  // 섹션별 변경 상태 관리
  const [sectionChanges, setSectionChanges] = useState({
    basic: false,
    about: false,
    studio: false,
    interview: false,
    exhibitions: false,
    competitions: false,
    account: false,
  });

  const handleSectionDataChange = (field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 어느 섹션이 변경되었는지 확인
    let changedSection = "";
    if (
      [
        "name",
        "slug",
        "bio",
        "gallery_title",
        "gallery_description",
        "instagram_username",
        "youtube_channel_id",
      ].includes(field)
    ) {
      changedSection = "basic";
    } else if (["about_text", "about_image", "about_video"].includes(field)) {
      changedSection = "about";
    } else if (
      ["studio_description", "studio_image", "process_video"].includes(field)
    ) {
      changedSection = "studio";
    } else if (field === "qa_list") {
      changedSection = "interview";
    } else if (field === "exhibitions") {
      changedSection = "exhibitions";
    } else if (field === "awards") {
      changedSection = "competitions";
    }

    if (changedSection) {
      setSectionChanges((prev) => ({
        ...prev,
        [changedSection]: true,
      }));
    }

    setHasChanges(true);
  };

  // 섹션별 저장 함수
  const handleSectionSave = async (sectionId: string) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      let endpoint = "";
      let sectionData = {};

      switch (sectionId) {
        case "basic":
          endpoint = `${backEndUrl}/api/profile/basic`;
          sectionData = {
            name: profileData.name,
            slug: profileData.slug,
            bio: profileData.bio,
            gallery_title: profileData.gallery_title,
            gallery_description: profileData.gallery_description,
            instagram_username: profileData.instagram_username,
            youtube_channel_id: profileData.youtube_channel_id,
          };
          break;

        case "about":
          endpoint = `${backEndUrl}/api/profile/about`;
          sectionData = {
            about_text: profileData.about_text,
            about_image: profileData.about_image,
            about_video: profileData.about_video,
          };
          break;

        case "studio":
          endpoint = `${backEndUrl}/api/profile/studio`;
          sectionData = {
            studio_description: profileData.studio_description,
            studio_image: profileData.studio_image,
            process_video: profileData.process_video,
          };
          break;

        case "interview":
          endpoint = `${backEndUrl}/api/profile/qa`;
          // Q&A는 배열로 전송 - 빈 배열이라도 전송
          sectionData = profileData.qa_list || [];
          break;

        case "exhibitions":
          alert("전시회는 개별 항목으로 저장됩니다");
          setSaving(false);
          return;

        case "competitions":
          alert("수상/선정은 개별 항목으로 저장됩니다");
          setSaving(false);
          return;

        case "account":
          setSaving(false);
          return;

        default:
          setSaving(false);
          return;
      }

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sectionData),
      });

      if (response.ok) {
        // 해당 섹션의 변경 상태만 초기화
        setSectionChanges((prev) => ({
          ...prev,
          [sectionId]: false,
        }));

        // 다른 섹션에 변경사항이 있는지 확인
        const hasOtherChanges = Object.entries(sectionChanges).some(
          ([key, value]) => key !== sectionId && value
        );

        setHasChanges(hasOtherChanges);
        alert(`${sections.find((s) => s.id === sectionId)?.label} 저장 완료!`);
      } else {
        // 에러 응답 처리 개선
        let errorMessage = "저장 실패";
        try {
          const errorData = await response.json();
          console.log("Error response:", errorData); // 디버깅용

          // 다양한 에러 형식 처리
          if (typeof errorData === "string") {
            errorMessage = errorData;
          } else if (Array.isArray(errorData)) {
            // 배열인 경우 (validation errors)
            errorMessage = errorData
              .map((err) =>
                typeof err === "object"
                  ? err.msg || err.message || JSON.stringify(err)
                  : err
              )
              .join(", ");
          } else if (errorData.detail) {
            // FastAPI 표준 에러
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else {
            errorMessage = `저장 실패 (${response.status})`;
          }
        } catch (e) {
          errorMessage = `저장 실패 (${response.status})`;
        }

        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("섹션 저장 실패:", error);
      alert(error.message || "저장에 실패했습니다");
    } finally {
      setSaving(false);
    }
  };

  const getSubtitle = (sectionId: string): string => {
    switch (sectionId) {
      case "basic":
        return "이름, 갤러리 주소, SNS 링크";
      case "about":
        return "작가 소개, 유튜브 영상";
      case "studio":
        return "작업공간 소개, 과정 영상";
      case "interview":
        return "Q&A 질문과 답변";
      case "exhibitions":
        return "개인전, 그룹전 이력 관리";
      case "competitions":
        return "수상 및 선정 이력 관리";
      case "account":
        return "비밀번호 변경, 회원 탈퇴";
      default:
        return "";
    }
  };

  const getDetailedDescription = (sectionId: string): string => {
    switch (sectionId) {
      case "basic":
        return "아티스트 기본 정보와 갤러리 주소를 설정하세요";
      case "about":
        return "작가로서의 이야기와 작업 철학을 소개하세요";
      case "studio":
        return "작업 공간과 작업 과정을 공유하세요";
      case "interview":
        return "Q&A 형식으로 작가 인터뷰를 구성하세요";
      case "exhibitions":
        return "참여한 전시회 이력을 관리하세요";
      case "competitions":
        return "수상 및 선정 이력을 관리하세요";
      case "account":
        return "계정 보안 및 회원 정보를 관리하세요";
      default:
        return "";
    }
  };

  const renderSectionContent = (sectionId: string) => {
    const commonProps = {
      data: profileData,
      onChange: handleSectionDataChange,
      isMobile: isMobile,
      onSave: () => handleSectionSave(sectionId),
      saving: saving,
      hasChanges: sectionChanges[sectionId as keyof typeof sectionChanges],
    };

    switch (sectionId) {
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
      case "account":
        return <AccountSettingsSection {...commonProps} />;
      default:
        return <div>섹션을 찾을 수 없습니다.</div>;
    }
  };

  // 모바일 메인 뷰
  const MobileMainView = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-100"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold">프로필 관리</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setCurrentView(section.id)}
            className="w-full p-4 rounded-2xl text-left transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] bg-white text-gray-900 shadow-sm hover:shadow-md border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gray-50">
                  {section.icon}
                </div>
                <div>
                  <div className="font-semibold text-lg text-gray-900">
                    {section.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getSubtitle(section.id)}
                  </div>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // 모바일 섹션 뷰
  const MobileSectionView = ({ section }: { section: any }) => (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView("main")}
              className="p-2 rounded-lg hover:bg-gray-100"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-xl">{section.icon}</span>
              <h1 className="text-lg font-semibold">{section.label}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">{renderSectionContent(section.id)}</div>
    </div>
  );

  // 데스크탑 뷰
  const DesktopView = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-black transition-colors"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">프로필 관리</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="w-64">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === section.id
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span>{section.label}</span>
                  {activeTab === section.id && (
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
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {renderSectionContent(activeTab)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">프로필 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 모바일/데스크탑 렌더링
  if (isMobile) {
    if (currentView === "main") {
      return <MobileMainView />;
    } else {
      const section = sections.find((s) => s.id === currentView);
      return section ? (
        <MobileSectionView section={section} />
      ) : (
        <MobileMainView />
      );
    }
  } else {
    return <DesktopView />;
  }
};

export default ProfileManagement;
