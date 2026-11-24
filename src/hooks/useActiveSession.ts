"use client";

/**
 * Percakapan aktif yang dibagi antar-tab (/chat ↔ /console) lewat localStorage.
 * Urutan sumber: `?c=<id>` di URL → localStorage → buat sesi baru (jika autoCreate).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";
import {
  conversationFromUrl,
  onActiveConversationChange,
  readActiveConversation,
  writeActiveConversation,
} from "@/lib/session";

export function useActiveSession({ autoCreate }: { autoCreate: boolean }) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const creatingRef = useRef(false);

  /** Buat pelanggan + percakapan baru, lalu jadikan aktif di semua tab. */
  const createNew = useCallback(async () => {
    if (creatingRef.current) return;
    creatingRef.current = true;
    setCreating(true);
    setError(null);
    try {
      const s = await api.createSession();
      writeActiveConversation(s.conversationId);
      setConversationId(s.conversationId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal membuat percakapan baru.");
    } finally {
      creatingRef.current = false;
      setCreating(false);
    }
  }, []);

  /** Pindah ke percakapan tertentu (mis. dari pemilih di Konsol). */
  const select = useCallback((id: string) => {
    writeActiveConversation(id);
    setConversationId(id);
  }, []);

  useEffect(() => {
    const fromUrl = conversationFromUrl();
    const initial = fromUrl ?? readActiveConversation();
    if (fromUrl) writeActiveConversation(fromUrl);
    // Sumber ada di browser (URL/localStorage), jadi hanya bisa dibaca setelah mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initial) setConversationId(initial);
    else if (autoCreate) void createNew();
    return onActiveConversationChange((id) => {
      if (id) setConversationId(id);
    });
  }, [autoCreate, createNew]);

  return { conversationId, select, createNew, creating, error };
}
