/** Tombol balasan cepat di bawah pesan AI terakhir. Scroll horizontal di mobile. */
export function QuickReplies({
  options,
  onSelect,
  disabled,
}: {
  options: string[];
  onSelect: (text: string) => void;
  disabled: boolean;
}) {
  if (!options.length) return null;
  return (
    <div
      className="flex gap-2 overflow-x-auto px-3 pb-2 sm:flex-wrap sm:overflow-visible"
      role="group"
      aria-label="Pilihan balasan cepat"
    >
      {options.map((o) => (
        <button
          key={o}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(o)}
          className="min-h-11 shrink-0 rounded-full border border-accent/30 bg-surface px-4 text-sm font-medium text-accent hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          {o}
        </button>
      ))}
    </div>
  );
}
