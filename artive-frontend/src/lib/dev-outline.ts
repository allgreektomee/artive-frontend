import fs from "node:fs";
import path from "node:path";

const OUTLINE_PATH = path.join(
  process.cwd(),
  "content",
  "dev",
  "js-blog-es6-outline.md"
);

export type OutlinePart = {
  id: 1 | 2 | 3;
  headingLine: string;
  body: string;
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
