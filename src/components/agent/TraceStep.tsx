import { Badge, type Tone } from "@/components/ui/Badge";
import { formatTimeSeconds, STEP_LABEL } from "@/lib/format";
import type { AgentStep } from "@/types";

type D = Record<string, unknown>;

/** Warna badge per jenis langkah; hasil/guardrail bergantung pada lolos/gagal. */
function toneOf(step: AgentStep): Tone {
  const d = (step.detail ?? {}) as D;
  switch (step.type) {
    case "PLAN":
    case "TOOL_CALL":
      return "accent";
    case "TOOL_RESULT":
      return d.ok === false ? "danger" : "success";
    case "GUARDRAIL":
      return d.passed === false ? "warning" : "success";
    case "REPLY":
      return "success";
    case "HANDOFF":
      return "warning";
    case "ERROR":
      return "danger";
    default:
      return "neutral";
  }
}

/** Format argumen tool ringkas: `lat: -6.2425, lng: 106.8003`. */
function formatArgs(args: unknown): string {
  if (!args || typeof args !== "object") return "";
  return Object.entries(args as D)
    .map(([k, v]) => `${k}: ${typeof v === "string" ? `"${v}"` : JSON.stringify(v)}`)
    .join(", ");
}

/** Ringkasan satu baris yang mudah dibaca juri, diturunkan dari `detail`. */
function summaryOf(step: AgentStep): string | null {
  const d = (step.detail ?? {}) as D;
  switch (step.type) {
    case "INTENT":
      return typeof d.text === "string" ? `“${d.text}”` : null;
    case "PLAN": {
      const tokens = d.tokens as { promptTokens?: number; completionTokens?: number } | undefined;
      const parts = [typeof d.thought === "string" ? d.thought : null, tokens ? `${(tokens.promptTokens ?? 0) + (tokens.completionTokens ?? 0)} token` : null];
      return parts.filter(Boolean).join(" · ") || null;
    }
    case "TOOL_RESULT":
      if (d.ok === false) return `Gagal: ${String(d.error ?? "tidak diketahui")}`;
      return resultSummary(d.result);
    case "GUARDRAIL": {
      const where = d.stage === "input" ? "pesan masuk" : "balasan";
      if (d.passed === false) {
        const v = Array.isArray(d.violations) && d.violations.length ? d.violations.join("; ") : String(d.rule ?? "");
        return `Cek ${where}: ${v}`;
      }
      return `Cek ${where}: harga, paket, data sensitif, janji diskon aman`;
    }
    case "REPLY":
      return typeof d.content === "string" ? d.content : null;
    case "HANDOFF":
      return typeof d.ringkasan === "string" ? d.ringkasan : null;
    case "ERROR":
      return typeof d.message === "string" ? d.message : typeof d.missing === "string" ? `Env belum diisi: ${d.missing}` : null;
    default:
      return null;
  }
}

/** Ambil inti hasil tool (covered, jumlah paket/slot, orderId) tanpa menampilkan JSON. */
function resultSummary(result: unknown): string | null {
  if (!result || typeof result !== "object") return null;
  const r = result as D;
  if ("covered" in r) return r.covered ? `Terjangkau${r.areaName ? ` · ${String(r.areaName)}` : ""}` : "Belum terjangkau";
  if (Array.isArray(r.rekomendasi)) return `${r.rekomendasi.length} paket dari data demo`;
  if (Array.isArray(r.slots)) return `${r.slots.length} slot tersedia`;
  if (typeof r.orderId === "string") return `Order ${r.orderId.slice(-8).toUpperCase()} dibuat`;
  if (r.ditemukan === false) return "Tidak ada di FAQ";
  if (Array.isArray(r.hasil)) return `${r.hasil.length} jawaban FAQ`;
  if (typeof r.status === "string") return `Status: ${r.status}`;
  return null;
}

/** Satu langkah jejak agen. `technical` menampilkan argumen + JSON detail mentah. */
export function TraceStep({ step, technical }: { step: AgentStep; technical: boolean }) {
  const d = (step.detail ?? {}) as D;
  const isTool = step.type === "TOOL_CALL" || step.type === "TOOL_RESULT";
  const summary = summaryOf(step);
  return (
    <li className="relative pl-6">
      <span aria-hidden className="absolute top-2 left-[7px] size-2 rounded-full bg-line ring-4 ring-surface" />
      <div className="rounded-control border border-line bg-surface px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={toneOf(step)}>{STEP_LABEL[step.type]}</Badge>
          {isTool ? (
            <code className="font-mono text-[13px] font-medium text-ink">
              {step.title}
              {step.type === "TOOL_CALL" ? "(…)" : ""}
            </code>
          ) : (
            <span className="text-sm font-medium text-ink">{step.title}</span>
          )}
          {d.source === "guardrail" ? <Badge tone="warning">dipicu guardrail</Badge> : null}
          <span className="ml-auto flex items-center gap-2 font-mono text-[11px] text-ink-2">
            {step.durationMs != null ? <span>{step.durationMs} ms</span> : null}
            <time dateTime={step.createdAt}>{formatTimeSeconds(step.createdAt)}</time>
          </span>
        </div>
        {step.type === "TOOL_CALL" && d.args ? (
          <p className="mt-1 break-words font-mono text-xs text-ink-2">{formatArgs(d.args)}</p>
        ) : null}
        {summary ? <p className="mt-1 line-clamp-3 text-xs text-ink-2">{summary}</p> : null}
        {technical && step.detail ? (
          <pre className="mt-2 max-h-56 overflow-auto rounded-control bg-canvas p-2 font-mono text-[11px] leading-relaxed text-ink">
            {JSON.stringify(step.detail, null, 2)}
          </pre>
        ) : null}
        {step.truncated ? <p className="mt-1 text-[11px] text-ink-2">Detail besar, dimuat ulang dari server…</p> : null}
      </div>
    </li>
  );
}
