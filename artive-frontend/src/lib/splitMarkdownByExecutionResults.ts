/**
 * 마크다운에서 `실행 결과:` 직후의 코드 펜스(보통 ```text)를 분리한다.
 * 블로그 글 관례: 코드 블록 다음에 "실행 결과:" 단락과 출력용 펜스가 온다.
 */

export type MarkdownSegment =
  | { type: "markdown"; body: string }
  | { type: "executionResult"; code: string; info: string };

/**
 * `(빈 줄)실행 결과:(빈 줄)```info\n...\n``` ` 패턴을 찾아 분할한다.
 * 앞 구간은 `markdown`, 결과 펜스만 `executionResult`로 둔다.
 */
export function splitMarkdownByExecutionResults(source: string): MarkdownSegment[] {
  const segments: MarkdownSegment[] = [];
  /** 이전 블록 끝과 `실행 결과:` 사이는 보통 빈 줄 1개 이상 */
  const re =
    /(?:^|[\r\n]{2,})실행 결과:\s*[\r\n]+\s*(```([^\r\n]*)[\r\n]([\s\S]*?)```)/g;

  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(source)) !== null) {
    if (m.index > lastIndex) {
      segments.push({
        type: "markdown",
        body: source.slice(lastIndex, m.index),
      });
    }
    segments.push({
      type: "executionResult",
      code: m[3] ?? "",
      info: (m[2] ?? "").trim(),
    });
    lastIndex = re.lastIndex;
  }

  if (lastIndex < source.length) {
    segments.push({
      type: "markdown",
      body: source.slice(lastIndex),
    });
  }

  return segments;
}
