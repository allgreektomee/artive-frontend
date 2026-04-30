import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DevMarkdown } from "@/components/dev/DevMarkdown";
import { listParts, readOutlineMarkdown, getPreamble } from "@/lib/dev-outline";

function excerptFromPartBody(body: string, maxLen = 220): string {
  const lines = body.split("\n").filter((l) => l.trim().length > 0);
  const skipHeading = lines[0]?.startsWith("##") ? lines.slice(1) : lines;
  const text = skipHeading.join(" ").replace(/\s+/g, " ").trim();
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen)}…`;
}

export default function DevIndexPage() {
  const md = readOutlineMarkdown();
  const preamble = getPreamble(md);
  const parts = listParts(md);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          JavaScript ES6+ 시리즈 목차
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          저장소 내 <code className="rounded bg-zinc-200 px-1 py-0.5 text-xs">content/dev/js-blog-es6-outline.md</code>
          를 기준으로 표시합니다. 본문은 아래 1·2·3부 카드에서 열 수 있습니다.
        </p>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-zinc-800">시리즈 앞부분</h2>
        <div className="mt-3 text-sm text-zinc-700">
          <DevMarkdown source={preamble} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          목차 (1 · 2 · 3부)
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {parts.map((p) => (
            <Link key={p.id} href={`/dev/${p.id}`} className="block h-full">
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
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
