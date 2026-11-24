/** Tombol balasan cepat di bawah pesan AI terakhir. */
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
    <div className="flex flex-wrap gap-2 px-3 pb-2" role="group" aria-label="Pilihan balasan cepat">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(o)}
          className="min-h-11 rounded-full border border-accent/30 bg-surface px-4 text-sm font-medium text-accent hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          {o}
        </button>
      ))}
    </div>
  );
}
