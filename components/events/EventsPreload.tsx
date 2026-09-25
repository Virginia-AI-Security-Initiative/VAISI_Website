"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EventsPreload() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const warm = async () => {
      try {
        const response = await fetch("/api/events/warm", { cache: "no-store" });
        if (response.ok && !cancelled) router.prefetch("/events");
      } catch {
        // This is optional background work; navigation will fetch events normally.
      }
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => { void warm(); }, { timeout: 3000 });
      return () => { cancelled = true; window.cancelIdleCallback(idleId); };
    }

    const timeoutId = setTimeout(() => { void warm(); }, 1000);
    return () => { cancelled = true; clearTimeout(timeoutId); };
  }, [router]);

  return null;
}
