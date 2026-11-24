/** Indikator "AI sedang mengetik". */
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-3" role="status" aria-live="polite">
      <div className="flex items-center gap-1 rounded-bubble rounded-bl-sm border border-line bg-surface px-3 py-2.5">
        {[0, 150, 300].map((d) => (
          <span key={d} className="size-1.5 animate-blink rounded-full bg-ink-2" style={{ animationDelay: `${d}ms` }} />
        ))}
      </div>
      <span className="text-xs text-ink-2">AI sedang mengetik</span>
    </div>
  );
}
