"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/dev/js", label: "JavaScript" },
  { href: "/dev/react", label: "React" },
  { href: "/dev/spring", label: "Spring" },
] as const;

export function DevTabNav() {
  const pathname = usePathname();

  return (
    <nav
      className="-mb-px flex gap-0.5"
      aria-label="학습 문서 탭"
    >
      {tabs.map((tab) => {
        const active =
          pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-t-md border border-b-0 px-4 py-2.5 text-sm font-medium transition-colors",
              active
                ? "relative z-[1] border-zinc-200 bg-white text-zinc-900"
                : "border-transparent text-zinc-500 hover:bg-zinc-100/90 hover:text-zinc-800"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
