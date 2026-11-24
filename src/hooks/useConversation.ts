"use client";

/**
 * State satu percakapan: pesan, jejak agen, status, indikator mengetik.
 * Sumber data: GET /api/conversations/:id + event Pusher `conversation-{id}`.
 * Dipakai bersama oleh /chat (simulator) dan /console (jejak + konteks).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { getPusher } from "@/lib/pusher";
import type { AgentStep, ConversationDetail, ConversationStatus, HandoffReason, Message } from "@/types";

export type SendInput = { content?: string; location?: { lat: number; lng: number } };

/** Gabungkan daftar berdasarkan id (yang baru menang), urut menurut waktu dibuat. */
function mergeById<T extends { id: string; createdAt: string }>(current: T[], incoming: T[]): T[] {
  const map = new Map(current.map((x) => [x.id, x]));
  for (const x of incoming) map.set(x.id, { ...map.get(x.id), ...x });
  return [...map.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
}

/** Teks yang disimpan backend untuk pesan lokasi tanpa teks (lihat chat.routes.ts). */
function contentFor(input: SendInput) {
  return input.content ?? `Lokasi pemasangan saya: lat ${input.location?.lat}, lng ${input.location?.lng}`;
}

export function useConversation(conversationId: string | null) {
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [status, setStatus] = useState<ConversationStatus | null>(null);
  const [handoffReason, setHandoffReason] = useState<HandoffReason | null>(null);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const [loading, setLoading] = useState(Boolean(conversationId));
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState<ApiError | null>(null);
  const [sendError, setSendError] = useState<{ message: string; input: SendInput } | null>(null);
  const [realtime, setRealtime] = useState(false);

  const idRef = useRef(conversationId);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /** Ambil ulang detail lengkap lalu gabungkan dengan event yang sudah diterima. */
  const load = useCallback(async (id: string) => {
    try {
      const d = await api.getConversation(id);
      if (idRef.current !== id) return; // pengguna sudah pindah percakapan
      setDetail(d);
      // Pesan optimistis dipertahankan sampai versi server-nya (isi sama) ikut termuat.
      setMessages((cur) =>
        mergeById(
          cur.filter((m) => !m.pending || !d.messages.some((s) => s.role === "customer" && s.content === m.content)),
          d.messages,
        ),
      );
      setSteps((cur) => mergeById(cur, d.agentSteps));
      setStatus(d.status);
      setHandoffReason(d.handoffReason);
      setLoadError(null);
    } catch (err) {
      if (idRef.current === id) setLoadError(err instanceof ApiError ? err : new ApiError(String(err), 0));
    }
  }, []);

  /** Refresh tertunda (debounce) agar rentetan event tidak memicu banyak request. */
  const scheduleRefresh = useCallback(
    (delay = 400) => {
      clearTimeout(refreshTimer.current);
      refreshTimer.current = setTimeout(() => {
        if (idRef.current) void load(idRef.current);
      }, delay);
    },
    [load],
  );

  // Percakapan berganti → kosongkan state saat render (pola React "reset state on prop change"),
  // bukan di effect, agar tidak ada render ganda dengan data percakapan lama.
  const [shownId, setShownId] = useState(conversationId);
  if (shownId !== conversationId) {
    setShownId(conversationId);
    setDetail(null);
    setMessages([]);
    setSteps([]);
    setStatus(null);
    setHandoffReason(null);
    setRemoteTyping(false);
    setSendError(null);
    setLoadError(null);
    setLoading(Boolean(conversationId));
  }

  // Muat awal setiap kali percakapan berganti.
  useEffect(() => {
    idRef.current = conversationId;
    if (!conversationId) return;
    // Aman: setState di `load` baru terjadi setelah await (respons API), bukan sinkron.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(conversationId).finally(() => {
      if (idRef.current === conversationId) setLoading(false);
    });
    return () => clearTimeout(refreshTimer.current);
  }, [conversationId, load]);

  // Langganan realtime.
  useEffect(() => {
    if (!conversationId) return;
    let cancelled = false;
    let cleanup = () => {};
    void getPusher().then((pusher) => {
      if (cancelled || !pusher) {
        setRealtime(false);
        return;
      }
      setRealtime(true);
      const name = `conversation-${conversationId}`;
      const channel = pusher.subscribe(name);

      channel.bind("message:new", (m: Message & { truncated?: boolean }) => {
        if (m.truncated) return scheduleRefresh(0);
        setMessages((cur) => {
          // Ganti pesan optimistis yang isinya sama dengan versi dari server.
          const withoutPending =
            m.role === "customer" ? cur.filter((x) => !(x.pending && x.content === m.content)) : cur;
          return mergeById(withoutPending, [m]);
        });
      });
      channel.bind("agent:step", (s: AgentStep) => {
        setSteps((cur) => mergeById(cur, [s]));
        if (s.truncated) scheduleRefresh(0);
        // Konteks pelanggan (profil, funnel, order) berubah setelah tool/balasan.
        if (s.type === "TOOL_RESULT" || s.type === "REPLY" || s.type === "HANDOFF") scheduleRefresh();
      });
      channel.bind("agent:typing", (e: { isTyping: boolean }) => setRemoteTyping(Boolean(e.isTyping)));
      channel.bind("conversation:status", (e: { status: ConversationStatus; handoffReason?: HandoffReason | null }) => {
        setStatus(e.status);
        if (e.handoffReason !== undefined) setHandoffReason(e.handoffReason);
        scheduleRefresh();
      });

      // Setelah koneksi pulih, ambil ulang untuk mengejar event yang terlewat.
      let wasDown = false;
      const onState = ({ current }: { current: string }) => {
        if (current === "connected" && wasDown) scheduleRefresh(0);
        if (current === "unavailable" || current === "disconnected") wasDown = true;
      };
      pusher.connection.bind("state_change", onState);

      cleanup = () => {
        pusher.connection.unbind("state_change", onState);
        channel.unbind_all();
        pusher.unsubscribe(name);
      };
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [conversationId, scheduleRefresh]);

  /** Kirim pesan pelanggan: tampil optimistis, lalu disatukan dengan respons server/event Pusher. */
  const send = useCallback(
    async (input: SendInput) => {
      const id = idRef.current;
      if (!id || sending) return;
      const tempId = `temp-${Date.now()}`;
      const optimistic: Message = {
        id: tempId,
        conversationId: id,
        role: "customer",
        content: contentFor(input),
        payload: input.location ? { cards: [{ type: "location", ...input.location }] } : null,
        createdAt: new Date().toISOString(),
        pending: true,
      };
      setSendError(null);
      setMessages((cur) => [...cur, optimistic]);
      setSending(true);
      try {
        const res = await api.sendMessage(id, input);
        if (idRef.current !== id) return;
        setMessages((cur) => mergeById(cur.filter((m) => m.id !== tempId), res.messages));
        setStatus(res.status);
        scheduleRefresh(0); // sinkronkan jejak + konteks (penting saat realtime nonaktif)
      } catch (err) {
        if (idRef.current !== id) return;
        setMessages((cur) => cur.filter((m) => m.id !== tempId));
        setSendError({ message: err instanceof ApiError ? err.message : "Pesan gagal terkirim.", input });
      } finally {
        setSending(false);
      }
    },
    [sending, scheduleRefresh],
  );

  return {
    detail,
    messages,
    steps,
    status,
    handoffReason,
    /** Tanpa realtime, indikator mengetik mengikuti request yang sedang berjalan. */
    typing: remoteTyping || (sending && !realtime),
    loading,
    sending,
    loadError,
    sendError,
    realtime,
    send,
    retry: () => sendError && send(sendError.input),
    dismissError: () => setSendError(null),
    refresh: () => conversationId && load(conversationId),
  };
}

export type ConversationState = ReturnType<typeof useConversation>;
