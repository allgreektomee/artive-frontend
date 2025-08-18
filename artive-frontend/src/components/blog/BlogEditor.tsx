"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { lowlight } from "lowlight";
import { useState, useEffect, useCallback } from "react";
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
  Type,
  Minus,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Hash,
} from "lucide-react";

interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BlogEditor({ value, onChange }: BlogEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [tableOfContents, setTableOfContents] = useState<any[]>([]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
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
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            const level = node.attrs.level;
            if (level === 1) return "제목 1";
            if (level === 2) return "제목 2";
            if (level === 3) return "제목 3";
          }
          return "내용을 입력하거나 '/'를 눌러 명령어를 사용하세요...";
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class:
            "bg-gray-900 text-gray-100 rounded-lg p-4 my-4 overflow-x-auto",
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      updateTableOfContents();
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[500px] px-8 py-4",
      },
      handleKeyDown: (view, event) => {
        // 슬래시 명령어
        if (event.key === "/") {
          const { from } = view.state.selection;
          const coords = view.coordsAtPos(from);
          setSlashMenuPosition({ x: coords.left, y: coords.top + 25 });
          setShowSlashMenu(true);
          return false;
        }
        // ESC로 메뉴 닫기
        if (event.key === "Escape") {
          setShowSlashMenu(false);
          return false;
        }
        return false;
      },
    },
  });

  // 목차 업데이트
  const updateTableOfContents = useCallback(() => {
    if (!editor) return;

    const headings: any[] = [];
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === "heading") {
        const level = node.attrs.level;
        const text = node.textContent;
        headings.push({ level, text, pos });
      }
    });
    setTableOfContents(headings);
  }, [editor]);

  // 이미지 업로드 처리
  const handleImageUpload = async (file: File) => {
    setIsUploading(true);

    // 실제로는 서버에 업로드하고 URL을 받아와야 함
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      editor?.chain().focus().setImage({ src: url }).run();
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const insertCommand = (command: string) => {
    if (!editor) return;

    switch (command) {
      case "heading1":
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case "heading2":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "heading3":
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case "bullet":
        editor.chain().focus().toggleBulletList().run();
        break;
      case "ordered":
        editor.chain().focus().toggleOrderedList().run();
        break;
      case "quote":
        editor.chain().focus().toggleBlockquote().run();
        break;
      case "code":
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case "divider":
        editor.chain().focus().setHorizontalRule().run();
        break;
      case "table":
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run();
        break;
    }
    setShowSlashMenu(false);
  };

  const addLink = useCallback(() => {
    const url = window.prompt("URL을 입력하세요:");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* 툴바 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-2 flex items-center gap-1 flex-wrap">
        {/* 텍스트 스타일 */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("bold") ? "bg-gray-200" : ""
            }`}
            title="굵게"
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("italic") ? "bg-gray-200" : ""
            }`}
            title="기울임"
          >
            <Italic size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("code") ? "bg-gray-200" : ""
            }`}
            title="인라인 코드"
          >
            <Code size={18} />
          </button>
        </div>

        {/* 제목 */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
            }`}
            title="제목 1"
          >
            <Heading1 size={18} />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
            }`}
            title="제목 2"
          >
            <Heading2 size={18} />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`p-2 rounded hover:bg-gray-100 ${
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
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("bulletList") ? "bg-gray-200" : ""
            }`}
            title="글머리 기호"
          >
            <List size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
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
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("blockquote") ? "bg-gray-200" : ""
            }`}
            title="인용구"
          >
            <Quote size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("codeBlock") ? "bg-gray-200" : ""
            }`}
            title="코드 블록"
          >
            <Code size={18} />
          </button>
          <button
            onClick={addLink}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("link") ? "bg-gray-200" : ""
            }`}
            title="링크"
          >
            <LinkIcon size={18} />
          </button>
          <button
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            className="p-2 rounded hover:bg-gray-100"
            title="표 삽입"
          >
            <TableIcon size={18} />
          </button>
        </div>

        {/* 이미지 업로드 */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <label
            className="p-2 rounded hover:bg-gray-100 cursor-pointer"
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
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded hover:bg-gray-100"
            title="구분선"
          >
            <Minus size={18} />
          </button>
        </div>

        {/* 실행 취소/다시 실행 */}
        <div className="flex items-center gap-1 px-2">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-100"
            title="실행 취소"
          >
            <Undo size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-100"
            title="다시 실행"
          >
            <Redo size={18} />
          </button>
        </div>
      </div>

      {/* 에디터 본문 */}
      <div className="relative">
        <EditorContent editor={editor} />

        {/* 슬래시 메뉴 */}
        {showSlashMenu && (
          <div
            className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20"
            style={{ left: slashMenuPosition.x, top: slashMenuPosition.y }}
          >
            <button
              onClick={() => insertCommand("heading1")}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded text-left"
            >
              <Heading1 size={16} />
              <span>제목 1</span>
            </button>
            <button
              onClick={() => insertCommand("heading2")}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded text-left"
            >
              <Heading2 size={16} />
              <span>제목 2</span>
            </button>
            <button
              onClick={() => insertCommand("heading3")}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded text-left"
            >
              <Heading3 size={16} />
              <span>제목 3</span>
            </button>
            <button
              onClick={() => insertCommand("bullet")}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded text-left"
            >
              <List size={16} />
              <span>글머리 기호</span>
            </button>
            <button
              onClick={() => insertCommand("ordered")}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded text-left"
            >
              <ListOrdered size={16} />
              <span>번호 목록</span>
            </button>
            <button
              onClick={() => insertCommand("quote")}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded text-left"
            >
              <Quote size={16} />
              <span>인용구</span>
            </button>
            <button
              onClick={() => insertCommand("code")}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded text-left"
            >
              <Code size={16} />
              <span>코드 블록</span>
            </button>
            <button
              onClick={() => insertCommand("divider")}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded text-left"
            >
              <Minus size={16} />
              <span>구분선</span>
            </button>
            <button
              onClick={() => insertCommand("table")}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded text-left"
            >
              <TableIcon size={16} />
              <span>표</span>
            </button>
          </div>
        )}
      </div>

      {/* 목차 (제목이 있을 때만 표시) */}
      {tableOfContents.length > 0 && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <Hash size={16} />
            <span className="font-semibold text-sm">목차</span>
          </div>
          <div className="space-y-1">
            {tableOfContents.map((heading, index) => (
              <button
                key={index}
                onClick={() => {
                  editor.commands.setTextSelection(heading.pos);
                  editor.commands.focus();
                }}
                className={`block w-full text-left text-sm hover:text-blue-600 ${
                  heading.level === 1
                    ? "pl-0"
                    : heading.level === 2
                    ? "pl-4"
                    : "pl-8"
                }`}
              >
                {heading.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
