import { Wifi } from "lucide-react";
import type { MessageCard } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type PackagesData = Extract<MessageCard, { type: "packages" }>;

/** Kartu paket hasil `rekomendasi_paket`. Harga & nama berasal dari DB (data demo), bukan dari model. */
export function PackageCards({
  card,
  onChoose,
  disabled,
}: {
  card: PackagesData;
  onChoose: (text: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="mt-2 space-y-2">
      {card.packages.map((p) => (
        <div key={p.id} className="rounded-card border border-line bg-surface p-3 text-ink">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Wifi aria-hidden className="size-4 text-accent" />
                <span className="font-display text-sm font-semibold">{p.name}</span>
                {p.recommended ? <Badge tone="accent">Disarankan</Badge> : null}
              </div>
              <p className="mt-1 text-xs text-ink-2">{p.description}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display text-sm font-semibold">{p.speedMbps} Mbps</p>
              <p className="text-xs text-ink-2">{p.hargaLabel}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant={p.recommended ? "primary" : "secondary"}
            className="mt-2 w-full min-h-10"
            disabled={disabled}
            onClick={() => onChoose(`Pilih ${p.name}`)}
          >
            Pilih {p.name}
          </Button>
        </div>
      ))}
      {card.isDemo ? <p className="text-[11px] text-ink-2">Harga dan paket adalah data demo.</p> : null}
    </div>
  );
}
