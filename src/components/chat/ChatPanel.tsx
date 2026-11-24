"use client";

import { useEffect, useRef, useState } from "react";
import { Headset, Loader2, RotateCcw, Wifi } from "lucide-react";
import type { ConversationState } from "@/hooks/useConversation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/format";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { QuickReplies } from "./QuickReplies";
import { TypingIndicator } from "./TypingIndicator";
import { EmptyState, Skeleton } from "@/components/ui";

/**
 * Simulator chat pelanggan bergaya layar HP. Dipakai di /chat (layar penuh)
 * dan di kolom kiri /console. Semua state datang dari `useConversation`.
 */
export function ChatPanel({
  conv,
  onNewSession,
  creating,
  className,
}: {
  conv: ConversationState;
  onNewSession: () => void;
  creating?: boolean;
  className?: string;
}) {
  const { messages, status, typing, sending, loading, loadError, sendError } = conv;
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Gulir ke bawah setiap ada pesan baru / indikator mengetik.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, typing]);

  const aiActive = status === "ai_active";
  const last = messages[messages.length - 1];
  const quickReplies = aiActive && last?.role === "ai" ? (last.payload?.quickReplies ?? []) : [];

  /** Quick reply / tombol kartu. "Kirim lokasi" membuka menu lokasi, bukan mengirim teks. */
  const act = (text: string) => {
    if (/^kirim lokasi$/i.test(text.trim())) setLocationMenuOpen(true);
    else void conv.send({ content: text });
  };

  return (
    <section
      aria-label="Simulator chat pelanggan"
      className={cn("flex min-h-0 flex-col overflow-hidden rounded-[24px] border border-line bg-canvas shadow-sm", className)}
    >
      {/* Header ala aplikasi chat */}
      <header className="flex items-center gap-3 bg-accent px-4 py-3 text-white">
        <div className="flex size-9 items-center justify-center rounded-full bg-white/15" aria-hidden>
          <Wifi className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold">Sigap · Internet Rumah</p>
          <p className="text-xs text-white/80">
            {typing ? "sedang mengetik…" : status === "human_active" ? "Dilayani tim CS" : "Asisten AI · balasan instan"}
          </p>
        </div>
        <button
          type="button"
          onClick={onNewSession}
          disabled={creating}
          aria-label="Mulai percakapan baru"
          title="Percakapan baru"
          className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white/15 disabled:opacity-60"
        >
          {creating ? <Loader2 aria-hidden className="size-5 animate-spin" /> : <RotateCcw aria-hidden className="size-5" />}
        </button>
      </header>

      {status === "needs_human" || status === "human_active" ? (
        <div className="flex items-center gap-2 border-b border-line bg-warning-soft px-4 py-2 text-xs text-warning">
          <Headset aria-hidden className="size-4 shrink-0" />
          {status === "needs_human"
            ? "Kakak sedang dihubungkan ke tim CS. AI berhenti membalas otomatis."
            : "Percakapan ini sedang dilayani tim CS."}
        </div>
      ) : null}

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto py-4" aria-live="polite">
        {(loading || !status) && !loadError && !messages.length ? (
          <div className="space-y-3 px-4 py-6" aria-label="Memuat percakapan">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-12 w-full rounded-bubble" />
          </div>
        ) : null}
        {loadError ? (
          <div className="px-3">
            <Alert
              action={
                <Button size="sm" variant="secondary" onClick={() => (loadError.status === 404 ? onNewSession() : conv.refresh())}>
                  {loadError.status === 404 ? "Mulai baru" : "Coba lagi"}
                </Button>
              }
            >
              {loadError.status === 404 ? "Percakapan tidak ditemukan." : loadError.message}
            </Alert>
          </div>
        ) : null}
        {messages.length === 0 && !loading && !loadError ? (
          <EmptyState title="Halo! Saya Sigap, asisten internet rumah.">
            <p className="mt-1">Coba tanya: cek cakupan di alamat saya, rekomendasi paket, atau jadwal pasang.</p>
          </EmptyState>
        ) : null}
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} onAction={act} actionsDisabled={!aiActive || sending || m.id !== last?.id} />
        ))}
        {typing ? <TypingIndicator /> : null}
      </div>

      {sendError ? (
        <div className="px-3 pb-2">
          <Alert
            action={
              <div className="flex gap-1">
                <Button size="sm" variant="secondary" onClick={() => void conv.retry()}>
                  Coba lagi
                </Button>
                <Button size="sm" variant="ghost" onClick={conv.dismissError} aria-label="Tutup pesan error">
                  Tutup
                </Button>
              </div>
            }
          >
            {sendError.message}
          </Alert>
        </div>
      ) : null}

      <QuickReplies options={quickReplies} onSelect={act} disabled={sending} />
      <ChatInput
        onSend={(text) => void conv.send({ content: text })}
        onLocation={(location) => void conv.send({ location })}
        disabled={sending || !!loadError || !status}
        placeholder={status === "ai_active" ? "Tulis pesan…" : "Tulis pesan untuk tim CS…"}
        locationMenuOpen={locationMenuOpen}
        setLocationMenuOpen={setLocationMenuOpen}
      />
    </section>
  );
}
