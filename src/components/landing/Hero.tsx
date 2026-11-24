"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";

const MorphText = dynamic(() => import("@/components/ui/morph-text").then((m) => m.MorphText), {
  ssr: false,
  loading: () => <span className="font-display text-h1 font-bold text-ink">Sigap</span>,
});

export function Hero() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-accent-soft to-canvas px-4 py-16 lg:py-24">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-semibold tracking-wide text-accent-strong uppercase">Sigap · AI Sales Agent</p>
        <h1 className="mt-3 font-display text-display font-bold text-ink">
          {reduced ? (
            "Sigap"
          ) : (
            <MorphText
              words={["CEK CAKUPAN", "REKOMENDASI", "JADWAL PASANG"]}
              interval={2600}
              fontSize="clamp(2.25rem, 8vw, 4.5rem)"
              fontFamily='"Space Grotesk", var(--font-space-grotesk), sans-serif'
              className="justify-center"
              textClassName="text-ink"
              subtext="Agen penjualan AI untuk chat commerce provider internet rumah."
              subtextClassName="!text-ink-2"
            />
          )}
        </h1>
        {!reduced ? null : (
          <p className="mt-3 text-ink-2">Agen penjualan AI untuk chat commerce provider internet rumah.</p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/chat">
            <Button size="md">Coba sebagai pelanggan</Button>
          </Link>
          <Link href="/console">
            <Button size="md" variant="secondary">
              Buka console agen
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-xs text-ink-2">
          Data paket, harga, dan cakupan adalah data demo dari backend. Tidak ada angka performa yang diklaim.
        </p>
      </div>
    </section>
  );
}
