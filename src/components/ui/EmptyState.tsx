import type { ReactNode } from "react";

export function EmptyState({ icon, title, children }: { icon?: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
      {icon ? <div className="text-ink-2">{icon}</div> : null}
      <p className="font-display text-sm font-semibold text-ink">{title}</p>
      {children ? <div className="max-w-sm text-sm text-ink-2">{children}</div> : null}
    </div>
  );
}
