import { MapPin } from "lucide-react";
import type { MessageCard } from "@/types";
import { Badge } from "@/components/ui/Badge";

type LocationCardData = Extract<MessageCard, { type: "location" }>;

/** Kartu lokasi: dari pelanggan (koordinat) atau hasil `cek_cakupan` (terjangkau / belum). */
export function LocationCard({ card }: { card: LocationCardData }) {
  const checked = card.covered !== undefined;
  return (
    <div className="mt-2 overflow-hidden rounded-card border border-line bg-surface text-ink">
      <div className="flex h-16 items-center justify-center bg-accent-soft" aria-hidden>
        <MapPin className="size-6 text-accent" />
      </div>
      <div className="space-y-1 px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{card.areaName ?? "Lokasi pemasangan"}</span>
          {checked ? (
            <Badge tone={card.covered ? "success" : "warning"}>{card.covered ? "Terjangkau" : "Belum terjangkau"}</Badge>
          ) : null}
        </div>
        <p className="font-mono text-[11px] text-ink-2">
          {card.lat.toFixed(4)}, {card.lng.toFixed(4)}
        </p>
        {card.note ? <p className="text-xs text-ink-2">{card.note}</p> : null}
      </div>
    </div>
  );
}
