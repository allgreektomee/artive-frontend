"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  source: string;
  className?: string;
};

export function DevMarkdown({ source, className }: Props) {
  return (
    <article
      className={
        className ??
        "prose prose-zinc max-w-none prose-headings:scroll-mt-20 prose-pre:rounded-lg prose-pre:bg-zinc-100 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none"
      }
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
    </article>
  );
}
