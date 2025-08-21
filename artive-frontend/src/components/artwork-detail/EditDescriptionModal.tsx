// components/artwork-detail/EditDescriptionModal.tsx
import React, { useState, useEffect } from "react";
import { FaYoutube, FaLink, FaTrash } from "react-icons/fa";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  Link as LinkIcon,
} from "lucide-react";

interface EditDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    description: string;
    links: Array<{ title: string; url: string }>;
    youtube_urls: string[];
  }) => Promise<void>;
  currentData: {
    description: string;
    links?: Array<{ title: string; url: string }>;
    youtube_urls?: string[];
  };
  artworkTitle: string;
  loading?: boolean;
}

interface LinkItem {
  title: string;
  url: string;
}

const EditDescriptionModal: React.FC<EditDescriptionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentData,
  artworkTitle,
  loading = false,
}) => {
  const [links, setLinks] = useState<LinkItem[]>(currentData.links || []);
  const [youtubeUrls, setYoutubeUrls] = useState<string[]>(
    currentData.youtube_urls || []
  );
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [newLink, setNewLink] = useState<LinkItem>({ title: "", url: "" });
  const [newYoutubeUrl, setNewYoutubeUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tiptap 에디터 설정
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-700",
        },
      }),
      Placeholder.configure({
        placeholder: "작품에 대한 설명을 입력하세요...",
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
    ],
    content: currentData.description || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3",
      },
    },
  });

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, isSubmitting]);

  // 모달 열릴 때 데이터 초기화
  useEffect(() => {
    if (isOpen) {
      editor?.commands.setContent(currentData.description || "");
      setLinks(currentData.links || []);
      setYoutubeUrls(currentData.youtube_urls || []);
      setError(null);
    }
  }, [isOpen, currentData, editor]);

  // 링크 추가
  const addLink = () => {
    if (newLink.url) {
      setLinks([...links, newLink]);
      setNewLink({ title: "", url: "" });
      setShowLinkInput(false);
    }
  };

  // 유튜브 추가
  const addYoutube = () => {
    if (newYoutubeUrl && isValidYoutubeUrl(newYoutubeUrl)) {
      setYoutubeUrls([...youtubeUrls, newYoutubeUrl]);
      setNewYoutubeUrl("");
      setShowYoutubeInput(false);
    } else {
      alert("올바른 유튜브 URL을 입력해주세요.");
    }
  };

  // 유튜브 URL 검증
  const isValidYoutubeUrl = (url: string) => {
    return /(?:youtube\.com\/watch\?v=|youtu\.be\/)/.test(url);
  };

  // 유튜브 ID 추출
  const getYoutubeId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    return match ? match[1] : null;
  };

  // 에디터에 링크 추가
  const addLinkToEditor = () => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL을 입력하세요:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const description = editor?.getHTML() || "";

    if (description.length > 5000) {
      setError("설명은 5000자 이하여야 합니다.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        description,
        links,
        youtube_urls: youtubeUrls,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const hasChanges =
    editor?.getHTML() !== currentData.description ||
    JSON.stringify(links) !== JSON.stringify(currentData.links || []) ||
    JSON.stringify(youtubeUrls) !==
      JSON.stringify(currentData.youtube_urls || []);

  return (
    <div className="fixed inset-0 bg-white md:bg-black/50 md:flex md:items-center md:justify-center z-50 md:p-4">
      <div className="bg-white md:rounded-2xl w-full h-full md:h-auto md:max-w-5xl md:max-h-[90vh] flex flex-col">
        {/* Header - 모바일에서 더 컴팩트 */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-2.5 md:py-4 md:rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900">
                작품 설명 수정
              </h2>
              <p className="text-xs md:text-sm text-gray-500 truncate">
                {artworkTitle}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1.5 md:p-2 -mr-1.5 md:-mr-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content - 모바일에서 flex-1로 남은 공간 모두 사용 */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 mx-4 md:mx-6 mt-4 md:mt-6 mb-2 md:mb-4 flex-shrink-0">
                <p className="text-red-600 text-xs md:text-sm">{error}</p>
              </div>
            )}

            {/* Editor Container - 패딩을 여기에 적용하고 flex-1 */}
            <div className="flex-1 px-4 md:px-6 py-3 md:py-4 overflow-hidden">
              {/* Editor with Toolbar - 높이 100% */}
              <div className="border border-gray-300 rounded-lg bg-white h-full flex flex-col">
                {/* overflow-hidden 제거 */}
                {/* 툴바 - 모바일에서 스크롤 가능 */}
                <div className="border-b border-gray-200 bg-gray-50 p-1.5 md:p-2 flex items-center gap-1 overflow-x-auto flex-shrink-0">
                  {/* 텍스트 스타일 */}
                  <div className="flex items-center gap-0.5 md:gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={`p-1 md:p-1.5 rounded hover:bg-gray-200 transition-colors ${
                        editor?.isActive("bold") ? "bg-gray-200" : ""
                      }`}
                      title="굵게"
                      disabled={loading}
                    >
                      <Bold size={14} className="md:w-4 md:h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor?.chain().focus().toggleItalic().run()
                      }
                      className={`p-1 md:p-1.5 rounded hover:bg-gray-200 transition-colors ${
                        editor?.isActive("italic") ? "bg-gray-200" : ""
                      }`}
                      title="기울임"
                      disabled={loading}
                    >
                      <Italic size={14} className="md:w-4 md:h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleCode().run()}
                      className={`p-1 md:p-1.5 rounded hover:bg-gray-200 transition-colors ${
                        editor?.isActive("code") ? "bg-gray-200" : ""
                      }`}
                      title="코드"
                      disabled={loading}
                    >
                      <Code size={14} className="md:w-4 md:h-4" />
                    </button>
                  </div>

                  {/* 구분선 */}
                  <div className="w-px h-5 md:h-6 bg-gray-300 mx-0.5 md:mx-1 flex-shrink-0" />

                  {/* 제목 - 모바일에서 간소화 */}
                  <div className="flex items-center gap-0.5 md:gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleHeading({ level: 1 })
                          .run()
                      }
                      className={`px-1.5 md:px-2 py-1 md:py-1.5 rounded hover:bg-gray-200 transition-colors ${
                        editor?.isActive("heading", { level: 1 })
                          ? "bg-gray-200"
                          : ""
                      }`}
                      title="제목 1"
                      disabled={loading}
                    >
                      <span className="text-xs md:text-sm font-bold">H₁</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleHeading({ level: 2 })
                          .run()
                      }
                      className={`px-1.5 md:px-2 py-1 md:py-1.5 rounded hover:bg-gray-200 transition-colors ${
                        editor?.isActive("heading", { level: 2 })
                          ? "bg-gray-200"
                          : ""
                      }`}
                      title="제목 2"
                      disabled={loading}
                    >
                      <span className="text-xs md:text-sm font-bold">H₂</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleHeading({ level: 3 })
                          .run()
                      }
                      className={`px-1.5 md:px-2 py-1 md:py-1.5 rounded hover:bg-gray-200 transition-colors ${
                        editor?.isActive("heading", { level: 3 })
                          ? "bg-gray-200"
                          : ""
                      }`}
                      title="제목 3"
                      disabled={loading}
                    >
                      <span className="text-xs md:text-sm font-bold">H₃</span>
                    </button>
                  </div>

                  {/* 구분선 */}
                  <div className="w-px h-5 md:h-6 bg-gray-300 mx-0.5 md:mx-1 flex-shrink-0" />

                  {/* 리스트 */}
                  <div className="flex items-center gap-0.5 md:gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        editor?.chain().focus().toggleBulletList().run()
                      }
                      className={`p-1 md:p-1.5 rounded hover:bg-gray-200 transition-colors ${
                        editor?.isActive("bulletList") ? "bg-gray-200" : ""
                      }`}
                      title="글머리 기호"
                      disabled={loading}
                    >
                      <List size={14} className="md:w-4 md:h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor?.chain().focus().toggleOrderedList().run()
                      }
                      className={`p-1 md:p-1.5 rounded hover:bg-gray-200 transition-colors ${
                        editor?.isActive("orderedList") ? "bg-gray-200" : ""
                      }`}
                      title="번호 목록"
                      disabled={loading}
                    >
                      <ListOrdered size={14} className="md:w-4 md:h-4" />
                    </button>
                  </div>

                  {/* 구분선 */}
                  <div className="w-px h-5 md:h-6 bg-gray-300 mx-0.5 md:mx-1 flex-shrink-0" />

                  {/* 기타 */}
                  <div className="flex items-center gap-0.5 md:gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        editor?.chain().focus().toggleBlockquote().run()
                      }
                      className={`p-1 md:p-1.5 rounded hover:bg-gray-200 transition-colors ${
                        editor?.isActive("blockquote") ? "bg-gray-200" : ""
                      }`}
                      title="인용구"
                      disabled={loading}
                    >
                      <Quote size={14} className="md:w-4 md:h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={addLinkToEditor}
                      className={`p-1 md:p-1.5 rounded hover:bg-gray-200 transition-colors ${
                        editor?.isActive("link") ? "bg-gray-200" : ""
                      }`}
                      title="링크"
                      disabled={loading}
                    >
                      <LinkIcon size={14} className="md:w-4 md:h-4" />
                    </button>
                  </div>

                  {/* 구분선 */}
                  <div className="w-px h-5 md:h-6 bg-gray-300 mx-0.5 md:mx-1 flex-shrink-0" />

                  {/* 추가 링크/유튜브 */}
                  <div className="flex items-center gap-0.5 md:gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setShowLinkInput(!showLinkInput);
                        setShowYoutubeInput(false);
                      }}
                      className="p-1 md:p-1.5 rounded hover:bg-gray-200 transition-colors flex items-center gap-0.5 md:gap-1"
                      title="외부 링크 추가"
                      disabled={loading}
                    >
                      <FaLink className="text-gray-600" size={12} />
                      <span className="text-[10px] md:text-xs hidden sm:inline">
                        링크
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowYoutubeInput(!showYoutubeInput);
                        setShowLinkInput(false);
                      }}
                      className="p-1 md:p-1.5 rounded hover:bg-gray-200 transition-colors flex items-center gap-0.5 md:gap-1"
                      title="유튜브 추가"
                      disabled={loading}
                    >
                      <FaYoutube className="text-gray-600" size={12} />
                      <span className="text-[10px] md:text-xs hidden sm:inline">
                        유튜브
                      </span>
                    </button>
                  </div>

                  {/* 실행 취소/다시 실행 */}
                  <div className="flex items-center gap-0.5 md:gap-1 ml-auto flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().undo().run()}
                      disabled={!editor?.can().undo() || loading}
                      className="p-1 md:p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
                      title="실행 취소"
                    >
                      <Undo size={14} className="md:w-4 md:h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().redo().run()}
                      disabled={!editor?.can().redo() || loading}
                      className="p-1 md:p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
                      title="다시 실행"
                    >
                      <Redo size={14} className="md:w-4 md:h-4" />
                    </button>
                  </div>
                </div>

                {/* 링크 입력 팝업 */}
                {showLinkInput && (
                  <div className="p-2 md:p-3 bg-blue-50 border-b border-gray-200 flex-shrink-0">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="링크 제목 (선택)"
                          value={newLink.title}
                          onChange={(e) =>
                            setNewLink({ ...newLink, title: e.target.value })
                          }
                          className="flex-1 px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded text-xs md:text-sm"
                        />
                        <input
                          type="url"
                          placeholder="https://..."
                          value={newLink.url}
                          onChange={(e) =>
                            setNewLink({ ...newLink, url: e.target.value })
                          }
                          className="flex-1 px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded text-xs md:text-sm"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={addLink}
                          className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-500 text-white rounded text-xs md:text-sm hover:bg-blue-600"
                        >
                          추가
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowLinkInput(false);
                            setNewLink({ title: "", url: "" });
                          }}
                          className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-300 text-gray-700 rounded text-xs md:text-sm hover:bg-gray-400"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 유튜브 입력 팝업 */}
                {showYoutubeInput && (
                  <div className="p-2 md:p-3 bg-red-50 border-b border-gray-200 flex-shrink-0">
                    <div className="flex flex-col gap-2">
                      <input
                        type="url"
                        placeholder="유튜브 URL (예: https://youtube.com/watch?v=...)"
                        value={newYoutubeUrl}
                        onChange={(e) => setNewYoutubeUrl(e.target.value)}
                        className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded text-xs md:text-sm"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={addYoutube}
                          className="px-3 md:px-4 py-1.5 md:py-2 bg-red-500 text-white rounded text-xs md:text-sm hover:bg-red-600"
                        >
                          추가
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowYoutubeInput(false);
                            setNewYoutubeUrl("");
                          }}
                          className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-300 text-gray-700 rounded text-xs md:text-sm hover:bg-gray-400"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 에디터 본문 - flex-1로 남은 공간 모두 사용 */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <EditorContent
                    editor={editor}
                    className="h-full [&_.ProseMirror]:min-h-full [&_.ProseMirror]:px-3 md:[&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3 [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none"
                  />
                </div>

                {/* 추가된 링크/유튜브는 스크롤 영역 내에 포함 */}
                {(links.length > 0 || youtubeUrls.length > 0) && (
                  <div className="flex-shrink-0 max-h-[30vh] overflow-y-auto">
                    {/* 추가된 링크 목록 */}
                    {links.length > 0 && (
                      <div className="p-2 md:p-3 bg-gray-50 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-600 mb-1.5 md:mb-2">
                          추가된 링크
                        </p>
                        <div className="space-y-1.5 md:space-y-2">
                          {links.map((link, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-white p-1.5 md:p-2 rounded border border-gray-200"
                            >
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs md:text-sm text-blue-500 hover:underline truncate flex-1"
                              >
                                {link.title || link.url}
                              </a>
                              <button
                                type="button"
                                onClick={() =>
                                  setLinks(links.filter((_, i) => i !== index))
                                }
                                className="ml-2 text-red-500 hover:text-red-700 p-0.5 md:p-1"
                              >
                                <FaTrash size={10} className="md:w-3 md:h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 추가된 유튜브 목록 */}
                    {youtubeUrls.length > 0 && (
                      <div className="p-2 md:p-3 bg-gray-50 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-600 mb-1.5 md:mb-2">
                          추가된 유튜브
                        </p>
                        <div className="space-y-2">
                          {youtubeUrls.map((url, index) => {
                            const videoId = getYoutubeId(url);
                            return (
                              <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between bg-white p-1.5 md:p-2 rounded border border-gray-200">
                                  <div className="flex items-center space-x-2 flex-1">
                                    <FaYoutube
                                      className="text-red-500 flex-shrink-0"
                                      size={14}
                                    />
                                    <span className="text-xs md:text-sm truncate">
                                      {videoId || url}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setYoutubeUrls(
                                        youtubeUrls.filter(
                                          (_, i) => i !== index
                                        )
                                      )
                                    }
                                    className="ml-2 text-red-500 hover:text-red-700 p-0.5 md:p-1"
                                  >
                                    <FaTrash
                                      size={10}
                                      className="md:w-3 md:h-3"
                                    />
                                  </button>
                                </div>
                                {/* 유튜브 미리보기 - 모바일에서는 숨김 옵션 */}
                                {videoId && (
                                  <div
                                    className="hidden md:block relative w-full bg-black rounded-lg overflow-hidden"
                                    style={{ paddingBottom: "56.25%" }}
                                  >
                                    <iframe
                                      className="absolute top-0 left-0 w-full h-full"
                                      src={`https://www.youtube.com/embed/${videoId}`}
                                      title={`YouTube video ${index + 1}`}
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer - 모바일에서 간소화, 하단 고정 */}
        <div className="bg-white border-t border-gray-200 px-4 md:px-6 py-2.5 md:py-4 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="text-xs md:text-sm text-gray-500">
              {hasChanges && (
                <span className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-400 rounded-full"></span>
                  <span className="hidden md:inline">변경사항이 있습니다</span>
                  <span className="md:hidden">변경됨</span>
                </span>
              )}
            </div>

            <div className="flex space-x-2 md:space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 md:px-6 py-1.5 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm md:text-base"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={!hasChanges || isSubmitting}
                className="px-4 md:px-6 py-1.5 md:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 md:space-x-2 text-sm md:text-base"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-3 w-3 md:h-4 md:w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
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
                    <span>저장 중...</span>
                  </>
                ) : (
                  <span>저장</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDescriptionModal;
