/**
 * Fetch wrapper ke backend Sigap (NEXT_PUBLIC_API_URL).
 * Semua error diubah menjadi `ApiError` berpesan bahasa Indonesia yang siap ditampilkan di UI.
 */
import type {
  ConversationDetail,
  ConversationListItem,
  ConversationStatus,
  Message,
  RealtimeConfig,
  ToolInfo,
} from "@/types";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
  }
}

const TIMEOUT_MS = 45_000; // satu giliran agen bisa beberapa panggilan model + tool

async function request<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(API_URL + path, {
      method,
      headers: body ? { "content-type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    const timeout = err instanceof DOMException && err.name === "TimeoutError";
    throw new ApiError(
      timeout ? "Server terlalu lama menjawab. Coba lagi sebentar." : `Tidak bisa terhubung ke server (${API_URL}).`,
      0,
      timeout ? "timeout" : "network",
    );
  }
  const json = (await res.json().catch(() => null)) as { error?: { message?: string; code?: string } } | null;
  if (!res.ok) {
    throw new ApiError(json?.error?.message ?? `Permintaan gagal (HTTP ${res.status}).`, res.status, json?.error?.code);
  }
  return json as T;
}

export const api = {
  /** Buat pelanggan + percakapan baru (kanal web) beserta sapaan pembuka. */
  createSession: (name?: string) =>
    request<{ customerId: string; conversationId: string; status: ConversationStatus; messages: Message[] }>(
      "POST",
      "/api/chat/sessions",
      name ? { name } : {},
    ),

  /** Kirim pesan pelanggan (teks dan/atau lokasi) lalu jalankan agen; respons = pesan pelanggan + balasan. */
  sendMessage: (conversationId: string, input: { content?: string; location?: { lat: number; lng: number } }) =>
    request<{ messages: Message[]; status: ConversationStatus }>("POST", `/api/chat/${conversationId}/messages`, input),

  getConversation: (id: string) => request<ConversationDetail>("GET", `/api/conversations/${id}`),

  listConversations: (status?: ConversationStatus) =>
    request<{ conversations: ConversationListItem[] }>("GET", `/api/conversations${status ? `?status=${status}` : ""}`),

  getTools: () => request<{ tools: ToolInfo[] }>("GET", "/api/knowledge/tools"),

  getRealtimeConfig: () => request<RealtimeConfig>("GET", "/api/realtime/config"),
};
