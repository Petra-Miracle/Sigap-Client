# Decisions (frontend)

Ambiguous choices are resolved with the simplest option that still works. Backend decisions live in `D:\Sigap-Backend\DECISIONS.md`.

## Phase 4

1. **Next.js 16 + Tailwind 4 from `create-next-app`** (Turbopack, `cacheComponents` on by default). The pages are static shells; all data is fetched on the client because it depends on the active conversation and Pusher.
2. **The active conversation is stored in `localStorage`** (`sigap:conversationId`) and synced across tabs through the `storage` event. That makes `/chat` and `/console` in two tabs automatically show the same conversation (scenario 6) without a login. `?c=<id>` in the URL takes priority.
3. **The Console's left column is the chat simulator itself**, not just a list of conversations. The spec suggests showing chat and trace side by side on one screen; the conversation list is a dropdown in the control bar.
4. **"Ikuti percakapan terbaru"** subscribes to the `inbox` channel and switches to whichever conversation just moved, so chats from Flutter/WhatsApp can be followed in the Console (scenario 7). Off by default, so the screen doesn't jump around during the demo.
5. **The backend gets `GET /api/conversations`** (list + last message) early, in Phase 4, because the Console picker needs it; Phase 5 reuses it for the inbox.
6. **The Pusher key is fetched from the backend** when `NEXT_PUBLIC_PUSHER_KEY` is empty, so the key is configured in one place. If realtime is unavailable, the UI keeps working: the trace and context are refreshed after every message is sent.
7. **Optimistic customer messages**: they appear immediately (faded, "Mengirim…"), then are replaced by the server version (via the HTTP response or `message:new`, deduplicated by id/content). On failure, the message is removed and an error appears with a "Coba lagi" button.
8. **The customer context refreshes after events** (`TOOL_RESULT`, `REPLY`, `HANDOFF`, `conversation:status`, 400 ms debounce) by re-fetching the conversation detail, instead of rebuilding the profile on the client.
9. **The trace is grouped per turn** (each `INTENT` starts a new turn) and labelled with the customer message that triggered it, so judges can easily follow cause and effect.
10. **The Pencil mockup (`Pendev/Sigap-Mockup.pen`) could not be read** because the Pencil app wasn't running; the UI follows the design tokens in section 5.3 of the spec. Visuals can be matched to the mockup once the Pencil app is open.
11. **Light theme only**, following the spec's tokens (canvas #F4F6F8, accent #0B6E8A). `suppressHydrationWarning` on `<html>` because browser extensions add attributes there.

## Phase UI-0 (upgrade)

12. **HeroUI v3.2.8** dipasang (`@heroui/react` + `@heroui/styles`) karena satu-satunya versi yang mendukung React 19, Next.js 16 App Router dan Tailwind 4; v3 tidak butuh `HeroUIProvider`, jadi provider cukup `I18nProvider` di `src/app/providers.tsx` (locale `id-ID`). Style diimpor via `@import "@heroui/styles"` di `globals.css` setelah Tailwind (urutan wajib). Token warna yang ada tetap jadi sumber kebenaran; pemetaan ke tema HeroUI dilakukan di UI-1.
13. **VengeanceUI disiapkan sebagai tooling**, bukan paket: `components.json` (shadcn) dengan alias ke `@/lib/utils`, plus `src/lib/utils.ts` (`cn` = clsx + tailwind-merge) dan dependensi `motion`, `clsx`, `tailwind-merge`. Komponen VengeanceUI ditambahkan per kebutuhan lewat `npx shadcn add @vengeanceui/...` (UI-2/UI-4), bukan sekarang, agar bundle tidak membengkak.
14. **`src/lib/format.ts` tetap memakai `cn` sederhana** (filter Boolean) untuk kompatibilitas kode lama; VengeanceUI memakai `src/lib/utils.ts`. Dua `cn` sengaja dipisah untuk tidak merusak perilaku kelas lama.

## Phase UI-1 (design system)

15. **Primitive ditulis ulang di atas HeroUI v3** (`Button`, `Badge`→Chip, `Card`, `Toggle`→Switch, `Alert`, `EmptyState`) dengan props lama dipertahankan agar pemanggil tidak berubah; `Skeleton`, `Tooltip`, `Tabs`, `Avatar`, `Toast` ditambahkan. `Toast.Provider` dipasang di `src/app/providers.tsx`.
16. **Token dipetakan ke variabel HeroUI** (`--background`, `--foreground`, `--surface`, `--accent`, `--success`, `--warning`, `--danger`, `--border`, `--radius`) di `:root` dengan nilai hex token Sigap; `--radius` = 8 px (radius kontrol). Tailwind tetap memakai token lama via `@theme`.
17. **Skala tipografi** (`text-display`/`h1`/`h2`/`h3`/`body`/`caption`/`mono`) ditambahkan di `@theme`; spacing memakai skala default Tailwind 4.
18. **`/ui-preview`** ditambahkan (di bawah dashboard layout) untuk review semua primitive & varian.

## Phase UI-2 (simulator chat)

19. **Bubble memakai avatar HeroUI** (AI/CS) + animasi masuk via `motion` (opacity + y, 180 ms, easeOut). QuickReplies scroll horizontal di mobile (`overflow-x-auto`) dan wrap di desktop.
20. **Empty state** ditambahkan di ChatPanel saat belum ada pesan (sapaan + contoh pertanyaan kualitatif).
21. **Kartu** (Package/Slot) mendapat hover (border + shadow/translate) hanya via CSS; VengeanceUI tilt berat tidak dipakai agar bundle tetap kecil.

## Phase UI-3 (console agen)

22. **TraceStep** menampilkan ikon per jenis langkah + highlight langkah terbaru (ring accent); jejak tetap timeline vertikal.
23. **Mobile console** memakai Tabs HeroUI (Chat/Jejak/Konteks) agar 3 kolom tidak menumpuk; desktop tetap grid 3 kolom.
24. **RealtimeIndicator** dibungkus Tooltip (penjelasan status); dot ber-pulse saat menyambung.
25. **ToolList** memakai Tooltip untuk deskripsi tool (Switch tidak ditambahkan karena tidak ada toggle backend; menghindari kontrol palsu).
26. **AppNav** state aktif diperjelas (bg accent + shadow) dan logo sedikit lebih menonjol.

## Phase UI-4 (landing)

27. **`/` bukan lagi redirect**; menjadi landing dengan hero (MorphText VengeanceUI, lazy-loaded via next/dynamic), dua CTA, "Cara kerja" (4 langkah) dan "Fitur" (klaim kualitatif saja).
28. **VengeanceUI dipakai** melalui registry shadcn: `morph-text` (hero) dan `aurora-hero` (tersedia, belum dipakai). Komponen berat di-load dinamis (`ssr: false`).
29. **Reduced motion**: hero menampilkan judul statis jika `prefers-reduced-motion: reduce`; animasi CSS VengeanceUI juga tunduk pada aturan global.

## Phase UI-5 (QA & polish)

30. **`/ui-preview` dihapus** setelah review; `aurora-hero` yang tidak terpakai dihapus. `morph-text` tetap (dipakai hero).
31. **Loading state** memakai Skeleton di ChatPanel dan CustomerContext (mengganti spinner teks).
32. **README** diperbarui (bagian UI/struktur).
33. **Verifikasi akhir**: `npm run lint` dan `npm run build` bersih; 6 static pages (`/`, `/chat`, `/console`, `/_not-found` + ...). Halaman responsif via Tailwind (mobile tabs, scroll horizontal quick replies); tidak ada horizontal scroll yang disengaja.
