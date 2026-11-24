import { Bot, Headset } from "lucide-react";
import type { Message } from "@/types";
import { cn, formatTime } from "@/lib/format";
import { LocationCard } from "./LocationCard";
import { PackageCards } from "./PackageCard";
import { SlotCard } from "./SlotCard";
import { OrderCard } from "./OrderCard";

/**
 * Gelembung chat. Pelanggan di kanan; AI dan CS di kiri dengan label pengirim
 * (setiap balasan agen ditandai "AI", guardrail 4.5).
 */
export function ChatBubble({
  message,
  onAction,
  actionsDisabled,
}: {
  message: Message;
  onAction: (text: string) => void;
  actionsDisabled: boolean;
}) {
  if (message.role === "system") {
    return <p className="px-6 text-center text-xs text-ink-2">{message.content}</p>;
  }
  const mine = message.role === "customer";
  const cards = message.payload?.cards ?? [];
  // Pesan lokasi tanpa teks dari pelanggan: cukup tampilkan kartunya.
  const hideText =
    mine && cards.some((c) => c.type === "location") && message.content.startsWith("Lokasi pemasangan saya:");

  return (
    <div className={cn("flex px-3", mine ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[85%]", message.pending && "opacity-60")}>
        {!mine ? (
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-ink-2">
            {message.role === "ai" ? (
              <>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-1.5 py-0.5 text-accent-strong">
                  <Bot aria-hidden className="size-3" /> AI
                </span>
                Sigap
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-1.5 py-0.5 text-success">
                  <Headset aria-hidden className="size-3" /> CS
                </span>
                Tim CS
              </>
            )}
          </div>
        ) : null}
        <div
          className={cn(
            "rounded-bubble text-sm leading-relaxed",
            hideText
              ? ""
              : mine
                ? "rounded-br-sm bg-bubble px-3 py-2 text-ink"
                : "rounded-bl-sm border border-line bg-surface px-3 py-2 text-ink",
          )}
        >
          {hideText ? null : <p className="whitespace-pre-wrap break-words">{message.content}</p>}
          {cards.map((card, i) => {
            switch (card.type) {
              case "location":
                return <LocationCard key={i} card={card} />;
              case "packages":
                return <PackageCards key={i} card={card} onChoose={onAction} disabled={actionsDisabled} />;
              case "slots":
                return <SlotCard key={i} card={card} onChoose={onAction} disabled={actionsDisabled} />;
              case "order":
                return <OrderCard key={i} card={card} />;
              default:
                return null;
            }
          })}
        </div>
        <p className={cn("mt-1 text-[10px] text-ink-2", mine && "text-right")}>
          {message.pending ? "Mengirim…" : formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
