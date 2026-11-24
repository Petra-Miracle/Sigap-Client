/**
 * Tipe bersama. Field identik dengan respons backend (Prisma + payload pesan).
 * Sumber kebenaran: D:\Sigap-Backend\prisma\schema.prisma dan src/agent/tools/types.ts.
 */

export type MessageRole = "customer" | "ai" | "human" | "system";
export type ConversationStatus = "ai_active" | "needs_human" | "human_active" | "closed";
export type HandoffReason = "negosiasi_harga" | "keluhan" | "agen_ragu" | "pelanggan_marah";
export type FunnelStage = "lead" | "coverage_checked" | "recommended" | "package_selected" | "scheduled";
export type AgentStepType = "INTENT" | "PLAN" | "TOOL_CALL" | "TOOL_RESULT" | "GUARDRAIL" | "REPLY" | "HANDOFF" | "ERROR";

/** Elemen interaktif yang ditempel ke pesan (lihat backend MessageCard). */
export type MessageCard =
  | { type: "location"; covered?: boolean; areaName?: string; lat: number; lng: number; note?: string }
  | {
      type: "packages";
      isDemo: true;
      packages: { id: string; name: string; speedMbps: number; hargaLabel: string; description: string; recommended: boolean }[];
    }
  | { type: "slots"; slots: { id: string; label: string }[] }
  | { type: "order"; orderId: string; packageName: string; hargaLabel: string; slotLabel: string; areaName: string };

export interface MessagePayload {
  sender?: "ai" | "human";
  cards?: MessageCard[];
  quickReplies?: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  payload: MessagePayload | null;
  createdAt: string;
  /** Hanya di klien: pesan optimistis yang belum dikonfirmasi server. */
  pending?: boolean;
}

export interface AgentStep {
  id: string;
  conversationId: string;
  type: AgentStepType;
  title: string;
  detail: Record<string, unknown> | null;
  durationMs: number | null;
  createdAt: string;
  /** Payload diringkas Pusher (>9 KB); detail lengkap diambil ulang dari API. */
  truncated?: boolean;
}

/** Konteks pelanggan yang disimpan agen (Customer.profile). */
export interface CustomerProfile {
  location?: { lat: number; lng: number };
  coverage?: { covered: boolean; areaId?: string; areaName?: string };
  penghuni?: number;
  kebutuhan?: string[];
  recommended?: { id: string; name: string; hargaLabel: string }[];
  selectedPackageId?: string;
  offeredSlots?: { id: string; label: string }[];
  orderId?: string;
}

export interface Customer {
  id: string;
  name: string | null;
  phone: string | null;
  channel: "web" | "whatsapp";
  funnelStage: FunnelStage;
  profile: CustomerProfile | null;
  createdAt: string;
}

export interface Order {
  id: string;
  status: "scheduled" | "installed" | "cancelled";
  customerName: string;
  createdAt: string;
  package: { id: string; name: string; speedMbps: number; monthlyPrice: number };
  slot: { id: string; date: string; timeWindow: string; area: { name: string } };
}

export interface ConversationDetail {
  id: string;
  customerId: string;
  status: ConversationStatus;
  handoffReason: HandoffReason | null;
  assignedAgent: string | null;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  messages: Message[];
  agentSteps: AgentStep[];
  orders: Order[];
}

export interface ConversationListItem {
  id: string;
  status: ConversationStatus;
  handoffReason: HandoffReason | null;
  updatedAt: string;
  createdAt: string;
  customer: { id: string; name: string | null; channel: "web" | "whatsapp"; funnelStage: FunnelStage };
  lastMessage: { role: MessageRole; content: string; createdAt: string } | null;
}

export interface ToolInfo {
  name: string;
  description: string;
}

export interface RealtimeConfig {
  enabled: boolean;
  key?: string;
  cluster?: string;
}
