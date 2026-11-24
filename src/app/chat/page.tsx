import type { Metadata } from "next";
import { ChatSimulator } from "./ChatSimulator";

export const metadata: Metadata = { title: "Simulator chat" };

/** /chat — simulator chat pelanggan (tampilan HP). */
export default function ChatPage() {
  return <ChatSimulator />;
}
