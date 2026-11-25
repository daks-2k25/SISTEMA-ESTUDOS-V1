"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface TabItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface TabsProps {
  items: TabItem[];
  ariaLabel: string;
}

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Tabs({ items, ariaLabel }: TabsProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={ariaLabel} className="-mx-1 overflow-x-auto px-1 pb-1">
      <ul className="flex min-w-max gap-2">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400",
                  active
                    ? "border-transparent bg-linear-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-900/30"
                    : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                )}
              >
                <Icon aria-hidden className="size-4" />
                {item.label}
                {item.badge !== undefined && item.badge > 0 ? (
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
