import { Hero } from "@/components/landing/Hero";
import { Card } from "@/components/ui";

const STEPS = [
  { title: "Pelanggan mulai chat", desc: "Simulasi dari /chat atau perangkat lain (WhatsApp/Flutter)." },
  { title: "Agen cek cakupan & rekomendasi", desc: "Tool cek_cakupan dan rekomendasi_paket memakai data demo." },
  { title: "Pilih paket & jadwal", desc: "Pelanggan memilih paket dan slot pasang yang ditawarkan." },
  { title: "Jadwal dibuat", desc: "buat_jadwal_pasang menyimpan order; konteks pelanggan terbarui." },
];

const FEATURES = [
  "Jejak agen realtime (NIAT → RENCANA → TOOL → HASIL → GUARDRAIL → BALAS → HANDOFF).",
  "Guardrail harga, paket, data sensitif, dan janji diskon.",
  "Handoff ke CS dengan ringkasan saat negosiasi/keluhan/marah.",
  "Konteks pelanggan & tahap funnel tersimpan dan ditampilkan di console.",
  "Realtime via Pusher dengan fallback refresh manual.",
  "Data paket/harga berasal dari backend (data demo, berlabel demo).",
];

export default function Home() {
  return (
    <main className="min-h-dvh">
      <Hero />
      <section className="mx-auto max-w-5xl px-4 py-10 lg:px-6">
        <h2 className="font-display text-h2 text-ink">Cara kerja</h2>
        <p className="mt-1 text-sm text-ink-2">Alur singkat dari chat pelanggan sampai jadwal pasang.</p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <Card className="h-full p-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="font-display text-sm font-semibold text-ink">{s.title}</h3>
                </div>
                <p className="mt-2 text-xs text-ink-2">{s.desc}</p>
              </Card>
            </li>
          ))}
        </ol>
      </section>
      <section className="mx-auto max-w-5xl px-4 pb-12 lg:px-6">
        <h2 className="font-display text-h2 text-ink">Fitur</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2 rounded-card border border-line bg-surface px-3 py-2 text-sm text-ink">
              <span aria-hidden className="mt-1 size-1.5 shrink-0 rounded-full bg-accent" />
              {f}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
