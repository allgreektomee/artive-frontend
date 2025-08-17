// components/blog/BlogEditor.jsx
"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useState } from "react";
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
} from "lucide-react";

export default function BlogEditor({ value, onChange }) {
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false, // SSR 문제 해결
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      Image,
    ],
    content: value,
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

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("URL을 입력하세요:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    // 숨겨진 파일 input 생성
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // 파일 크기 체크 (10MB - 백엔드와 일치)
      if (file.size > 10 * 1024 * 1024) {
        alert("이미지 크기는 10MB 이하여야 합니다.");
        return;
      }

      setIsUploading(true);
      try {
        // FormData 생성
        const formData = new FormData();
        formData.append("file", file);

        // 백엔드에 업로드 - 먼저 /api/upload/image 시도, 실패하면 /api/upload
        let response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload/image`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: formData,
          }
        );

        // 첫 번째 엔드포인트가 404면 두 번째 시도
        if (response.status === 404) {
          response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
              body: formData,
            }
          );
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error("업로드 응답 오류:", errorText);
          throw new Error("이미지 업로드 실패");
        }

        const data = await response.json();
        const imageUrl = data.url || data.file_url; // 두 필드 모두 체크

        // 에디터에 이미지 삽입
        editor.chain().focus().setImage({ src: imageUrl }).run();
      } catch (error) {
        console.error("이미지 업로드 오류:", error);
        alert("이미지 업로드에 실패했습니다.");
      } finally {
        setIsUploading(false);
      }
    };
    input.click();
  };

  // URL로 이미지 추가하는 별도 함수
  const addImageByUrl = () => {
    const url = window.prompt("이미지 URL을 입력하세요:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* 에디터 CSS 스타일 */}
      <style jsx global>{`
        /* 에디터 내부 스타일 */
        .ProseMirror {
          min-height: 400px;
          padding: 1rem;
          font-size: 16px;
          line-height: 1.6;
        }

        .ProseMirror:focus {
          outline: none;
        }

        /* Heading 스타일 */
        .ProseMirror h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        /* 기본 요소 스타일 */
        .ProseMirror p {
          margin-bottom: 1rem;
        }

        .ProseMirror strong {
          font-weight: bold;
        }

        .ProseMirror em {
          font-style: italic;
        }

        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .ProseMirror li {
          margin-bottom: 0.25rem;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          font-style: italic;
          color: #6b7280;
          margin: 1rem 0;
        }

        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.9em;
        }

        .ProseMirror pre {
          background-color: #1f2937;
          color: white;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
          font-family: monospace;
        }

        .ProseMirror pre code {
          background: none;
          padding: 0;
          color: white;
        }

        .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
          cursor: pointer;
        }

        .ProseMirror a:hover {
          color: #2563eb;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        /* 플레이스홀더 */
        .ProseMirror.ProseMirror-empty::before {
          content: "내용을 입력하세요...";
          color: #9ca3af;
          float: left;
          height: 0;
          pointer-events: none;
        }

        /* 선택 영역 */
        .ProseMirror ::selection {
          background-color: #bfdbfe;
        }
      `}</style>

      {/* 툴바 */}
      <div className="border-b bg-gray-50 p-2 flex items-center gap-1 flex-wrap">
        {/* Heading 버튼들 */}
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
          }`}
          title="제목 1"
        >
          <Heading1 className="w-5 h-5" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
          }`}
          title="제목 2"
        >
          <Heading2 className="w-5 h-5" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
          }`}
          title="제목 3"
        >
          <Heading3 className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* 텍스트 스타일 */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("bold") ? "bg-gray-200" : ""
          }`}
          title="굵게"
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
          title="기울임"
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("code") ? "bg-gray-200" : ""
          }`}
          title="코드"
        >
          <Code className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* 리스트 */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("bulletList") ? "bg-gray-200" : ""
          }`}
          title="글머리 기호"
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("orderedList") ? "bg-gray-200" : ""
          }`}
          title="번호 매기기"
        >
          <ListOrdered className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("blockquote") ? "bg-gray-200" : ""
          }`}
          title="인용"
        >
          <Quote className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* 링크 & 이미지 */}
        <button
          onClick={addLink}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("link") ? "bg-gray-200" : ""
          }`}
          title="링크"
        >
          <LinkIcon className="w-5 h-5" />
        </button>
        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200 relative"
          title="이미지 업로드"
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  // 파일 크기 체크 (10MB - 백엔드와 일치)
                  if (file.size > 10 * 1024 * 1024) {
                    alert("이미지 크기는 10MB 이하여야 합니다.");
                    return;
                  }

                  setIsUploading(true);
                  try {
                    const formData = new FormData();
                    formData.append("file", file);

                    const response = await fetch(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`,
                      {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                          )}`,
                        },
                        body: formData,
                      }
                    );

                    if (!response.ok) throw new Error("업로드 실패");

                    const data = await response.json();
                    editor
                      .chain()
                      .focus()
                      .setImage({ src: data.file_url })
                      .run();
                  } catch (error) {
                    console.error("이미지 업로드 오류:", error);
                    alert("이미지 업로드에 실패했습니다.");
                  } finally {
                    setIsUploading(false);
                    e.target.value = ""; // input 초기화
                  }
                }}
              />
            </>
          )}
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* 실행 취소/다시 실행 */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded hover:bg-gray-200"
          disabled={!editor.can().undo()}
          title="실행 취소"
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-200"
          disabled={!editor.can().redo()}
          title="다시 실행"
        >
          <Redo className="w-5 h-5" />
        </button>
      </div>

      {/* 에디터 본문 */}
      <EditorContent editor={editor} />
    </div>
  );
}
