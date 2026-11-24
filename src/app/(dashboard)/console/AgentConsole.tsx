"use client";

import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { CustomerContext } from "@/components/agent/CustomerContext";
import { ToolList } from "@/components/agent/ToolList";
import { TraceList } from "@/components/agent/TraceList";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, Tabs } from "@/components/ui";
import { Toggle } from "@/components/ui/Toggle";
import { useActiveSession } from "@/hooks/useActiveSession";
import { useConversation } from "@/hooks/useConversation";
import { useInbox } from "@/hooks/useInbox";
import { useRealtimeState } from "@/hooks/useRealtimeState";
import { STATUS_LABEL } from "@/lib/format";

/**
 * Konsol Agen: kiri simulator chat, tengah jejak kerja agen realtime, kanan konteks + tools.
 * Percakapan aktif sama dengan tab /chat (localStorage). "Ikuti percakapan terbaru"
 * otomatis pindah ke percakapan yang baru bergerak, mis. dari aplikasi Flutter.
 */
export function AgentConsole() {
  const session = useActiveSession({ autoCreate: true });
  const conv = useConversation(session.conversationId);
  const [technical, setTechnical] = useState(false);
  const [follow, setFollow] = useState(false);
  const realtimeState = useRealtimeState();

  const { select, conversationId } = session;
  const onInboxUpdate = useCallback(
    (id: string) => {
      if (follow && id !== conversationId) select(id);
    },
    [follow, conversationId, select],
  );
  const inbox = useInbox(undefined, onInboxUpdate);

  const options = inbox.items.some((c) => c.id === conversationId) || !conversationId
    ? inbox.items
    : [{ id: conversationId, label: "Percakapan aktif" }, ...inbox.items];

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-3 p-3 xl:h-[calc(100dvh-61px)] xl:p-4">
      {/* Bilah kontrol */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <label htmlFor="conversation-picker" className="shrink-0 text-sm font-medium text-ink">
            Percakapan
          </label>
          <select
            id="conversation-picker"
            value={conversationId ?? ""}
            onChange={(e) => e.target.value && select(e.target.value)}
            className="min-h-11 w-full max-w-md min-w-0 rounded-control border border-line bg-surface px-3 text-sm"
          >
            {!conversationId ? <option value="">Memuat…</option> : null}
            {options.map((c) =>
              "label" in c ? (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ) : (
                <option key={c.id} value={c.id}>
                  {(c.customer.name ?? "Pelanggan") +
                    ` · ${c.customer.channel === "whatsapp" ? "WA" : "Web"} · ${STATUS_LABEL[c.status]}` +
                    (c.lastMessage ? ` · ${c.lastMessage.content.slice(0, 40)}` : "")}
                </option>
              ),
            )}
          </select>
        </div>
        <Toggle checked={follow} onChange={setFollow} label="Ikuti percakapan terbaru" />
        <Toggle checked={technical} onChange={setTechnical} label="Detail teknis" />
        <Button variant="secondary" onClick={() => void session.createNew()} disabled={session.creating}>
          <Plus aria-hidden className="size-4" /> Percakapan baru
        </Button>
      </div>

      {session.error ? <Alert>{session.error}</Alert> : null}
      {inbox.error ? <Alert tone="warning">{inbox.error}</Alert> : null}
      {realtimeState === "disabled" ? (
        <Alert tone="warning">
          Realtime nonaktif: jejak diperbarui setelah setiap balasan. Isi env Pusher di backend untuk melihat langkah agen
          secara langsung.
        </Alert>
      ) : null}

      {/* Mobile: tab agar 3 kolom tidak menumpuk panjang. */}
      <div className="md:hidden">
        <Tabs>
          <Tabs.ListContainer>
            <Tabs.List aria-label="Konsol agen">
              <Tabs.Tab id="chat">Chat</Tabs.Tab>
              <Tabs.Tab id="trace">Jejak</Tabs.Tab>
              <Tabs.Tab id="context">Konteks</Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
          <Tabs.Panel id="chat" className="mt-3">
            <ChatPanel
              conv={conv}
              onNewSession={() => void session.createNew()}
              creating={session.creating}
              className="h-[640px]"
            />
          </Tabs.Panel>
          <Tabs.Panel id="trace" className="mt-3">
            <Card className="flex h-[640px] min-h-0 flex-col">
              <CardHeader
                title="Jejak kerja agen"
                subtitle="Niat → rencana → tool → hasil → guardrail → balasan, langsung dari backend"
              />
              <TraceList steps={conv.steps} messages={conv.messages} technical={technical} thinking={conv.typing} />
            </Card>
          </Tabs.Panel>
          <Tabs.Panel id="context" className="mt-3 space-y-3">
            <Card>
              <CardHeader title="Konteks pelanggan" />
              <CustomerContext detail={conv.detail} status={conv.status} handoffReason={conv.handoffReason} />
            </Card>
            <Card>
              <CardHeader title="Tools agen" subtitle="Function calling; jumlah = dipakai di percakapan ini" />
              <ToolList steps={conv.steps} />
            </Card>
          </Tabs.Panel>
        </Tabs>
      </div>

      <div className="hidden min-h-0 flex-1 gap-3 md:grid md:grid-cols-[minmax(300px,360px)_minmax(0,1fr)] xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)_minmax(280px,340px)]">
        <ChatPanel
          conv={conv}
          onNewSession={() => void session.createNew()}
          creating={session.creating}
          className="h-[640px] xl:h-auto"
        />

        <Card className="flex h-[640px] min-h-0 flex-col xl:h-auto">
          <CardHeader
            title="Jejak kerja agen"
            subtitle="Niat → rencana → tool → hasil → guardrail → balasan, langsung dari backend"
          />
          <TraceList steps={conv.steps} messages={conv.messages} technical={technical} thinking={conv.typing} />
        </Card>

        <div className="flex min-h-0 flex-col gap-3 md:col-span-2 md:grid md:grid-cols-2 md:items-start xl:col-span-1 xl:flex xl:overflow-y-auto">
          <Card>
            <CardHeader title="Konteks pelanggan" />
            <CustomerContext detail={conv.detail} status={conv.status} handoffReason={conv.handoffReason} />
          </Card>
          <Card>
            <CardHeader title="Tools agen" subtitle="Function calling; jumlah = dipakai di percakapan ini" />
            <ToolList steps={conv.steps} />
          </Card>
        </div>
      </div>
    </main>
  );
}
