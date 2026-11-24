/**
 * Inisialisasi pusher-js (singleton, hanya di browser).
 * Key + cluster diambil dari NEXT_PUBLIC_PUSHER_KEY/CLUSTER; jika kosong, dari backend
 * `GET /api/realtime/config` agar key cukup diisi di satu tempat.
 * Jika realtime nonaktif, fungsi mengembalikan null dan UI jatuh ke refresh setelah kirim pesan.
 */
import type PusherType from "pusher-js";
import { api } from "./api";

export type RealtimeState = "connecting" | "connected" | "unavailable" | "disabled";

let instance: Promise<PusherType | null> | null = null;

async function create(): Promise<PusherType | null> {
  let key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  let cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap1";
  if (!key) {
    try {
      const cfg = await api.getRealtimeConfig();
      if (!cfg.enabled || !cfg.key) return null;
      key = cfg.key;
      cluster = cfg.cluster ?? cluster;
    } catch {
      return null; // backend belum bisa dihubungi: UI tetap jalan tanpa realtime
    }
  }
  const { default: Pusher } = await import("pusher-js");
  return new Pusher(key, { cluster });
}

/** Ambil client Pusher bersama (dibuat sekali per tab). */
export function getPusher(): Promise<PusherType | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  instance ??= create();
  return instance;
}

/** Ubah state koneksi pusher-js menjadi status sederhana untuk indikator UI. */
export function toRealtimeState(state: string): RealtimeState {
  if (state === "connected") return "connected";
  if (state === "connecting" || state === "initialized") return "connecting";
  return "unavailable";
}
