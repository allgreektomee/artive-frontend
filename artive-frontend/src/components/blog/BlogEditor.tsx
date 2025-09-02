"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useState, useCallback, useEffect } from "react";
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
  Image as ImageIcon,
  Code,
  Undo,
  Redo,
  Upload,
  Loader2,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BlogEditor({ value, onChange }: BlogEditorProps) {
  const [isUploading, setIsUploading] = useState(false);

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
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg shadow-md max-w-full h-auto my-4",
        },
      }),
      Placeholder.configure({
        placeholder: "내용을 입력하세요...", // 수정: 간단하게 변경
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-3",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);
  // 이미지 업로드 처리
  const handleImageUpload = async (file: File) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

      const response = await fetch(`${backendUrl}/api/upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.url || data.file_url || data.display_url;
        editor?.chain().focus().setImage({ src: imageUrl }).run();
      } else {
        // ❌ base64 사용하지 말고 에러 처리
        alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        console.error("업로드 실패:", await response.text());
      }
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  const addLink = useCallback(() => {
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
  }, [editor]);

  const setAlignment = (align: string) => {
    editor?.chain().focus().setTextAlign(align).run();
  };

  if (!editor) {
    return (
      <div className="border border-gray-200 rounded-lg p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* 툴바 */}
      <div className="border-b border-gray-200 p-2 flex items-center gap-1 flex-wrap bg-gray-50">
        {/* 텍스트 스타일 */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("bold") ? "bg-gray-200" : ""
            }`}
            title="굵게 (Ctrl+B)"
          >
            <Bold size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("italic") ? "bg-gray-200" : ""
            }`}
            title="기울임 (Ctrl+I)"
          >
            <Italic size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("code") ? "bg-gray-200" : ""
            }`}
            title="코드"
          >
            <Code size={18} />
          </button>
        </div>

        {/* 제목 */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
            }`}
            title="제목 1"
          >
            <Heading1 size={18} />
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
            }`}
            title="제목 2"
          >
            <Heading2 size={18} />
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
            }`}
            title="제목 3"
          >
            <Heading3 size={18} />
          </button>
        </div>

        {/* 리스트 */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("bulletList") ? "bg-gray-200" : ""
            }`}
            title="글머리 기호"
          >
            <List size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("orderedList") ? "bg-gray-200" : ""
            }`}
            title="번호 목록"
          >
            <ListOrdered size={18} />
          </button>
        </div>

        {/* 기타 */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("blockquote") ? "bg-gray-200" : ""
            }`}
            title="인용구"
          >
            <Quote size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("codeBlock") ? "bg-gray-200" : ""
            }`}
            title="코드 블록"
          >
            <Code size={18} />
          </button>
          <button
            type="button"
            onClick={addLink}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("link") ? "bg-gray-200" : ""
            }`}
            title="링크"
          >
            <LinkIcon size={18} />
          </button>
        </div>

        {/* 이미지 업로드 */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <label
            className="p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors"
            title="이미지 업로드"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              disabled={isUploading}
            />
            {isUploading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ImageIcon size={18} />
            )}
          </label>
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="구분선"
          >
            <Minus size={18} />
          </button>
        </div>

        {/* 실행 취소/다시 실행 */}
        <div className="flex items-center gap-1 px-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
            title="실행 취소 (Ctrl+Z)"
          >
            <Undo size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
            title="다시 실행 (Ctrl+Y)"
          >
            <Redo size={18} />
          </button>
        </div>
      </div>

      {/* 에디터 본문 - 수정된 부분 */}
      <div className="relative">
        <EditorContent
          editor={editor}
          className="[&_.ProseMirror]:min-h-[400px] [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3 [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none"
        />
      </div>

      {/* 하단 정보 */}
      <div className="border-t border-gray-200 px-4 py-2 text-sm text-gray-500 bg-gray-50">
        <span>Tip: 이미지를 드래그 앤 드롭하거나 붙여넣기할 수 있습니다</span>
      </div>
    </div>
  );
}
