# Sigap Client

Web frontend for **Sigap**, an AI sales agent that works over chat (Martech Hackathon 2026).
Built with Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + `pusher-js`. The backend lives in a separate project: `D:\Sigap-Backend`.

## Local setup (≤ 10 steps)

1. Make sure the backend is running (`cd D:\Sigap-Backend && npm run dev` → http://localhost:4000).
2. `npm install`
3. Copy `.env.example` → `.env.local` (the defaults already point to the local backend).
4. `npm run dev` → http://localhost:3000 (redirects to `/console`).
5. Open `/chat` in a second tab: both tabs share the same conversation.

## Pages

| Route | Contents |
|---|---|
| `/` | Redirects to `/console` |
| `/chat` | Customer chat simulator (phone layout): AI-labelled bubbles, location/package/slot/order cards, quick replies, "AI sedang mengetik", **Kirim lokasi** button (device GPS or a demo point) |
| `/console` | **Agent Console (judge demo mode)**: left = chat simulator, centre = live agent trace (NIAT/RENCANA/TOOL/HASIL/GUARDRAIL/BALAS/HANDOFF badges, function names in monospace, "Detail teknis" toggle), right = customer context + funnel + list of tools |

The `/inbox` and `/dashboard` pages are added in Phase 5.

## Demo tips

- **Scenario 6 (realtime):** open `/chat` and `/console` side by side, then send a message from `/chat` → the trace appears in `/console` without a refresh.
- **Following another device (Flutter/WhatsApp):** turn on **"Ikuti percakapan terbaru"** in the Console, or pick it from the conversation dropdown. The URL `/console?c=<conversationId>` opens a specific conversation.
- **Kirim lokasi → Lokasi demo** provides a point inside coverage (Kebayoran) and one outside coverage (Bogor), so the demo doesn't depend on GPS.
- The top-right dot shows the Pusher connection status. If realtime is off, the page still works and the trace updates after each reply.

## Environment variables

| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend URL, with no trailing slash |
| `NEXT_PUBLIC_PUSHER_KEY` / `NEXT_PUBLIC_PUSHER_CLUSTER` | Optional. If empty, they are fetched automatically from the backend (`GET /api/realtime/config`) |

On Vercel: create a separate project from this repo, set `NEXT_PUBLIC_API_URL` = the backend URL, and add the frontend URL to the backend's `CLIENT_ORIGIN` (CORS).

## Structure

```
src/
  app/chat/                    # customer simulator
  app/(dashboard)/console/     # Agent Console
  components/chat/             # ChatPanel, ChatBubble, cards, QuickReplies, ChatInput
  components/agent/            # TraceList, TraceStep, CustomerContext, ToolList
  components/ui/               # Primitive HeroUI: Button, Badge/Chip, Card, Toggle, Alert, EmptyState, Skeleton, Tooltip, Tabs, Avatar, Toast (+ VengeanceUI morph-text)
  components/landing/           # Hero landing (VengeanceUI)
  hooks/                       # useConversation, useActiveSession, useInbox, useRealtimeState
  lib/                         # api.ts (fetch wrapper), pusher.ts (singleton), session.ts, format.ts, demo.ts
  types/                       # types shared with the backend
```

## UI (Fase UI-0..UI-5)

Design system dibangun di atas **HeroUI v3.2.8** (`@heroui/react` + `@heroui/styles`) dengan aksen **VengeanceUI** (registry shadcn, komponen disalin ke `src/components/ui/`, mis. `morph-text`). Token warna/radius/font satu sumber di `src/app/globals.css`. Primitive lengkap ada di `src/components/ui/*` + barrel `index.ts`. Provider klien di `src/app/providers.tsx` (`I18nProvider`, `Toast.Provider`). Halaman: `/` landing, `/chat` simulator, `/console` (mobile: tabs). Aksesibilitas: `:focus-visible`, target sentuh ≥44px, ARIA labels, `prefers-reduced-motion`. Verifikasi: `npm run lint` dan `npm run build` harus bersih.

Package prices and names come from the backend (seed demo data) and are labelled as demo in the UI.
