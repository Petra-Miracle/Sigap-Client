import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/format";

/** Pesan error/peringatan yang jelas untuk pengguna, dengan aksi opsional (mis. "Coba lagi"). */
export function Alert({
  tone = "danger",
  children,
  action,
  className,
}: {
  tone?: "danger" | "warning";
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-control border px-3 py-2 text-sm",
        tone === "danger" ? "border-danger/20 bg-danger-soft text-danger" : "border-warning/20 bg-warning-soft text-warning",
        className,
      )}
    >
      <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0 flex-1">{children}</div>
      {action}
    </div>
  );
}
