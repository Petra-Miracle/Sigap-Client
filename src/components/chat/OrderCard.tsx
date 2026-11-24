import { CheckCircle2 } from "lucide-react";
import type { MessageCard } from "@/types";

type OrderData = Extract<MessageCard, { type: "order" }>;

/** Ringkasan jadwal pasang yang berhasil dibuat (`buat_jadwal_pasang`). */
export function OrderCard({ card }: { card: OrderData }) {
  const rows = [
    ["Paket", `${card.packageName} · ${card.hargaLabel}`],
    ["Jadwal", card.slotLabel],
    ["Area", card.areaName],
    ["No. order", card.orderId.slice(-8).toUpperCase()],
  ];
  return (
    <div className="mt-2 rounded-card border border-success/30 bg-surface p-3 text-ink">
      <div className="mb-2 flex items-center gap-2 text-success">
        <CheckCircle2 aria-hidden className="size-4" />
        <span className="text-sm font-semibold">Jadwal pasang dibuat</span>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-ink-2">{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
