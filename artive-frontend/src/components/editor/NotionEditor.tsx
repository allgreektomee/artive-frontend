// app/blog/[slug]/write/page.tsx (인라인 에디터 포함)
"use client";
import { useState, useEffect, KeyboardEvent, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Pin,
  Calendar,
  Hash,
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Plus,
  Bold,
  Italic,
  Underline,
  Link,
  Image,
} from "lucide-react";

// 블록 타입 정의
interface Block {
  id: string;
  type:
    | "paragraph"
    | "heading1"
    | "heading2"
    | "heading3"
    | "bulletList"
    | "numberedList"
    | "quote"
    | "code"
    | "divider";
  content: string;
}

// 간단한 노션 스타일 에디터 컴포넌트
function SimpleNotionEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "1", type: "paragraph", content: "" },
  ]);
  const [activeBlockId, setActiveBlockId] = useState<string>("1");
  const [showBlockMenu, setShowBlockMenu] = useState<string | null>(null);

  // blocks를 마크다운 텍스트로 변환
  const blocksToContent = (blocks: Block[]): string => {
    return blocks
      .map((block) => {
        switch (block.type) {
          case "heading1":
            return `# ${block.content}`;
          case "heading2":
            return `## ${block.content}`;
          case "heading3":
            return `### ${block.content}`;
          case "bulletList":
            return `- ${block.content}`;
          case "numberedList":
            return `1. ${block.content}`;
          case "quote":
            return `> ${block.content}`;
          case "code":
            return `\`\`\`\n${block.content}\n\`\`\``;
          case "divider":
            return "---";
          default:
            return block.content;
        }
      })
      .join("\n");
  };

  // blocks 변경 시 onChange 호출
  useEffect(() => {
    onChange(blocksToContent(blocks));
  }, [blocks, onChange]);

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, ...updates } : block))
    );
  };

  const addBlock = (afterId: string, type: Block["type"] = "paragraph") => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: "",
    };

    setBlocks((prev) => {
      const index = prev.findIndex((block) => block.id === afterId);
      const newBlocks = [...prev];
      newBlocks.splice(index + 1, 0, newBlock);
      return newBlocks;
    });

    setActiveBlockId(newBlock.id);
    setShowBlockMenu(null);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement>,
    blockId: string
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addBlock(blockId);
    } else if (
      e.key === "/" &&
      blocks.find((b) => b.id === blockId)?.content === ""
    ) {
      e.preventDefault();
      setShowBlockMenu(blockId);
    }
  };

  const blockTypes = [
    { type: "paragraph" as const, icon: Type, label: "텍스트" },
    { type: "heading1" as const, icon: Heading1, label: "헤딩 1" },
    { type: "heading2" as const, icon: Heading2, label: "헤딩 2" },
    { type: "heading3" as const, icon: Heading3, label: "헤딩 3" },
    { type: "bulletList" as const, icon: List, label: "불릿 리스트" },
    { type: "numberedList" as const, icon: ListOrdered, label: "번호 리스트" },
    { type: "quote" as const, icon: Quote, label: "인용구" },
    { type: "code" as const, icon: Code, label: "코드" },
  ];

  const renderBlock = (block: Block) => {
    const baseClasses =
      "w-full border-none outline-none resize-none bg-transparent";

    const getPlaceholder = () => {
      switch (block.type) {
        case "heading1":
          return "제목 1";
        case "heading2":
          return "제목 2";
        case "heading3":
          return "제목 3";
        case "quote":
          return "인용문을 입력하세요...";
        case "code":
          return "코드를 입력하세요...";
        case "bulletList":
          return "목록 항목";
        case "numberedList":
          return "번호 목록 항목";
        default:
          return placeholder || "내용을 입력하세요...";
      }
    };

    const getClassName = () => {
      switch (block.type) {
        case "heading1":
          return `${baseClasses} text-3xl font-bold`;
        case "heading2":
          return `${baseClasses} text-2xl font-semibold`;
        case "heading3":
          return `${baseClasses} text-xl font-medium`;
        case "quote":
          return `${baseClasses} border-l-4 border-gray-300 pl-4 italic text-gray-700`;
        case "code":
          return `${baseClasses} font-mono text-sm bg-gray-100 p-3 rounded`;
        default:
          return baseClasses;
      }
    };

    return (
      <div className="group relative">
        {/* + 버튼 */}
        <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={() =>
              setShowBlockMenu(showBlockMenu === block.id ? null : block.id)
            }
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* 블록 내용 */}
        <div className="flex items-start gap-2">
          {block.type === "bulletList" && (
            <span className="text-gray-400 mt-2">•</span>
          )}
          {block.type === "numberedList" && (
            <span className="text-gray-400 mt-2">
              {
                blocks.filter(
                  (b, i) =>
                    i <= blocks.indexOf(block) && b.type === "numberedList"
                ).length
              }
              .
            </span>
          )}

          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            onKeyDown={(e) => handleKeyDown(e, block.id)}
            onFocus={() => setActiveBlockId(block.id)}
            placeholder={getPlaceholder()}
            className={getClassName()}
            rows={1}
            style={{
              resize: "none",
              overflow: "hidden",
              minHeight: "1.5rem",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
          />
        </div>

        {/* 블록 타입 메뉴 */}
        {showBlockMenu === block.id && (
          <div className="absolute top-8 left-0 z-50 bg-white border rounded-lg shadow-lg p-2 min-w-[200px]">
            {blockTypes.map((blockType) => (
              <button
                key={blockType.type}
                type="button"
                onClick={() => {
                  updateBlock(block.id, { type: blockType.type });
                  setShowBlockMenu(null);
                }}
                className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left"
              >
                <blockType.icon className="w-4 h-4" />
                <span className="text-sm">{blockType.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border border-gray-300 rounded-lg bg-white">
      {/* 간단한 툴바 */}
      <div className="border-b p-2 flex gap-1">
        <button type="button" className="p-2 hover:bg-gray-100 rounded">
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" className="p-2 hover:bg-gray-100 rounded">
          <Italic className="w-4 h-4" />
        </button>
        <button type="button" className="p-2 hover:bg-gray-100 rounded">
          <Link className="w-4 h-4" />
        </button>
      </div>

      {/* 에디터 */}
      <div className="p-4 space-y-3 min-h-[300px]">
        {blocks.map((block) => renderBlock(block))}

        <button
          type="button"
          onClick={() => addBlock(blocks[blocks.length - 1]?.id)}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-600 py-2"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">새 블록 추가</span>
        </button>
      </div>

      {/* 메뉴 닫기 */}
      {showBlockMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowBlockMenu(null)}
        />
      )}
    </div>
  );
}

// 메인 블로그 작성 페이지
export default function BlogWritePage() {
  const params = useParams();
  const router = useRouter();
  const userSlug = params?.slug as string;

  // 기본 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [postType, setPostType] = useState("BLOG");
  const [tags, setTags] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");

  // 발행 설정
  const [isPublic, setIsPublic] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");

  // 로딩 상태
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  // 권한 체크
  useEffect(() => {
    checkPermission();
  }, [userSlug]);

  const checkPermission = async () => {
    console.log("🔍 권한 체크 시작");

    const token = localStorage.getItem("access_token");
    console.log("🔑 토큰 확인:", token ? "있음" : "없음");

    if (!token) {
      console.log("❌ 토큰이 없어서 로그인 페이지로 이동");
      alert("로그인이 필요합니다.");
      router.push("/auth/login");
      return;
    }

    try {
      console.log("🌐 사용자 정보 요청 시작");
      const response = await fetch(`${backendUrl}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📡 응답 상태:", response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log("✅ 사용자 데이터:", userData);

        if (userData.slug !== userSlug) {
          console.log(`❌ 권한 없음: ${userData.slug} !== ${userSlug}`);
          alert("권한이 없습니다.");
          router.push(`/${userSlug}/blog`);
        } else {
          console.log("✅ 권한 확인 완료");
        }
      } else {
        console.log("❌ 응답 실패:", response.status);
        const errorData = await response.text();
        console.log("오류 내용:", errorData);

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          router.push("/auth/login");
        } else {
          alert("권한 확인 중 오류가 발생했습니다.");
        }
      }
    } catch (error) {
      console.error("❌ 권한 확인 실패:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
  };

  // 임시저장
  const handleSaveDraft = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    setIsSaving(true);
    const token = localStorage.getItem("access_token");

    try {
      const postData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || content.slice(0, 150) + "...",
        post_type: postType,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        featured_image: featuredImage.trim(),
        is_published: false,
        is_public: false,
        is_pinned: false,
      };

      const response = await fetch(`${backendUrl}/api/blog/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("임시저장이 완료되었습니다.");
        router.push(`/${userSlug}/blog/${result.id}`);
      } else {
        const error = await response.json();
        alert(`임시저장 실패: ${error.detail || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("임시저장 실패:", error);
      alert("임시저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 발행하기
  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsPublishing(true);
    const token = localStorage.getItem("access_token");

    try {
      const postData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || content.slice(0, 150) + "...",
        post_type: postType,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        featured_image: featuredImage.trim(),
        is_published: true,
        is_public: isPublic,
        is_pinned: isPinned && postType === "NOTICE",
        scheduled_date: scheduledDate || null,
      };

      const response = await fetch(`${backendUrl}/api/blog/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("발행이 완료되었습니다!");
        router.push(`/${userSlug}/blog/${result.id}`);
      } else {
        const error = await response.json();
        alert(`발행 실패: ${error.detail || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("발행 실패:", error);
      alert("발행 중 오류가 발생했습니다.");
    } finally {
      setIsPublishing(false);
      setIsPublishModalOpen(false);
    }
  };

  // 포스트 타입별 색상
  const getTypeColor = (type: string) => {
    const colors = {
      BLOG: "bg-blue-100 text-blue-800",
      NOTICE: "bg-red-100 text-red-800",
      NEWS: "bg-green-100 text-green-800",
      EXHIBITION: "bg-purple-100 text-purple-800",
      AWARD: "bg-yellow-100 text-yellow-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold">새 글 작성</h1>
                <p className="text-sm text-gray-600">@{userSlug}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "저장중..." : "임시저장"}
              </button>

              <button
                onClick={() => setIsPublishModalOpen(true)}
                disabled={isPublishing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Eye className="w-4 h-4" />
                {isPublishing ? "발행중..." : "발행하기"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          {/* 포스트 타입 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              카테고리
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "BLOG", label: "블로그" },
                { value: "NOTICE", label: "공지사항" },
                { value: "NEWS", label: "뉴스" },
                { value: "EXHIBITION", label: "전시" },
                { value: "AWARD", label: "수상" },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setPostType(type.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    postType === type.value
                      ? getTypeColor(type.value)
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="제목을 입력하세요..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl font-bold placeholder-gray-400 border-none outline-none bg-transparent resize-none"
              maxLength={100}
            />
            <div className="text-sm text-gray-400 mt-2">{title.length}/100</div>
          </div>

          {/* 요약 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              요약 (선택사항)
            </label>
            <textarea
              placeholder="글의 요약을 입력하세요..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full h-20 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={200}
            />
            <div className="text-sm text-gray-400 mt-1">
              {excerpt.length}/200 (비어있으면 본문에서 자동 생성)
            </div>
          </div>

          {/* 태그 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Hash className="w-4 h-4 inline mr-1" />
              태그
            </label>
            <input
              type="text"
              placeholder="태그를 쉼표로 구분하여 입력하세요... (예: 예술, 전시회, 현대미술)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 대표 이미지 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              대표 이미지 URL (선택사항)
            </label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {featuredImage && (
              <div className="mt-3">
                <img
                  src={featuredImage}
                  alt="대표 이미지 미리보기"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* 본문 - 노션 스타일 에디터 */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              본문
            </label>
            <SimpleNotionEditor
              value={content}
              onChange={setContent}
              placeholder="내용을 입력하세요..."
            />
            <div className="text-sm text-gray-400 mt-2">
              글자 수: {content.length}
            </div>
          </div>
        </div>
      </div>

      {/* 발행 설정 모달 */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">발행 설정</h3>

            {/* 공개 설정 */}
            <div className="mb-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  {isPublic ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                  <span className="font-medium">공개 포스트</span>
                </div>
              </label>
              <p className="text-sm text-gray-600 ml-7">
                체크하면 모든 사용자가 볼 수 있습니다.
              </p>
            </div>

            {/* 핀 고정 (공지사항만) */}
            {postType === "NOTICE" && (
              <div className="mb-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <Pin className="w-4 h-4" />
                    <span className="font-medium">상단 고정</span>
                  </div>
                </label>
                <p className="text-sm text-gray-600 ml-7">
                  공지사항을 목록 최상단에 고정합니다.
                </p>
              </div>
            )}

            {/* 예약 발행 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                예약 발행 (선택사항)
              </label>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-sm text-gray-600 mt-1">
                비어있으면 즉시 발행됩니다.
              </p>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isPublishing ? "발행중..." : "발행하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
