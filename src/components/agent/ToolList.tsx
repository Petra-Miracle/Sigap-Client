"use client";

import { useEffect, useMemo, useState } from "react";
import { Wrench } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/format";
import { Tooltip } from "@/components/ui";
import type { AgentStep, ToolInfo } from "@/types";

/** Daftar tool agen (dari backend) + berapa kali dipakai di percakapan ini; tool terakhir disorot. */
export function ToolList({ steps }: { steps: AgentStep[] }) {
  const [tools, setTools] = useState<ToolInfo[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .getTools()
      .then((r) => setTools(r.tools))
      .catch(() => setError(true));
  }, []);

  const { counts, lastTool } = useMemo(() => {
    const counts = new Map<string, number>();
    let lastTool: string | null = null;
    for (const s of steps) {
      if (s.type !== "TOOL_CALL") continue;
      counts.set(s.title, (counts.get(s.title) ?? 0) + 1);
      lastTool = s.title;
    }
    return { counts, lastTool };
  }, [steps]);

  if (error) return <p className="px-4 py-3 text-sm text-danger">Daftar tool gagal dimuat.</p>;
  if (!tools) return <p className="px-4 py-3 text-sm text-ink-2">Memuat tool…</p>;

  return (
    <ul className="space-y-1.5 px-4 py-3">
      {tools.map((t) => {
        const n = counts.get(t.name) ?? 0;
        const isLast = t.name === lastTool;
        return (
          <li
            key={t.name}
            className={cn(
              "rounded-control border px-3 py-2",
              isLast ? "border-accent bg-accent-soft" : "border-line bg-surface",
            )}
          >
            <Tooltip content={t.description} placement="top">
              <div className="flex items-center gap-2">
                <Wrench aria-hidden className={cn("size-3.5", n ? "text-accent" : "text-ink-2")} />
                <code className="font-mono text-xs font-medium text-ink">{t.name}</code>
                {n ? <span className="ml-auto font-mono text-[11px] text-accent-strong">{n}×</span> : null}
              </div>
            </Tooltip>
            <p className="mt-1 line-clamp-2 text-xs text-ink-2">{t.description}</p>
          </li>
        );
      })}
    </ul>
  );
}
