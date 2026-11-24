import type { Metadata } from "next";
import { AgentConsole } from "./AgentConsole";

export const metadata: Metadata = { title: "Konsol Agen" };

/** /console — Konsol Agen (mode demo juri): chat, jejak agen realtime, konteks pelanggan + tools. */
export default function ConsolePage() {
  return <AgentConsole />;
}
