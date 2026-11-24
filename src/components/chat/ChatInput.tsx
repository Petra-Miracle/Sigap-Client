"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { LocateFixed, MapPin, SendHorizontal } from "lucide-react";
import { DEMO_LOCATIONS } from "@/lib/demo";
import { cn } from "@/lib/format";

type Location = { lat: number; lng: number };

/**
 * Kolom ketik + tombol "Kirim lokasi" (GPS perangkat atau titik demo).
 * Menu lokasi bisa dibuka dari luar (quick reply "Kirim lokasi").
 */
export function ChatInput({
  onSend,
  onLocation,
  disabled,
  placeholder,
  locationMenuOpen,
  setLocationMenuOpen,
}: {
  onSend: (text: string) => void;
  onLocation: (loc: Location) => void;
  disabled: boolean;
  placeholder: string;
  locationMenuOpen: boolean;
  setLocationMenuOpen: (open: boolean) => void;
}) {
  const [text, setText] = useState("");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Tutup menu lokasi saat klik di luar atau menekan Escape.
  useEffect(() => {
    if (!locationMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setLocationMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLocationMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [locationMenuOpen, setLocationMenuOpen]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t || disabled) return;
    onSend(t);
    setText("");
  };

  const pick = (loc: Location) => {
    setLocationMenuOpen(false);
    setGeoError(null);
    onLocation(loc);
  };

  /** Lokasi asli perangkat; jika ditolak/gagal, sarankan titik demo. */
  const useGps = () => {
    if (!("geolocation" in navigator)) {
      setGeoError("Browser tidak mendukung lokasi. Pakai lokasi demo.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        pick({ lat: Number(pos.coords.latitude.toFixed(6)), lng: Number(pos.coords.longitude.toFixed(6)) });
      },
      () => {
        setLocating(false);
        setGeoError("Lokasi tidak bisa diambil (izin ditolak atau tidak tersedia). Pakai lokasi demo.");
      },
      { enableHighAccuracy: true, timeout: 8_000 },
    );
  };

  return (
    <div className="relative border-t border-line bg-surface p-2" ref={rootRef}>
      {locationMenuOpen ? (
        <div className="absolute inset-x-2 bottom-full mb-2 rounded-card border border-line bg-surface p-1 shadow-lg" role="menu">
          <button
            type="button"
            role="menuitem"
            onClick={useGps}
            disabled={locating}
            className="flex min-h-11 w-full items-center gap-2 rounded-control px-3 text-left text-sm hover:bg-canvas"
          >
            <LocateFixed aria-hidden className="size-4 text-accent" />
            {locating ? "Mengambil lokasi…" : "Lokasi saya saat ini"}
          </button>
          {Object.values(DEMO_LOCATIONS).map((d) => (
            <button
              key={d.label}
              type="button"
              role="menuitem"
              onClick={() => pick({ lat: d.lat, lng: d.lng })}
              className="flex min-h-11 w-full items-center gap-2 rounded-control px-3 text-left text-sm hover:bg-canvas"
            >
              <MapPin aria-hidden className="size-4 text-ink-2" />
              {d.label}
            </button>
          ))}
        </div>
      ) : null}
      {geoError ? <p className="px-1 pb-2 text-xs text-warning">{geoError}</p> : null}
      <form onSubmit={submit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setLocationMenuOpen(!locationMenuOpen)}
          disabled={disabled}
          aria-label="Kirim lokasi"
          aria-expanded={locationMenuOpen}
          className={cn(
            "inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-accent hover:bg-accent-soft disabled:opacity-50",
            locationMenuOpen && "bg-accent-soft",
          )}
        >
          <MapPin aria-hidden className="size-5" />
        </button>
        <label htmlFor="chat-input" className="sr-only">
          Tulis pesan
        </label>
        <input
          id="chat-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={2000}
          autoComplete="off"
          className="min-h-11 min-w-0 flex-1 rounded-full border border-line bg-canvas px-4 text-sm placeholder:text-ink-2 focus:border-accent focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          aria-label="Kirim pesan"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-white hover:bg-accent-strong disabled:bg-accent/40"
        >
          <SendHorizontal aria-hidden className="size-5" />
        </button>
      </form>
    </div>
  );
}
