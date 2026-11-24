import type { AgentStepType, ConversationStatus, FunnelStage, HandoffReason } from "@/types";

/** Gabungkan className, abaikan nilai kosong. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export function formatTimeSeconds(iso: string): string {
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export const STATUS_LABEL: Record<ConversationStatus, string> = {
  ai_active: "Ditangani AI",
  needs_human: "Menunggu CS",
  human_active: "Ditangani CS",
  closed: "Selesai",
};

export const HANDOFF_LABEL: Record<HandoffReason, string> = {
  negosiasi_harga: "Negosiasi harga",
  keluhan: "Keluhan",
  agen_ragu: "Agen ragu",
  pelanggan_marah: "Pelanggan marah",
};

export const FUNNEL_STAGES: { stage: FunnelStage; label: string }[] = [
  { stage: "lead", label: "Lead masuk" },
  { stage: "coverage_checked", label: "Cakupan dicek" },
  { stage: "recommended", label: "Paket direkomendasikan" },
  { stage: "package_selected", label: "Paket dipilih" },
  { stage: "scheduled", label: "Jadwal pasang" },
];

/** Label badge jejak agen (bahasa juri). */
export const STEP_LABEL: Record<AgentStepType, string> = {
  INTENT: "NIAT",
  PLAN: "RENCANA",
  TOOL_CALL: "TOOL",
  TOOL_RESULT: "HASIL",
  GUARDRAIL: "GUARDRAIL",
  REPLY: "BALAS",
  HANDOFF: "HANDOFF",
  ERROR: "ERROR",
};
