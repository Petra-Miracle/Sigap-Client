import { redirect } from "next/navigation";

/** `/` → Konsol Agen (mode demo juri). */
export default function Home() {
  redirect("/console");
}
