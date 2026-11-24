import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { Card as HeroCard } from "@heroui/react";
import { cn } from "@/lib/format";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <HeroCard variant="default" className={cn(className)} {...(props as unknown as ComponentProps<typeof HeroCard>)} />;
}

/** Judul panel dengan aksi opsional di kanan. */
export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
      <div className="min-w-0">
        <h2 className="font-display text-sm font-semibold text-ink">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-xs text-ink-2">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
