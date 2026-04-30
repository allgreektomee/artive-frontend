import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ part: string; slug: string }>;
};

/** 예전 `/dev/js/part-1-basics/slug` → 쿼리 한 페이지로 */
export default async function DevJsArticleLegacyRedirect({ params }: PageProps) {
  const { part, slug } = await params;
  redirect(
    `/dev?tab=js&ps=${encodeURIComponent(part)}&as=${encodeURIComponent(slug)}`
  );
}
