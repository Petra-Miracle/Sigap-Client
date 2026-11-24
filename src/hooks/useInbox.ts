"use client";

/**
 * Daftar percakapan terbaru + update realtime dari channel `inbox`.
 * Fase 4: pemilih percakapan di Konsol. Fase 5: halaman /inbox (filter status).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { getPusher } from "@/lib/pusher";
import type { ConversationListItem, ConversationStatus } from "@/types";

export function useInbox(status?: ConversationStatus, onUpdated?: (conversationId: string) => void) {
  const [items, setItems] = useState<ConversationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /** Dinaikkan untuk memicu muat ulang (event Pusher / tombol). */
  const [version, setVersion] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onUpdatedRef = useRef(onUpdated);

  useEffect(() => {
    onUpdatedRef.current = onUpdated;
  });

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    api
      .listConversations(status)
      .then((res) => {
        if (cancelled) return;
        setItems(res.conversations);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Gagal memuat daftar percakapan.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status, version]);

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;
    void getPusher().then((pusher) => {
      if (cancelled || !pusher) return;
      const channel = pusher.subscribe("inbox");
      const handler = (e: { id: string }) => {
        onUpdatedRef.current?.(e.id);
        clearTimeout(timer.current);
        timer.current = setTimeout(reload, 500); // ringkasan + nama pelanggan diambil dari API
      };
      channel.bind("conversation:updated", handler);
      cleanup = () => channel.unbind("conversation:updated", handler); // channel bisa dipakai komponen lain
    });
    return () => {
      cancelled = true;
      clearTimeout(timer.current);
      cleanup();
    };
  }, [reload]);

  return { items, loading, error, reload };
}
