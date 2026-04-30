import Link from "next/link";
import { notFound } from "next/navigation";
import { DevMarkdown } from "@/components/dev/DevMarkdown";
import { getPart, readOutlineMarkdown } from "@/lib/dev-outline";

type PageProps = {
  params: Promise<{ part: string }>;
};

export default async function DevPartPage({ params }: PageProps) {
  const { part: raw } = await params;
  const n = Number(raw);
  if (![1, 2, 3].includes(n)) notFound();

  const md = readOutlineMarkdown();
  const section = getPart(md, n as 1 | 2 | 3);
  if (!section) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link
          href="/dev"
          className="font-medium text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline"
        >
          ← 목차 카드
        </Link>
        <span className="text-zinc-300">|</span>
        <span className="text-zinc-500">{section.headingLine}</span>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <DevMarkdown source={section.body} />
      </div>
    </div>
  );
}
