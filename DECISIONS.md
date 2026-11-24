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
