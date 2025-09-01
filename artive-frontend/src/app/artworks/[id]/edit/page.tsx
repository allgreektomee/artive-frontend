"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

// 컴포넌트 imports
import ArtworkBasicInfo from "@/components/new/ArtworkBasicInfo";
import ArtworkImageUpload from "@/components/new/ArtworkImageUpload";
import ArtworkSchedule from "@/components/new/ArtworkSchedule";

export default function EditArtworkPage() {
  const router = useRouter();
  const params = useParams();
  const artworkId = params?.id as string;
  const slug = params?.slug as string;

  const backEndUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTemp, setIsTemp] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    medium: "",
    size: "",
    year: "",
    thumbnail_url: "",
    privacy: "public" as "public" | "private" | "unlisted",
    started_at: "",
    estimated_completion: "",
    links: [] as Array<{ title: string; url: string }>,
    youtube_urls: [] as string[],
    description_format: "markdown",
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const shouldCleanupRef = useRef(true);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetchArtworkData();
  }, [router, artworkId]);

  // 기존 작품 데이터 불러오기
  const fetchArtworkData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backEndUrl}/api/artworks/${artworkId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("작품을 불러올 수 없습니다.");
      }

      const data = await response.json();

      // 폼 데이터 설정
      setForm({
        title: data.title || "",
        description: data.description || "",
        medium: data.medium || "",
        size: data.size || "",
        year: data.year?.toString() || "",
        thumbnail_url: data.thumbnail_url || "",
        privacy: data.privacy || "public",
        started_at: data.started_at ? data.started_at.split("T")[0] : "",
        estimated_completion: data.estimated_completion
          ? data.estimated_completion.split("T")[0]
          : "",
        links: data.links || [],
        youtube_urls: data.youtube_urls || [],
        description_format: data.description_format || "markdown",
      });

      setThumbnailPreview(data.thumbnail_url || null);
      setFetchingData(false);
    } catch (err) {
      console.error("작품 데이터 로드 실패:", err);
      setError("작품 정보를 불러오는데 실패했습니다.");
      setFetchingData(false);
    }
  };

  // 페이지 이탈 시 임시 이미지 삭제
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.thumbnail_url && !isSubmitting && isTemp) {
        e.preventDefault();
        e.returnValue = "업로드한 이미지가 삭제됩니다. 계속하시겠습니까?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (shouldCleanupRef.current && form.thumbnail_url && isTemp) {
        const token = localStorage.getItem("token");
        if (token) {
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

  if (!mounted || fetchingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleFormChange = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) {
      setError(null);
    }
  };

  const handleImageChange = async (
    imageUrl: string,
    preview: string | null,
    tempFlag: boolean = true
  ) => {
    if (form.thumbnail_url && isTemp) {
      try {
        const token = localStorage.getItem("token");
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

    if (error) {
      setError(null);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const validateForm = () => {
    if (!form.title.trim()) return "작품 제목을 입력해주세요.";
    if (form.title.length < 2) return "제목은 최소 2자 이상이어야 합니다.";
    if (form.title.length > 100) return "제목은 100자 이하여야 합니다.";
    if (form.description && form.description.length > 5000)
      return "설명은 5000자 이하여야 합니다.";
    if (
      form.year &&
      (parseInt(form.year) < 1900 ||
        parseInt(form.year) > new Date().getFullYear() + 10)
    ) {
      return "올바른 제작연도를 입력해주세요.";
    }

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
    shouldCleanupRef.current = false;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

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
          }
        } catch (err) {
          console.error("이미지 이동 실패 (계속 진행):", err);
        }
      }

      const submitData = {
        ...form,
        thumbnail_url: finalImageUrl,
        started_at: form.started_at
          ? new Date(form.started_at).toISOString()
          : null,
        estimated_completion: form.estimated_completion
          ? new Date(form.estimated_completion).toISOString()
          : null,
      };

      const response = await fetch(`${backEndUrl}/api/artworks/${artworkId}`, {
        method: "PUT", // 수정은 PUT 메서드 사용
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        // 성공 시 작품 상세 페이지로 이동
        router.push(`/${slug}/artworks/${artworkId}`);
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/auth/login");
          return;
        }
        setError(data.detail || "작품 수정에 실패했습니다.");
      }
    } catch (err) {
      console.error("작품 수정 오류:", err);
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

  const handleCancel = async () => {
    if (form.thumbnail_url && isTemp) {
      const confirmDelete = window.confirm(
        "업로드한 이미지가 삭제됩니다. 계속하시겠습니까?"
      );
      if (confirmDelete) {
        try {
          const token = localStorage.getItem("token");
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
        } catch (error) {
          console.error("이미지 삭제 실패:", error);
        }
      } else {
        return;
      }
    }

    shouldCleanupRef.current = false;
    router.push(`/${slug}/artworks/${artworkId}`);
  };

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
              <h1 className="text-2xl font-bold">작품 수정</h1>
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

          <ArtworkImageUpload
            imageUrl={form.thumbnail_url}
            imagePreview={thumbnailPreview}
            onImageChange={handleImageChange}
            onError={handleError}
            loading={loading}
            useTemp={true}
          />

          <ArtworkSchedule
            form={{
              started_at: form.started_at,
              estimated_completion: form.estimated_completion,
            }}
            onChange={handleFormChange}
            loading={loading}
          />

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
                  <span>수정 중...</span>
                </div>
              ) : (
                "작품 수정"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
