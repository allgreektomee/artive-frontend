"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// 컴포넌트 import
import ArtworkDetailHeader from "@/components/artwork-detail/ArtworkDetailHeader";
import ArtworkMainInfo from "@/components/artwork-detail/ArtworkMainInfo";
import ArtworkHistoryTimeline from "@/components/artwork-detail/ArtworkHistoryTimeline";
import ImageModal from "@/components/artwork-detail/ImageModal";
import AddHistoryModal from "@/components/artwork-detail/AddHistoryModal";

export default function ArtworkDetailPage() {
  const params = useParams();
  const artworkId = params.id;
  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // 상태 관리
  const [artwork, setArtwork] = useState(null);
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTitleInHeader, setShowTitleInHeader] = useState(false);

  // Modal states
  const [showImageModal, setShowImageModal] = useState(false);
  const [showAddHistoryModal, setShowAddHistoryModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState({
    url: "",
    title: "",
    subtitle: "",
  });

  const [editingHistory, setEditingHistory] = useState(null);

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
        const token = localStorage.getItem("token");
        const headers = { Accept: "application/json" };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        // 작품 상세 정보 API 호출
        const artworkRes = await fetch(`${backEndUrl}/artworks/${artworkId}`, {
          method: "GET",
          headers,
        });

        if (!artworkRes.ok) {
          throw new Error(`작품을 불러올 수 없습니다: ${artworkRes.status}`);
        }

        const artworkData = await artworkRes.json();
        setArtwork(artworkData);

        // 히스토리 목록 가져오기 (별도 API가 있다면)
        const historiesRes = await fetch(
          `${backEndUrl}/api/artworks/${artworkId}/histories`,
          {
            method: "GET",
            headers,
          }
        );

        if (historiesRes.ok) {
          const historiesData = await historiesRes.json();
          console.log("🔍 히스토리 데이터:", historiesData);

          // 수정: 직접 배열인지, 객체 안의 배열인지 확인
          if (Array.isArray(historiesData)) {
            setHistories(historiesData); // 직접 배열인 경우
          } else {
            setHistories(historiesData.histories || []); // 객체 안의 배열인 경우
          }
        }
      } catch (err) {
        console.error("작품 상세 정보 로딩 실패:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworkDetail();
  }, [artworkId, backEndUrl]);

  // artworks/[id]/page.tsx에서
  const handleAddHistory = async (historyData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${backEndUrl}/api/artworks/${artworkId}/histories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: historyData.title,
            content: historyData.content,
            media_type: historyData.media_type,
            media_url: historyData.media_url,
            work_date: historyData.work_date,
            history_type: "manual", // 수동 추가
          }),
        }
      );

      if (response.ok) {
        const newHistory = await response.json();
        setHistories((prev) => [...prev, newHistory]);
        setShowAddHistoryModal(false);
      } else {
        throw new Error("히스토리 추가 실패");
      }
    } catch (err) {
      console.error("히스토리 추가 오류:", err);
      alert("히스토리 추가에 실패했습니다.");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <ArtworkDetailHeader
        onBack={handleBack}
        artworkTitle={artwork.title}
        showTitle={showTitleInHeader}
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
          onEditHistory={handleEditHistory} // 수정 함수 전달
          onDeleteHistory={handleDeleteHistory} // 삭제 함수 전달
          isOwner={true} // 실제로는 소유자 체크 로직 필요
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
