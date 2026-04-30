import fs from "node:fs";
import path from "node:path";

const OUTLINE_PATH = path.join(
  process.cwd(),
  "content",
  "dev",
  "js-blog-es6-outline.md"
);

const JAVASCRIPT_CONTENT_DIR = path.join(
  process.cwd(),
  "content",
  "dev",
  "javascript"
);

const JAVASCRIPT_PARTS = [
  { id: 1, slug: "part-1-basics", title: "JavaScript 기본기" },
  {
    id: 2,
    slug: "part-2-standard-library",
    title: "표준 라이브러리와 고급 문법",
  },
  {
    id: 3,
    slug: "part-3-runtime-and-tools",
    title: "실행 환경과 실무 JavaScript",
  },
] as const;

export type OutlinePart = {
  id: 1 | 2 | 3;
  headingLine: string;
  body: string;
};

export type JavaScriptPartSlug = (typeof JAVASCRIPT_PARTS)[number]["slug"];

export type JavaScriptArticle = {
  partId: 1 | 2 | 3;
  partSlug: JavaScriptPartSlug;
  partTitle: string;
  slug: string;
  title: string;
  order: number;
  body: string;
  href: string;
};

export type JavaScriptArticleGroup = {
  id: 1 | 2 | 3;
  slug: JavaScriptPartSlug;
  title: string;
  articles: JavaScriptArticle[];
};

function findPartIndex(md: string, part: 1 | 2 | 3): number {
  const needle = `## ${part}부.`;
  const i = md.indexOf(needle);
  return i;
}

/** 현재 `##` 섹션 시작(start)이 속한 줄 다음부터, 다음 `\n## ` 섹션 직전까지 */
function endOfCurrentSection(md: string, start: number): number {
  const lineEnd = md.indexOf("\n", start);
  const searchFrom = lineEnd === -1 ? start : lineEnd;
  const idx = md.indexOf("\n## ", searchFrom);
  return idx === -1 ? md.length : idx;
}

export function readOutlineMarkdown(): string {
  return fs.readFileSync(OUTLINE_PATH, "utf8");
}

/** 시리즈 소개 등 1부 이전 블록 */
export function getPreamble(md: string): string {
  const i1 = findPartIndex(md, 1);
  if (i1 === -1) return md;
  return md.slice(0, i1).trimEnd();
}

export function getPart(md: string, part: 1 | 2 | 3): OutlinePart | null {
  const start = findPartIndex(md, part);
  if (start === -1) return null;

  const end = endOfCurrentSection(md, start);
  const block = md.slice(start, end).trim();
  const firstNl = block.indexOf("\n");
  const headingLine =
    firstNl === -1 ? block : block.slice(0, firstNl).trim();
  return { id: part, headingLine, body: block };
}

export function listParts(md: string): OutlinePart[] {
  return ([1, 2, 3] as const)
    .map((id) => getPart(md, id))
    .filter((p): p is OutlinePart => p != null);
}

function titleFromMarkdown(md: string, fallback: string): string {
  const heading = md
    .split("\n")
    .find((line) => line.startsWith("# ") && line.trim().length > 2);
  return heading?.replace(/^#\s+/, "").trim() || fallback;
}

function orderFromSlug(slug: string): number {
  const order = Number(slug.match(/^\d+/)?.[0]);
  return Number.isFinite(order) ? order : Number.MAX_SAFE_INTEGER;
}

function readArticlesForPart(
  part: (typeof JAVASCRIPT_PARTS)[number]
): JavaScriptArticle[] {
  const partDir = path.join(JAVASCRIPT_CONTENT_DIR, part.slug);
  if (!fs.existsSync(partDir)) return [];

  return fs
    .readdirSync(partDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .filter((entry) => entry.name !== "README.md")
    .map((entry) => {
      const slug = entry.name.replace(/\.md$/, "");
      const body = fs.readFileSync(path.join(partDir, entry.name), "utf8");

      return {
        partId: part.id,
        partSlug: part.slug,
        partTitle: part.title,
        slug,
        title: titleFromMarkdown(body, slug),
        order: orderFromSlug(slug),
        body,
        href: `/dev?tab=js&ps=${encodeURIComponent(part.slug)}&as=${encodeURIComponent(slug)}`,
      };
    })
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}

export function listJavaScriptArticleGroups(): JavaScriptArticleGroup[] {
  return JAVASCRIPT_PARTS.map((part) => ({
    ...part,
    articles: readArticlesForPart(part),
  }));
}

export function listJavaScriptArticles(): JavaScriptArticle[] {
  return listJavaScriptArticleGroups().flatMap((group) => group.articles);
}

export function getJavaScriptArticle(
  partSlug: string,
  articleSlug: string
): JavaScriptArticle | null {
  return (
    listJavaScriptArticles().find(
      (article) => article.partSlug === partSlug && article.slug === articleSlug
    ) ?? null
  );
}
