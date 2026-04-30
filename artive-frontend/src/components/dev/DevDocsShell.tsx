"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DevMarkdown } from "@/components/dev/DevMarkdown";
import { cn } from "@/lib/utils";
import type {
  JavaScriptArticle,
  JavaScriptArticleGroup,
  OutlinePart,
} from "@/lib/dev-outline";

type TabId = "js" | "react" | "spring";

const TABS: { id: TabId; label: string }[] = [
  { id: "js", label: "JavaScript" },
  { id: "react", label: "React" },
  { id: "spring", label: "Spring" },
];

function excerptFromPartBody(body: string, maxLen = 220): string {
  const lines = body.split("\n").filter((l) => l.trim().length > 0);
  const skipHeading = lines[0]?.startsWith("##") ? lines.slice(1) : lines;
  const text = skipHeading.join(" ").replace(/\s+/g, " ").trim();
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen)}…`;
}

type Props = {
  jsPreamble: string;
  jsParts: OutlinePart[];
  jsArticles: JavaScriptArticle[];
  jsArticleGroups: JavaScriptArticleGroup[];
};

function parseTab(raw: string | null): TabId {
  if (raw === "react" || raw === "spring") return raw;
  return "js";
}

export function DevDocsShell({
  jsPreamble,
  jsParts,
  jsArticles,
  jsArticleGroups,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = parseTab(searchParams.get("tab"));
  const outlineRaw = searchParams.get("outline");
  const outlineId =
    outlineRaw === "1" || outlineRaw === "2" || outlineRaw === "3"
      ? (Number(outlineRaw) as 1 | 2 | 3)
      : null;
  const ps = searchParams.get("ps");
  const as = searchParams.get("as");

  const article = useMemo(() => {
    if (!ps || !as) return null;
    return (
      jsArticles.find((a) => a.partSlug === ps && a.slug === as) ?? null
    );
  }, [jsArticles, ps, as]);

  const outlineSection = useMemo(() => {
    if (!outlineId) return null;
    return jsParts.find((p) => p.id === outlineId) ?? null;
  }, [jsParts, outlineId]);

  const setQuery = useCallback(
    (next: Record<string, string | undefined>) => {
      const q = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(next)) {
        if (v === undefined || v === "") q.delete(k);
        else q.set(k, v);
      }
      const s = q.toString();
      router.replace(s ? `/dev?${s}` : "/dev", { scroll: false });
    },
    [router, searchParams]
  );

  const goHomeJs = useCallback(() => {
    setQuery({
      tab: "js",
      outline: undefined,
      ps: undefined,
      as: undefined,
    });
  }, [setQuery]);

  const onTab = (id: TabId) => {
    if (id === "js") {
      setQuery({
        tab: "js",
        outline: undefined,
        ps: undefined,
        as: undefined,
      });
    } else {
      setQuery({
        tab: id,
        outline: undefined,
        ps: undefined,
        as: undefined,
      });
    }
  };

  return (
    <div className="space-y-0">
      {/* K Docent / 에디토리얼형: 큰 제목 + 한 줄 소개 + 탭 */}
      <div className="border-b border-zinc-200 bg-white pb-6 pt-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
          Artive
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          학습 정리
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600">
          JavaScript·React·Spring을 한 페이지에서 탭으로 전환합니다. 주소
          쿼리로도 깊은 링크가 가능합니다.
        </p>

        <div
          className="mt-8 flex flex-wrap items-center gap-1 border-b border-zinc-200"
          role="tablist"
          aria-label="문서 종류"
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onTab(t.id)}
                className={cn(
                  "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-500 hover:text-zinc-800"
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-8">
        {tab === "react" ? (
          <PlaceholderPanel
            title="React"
            body="컴포넌트, 훅, 상태 관리 등 React 정리를 이 탭에 추가할 예정입니다."
          />
        ) : tab === "spring" ? (
          <PlaceholderPanel
            title="Spring"
            body="Spring Boot, 웹 MVC, JPA 등을 이 탭에 추가할 예정입니다."
          />
        ) : ps && as && !article ? (
          <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
            <p>요청한 글을 찾을 수 없습니다.</p>
            <button
              type="button"
              onClick={goHomeJs}
              className="font-medium underline underline-offset-2 hover:no-underline"
            >
              JavaScript 홈으로
            </button>
          </div>
        ) : article ? (
          <div className="space-y-6">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-zinc-600">
              <button
                type="button"
                onClick={goHomeJs}
                className="font-medium underline-offset-4 hover:text-zinc-900 hover:underline"
              >
                ← JavaScript 홈
              </button>
              <span className="text-zinc-300">·</span>
              <button
                type="button"
                onClick={() =>
                  setQuery({
                    tab: "js",
                    outline: String(article.partId),
                    ps: undefined,
                    as: undefined,
                  })
                }
                className="underline-offset-4 hover:text-zinc-900 hover:underline"
              >
                {article.partId}부. {article.partTitle}
              </button>
            </nav>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <DevMarkdown source={article.body} />
            </div>
          </div>
        ) : outlineSection ? (
          <div className="space-y-6">
            <nav className="text-sm">
              <button
                type="button"
                onClick={goHomeJs}
                className="font-medium text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline"
              >
                ← JavaScript 홈
              </button>
              <span className="mx-2 text-zinc-300">|</span>
              <span className="text-zinc-500">{outlineSection.headingLine}</span>
            </nav>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <DevMarkdown source={outlineSection.body} />
            </div>
          </div>
        ) : (
          <JavaScriptHome
            jsPreamble={jsPreamble}
            jsParts={jsParts}
            jsArticleGroups={jsArticleGroups}
            setQuery={setQuery}
          />
        )}
      </div>
    </div>
  );
}

function PlaceholderPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold text-zinc-900">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600">{body}</p>
    </div>
  );
}

function JavaScriptHome({
  jsPreamble,
  jsParts,
  jsArticleGroups,
  setQuery,
}: {
  jsPreamble: string;
  jsParts: OutlinePart[];
  jsArticleGroups: JavaScriptArticleGroup[];
  setQuery: (next: Record<string, string | undefined>) => void;
}) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          JavaScript ES6+ 시리즈 목차
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          저장소 내{" "}
          <code className="rounded bg-zinc-200 px-1 py-0.5 text-xs">
            content/dev/js-blog-es6-outline.md
          </code>
          를 기준으로 표시합니다.
        </p>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-zinc-800">시리즈 앞부분</h3>
        <div className="mt-3 text-sm text-zinc-700">
          <DevMarkdown source={jsPreamble} />
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          목차 (1 · 2 · 3부)
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {jsParts.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() =>
                setQuery({
                  tab: "js",
                  outline: String(p.id),
                  ps: undefined,
                  as: undefined,
                })
              }
              className="block h-full w-full text-left"
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{p.id}부</CardTitle>
                  <CardDescription className="line-clamp-3 text-zinc-600">
                    {p.headingLine.replace(/^##\s*\d+부\.\s*/, "")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs leading-relaxed text-zinc-500">
                    {excerptFromPartBody(p.body)}
                  </p>
                  <p className="mt-3 text-xs font-medium text-zinc-800">
                    전체 보기 →
                  </p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          작성된 콘텐츠
        </h3>
        <div className="space-y-4">
          {jsArticleGroups.map((group) => (
            <Card key={group.slug}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {group.id}부. {group.title}
                </CardTitle>
                <CardDescription>
                  {group.articles.length > 0
                    ? `${group.articles.length}개의 글`
                    : "아직 작성된 글이 없습니다."}
                </CardDescription>
              </CardHeader>
              {group.articles.length > 0 && (
                <CardContent className="pt-0">
                  <ol className="space-y-2">
                    {group.articles.map((article) => (
                      <li key={article.href}>
                        <Link
                          href={article.href}
                          className="flex items-baseline gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-zinc-100"
                          scroll={false}
                        >
                          <span className="shrink-0 font-mono text-xs text-zinc-400">
                            {String(article.order).padStart(2, "0")}
                          </span>
                          <span className="font-medium text-zinc-800">
                            {article.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
