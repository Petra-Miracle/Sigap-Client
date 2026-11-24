"use client";

import { useRealtimeState } from "@/hooks/useRealtimeState";
import { cn } from "@/lib/format";
import { Tooltip } from "@/components/ui";

const LABEL = {
  connected: "Realtime tersambung",
  connecting: "Menyambung realtime…",
  unavailable: "Realtime terputus, mencoba lagi",
  disabled: "Realtime nonaktif (refresh manual)",
} as const;

const DESC = {
  connected: "Jejak agen masuk secara langsung lewat Pusher.",
  connecting: "Menghubungkan ke server realtime…",
  unavailable: "Koneksi realtime terputus; mencoba menyambung ulang. Trace diperbarui setelah balasan.",
  disabled: "Pusher tidak terkonfigurasi; trace & konteks diperbarui setelah setiap balasan.",
} as const;

/** Titik status koneksi Pusher. */
export function RealtimeIndicator({ className }: { className?: string }) {
  const state = useRealtimeState();
  return (
    <Tooltip content={DESC[state]} placement="bottom">
      <span className={cn("inline-flex items-center gap-1.5 text-xs text-ink-2", className)} role="status">
        <span
          aria-hidden
          className={cn(
            "size-2 rounded-full",
            state === "connected" ? "bg-success" : state === "connecting" ? "bg-warning animate-pulse" : "bg-danger",
            state === "connecting" && "animate-pulse",
          )}
        />
        {LABEL[state]}
      </span>
    </Tooltip>
  );
}
