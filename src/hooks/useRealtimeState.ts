"use client";

/** Status koneksi Pusher untuk indikator kecil di header (tersambung / menyambung / terputus / nonaktif). */
import { useEffect, useState } from "react";
import { getPusher, toRealtimeState, type RealtimeState } from "@/lib/pusher";

export function useRealtimeState(): RealtimeState {
  const [state, setState] = useState<RealtimeState>("connecting");
  useEffect(() => {
    let off = () => {};
    let cancelled = false;
    void getPusher().then((pusher) => {
      if (cancelled) return;
      if (!pusher) return setState("disabled");
      setState(toRealtimeState(pusher.connection.state));
      const onChange = ({ current }: { current: string }) => setState(toRealtimeState(current));
      pusher.connection.bind("state_change", onChange);
      off = () => pusher.connection.unbind("state_change", onChange);
    });
    return () => {
      cancelled = true;
      off();
    };
  }, []);
  return state;
}
