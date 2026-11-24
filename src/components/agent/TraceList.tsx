"use client";

import { useEffect, useMemo, useRef } from "react";
import { Activity } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AgentStep, Message } from "@/types";
import { TraceStep } from "./TraceStep";

interface Turn {
  key: string;
  steps: AgentStep[];
}

/** Kelompokkan langkah per giliran: setiap INTENT memulai giliran baru. */
function groupTurns(steps: AgentStep[]): Turn[] {
  const turns: Turn[] = [];
  for (const s of steps) {
    if (s.type === "INTENT" || !turns.length) turns.push({ key: s.id, steps: [] });
    turns[turns.length - 1].steps.push(s);
  }
  return turns;
}

/**
 * Jejak kerja agen realtime. Otomatis menggulir ke bawah saat langkah baru masuk,
 * kecuali pengguna sedang membaca bagian atas.
 */
export function TraceList({
  steps,
  messages,
  technical,
  thinking,
}: {
  steps: AgentStep[];
  messages: Message[];
  technical: boolean;
  thinking: boolean;
}) {
  const turns = useMemo(() => groupTurns(steps), [steps]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const customerMessages = useMemo(() => messages.filter((m) => m.role === "customer" && !m.pending), [messages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && stick.current) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [steps.length, thinking]);

  return (
    <div
      ref={scrollRef}
      onScroll={(e) => {
        const el = e.currentTarget;
        stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      }}
      className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
      aria-live="polite"
      aria-label="Jejak kerja agen"
    >
      {!turns.length && !thinking ? (
        <EmptyState icon={<Activity className="size-6" />} title="Belum ada langkah agen">
          Kirim pesan dari simulator chat. Setiap niat, rencana, pemanggilan tool, guardrail, dan balasan muncul di sini
          secara realtime.
        </EmptyState>
      ) : null}
      <ol className="space-y-5">
        {turns.map((turn, i) => (
          <li key={turn.key}>
            <div className="mb-2 flex items-center gap-2">
              <span className="font-display text-xs font-semibold tracking-wide text-ink-2 uppercase">Giliran {i + 1}</span>
              {(() => {
                // Pesan pelanggan pemicu = pesan pelanggan terakhir sebelum langkah pertama giliran ini.
                const start = turn.steps[0].createdAt;
                const trigger = customerMessages.filter((m) => m.createdAt <= start).at(-1);
                return trigger ? <span className="truncate text-xs text-ink-2">· “{trigger.content}”</span> : null;
              })()}
            </div>
            <ol className="relative space-y-2 before:absolute before:top-2 before:bottom-2 before:left-[10px] before:w-px before:bg-line">
              {turn.steps.map((s) => (
                <TraceStep key={s.id} step={s} technical={technical} isLatest={s.id === steps[steps.length - 1]?.id} />
              ))}
            </ol>
          </li>
        ))}
      </ol>
      {thinking ? (
        <p className="mt-4 flex items-center gap-2 pl-6 text-xs text-ink-2" role="status">
          <span className="size-2 animate-pulse rounded-full bg-accent" aria-hidden /> Agen sedang bekerja…
        </p>
      ) : null}
    </div>
  );
}
