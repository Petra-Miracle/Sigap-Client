/**
 * Percakapan aktif disimpan di localStorage agar /chat dan /console (tab berbeda)
 * otomatis menampilkan percakapan yang sama (skenario uji 6).
 */
const KEY = "sigap:conversationId";

export function readActiveConversation(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null; // mode privat / storage diblokir
  }
}

export function writeActiveConversation(id: string | null) {
  try {
    if (id) window.localStorage.setItem(KEY, id);
    else window.localStorage.removeItem(KEY);
  } catch {
    /* abaikan: tanpa storage, sinkron antar-tab saja yang hilang */
  }
}

/** Dengarkan perubahan percakapan aktif dari tab lain. Mengembalikan fungsi berhenti. */
export function onActiveConversationChange(cb: (id: string | null) => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key === KEY) cb(e.newValue);
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

/** `?c=<id>` di URL mengalahkan localStorage (mis. membuka percakapan dari Flutter di Konsol). */
export function conversationFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get("c");
}
