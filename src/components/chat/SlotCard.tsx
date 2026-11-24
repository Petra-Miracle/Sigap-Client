import { CalendarClock } from "lucide-react";
import type { MessageCard } from "@/types";

type SlotsData = Extract<MessageCard, { type: "slots" }>;

/** Pilihan slot pasang dari `lihat_slot_pasang`. Memilih slot mengirim pesan teks berisi labelnya. */
export function SlotCard({ card, onChoose, disabled }: { card: SlotsData; onChoose: (text: string) => void; disabled: boolean }) {
  if (!card.slots.length) return null;
  return (
    <div className="mt-2 grid gap-1.5">
      {card.slots.map((s) => (
        <button
          key={s.id}
          type="button"
          disabled={disabled}
          onClick={() => onChoose(`Saya pilih jadwal ${s.label}`)}
          className="flex min-h-11 items-center gap-2 rounded-control border border-line bg-surface px-3 text-left text-sm text-ink transition-colors hover:border-accent hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CalendarClock aria-hidden className="size-4 shrink-0 text-accent" />
          {s.label}
        </button>
      ))}
    </div>
  );
}
