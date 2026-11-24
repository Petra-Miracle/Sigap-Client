"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, MonitorDot } from "lucide-react";
import { cn } from "@/lib/format";
import { RealtimeIndicator } from "./RealtimeIndicator";

const LINKS = [
  { href: "/console", label: "Konsol Agen", icon: MonitorDot },
  { href: "/chat", label: "Simulator Chat", icon: MessageSquare },
  // Fase 5: /inbox dan /dashboard
];

/** Navigasi atas untuk halaman operasional (console, inbox, dashboard). */
export function AppNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-surface">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-4 py-2 lg:px-6">
        <Link href="/console" className="flex min-h-11 items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-control bg-accent font-display text-sm font-bold text-white shadow-sm">
            S
          </span>
          <span className="font-display text-base font-semibold tracking-tight">Sigap</span>
        </Link>
        <nav aria-label="Navigasi utama" className="flex flex-1 items-center gap-1 overflow-x-auto">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                target={href === "/chat" ? "_blank" : undefined}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-control px-3 text-sm font-medium",
                  active ? "bg-accent text-white shadow-sm" : "text-ink-2 hover:bg-canvas hover:text-ink",
                )}
              >
                <Icon aria-hidden className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <RealtimeIndicator />
      </div>
    </header>
  );
}
