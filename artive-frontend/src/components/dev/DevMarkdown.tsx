"use client";

import { Fragment } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { splitMarkdownByExecutionResults } from "@/lib/splitMarkdownByExecutionResults";

type Props = {
  source: string;
  className?: string;
  /** true면 `실행 결과:` 아래 출력 블록을 접었다가 펼칠 수 있게 한다 */
  collapseExecutionResults?: boolean;
};

const defaultArticleClass =
  "prose prose-zinc max-w-none prose-headings:scroll-mt-20 prose-pre:rounded-lg prose-pre:bg-zinc-100 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none";

function ExecutionResultBlock({
  code,
  info,
}: {
  code: string;
  info: string;
}) {
  return (
    <details className="group my-5 not-prose rounded-lg border border-zinc-200 bg-zinc-50/90 shadow-sm open:border-zinc-300 open:bg-white">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-zinc-700 marker:content-none [&::-webkit-details-marker]:hidden hover:bg-zinc-100/80 open:rounded-b-none">
        <span className="inline-flex items-center gap-2">
          <span
            className="text-zinc-400 transition-transform group-open:rotate-90"
            aria-hidden
          >
            ▸
          </span>
          실행 결과 보기
          {info ? (
            <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 text-xs font-normal text-zinc-600">
              {info}
            </code>
          ) : null}
        </span>
      </summary>
      <div className="border-t border-zinc-200 px-4 pb-4 pt-3">
        <pre className="overflow-x-auto rounded-md bg-zinc-100 p-4 text-sm leading-relaxed text-zinc-800">
          <code>{code.replace(/\s+$/, "")}</code>
        </pre>
      </div>
    </details>
  );
}

export function DevMarkdown({
  source,
  className,
  collapseExecutionResults = true,
}: Props) {
  const articleClass = className ?? defaultArticleClass;

  if (!collapseExecutionResults) {
    return (
      <article className={articleClass}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
      </article>
    );
  }

  const segments = splitMarkdownByExecutionResults(source);

  if (segments.length === 1 && segments[0].type === "markdown") {
    return (
      <article className={articleClass}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {segments[0].body}
        </ReactMarkdown>
      </article>
    );
  }

  return (
    <article className={articleClass}>
      {segments.map((seg, i) => (
        <Fragment key={i}>
          {seg.type === "markdown" ? (
            seg.body.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {seg.body}
              </ReactMarkdown>
            ) : null
          ) : (
            <ExecutionResultBlock code={seg.code} info={seg.info} />
          )}
        </Fragment>
      ))}
    </article>
  );
}
