# Prompt: Upgrade UI Sigap Client dengan HeroUI + VengeanceUI

> Salin seluruh isi file ini sebagai perintah ke AI coding agent yang bekerja di repo `D:\Sigap-Client`.

---

## Tujuan

Rombak tampilan **Sigap Client** agar terasa seperti produk SaaS kelas atas, bukan prototipe hackathon. Gunakan dua library berikut:

- **HeroUI** ([https://www.heroui.com](https://www.heroui.com)): fondasi komponen fungsional dan aksesibel, misalnya Button, Card, Chip, Switch, Input, Tabs, Tooltip, Modal, Skeleton, Avatar, Dropdown dan Toast.
- **VengeanceUI** ([https://www.vengenceui.com](https://www.vengenceui.com)): komponen beranimasi untuk momen "wow", misalnya hero text, background, efek kartu dan transisi. Komponennya disalin ke repo, bukan dipasang sebagai satu paket.

Target "50x lebih baik" berarti hasilnya harus terukur pada lima hal ini:

1. **Hierarki visual jelas.** Pengguna langsung tahu apa yang penting di setiap layar.
2. **Konsisten.** Spacing, radius, warna, tipografi dan state memakai satu sistem token.
3. **Terasa hidup.** Ada micro-interaction dan transisi halus, tetapi tidak berisik dan tidak mengganggu kerja.
4. **Aksesibel.** Kontras cukup, fokus keyboard terlihat, ada label ARIA, dan `prefers-reduced-motion` dihormati.
5. **Cepat dan responsif.** Tidak ada layout shift, nyaman di lebar 360px sampai desktop lebar, dan bundle tidak membengkak tanpa alasan.

## Konteks proyek (wajib dibaca sebelum menulis kode)

- **Stack.** Next.js 16 (App Router, `cacheComponents` aktif), React 19, Tailwind CSS 4, TypeScript dan pusher-js.
- **AGENTS.md.** File ini menegaskan bahwa Next.js versi ini berbeda dari data latihan. Baca panduan relevan di `node_modules/next/dist/docs/` sebelum menulis kode.
- **Halaman yang ada:**
  - `src/app/page.tsx`: landing.
  - `src/app/chat/` (`ChatSimulator.tsx`): simulator chat sisi pelanggan.
  - `src/app/(dashboard)/console/` (`AgentConsole.tsx`): console agen dengan trace, tool, konteks pelanggan dan indikator realtime.
- **Komponen:**
  - `src/components/ui/*`: Button, Badge, Card, Toggle, EmptyState dan Alert. Ini primitive buatan sendiri.
  - `src/components/chat/*`: ChatBubble, ChatInput, ChatPanel, PackageCard, SlotCard, OrderCard, LocationCard, QuickReplies dan TypingIndicator.
  - `src/components/agent/*`: TraceStep, TraceList, ToolList dan CustomerContext.
  - `src/components/layout/*`: AppNav dan RealtimeIndicator.
- **Token warna/tema** ada di `src/app/globals.css` (Tailwind 4 `@theme`).
- **Logika jangan disentuh.** Ini berlaku untuk `src/hooks/*`, `src/lib/*` (api, pusher, session, format, demo) dan `src/types/*`. Upgrade ini murni lapisan tampilan.
- **Fase 5 akan menambah halaman Inbox dan Dashboard metrik.** Komponen yang dibuat sekarang harus bisa dipakai ulang di sana.

## Aturan keras

1. **Kerjakan per fase (lihat di bawah).** Setelah tiap fase selesai, berhenti. Tunjukkan ringkasan perubahan, cara menjalankan, dan screenshot atau deskripsi visual, lalu tunggu konfirmasi sebelum lanjut.
2. **Jangan mengubah perilaku.** Semua alur yang sudah jalan harus tetap jalan persis sama: kirim chat, quick replies, kartu paket/slot/order/lokasi, trace realtime, toggle tool, indikator Pusher dan error state.
3. **Jangan mengarang angka bisnis.** Ini mencakup statistik, testimoni, "99% uptime", jumlah pelanggan dan sejenisnya. Data demo tetap diberi label demo. Komponen VengeanceUI seperti counter atau marquee hanya boleh menampilkan data nyata dari API atau teks deskriptif.
4. **Jangan hardcode secret.** Upgrade ini tidak menambah env var baru. Jika ternyata perlu, tambahkan ke `.env.example` dengan nilai kosong.
5. **Verifikasi versi sebelum install.** Cek dokumentasi resmi terbaru HeroUI dan VengeanceUI. Pastikan versi yang dipasang kompatibel dengan **React 19, Next.js 16 dan Tailwind 4**. HeroUI punya jalur instalasi berbeda antar versi mayor, jadi pakai yang mendukung Tailwind 4. Catat versi dan alasannya di `DECISIONS.md`.
6. **Bagi peran kedua library dengan tegas:**
   - **HeroUI** untuk semua elemen interaktif dan struktural: tombol, input, switch, tab, chip/badge, card, modal, tooltip, skeleton dan toast.
   - **VengeanceUI** hanya untuk aksen. Contohnya hero landing, background dekoratif, animasi masuk, efek hover kartu paket, dan transisi pesan chat.
   - Console agen adalah layar kerja padat. Animasinya harus minimal dan fungsional, misalnya highlight trace baru atau pulse indikator realtime. Jangan pakai efek dekoratif di sana.
7. **Satu sumber token.** Petakan token warna yang ada di `globals.css` ke tema HeroUI, yaitu warna `primary`, `success`, `warning`, `danger` dan radius. Dengan begitu HeroUI, VengeanceUI dan kelas Tailwind memakai palet yang sama. Dukung light dan dark mode jika HeroUI menyediakannya tanpa biaya besar.
8. **Pertahankan API wrapper.** Ganti isi `src/components/ui/*` agar memakai HeroUI di dalamnya, tetapi pertahankan props yang dipakai halaman sejauh mungkin. Jika props harus berubah, perbarui semua pemanggilnya dalam fase yang sama.
9. **Batas client component.** Provider HeroUI dan komponen VengeanceUI hampir pasti butuh `"use client"`. Taruh provider di komponen client terpisah, misalnya `src/app/providers.tsx`, yang dibungkus dari `layout.tsx`. Jangan menjadikan seluruh layout sebagai client component, dan jangan merusak `cacheComponents`.
10. **Performa:**
    - Komponen animasi berat seperti canvas, partikel dan WebGL di-load dengan `next/dynamic` dan hanya di landing.
    - Semua animasi mati atau disederhanakan saat `prefers-reduced-motion: reduce`.
    - Tidak ada CLS dari font atau gambar.
11. **Beri komentar singkat** pada fungsi atau komponen penting, mengikuti gaya repo yang berbahasa Indonesia.
12. **Untuk hal ambigu, pilih opsi paling sederhana** dan catat di `DECISIONS.md` dengan nomor lanjutan.

## Fase pengerjaan

### Fase UI-0: Audit dan instalasi

- Baca semua file yang disebut di bagian Konteks. Ambil screenshot atau catat kondisi visual saat ini untuk `/`, `/chat` dan `/console`.
- Buat daftar masalah UI saat ini per halaman, misalnya hierarki, spacing, kontras dan state yang hilang.
- Pasang HeroUI sesuai dokumentasi resmi untuk Next.js App Router + Tailwind 4.
- Siapkan tooling VengeanceUI. Biasanya ini lewat registry shadcn CLI plus dependensi seperti `motion` dan util `cn` (`clsx` + `tailwind-merge`). Ikuti dokumentasi resminya.
- Buat `src/app/providers.tsx` dan pastikan `npm run build` serta `npm run lint` lolos tanpa perubahan visual dulu.

### Fase UI-1: Design system

- Petakan token di `globals.css` ke tema HeroUI (warna semantik, radius, font).
- Tetapkan skala tipografi (display, h1–h3, body, caption, mono untuk trace) dan skala spacing.
- Tulis ulang primitive di `src/components/ui/*` di atas HeroUI. Tambahkan primitive yang belum ada dan akan dibutuhkan, yaitu Skeleton, Tooltip, Tabs, Avatar dan Toast.
- Buat halaman internal `/ui-preview` yang menampilkan semua primitive beserta variannya (default, hover, disabled, loading, error). Halaman ini untuk review dan boleh dihapus di fase akhir.

### Fase UI-2: Simulator chat (`/chat`)

- Tampilan chat setara aplikasi messaging modern:
  - bubble dengan ekor/radius asimetris yang membedakan pelanggan dan Sigap;
  - avatar, timestamp halus, dan grouping pesan berurutan;
  - auto-scroll yang mulus.
- Animasi masuk pesan dan typing indicator memakai motion, dengan durasi pendek sekitar 150–250 ms.
- Kartu PackageCard, SlotCard, OrderCard dan LocationCard didesain ulang:
  - info utama menonjol;
  - CTA jelas;
  - efek hover atau tilt ringan dari VengeanceUI hanya di desktop.
- QuickReplies berbentuk chip yang bisa di-scroll horizontal di mobile.
- ChatInput menampilkan state kirim, disabled saat AI sedang membalas, dan error yang jelas dengan tombol coba lagi.
- Empty state menampilkan sapaan dan contoh pertanyaan.

### Fase UI-3: Console agen (`/console`)

- Layout tiga kolom di desktop: percakapan, trace/tool dan konteks pelanggan. Di mobile, kolom berubah menjadi tab.
- TraceStep tampil sebagai timeline vertikal:
  - ikon per jenis langkah;
  - status (sukses/error/berjalan) memakai warna semantik;
  - durasi;
  - detail JSON yang bisa di-expand dengan font mono.
- Trace baru masuk dengan highlight singkat.
- ToolList memakai Switch HeroUI dengan Tooltip deskripsi tool.
- CustomerContext tampil sebagai kartu profil yang rapi.
- RealtimeIndicator berupa dot dengan pulse, berwarna hijau saat terhubung dan abu/kuning saat fallback, plus tooltip penjelasan.
- AppNav dirapikan dengan state aktif yang jelas, logo/wordmark Sigap, dan responsif.

### Fase UI-4: Landing (`/`)

- Di sinilah VengeanceUI boleh tampil penuh: hero dengan judul beranimasi dan background dekoratif.
- Tambahkan penjelasan singkat apa itu Sigap, yaitu AI sales agent untuk chat commerce dengan demo kasus provider internet fiber rumah.
- Sediakan dua CTA jelas: "Coba sebagai pelanggan" (`/chat`) dan "Buka console agen" (`/console`).
- Tambahkan bagian "Cara kerja" (3–4 langkah) dan bagian fitur. Isinya hanya klaim kualitatif yang benar tentang sistem ini, tanpa angka karangan.
- Tetap cepat: komponen berat di-load dinamis, dan halaman tetap terbaca baik dengan reduced motion.

### Fase UI-5: QA dan polish

- Cek setiap halaman di lebar 360, 768, 1280 dan 1920 px. Tidak boleh ada horizontal scroll di mobile.
- Cek navigasi keyboard penuh, fokus terlihat, kontras teks minimal WCAG AA, dan reduced motion.
- Cek semua state: loading (skeleton), kosong, error API, backend mati, dan Pusher tidak terkonfigurasi.
- Jalankan `npm run build` dan `npm run lint` sampai bersih. Bandingkan ukuran First Load JS sebelum dan sesudah, lalu laporkan.
- Hapus `/ui-preview` jika tidak diperlukan, hapus primitive lama yang tidak terpakai, dan perbarui README bagian UI.
- Laporan akhir berisi:
  - daftar perubahan per halaman;
  - screenshot before/after;
  - komponen VengeanceUI yang dipakai dan di mana;
  - versi library;
  - entri baru di `DECISIONS.md`.

## Definisi selesai

- [ ] Semua alur fungsional lama masih jalan, diuji manual di `/chat` dan `/console` dengan backend aktif.
- [ ] Build dan lint bersih, tanpa error atau warning hydration di console browser.
- [ ] Satu sistem token dipakai di seluruh UI. Tidak ada warna hex liar di komponen.
- [ ] Responsif di 360px sampai 1920px, aksesibel lewat keyboard, dan reduced motion dihormati.
- [ ] Tidak ada angka bisnis karangan, dan data demo tetap berlabel demo.
- [ ] Komponen siap dipakai ulang untuk Inbox dan Dashboard di Fase 5.
- [ ] `DECISIONS.md` dan README diperbarui.

Mulai dari **Fase UI-0**, lalu berhenti dan laporkan sebelum lanjut.
