"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTemp, setIsTemp] = useState(false); // 임시 파일 여부

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
    // 새로 추가되는 필드들
    links: [] as Array<{ title: string; url: string }>,
    youtube_urls: [] as string[],
    description_format: "markdown",
  });

  // 이미지 미리보기 상태
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // cleanup 플래그 (언마운트 시 이미지 삭제용)
  const shouldCleanupRef = useRef(true);

  useEffect(() => {
    setMounted(true);

    // 로그인 상태 확인
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
  }, [router]);

  // 페이지 이탈 시 임시 이미지 삭제
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.thumbnail_url && !isSubmitting && isTemp) {
        e.preventDefault();
        e.returnValue = "업로드한 이미지가 삭제됩니다. 계속하시겠습니까?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // 컴포넌트 언마운트 시 정리
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // 임시 이미지 삭제 (제출하지 않은 경우)
      if (shouldCleanupRef.current && form.thumbnail_url && isTemp) {
        const token = localStorage.getItem("access_token");
        if (token) {
          // 비동기로 삭제 요청
          fetch(
            `${backEndUrl}/api/upload/delete-file?file_url=${encodeURIComponent(
              form.thumbnail_url
            )}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ).catch((err) => console.error("임시 이미지 삭제 실패:", err));
        }
      }
    };
  }, [form.thumbnail_url, isSubmitting, isTemp, backEndUrl]);

  if (!mounted) return null;

  // 폼 데이터 변경 핸들러
  const handleFormChange = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    // 에러가 있으면 클리어
    if (error) {
      setError(null);
    }
  };

  // 이미지 변경 핸들러 (임시 업로드 사용)
  const handleImageChange = async (
    imageUrl: string,
    preview: string | null,
    tempFlag: boolean = true
  ) => {
    // 기존 임시 이미지가 있으면 삭제
    if (form.thumbnail_url && isTemp) {
      try {
        const token = localStorage.getItem("access_token");
        await fetch(
          `${backEndUrl}/api/upload/delete-file?file_url=${encodeURIComponent(
            form.thumbnail_url
          )}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error("기존 임시 이미지 삭제 실패:", err);
      }
    }

    setForm((prev) => ({ ...prev, thumbnail_url: imageUrl }));
    setThumbnailPreview(preview);
    setIsTemp(tempFlag);

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
    if (form.description && form.description.length > 5000)
      // 1000 → 5000
      return "설명은 5000자 이하여야 합니다.";
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
    setIsSubmitting(true);
    shouldCleanupRef.current = false; // 제출 시 cleanup 방지

    try {
      const token = localStorage.getItem("access_token");
      const userStr = localStorage.getItem("user");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      // 현재 사용자 정보 파싱
      let currentUser = null;
      if (userStr) {
        try {
          currentUser = JSON.parse(userStr);
        } catch (e) {
          console.error("사용자 정보 파싱 오류:", e);
        }
      }

      // 임시 이미지를 정식 폴더로 이동 (temp 폴더에서 artworks 폴더로)
      let finalImageUrl = form.thumbnail_url;
      if (form.thumbnail_url && isTemp) {
        try {
          const moveResponse = await fetch(
            `${backEndUrl}/api/upload/move-temp-to-permanent`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                temp_url: form.thumbnail_url,
                target_folder: "artworks",
              }),
            }
          );

          if (moveResponse.ok) {
            const moveData = await moveResponse.json();
            finalImageUrl = moveData.new_url;
            console.log("이미지 정식 폴더로 이동 완료:", finalImageUrl);
          }
        } catch (err) {
          console.error("이미지 이동 실패 (계속 진행):", err);
        }
      }

      // 날짜 형식 변환
      const submitData = {
        ...form,
        thumbnail_url: finalImageUrl,
        artist_name: currentUser?.name || "Unknown Artist",
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
        // 성공 시 사용자 갤러리로 이동
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
        router.push("/");
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token");
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
      setIsSubmitting(false);
    }
  };

  // 취소 핸들러 (이미지 삭제 포함)
  const handleCancel = async () => {
    // 업로드된 임시 이미지가 있으면 삭제
    if (form.thumbnail_url && isTemp) {
      const confirmDelete = window.confirm(
        "업로드한 이미지가 삭제됩니다. 계속하시겠습니까?"
      );
      if (confirmDelete) {
        try {
          const token = localStorage.getItem("access_token");
          await fetch(
            `${backEndUrl}/api/upload/delete-file?file_url=${encodeURIComponent(
              form.thumbnail_url
            )}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("임시 이미지 삭제 완료");
        } catch (error) {
          console.error("이미지 삭제 실패:", error);
        }
      } else {
        return; // 취소
      }
    }

    shouldCleanupRef.current = false; // 수동 취소 시 cleanup 방지
    handleBack();
  };

  // 뒤로가기 핸들러
  const handleBack = () => {
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
      form.estimated_completion !== "" ||
      form.links.length > 0 ||
      form.youtube_urls.length > 0
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
                onClick={handleCancel}
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
          {/* 기본 정보 섹션 (링크/유튜브 추가 기능 포함) */}
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
            onLinksChange={(links) => handleFormChange("links", links)}
            onYoutubeUrlsChange={(urls) =>
              handleFormChange("youtube_urls", urls)
            }
          />

          {/* 이미지 업로드 섹션 (임시 업로드 사용) */}
          <ArtworkImageUpload
            imageUrl={form.thumbnail_url}
            imagePreview={thumbnailPreview}
            onImageChange={handleImageChange}
            onError={handleError}
            loading={loading}
            useTemp={true} // 임시 업로드 사용
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
              onClick={handleCancel}
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

        {/* 변경사항 안내 */}
        {isFormChanged() && !isSubmitting && (
          <div className="fixed bottom-5 sm:bottom-8 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-10 flex items-center space-x-2">
            <span>💾</span>
            <span className="text-sm">변경사항이 있습니다</span>
          </div>
        )}
      </div>
    </div>
  );
}
