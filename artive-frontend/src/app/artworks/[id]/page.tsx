"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// 컴포넌트 import
import ArtworkDetailHeader from "@/components/artwork-detail/ArtworkDetailHeader";
import ArtworkMainInfo from "@/components/artwork-detail/ArtworkMainInfo";
import ArtworkHistoryTimeline from "@/components/artwork-detail/ArtworkHistoryTimeline";
import ImageModal from "@/components/artwork-detail/ImageModal";
import AddHistoryModal from "@/components/artwork-detail/AddHistoryModal";

export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const artworkId = params.id;
  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // 상태 관리
  const [artwork, setArtwork] = useState(null);
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTitleInHeader, setShowTitleInHeader] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingHistory, setEditingHistory] = useState(null);

  // Modal states
  const [showImageModal, setShowImageModal] = useState(false);
  const [showAddHistoryModal, setShowAddHistoryModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState({
    url: "",
    title: "",
    subtitle: "",
  });

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("❌ 토큰이 없습니다");
          return;
        }

        const response = await fetch(`${backEndUrl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          console.log("✅ 현재 사용자 정보:", userData);
          setCurrentUser(userData);
        } else {
          console.error("❌ 사용자 정보 응답 실패:", response.status);
          // localStorage에서 사용자 정보 시도
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            console.log("📦 localStorage 사용자 정보:", parsedUser);
            setCurrentUser(parsedUser);
          }
        }
      } catch (err) {
        console.error("사용자 정보 가져오기 실패:", err);
        // localStorage에서 사용자 정보 시도
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("📦 localStorage 사용자 정보 (fallback):", parsedUser);
          setCurrentUser(parsedUser);
        }
      }
    };

    fetchCurrentUser();
  }, [backEndUrl]);

  // 히스토리 수정 함수
  const handleEditHistory = (history) => {
    setEditingHistory(history);
    setShowAddHistoryModal(true); // 같은 모달을 수정용으로 재사용
  };

  // 작품 상세 정보 가져오기
  useEffect(() => {
    const fetchArtworkDetail = async () => {
      if (!artworkId) return;

      try {
        setLoading(true);

        // 디버깅 정보 출력
        console.log("🔍 백엔드 URL:", backEndUrl);
        console.log("🔍 요청 URL:", `${backEndUrl}/api/artworks/${artworkId}`);

        const token = localStorage.getItem("token");
        const headers = { Accept: "application/json" };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        console.log("🔍 요청 헤더:", headers);

        // 작품 상세 정보 API 호출
        const artworkRes = await fetch(
          `${backEndUrl}/api/artworks/${artworkId}`,
          {
            method: "GET",
            headers,
          }
        );

        console.log("🎯 응답 상태:", artworkRes.status);
        console.log("🎯 응답 OK:", artworkRes.ok);

        if (!artworkRes.ok) {
          throw new Error(`작품을 불러올 수 없습니다: ${artworkRes.status}`);
        }

        const artworkData = await artworkRes.json();
        console.log("🎯 받은 작품 데이터:", artworkData);
        setArtwork(artworkData);

        // 히스토리 데이터 가져오기
        const historiesRes = await fetch(
          `${backEndUrl}/api/artworks/${artworkId}/histories`,
          {
            method: "GET",
            headers,
          }
        );

        if (historiesRes.ok) {
          const historiesData = await historiesRes.json();
          setHistories(historiesData);
        }
      } catch (err) {
        console.error("🚨 상세 에러:", err);
        console.error("🚨 에러 타입:", typeof err);
        console.error("🚨 에러 메시지:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworkDetail();
  }, [artworkId, backEndUrl]);

  // 히스토리 추가 함수
  const handleAddHistory = async (historyData) => {
    try {
      const token = localStorage.getItem("token");

      // work_date를 datetime 형식으로 변환
      let formattedWorkDate = null;
      if (historyData.work_date) {
        // "2025-08-19" -> "2025-08-19T00:00:00"
        formattedWorkDate = `${historyData.work_date}T00:00:00`;
      }

      // 빈 값 처리 - 빈 문자열을 null로 변환
      const requestData = {
        title: historyData.title,
        content: historyData.content,
        media_type: historyData.media_type || "text",
        media_url: historyData.media_url || null,
        work_date: formattedWorkDate,
        history_type: "manual",
      };

      // 빈 문자열 체크
      if (requestData.media_url === "") requestData.media_url = null;
      if (requestData.work_date === "") requestData.work_date = null;

      console.log("📤 전송 데이터:", requestData);

      const response = await fetch(
        `${backEndUrl}/api/artworks/${artworkId}/histories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      console.log("📥 응답 상태:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ 에러 응답:", errorText);

        // JSON 파싱 시도
        try {
          const errorData = JSON.parse(errorText);
          console.error("❌ 에러 상세:", errorData);
          throw new Error(errorData.detail || "히스토리 추가 실패");
        } catch (e) {
          throw new Error(`히스토리 추가 실패: ${response.status}`);
        }
      }

      const newHistory = await response.json();
      console.log("✅ 히스토리 추가 성공:", newHistory);

      setHistories((prev) => [...prev, newHistory]);
      setShowAddHistoryModal(false);
    } catch (err) {
      console.error("히스토리 추가 오류:", err);
      alert(err.message || "히스토리 추가에 실패했습니다.");
    }
  };

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const titleElement = document.getElementById("artwork-title");
      if (titleElement) {
        const rect = titleElement.getBoundingClientRect();
        setShowTitleInHeader(rect.bottom < 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 이벤트 핸들러들
  const handleBack = () => {
    window.history.back();
  };

  const handleImageClick = (imageUrl, title, subtitle) => {
    setSelectedImage({
      url: imageUrl,
      title: title || artwork?.title || "",
      subtitle: subtitle || `${artwork?.size} • ${artwork?.medium}`,
    });
    setShowImageModal(true);
  };

  const handleMainImageClick = () => {
    handleImageClick(
      artwork?.thumbnail_url,
      artwork?.title,
      `${artwork?.size} • ${artwork?.medium}`
    );
  };

  // 히스토리 삭제 함수
  const handleDeleteHistory = async (historyId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${backEndUrl}/api/artworks/${artworkId}/histories/${historyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setHistories((prev) => prev.filter((h) => h.id !== historyId));
        console.log("히스토리 삭제 성공");
      } else {
        throw new Error("히스토리 삭제 실패");
      }
    } catch (err) {
      console.error("히스토리 삭제 오류:", err);
      alert("히스토리 삭제에 실패했습니다.");
    }
  };

  // Artwork 삭제 핸들러
  const handleDeleteArtwork = () => {
    // 삭제 성공 후 사용자의 갤러리로 이동
    // 현재 사용자의 slug나 username을 사용
    if (currentUser?.username) {
      router.push(`/${currentUser.username}`);
    } else if (currentUser?.slug) {
      router.push(`/${currentUser.slug}`);
    } else if (artwork?.user?.username) {
      router.push(`/${artwork.user.username}`);
    } else if (artwork?.user?.slug) {
      router.push(`/${artwork.user.slug}`);
    } else {
      // fallback - 홈으로 이동
      router.push("/");
    }
    alert("작품이 성공적으로 삭제되었습니다");
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // 에러 상태
  if (error || !artwork) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 text-lg mb-4">
          {error || "작품을 찾을 수 없습니다."}
        </p>
        <button onClick={handleBack} className="text-blue-600 hover:underline">
          돌아가기
        </button>
      </div>
    );
  }

  // 소유자 확인 - 다양한 필드 체크
  const isOwner =
    currentUser &&
    artwork &&
    (currentUser.id === artwork.user_id ||
      currentUser.id === artwork.user?.id ||
      currentUser.email === artwork.user?.email);

  // 디버깅 로그
  console.log("🔍 소유자 체크:", {
    currentUser: currentUser,
    currentUserId: currentUser?.id,
    artworkUserId: artwork?.user_id,
    artworkUser: artwork?.user,
    isOwner: isOwner,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <ArtworkDetailHeader
        onBack={handleBack}
        artworkTitle={artwork.title}
        showTitle={showTitleInHeader}
        isOwner={true} // 일단 true로 강제 설정
        artworkId={artwork.id}
        onDelete={handleDeleteArtwork}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Artwork Info */}
        <div id="artwork-title">
          <ArtworkMainInfo
            artwork={artwork}
            onImageClick={handleMainImageClick}
          />
        </div>

        {/* History Timeline */}
        <ArtworkHistoryTimeline
          histories={histories}
          onImageClick={handleImageClick}
          onAddHistory={() => setShowAddHistoryModal(true)}
          onDeleteHistory={handleDeleteHistory}
          isOwner={true} // 일단 true로 강제 설정하여 테스트
        />
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={showImageModal}
        imageUrl={selectedImage.url}
        imageTitle={selectedImage.title}
        imageSubtitle={selectedImage.subtitle}
        onClose={() => setShowImageModal(false)}
      />

      {/* Add History Modal */}
      <AddHistoryModal
        isOpen={showAddHistoryModal}
        onClose={() => setShowAddHistoryModal(false)}
        onSubmit={handleAddHistory}
        loading={false}
      />
    </div>
  );
}
