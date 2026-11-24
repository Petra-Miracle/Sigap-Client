import { Check, Circle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn, FUNNEL_STAGES, HANDOFF_LABEL, STATUS_LABEL } from "@/lib/format";
import type { ConversationDetail, ConversationStatus, HandoffReason } from "@/types";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-2 py-1.5 text-sm">
      <dt className="text-ink-2">{label}</dt>
      <dd className="min-w-0 break-words text-ink">{children}</dd>
    </div>
  );
}

const STATUS_TONE: Record<ConversationStatus, "accent" | "warning" | "success" | "neutral"> = {
  ai_active: "accent",
  needs_human: "warning",
  human_active: "success",
  closed: "neutral",
};

/**
 * Konteks pelanggan yang diingat agen (Customer.profile) + tahap funnel + status percakapan.
 * Semua nilai berasal dari backend; tidak ada angka karangan.
 */
export function CustomerContext({
  detail,
  status,
  handoffReason,
}: {
  detail: ConversationDetail | null;
  status: ConversationStatus | null;
  handoffReason: HandoffReason | null;
}) {
  if (!detail) return <p className="px-4 py-6 text-sm text-ink-2">Memuat konteks…</p>;
  const p = detail.customer.profile ?? {};
  const stageIndex = FUNNEL_STAGES.findIndex((s) => s.stage === detail.customer.funnelStage);
  const selected = p.recommended?.find((r) => r.id === p.selectedPackageId);
  const order = detail.orders[0];
  const dash = <span className="text-ink-2">–</span>;

  return (
    <div className="space-y-4 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        {status ? <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge> : null}
        {handoffReason ? <Badge tone="warning">{HANDOFF_LABEL[handoffReason]}</Badge> : null}
        <Badge>{detail.customer.channel === "whatsapp" ? "WhatsApp" : "Web"}</Badge>
      </div>

      {detail.summary && status !== "ai_active" ? (
        <div className="rounded-control border border-warning/20 bg-warning-soft px-3 py-2 text-xs text-warning">
          <p className="font-semibold">Ringkasan dari agen</p>
          <p className="mt-0.5">{detail.summary}</p>
        </div>
      ) : null}

      <div>
        <h3 className="mb-2 text-xs font-semibold tracking-wide text-ink-2 uppercase">Tahap funnel</h3>
        <ol className="space-y-1.5">
          {FUNNEL_STAGES.map((s, i) => {
            const done = i <= stageIndex;
            return (
              <li key={s.stage} className={cn("flex items-center gap-2 text-sm", done ? "text-ink" : "text-ink-2")}>
                {done ? (
                  <Check aria-hidden className="size-4 text-success" />
                ) : (
                  <Circle aria-hidden className="size-4 text-line" />
                )}
                {s.label}
                <span className="sr-only">{done ? "(tercapai)" : "(belum)"}</span>
              </li>
            );
          })}
        </ol>
      </div>

      <div>
        <h3 className="mb-1 text-xs font-semibold tracking-wide text-ink-2 uppercase">Yang diingat agen</h3>
        <dl className="divide-y divide-line">
          <Row label="Nama">{detail.customer.name ?? dash}</Row>
          <Row label="Cakupan">
            {p.coverage ? (
              <Badge tone={p.coverage.covered ? "success" : "warning"}>
                {p.coverage.covered ? `Terjangkau · ${p.coverage.areaName ?? ""}` : "Belum terjangkau"}
              </Badge>
            ) : (
              dash
            )}
          </Row>
          <Row label="Penghuni">{p.penghuni ? `${p.penghuni} orang` : dash}</Row>
          <Row label="Kebutuhan">{p.kebutuhan?.length ? p.kebutuhan.join(", ") : dash}</Row>
          <Row label="Rekomendasi">
            {p.recommended?.length ? p.recommended.map((r) => `${r.name} (${r.hargaLabel})`).join(", ") : dash}
          </Row>
          <Row label="Paket dipilih">{selected ? selected.name : (p.selectedPackageId ?? dash)}</Row>
          <Row label="Slot ditawarkan">{p.offeredSlots?.length ? `${p.offeredSlots.length} slot` : dash}</Row>
          <Row label="Order">
            {order ? (
              <span>
                {order.package.name} · {order.slot.area.name}
                <span className="block font-mono text-[11px] text-ink-2">{order.id.slice(-8).toUpperCase()}</span>
              </span>
            ) : (
              dash
            )}
          </Row>
        </dl>
      </div>
    </div>
  );
}
