import { notFound, redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ part: string }>;
};

/** 예전 `/dev/js/1` 형태 → `/dev?tab=js&outline=1` */
export default async function DevJsPartLegacyRedirect({ params }: PageProps) {
  const { part } = await params;
  if (part === "1" || part === "2" || part === "3") {
    redirect(`/dev?tab=js&outline=${part}`);
  }
  notFound();
}
