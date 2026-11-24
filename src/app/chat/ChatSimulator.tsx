"use client";

import Link from "next/link";
import { MonitorDot } from "lucide-react";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { RealtimeIndicator } from "@/components/layout/RealtimeIndicator";
import { Alert } from "@/components/ui/Alert";
import { useActiveSession } from "@/hooks/useActiveSession";
import { useConversation } from "@/hooks/useConversation";

/** Layar penuh di HP; bingkai HP di tengah layar pada desktop. */
export function ChatSimulator() {
  const session = useActiveSession({ autoCreate: true });
  const conv = useConversation(session.conversationId);

  return (
    <main className="flex h-dvh flex-col items-center sm:justify-center sm:gap-3 sm:py-6">
      <div className="hidden w-full max-w-[400px] items-center justify-between px-1 sm:flex">
        <RealtimeIndicator />
        <Link
          href="/console"
          target="_blank"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-control px-2 text-sm font-medium text-accent hover:bg-accent-soft"
        >
          <MonitorDot aria-hidden className="size-4" /> Buka Konsol Agen
        </Link>
      </div>
      {session.error ? (
        <Alert className="m-3 w-full max-w-[400px]">{session.error}</Alert>
      ) : null}
      <ChatPanel
        conv={conv}
        onNewSession={() => void session.createNew()}
        creating={session.creating}
        className="h-full w-full max-w-[400px] flex-1 rounded-none border-0 sm:h-[760px] sm:max-h-[calc(100dvh-5rem)] sm:flex-none sm:rounded-[24px] sm:border"
      />
    </main>
  );
}
