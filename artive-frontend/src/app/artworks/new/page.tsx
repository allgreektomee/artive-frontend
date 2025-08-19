"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

// 컴포넌트 imports
import ArtworkBasicInfo from "@/components/new/ArtworkBasicInfo";
import ArtworkImageUpload from "@/components/new/ArtworkImageUpload";
import ArtworkSchedule from "@/components/new/ArtworkSchedule";

export default function NewArtworkPage() {
  const router = useRouter();
  const backEndUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    medium: "",
    size: "",
    year: new Date().getFullYear().toString(),
    thumbnail_url: "",
    privacy: "public" as "public" | "private" | "unlisted",
    started_at: "",
    estimated_completion: "",
  });

  // 이미지 미리보기 상태
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    // 로그인 상태 확인 - token 키 사용
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
  }, [router]);

  if (!mounted) return null;

  // 폼 데이터 변경 핸들러
  const handleFormChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    // 에러가 있으면 클리어 (사용자가 수정을 시작했을 때)
    if (error) {
      setError(null);
    }
  };

  // 이미지 변경 핸들러
  const handleImageChange = (imageUrl: string, preview: string | null) => {
    setForm((prev) => ({ ...prev, thumbnail_url: imageUrl }));
    setThumbnailPreview(preview);

    // 에러가 있으면 클리어
    if (error) {
      setError(null);
    }
  };

  // 에러 핸들러
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const validateForm = () => {
    if (!form.title.trim()) return "작품 제목을 입력해주세요.";
    if (form.title.length < 2) return "제목은 최소 2자 이상이어야 합니다.";
    if (form.title.length > 100) return "제목은 100자 이하여야 합니다.";
    if (form.description && form.description.length > 1000)
      return "설명은 1000자 이하여야 합니다.";
    if (
      form.year &&
      (parseInt(form.year) < 1900 ||
        parseInt(form.year) > new Date().getFullYear() + 10)
    ) {
      return "올바른 제작연도를 입력해주세요.";
    }

    // 날짜 검증
    if (form.started_at && form.estimated_completion) {
      if (new Date(form.started_at) > new Date(form.estimated_completion)) {
        return "시작일이 완성 예정일보다 늦을 수 없습니다.";
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user"); // 🎯 사용자 정보 가져오기

      if (!token) {
        router.push("/auth/login");
        return;
      }

      // 🎯 현재 사용자 정보 파싱
      let currentUser = null;
      if (userStr) {
        try {
          currentUser = JSON.parse(userStr);
        } catch (e) {
          console.error("사용자 정보 파싱 오류:", e);
        }
      }

      // 날짜 형식 변환
      const submitData = {
        ...form,
        artist_name: currentUser?.name || "Unknown Artist", // 🎯 아티스트명 추가!
        started_at: form.started_at
          ? new Date(form.started_at).toISOString()
          : null,
        estimated_completion: form.estimated_completion
          ? new Date(form.estimated_completion).toISOString()
          : null,
      };

      console.log("📤 작품 등록 요청:", submitData);

      const response = await fetch(`${backEndUrl}/api/artworks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();
      console.log("📥 작품 등록 응답:", data);

      if (response.ok) {
        // 성공 시 사용자 갤러리(홈)로 이동
        const userStr = localStorage.getItem("user");
        console.log("저장된 사용자 정보:", userStr);

        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            console.log("파싱된 사용자:", user);
            console.log("리다이렉트할 slug:", user.slug);

            router.push(`/${user.slug}`); // jaeyoungpark으로 가야 함
            return;
          } catch (e) {
            console.error("사용자 정보 파싱 오류:", e);
          }
        }
        // 사용자 정보가 없으면 루트로 이동
        router.push("/");
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token"); // access_token을 token으로 통일
          localStorage.removeItem("user");
          router.push("/auth/login");
          return;
        }
        setError(data.detail || "작품 등록에 실패했습니다.");
      }
    } catch (err) {
      console.error("작품 등록 오류:", err);
      if (err instanceof Error) {
        setError("네트워크 오류: " + err.message);
      } else {
        setError("서버와 연결할 수 없습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 뒤로가기 핸들러
  const handleBack = () => {
    // 현재 사용자 정보 가져오기
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        router.push(`/${user.slug}`);
        return;
      } catch (e) {
        console.error("사용자 정보 파싱 오류:", e);
      }
    }

    // 사용자 정보가 없으면 브라우저 뒤로가기
    router.back();
  };

  // 폼이 변경되었는지 확인
  const isFormChanged = () => {
    return (
      form.title.trim() !== "" ||
      form.description.trim() !== "" ||
      form.medium.trim() !== "" ||
      form.size.trim() !== "" ||
      form.thumbnail_url !== "" ||
      form.started_at !== "" ||
      form.estimated_completion !== ""
    );
  };

  // 제출 가능 여부 확인
  const canSubmit = () => {
    return form.title.trim() !== "" && !loading;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-black transition-colors"
                type="button"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <h1 className="text-2xl font-bold">새 작품 등록</h1>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              artive.com
            </Link>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 기본 정보 섹션 */}
          <ArtworkBasicInfo
            form={{
              title: form.title,
              description: form.description,
              medium: form.medium,
              size: form.size,
              year: form.year,
              privacy: form.privacy,
            }}
            onChange={handleFormChange}
            loading={loading}
          />

          {/* 이미지 업로드 섹션 */}
          <ArtworkImageUpload
            imageUrl={form.thumbnail_url}
            imagePreview={thumbnailPreview}
            onImageChange={handleImageChange}
            onError={handleError}
            loading={loading}
          />

          {/* 일정 정보 섹션 */}
          <ArtworkSchedule
            form={{
              started_at: form.started_at,
              estimated_completion: form.estimated_completion,
            }}
            onChange={handleFormChange}
            loading={loading}
          />

          {/* 제출 버튼 */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!canSubmit()}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>등록 중...</span>
                </div>
              ) : (
                "작품 등록"
              )}
            </button>
          </div>
        </form>

        {/* 변경사항 안내 - 위치 조정 (모바일에서도 안전하게) */}
        {isFormChanged() && (
          <div className="fixed bottom-20 sm:bottom-8 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-10 flex items-center space-x-2">
            <span>💾</span>
            <span className="text-sm">변경사항이 있습니다</span>
          </div>
        )}
      </div>
    </div>
  );
}
