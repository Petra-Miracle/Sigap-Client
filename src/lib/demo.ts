/**
 * Titik lokasi DEMO (cocok dengan seed backend `src/data/seed/coverage.ts`).
 * Dipakai tombol "Kirim lokasi" agar demo tidak bergantung pada GPS.
 */
export const DEMO_LOCATIONS = {
  covered: { lat: -6.2425, lng: 106.8003, label: "Lokasi demo: Kebayoran (terjangkau)" },
  uncovered: { lat: -6.5971, lng: 106.806, label: "Lokasi demo: Bogor (belum terjangkau)" },
} as const;
