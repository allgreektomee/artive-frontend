// components/artworks/new/ArtworkBasicInfo.tsx
import React, { useState } from "react";
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
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Code,
  Undo,
  Redo,
  Youtube,
} from "lucide-react";

interface ArtworkBasicInfoProps {
  form: {
    title: string;
    description: string;
    medium: string;
    size: string;
    year: string;
    privacy: "public" | "private" | "unlisted";
  };
  onChange: (name: string, value: string) => void;
  loading?: boolean;
  onLinksChange?: (links: Array<{ title: string; url: string }>) => void;
  onYoutubeUrlsChange?: (urls: string[]) => void;
}

interface LinkItem {
  title: string;
  url: string;
}

const ArtworkBasicInfo: React.FC<ArtworkBasicInfoProps> = ({
  form,
  onChange,
  loading = false,
  onLinksChange, // ✅ props에서 받기
  onYoutubeUrlsChange, // ✅ props에서 받기
}) => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [youtubeUrls, setYoutubeUrls] = useState<string[]>([]);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [newLink, setNewLink] = useState<LinkItem>({ title: "", url: "" });
  const [newYoutubeUrl, setNewYoutubeUrl] = useState("");

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
    content: form.description || "",
    onUpdate: ({ editor }) => {
      onChange("description", editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3",
      },
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  // ✅ 링크 추가 - 수정됨
  const addLink = () => {
    if (newLink.url) {
      const updatedLinks = [...links, newLink];
      setLinks(updatedLinks);
      onLinksChange?.(updatedLinks); // 부모로 전달
      setNewLink({ title: "", url: "" });
      setShowLinkInput(false);
    }
  };

  // ✅ 유튜브 추가 - 수정됨
  const addYoutube = () => {
    if (newYoutubeUrl && isValidYoutubeUrl(newYoutubeUrl)) {
      const updatedUrls = [...youtubeUrls, newYoutubeUrl];
      setYoutubeUrls(updatedUrls);
      onYoutubeUrlsChange?.(updatedUrls); // 부모로 전달
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

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">기본 정보</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 작품 제목 */}
        <div className="md:col-span-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            작품 제목 *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            placeholder="작품의 제목을 입력하세요"
          />
        </div>

        {/* 매체 */}
        <div>
          <label
            htmlFor="medium"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            매체
          </label>
          <input
            type="text"
            id="medium"
            name="medium"
            value={form.medium}
            onChange={handleChange}
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            placeholder="예: 유화, 수채화, 디지털"
          />
        </div>

        {/* 크기 */}
        <div>
          <label
            htmlFor="size"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            크기
          </label>
          <input
            type="text"
            id="size"
            name="size"
            value={form.size}
            onChange={handleChange}
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            placeholder="예: 100x80cm, 24x36in"
          />
        </div>

        {/* 제작연도 */}
        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            제작연도
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={form.year}
            onChange={handleChange}
            disabled={loading}
            min="1900"
            max={new Date().getFullYear() + 10}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>

        {/* 공개 설정 */}
        <div>
          <label
            htmlFor="privacy"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            공개 설정
          </label>
          <select
            id="privacy"
            name="privacy"
            value={form.privacy}
            onChange={handleChange}
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="public">공개</option>
            <option value="unlisted">링크를 아는 사람만</option>
            <option value="private">비공개</option>
          </select>
        </div>

        {/* 작품 설명 - Tiptap 에디터 */}
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              작품 설명
            </label>
            <span className="text-xs text-gray-500">
              {form.description.length}/5000자
            </span>
          </div>

          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            {/* 툴바 */}
            <div className="border-b border-gray-200 bg-gray-50 p-2 flex items-center gap-1 flex-wrap">
              {/* 텍스트 스타일 */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
                    editor?.isActive("bold") ? "bg-gray-200" : ""
                  }`}
                  title="굵게"
                  disabled={loading}
                >
                  <Bold size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
                    editor?.isActive("italic") ? "bg-gray-200" : ""
                  }`}
                  title="기울임"
                  disabled={loading}
                >
                  <Italic size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleCode().run()}
                  className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
                    editor?.isActive("code") ? "bg-gray-200" : ""
                  }`}
                  title="코드"
                  disabled={loading}
                >
                  <Code size={16} />
                </button>
              </div>

              {/* 구분선 */}
              <div className="w-px h-6 bg-gray-300 mx-1" />

              {/* 제목 */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  className={`px-2 py-1.5 rounded hover:bg-gray-200 transition-colors ${
                    editor?.isActive("heading", { level: 1 })
                      ? "bg-gray-200"
                      : ""
                  }`}
                  title="제목 1"
                  disabled={loading}
                >
                  <span className="text-sm font-bold">H₁</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  className={`px-2 py-1.5 rounded hover:bg-gray-200 transition-colors ${
                    editor?.isActive("heading", { level: 2 })
                      ? "bg-gray-200"
                      : ""
                  }`}
                  title="제목 2"
                  disabled={loading}
                >
                  <span className="text-sm font-bold">H₂</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  className={`px-2 py-1.5 rounded hover:bg-gray-200 transition-colors ${
                    editor?.isActive("heading", { level: 3 })
                      ? "bg-gray-200"
                      : ""
                  }`}
                  title="제목 3"
                  disabled={loading}
                >
                  <span className="text-sm font-bold">H₃</span>
                </button>
              </div>

              {/* 구분선 */}
              <div className="w-px h-6 bg-gray-300 mx-1" />

              {/* 리스트 */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                  className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
                    editor?.isActive("bulletList") ? "bg-gray-200" : ""
                  }`}
                  title="글머리 기호"
                  disabled={loading}
                >
                  <List size={16} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                  className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
                    editor?.isActive("orderedList") ? "bg-gray-200" : ""
                  }`}
                  title="번호 목록"
                  disabled={loading}
                >
                  <ListOrdered size={16} />
                </button>
              </div>

              {/* 구분선 */}
              <div className="w-px h-6 bg-gray-300 mx-1" />

              {/* 기타 */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    editor?.chain().focus().toggleBlockquote().run()
                  }
                  className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
                    editor?.isActive("blockquote") ? "bg-gray-200" : ""
                  }`}
                  title="인용구"
                  disabled={loading}
                >
                  <Quote size={16} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor?.chain().focus().toggleCodeBlock().run()
                  }
                  className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
                    editor?.isActive("codeBlock") ? "bg-gray-200" : ""
                  }`}
                  title="코드 블록"
                  disabled={loading}
                >
                  <Code size={16} />
                </button>
                <button
                  type="button"
                  onClick={addLinkToEditor}
                  className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
                    editor?.isActive("link") ? "bg-gray-200" : ""
                  }`}
                  title="링크"
                  disabled={loading}
                >
                  <LinkIcon size={16} />
                </button>
              </div>

              {/* 구분선 */}
              <div className="w-px h-6 bg-gray-300 mx-1" />

              {/* 추가 링크/유튜브 */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowLinkInput(!showLinkInput);
                    setShowYoutubeInput(false);
                  }}
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
                  title="외부 링크 추가"
                  disabled={loading}
                >
                  <FaLink className="text-gray-600" size={14} />
                  <span className="text-xs hidden sm:inline">링크</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowYoutubeInput(!showYoutubeInput);
                    setShowLinkInput(false);
                  }}
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
                  title="유튜브 추가"
                  disabled={loading}
                >
                  <FaYoutube className="text-gray-600" size={14} />
                  <span className="text-xs hidden sm:inline">유튜브</span>
                </button>
              </div>

              {/* 실행 취소/다시 실행 */}
              <div className="flex items-center gap-1 ml-auto">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().undo().run()}
                  disabled={!editor?.can().undo() || loading}
                  className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
                  title="실행 취소"
                >
                  <Undo size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().redo().run()}
                  disabled={!editor?.can().redo() || loading}
                  className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
                  title="다시 실행"
                >
                  <Redo size={16} />
                </button>
              </div>
            </div>

            {/* 링크 입력 팝업 */}
            {showLinkInput && (
              <div className="p-3 bg-blue-50 border-b border-gray-200">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="링크 제목 (선택)"
                      value={newLink.title}
                      onChange={(e) =>
                        setNewLink({ ...newLink, title: e.target.value })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newLink.url}
                      onChange={(e) =>
                        setNewLink({ ...newLink, url: e.target.value })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={addLink}
                      className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      추가
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLinkInput(false);
                        setNewLink({ title: "", url: "" });
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 유튜브 입력 팝업 */}
            {showYoutubeInput && (
              <div className="p-3 bg-red-50 border-b border-gray-200">
                <div className="flex flex-col gap-2">
                  <input
                    type="url"
                    placeholder="유튜브 URL (예: https://youtube.com/watch?v=...)"
                    value={newYoutubeUrl}
                    onChange={(e) => setNewYoutubeUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={addYoutube}
                      className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      추가
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowYoutubeInput(false);
                        setNewYoutubeUrl("");
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 에디터 본문 */}
            <EditorContent
              editor={editor}
              className="[&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:max-h-[400px] [&_.ProseMirror]:overflow-y-auto [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3 [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none"
            />

            {/* 추가된 링크 목록 */}
            {links.length > 0 && (
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-2">
                  추가된 링크
                </p>
                <div className="space-y-2">
                  {links.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-2 rounded border border-gray-200"
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline truncate flex-1"
                      >
                        {link.title || link.url}
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedLinks = links.filter(
                            (_, i) => i !== index
                          );
                          setLinks(updatedLinks);
                          onLinksChange?.(updatedLinks); // ✅ 부모로 전달
                        }}
                        className="ml-2 text-red-500 hover:text-red-700 p-1"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 추가된 유튜브 목록 */}
            {youtubeUrls.length > 0 && (
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-2">
                  추가된 유튜브
                </p>
                <div className="space-y-2">
                  {youtubeUrls.map((url, index) => {
                    const videoId = getYoutubeId(url);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white p-2 rounded border border-gray-200"
                      >
                        <div className="flex items-center space-x-2 flex-1">
                          <FaYoutube className="text-red-500" />
                          <span className="text-sm truncate">
                            {videoId || url}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedUrls = youtubeUrls.filter(
                              (_, i) => i !== index
                            );
                            setYoutubeUrls(updatedUrls);
                            onYoutubeUrlsChange?.(updatedUrls); // ✅ 부모로 전달
                          }}
                          className="ml-2 text-red-500 hover:text-red-700 p-1"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 도움말 */}
          <p className="text-xs text-gray-500">
            작품 설명은 구매자가 작품을 이해하는 데 중요한 정보입니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArtworkBasicInfo;
