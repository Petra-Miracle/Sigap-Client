"use client";

import { useRealtimeState } from "@/hooks/useRealtimeState";
import { cn } from "@/lib/format";

const LABEL = {
  connected: "Realtime tersambung",
  connecting: "Menyambung realtime…",
  unavailable: "Realtime terputus, mencoba lagi",
  disabled: "Realtime nonaktif (refresh manual)",
} as const;

/** Titik status koneksi Pusher. */
export function RealtimeIndicator({ className }: { className?: string }) {
  const state = useRealtimeState();
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-ink-2", className)} role="status">
      <span
        aria-hidden
        className={cn(
          "size-2 rounded-full",
          state === "connected" ? "bg-success" : state === "connecting" ? "bg-warning animate-pulse" : "bg-danger",
        )}
      />
      {LABEL[state]}
    </span>
  );
}
