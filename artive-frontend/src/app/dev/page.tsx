import { Suspense } from "react";
import { DevDocsShell } from "@/components/dev/DevDocsShell";
import {
  getPreamble,
  listJavaScriptArticleGroups,
  listJavaScriptArticles,
  listParts,
  readOutlineMarkdown,
} from "@/lib/dev-outline";

export default function DevPage() {
  const md = readOutlineMarkdown();
  const preamble = getPreamble(md);
  const parts = listParts(md);
  const articleGroups = listJavaScriptArticleGroups();
  const articles = listJavaScriptArticles();

  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-sm text-zinc-500">
          불러오는 중…
        </div>
      }
    >
      <DevDocsShell
        jsPreamble={preamble}
        jsParts={parts}
        jsArticleGroups={articleGroups}
        jsArticles={articles}
      />
    </Suspense>
  );
}
